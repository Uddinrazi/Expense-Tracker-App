const btn = document.getElementById('btn')

btn.addEventListener('click', submit);

async function submit(e){
    console.log('line 6 print')
    try{
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value
        const password = document.getElementById('pwd').value;

        const users = {
            name, email, password
        }
        document.getElementById('signup-form').reset();
        console.log(users)
        let response = await axios.post('http://localhost:5000/user/user-data', users)
        console.log(response)
        console.log('line 20')
    }
    catch(err){
        console.log(err)
    }
}


