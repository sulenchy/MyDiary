// Declaration and initialization of global variable
let token = '';
const entryUrl = 'https://sulenchy-my-diary.herokuapp.com/api/v1/entries';
const userUrl = 'https://sulenchy-my-diary.herokuapp.com/api/v1/user';
const registerUrl = 'https://sulenchy-my-diary.herokuapp.com/api/v1/auth/signup';
const loginUrl = 'https://sulenchy-my-diary.herokuapp.com/api/v1/auth/login';
let deleteEntryUrl = '';
let updateEntryUrl = '';
let userDetails = {};
let entryListTotalPageNumber = 1;
let title = 'Entries in Days';
let selectedDate = '';
let entriesList = '';

let state = false;

// groups entry by date
const groupBy = (objectArray, property) => objectArray.reduce((acc, obj) => {
  const key = obj[property];
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(obj);
  return acc;
}, {});

// loads all entries of a user
const fetchViewAllEntries = () => {
  token = localStorage.getItem('token');
  fetch(entryUrl, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Token: token,
    },
  })
    .then(response => response.json())
    .then((entries) => {
      if (entries.entries) {
        const groupedEntries = groupBy(entries.entries, 'date');
        let userEntriesLength = 0;
        for (const key in groupedEntries) {
          if (groupedEntries.hasOwnProperty(key)) {
            const keyLength = groupedEntries[key].length;
            userEntriesLength += keyLength;
          }
        }
        localStorage.setItem('entries', JSON.stringify(groupedEntries));
        localStorage.setItem('entriesNumber', userEntriesLength);
      }
    }).catch(err => err.message);
};

// loads the details of the logged in user
const fetchUserDetails = () => {
  token = localStorage.getItem('token');
  fetch(userUrl, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Token: token,
    },
  })
    .then(response => response.json())
    .then((user) => {
      localStorage.setItem('userDetails', JSON.stringify(user));
    }).catch(err => err.message);
};
// uses fetch api to update the user details
const updateUserDetails = (passportUrl, fullname, email, gender, notification) => {
  fetch(userUrl, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Token: token,
    },
    body: JSON.stringify({
      fullname, email, gender, passportUrl, notification,
    }),
  })
    .then((response) => {
      if (response.status === 406) {
        document.getElementById('add_new_error').innerHTML = 'An error has occured';
      }
      return response.json();
    })
    .then((user) => {
      if (user.data.errors) {
        Object.keys(user.data.errors).forEach((key) => {
          const ul = document.getElementById('update-error');
          const li = document.createElement('li');
          li.appendChild(document.createTextNode(user.data.errors[key]));
          ul.appendChild(li);
        });
      } else {
        localStorage.setItem('userDetails', JSON.stringify(user));
        const ul = document.getElementById('update-error');
        const li = document.createElement('li');
        li.appendChild(document.createTextNode('An entry has been updated successfully'));
        ul.appendChild(li);
      }
    }).catch(err => err.message);
};

// gets list of entries from the localStorage
if (localStorage.getItem('entries')) {
  entriesList = JSON.parse(localStorage.getItem('entries'));
}

// contains the list of entries in DOM form
let list = '';

// filters group of entries by date
const filterEntriesList = (filter = '', localEntryList) => {
  const filteredList = Object.keys(localEntryList).filter(entry => entry.indexOf(filter) > -1);
  const myObject = {};
  for (const key in filteredList) {
    myObject[filteredList[key]] = localEntryList[filteredList[key]];
  }
  return myObject === undefined ? localEntryList : myObject;
};

// filters entries by title
const filterDayEntriesByTitle = (filter = '', localEntryList) => {
  const filteredList = localEntryList.data.filter(entry => entry.title.indexOf(filter) > -1);
  return filteredList;
};

/**
 * entryByDateList(): gets list of entry of a user grouped by date
 */
const entryByDateList = (arg) => {
  let tempList = '';
  for (const key in arg) {
    if (entriesList.hasOwnProperty(key)) {
      const keyLength = entriesList[key].length;
      const id = key;
      const entryVal = (keyLength === 1) ? ' entry' : ' entries';
      tempList += `<a href="#"  id="${id}" class="entrygroup" onclick='viewEntry("${id}",1)'>
       <div class="card row-entry">
           <div class="day">
               <h2>${key}</h2>
           </div>
           <div class="entry">
               <h2>${keyLength} ${entryVal}</h2>
           </div>
       </div>
   </a>`;
    }
  }
  list = tempList;
  return list;
};

