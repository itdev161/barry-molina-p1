const username = document.getElementById('username');
const passwd = document.getElementById('passwd');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');

loginBtn.addEventListener("click", () => {
    console.log(username.value);
    console.log(passwd.value);
});