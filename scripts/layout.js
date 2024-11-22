const displayThemeChanger = document.querySelector('.display-theme-select');

fetch('/get_theme')
  .then(response => response.text())
  .then(data => {
    if (data === 'light') {
      displayThemeChanger.innerHTML = `
        <option value="light" selected>light</option>
        <option value="dark">dark</option>
      `
    } else {
      displayThemeChanger.innerHTML = `
      <option value="light">light</option>
      <option value="dark" selected>dark</option>
    `
    }
  })

displayThemeChanger.addEventListener('change', () => {
  displayTheme = displayThemeChanger.value;
  fetch('/update_theme', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ displayTheme })
  })
  .then((response) => {
    if (response.ok) {
      console.log('Display theme updated successfully')
      changeDisplayTheme(displayTheme)
    } else {
      console.error('Failed to update display theme')
    }
  })
  .catch((error) => {
    console.error('Error: ', error)
  })
})

function changeDisplayTheme() {
  fetch('http://localhost:3000/styles/layout') // Request the new CSS file
  .then(response => {
    if (response.ok) {
      return response.text(); // Parse the response as plain text
    } else {
      console.log('Failed to load CSS, status code:', response.status);
      return ''; // Return an empty string if the fetch fails
    }
  })
  .then(cssText => {
    if (cssText) { // Only proceed if we have valid CSS content
      // Remove the specific <link> element
      const layoutLink = document.querySelector('link[href="http://localhost:3000/styles/layout"]');
      if (layoutLink) {
        layoutLink.remove();
        console.log('Removed layout stylesheet.');
      }

      // Inject the new CSS as a <style> element
      const styleElement = document.createElement('style');
      styleElement.textContent = cssText;
      document.head.appendChild(styleElement);
      console.log('New CSS applied successfully!');
    } else {
      console.log('No CSS was applied.');
    }
  })
  .catch(error => console.log('Error fetching CSS:', error));
}