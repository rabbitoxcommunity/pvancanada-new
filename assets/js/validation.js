(function () {
    emailjs.init("3XLW0uvmLxar8lvNn");
})();

// Select elements
const nextBtn = document.getElementById('nextBtn');
const nameForm = document.getElementById('nameForm');
const numberForm = document.getElementById('numberForm');
const backArrow = document.querySelector('.arrow__back');
const checkboxInputs = document.querySelectorAll('#nameForm input[type="checkbox"]');
const countrySelect = document.getElementById('countrySelect');
const Industry = document.getElementById('Industry');
const submitBtn = document.querySelector('.btn-submit');

console.log(Industry?.value, 'Industry')


// Hide number form initially
numberForm.style.display = 'none';

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

// Function to reset validation styling
function resetValidationStyles() {
    countrySelect.style.borderColor = '';
    Industry.style.borderColor = '';
}



// Function to validate first form

function checkValidation() {
    let isValid = true;
    checkboxInputs.forEach(checkbox => checkbox.parentElement.style.color = '');
    // Validate services selection
    const selectedServices = getSelectedServices();
    if (selectedServices.length === 0) {
        isValid = false;
        checkboxInputs.forEach(checkbox => {
            checkbox.parentElement.style.color = 'red';
        });
        showError('Please select at least one service');
    }
    return isValid;
}
function validateFirstForm() {
    let isValid = true;
    resetValidationStyles();

    // Validate country selection
    if (!countrySelect.value) {
        isValid = false;
        countrySelect.style.borderColor = 'red';
        showError('Please select a country');
    }


    if (!Industry.value) {
        isValid = false;
        Industry.style.borderColor = 'red';
        showError('Please select a industry');
    }

    return isValid;
}

function validateAgree() {
    const agreeCheck = document.getElementById('agreeTerms');
    let isValid = agreeCheck.checked;

    agreeCheck.parentElement.style.color = isValid ? '' : 'red'; 

    return isValid; 
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

// Next button click event - removed duplicate event listener
nextBtn.addEventListener('click', function () {
    if (checkValidation()) {
        nameForm.style.display = 'none';
        numberForm.style.display = 'block';
    }
});

// Back button click event
backArrow.addEventListener('click', function () {
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
        showError('Please enter a valid email address');
    }

    const phoneInput = numberForm.querySelector('input[placeholder="+001 000 000 000"]');
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!phoneRegex.test(phoneInput.value.trim())) {
        isValid = false;
        phoneInput.style.borderColor = 'red';
        showError('Please enter a valid phone number');
    }

    return isValid;
}

// Submit button click event
submitBtn?.addEventListener('click', function (e) {
    let isValid = true;
    e.preventDefault();

    const isFormValid = validateForm();
    const isAgreeValid = validateAgree();
    const isFirstFormValid = validateFirstForm();

if (isFormValid && isFirstFormValid && isAgreeValid) {
        setButtonState(true);
        sendEmail();
    }
});

// Function to send email using EmailJS
function sendEmail() {
    const selectedServices = getSelectedServices();
    const firstName = document.querySelector('input[placeholder="Your first name"]').value;
    const lastName = document.querySelector('input[placeholder="Your last name"]').value;
    const email = document.querySelector('input[placeholder="name@example.com"]').value;
    const phone = document.querySelector('input[placeholder="+001 000 000 000"]').value;
    const company = document.querySelector('input[placeholder="Your company name"]').value;
    const Questions = document.querySelector('textarea[placeholder="Write your inquiry or specific needs…"]').value;
    const country = countrySelect.value;
    const industry = Industry.value;

    const templateParams = {
        services: selectedServices.join(', '),
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        industry: industry,
        company: company,
        Questions: Questions,
        country: country
    };

    console.log(templateParams, 'templateParams');

    emailjs.send('service_ekv73y3', 'template_ozjz5ne', templateParams)
        .then(function (response) {
            redirectToIndex();
        }, function (error) {
            console.log('FAILED...', error);
            showError('Failed to submit form. Please try again later.');
            setButtonState(false);
        });
}

// Reset validation styling on input
numberForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function () {
        this.style.borderColor = '';
    });
});



// Reset validation styling on country select change
countrySelect.addEventListener('change', function () {
    this.style.borderColor = '';
});

Industry.addEventListener('change', function () {
    this.style.borderColor = '';
});



// Reset validation styling on checkbox change
checkboxInputs.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (getSelectedServices().length > 0) {
            checkboxInputs.forEach(cb => cb.parentElement.style.color = '');
        }
    });
});