const url = window.location.pathname;
const projectId = url.split('/').pop();

fetch(`http://localhost:3000/projects/get_project/${projectId}`)
  .then(response => response.json())
  .then((data) => {
    loadProjectDetails(data);
  })

function loadProjectDetails(data) {
  console.log(data)
  document.querySelector('#azure_id').value = data.azure_id || '';
  document.querySelector('#zendesk_id').value = data.zendesk_id || '';
  document.querySelector('#status').value = data.status || '';
  document.querySelector('#sponsor').value = data.sponsor || '';
  document.querySelector('#priority').value = data.priority || '';
  document.querySelector('#assignee').value = data.assignee || '';
  document.querySelector('#project_name').value = data.project_name || '';
  document.querySelector('#due_date').value = data.due_date || '';
  document.querySelector('#project_title').value = data.project_title || '';
  document.querySelector('#project_description').value = data.project_description || '';
  document.querySelector('#acceptance').value = data.acceptance || '';
}

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

