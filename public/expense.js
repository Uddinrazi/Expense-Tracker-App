

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

    showDetailOnScreen(response.data.newDetails); //why the function of this written after bracket
  } catch (err) {
    console.log(err);
    document.body.innerHTML =
      document.body.innerHTML + "<h3> Some thing went wrong </h3>";
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const page = 1;
    const token = localStorage.getItem("token");
    if (token == null) {
      location = "http://localhost:5000/login.html";
    }

    const decodeToken = parseJwt(token);

    if (decodeToken.isPremium) {
      showPremiumUserMessage();
      showLeaderBoard();
    }
    let response = await axios.get(
      "http://localhost:5000/expense/expense-data?page=1&limit=5", //how to pass query in params
      { headers: { Authorization: token } }
    );

    for (let i = 0; i < response.data.length; i++) {
      showDetailOnScreen(response.data.expenses);
      console.log(response.data.expenses,'..............')
    }
    showPagination(response.data)
    
  } catch (err) {
    console.log(err);
  }
});

function showDetailOnScreen(obj1) {
  //console.log(response)
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
    deleteXpense(e.target.id);
    parentEle.removeChild(childele);
  };

  async function deleteXpense(expenseid) {
    try {
      const token = window.localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/expense/delete-expense/${expenseid}`,
        { headers: { Authorization: token } }
      );

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
  const isPremium = decodeToken.isPremium;

  let response = await axios.get(
    "http://localhost:5000/purchase/premium-membership",
    { headers: { Authorization: token } }
  );

  const options = {
    key: response.data.key_id,
    order_id: response.data.order.id,

    prefill: {
      name: "Test User",
      email: "test.user@example.com",
      contact: "9702032235",
    },

    // This handler function will handle the success payment
    handler: async function (result) {
      let response = await axios.post(
        "http://localhost:5000/purchase/update-transaction-status",
        {
          order_id: options.order_id,
          payment_id: result.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      alert("You ara a premium user");
      localStorage.setItem("isPremium", true);
      if (isPremium) {
        showPremiumUserMessage();
      }
      localStorage.setItem("token", response.data.token);
      showLeaderBoard();
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    alert(response.error.code);
    alert(response.error.description);
    // alert(response.error.source);
    // alert(response.error.step);
    // alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
    console.log(response);
    alert("Some thing went wrong");
  });

  rzp1.open();
  e.preventDefault();
};

function showLeaderBoard() {
  try {
    const p = document.getElementById("message");
    var sbtn = document.createElement("input");
    sbtn.type = "button";
    sbtn.value = "Show Leader Board";
    sbtn.id = "showboard";

    p.appendChild(sbtn);

    document.getElementById("showboard").onclick = async () => {
      const token = localStorage.getItem("token");

      const userLeaderBoardArray = await axios.get(
        "http://localhost:5000/features/show-premium-features",
        { headers: { Authorization: token } }
      );

      const leaderboard = document.getElementById("lboard");
      leaderboard.innerHTML += "<h2>Leader Board</h2>";
      userLeaderBoardArray.data.forEach((userDetails) => {
        leaderboard.innerHTML += `<li>Name: ${userDetails.name}  -- Total Expense:  ${userDetails.total_cost}</li>`;
      });
    };
  } catch (err) {
    console.log(err);
  }
}

//download()
async function download() {
  try {
    const token = localStorage.getItem("token");
    
    let respons = await axios.get(
      "http://localhost:5000/dwnload/download-expense",
      { headers: { Authorization: token } }
    );
    
    if (respons.status === 200) {
      //the bcakend is essentially sending a download link
      //  which if we open in browser, the file would download
      console.log('line 228 working')
      let a = document.createElement("a");
      a.href = respons.data.fileUrl;
      const fileDownload = respons.data.fileUrl;
      a.click();
      a.download = "myexpense.csv";
      console.log(fileDownload)

      //let li = document.createElement(li)
      document.body.innerHTML += `<a href> ${fileDownload}</a>`
      
    } else {
      throw new Error(respons.data.message);
    }
  } catch (err) {
    console.log(err);
  }
}


function showPagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage
}) {
  console.log('line no 259')
  const pagination = document.querySelector('pagination')
  pagination.innerHTML = '';

  if(hasPreviousPage){
    const btn2 = document.createElement('button')
    btn2.innerHTML = previousPage;
    btn2.addEventListener('click', () => getExpenses(previousPage))
    pagination.appendChild(btn2)
  }

  const btn1 = document.createElement('button')
  btn1.innerHTML = `<h4>${currentPage}</h4>`
  btn1.addEventListener('click', () => getExpenses(currentPage))
  pagination.appendChild(btn1)

  if(hasNextPage){
    const btn3 = document.createElement('btn3')
    btn3.innerHTML = nextPage;
    btn3.addEventListener('click', () => getExpenses(nextPage))
    pagination.appendChild(btn3)
  }
}