document.getElementById('btn').addEventListener('click', function() {
    fetch('/getProfileData')
        .then(response => response.json())
        .then(data => {
            const { uniqueId } = data;
            if (uniqueId) {
                window.location.href = `/HTML/rahman.html?userId=${uniqueId}`; // Redirect with unique ID
            } else {
                console.error('User data not available.');
            }
        })
        .catch(error => console.error('Error fetching profile data:', error));
});
