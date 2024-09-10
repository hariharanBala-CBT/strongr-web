document.addEventListener('DOMContentLoaded', function() {
    const formset = document.getElementById('happy-hour-formset');
    const addButton = document.getElementById('add-happy-hour');
    const totalForms = document.getElementById('id_happyhourpricing_set-TOTAL_FORMS');
    const table = document.getElementById('happy-hour-table');

    addButton.addEventListener('click', function() {
        const formCount = table.querySelectorAll('tbody tr').length;
        const newRow = table.querySelector('tbody tr').cloneNode(true);

        newRow.innerHTML = newRow.innerHTML.replace(/-0-/g, `-${formCount}-`);
        newRow.innerHTML = newRow.innerHTML.replace(/_0_/g, `_${formCount}_`);

        // Clear the values of the new row
        newRow.querySelectorAll('input, select').forEach(input => {
            input.value = '';
        });

        table.querySelector('tbody').appendChild(newRow);
        totalForms.value = formCount + 1;
        addEventListenersToRow(newRow);
    });

    table.querySelectorAll('tbody tr').forEach(addEventListenersToRow);

    // Attach event listeners for existing rows
    table.querySelectorAll('tbody tr').forEach(addEventListenersToRow);

    // Function to add event listeners for editing and deleting
    function addEventListenersToRow(row) {
        const editBtn = row.querySelector('.edit-row');
        const deleteBtn = row.querySelector('.delete-row');

        // Edit button functionality
        editBtn.addEventListener('click', function() {
            row.querySelectorAll('input, select').forEach(input => {
                input.removeAttribute('readonly');
                input.classList.add('editing');
            });
            editBtn.textContent = 'Save';
            editBtn.classList.remove('btn-primary');
            editBtn.classList.add('btn-success');
            editBtn.removeEventListener('click', arguments.callee);
            editBtn.addEventListener('click', saveRow);
        });

        // Delete button functionality
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this happy hour?')) {
                const deleteInput = row.querySelector('input[name$="DELETE"]');
                if (deleteInput) {
                    deleteInput.checked = true;  // Mark the hidden delete input as checked
                    row.style.display = 'none';  // Hide the row visually
                }
                row.remove()
                updateFormIndexes();  // Update form indexes after deletion
            }
        });
    }

    // Update form indexes after adding or deleting rows
    function updateFormIndexes() {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            row.innerHTML = row.innerHTML.replace(/-\d+-/g, `-${index}-`);
            row.innerHTML = row.innerHTML.replace(/_\d+_/g, `_${index}_`);
        });
        totalForms.value = rows.length;
    }
});
