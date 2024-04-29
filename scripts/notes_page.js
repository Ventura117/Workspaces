const pages = JSON.parse(localStorage.getItem('pagesStorage')) || []
const listElement = document.querySelector('.page-list')

renderPageList()

function renderPageList() {
  listElement.innerHTML = ''
  document.querySelector('.content-container').innerHTML = ''

  for (i = 0; i < pages.length; i++) {
    const page = pages[i]        

    listElement.innerHTML += `
      <li class="page-li page-${i}" onclick="selectPage(${i})">
        <img class="page-delete-icon" src="images/x-mark.png" onclick="event.stopPropagation(); deletePage(${i})">
        ${page.Name}
      </li>
    `
  }
}
function handleKeyPress(event) {
  if (event.keyCode === 13) {  savePageElement()  }
}
function selectPage(page) {
  const oldActivePage = document.querySelector('.page-li-active')
  const newActivePage = document.querySelector(`.page-${page}`)

  if (oldActivePage) {
    oldActivePage.classList.remove('page-li-active')
    newActivePage.classList.add('page-li-active')
  } else {
    newActivePage.classList.add('page-li-active')
  }

  loadNotesContent(page)
}
function loadNotesContent(page) {
  let oldActiveNotes = document.querySelector('.notes')

  if (oldActiveNotes) {
    oldActiveNotes.remove()

    const newActivePage = pages[page]
    const notesContent = newActivePage.Notes
    const newActiveNotes = document.createElement('textarea')
    newActiveNotes.classList.add(`notes`)
    newActiveNotes.classList.add(`notes-${page}`)
    newActiveNotes.onkeyup = () => saveNotesContent(page)
    newActiveNotes.innerHTML = newActivePage.Notes.replace(/<br>/g, '\n')
    document.querySelector('.content-container').appendChild(newActiveNotes)
  } else {
    const newActivePage = pages[page]
    const notesContent = newActivePage.Notes
    const newActiveNotes = document.createElement('textarea')
    newActiveNotes.classList.add(`notes`)
    newActiveNotes.classList.add(`notes-${page}`)
    newActiveNotes.onkeyup = () => saveNotesContent(page)
    newActiveNotes.innerHTML = newActivePage.Notes.replace(/<br>/g, '\n')
    document.querySelector('.content-container').appendChild(newActiveNotes)
  }
}
function saveNotesContent(page) {
  const activePage = pages[page]
  const notesContent = document.querySelector('.notes')

  if (activePage.Notes.length === notesContent.value.length) {
    return
  } else {
    activePage.Notes = notesContent.value.replace(/\n/g, '<br>')
    localStorage.setItem('pagesStorage', JSON.stringify(pages))
  }

}
function addPageElement() {      
  if (document.querySelector('.new-page')) {  return  }

  let newPageElement = document.createElement('li')
  newPageElement.classList.add('new-page')
  newPageElement.innerHTML = `
    <button class="page-save-button" onclick="savePageElement()">Save</button>
    <input class="page-name-input" type="text" onkeypress="handleKeyPress(event)">
  `
  listElement.appendChild(newPageElement)
  
  let inputNameElement = document.querySelector('.page-name-input')

  inputNameElement.focus()
}
function savePageElement() {
  const addPageElement = document.querySelector('.new-page')
  const newPageName = document.querySelector('.page-name-input')
  const pagesCount = pages.length

  let newPageElement = document.createElement('li')
  newPageElement.classList.add('page-li')
  newPageElement.classList.add(`page-${pagesCount}`)
  // Research this
  newPageElement.onclick = (event) => { event.stopPropagation(); selectPage(pagesCount);  }
  newPageElement.innerHTML = `
    <img class="page-delete-icon" src="images/x-mark.png" onclick="deletePage(${pagesCount})">
    ${newPageName.value}
  `

  listElement.appendChild(newPageElement)
  pages.push({Name: `${newPageName.value}`, Notes: ''})
  localStorage.setItem('pagesStorage', JSON.stringify(pages))
  selectPage(pagesCount)

  addPageElement.remove()
}
function deletePage(page) {
  pages.splice(page, 1)
  localStorage.setItem('pagesStorage', JSON.stringify(pages))
  renderPageList()
}