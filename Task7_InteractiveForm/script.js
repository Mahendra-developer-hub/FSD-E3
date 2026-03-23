function highlight(element) {
    element.style.backgroundColor = "#ffffcc";
}

function removeHighlight(element) {
    element.style.backgroundColor = "";
}

function validateName(event) {
    let char = String.fromCharCode(event.which);
    let pattern = /[a-zA-Z ]/;
    if (!pattern.test(char)) {
        event.preventDefault();
    }
}

function validateEmail() {
    let email = document.getElementById("email").value;
    let msg = document.getElementById("msg");
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!pattern.test(email)) {
        msg.innerHTML = "Invalid Email Format!";
        msg.style.color = "red";
    } else {
        msg.innerHTML = "Valid Email";
        msg.style.color = "green";
    }
}

function submitForm() {
    alert("Form Submitted Successfully ✅");
}