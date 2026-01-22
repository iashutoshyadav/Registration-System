const locationData = {
    "USA": {
        "California": ["Los Angeles", "San Francisco", "San Diego"],
        "New York": ["New York City", "Buffalo", "Albany"],
        "Texas": ["Houston", "Austin", "Dallas"]
    },
    "India": {
        "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
        "Karnataka": ["Bangalore", "Mysore", "Hubli"],
        "Delhi": ["New Delhi", "Noida", "Gurgaon"]
    },
    "UK": {
        "England": ["London", "Manchester", "Liverpool"],
        "Scotland": ["Edinburgh", "Glasgow", "Aberdeen"]
    }
};

const disposableDomains = [
    'tempmail.com',
    'mailinator.com',
    'throwawaymail.com',
    '10minutemail.com',
    'yopmail.com'
];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');

    const countrySel = document.getElementById('country');
    const stateSel = document.getElementById('state');
    const citySel = document.getElementById('city');

    for (let country in locationData) {
        countrySel.add(new Option(country, country));
    }

    countrySel.addEventListener('change', function () {
        stateSel.length = 1;
        citySel.length = 1;
        citySel.disabled = true;

        if (this.value) {
            stateSel.disabled = false;
            Object.keys(locationData[this.value])
                .forEach(state => stateSel.add(new Option(state, state)));
        } else {
            stateSel.disabled = true;
        }

        validateField(countrySel);
        checkFormValidity();
    });

    stateSel.addEventListener('change', function () {
        citySel.length = 1;

        if (this.value) {
            citySel.disabled = false;
            locationData[countrySel.value][this.value]
                .forEach(city => citySel.add(new Option(city, city)));
        } else {
            citySel.disabled = true;
        }

        checkFormValidity();
    });

    const inputs = form.querySelectorAll('input, select');

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateField(input);
            checkFormValidity();
        });

        input.addEventListener('blur', () => {
            validateField(input);
        });

        if (input.type === 'radio' || input.type === 'checkbox') {
            input.addEventListener('change', () => {
                validateField(input);
                checkFormValidity();
            });
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (checkFormValidity(true)) {
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showGlobalMessage('Registration Successful! Welcome aboard.', 'success');
                submitBtn.textContent = 'Register Now';
                submitBtn.disabled = false;
                form.reset();
                resetValidationUI();
            }, 1500);
        } else {
            showGlobalMessage('Please fix the errors above.', 'error');
        }
    });

    function validateField(input) {
        const id = input.id || input.name;
        const errorSpan =
            document.getElementById(`err-${id}`) ||
            document.getElementById(`err-${input.name}`);

        let isValid = true;
        let msg = '';

        input.classList.remove('error-input');
        if (errorSpan) errorSpan.classList.remove('show-error');

        if (input.hasAttribute('required') && !input.value) {
            if (input.type === 'checkbox' && !input.checked) isValid = false;
            else if (input.type === 'radio') {
                if (!document.querySelector(`input[name="${input.name}"]:checked`))
                    isValid = false;
            } else if (input.value.trim() === '') {
                isValid = false;
            }
            msg = 'This field is required';
        }

        if (isValid && input.value) {
            switch (input.name) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        msg = 'Invalid email format';
                    } else {
                        const domain = input.value.split('@')[1];
                        if (disposableDomains.includes(domain)) {
                            isValid = false;
                            msg = 'Disposable emails are not allowed';
                        }
                    }
                    break;

                case 'phone':
                    const phoneRegex = /^\+?[\d\s-]{10,15}$/;
                    if (!phoneRegex.test(input.value)) {
                        isValid = false;
                        msg = 'Invalid phone number';
                    } else if (countrySel.value && !input.value.startsWith('+')) {
                        isValid = false;
                        msg = 'Include country code (e.g. +1)';
                    }
                    break;

                case 'password':
                    const strength = checkStrength(input.value);
                    updateStrengthMeter(strength);
                    if (strength === 'Weak') {
                        isValid = false;
                        msg = 'Password is too weak';
                    }
                    break;

                case 'confirmPassword':
                    if (input.value !== document.getElementById('password').value) {
                        isValid = false;
                        msg = 'Passwords do not match';
                    }
                    break;
            }
        }

        if (!isValid && errorSpan) {
            input.classList.add('error-input');
            errorSpan.textContent = msg;
            errorSpan.classList.add('show-error');
        }

        return isValid;
    }

    function checkStrength(password) {
        if (password.length < 6) return 'Weak';
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'Strong';
        if (password.length >= 6) return 'Medium';
        return 'Weak';
    }

    function updateStrengthMeter(strength) {
        const bar = document.querySelector('.strength-bar');
        const text = document.querySelector('.strength-text');

        bar.className = 'strength-bar ' + strength.toLowerCase();

        if (strength === 'Weak') bar.style.width = '33%';
        if (strength === 'Medium') bar.style.width = '66%';
        if (strength === 'Strong') bar.style.width = '100%';

        text.textContent = strength;
    }

    function checkFormValidity(showErrors = false) {
        const requiredInputs = form.querySelectorAll('[required]');

        requiredInputs.forEach(input => {
            if (!validateField(input) && showErrors) {}
        });

        const hasErrors = form.querySelectorAll('.error-input').length > 0;
        let hasEmptyRequired = false;

        requiredInputs.forEach(inp => {
            if (inp.type === 'checkbox' && !inp.checked) hasEmptyRequired = true;
            else if (inp.type === 'radio') {
                if (!document.querySelector(`input[name="${inp.name}"]:checked`))
                    hasEmptyRequired = true;
            } else if (!inp.value && !inp.disabled) {
                hasEmptyRequired = true;
            }
        });

        const valid = !hasErrors && !hasEmptyRequired;
        submitBtn.disabled = !valid;
        return valid;
    }

    function showGlobalMessage(msg, type) {
        const banner = document.getElementById('globalMessage');
        banner.textContent = msg;
        banner.className = `message-banner ${type === 'success' ? 'success-message' : 'error-message'}`;
        banner.style.display = 'block';
    }

    function resetValidationUI() {
        document.querySelectorAll('.error-input')
            .forEach(el => el.classList.remove('error-input'));

        document.querySelectorAll('.show-error')
            .forEach(el => el.classList.remove('show-error'));

        document.querySelector('.strength-bar').style.width = '0';
        document.querySelector('.strength-text').textContent = '';
        document.getElementById('globalMessage').style.display = 'none';
        stateSel.disabled = true;
        citySel.disabled = true;
    }
});
