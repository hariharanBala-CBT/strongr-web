document.addEventListener('DOMContentLoaded', function() {
    const happyHourTable = document.getElementById('happy-hour-table');
    const addHappyHourButton = document.getElementById('add-happy-hour');
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const validationWarningModal = new bootstrap.Modal(document.getElementById('validationWarningModal'));
    const confirmDeleteButton = document.getElementById('confirmDelete');
    const totalForms = document.getElementById('id_happyhourpricing_set-TOTAL_FORMS');
    let rowToDelete = null;

    function validateTimes() {
        let isValid = true;
        const rows = happyHourTable.querySelectorAll('tbody tr:not(.d-none)');
        const errorList = document.getElementById('error-list') || createErrorList();
        errorList.innerHTML = '';
        const dayTimeRanges = {};

        rows.forEach((row, index) => {
            const dayOfWeek = row.querySelector('select[name$="-day_of_week"]').value;
            const startTime = row.querySelector('input[name$="-start_time"]').value;
            const endTime = row.querySelector('input[name$="-end_time"]').value;

            // Reset row styling
            row.classList.remove('table-danger');

            if (startTime && endTime) {
                const start = new Date('1970-01-01T' + startTime);
                const end = new Date('1970-01-01T' + endTime);

                // Check if the end time is after the start time
                if (end <= start) {
                    isValid = false;
                    row.classList.add('table-danger');
                    const errorMessage = document.createElement('li');
                    errorMessage.textContent = `Happy Hour ${index + 1}: End time must be after start time.`;
                    errorList.appendChild(errorMessage);
                }

                // Check for overlapping times on the same day
                if (!dayTimeRanges[dayOfWeek]) {
                    dayTimeRanges[dayOfWeek] = [];
                }
                dayTimeRanges[dayOfWeek].push({ start, end, row });
            }
        });

        // Check for overlapping time ranges within the same day
        for (const day in dayTimeRanges) {
            const ranges = dayTimeRanges[day];
            ranges.sort((a, b) => a.start - b.start);
            for (let i = 1; i < ranges.length; i++) {
                if (ranges[i].start < ranges[i - 1].end) {
                    isValid = false;
                    ranges[i].row.classList.add('table-danger');
                    ranges[i - 1].row.classList.add('table-danger');

                    const errorMessage = document.createElement('li');
                    errorMessage.textContent = `Overlapping times found on ${day} between row ${ranges[i - 1].row.rowIndex} and ${ranges[i].row.rowIndex}.`;
                    errorList.appendChild(errorMessage);
                }
            }
        }

        errorList.closest('.alert').classList.toggle('d-none', isValid);
        return isValid;
    }

    function createErrorList() {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger d-none';
        alertDiv.id = 'error-alert';
        const errorList = document.createElement('ul');
        errorList.id = 'error-list';
        alertDiv.appendChild(errorList);
        happyHourTable.parentNode.insertBefore(alertDiv, happyHourTable);
        return errorList;
    }

    function hasEmptyRow() {
        const rows = happyHourTable.querySelectorAll('tbody tr:not(.d-none)');
        return Array.from(rows).some(row => {
            const inputs = row.querySelectorAll('input:not([type="hidden"]), select');
            return Array.from(inputs).some(input => !input.value.trim());
        });
    }

    function updateFormIndexes() {
        const rows = happyHourTable.querySelectorAll('tbody tr:not(.d-none)');
        rows.forEach((row, index) => {
            row.querySelectorAll('input, select').forEach(input => {
                const oldName = input.name;
                const newName = oldName.replace(/-\d+-/, `-${index}-`);
                input.name = newName;
                input.id = input.id.replace(/-\d+-/, `-${index}-`);
            });
        });
        totalForms.value = rows.length;
    }

    function addNewRow() {
        if (hasEmptyRow()) {
            showValidationModal('Please fill all fields in the existing rows before adding a new one.');
            return;
        }

        const newRow = happyHourTable.querySelector('tbody tr').cloneNode(true);
        newRow.querySelectorAll('input, select').forEach(input => {
            input.value = '';
            if (input.type !== 'hidden') {
                input.required = true;
            }
        });
        newRow.querySelector('input[name$="-DELETE"]').value = '';
        newRow.classList.remove('d-none');
        happyHourTable.querySelector('tbody').appendChild(newRow);
        updateFormIndexes();
        bindDeleteRowEvent(newRow.querySelector('.delete-row'));
    }

    function bindDeleteRowEvent(deleteButton) {
        deleteButton.addEventListener('click', function() {
            rowToDelete = this.closest('tr');
            deleteConfirmModal.show();
        });
    }

    confirmDeleteButton.addEventListener('click', function() {
        if (rowToDelete) {
            const deleteInput = rowToDelete.querySelector('input[name$="-DELETE"]');
            if (deleteInput) {
                deleteInput.value = 'on';
                rowToDelete.style.display = 'none';
                rowToDelete.classList.add('to-be-deleted');
            } else {
                // If it's a new row that hasn't been saved yet, just remove it
                rowToDelete.remove();
            }
            updateFormIndexes();
            deleteConfirmModal.hide();
            rowToDelete = null;
        }
    });

    function showValidationModal(message) {
        const validationMessage = document.getElementById('validationMessage');
        validationMessage.textContent = message;
        validationWarningModal.show();
    }

    addHappyHourButton.addEventListener('click', addNewRow);

    document.querySelectorAll('.delete-row').forEach(bindDeleteRowEvent);

    document.getElementById('upd-game-form').addEventListener('submit', function(e) {
        updateFormIndexes();
        if (!validateTimes()) {
            e.preventDefault();
        }
    });

    happyHourTable.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            e.target.closest('tr').classList.remove('table-danger');
            validateTimes();
        }
    });
});