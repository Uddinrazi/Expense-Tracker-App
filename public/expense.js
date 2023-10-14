//const Razorpay = require('razorpay');

async function xpenseManager(event){
    try{
    event.preventDefault();

    const amt = document.getElementById('amount')
    const discreption = document.getElementById('disp');
    const option = document.getElementById('change');

    const obj1 = {
        
        amount: amt.value, 
        description: discreption.value, 
        category: option.value 
    }
    
    console.log(obj1)
    
    const token = window.localStorage.getItem('token')
   // const userId = req.body.id;
    let response = await axios.post("http://localhost:5000/expense/add-expense",obj1,{headers: {'Authorization': token}})
    console.log(response.data.newDetails)

    //document.body.innerHTML = document.body.innerHTML + '<div>  </div>'
   
    showDetailOnScreen(response.data.newDetails);//why the function of this written after bracket
}
catch(err) {
    console.log(err)
    document.body.innerHTML = document.body.innerHTML + '<h3> Some thing went wrong </h3>'
}
}

window.addEventListener('DOMContentLoaded', async() => {
    try{
        const token = window.localStorage.getItem('token')
       
        let response = await axios.get("http://localhost:5000/expense/expense-data", {headers: {'Authorization': token}})
        
        for(let i=0; i< response.data.totalXpense.length; i++){
            showDetailOnScreen(response.data.totalXpense[i]) 
        }
    }
    catch(err){
        console.log(err)
    }
})

function showDetailOnScreen(obj1){
    console.log(obj1)
    const parentEle = document.getElementById('details');
    const childele = document.createElement('li');
    console.log(childele);
    childele.textContent = obj1.amount+ '  ' + obj1.description + '  '+ obj1.category;
    
    parentEle.appendChild(childele);

    var dbtn = document.createElement('input');
    dbtn.type ='button';
    dbtn.value ='Delete';
    dbtn.id = obj1.id;
    
    
  dbtn.onclick = (e) => {
   //console.log(e.target.id)     
        localStorage.removeItem(obj1.discreption);
        deleteXpense(e.target.id)
        parentEle.removeChild(childele);
        

    }
    async function deleteXpense(expenseid){
        console.log(expenseid,'m expense id line 71')
        try{
            const token = window.localStorage.getItem('token')
            await axios.delete(`http://localhost:5000/expense/delete-expense/${expenseid}`,{headers: {'Authorization': token}})
            console.log(expenseid,'m expense id line 75')

            removeFromScreen(expenseid)
        }
        catch(err){
            console.log(err)
        }
    }
    

    function removeFromScreen(expenseid){
    const parentNode = document.getElementById('change');
    const childNodeDeleted = document.getElementById(expenseid);
    if(childNodeDeleted){
      parentNode.removeChild(childNodeDeleted)
    }
    
  }
    childele.appendChild(dbtn);

    var ebtn = document.createElement('input');
    ebtn.type = 'button';
    ebtn.value = 'Edit';
    ebtn.id = 'edit1';

    ebtn.onclick = () => {
        localStorage.removeItem(obj1.discreption);
        document.getElementById('amount').value = obj1.amount;
        document.getElementById('disp').value = obj1.description;
        document.getElementById('change').value = obj1.categry;
        
    }
    childele.appendChild(ebtn);
}

function showPremiumUserMessage (){
    document.getElementById('rbtn').style.visibility= 'hidden';
    document.getElementById('message').innerHTML = 'You are a premium user';
}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

document.getElementById('pbtn').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const decodeToken = parseJwt(token)
    console.log(decodeToken)
    const isPremium = decodeToken.isPremium
    if(isPremium){
        showPremiumUserMessage();
    }
    let response = await axios.get("http://localhost:5000/purchase/premium-membership", 
    {headers: {'Authorization': token}})
    console.log(response)

    const options = {
        'key_id': response.data.key_id,
        'order_id': response.data.order_id,

        'handler' : async function(response){
            await axios.post('http://localhost:5000/purchase/update-transaction-status', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, {headers: {'Authorization' : token}})

            alert('You ara a premium user')
            document.getElementById('rbtn').style.visibility= 'hidden';
            document.getElementById('message').innerHTML = 'You are a premium user';
            localStorage.setItem('isAdmin', true)


        }
    }

    const rzp1 = new Razorpay(options)
    razp1.open();
    e.preventDefault()

    rzp1.on('payment.failed', function(response){
        console.log(response);
        alert('Some thing went wrong')
    })
}