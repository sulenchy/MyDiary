let token = '';
const entryUrl = 'http://localhost:8080/api/v1/entries';

// loads all entries of a user
const viewAllEntries = () => {
  return `<div> <h1>All entries for an authorised user</h1></div>`;
};

// view an entry
const viewEntry = () => {
  return `<div> <h1>An entry of an authorised user</h1></div>`;
};

const addNewEntry = (event) => {
  event.preventDefault();
  document.getElementById('add_new_error').innerHTML = '';

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  token = localStorage.getItem('token');

  fetch(entryUrl, {
    method: 'POST',
    mode: 'cors',
    headers: { 
      'Content-Type': 'application/json',
      Token: token,
     },
    body: JSON.stringify({
      title, content,
    }),
  })
    .then((response) => {
      if (response.status === 409) {
        document.getElementById('add_new_error').innerHTML = 'Email already exists';
      }
      return response.json();
    })
    .then((user) => {
      if (user.data.errors) {
        console.log(user.data.errors);
        Object.keys(user.data.errors).forEach((key) => {
          const ul = document.getElementById('add_new_error');
          const li = document.createElement('li');
          li.appendChild(document.createTextNode(user.data.errors[key]));
          ul.appendChild(li);
        });
      } else {
        alert(`An entry has been added successfully`);
      }
    }).catch(err => err.message);
};

const editEntry = () => {
  return `<div> <h1>Modifies an entry</h1></div>`;
};

const deleteEntry = () => {
  return `<div> <h1>Delete an entry</h1></div>`;
};

const showAddNewForm = () => {
  document.getElementById('modalBox').style.display = 'block';
};

const userProfile = () => {
  return `<div> <h1>Shows the profile of the user</h1></div>`;
}

const logout = () => {
  window.localStorage.removeItem('token');
  window.location = './index.html';
}

document.getElementById('logout').addEventListener('click', logout);
document.getElementById('add_new').addEventListener('click', showAddNewForm);


document.getElementById('file-submit').addEventListener('click', addNewEntry);
