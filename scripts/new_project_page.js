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

const projects = JSON.parse(localStorage.getItem('projects')) || [];

function createProject() {
  let newProject = {
    Zendesk_ID: zendeskId.value,
    Azure_ID: azureId.value,
    Status: projectStatus.value,
    Sponsor: sponsor.value,
    Priority: priority.value,
    Assignee: assignee.value,
    Name: projectName.value,
    Due_Date: dueDate.value,
    Title: title.value,
    Description: description.value,
    Acceptance: acceptance.value
  };
  if (newProject['Zendesk_ID'] && newProject['Sponsor'] && newProject['Name']) {
    projects.push(newProject)
    localStorage.setItem('projects', JSON.stringify(projects))
    resetFields()
  } else {
    alert('FIll in required fields: Zendesk ID, Sponsor, Title')
  }

}

function resetFields() {
  zendeskId.value = '';
  azureId.value = '';
  projectStatus.selectedIndex = 0;
  sponsor.value = '';
  priority.selectedIndex = 0;
  assignee.selectedIndex = 0;
  projectName.value = '';
  title.value = '';
  description.value = '';
  acceptance.value = '';
}

function logProjects() {
  console.log(projects)
}

function deleteProjects() {
  localStorage.removeItem('projects')
}