/**
 * organises a list of entries in DOM
 */
const entryByDayList = (arg) => {
  let tempList = '';
  let paginationBtn = '';

  for (const key in arg) {
    myKey = key;
    if (arg) {
      tempList += `<div class="card row">
      <div class="day">
          <a id="time-${arg[key].id}" href="#" onclick='readEntry("${arg[key].title}","${arg[key].content}")'>
              <h2>${arg[key].created.split('T')[1].split('.')[0]}</h2>
          </a>
      </div>
      <div class="entry">
          <a id="title-${arg[key].id}" href="#" onclick='readEntry("${arg[key].title}","${arg[key].content}")'>
              <h2>${arg[key].title}</h2>
          </a>
      </div>
      <div class="row">
          <div class="buttons">
              <div class="container">
                  <a id="delete" href="#" onClick='addDeleteForm(${arg[key].id})'>
                      <i class="fa fa-trash"></i>
                  </a>
              </div>
              <div class="container">
                  <a id="edit" href="#" onClick='addUpdateForm(${arg[key].id},"${arg[key].title}","${arg[key].content}")'>
                      <i class="fa fa-edit"></i>
                  </a>
              </div>
          </div>
      </div>
  </div>
  <br>`;
    }
  }
  for (let pageBtn = 1; pageBtn <= entryListTotalPageNumber; pageBtn++) {
    paginationBtn += `
    <a id=${pageBtn} href="#" class="pagination" onClick='viewEntry("${selectedDate}", ${pageBtn})'>${pageBtn}</a>`;
  }
  list = tempList + paginationBtn;
  return list;
};


// creates new user
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
        // localStorage.setItem('token', user.user.token);
        document.getElementById('fullname').value = '';
        document.getElementById('email').value = '';
        document.getElementById('gender').value = '';
        document.getElementById('password').value = '';
        document.getElementById('retypePassword').value = '';
        alert(`Congratulation to you, ${fullname}. You have successfully created your account. Enjoy your Diary on the go.....`);
      }
    }).catch(err => err.message);
};

// login an existing user
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
      if (response.status === 401 || response.status === 404) {
        document.getElementById('errors_login').innerHTML = 'Username or password is incorrect';
      }
      return response.json();
    })
    .then((user) => {
      localStorage.setItem('token', user.data.token);
    }).then(() => {
      fetchUserDetails();
      fetchViewAllEntries();
      document.location = './landing-page.html';
    })
    .catch(err => err.message);
};

const Paginator = (items, pageArg, per_pageArg) => {
  let page = pageArg || 1,
    per_page = per_pageArg || 3,
    offset = (page - 1) * per_page,
    paginatedItems = items.slice(offset).slice(0, per_page),
    total_pages = Math.ceil(items.length / per_page);
  entryListTotalPageNumber = total_pages;
  return {
    page,
    per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: (total_pages > page) ? page + 1 : null,
    total: items.length,
    total_pages,
    data: paginatedItems,
  };
};

entryByDateList(filterEntriesList('', entriesList));


const addNewEntry = () => {
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
      if (response.status === 406) {
        document.getElementById('add_new_error').innerHTML = 'An Error an occurred';
      }
      return response.json();
    })
    .then((entry) => {
      if (entry.NewEntry) {
        const ul = document.getElementById('add_new_error');
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(entry.message));
        ul.appendChild(li);
        document.getElementById('title').value = '';

        document.getElementById('content').value = '';
      }
    }).catch(err => err.message);
};

const updateEntry = (id) => {
  document.getElementById('add_new_error').innerHTML = '';
  const entryId = id;
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  token = localStorage.getItem('token');
  updateEntryUrl = `${entryUrl}/${entryId}`;
  fetch(updateEntryUrl, {
    method: 'PUT',
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
      if (response.status === 406) {
        document.getElementById('add_new_error').innerHTML = 'An error has occured';
      }
      return response.json();
    })
    .then(() => {
      const ul = document.getElementById('add_new_error');
      const li = document.createElement('li');
      li.appendChild(document.createTextNode('An entry has been updated successfully'));
      ul.appendChild(li);
    }).catch(err => err.message);
};

