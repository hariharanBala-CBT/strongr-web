document.addEventListener('DOMContentLoaded', function() {
    const happyHourFormSection = document.getElementById('hhf');
    const addHappyButton = document.getElementById('add-happy');
    const addHappyHourButton = document.getElementById('add-happy-hour');
    const happyHourTable = document.getElementById('happy-hour-table');
    const totalForms = document.getElementById('id_happyhourpricing_set-TOTAL_FORMS');
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const alertPlaceholder = document.getElementById('alert-placeholder');
    let rowToDelete = null;
    let lastValidatedRow = null;

    addHappyButton.addEventListener('click', function() {
        happyHourFormSection.classList.remove('d-none');
        addHappyButton.classList.add('d-none');
    });

    addHappyHourButton.addEventListener('click', function() {
        addNewHappyHourRow();
    });

    function addNewHappyHourRow() {
        const formIdx = parseInt(totalForms.value);
        const newRow = document.querySelector('.happy-hour-row').cloneNode(true);

        newRow.querySelectorAll('input, select').forEach(input => {
            input.value = '';
            input.name = input.name.replace(/-\d+-/, `-${formIdx}-`);
            input.id = input.id.replace(/-\d+-/, `-${formIdx}-`);
        });

        happyHourTable.querySelector('tbody').appendChild(newRow);
        totalForms.value = formIdx + 1;

        bindDeleteRowEvent(newRow.querySelector('.delete-row'));
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
            const price = row.querySelector('input[name$="-price"]').value;

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

    function validateRequiredFields() {
        let isValid = true;
        const rows = happyHourTable.querySelectorAll('tbody tr:not(.d-none)');
        let validationMessages = [];

        rows.forEach((row, index) => {
            const dayOfWeek = row.querySelector('select[name$="-day_of_week"]').value;
            const startTime = row.querySelector('input[name$="-start_time"]').value;
            const endTime = row.querySelector('input[name$="-end_time"]').value;
            const price = row.querySelector('input[name$="-price"]').value;

            if (!dayOfWeek || !startTime || !endTime || !price) {
                isValid = false;
                validationMessages.push(`Happy Hour ${index + 1}: All fields are required.`);
                row.classList.add('table-danger');
            }
        });

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
        updateFormIndexes();
        const isFormValid = validateForm();
        const areFieldsValid = validateRequiredFields();

        if (!isFormValid || !areFieldsValid) {
            e.preventDefault();
        }
    });

    happyHourTable.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            e.target.closest('tr').classList.remove('table-danger');
            hideAlert();
            validateForm();
        }
    });
});
