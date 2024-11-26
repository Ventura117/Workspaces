const dateInput = document.getElementById('due_date');
dateInput.addEventListener('click', (event) => {
  dateInput.showPicker();
  event.preventDefault();
})

const toggleDetailsBtn = document.querySelector('.toggle-details-btn');
toggleDetailsBtn.addEventListener('click', () => {
  toggleDetails();
})

const detailsFields = document.querySelectorAll('.form-input-container-s, .form-input-container-m')

function toggleDetails() {
  detailsFields.forEach((field) => {
    if (field.classList.contains('hidden')) {
      field.classList.remove('hidden')
    } else {
      field.classList.add('hidden')
    }
  })
  if (detailsFields[0].classList.contains('hidden')) {
    toggleDetailsBtn.textContent = '+ Show Details'
  } else {
    toggleDetailsBtn.textContent = '- Hide Details'
  }
}