const deleteEntry = (id) => {
  document.getElementById('add_new_error').innerHTML = '';
  const entryId = id;
  token = localStorage.getItem('token');
  deleteEntryUrl = `${entryUrl}/${entryId}`;
  fetch(deleteEntryUrl, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Token: token,
    },
  })
    .then((response) => {
      if (response.status === 406) {
        document.getElementById('add_new_error').innerHTML = 'An error has occured';
      }
      return response.json();
    })
    .then((entry) => {
      if (entry.data.errors) {
        Object.keys(entry.data.errors).forEach((key) => {
          const ul = document.getElementById('add_new_error');
          const li = document.createElement('li');
          li.appendChild(document.createTextNode(entry.data.errors[key]));
          ul.appendChild(li);
        });
      }
    }).catch(err => err.message);
};

const addNewForm = () => {
  const form = `<form onSubmit="return false">
  <div class="imgcontainer">
  <span onclick="document.getElementById('modalBox').style.display='none'" class="close" title="Close Modal">&times;</span>
  <h2>Add Entry</h2>
  </div>
  <ul id='add_new_error' class="text-red"></ul>
  <div class="input-container">
  <input class="input-field" id="title" type="text" placeholder="Entry Title">
  </div>
  <div class="input-container">
  <textarea rows="4" class="input-field" id="content" placeholder="Entry content"></textarea>
  </div>
  <input type="submit" class="btn" id="file-submit" value="Save" onClick="addNewEntry();">
</form>`;
  document.getElementById('modal-app').innerHTML = '';
  document.getElementById('modal-app').innerHTML = form;
  document.getElementById('modalBox').style.display = 'block';
};

const addUpdateForm = (id, localTitle, content) => {
  const form = `<form>
  <div class="imgcontainer">
  <span onclick="document.getElementById('modalBox').style.display='none'" class="close" title="Close Modal">&times;</span>
  <h2>Edit Entry</h2>
  </div>
  <ul id='add_new_error' class="text-red"></ul>
  <div class="input-container">
  <input class="input-field" id="title" type="text" placeholder="Entry Title">
  </div>
  <div class="input-container">
  <textarea rows="4" class="input-field" id="content" placeholder="Entry content"></textarea>
  </div>
  <button type="submit" class="btn" id="file-submit" onClick="updateEntry(${id});">Ok</button>
</form>`;
  document.getElementById('modal-app').innerHTML = '';
  document.getElementById('modal-app').innerHTML = form;
  document.getElementById('modalBox').style.display = 'block';
  document.getElementById('title').value = localTitle;
  document.getElementById('content').value = content;
};

const addDeleteForm = (id) => {
  const form = `<form>
  <ul id='add_new_error' class="text-red"></ul>
  <div class="input-container">
  <h2>Are you sure?</h2>
  </div>
  <button type="submit" class="btn" id="file-submit" onClick="deleteEntry(${id});">Yes</button>
  <button type="submit" class="btn" id="file-submit" onclick="document.getElementById('modalBox').style.display='none'">No</button>
</form>`;
  document.getElementById('modal-app').innerHTML = '';
  document.getElementById('modal-app').innerHTML = form;
  document.getElementById('modalBox').style.display = 'block';
};

const readEntry = (localTitle, content) => {
  const form = `<div class="imgcontainer">
  <span onclick="document.getElementById('modalBox').style.display='none'" class="close" title="Close Modal">&times;</span>
  </div>
  <h2>${localTitle}</h2>
  <p>${content}</p>`;
  document.getElementById('modal-app').innerHTML = '';
  document.getElementById('modal-app').innerHTML = form;
  document.getElementById('modalBox').style.display = 'block';
};

const showModalBox = () => {
  document.getElementById('modalBox').style.display = 'block';
};

