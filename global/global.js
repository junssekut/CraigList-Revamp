document.addEventListener('click', function(event) {
    const target = event.target;

    if (target.tagName === 'A') {
        const href = target.getAttribute('href');

        if (!href || href === '#') {
            swal("Maintenance", "This button is currently on maintenance!", "warning");
            event.preventDefault();
        }
    }
});

function create_posting_handler() {
    swal("Maintenance", "This button is currently on maintenance!", "warning");
}

function isAuthenticated() {
    return localStorage.getItem('authenticated') === 'true';
}

function getAccount() {
    if (!isAuthenticated()) return new Error('Not authenticated');

    return {
        authenticated: localStorage.getItem('authenticated'),
        email: localStorage.getItem('email')
    }
}

function logout() {
    if (!isAuthenticated()) return new Error('Failed to logout, no logged in account');

    localStorage.setItem('authenticated', 'false');
    localStorage.removeItem('email');
}

// Function to load HTML content
function loadHTML(url, targetId, load = true) {
    if (!load) return Promise.resolve();

    return fetch(url)
        .then(response => response.text())
        .then(html => {
            // Inject the HTML content into the target element
            const element = document.getElementById(targetId);

            if (!element) return;
            // if (!element) return Promise.reject(new Error(`Failed to load HTML to element with the id #${targetId} (does not exists).`));

            element.innerHTML = html;
        })
        .catch(error => console.error('Error fetching HTML:', error));
}

// Function to load CSS
function loadCSS(url, load = true) {
    if (!load) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

// Function to load Google Fonts CSS dynamically
function loadFont(fontFamily, fontWeight, load = true) {
    if (!load) return Promise.resolve();
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:ital,wght@${fontWeight}&display=swap`;
    return loadCSS(fontUrl);
}

// Function to load a script dynamically
function loadScript(url, defer = false, load = true) {
    if (!load) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.defer = defer;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function parseBooleanQueryParam(value) {
    if (typeof value !== 'string') {
        return false; // Return false if the input is not a string
    }
    
    const lowerCaseValue = value.toLowerCase().trim(); // Convert to lowercase and remove leading/trailing spaces
    
    // Check for truthy representations
    if (lowerCaseValue === 'true' || lowerCaseValue === '1' || lowerCaseValue === 'yes' || lowerCaseValue === 'on') {
        return true;
    }
    
    // Check for falsy representations
    if (lowerCaseValue === 'false' || lowerCaseValue === '0' || lowerCaseValue === 'no' || lowerCaseValue === 'off') {
        return false;
    }
    
    // If the value does not match any recognized representation, return false
    return false;
}

function authentication_handler(authenticated = false) {
    const element_button = document.getElementById('button');

    if (!element_button) return;

    if (authenticated) {
        // element_button.textContent = 'Create Posting';
        element_button.innerHTML = '<i class="container-button-icon fa-solid fa-circle-plus"></i> Create Post';
        element_button.addEventListener('click', create_posting_handler);

        const account = getAccount();
        const element_profile = document.getElementById('button-profile');

        if (!element_profile) return;

        element_profile.style.display = 'block';
        element_profile.addEventListener('click', () => swal({
            title: 'Profile Detail',
            text: `You are authenticated as:\n${account.email}`,
            icon: 'info',
            buttons: {
                logout: 'Logout',
                ok: 'Ok'
            }
        }).then((value) => {
            switch (value) {
                case 'logout':
                    logout();

                    swal({
                        title: 'Logged Out',
                        text: 'Succesfully logged out!',
                        icon: 'success'
                    })

                    authentication_handler(false);
                    break;
            }
        }));
    } else {
        element_button.innerHTML = '<i class="navbar-button-icon fa-solid fa-right-to-bracket"></i> Login or Sign up';
        element_button.addEventListener('click', () => window.open('../login/login.html', '_self'));

        const element_profile = document.getElementById('button-profile');
        element_profile.style.display = 'none';
    }
}

function init() {
    const scriptTag = document.querySelector('script[data-craiglist]');
    let load_global = true, load_navfoot = true, load_fonts = true, load_sweet_alert = true, load_scroll_reveal = true, load_overlay_scrollbars = true;
    
    if (scriptTag) {
        if (scriptTag.hasAttribute('data-load-navfoot')) {
            load_navfoot = parseBooleanQueryParam(scriptTag.getAttribute('data-load-navfoot'));
            load_global = load_navfoot;
            load_fonts = load_navfoot;

            if (!load_navfoot && !scriptTag.hasAttribute('data-load-global')) load_global = true;
            if (!load_navfoot && !scriptTag.hasAttribute('data-load-fonts')) load_fonts = true;
        }
        if (scriptTag.hasAttribute('data-load-global')) {
            load_global = parseBooleanQueryParam(scriptTag.getAttribute('data-load-global'));

            if (load_navfoot && !load_global) load_global = true;
        }
        if (scriptTag.hasAttribute('data-load-fonts')) {
            load_fonts = parseBooleanQueryParam(scriptTag.getAttribute('data-load-fonts'));

            if (load_navfoot && !load_fonts) load_fonts = true;
        }
        if (scriptTag.hasAttribute('data-load-sweet-alert')) load_sweet_alert = parseBooleanQueryParam(scriptTag.getAttribute('data-load-sweet-alert'));
        if (scriptTag.hasAttribute('data-load-scroll-reveal')) load_scroll_reveal = parseBooleanQueryParam(scriptTag.getAttribute('data-load-scroll-reveal'));
        if (scriptTag.hasAttribute('data-load-overlay-scrollbars')) load_overlay_scrollbars = parseBooleanQueryParam(scriptTag.getAttribute('data-load-overlay-scrollbars'));
    }
    
    Promise.all([
        loadCSS('../global/global.css', load_global),

        loadHTML('../global/navbar/navbar.html', 'navbar-placeholder', load_navfoot),
        loadHTML('../global/footer/footer.html', 'footer-placeholder', load_navfoot),
        loadCSS('../global/navbar/navbar.css', load_navfoot),
        loadCSS('../global/footer/footer.css', load_navfoot),

        loadCSS('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,500&display=swap', load_fonts),
        loadCSS('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap', load_fonts),

        loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css', load_fonts),
        loadCSS('https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.2/css/fontawesome.min.css', load_fonts),

        loadScript('https://unpkg.com/scrollreveal', load_scroll_reveal),

        loadCSS('https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/2.7.3/styles/overlayscrollbars.css', load_overlay_scrollbars),
        
        loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'),
        loadScript('https://unpkg.com/sweetalert/dist/sweetalert.min.js', load_sweet_alert),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/2.7.3/browser/overlayscrollbars.browser.es6.min.js', load_overlay_scrollbars).then(() => loadScript('../global/js/overlay-scrollbars.js', true)),
    ])
    .then(() => {
        authentication_handler(isAuthenticated());

        if (document.getElementById('navbar-map')) document.getElementById('navbar-map').addEventListener('click', () => swal("Error", "The service search by location is currently not available!", "error"));
    })
    .catch((error) => console.error(`Failed to load resources: ${error}`));
}

init();