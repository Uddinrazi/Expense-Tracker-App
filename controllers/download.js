const UserServices = require("../services/userservices");
const S3Services = require("../services/S3services");
const File = require('../models/files')




module.exports.downloadExpense = async(req, res, next) => {
    try {
        const expense = await UserServices.getExpenses(req)
        const stringfiedexpense = JSON.stringify(expense)
        const userId = req.user.id;
        const filename =`'Expense${userId}/${new Date()}.txt`
        const fileUrl = await S3Services.uploadToS3(stringfiedexpense, filename);
        await File.create({fileUrl, userId});
        //const dwnloadedFile = fileUrl
        res.status(200).json({fileUrl, success:true})
        //console.log(fileUrl, 'line 6 kkkkkkkk')
    }
    catch(err){
        console.log(err)
        res.status(500).json({fileUrl: '', success: false, err:err})
    }
}

/*module.exports.downloadFiles = async (req, res, next) => {
    console.log('line 29 hhhhhhhh')
    try{
        const {fileDownload} = req.body
        userId = req.user.id;
        
        
          res.status(201).json({ message: "file link saved" });
    }
    catch(err){
        console.log(err)
    }
   
} */

