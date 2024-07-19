function validateForm() {
    var username = document.forms["registerForm"]["username"].value;
    var firstName = document.forms["registerForm"]["firstname"].value;
    var lastName = document.forms["registerForm"]["lastname"].value;
    var dob = document.forms["registerForm"]["dob"].value;
    var password = document.forms["registerForm"]["password"].value;
    var email = document.forms["registerForm"]["email"].value;
    var mobile = document.forms["registerForm"]["mobile"].value;
    var image = document.forms["registerForm"]["image"].value;

    if (username == "" || firstName == "" || lastName == "" || dob == "" || password == "" || email == "" || mobile == "" || image == "") {
        alert("All fields are required");
        return false;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters long");
        return false;
    }
    if (!/(?=.*\d)(?=.*[a-zA-Z])/.test(password)) {
        a////////////ert("Password must contain at least one letter and one number");
        return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Invalid email address");
        return false;
    }

    if (/\d/.test(firstName)) {
        alert("First name cannot contain numbers");
        return false;
    }
    if (/\d/.test(lastName)) {
        alert("Last name cannot contain numbers");
        return false;
    }

    alert("Registration Successful!");
    return true;
}
