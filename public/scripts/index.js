
const registerUrl = 'http://localhost:8081/api/v1/auth/signup';
const loginUrl = 'http://localhost:8081/api/v1/auth/login';


const register = (event) => {
  event.preventDefault();
  document.getElementById('errors').innerHTML = '';

  const fullname = document.getElementById('fullname').value;
  const email = document.getElementById('email').value;
  const gender = document.getElementById('gender').value;
  const password = document.getElementById('password').value;
  const retypePassword = document.getElementById('retypePassword').value;

  if (password !== retypePassword) {
    document.getElementById('errors').innerHTML = '<li>Password mismatch. Please, re-enter the password</li>';
  }

  fetch(registerUrl, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullname, email, password, gender,
    }),
  })
    .then((response) => {
      if (response.status === 409) {
        document.getElementById('error').innerHTML = 'Email already exists';
      }
      return response.json();
    })
    .then((user) => {
      if (user.errors) {
        Object.keys(user.errors).forEach((key) => {
          const ul = document.getElementById('errors');
          const li = document.createElement('li');
          li.appendChild(document.createTextNode(user.errors[key]));
          ul.appendChild(li);
        });
      } else {
        localStorage.setItem('token', user.user.token);
        alert(`Congratulation to you, ${fullname}. You have successfully created your account. Enjoy your Diary on the go.....`);
      }
    }).catch(err => err.message);
};


const login = (event) => {
  event.preventDefault();
  document.getElementById('errors_login').innerHTML = '';

  const email = document.getElementById('emailL').value;
  const password = document.getElementById('passwordL').value;

  fetch(loginUrl, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email, password,
    }),
  })
    .then((response) => {
      if (response.status !== 200) {
        document.getElementById('errors_login').innerHTML = 'Username or password is incorrect';
      }
      return response.json();
    })
    .then((user) => {
      if (user.errors) {
        Object.keys(user.errors).forEach((key) => {
          const ul = document.getElementById('errors_login');
          const li = document.createElement('li');
          li.appendChild(document.createTextNode(user.errors[key]));
          ul.appendChild(li);
        });
      } else {
        localStorage.setItem('token', user.data.token);
        window.location = './landing-page.html';
      }
    }).catch(err => err.message);
};

document.getElementById('login').addEventListener('click', login);
document.getElementById('register').addEventListener('click', register);
