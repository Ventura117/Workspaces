function toggleContent(category) {
  const arrow = document.querySelector(`.${category}-img`)
  const content = document.querySelector(`.${category}-content`)

  if (content.classList.contains('is-toggled')) {
    content.classList.remove('is-toggled')
    arrow.src = 'images/up-arrow.png'
  } else {
    content.classList.add('is-toggled')
    arrow.src = 'images/down-arrow.png'
  }
}