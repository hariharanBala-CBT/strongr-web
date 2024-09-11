document.addEventListener('DOMContentLoaded', function() {
    const formset = document.getElementById('happy-hour-formset');
    const addButton = document.getElementById('add-happy-hour');
    const totalForms = document.getElementById('id_happyhourpricing_set-TOTAL_FORMS');
    const table = document.getElementById('happy-hour-table');
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    let rowToDelete = null;

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

    // Function to add event listeners for editing and deleting
    function addEventListenersToRow(row) {
        const deleteBtn = row.querySelector('.delete-row');

        // Delete button functionality
        deleteBtn.addEventListener('click', function() {
            rowToDelete = row;
            deleteModal.show();
        });
    }

    // Confirm delete button in modal
    document.getElementById('confirmDelete').addEventListener('click', function() {
        if (rowToDelete) {
            const deleteInput = rowToDelete.querySelector('input[name$="DELETE"]');
            if (deleteInput) {
                deleteInput.checked = true;  // Mark the hidden delete input as checked
                rowToDelete.style.display = 'none';  // Hide the row visually
            }
            rowToDelete.remove();
            updateFormIndexes();  // Update form indexes after deletion
            deleteModal.hide();
            rowToDelete = null;
        }
    });

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