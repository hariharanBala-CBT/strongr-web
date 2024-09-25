document.addEventListener('DOMContentLoaded', function() {
    const happyHourTable = document.getElementById('happy-hour-table');
    const addHappyHourButton = document.getElementById('add-happy-hour');
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const validationWarningModal = new bootstrap.Modal(document.getElementById('validationWarningModal'));
    const confirmDeleteButton = document.getElementById('confirmDelete');
    const totalForms = document.getElementById('id_happyhourpricing_set-TOTAL_FORMS');
    let rowToDelete = null;

    // Add loading spinner to submit button
    const submitButton = document.querySelector('button[type="submit"]');
    const loadingSpinner = document.createElement('span');
    loadingSpinner.className = 'spinner-border spinner-border-sm ms-2 d-none';
    submitButton.appendChild(loadingSpinner);

    function validateTimes() {
        let isValid = true;
        const rows = happyHourTable.querySelectorAll('tbody tr:not(.d-none)');
        const errorList = document.getElementById('error-list') || createErrorList();
        errorList.innerHTML = '';
        const dayTimeRanges = {};

        rows.forEach((row, index) => {
            const gameType = row.querySelector('select[name$="-game_type"]').value;
            const dayOfWeek = row.querySelector('select[name$="-day_of_week"]').value;
            const startTime = row.querySelector('input[name$="-start_time"]').value;
            const endTime = row.querySelector('input[name$="-end_time"]').value;

            // Reset row styling
            row.classList.remove('table-danger');
            clearRowError(row);  // Custom function to clear row error

            if (startTime && endTime) {
                const start = new Date('1970-01-01T' + startTime);
                const end = new Date('1970-01-01T' + endTime);

                // Check if the end time is after the start time
                if (end <= start) {
                    isValid = false;
                    row.classList.add('table-danger');
                    displayRowError(row, `End time must be after start time.`);  // Custom function to show row error
                }

                // Check for overlapping times on the same day and game type
                const key = `${gameType}-${dayOfWeek}`;
                if (!dayTimeRanges[key]) {
                    dayTimeRanges[key] = [];
                }
                dayTimeRanges[key].push({ start, end, row });
            }
        });

        // Check for overlapping time ranges within the same day and game type
        for (const key in dayTimeRanges) {
            const ranges = dayTimeRanges[key];
            ranges.sort((a, b) => a.start - b.start);
            for (let i = 1; i < ranges.length; i++) {
                if (ranges[i].start < ranges[i - 1].end) {
                    isValid = false;
                    displayRowError(ranges[i].row, `Overlapping with row ${ranges[i - 1].row.rowIndex}.`);
                    displayRowError(ranges[i - 1].row, `Overlapping with row ${ranges[i].row.rowIndex}.`);
                }
            }
        }

        errorList.closest('.alert').classList.toggle('d-none', isValid);
        return isValid;
    }

    function clearRowError(row) {
        const errorMessage = row.querySelector('.row-error');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function displayRowError(row, message) {
        const errorSpan = document.createElement('span');
        errorSpan.className = 'text-danger row-error';
        errorSpan.textContent = message;
        row.querySelector('td:last-child').appendChild(errorSpan);
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

    function hasEmptyRow() {
        const rows = happyHourTable.querySelectorAll('tbody tr:not(.d-none)');
        return Array.from(rows).some(row => {
            const inputs = row.querySelectorAll('input:not([type="hidden"]), select');
            return Array.from(inputs).some(input => !input.value.trim());
        });
    }

    addHappyHourButton.addEventListener('click', addNewRow);

    document.querySelectorAll('.delete-row').forEach(bindDeleteRowEvent);

    document.querySelector('form').addEventListener('submit', function (e) {
        let invalidElements = document.querySelectorAll('input:invalid');
        invalidElements.forEach(function (element) {
            element.scrollIntoView(); // Scroll to invalid element if needed
            element.focus();
        });
    });
    

    document.getElementById('upd-hh-form').addEventListener('submit', function(e) {
        e.preventDefault();  // Prevent default form submission

        updateFormIndexes();

        const hiddenRows = happyHourTable.querySelectorAll('tbody tr.d-none');
        hiddenRows.forEach(row => {
            row.querySelectorAll('input, select').forEach(input => {
                input.disabled = true;  // Disable hidden inputs so they are excluded from validation
            });
        });

        if (validateTimes()) {
            loadingSpinner.classList.remove('d-none');  // Show loading spinner
            submitButton.disabled = true;  // Disable button to prevent multiple clicks
            this.submit();  // Submit form after validation
        }
    });

    happyHourTable.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            e.target.closest('tr').classList.remove('table-danger');
            clearRowError(e.target.closest('tr'));  // Clear the error for the specific row
            validateTimes();  // Revalidate the form on every input change
        }
    });
});
