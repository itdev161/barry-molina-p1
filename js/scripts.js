const username = document.getElementById('username');
const passwd = document.getElementById('passwd');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const server = 'http://localhost:3000/api/users'; 

loginBtn.addEventListener("click", () => {
    const creds = {
        name: username.value,
        password: passwd.value
    }
    fetch(server, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(creds),
    })
    .then(res => res.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(err => {
        console.error('Error:', error);
    })
});