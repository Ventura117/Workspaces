const http = require('http');
const fs = require('fs');
const { Client } = require('pg');
const { URL, URLSearchParams } = require('url');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'workspaces',
  password: '7654',
  port: 5432
});

client.connect()
  .then(() => console.log('Connected to Postgres!'))
  .catch(error => console.log('Failed to connect to Postgres!: ', error.routine))


// Create Server
const server = http.createServer((req, res) => {

  let filePath = '';

  // Home page routes
  if (req.method === 'GET' && req.url === '/') {
    filePath = './views/home.html'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading HTML!')
      } else {
        console.log('~~~ NEW PAGE ~~~')
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data)
      }
    })
  } 
  else if (req.method === 'GET' && req.url === '/home') {
    filePath = './views/home.html'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading HTML!')
      } else {
        console.log('~~~ NEW PAGE ~~~')
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data)
      }
    })
  } 
  else if (req.method === 'GET' && req.url === '/styles/home') {
    filePath = './styles/home.css'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading file!')
      } else {
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        res.end(data)
      }
    })
  }
  else if (req.method === 'GET' && req.url === '/scripts/home') {
    filePath = './scripts/home.js'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading file!')
      } else {
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/javascript');
        res.end(data)
      }
    })
  }
  else if (req.method === 'GET' && req.url === '/home/get_weather') {
    const weatherKey = 'c7f9faa1920dc7b5cb186959c5113192';
    const zipCode = 45244;
    const countryCode = 'us';
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${weatherKey}&units=imperial`)
      .then(response => response.json())
      .then((data, err) => {
        if (err) {
          res.statusCode = 200;
          res.end('Cannot get weather: ', err)
        } else {
          res.statusCode = 200;
          res.end(JSON.stringify(data))
        }
      })
      
  }


  // Projects page routes
  // GOOD
  else if (req.method === 'GET' && req.url.startsWith('/projects/get_projects')) {  
    console.log('Incoming GET projects...')
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    const statusFilter = reqUrl.searchParams.get('status')
      ? reqUrl.searchParams.get('status').split(',')
      : [];

    let query = 'SELECT * FROM projects';
    let queryParams = [];

    if (statusFilter.length > 0) {
      query = `SELECT * FROM projects WHERE status = ANY($1::text[])`;
      queryParams = [statusFilter];
    }

    client.query(query, queryParams, (err, result) => {
      if (err) {
        res.statusCode = 500;
        res.end('Database error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result.rows));
      }
    });
  }

  // GOOD
  else if (req.method === 'GET' && req.url === '/projects') {  // Typed link
    filePath = './views/projects.html'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading HTML!')
      } else {
        console.log('~~~ NEW PAGE ~~~')
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data)
      }
    })
  } 
  // GOOD
  else if (req.method === 'GET' && req.url === '/styles/projects') {  // Automatic
    filePath = './styles/projects.css'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading file!')
      } else {
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        res.end(data)
      }
    })
  }
  // GOOD
  else if (req.method === 'GET' && req.url === '/scripts/projects') {  // Automatic
    filePath = './scripts/projects.js'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading file!')
      } else {
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/javascript');
        res.end(data)
      }
    })
  }
  else if (req.method === 'POST' && req.url === '/projects/update_status') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
  
      const project = JSON.parse(body)

      const status = project.status;
      const projectId = project.project_id
  
      const query = `
        UPDATE projects
        SET
          status = $1
        WHERE project_id = $2
        RETURNING project_id
      `;
      const values = [
        status, projectId
      ];
  
      client.query(query, values)
        .then((result) => {
          if (result.rowCount === 0) {
            res.statusCode = 404;
            return res.end('Project not found.');
          }
          res.statusCode = 200;
          console.log(`${projectId} updated to ${status}.`)
          res.end(`Project id: ${projectId} updated successfully.`);
        })
        .catch((err) => {
          console.error('Error updating project:', err);
          res.statusCode = 500;
          res.end('Failed to update project.');
        });
    });
  }

  // Add project page routes
  // GOOD
  else if (req.method === 'GET' && req.url === '/projects/add_project') {  // Typed link - Clicked href
    filePath = './views/add_project.html'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading HTML!')
      } else {
        console.log('~~~ NEW PAGE ~~~')
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data)
      }
    })
  }
  // GOOD
  else if (req.method === 'GET' && req.url === '/styles/add_project') {  // Automatic
    filePath = './styles/add_project.css'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading file!')
      } else {
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        res.end(data)
      }
    })
  }
  // GOOD
  else if (req.method === 'GET' && req.url === '/scripts/add_project') {  // Automatic
    filePath = './scripts/add_project.js'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading file!')
      } else {
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/javascript');
        res.end(data)
      }
    })
  }
  // GOOD
  else if (req.method === 'POST' && req.url === '/projects/create_project') {  // Clicked button - POST - Add project button
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const formData = new URLSearchParams(body);
  
      const zendeskId = formData.get('zendesk_id') || null;
      const azureId = formData.get('azure_id') || null;
      const status = formData.get('status') || null;
      const sponsor = formData.get('sponsor') || null;
      const priority = formData.get('priority') || null;
      const assignee = formData.get('assignee') || null;
      const projectName = formData.get('project_name') || null;
      const dueDate = formData.get('due_date') || null;
      const projectTitle = formData.get('project_title') || null;
      const projectDescription = formData.get('project_description') || null;
      const acceptance = formData.get('acceptance') || null;
  
      const query = `
        INSERT INTO projects (
          zendesk_id, azure_id, status, sponsor, priority,
          assignee, project_name, due_date, project_title,
          project_description, acceptance
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, $11
        )
        RETURNING project_id
      `;
      const values = [
        zendeskId, azureId, status, sponsor, priority,
        assignee, projectName, dueDate, projectTitle,
        projectDescription, acceptance,
      ];
  
      client.query(query, values)
        .then((result) => {
          const projectId = result.rows[0].project_id;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: `Project ${projectId} updated successfully.` }));
        })
        .catch((err) => {
          console.error('Error inserting project:', err);
          res.statusCode = 500;
          res.end('Failed to create project.');
        });
    });
  }


  // Edit project page routes
  // GOOD
  else if (req.method === 'GET' && req.url.startsWith('/projects/get_project')) {  // Automatic - GET - Project details
    const projectId = req.url.split('/').pop();
    client.query('SELECT * FROM projects WHERE project_id = $1', [projectId], (err, result) => {
      if (err) {
        res.statusCode = 500;
        res.end('error')
      } else {
        res.statusCode = 200;
        console.log(`Sending project: ${projectId}`)
        res.end(JSON.stringify(result.rows[0]))
      }
    })
  }
  // GOOD
  else if (req.method === 'GET' && req.url.startsWith('/projects/edit_project')) {  // Typed link - Clicked href
    filePath = './views/edit_project.html'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading HTML!')
      } else {
        console.log('~~~ NEW PAGE ~~~')
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data)
      }
    })
  } 
  // GOOD
  else if (req.method === 'GET' && req.url === '/styles/edit_project') {  // Automatic
    filePath = './styles/edit_project.css'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading file!')
      } else {
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        res.end(data)
      }
    })
  }
  // GOOD
  else if (req.method === 'GET' && req.url === '/scripts/edit_project') {  // Automatic
    filePath = './scripts/edit_project.js'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading file!')
      } else {
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/javascript');
        res.end(data)
      }
    })
  }
  // GOOD
  else if (req.method === 'POST' && req.url === '/projects/update_project') {  // Clicked button - POST - Update project details
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const formData = new URLSearchParams(body);
  
      const projectId = formData.get('project_id') || null;
      const zendeskId = formData.get('zendesk_id') || null;
      const azureId = formData.get('azure_id') || null;
      const status = formData.get('status') || null;
      const sponsor = formData.get('sponsor') || null;
      const priority = formData.get('priority') || null;
      const assignee = formData.get('assignee') || null;
      const projectName = formData.get('project_name') || null;
      const dueDate = formData.get('due_date') || null;
      const projectTitle = formData.get('project_title') || null;
      const projectDescription = formData.get('project_description') || null;
      const acceptance = formData.get('acceptance') || null;
  
      if (!projectId) {
        res.statusCode = 400;
        return res.end('Project ID is required for updating a project.');
      }
  
      const query = `
        UPDATE projects
        SET
          zendesk_id = $1,
          azure_id = $2,
          status = $3,
          sponsor = $4,
          priority = $5,
          assignee = $6,
          project_name = $7,
          due_date = $8,
          project_title = $9,
          project_description = $10,
          acceptance = $11
        WHERE project_id = $12
        RETURNING project_id
      `;
      const values = [
        zendeskId, azureId, status, sponsor, priority,
        assignee, projectName, dueDate, projectTitle,
        projectDescription, acceptance, projectId,
      ];
  
      client.query(query, values)
        .then((result) => {
          if (result.rowCount === 0) {
            res.statusCode = 404;
            return res.end('Project not found.');
          }
          res.statusCode = 200;
          res.end(`Project id: ${projectId} updated successfully.`);
        })
        .catch((err) => {
          console.error('Error updating project:', err);
          res.statusCode = 500;
          res.end('Failed to update project.');
        });
    });
  }
  // IN PROGRESS
  else if (req.method === 'DELETE' && req.url === '/projects/delete_project') {

  }
  
  // Comments routes
  else if (req.method === 'GET' && req.url.startsWith('/projects/get_comments')) {
    const projectId = req.url.split('/').pop();
    client.query(`SELECT * FROM comments WHERE project_id = $1`, [projectId], (err, result) => {
      if (err) {
        res.statusCode = 500;
        res.end('error')
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify(result.rows))
      }
    })
  }
  else if (req.method === 'POST' && req.url === '/projects/create_comment') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      let parsedBody = JSON.parse(body)
      let projectId = parsedBody.project_id;
      let message = parsedBody.message
  
      const query = `
        INSERT INTO comments (
          project_id, message
        )
        VALUES (
          $1, $2
        )
        RETURNING comment_id
      `;
      const values = [
        projectId, message
      ];
  
      client.query(query, values)
        .then((result) => {
          const commentId = result.rows[0].comment_id;
          console.log(`Created comment ${commentId}`)
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: `Comment ${commentId} created successfully.` }));
        })
        .catch((err) => {
          console.error('Error inserting comment:', err);
          res.statusCode = 500;
          res.end('Failed to create comment.');
        });
    })
  }

  else if (req.method === 'GET' && req.url === '/projects/update_comment') {

  }
  else if (req.method === 'DELETE' && req.url === '/projects/delete_comment') {

  }

  
  // Notes page routes
  else if (req.method === 'GET' && req.url === '/notes') {  // Typed link - Clicked href
    filePath = './views/notes.html'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading HTML!')
      } else {
        console.log('~~~ NEW PAGE ~~~')
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data)
      }
    })
  }
  else if (req.method === 'GET' && req.url === '/styles/notes') {  // Automatic
    filePath = './styles/notes.css'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading HTML!')
      } else {
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        res.end(data)
      }
    })
  }
  else if (req.method === 'GET' && req.url === '/scripts/notes') {  // Automatic
    filePath = './scripts/notes.js'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading file!')
      } else {
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/javascript');
        res.end(data)
      }
    })
  }
  else if (req.method === 'GET' && req.url === '/notes/get_notes') {

  }
  else if (req.method === 'POST' && req.url === '/notes/add_page') {

  }
  else if (req.method === 'POST' && req.url === '/notes/update_note') {

  }
  else if (req.method === 'DELETE' && req.url === '/notes/delete_note') {

  }

  // Wiki page routes
  else if (req.method === 'GET' && req.url === '/wiki') {  // Typed link - Clicked href
    filePath = './views/wiki.html'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading HTML!')
      } else {
        console.log('~~~ NEW PAGE ~~~')
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data)
      }
    })
  }
  else if (req.method === 'GET' && req.url === '/styles/wiki') {  // Automatic
    filePath = './styles/wiki.css'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading HTML!')
      } else {
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        res.end(data)
      }
    })
  }
  else if (req.method === 'GET' && req.url === '/scripts/wiki') {  // Automatic
    filePath = './scripts/wiki.js'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading file!')
      } else {
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/javascript');
        res.end(data)
      }
    })
  }
  else if (req.method === 'GET' && req.url === '/wiki/get_topics') {  // 

  }
  else if (req.method === 'POST' && req.url === '/wiki/add_topic') {  // 

  }
  else if (req.method === 'POST' && req.url === '/wiki/add_syntax') {  // 

  }
  else if (req.method === 'POST' && req.url === '/wiki/edit_syntax') {  // 

  }
  else if (req.method === 'POST' && req.url === '/wiki/delete_syntax') {  // 

  }


  else if (req.method === 'GET' && req.url === '/styles/layout') {
    let displayTheme;
    client.query('SELECT * FROM app_settings', (err, result) => {
      if (err) {
        res.statusCode = 500;
        res.end('error')
      } else {
        displayTheme = result.rows[0].config_value;
        if (displayTheme === 'dark') {
          fs.readFile('./styles/layout-dark.css', (err, data) => {
            if (err) {
              console.log('Error reading: ', './styles/layout-dark.css');
              res.statusCode = 400;
              res.setHeader('Content-Type', 'text/html');
              res.end('Error loading file!')
            } else {
              console.log('Sending: ', './styles/layout-dark.css')
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/css');
              res.end(data)
            }
          })
        } else {
          fs.readFile('./styles/layout-light.css', (err, data) => {
            if (err) {
              console.log('Error reading: ', './styles/layout-light.css');
              res.statusCode = 400;
              res.setHeader('Content-Type', 'text/html');
              res.end('Error loading file!')
            } else {
              console.log('Sending: ', './styles/layout-light.css')
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/css');
              res.end(data)
            }
          })
        }
      }
    })
  }

  else if (req.method === 'GET' && req.url === '/scripts/layout') {
    filePath = './scripts/layout.js'
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('Error reading: ', filePath);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Error loading file!')
      } else {
        console.log('Sending: ', filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/javascript');
        res.end(data)
      }
    })
  }
  else if (req.method === 'GET' && req.url === '/get_theme') {
    let displayTheme;
    client.query('SELECT * FROM app_settings', (err, result) => {
      if (err) {
        res.statusCode = 500;
        res.end('error')
      } else {
        displayTheme = result.rows[0].config_value;
        res.statusCode = 200;
        res.end(displayTheme);
      }
    })
  }
  else if (req.method === 'POST' && req.url === '/update_theme') {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString(); // Collect data from the request
    });

    req.on('end', () => {
        const { displayTheme } = JSON.parse(body); // Parse the JSON body

        // Update the database
        client.query(
            'UPDATE app_settings SET config_value = $1 WHERE config_key = $2',
            [displayTheme, 'displayTheme'],
            (err, result) => {
                if (err) {
                    console.error('Database update error:', err);
                    res.statusCode = 500;
                    res.end('Failed to update display theme');
                } else {
                    console.log('Display theme updated to:', displayTheme);
                    res.statusCode = 200;
                    res.end('Display theme updated successfully');
                }
            }
        );
    });
}

  // All other error handling
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Page not found!');
  }
})

// Listen Server
server.listen(3000, 'localhost', () => {
  console.log('~~~ Listening on http://localhost:3000/ ~~~')
})
