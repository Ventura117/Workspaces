const tasks = JSON.parse(localStorage.getItem('tasks-list')) || []
let nextUID = JSON.parse(localStorage.getItem('uid-tracker')) || 1

let editing = false

renderPage()

document.addEventListener('keydown', (event) => {
  if (event.keyCode === 27) {  renderPage()  }
})

function handleKeyPressInput(event) {
  if (event.keyCode === 13) {
    const nameInputElem = document.querySelector('.input-task-name')
    if (nameInputElem.value.length  > 3) {  addTask()  }
  }
}

function handleKeyPressEdit(event, uid) {
  if (event.keyCode === 13) {
    const nameInputElem = document.querySelector('.input-task-name-edit')
    if (nameInputElem.value.length  > 3) {  updateTask(uid)  }
  }
}

function renderPage() {
  editing = false
  const listElement = document.querySelector('ul')
  listElement.innerHTML = ''
  storeTasks()
  if (tasks.length === 0) {
    let emptyList = document.createElement('p')
      emptyList.classList.add('list-empty')
      emptyList.textContent = '\u00B7 Add a task to begin!'
      listElement.appendChild(emptyList)
    return
  }
  for (i = 0; i < tasks.length; i++) {
    if (listElement.innerHTML.length != 0) {
      listElement.innerHTML += '<br>'
    }
    const parent = tasks[i]
    if (parent.complete === false) {
      listElement.innerHTML += `
        <li class="task task-${parent.uid}" onmouseenter="showLinks(this)" onmouseleave="hideLinks(this)">
          <div class="task-name">
            ${parent.name}
          </div>
          <div class="task-links">
            <div class="edit-links hidden">
              <a class="link-mark-done" onclick="markTaskDone(${parent.uid})">Mark done</a>
              <a class="link-edit" onclick="editTask(${parent.uid})">Edit</a>
            </div>
            <div class="project-holder">
              <a href="edit_project_page.html?id=${parent.project_id}" class="link-project">
                ${parent.project_id}
              </a>
            </div>
          </div>
        </li>
      `
    } else {
      listElement.innerHTML += `
        <li class="task task-${parent.uid}" onmouseenter="showLinks(this)" onmouseleave="hideLinks(this)">
          <div class="task-name-complete">
            ${parent.name}
          </div>
          <div class="task-links">
            <div class="edit-links hidden">
              <a class="link-remove" onclick="deleteTask(${parent.uid})">Remove</a>
              <a class="link-mark-done" onclick="undoTaskDone(${parent.uid})">Undo</a>
              <a class="link-edit" onclick="editTask(${parent.uid})">Edit</a>
            </div>
            <div class="project-holder">
              <a href="edit_project_page.html?id=${parent.project_id}" class="link-project">
                ${parent.project_id}
              </a>
            </div>
          </div>
        </li>
      `
    }
    for (j = 0; j < parent.child.length; j++) {
      const child = parent.child[j]
      if (child.complete === false) {
        listElement.innerHTML += `
          <li class="task task-${child.uid}" onmouseenter="showLinks(this)" onmouseleave="hideLinks(this)">
            <div class="task-name">
              -&nbsp; ${child.name}
            </div>
            <div class="task-links">
              <div class="edit-links hidden">
                <a class="link-mark-done" onclick="markTaskDone(${child.uid})">Mark done</a>
                <a class="link-edit" onclick="editTask(${child.uid})">Edit</a>
              </div>
              <div class="project-holder">
                <a href="edit_project_page.html?id=${child.project_id}" class="link-project">
                  ${child.project_id}
                </a>
              </div>
            </div>
          </li>
        `
      } else {
      listElement.innerHTML += `
        <li class="task task-${child.uid}" onmouseenter="showLinks(this)" onmouseleave="hideLinks(this)">
          <div class="task-name-complete">
            -&nbsp; ${child.name}
          </div>
          <div class="task-links">
            <div class="edit-links hidden">
              <a class="link-remove" onclick="deleteTask(${child.uid})">Remove</a>
              <a class="link-mark-done" onclick="undoTaskDone(${child.uid})">Undo</a>
              <a class="link-edit" onclick="editTask(${child.uid})">Edit</a>
            </div>
            <div class="project-holder">
              <a href="edit_project_page.html?id=${child.project_id}" class="link-project">
                ${child.project_id}
              </a>
            </div>
          </div>
        </li>
      `
    }
      for (k = 0; k < child.grandchild.length; k++) {
        const grandchild = child.grandchild[k]
        if (grandchild.complete === false) {
          listElement.innerHTML += `
            <li class="task task-${grandchild.uid}" onmouseenter="showLinks(this)" onmouseleave="hideLinks(this)">
              <div class="task-name">
                -&nbsp; -&nbsp; ${grandchild.name}
              </div>
              <div class="task-links">
                <div class="edit-links hidden">
                  <a class="link-mark-done" onclick="markTaskDone(${grandchild.uid})">Mark done</a>
                  <a class="link-edit" onclick="editTask(${grandchild.uid})">Edit</a>
                </div>
                <div class="project-holder">
                  <a href="edit_project_page.html?id=${grandchild.project_id}" class="link-project">
                    ${grandchild.project_id}
                  </a>
                </div>
              </div>
            </li>
          `
        } else {
          listElement.innerHTML += `
            <li class="task task-${grandchild.uid}" onmouseenter="showLinks(this)" onmouseleave="hideLinks(this)">
              <div class="task-name-complete">
                -&nbsp; -&nbsp; ${grandchild.name}
              </div>
              <div class="task-links">
                <div class="edit-links hidden">
                  <a class="link-remove" onclick="deleteTask(${grandchild.uid})">Remove</a>
                  <a class="link-mark-done" onclick="undoTaskDone(${grandchild.uid})">Undo</a>
                  <a class="link-edit" onclick="editTask(${grandchild.uid})">Edit</a>
                </div>
                <div class="project-holder">
                  <a href="edit_project_page.html?id=${grandchild.project_id}" class="link-project">
                    ${grandchild.project_id}
                  </a>
                </div>
              </div>
            </li>
          `
        }
      }
    }
  }
}

