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
        const rows = happyHourTable.querySelectorAll('tbody tr:not(.d-none):not(.to-be-deleted)');
        const errorList = document.getElementById('error-list') || createErrorList();
        errorList.innerHTML = '';
        const dayTimeRanges = {};

        rows.forEach((row, index) => {
            const deleteInput = row.querySelector('input[name$="-DELETE"]');
            if (deleteInput && deleteInput.value === 'on') {
                return; // Skip this row if it's marked for deletion
            }

            const gameType = row.querySelector('select[name$="-game_type"]').value;
            const dayOfWeek = row.querySelector('select[name$="-day_of_week"]').value;
            const startTime = row.querySelector('input[name$="-start_time"]').value;
            const endTime = row.querySelector('input[name$="-end_time"]').value;
            const priceInput = row.querySelector('input[name$="-price"]');

            // Reset row styling
            row.classList.remove('table-danger');

            if (priceInput && parseFloat(priceInput.value) < 0) {
                isValid = false;
                row.classList.add('table-danger');
                addError(`Row ${row.rowIndex}: Price cannot be negative.`);
            }

            if (startTime && endTime) {
                const start = new Date('1970-01-01T' + startTime);
                const end = new Date('1970-01-01T' + endTime);

                // Check if the end time is after the start time
                if (end <= start) {
                    isValid = false;
                    row.classList.add('table-danger');
                    addError(`Row ${row.rowIndex}: End time must be after start time.`);
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
                    ranges[i].row.classList.add('table-danger');
                    ranges[i - 1].row.classList.add('table-danger');
                    addError(`Rows ${ranges[i - 1].row.rowIndex} and ${ranges[i].row.rowIndex}: Overlapping time ranges.`);
                }
            }
        }

        errorList.closest('.alert').classList.toggle('d-none', isValid);
        return isValid;
    }

    function addError(message) {
        const errorList = document.getElementById('error-list');
        const errorItem = document.createElement('li');
        errorItem.textContent = message;
        errorList.appendChild(errorItem);
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
                input.disabled = false;
            }
        });
        newRow.querySelector('input[name$="-DELETE"]').value = '';
        newRow.classList.remove('d-none', 'to-be-deleted');
        newRow.style.display = '';
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
            rowToDelete.remove();  // Completely remove the row from the DOM
            updateFormIndexes();
            validateTimes();
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
        const rows = happyHourTable.querySelectorAll('tbody tr:not(.d-none):not(.to-be-deleted)');
        return Array.from(rows).some(row => {
            const inputs = row.querySelectorAll('input:not([type="hidden"]), select');
            return Array.from(inputs).some(input => !input.value.trim());
        });
    }

    addHappyHourButton.addEventListener('click', addNewRow);

    document.querySelectorAll('.delete-row').forEach(bindDeleteRowEvent);

    document.querySelector('form').addEventListener('submit', function (e) {
        let invalidElements = document.querySelectorAll('input:invalid, select:invalid');
        if (invalidElements.length > 0) {
            e.preventDefault();  // Prevent form submission if there are invalid elements
            invalidElements[0].scrollIntoView(); // Scroll to first invalid element
            invalidElements[0].focus();
        }
    });

    document.getElementById('upd-hh-form').addEventListener('submit', function(e) {
        e.preventDefault();  // Prevent default form submission

        updateFormIndexes();

        const allRows = happyHourTable.querySelectorAll('tbody tr');
        allRows.forEach(row => {
            const inputs = row.querySelectorAll('input, select');
            const isHidden = row.classList.contains('d-none') || row.classList.contains('to-be-deleted');
            inputs.forEach(input => {
                if (isHidden) {
                    input.disabled = true;  // Disable hidden inputs
                } else {
                    input.disabled = false;  // Enable visible inputs
                }
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
            validateTimes();  // Revalidate the form on every input change
        }
    });
});