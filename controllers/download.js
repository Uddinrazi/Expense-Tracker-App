const UserServices = require("../services/userservices");
const S3Services = require("../services/S3services");
const File = require('../models/files')




module.exports.downloadExpense = async(req, res, next) => {
    try {
        const expense = await UserServices.getExpenses(req)
        console.log(getExpenses, 'line 11')
        const stringfiedexpense = JSON.stringify(expense)
        const userId = req.user.id;
        const filename =`'Expense${userId}/${new Date()}.txt`
        const fileUrl = await S3Services.uploadToS3(stringfiedexpense, filename);
        await File.create({fileUrl, userId});
        //const dwnloadedFile = fileUrl
        res.status(200).json({fileUrl, success:true})
        
    }
    catch(err){
        console.log(err)
        res.status(500).json({fileUrl: '', success: false, err:err})
    }
}

