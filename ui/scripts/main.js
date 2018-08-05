// Get the modal
const modal = document.getElementById('modalBox');

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};


const openNav = () => {
  document.getElementById('mySidenav').style.width = '250px';
  document.getElementById('main').style.marginLeft = '0';
};

const closeNav = () => {
  document.getElementById('mySidenav').style.width = '0';
  document.getElementById('main').style.marginLeft = '0';
};


const redirect = () => {
  window.location = './user-entries.html';
};

const goToAddNew = () => {
  window.location = './add-edit.html';
};

const enableInput = () => {
  document.userprofile.upload.disabled = !document.userprofile.upload.disabled ;
  document.userprofile.firstname.disabled = !document.userprofile.firstname.disabled ;
  document.userprofile.lastname.disabled = !document.userprofile.lastname.disabled ;
  document.userprofile.notify.disabled = !document.userprofile.notify.disabled ;
  let editBtn = document.getElementById("editBtn")
  editBtn.value === 'Edit' ? editBtn.value = 'Save' : editBtn.value = 'Edit';
};
