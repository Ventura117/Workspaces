const projects = JSON.parse(localStorage.getItem('projects')) || [];

const params = new URLSearchParams(window.location.search);
const projectId = params.get('id');

let project;

for (i = 0; i < projects.length; i++) {
  if (projects[i].Azure_ID === projectId) {
    project = projects[i]
    break
  } else {
    continue
  }
}

const zendeskId = document.getElementById('zendesk_id');
const azureId = document.getElementById('azure_id');
const projectStatus = document.getElementById('status');
const sponsor = document.getElementById('sponsor');
const priority = document.getElementById('priority');
const assignee = document.getElementById('assignee');
const projectName = document.getElementById('name');
const dueDate = document.getElementById('due_date');
const title = document.getElementById('title');
const description = document.getElementById('description');
const acceptance = document.getElementById('acceptance');

loadDetails()

function loadDetails() {
  zendeskId.value = project.Zendesk_ID
  azureId.value = project.Azure_ID
  projectStatus.value = project.Status
  sponsor.value = project.Sponsor
  priority.value = project.Priority
  assignee.value = project.Assignee
  projectName.value = project.Name
  dueDate.value = project.Due_Date
  title.value = project.Title
  description.value = project.Description
  acceptance.value = project.Acceptance
}

function saveDetails() {
  projects[i].Zendesk_ID = zendeskId.value 
  projects[i].Azure_ID = azureId.value
  projects[i].Status = projectStatus.value
  projects[i].Sponsor = sponsor.value
  projects[i].Priority = priority.value
  projects[i].Assignee = assignee.value
  projects[i].Name = projectName.value
  projects[i].Due_Date = dueDate.value
  projects[i].Title = title.value
  projects[i].Description = description.value
  projects[i].Acceptance = acceptance.value
  localStorage.setItem('projects', JSON.stringify(projects))
  loadPage('projects')
}

function loadPage(page) {
  window.location.href = `${page}_page.html`
}
