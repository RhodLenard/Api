document.getElementById('submitBtn').addEventListener('click', function() {
  const nameTextarea = document.getElementById('nameTextarea');
  const name = nameTextarea.value.trim();

  if (name) {
    fetch('http://localhost:5003/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error('Error:', data.error);
      } else {
        addCategoryToTable(data.id, name);
        nameTextarea.value = '';
      }
    })
    .catch(error => console.error('Error:', error));
  } else {
    alert('Please enter a name.');
  }
});

function addCategoryToTable(id, name) {
  const table = document.getElementById('categoryTable').getElementsByTagName('tbody')[0];
  const row = table.insertRow();

  row.insertCell(0).textContent = id;
  row.insertCell(1).textContent = name;
  const actionsCell = row.insertCell(2);
  actionsCell.innerHTML = `
    <a class="icons" href="#" onclick="openEditModal(this, ${id}, '${name}')"><i class="fa-regular fa-pen-to-square"></i></a>
    <a class="icons" href="#" onclick="deleteCategory(${id})"><i class="fa-solid fa-trash"></i></a>
  `;
}

function deleteCategory(categoryId) {
  if (confirm("Are you sure you want to delete this category?")) {
    fetch(`http://localhost:5003/category/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(error => { throw new Error(error.error); });
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message || 'Category deleted successfully');
      fetchCategories();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to delete category. Please try again.");
    });
  }
}

function openEditModal(element, id, name) {
  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
  modal.show();

  // Populate the modal with the current category name
  document.getElementById('editName').value = name;

  // Set up event listener for the "Save changes" button
  document.getElementById('saveChangesBtn').onclick = function() {
    const newName = document.getElementById('editName').value.trim();
    if (newName) {
      // Send PUT request to update category name
      fetch(`http://localhost:5003/category/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error:', data.error);
        } else {
          // Update the category name in the table
          const categoryRow = element.closest('tr');
          categoryRow.cells[1].textContent = newName;

          // Hide the modal after successful update
          modal.hide();
        }
      })
      .catch(error => console.error('Error:', error));
    } else {
      alert('Please enter a name.');
    }
  };
}

// Load categories from server on page load
document.addEventListener('DOMContentLoaded', function() {
  fetchCategories();
});

function fetchCategories() {
  fetch('http://localhost:5003/category')
    .then(response => response.json())
    .then(categories => {
      const tableBody = document.getElementById('categoryTable').getElementsByTagName('tbody')[0];
      tableBody.innerHTML = ''; // Clear existing rows
      categories.forEach(category => {
        addCategoryToTable(category.category_id, category.name);
      });
    })
    .catch(error => console.error('Error:', error));
}