function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function initFormSubmission() {
    $('#tab-content form').submit(function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const csrftoken = getCookie('csrftoken');

        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': csrftoken,
                'X-Requested-With': 'XMLHttpRequest'
            },
               success: function(response) {
            if (response.status === 'success') {
                showToast(response.message);

            } else {
                showToast(response.message || 'Error submitting form.');
            }
        },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                showToast('Error submitting form. ' + error);
            }
        });
    });
}


$(document).ready(function () {
    $('#nextTabBtn').click(function () {
        const activeTab = $('.tab-button.active');
        const nextTab = activeTab.next('.tab-button');

        if (nextTab.length > 0) {
            activeTab.removeClass('active');
            nextTab.addClass('active');

            const url = nextTab.data('url');
            localStorage.setItem('activeTab', url);
            $('#tab-content').load(url, function () {
                initFormSubmission();
            });
        }
    });
});