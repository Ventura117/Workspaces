let projects;
const projectsTable = document.querySelector('.projects-table-body')

function getProjects() {
  fetch('http://localhost:3000/projects/get_projects')
  .then(response => response.json())
  .then(data => {
    projects = data;
    renderProjects()
  })
  .catch(error => console.log(error))
}

getProjects();

function renderProjects() {
  projects.forEach((project) => {
    const tableRow = document.createElement('tr');
      projectsTable.appendChild(tableRow);
    const projectId = document.createElement('td');
      projectId.style.textAlign = 'center';
      tableRow.appendChild(projectId);
    const projectIdLink = document.createElement('a');
      projectIdLink.textContent = project.project_id;
      projectIdLink.href = `http://localhost:3000/projects/edit_project/${project.project_id}`;
      projectId.appendChild(projectIdLink);
    const azureIdLink = document.createElement('td');
      azureIdLink.textContent = project.azure_id;
      azureIdLink.style.textAlign = 'center';
      tableRow.appendChild(azureIdLink);
    const projectName = document.createElement('td');
      projectName.textContent = project.project_name;
      tableRow.appendChild(projectName);
    const projectTitle = document.createElement('td');
      projectTitle.textContent = project.project_title;
      tableRow.appendChild(projectTitle);
    const priority = document.createElement('td');
      priority.textContent = project.priority;
      priority.style.textAlign = 'center';
      tableRow.appendChild(priority);
    const status = document.createElement('td');
      status.style.textAlign = 'center';
      tableRow.appendChild(status);
    const statusSelector = document.createElement('select');
      statusSelector.dataset.projectId = project.project_id;
      statusSelector.addEventListener('change', function() {
        console.log(this.dataset.projectId)
        console.log(this.value)
        fetch('http://localhost:3000/projects/update_status', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_id: `${this.dataset.projectId}`,
            status: `${this.value}`
          })
        })
          .then((res) => {
            console.log('Project updated successfully.')
          })
      })
      status.appendChild(statusSelector);
    const statusOption1 = document.createElement('option');
      statusOption1.value = 'Not Started';
      statusOption1.textContent = 'Not Started';
      if (project.status === 'Not Started') {
        statusOption1.selected = true;
      };
      statusSelector.appendChild(statusOption1);
    const statusOption2 = document.createElement('option');
      statusOption2.value = 'In Progress';
      statusOption2.textContent = 'In Progress';
      if (project.status === 'In Progress') {
        statusOption2.selected = true;
      };
      statusSelector.appendChild(statusOption2);
    const statusOption3 = document.createElement('option');
      statusOption3.value = 'Complete';
      statusOption3.textContent = 'Complete';
      if (project.status === 'Complete') {
        statusOption3.selected = true;
      };
      statusSelector.appendChild(statusOption3);
    const statusOption4 = document.createElement('option');
      statusOption4.value = 'Dev Complete';
      statusOption4.textContent = 'Dev Complete';
      if (project.status === 'Dev Complete') {
        statusOption4.selected = true;
      };
      statusSelector.appendChild(statusOption4);
    const statusOption5 = document.createElement('option');
      statusOption5.value = 'Canceled';
      statusOption5.textContent = 'Canceled';
      if (project.status === 'Canceled') {
        statusOption5.selected = true;
      };
      statusSelector.appendChild(statusOption5);
    const assignee = document.createElement('td');
      if (project.assignee) {
        assignee.textContent = project.assignee;
      } else {
        assignee.textContent = ' - ';
      }
      assignee.style.textAlign = 'center';
      tableRow.appendChild(assignee);
    const dueDate = document.createElement('td');
      if (project.due_date) {
        const date = new Date(project.due_date);
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${
          date.getDate().toString().padStart(2, '0')}/${
          date.getFullYear().toString().slice(-2)}`;
        dueDate.textContent = formattedDate;
      } else {
        dueDate.textContent = '';
      }
      dueDate.style.textAlign = 'center';
      tableRow.appendChild(dueDate);
  })
}

let selectedFilters = ['Not Started', 'In Progress', 'Complete'];

const notStartedBtn = document.querySelector('#not-started-btn');
const inProgressBtn = document.querySelector('#in-progress-btn');
const completeBtn = document.querySelector('#complete-btn');
const devCompleteBtn = document.querySelector('#dev-complete-btn');
const canceledBtn = document.querySelector('#canceled-btn');

const activeFiltersBtn = document.querySelector('#active-filters-btn');
activeFiltersBtn.addEventListener('click', () => {
  if (notStartedBtn.checked && inProgressBtn.checked && completeBtn.checked) {
    notStartedBtn.checked = false;
    inProgressBtn.checked = false;
    completeBtn.checked = false;
  } else {
    notStartedBtn.checked = true;
    inProgressBtn.checked = true;
    completeBtn.checked = true;
  }
})
const archiveFiltersBtn = document.querySelector('#archive-filters-btn');
archiveFiltersBtn.addEventListener('click', () => {
  if (devCompleteBtn.checked && canceledBtn.checked) {
    devCompleteBtn.checked = false;
    canceledBtn.checked = false;
  } else {
    devCompleteBtn.checked = true;
    canceledBtn.checked = true;
  }
})

const applyFiltersBtn = document.querySelector('#applyFilter');
applyFiltersBtn.addEventListener('click', () => {
  applyFilters();
})

function applyFilters() {
  selectedFilters = [];
  if (notStartedBtn.checked) {
    selectedFilters.push(notStartedBtn.value)
  }
  if (inProgressBtn.checked) {
    selectedFilters.push(inProgressBtn.value)
  }
  if (completeBtn.checked) {
    selectedFilters.push(completeBtn.value)
  }
  if (devCompleteBtn.checked) {
    selectedFilters.push(devCompleteBtn.value)
  }
  if (canceledBtn.checked) {
    selectedFilters.push(canceledBtn.value)
  }
  console.log(selectedFilters)
}