const userProfile = () => {
  const page = `<div id="dashboard" class="container">
  <div class="card-dash col-1-3">
      <h2>Total entry</h2>
      <h2>${localStorage.getItem('entriesNumber')}</h2>
  </div>
  <div class="card-dash col-1-3">
      <h2>Add New</h2>
      <h2>
          <i class="fas fa-plus-circle" id="add-new" onclick="addNewForm();"></i>
      </h2>
  </div>
  <div class="card-dash col-1-3">
      <h2 id="txt"></h2>
  </div>
</div>
<div class="container">
  <h2>User Profile</h2>
  <div class="row container">
      <form name="userprofile" class="userprofile" onSubmit="return false">
          <ul id="update-error"></ul>
          <label for="fullname">Full name</label>
          <input type="text" id="fullname" name="fullname"  value=${userDetails.user[0].fullname} disabled placeholder="Full name">

          <label for="email">Email</label>
          <input type="text" id="email" name="email" value=${userDetails.user[0].email} disabled placeholder="email">
      
          <label for="gender">Gender</label>
          <select id="gender" name="gender" class="input-field" disabled>
            ${userDetails.user[0].gender === 'male'
    ? '<option value="male" selected>male</option>'
    : '<option value="female" selected>female</option>'}
            ${userDetails.user[0].gender === 'male'
    ? '<option value="female">female</option>'
    : '<option value="male">male</option>'}
          </select>
          <label for="notification">Notification</label>
          <select id="notification" name="notify" class="input-field" disabled>
            ${userDetails.user[0].notification === false
    ? `<option value=${false} selected>false</option>`
    : `<option value=${true} selected>true</option>`}
            ${userDetails.user[0].notification === false
    ? `<option value=${true}>true</option>`
    : `<option value=${false}>false</option>`}
          </select>

          <input type="submit" id="editBtn" class="btn" value="Edit" onClick='enableInput()'>
      </form>
  </div>
  </div>`;
  document.getElementById('app').innerHTML = page;
};


const uploadProfilePic = () => {
  const page = `<div id="dashboard" class="container">
  <div class="card-dash col-1-3">
      <h2>Total entry</h2>
      <h2>${localStorage.getItem('entriesNumber')}</h2>
  </div>
  <div class="card-dash col-1-3">
      <h2>Add New</h2>
      <h2>
          <i class="fas fa-plus-circle" id="add-new" onclick="addNewForm();"></i>
      </h2>
  </div>
  <div class="card-dash col-1-3">
      <h2 id="txt"></h2>
  </div>
</div>
<div class="container">
<h2>Upload Profile Picture</h2>
  <div id="filesubmit">
        <em id="upload-progress"></em>
        <input type="file" id="file-select" accept="image/*" />
        <button id="file-submit" onClick="handleFileUploadSubmit(this);" class="btn">Submit</button>
    </div>
</div>`;
  document.getElementById('app').innerHTML = page;
  if (document.getElementById('file-select')) { document.getElementById('file-select').addEventListener('change', handleFileUploadChange); }
};


// Initialize Firebase
let config = '';
let storageService = '';
let storageRef = '';

if (firebase) {
  config = {
    apiKey: 'AIzaSyAyKuao7my_KGIEKp5CeShqB0lfWX9B9uA',
    authDomain: 'mydiary-8ec5a.firebaseapp.com',
    databaseURL: 'https://mydiary-8ec5a.firebaseio.com',
    projectId: 'mydiary-8ec5a',
    storageBucket: 'mydiary-8ec5a.appspot.com',
    messagingSenderId: '383367820588',
  };
  firebase.initializeApp(config);
  storageService = firebase.storage();
  storageRef = storageService.ref();
}

let selectedFile;

const handleFileUploadChange = (e) => {
  selectedFile = e.target.files[0];
};
const handleFileUploadSubmit = () => {
  if (firebase) {
    const uploadTask = storageRef.child(`images/${selectedFile.name}`).put(selectedFile); // create a child directory called images, and place the file inside this directory
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById('upload-progress').innerText = `Upload is ${progress}% done`;
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            document.getElementById('upload-progress').innerText = 'Upload is paused';
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            document.getElementById('upload-progress').innerText = 'Upload is running';
            break;
          default:
        }
      }, (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            document.getElementById('upload-progress').innerText = 'User doesn\'t have permission to access the object';
            break;
          case 'storage/canceled':
            document.getElementById('upload-progress').innerText = 'User canceled the upload';
            break;
          case 'storage/unknown':
            document.getElementById('upload-progress').innerText = 'Unknown error occurred, inspect error.serverResponse';
            break;
          default:
        }
      }, () => {
      // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          updateUserDetails(downloadURL, userDetails.user[0].fullname, userDetails.user[0].email, userDetails.user[0].gender, userDetails.user[0].notification);
          document.getElementById('upload-progress').innerText = 'Hurray,Upload completed';
        });
      });
  }
};

