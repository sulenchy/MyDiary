// loads all entries of a user
const viewAllEntries = () => {
  return `<div> <h1>All entries for an authorised user</h1></div>`;
};

// view an entry
const viewEntry = () => {
  return `<div> <h1>An entry of an authorised user</h1></div>`;
};

const addNewEntry = () => {
  return `<div> <h1>Adds new diary entry</h1></div>`;
};

const editEntry = () => {
  return `<div> <h1>Modifies an entry</h1></div>`;
};

const deleteEntry = () => {
  return `<div> <h1>Delete an entry</h1></div>`;
};


const userProfile = () => {
  return `<div> <h1>Shows the profile of the user</h1></div>`;
}

const logout = () => {
  window.localStorage.removeItem('token');
  window.location = './index.html';
}

document.getElementById('logout').addEventListener('click', logout);
