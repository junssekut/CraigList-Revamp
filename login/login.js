function show_password_handler(element) {
    element = element.target;

    const element_input_password = document.getElementById('input-password');

    if (element.classList.contains('fa-eye-slash')) {
        element.classList.remove('fa-eye-slash');
        element.classList.add('fa-eye');

        element_input_password.type = 'text';
        return;
    }

    if (element.classList.contains('fa-eye')) {
        element.classList.remove('fa-eye');
        element.classList.add('fa-eye-slash');

        element_input_password.type = 'password';
        return;
    }
}

function display_error(element_after, text) {
    const element_error = document.createElement('span');
    element_error.classList.add('input-error');
    element_error.setAttribute('from', element_after.id);
    element_error.textContent = text;

    element_after.parentNode.insertBefore(element_error, element_after.nextSibling);
}

function reset_error() {
    const element_errors = document.querySelectorAll('.input-error');

    if (element_errors.length === 0) return;

    for (const element_error of element_errors) {
        element_error.parentNode.removeChild(element_error);
    }
}

function validate_email(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate_password(password) {
    return password.length > 8 && password.length <= 32;
}

function login_handler() {
    const element_input_email = document.getElementById('input-email');
    const element_input_password = document.getElementById('input-password');

    let validate = true;

    reset_error();

    if (!validate_email(element_input_email.value.trim())) {
        display_error(element_input_email, 'Email address is not valid');
        validate = false;
    }

    if (!validate_password(element_input_password.value.trim())) {
        display_error(element_input_password.parentNode, 'Password can only contains 8-12 characters');
        validate = false;
    }
    
    if (!validate) {
        swal({
            title: 'Error',
            text: 'Your credential does not match the specified validation value.',
            icon: 'error'
        });
        return;
    }

    login(element_input_email.value.trim());

    swal({
        title: 'Login Success',
        text: `Logged in succesfully as:\n${element_input_email.value.trim()}`,
        icon: 'success'
    }).then(() => window.open('../home/home.html', '_blank'));

}

function init() {
    document.getElementById('modal-show-icon').addEventListener('click', show_password_handler);
    
    const forgot_password = document.getElementById('forgot-password');

    forgot_password.addEventListener('click', function() {
        swal({
            title: 'Email Address',
            text: 'Please input your registered email address account to reset it\'s password.',
            icon: 'info',
            content: 'input',
            buttons: true,
            dangerMode: true
        }).then((value) => {
            if (!value) return;

            swal({
                title: 'Forgot Password',
                text: `Forgot password confirmation has been sent to ${value}!\nCheck your inbox to reset your password.`,
                icon: 'success'
            });
        });
    })

    document.getElementById('modal-login').addEventListener('click', login_handler);
    document.getElementById('modal-login-apple').addEventListener('click', () => swal({ icon: 'error', title: 'Error', text: 'This service is currently unavailable.'} ));

    if (isAuthenticated()) {
        swal({
            title: 'Already Authenticated',
            text: 'You are already authenticated!\nRedirecting to home page...',
            icon: 'error'
        }).then(() => {
            window.open('../home/home.html', '_self');
        });
    }
}

init();