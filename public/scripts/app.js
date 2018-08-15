// Declaration and initialization of global variable
let token = '';
const entryUrl = 'http://localhost:8081/api/v1/entries';
const entriesNumber = 0;
const entryGroup = {};


function groupBy(objectArray, property) {
  return objectArray.reduce((acc, obj) => {
    let key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

// loads all entries of a user
const fetchViewAllEntries = () => {
  let len;
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
            localStorage.setItem('entries', JSON.stringify(groupedEntries));
          }
        }
        localStorage.setItem('entriesNumber', userEntriesLength);
      }
    }).catch(err => console.log(err));
};

// gets list of entries from the localStorage
const entriesList = JSON.parse(localStorage.getItem('entries'));


// contains the list of entries in DOM form
let list = '';

const filterEntriesList = (filter = '') => {
  const filteredList = Object.keys(entriesList).filter(entry => entry.indexOf(filter) > -1);
  const myObject = {};
  for (const key in filteredList) {
    myObject[filteredList[key]] = entriesList[filteredList[key]];
  }
  return myObject === undefined ? entriesList : myObject;
};

/**
 * entryByDateList(): gets list of entry of a user grouped by date
 */
const entryByDateList = (arg) => {
  let tempList = '';
  for (const key in arg) {
    if (entriesList.hasOwnProperty(key)) {
      const keyLength = entriesList[key].length;
      const entryVal = (keyLength === 1) ? ' entry' : ' entries';
      tempList += `<a href="./user-day-entries.html">
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

entryByDateList(filterEntriesList());

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
          <i class="fas fa-plus-circle" id="add-new"></i>
      </h2>
  </div>
  <div class="card-dash col-1-3">
      <h2 id="txt"></h2>
  </div>
</div>
<div class="container">
  <h2>All Entries in days</h2>
  <input type="text" class="input-field" id="search" placeholder="Search by Date" name="search" onchange="searchValue()">
  
  ${list}

  <div class="row text-center push-down">
      <a href="#" class="btn">
          View more
      </a>
  </div>
</div>`;
  // initializes the app tag
  document.getElementById('app').innerHTML = allEntries;
  document.getElementById('add-new').addEventListener('click', showAddNewForm);
  document.getElementById('file-submit').addEventListener('click', addNewEntry);

  const today = new Date();
  const h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('txt').innerHTML = `${h}:${m}:${s}`;
  const t = setTimeout(startTime, 500);
};

// filter entries
const searchValue = () => {
  const val = document.getElementById('search').value;  
  entryByDateList(filterEntriesList(val));
  showAllEntries();
};

// view an entry
const viewEntry = () => '<div> <h1>An entry of an authorised user</h1></div>';

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
        Object.keys(user.data.errors).forEach((key) => {
          const ul = document.getElementById('add_new_error');
          const li = document.createElement('li');
          li.appendChild(document.createTextNode(user.data.errors[key]));
          ul.appendChild(li);
        });
      } else {
        alert('An entry has been added successfully');
      }
    }).catch(err => err.message);
};

const editEntry = () => '<div> <h1>Modifies an entry</h1></div>';

const deleteEntry = () => '<div> <h1>Delete an entry</h1></div>';

const showAddNewForm = () => {
  document.getElementById('modalBox').style.display = 'block';
};

const userProfile = () => '<div> <h1>Shows the profile of the user</h1></div>';

const logout = () => {
  window.localStorage.removeItem('token');
  window.location = './index.html';
};

document.getElementById('logout').addEventListener('click', logout);

document.getElementById('entries').addEventListener('click', showAllEntries);
