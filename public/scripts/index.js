
const url = 'http://localhost:8080/api/v1/auth/signup';

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

  fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullname, email, password, gender,
    }),
  })
    .then((response) => {
      if (response.status === 409) {
        document.getElementById('error_others').innerHTML = 'Email already exists';
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
        alert(`Congratulation to you, ${fullname}. You have successfully creates your account. Enjoy your Diary on the go.....`)
      }
    }).catch(err => err.message);
};

document.getElementById('register').addEventListener('click', register);
