const projects = JSON.parse(localStorage.getItem('projects')) || [];

renderProjects()

function renderProjects() {
  const activeTableElem = document.querySelector('.active-projects-body')
  const archiveTableElem = document.querySelector('.archive-projects-body')
  for (i = 0; i < projects.length; i++) {
    const project = projects[i]
    if (project['Status'] === 'Complete') {
      archiveTableElem.innerHTML += 
      `<td>${project['Zendesk_ID']}</td>
      <td><a href="edit_project_page.html?id=${project['Azure_ID']}">${project['Azure_ID']}</a></td>
      <td>${project['Name']}</td>
      <td>${project['Title']}</td>
      <td>${project['Status']}</td>
      <td>${project['Priority']}</td>
      <td>${project['Due_Date']}</td>`
    } else {
      activeTableElem.innerHTML += 
      `<td>${project['Zendesk_ID']}</td>
      <td><a href="edit_project_page.html?id=${project['Azure_ID']}">${project['Azure_ID']}</a></td>
      <td>${project['Name']}</td>
      <td>${project['Title']}</td>
      <td>${project['Status']}</td>
      <td>${project['Priority']}</td>
      <td>${project['Due_Date']}</td>`
    }
  }
}

function makeActive(bucket) {
  const newActiveButton = document.querySelector(`.${bucket}-projects-button`)
  const newActiveTable = document.querySelector(`.${bucket}-projects-table`)
  if (newActiveButton.classList.contains('active-button')) {
    return
  } else {
    makeInactive()
    newActiveButton.classList.add('active-button')
    newActiveTable.classList.add('active-table')
  }
}
function makeInactive() {
  const oldActiveButton = document.querySelector('.active-button')
  const oldActiveTable = document.querySelector('.active-table')
  if (oldActiveButton) {
    oldActiveButton.classList.remove('active-button')
  }
  if (oldActiveTable) {
    oldActiveTable.classList.remove('active-table')
  }
}
 
function logProjects() {
  console.log(projects)
}

function deleteProjects() {
  localStorage.removeItem('projects')
}