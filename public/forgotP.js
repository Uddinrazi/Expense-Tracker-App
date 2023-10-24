const btn = document.getElementById('fpbtn');

btn.addEventListener('click', submit)

async function submit(e) {
    try{
        e.preventDefault()
        const email = document.getElementById('email').value;

        const userE = {
            email
        }
        
        document.getElementById('forgotP').reset();

        let response = await axios.post('http://localhost:5000/password/forgot-password',userE)
        if(response.status === 202){
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        }
        else {
            throw new Error('Some went wrong......')
        }
        console.log(response,'line 16 ressss')
    }
    catch(err) {
        console.log(err)
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    }
}