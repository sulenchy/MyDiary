// Get the modal
const modal = document.getElementById('modalBox');

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

const openNav = () => {
  document.getElementById('mySidenav').style.width = '40%';
  if(document.getElementById('main')) 
    document.getElementById('main').style.marginLeft = '0';
};

const closeNav = () => {
  document.getElementById('mySidenav').style.width = '0';
  if(document.getElementById('main')) 
    document.getElementById('main').style.marginLeft = '0';
};

const redirect = () => {
  window.location = './user-entries.html';
};

const goToAddNew = () => {
  window.location = './add-edit.html';
};



const checkTime = (i) => {
  if (i < 10) { i = `0${i}`; } // add zero in front of numbers < 10
  return i;
};

const startTime = () => {
  const today = new Date();
  const h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('txt').innerHTML = `${h}:${m}:${s}`;
  const t = setTimeout(startTime, 500);
};
