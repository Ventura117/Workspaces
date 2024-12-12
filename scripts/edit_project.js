const url = window.location.pathname;
const projectId = url.split('/').pop();

fetch(`http://localhost:3000/projects/get_project/${projectId}`)
  .then(response => response.json())
  .then((data) => {
    loadProjectDetails(data);
  })

function loadProjectDetails(data) {
  document.querySelector('#project_id').value = data.project_id || '';
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

const commentsBtn = document.querySelector('.comments-btn')
commentsBtn.addEventListener('click', () => {
  toggleCommentsModal(true)
})
const manageBtn = document.querySelector('.manage-btn')
manageBtn.addEventListener('click', () => {
  getComments()
})

let comments = [];

function toggleCommentsModal(status) {
  if (status) {
    getComments();
    const modalOverlay = document.createElement('div');
      modalOverlay.classList.add('modal-overlay')
      document.body.appendChild(modalOverlay)
    const commentsModal = document.createElement('div');
      commentsModal.classList.add('comments-modal')
      document.body.appendChild(commentsModal)
    const commentsHeader = document.createElement('div');
      commentsHeader.classList.add('comments-header')
      commentsModal.appendChild(commentsHeader)
    const commentsHeaderText = document.createElement('p');
      commentsHeaderText.classList.add('comments-header-text')
      commentsHeaderText.textContent = 'Comments';
      commentsHeader.appendChild(commentsHeaderText);
    const commentsHeaderBtn = document.createElement('button');
      commentsHeaderBtn.textContent = 'X';
      commentsHeader.appendChild(commentsHeaderBtn);
      commentsHeaderBtn.addEventListener('click', function() {
        toggleCommentsModal();
      })
    const commentsBody = document.createElement('ul');
      commentsBody.classList.add('comments-body')
      commentsModal.appendChild(commentsBody)
      renderComments();
    const commentsFooter = document.createElement('div');
      commentsFooter.classList.add('comments-footer')
      commentsModal.appendChild(commentsFooter)
    const inputComment = document.createElement('input');
      inputComment.classList.add('comment-input')
      commentsFooter.appendChild(inputComment)
    const addCommentBtn = document.createElement('button');
      addCommentBtn.textContent = 'Add'
      commentsFooter.appendChild(addCommentBtn)
    addCommentBtn.addEventListener('click', () => {
      createComment();
    })
  } else {
    const modalOverlay = document.querySelector('.modal-overlay')
      modalOverlay.remove()
    const commentsModal = document.querySelector('.comments-modal')
      commentsModal.remove()
  }
}

function getComments() {
  fetch(`http://localhost:3000/projects/get_comments/${projectId}`)
    .then(response => response.json())
    .then((data) => {
      comments = data
      renderComments();
    })
}

function renderComments() {
  const commentsBody = document.querySelector('.comments-body');
  commentsBody.innerHTML = '';
  comments.forEach((comment) => {
    const commentElem = document.createElement('li');
      commentElem.textContent = comment.message;
      commentsBody.appendChild(commentElem)
  })
}
function createComment() {
  const newComment = document.querySelector('.comment-input').value
  
}
function updateComment() {

}
function deleteComment() {

}