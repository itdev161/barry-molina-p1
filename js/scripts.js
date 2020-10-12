const username = document.getElementById('username');
const passwd = document.getElementById('passwd');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const errorMsg = document.getElementById('errorMsg');
const serverURL = 'http://localhost:3000/api/users'; 

loginBtn.addEventListener("click", () => {
    const creds = {
        name: username.value,
        password: passwd.value
    }
    fetch(serverURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(creds),
    })
    .then(async res => {
        const data = await res.json();
        errorMsg.innerHTML = "";
        if (res.status === 422) {
            msg = ""
            data.errors.forEach(error => {
                msg += (error.msg + "<br>");
            });
            errorMsg.innerHTML = msg;
        }
        else {
            const user = {
                "id": data.id,
                "name": data.name
            }
            // console.log(user);
            // console.log(data.id);

            sessionStorage.setItem('currentUser', JSON.stringify(user));
            return window.location.assign('/listview.html');
        }
    })
    .catch(err => {
        console.error('Error:', err);
    })
});