function showLinks(element) {
  if (element.classList.contains('editing')) {  return  }
  if (editing === true) {  return  }
  let links = element.querySelector('.hidden')
  links.classList.remove('hidden')
}

function hideLinks(element) {
  if (element.classList.contains('editing')) {  return  }
  let links = element.querySelector('.edit-links')
  links.classList.add('hidden')
}

function addTask() {
  const nameInputElem = document.querySelector('.input-task-name')
  const projectInputElem = document.querySelector('.input-task-proj')
  let name = nameInputElem.value.trim()
  const project_id = projectInputElem.value

  if (name[0] && name[2] === '-' || name[0] && name[1] === '-') {
    if (name[0] && name[2] === '-') {  name = name.substring(3).trim()  }
    if (name[0] && name[1] === '-') {  name = name.substring(2).trim()  }
    const parent = tasks[tasks.length - 1]
    const child = parent.child[parent.child.length - 1]
    if (!child) {  return console.log('Error:  No child task to add grandchild task')  }
    child.grandchild.push({uid: nextUID, name: name, project_id: project_id, complete: false})
  } else if (name[0] === '-') {
    name = name.substring(1).trim()
    const parent = tasks[tasks.length - 1]
    parent.child.push({uid: nextUID, name: name, project_id: project_id, complete:false, grandchild: []})
  } else {
    name = name.trim()
    tasks.push({uid: nextUID, name: name, project_id: project_id, complete: false, child: []})
  }

  nextUID++
  nameInputElem.value = ''
  projectInputElem.value = ''
  nameInputElem.focus()

  renderPage()
}

function editTask(uid) {
  const task = findTask(uid);
  const taskElement = document.querySelector(`.task-${uid}`)
    taskElement.innerHTML = ``
    taskElement.classList.add('editing')
  editing = true
  const editNameElem = document.createElement('input')
    editNameElem.classList = 'input-task-name-edit'
    editNameElem.placeholder = 'Enter task name'
    editNameElem.type = 'text'
    editNameElem.onkeypress = () => handleKeyPressEdit(event, uid)
    editNameElem.value = task.name
  const editProjElem = document.createElement('input')
    editProjElem.classList = 'input-task-proj-edit'
    editProjElem.placeholder = 'Enter project id'
    editProjElem.type = 'text'
    editProjElem.onkeypress = () => handleKeyPressEdit(event, uid)
    editProjElem.value = task.project_id
  const saveIcon = document.createElement('img')
    saveIcon.classList.add('save-icon')
    saveIcon.onclick = () => updateTask(uid)
    saveIcon.src = 'images/check-icon.png'
  taskElement.appendChild(editNameElem)
  taskElement.appendChild(editProjElem)
  taskElement.appendChild(saveIcon)
  editNameElem.focus()
}

function updateTask(uid) {
  const newTaskName = document.querySelector('.input-task-name-edit').value
  const newProjId = document.querySelector('.input-task-proj-edit').value
  const task = findTask(uid);
  task.name = newTaskName
  task.project_id = newProjId
  task.complete = false
  renderPage()
}

function findTask(uid) {
  for (i = 0; i < tasks.length; i++) {
    const parent = tasks[i]
    if (parent.uid === uid) {
      return parent
    }
    if (parent.child) {
      for (j = 0; j < parent.child.length; j++) {
        const child = parent.child[j]
        if (child.uid === uid) {
          return child
        }
        if (child.grandchild) {
          for (k = 0; k < child.grandchild.length; k++) {
            const grandchild = child.grandchild[k]
            if (grandchild.uid === uid) {
              return grandchild
            }
          }
        }
      }
    }
  }
  return
}

function markTaskDone(uid) {
  const task = findTask(uid)
  task.complete = true
  renderPage()
}

function undoTaskDone(uid) {
  const task = findTask(uid)
  task.complete = false
  renderPage()
}

function deleteTask(uid) {
  for (i = 0; i < tasks.length; i++) {
    const parent = tasks[i]
    if (parent.uid === uid) {
      tasks.splice(i, 1)
    }
    if (parent.child) {
      for (j = 0; j < parent.child.length; j++) {
        const child = parent.child[j]
        if (child.uid === uid) {
          parent.child.splice(j, 1)
        }
        if (child.grandchild) {
          for (k = 0; k < child.grandchild.length; k++) {
            const grandchild = child.grandchild[k]
            if (grandchild.uid === uid) {
              child.grandchild.splice(k, 1)
            }
          }
        }
      }
    }
  }
  renderPage()
}

function storeTasks() {
  localStorage.setItem('tasks-list', JSON.stringify(tasks))
  localStorage.setItem('uid-tracker', JSON.stringify(nextUID))
}

function deleteAllTasks() {
  tasks.splice(0, tasks.length)
  const nameInputElem = document.querySelector('.input-task-name')
  const projectInputElem = document.querySelector('.input-task-proj')
  nameInputElem.value = ''
  projectInputElem.value = ''
  renderPage()
}