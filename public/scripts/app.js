// Declaration and initialization of global variable
let token = '';
const entryUrl = 'http://localhost:8081/api/v1/entries';
const entriesNumber = 0;
const entryGroup = {};
let entriesList = '';
let title = 'Entries in Days';
let selectedDate = '';
let url = 'http://localhost:8081/client/landing-page.html#entries-by-date';

let state = false;

function groupBy(objectArray, property) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
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
        console.log('return groupedEntries =====>', groupedEntries);
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
    }).catch(err => console.log(err));
};

// gets list of entries from the localStorag
if (localStorage.getItem('entries')) {
  entriesList = JSON.parse(localStorage.getItem('entries'));
}

// contains the list of entries in DOM form
let list = '';

const filterEntriesList = (filter = '', localEntryList) => {
  const filteredList = Object.keys(localEntryList).filter(entry => entry.indexOf(filter) > -1);
  console.log('return filtered entries ======>', filteredList);
  const myObject = {};
  for (const key in filteredList) {
    myObject[filteredList[key]] = localEntryList[filteredList[key]];
  }
  return myObject === undefined ? localEntryList : myObject;
};

const filterDayEntriesByTitle = (filter = '', localEntryList) => {
  const filteredList = localEntryList.filter(entry => entry.title.indexOf(filter) > -1);
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
      tempList += `<a href="#"  id="${id}" class="entrygroup" onclick='viewEntry("${id}")'>
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

const entryByDayList = (arg) => {
  let tempList = '';
  for (const key in arg) {
    if (arg) {
      tempList += `<div class="card row">
      <div class="day">
          <a href="./entry-content.html">
              <h2>${arg[key].created.split('T')[1].split('.')[0]}</h2>
          </a>
      </div>
      <div class="entry">
          <a href="./entry-content.html">
              <h2>${arg[key].title}</h2>
          </a>
      </div>
      <div class="row">
          <div class="buttons">
              <div class="container">
                  <a href="#">
                      <i class="fa fa-trash"></i>
                  </a>
              </div>
              <div class="container">
                  <a href="#">
                      <i class="fa fa-edit"></i>
                  </a>
              </div>
          </div>
      </div>
  </div>`;
    }
  }
  list = tempList;
  return list;
};

entryByDateList(filterEntriesList('', entriesList));

// if (url === 'http://localhost:8081/client/landing-page.html#entries-by-time') { entryByDayList(filterDayEntriesByTitle('', entriesList[selectedDate])); }

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
  <h2>${title}</h2>
  <input type="text" class="input-field" id="search" placeholder="Search" name="search" onchange="searchValue()">
  
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

const show = () => {
  showAllEntries();
};

// filter entries
const searchValue = () => {
  const val = document.getElementById('search').value;
  if (!state) {
    entryByDateList(filterEntriesList(val, entriesList));
  } else {
    entryByDayList(filterDayEntriesByTitle(val, entriesList[selectedDate]));
  }
  show();
};

// view an entry
const viewEntry = (id) => {
  selectedDate = id;
  state = true;
  url = 'http://localhost:8081/client/landing-page.html#entries-by-time';
  title = `Entries on ${id}`;
  entryByDayList(entriesList[id]);
  show();
  return list;
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
    .then((entry) => {
      if (entry.data.errors) {
        Object.keys(entry.data.errors).forEach((key) => {
          const ul = document.getElementById('add_new_error');
          const li = document.createElement('li');
          li.appendChild(document.createTextNode(entry.data.errors[key]));
          ul.appendChild(li);
        });
      } else {
        const ul = document.getElementById('add_new_error');
        const li = document.createElement('li');
        li.appendChild(document.createTextNode('An entry has been added successfully'));
        ul.appendChild(li);
        document.getElementById('title').innerText = '';
        document.getElementById('content').innerText = '';
        console.log('working mode');
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
  localStorage.clear();
  console.log('return =====> the localStorage.clear() executed');
  window.location = './index.html';
};

document.getElementById('logout-small').addEventListener('click', logout);
document.getElementById('logout-big').addEventListener('click', logout);

document.getElementById('entries').addEventListener('click', show);