if (document.getElementById('profile-pic')) { document.getElementById('profile-pic').addEventListener('click', uploadProfilePic); }

const checkTime = (arg) => {
  if (arg < 10) { arg = `0${arg}`; } // add zero in front of numbers < 10
  return arg;
};

const startTime = () => {
  const today = new Date();
  const hour = today.getHours();
  let min = today.getMinutes();
  let sec = today.getSeconds();
  min = checkTime(min);
  sec = checkTime(sec);
  document.getElementById('txt').innerHTML = `${hour}:${min}:${sec}`;
  setTimeout(startTime, 500);
};

const showAllEntries = () => {
  fetchViewAllEntries();
  const allEntries = `<div id="dashboard" class="container">
  <div class="card-dash col-1-3">
      <h2>Total entry</h2>
      <h2>${localStorage.getItem('entriesNumber')}</h2>
  </div>
  <div class="card-dash col-1-3">
      <h2>Add New</h2>
      <h2>
          <i class="fas fa-plus-circle" id="add-new" onclick="addNewForm();"></i>
      </h2>
  </div>
  <div class="card-dash col-1-3">
      <h2 id="txt"></h2>
  </div>
</div>
<div class="container">
  <h2>${title}</h2>
  <input type="text" class="input-field" id="search" placeholder="Search" name="search" onchange="searchValue()">
  
  ${list}
</div>`;
  // initializes the app tag
  document.getElementById('app').innerHTML = allEntries;
  document.getElementById('add-new').addEventListener('click', showModalBox);

  startTime();
};


const show = () => {
  fetchUserDetails();
  userDetails = JSON.parse(localStorage.getItem('userDetails'));
  document.getElementById('username').innerText = userDetails.user[0].fullname;
  showAllEntries();
};

// filter entries
const searchValue = () => {
  const val = document.getElementById('search').value;
  if (!state) {
    entryByDateList(filterEntriesList(val, entriesList));
  } else {
    entryByDayList(filterDayEntriesByTitle(val, Paginator(entriesList[selectedDate], 1)));
  }
  show();
};

// view an entry
const viewEntry = (id, pageNumber) => {
  selectedDate = id;
  state = true;
  title = `Entries on ${id}`;
  entryByDayList(Paginator(entriesList[id], pageNumber).data);
  show();
  document.getElementById(pageNumber).style.border = '4px solid';
  return list;
};


const pageEntry = (id, pageNumber) => {
  entryByDayList(Paginator(entriesList[id]).data, pageNumber);
  show();
};

// enables the user profile input boxes
const enableInput = () => {
  document.userprofile.fullname.disabled = !document.userprofile.fullname.disabled;
  document.userprofile.email.disabled = !document.userprofile.email.disabled;
  document.userprofile.gender.disabled = !document.userprofile.gender.disabled;
  document.userprofile.notify.disabled = !document.userprofile.notify.disabled;
  const editBtn = document.getElementById('editBtn');
  if (editBtn.value === 'Edit') {
    editBtn.value = 'Save';
  } else {
    const fullname = document.userprofile.fullname.value;
    const passport = userDetails.user[0].passporturl;
    const email = document.userprofile.email.value;
    const gender = document.userprofile.gender.value;
    const notification = document.userprofile.notification.value;
    updateUserDetails(passport, fullname, email, gender, notification);
    editBtn.value = 'Edit';
  }
};

const logout = () => {
  localStorage.clear();
  window.location = './index.html';
};

if (document.getElementById('file-select')) { document.getElementById('file-select').addEventListener('change', handleFileUploadChange); }
if (document.getElementById('file-submit')) { document.getElementById('file-submit').addEventListener('click', handleFileUploadSubmit); }
if (document.getElementById('login')) { document.getElementById('login').addEventListener('click', login); }
if (document.getElementById('register')) { document.getElementById('register').addEventListener('click', register); }
if (document.getElementById('logout-small')) { document.getElementById('logout-small').addEventListener('click', logout); }
if (document.getElementById('logout-big')) { document.getElementById('logout-big').addEventListener('click', logout); }
if (document.getElementById('entries')) { document.getElementById('entries').addEventListener('click', show); }
