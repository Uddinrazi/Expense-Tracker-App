//const Razorpay = require('razorpay');

async function xpenseManager(event) {
  try {
    event.preventDefault();

    const amt = document.getElementById("amount");
    const discreption = document.getElementById("disp");
    const option = document.getElementById("change");

    const obj1 = {
      amount: amt.value,
      description: discreption.value,
      category: option.value,
    };

    console.log(obj1);
    document.getElementById("my-form").reset();

    const token = window.localStorage.getItem("token");
    //const userId = req.body.id;
    let response = await axios.post(
      "http://localhost:5000/expense/add-expense",
      obj1,
      { headers: { Authorization: token } }
    );
    //console.log(response.data.newDetails)

    showDetailOnScreen(response.data.newDetails); //why the function of this written after bracket
  } catch (err) {
    console.log(err);
    document.body.innerHTML =
      document.body.innerHTML + "<h3> Some thing went wrong </h3>";
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    if (token == null) {
      location = "http://localhost:5000/login.html";
    }
    //console.log(token, 'm token in line 39 ec')
    const decodeToken = parseJwt(token);
    //console.log(decodeToken, "m decode");
    if (decodeToken.isPremium) {
      showPremiumUserMessage()
      showLeaderBoard();
      
    }
    let response = await axios.get(
      "http://localhost:5000/expense/expense-data",
      { headers: { Authorization: token } }
    );
    //console.log(token, 'm token in line 41 ec')
    for (let i = 0; i < response.data.totalXpense.length; i++) {
      showDetailOnScreen(response.data.totalXpense[i]);
      
    }
  } catch (err) {
    console.log(err);
  }
});

function showDetailOnScreen(obj1) {
  
  const parentEle = document.getElementById("details");
  const childele = document.createElement("li");
  
  childele.textContent =
    obj1.amount + "  " + obj1.description + "  " + obj1.category;

  parentEle.appendChild(childele);

  var dbtn = document.createElement("input");
  dbtn.type = "button";
  dbtn.value = "Delete";
  dbtn.id = obj1.id;

  dbtn.onclick = (e) => {
   //console.log(e.target.id)     
        //localStorage.removeItem(obj1.discreption);
        deleteXpense(e.target.id)
        parentEle.removeChild(childele); 
  }

async function deleteXpense(expenseid) {
  //console.log(expenseid,'m expense id line 71')
  try {
    const token = window.localStorage.getItem("token");
    await axios.delete(
      `http://localhost:5000/expense/delete-expense/${expenseid}`,
      { headers: { Authorization: token } }
    );
    //console.log(expenseid,'m expense id line 75')

    removeFromScreen(expenseid);
  } catch (err) {
    console.log(err);
  }
}

function removeFromScreen(expenseid) {
  const parentNode = document.getElementById("change");
  const childNodeDeleted = document.getElementById(expenseid);
  if (childNodeDeleted) {
    parentNode.removeChild(childNodeDeleted);
  }
}
   childele.appendChild(dbtn);


}

function showPremiumUserMessage() {
 
  document.getElementById("pbtn").style.visibility = "hidden";
  document.getElementById("message").innerHTML = "You are a premium user";
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

document.getElementById("pbtn").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const decodeToken = parseJwt(token);
  console.log(decodeToken);
  const isPremium = decodeToken.isPremium;

  

  let response = await axios.get(
    "http://localhost:5000/purchase/premium-membership",
    { headers: { 'Authorization': token } }
  );
  

  const options = {
    'key_id': response.data.key_id,
    'order_id': response.data.order.id,
    
    'handler': async function (result) {
      const response = await axios.post(
        'http://localhost:5000/purchase/update-transaction-status',
        {
          order_id: options.order_id,
          payment_id: result.razorpay_payment_id,
        },
        { headers: { 'Authorization': token } }
      );
      

      alert("You ara a premium user");
    
      localStorage.setItem('isPremium', true)
      if (isPremium) {
        showPremiumUserMessage();
      }
      localStorage.setItem("token", response.data.token);
      
      showLeaderBoard();
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    console.log(response);
    alert("Some thing went wrong");
  });
};

function showLeaderBoard() {
  try{
  const p = document.getElementById("message");
  var sbtn = document.createElement("input");
  sbtn.type = "button";
  sbtn.value = "Show Leader Board";
  sbtn.id = "showboard";

  p.appendChild(sbtn);

  document.getElementById("showboard").onclick = async () => {
    
    const token = localStorage.getItem("token");

    const userLeaderBoardArray = await axios.get('http://localhost:5000/features/show-premium-features', {headers: {'Authorization': token}})
    //console.log(userLeaderBoardArray, 'm line 211')
   

    const leaderboard = document.getElementById("lboard");
    leaderboard.innerHTML +=  '<h2>Leader Board</h2>';
    userLeaderBoardArray.data.forEach((userDetails) => {
      leaderboard.innerHTML += `<li>Name: ${userDetails.name}  -- Total Expense:  ${userDetails.total_cost}</li>`;
      console.log(userDetails,'line 218 details')
      console.log(leaderboard, 'line 221')
    });
    
  };
}catch(err){
  console.log(err)
}
}
