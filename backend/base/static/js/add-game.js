document.addEventListener('DOMContentLoaded', function() {
    const happyHourFormSection = document.getElementById('hhf');
    const addHappyButton = document.getElementById('add-happy');
    const addHappyHourButton = document.getElementById('add-happy-hour');
    const happyHourTable = document.getElementById('happy-hour-table');
    const totalForms = document.getElementById('id_happyhourpricing_set-TOTAL_FORMS');
    const validationWarningModal = new bootstrap.Modal(document.getElementById('validationWarningModal'));
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const alertPlaceholder = document.getElementById('alert-placeholder');
    let rowToDelete = null;
    let happyHourAdded = false;
    
    addHappyButton.addEventListener('click', function() {
        happyHourFormSection.classList.remove('d-none');
        addHappyButton.classList.add('d-none');
        happyHourAdded = true;
    });

    addHappyHourButton.addEventListener('click', function() {
        addNewHappyHourRow();
    });

    function hasEmptyRow() {
        const rows = happyHourTable.querySelectorAll('tbody tr:not(.d-none)');
        return Array.from(rows).some(row => {
            const inputs = row.querySelectorAll('input:not([type="hidden"]), select');
            return Array.from(inputs).some(input => !input.value.trim());
        });
    }

    function showValidationModal(message) {
        const validationMessage = document.getElementById('validationMessage');
        validationMessage.textContent = message;
        validationWarningModal.show();
    }

    function addNewHappyHourRow() {
        if (hasEmptyRow()) {
            showValidationModal('Please fill all fields in the existing rows before adding a new one.');
            return;
        }
        const formIdx = parseInt(totalForms.value);
        const newRow = createHappyHourRow(formIdx);

        happyHourTable.querySelector('tbody').appendChild(newRow);
        totalForms.value = formIdx + 1;

        bindDeleteRowEvent(newRow.querySelector('.delete-row'));
    }

    function createHappyHourRow(formIdx) {
        const newRow = document.createElement('tr');
        newRow.classList.add('happy-hour-row');
        newRow.innerHTML = `
            <td>${createSelect('day_of_week', formIdx)}</td>
            <td><input type="time" name="happyhourpricing_set-${formIdx}-start_time" required></td>
            <td><input type="time" name="happyhourpricing_set-${formIdx}-end_time" required></td>
            <td><input type="number" step="0.01" name="happyhourpricing_set-${formIdx}-price" required></td>
            <td class="align-middle"><button type="button" class="btn btn-danger delete-row"><i class="fa-solid fa-trash"></i></button></td>
        `;
        return newRow;
    }

    // Helper function to create the day of week select
    function createSelect(name, formIdx) {
        const select = document.createElement('select');
        select.name = `happyhourpricing_set-${formIdx}-${name}`;
        select.required = true;

        // Add the null or default option
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "----";  // Display this as the default
        select.appendChild(defaultOption);

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        days.forEach((day, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = day;
            select.appendChild(option);
        });

        return select.outerHTML;
    }



    function bindDeleteRowEvent(deleteButton) {
        deleteButton.addEventListener('click', function() {
            rowToDelete = this.closest('tr');
            deleteConfirmModal.show();
        });
    }

    document.getElementById('confirmDelete').addEventListener('click', function() {
        if (rowToDelete) {
            rowToDelete.remove();
            updateFormIndexes();
            rowToDelete = null;
            deleteConfirmModal.hide();
        }
    });

    function showAlert(message) {
        alertPlaceholder.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }

    function hideAlert() {
        alertPlaceholder.innerHTML = '';
    }

    function validateForm() {
        let isValid = true;
        let validationMessages = [];
        const rows = happyHourTable.querySelectorAll('tbody tr:not(.d-none)');
        const dayTimeRanges = {};

        rows.forEach((row, index) => {
            const dayOfWeek = row.querySelector('select[name$="-day_of_week"]').value;
            const startTime = row.querySelector('input[name$="-start_time"]').value;
            const endTime = row.querySelector('input[name$="-end_time"]').value;

            row.classList.remove('table-danger');

            if (startTime && endTime) {
                const start = new Date('1970-01-01T' + startTime);
                const end = new Date('1970-01-01T' + endTime);

                if (end <= start) {
                    isValid = false;
                    validationMessages.push(`Happy Hour ${index + 1}: End time must be after start time.`);
                    row.classList.add('table-danger');
                }

                if (!dayTimeRanges[dayOfWeek]) {
                    dayTimeRanges[dayOfWeek] = [];
                }
                dayTimeRanges[dayOfWeek].push({ start, end, row });
            }
        });

        for (const day in dayTimeRanges) {
            const ranges = dayTimeRanges[day];
            ranges.sort((a, b) => a.start - b.start);
            for (let i = 1; i < ranges.length; i++) {
                if (ranges[i].start < ranges[i - 1].end) {
                    isValid = false;
                    ranges[i].row.classList.add('table-danger');
                    ranges[i - 1].row.classList.add('table-danger');

                    validationMessages.push(`Overlapping times found on ${day} between row ${ranges[i - 1].row.rowIndex} and ${ranges[i].row.rowIndex}.`);
                }
            }
        }

        if (!isValid) {
            showAlert(validationMessages.join('<br>'));
        }

        return isValid;
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

    document.querySelectorAll('.delete-row').forEach(bindDeleteRowEvent);

    document.getElementById('add-game-form').addEventListener('submit', function(e) {
        if (happyHourAdded) {
            updateFormIndexes();
            const isFormValid = validateForm();
            if (!isFormValid) {
                e.preventDefault(); // Prevent form submission if validation fails
            }
        } else {
            // If happy hours weren't added, set TOTAL_FORMS to 0
            totalForms.value = '0';
        }
    });

    happyHourTable.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            e.target.closest('tr').classList.remove('table-danger');
            hideAlert();
            validateForm();
        }
    });

    // Add required attribute to existing fields
    happyHourTable.querySelectorAll('input:not([type="hidden"]), select').forEach(input => {
        input.required = true;
    });
});