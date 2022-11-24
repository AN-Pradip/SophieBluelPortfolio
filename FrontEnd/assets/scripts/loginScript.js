const submitButton = document.getElementById("logInSubmitButton");
const apiUrl = "http://localhost:5678/api";

function getEMail() {
  let email = "";
  email = document.getElementById("eMail-Input").value;
  return email;
}
function getPassword() {
  let password = "";
  password = document.getElementById("password-Input").value;
  return password;
}

async function authRequest(emailInput, pswdInput) {
  let response;
  let responseJson;
  try {
    response = await fetch(apiUrl + "/users/login", {
      method: "post",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput,
        password: pswdInput,
      }),
    });
    if (response.status !== 200) {
      throw response;
    } else {
      responseJson = await response.json();
      window.sessionStorage.setItem("userData", JSON.stringify(responseJson));
      window.location = "./adminPage.html";
      return responseJson;
    }
  } catch (error) {
    if (error.status === 404) {
      alert("WRONG EMAIL");
    } else if (error.status === 401) {
      alert("WRONG PASSWORD");
    } else {
      alert("ERROR:", error.status);
    }
  }
}

submitButton.addEventListener("click", async function () {
  let eMailOutput = getEMail();
  let passwordOutput = getPassword();
  let request = await authRequest(eMailOutput, passwordOutput);
  console.log(request);
});
