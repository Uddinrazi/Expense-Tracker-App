const btn2 = document.getElementById('login_btn')

btn2.addEventListener('click', submit_Lform);

async function submit_Lform(e) {
    try{
        e.preventDefault();
        const email = document.getElementById('Lemail').value
        const password = document.getElementById('Lpwd').value;
        //console.log('print line 10')
        const login_details = {
             email, password
        }
        console.log(login_details)
        document.getElementById('login-form').reset();
        
        let response = await axios.post('http://localhost:5000/user/login-data', login_details)
       //console.log(response)
       localStorage.setItem('token',response.data.token)
       console.log(response.data.token, 'm token with res')
       alert('login Successfull')
        window.location = "http://localhost:5000/expense.html"
    }catch(err){
        console.log(err)
        
    }
}