(function() {
    emailjs.init("3XLW0uvmLxar8lvNn");
})();

// Select elements
const nextBtn = document.getElementById('nextBtn');
const nameForm = document.getElementById('nameForm');
const numberForm = document.getElementById('numberForm');
const backArrow = document.querySelector('.arrow__back');
const checkboxInputs = document.querySelectorAll('#nameForm input[type="checkbox"]');
const submitBtn = document.querySelector('.btn-submit');

// Hide number form initially
numberForm.style.display = 'none';

// function showToast(message, isSuccess = true) {
//     Toastify({
//         text: message,
//         duration: 3000,
//         close: true,
//         position: "center",
//         gravity: "bottom",
//         backgroundColor: isSuccess ? "#4CAF50" : "#F44336",
//     }).showToast();
// }

function redirectToIndex(delay = 1000) {
    setTimeout(() => {
        window.location.href = 'success.html';
    }, delay);
}

function setButtonState(isLoading) {
    if (isLoading) {
        submitBtn.textContent = "Submitting...";
        submitBtn.disabled = true;
    } else {
        submitBtn.textContent = "Submit";
        submitBtn.disabled = false;
    }
}

// Function to show error message
function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = `<div class="error-message" style="color: red;">${message}</div>`;
    setTimeout(() => errorContainer.innerHTML = '', 3000);
}

// Function to get selected services
function getSelectedServices() {
    const selectedServices = [];
    checkboxInputs.forEach(checkbox => {
        if (checkbox.checked) {
            selectedServices.push(checkbox.id);
        }
    });
    return selectedServices;
}

// Next button click event
nextBtn.addEventListener('click', function() {
    const selectedServices = getSelectedServices();
    if (selectedServices.length === 0) {
        showError('Please select at least one service before proceeding.');
        return;
    }
    nameForm.style.display = 'none';
    numberForm.style.display = 'block';
});

// Back button click event
backArrow.addEventListener('click', function() {
    if (numberForm.style.display === 'block') {
        numberForm.style.display = 'none';
        nameForm.style.display = 'block';
    }
});

// Form validation function
function validateForm() {
    const inputs = numberForm.querySelectorAll('input[type="text"]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });

    const emailInput = numberForm.querySelector('input[placeholder="name@example.com"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        isValid = false;
        emailInput.style.borderColor = 'red';
    }

    const phoneInput = numberForm.querySelector('input[placeholder="+001 000 000 000"]');
    const phoneRegex = /^\+?1?\d{10}$/;
    if (!phoneRegex.test(phoneInput.value.trim())) {
        isValid = false;
        phoneInput.style.borderColor = 'red';
    }

    return isValid;
}

// Submit button click event
submitBtn?.addEventListener('click', function(e) {
    e.preventDefault();
    if (validateForm()) {
        setButtonState(true);
        sendEmail();
    } else {
        showError('Please fill all fields correctly.');
    }
});

// Function to send email using EmailJS
function sendEmail() {
    const selectedServices = getSelectedServices();
    const firstName = document.querySelector('input[placeholder="Your first name"]').value;
    const lastName = document.querySelector('input[placeholder="Your last name"]').value;
    const email = document.querySelector('input[placeholder="name@example.com"]').value;
    const phone = document.querySelector('input[placeholder="+001 000 000 000"]').value;
    const country = document.querySelector('#numberForm input[type="checkbox"]').value;

    const templateParams = {
        services: selectedServices.join(', '), // Join selected services with comma
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        country: 'canada'
    };

    console.log(templateParams, 'templateParams');

    emailjs.send('service_ejcllhc', 'template_ozjz5ne', templateParams)
        .then(function(response) {
            // showToast('Form submitted successfully!');
            redirectToIndex();
        }, function(error) {
            console.log('FAILED...', error);
            showError('Failed to submit form. Please try again later.');
            setButtonState(false);
        });
}

// Reset validation styling on input
numberForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        this.style.borderColor = '';
    });
});