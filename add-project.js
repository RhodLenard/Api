document.addEventListener('DOMContentLoaded', function() {
  let projectId = 1;

  const submitBtn = document.getElementById('submitBtn');
  const projectTable = document.getElementById('projectTable').getElementsByTagName('tbody')[0];

  // Fetch projects on page load
  fetchProjects();

  submitBtn.addEventListener('click', async function() {
    const projectName = document.getElementById('projectName').value.trim();
    const projectDescription = document.getElementById('projectDescription').value.trim();
    const projectCategory = document.getElementById('projectCategory').value;

    if (projectName !== '') {
      const project = {
        name: projectName,
        description: projectDescription,
        category_id: projectCategory,
        user_id: 1
      };

      try {
        const response = await fetch('https://api-azvo.onrender.com/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(project)
        });
        const data = await response.json();
        if (data.success) {
          addProjectToTable(data.project);
        }
      } catch (error) {
        console.error('Error:', error);
      }

      // Clear form fields
      document.getElementById('projectName').value = '';
      document.getElementById('projectDescription').value = '';
      document.getElementById('projectCategory').selectedIndex = 0;
    }
  });

  function addProjectToTable(project) {
    const newRow = projectTable.insertRow();
    newRow.innerHTML = `
      <th scope="row">${project.project_id}</th>
      <td>${project.name}</td>
      <td>${project.category_id}</td>
      <td>
        <a class="icons edit-btn" href="#"><i class="fa-regular fa-pen-to-square"></i></a>
        <a class="icons delete-btn" href="#"><i class="fa-solid fa-trash"></i></a>
      </td>
    `;

    // Attach event listeners for the new buttons
    attachEventListeners();
  }

  async function fetchProjects() {
    try {
      const response = await fetch('https://api-azvo.onrender.com/projects');
      const projects = await response.json();
      projects.forEach(project => addProjectToTable(project));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  function attachEventListeners() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    editButtons.forEach(btn => {
      btn.addEventListener('click', function(event) {
        event.preventDefault();
        const row = btn.closest('tr');
        const nameCell = row.cells[1];
        const categoryCell = row.cells[2];

        const newName = prompt("Edit Project Name:", nameCell.textContent);
        if (newName) {
          nameCell.textContent = newName;
          updateProject(row.cells[0].textContent, { name: newName, category: categoryCell.textContent });
        }

        const newCategory = prompt("Edit Project Category:", categoryCell.textContent);
        if (newCategory) {
          categoryCell.textContent = newCategory;
          updateProject(row.cells[0].textContent, { name: nameCell.textContent, category: newCategory });
        }
      });
    });

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', async function(event) {
        event.preventDefault();
        const row = btn.closest('tr');
        const projectId = row.cells[0].textContent;
        try {
          const response = await fetch(`https://api-azvo.onrender.com/project/${projectId}`, {
            method: 'DELETE'
          });
          const data = await response.json();
          if (data.success) {
            row.remove();
          }
        } catch (error) {
          console.error('Error deleting project:', error);
        }
      });
    });
  }

  async function updateProject(id, project) {
    try {
      await fetch(`https://api-azvo.onrender.com/project/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      });
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }

  // Initial call to attach event listeners to existing buttons
  attachEventListeners();
});