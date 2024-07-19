document.addEventListener('DOMContentLoaded', function () {
    fetch('/getProfileData', {
        method: 'GET',
        credentials: 'include' // Ensure cookies are sent with the request
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const profileImageElement = document.getElementById('profileImage');
        const userElement = document.getElementById('username'); // Corrected ID from 'user' to 'username'
        const userIdElement = document.getElementById('userId');

        if (data.profileImage) {
            profileImageElement.src = data.profileImage;
            profileImageElement.style.display = 'block';
        }
        userElement.textContent = data.username;
        userIdElement.textContent = data._id;
    })
    .catch(error => {
        console.error('Error fetching profile data:', error);
        // Optionally redirect to login page on error
        // window.location.href = '/HTML/Login.html';
    });

    document.querySelectorAll('.event-button').forEach(button => {
        button.addEventListener('click', function () {
            const userId = document.getElementById('userId').textContent;
            const eventPage = button.getAttribute('data-event-page');
            window.location.href = `${eventPage}/${userId}`;
        });
    });

    // Add event listener for Payment and Booking History button
    document.getElementById('paymentHistoryBtn').addEventListener('click', function () {
        window.location.href = '/HTML/history.html';
    });
});

// Navigation button event listeners
document.querySelector('.mainNav__button1').addEventListener('click', (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').textContent;
    window.location.href = `/HTML/rahman.html/${userId}`;
});

document.querySelector('.mainNav__button2').addEventListener('click', (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').textContent;
    window.location.href = `/HTML/vijayantony.html/${userId}`;
});

document.querySelector('.mainNav__button3').addEventListener('click', (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').textContent;
    window.location.href = `/HTML/prabhudeva.html/${userId}`;
});

document.querySelector('.mainNav__button5').addEventListener('click', (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').textContent;
    window.location.href = `/HTML/sima.html/${userId}`;
});

document.querySelector('.mainNav__button6').addEventListener('click', (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').textContent;
    const eventId = "6687c119f41e07234d9fff8e";
    window.location.href = `/HTML/common.html/${userId}?eventId=${eventId}&userId=${userId}`;
});

document.querySelector('.mainNav__button7').addEventListener('click', (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').textContent;
    const eventId = "6687c119f41e07234d9fff90";
    window.location.href = `/HTML/common.html/${userId}?eventId=${eventId}&userId=${userId}`;
});

document.querySelector('.mainNav__button8').addEventListener('click', (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').textContent;
    const eventId = "6687c119f41e07234d9fff8f";
    window.location.href = `/HTML/common.html/${userId}?eventId=${eventId}&userId=${userId}`;
});
