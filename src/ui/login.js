const { remote } = require("electron");
const main = remote.require("./main");

const username = document.querySelector("#username");
const password = document.querySelector("#password");
const userform = document.querySelector("#userform");

userform.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    console.log("Finding User...");
    const result = await main.getUser(username.value);
    console.log(result)
    if(result[0]['user_password'] === password.value) {
        window.location.href = "home.html";
    } else {
      document.querySelector("#userconfirm").innerHTML = "User Not found!!"
      userform.reset();
      username.focus();
      // window.location.href = "login.html";
    }

  } catch (error) {
    console.log(error);
  }
});