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

// Function to load HTML content
function loadHTML(url, targetId) {
    return fetch(url)
        .then(response => response.text())
        .then(html => {
            // Inject the HTML content into the target element
            document.getElementById(targetId).innerHTML = html;
        })
        .catch(error => console.error('Error fetching HTML:', error));
}

// Function to load CSS
function loadCSS(url) {
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
function loadFont(fontFamily, fontWeight) {
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:ital,wght@${fontWeight}&display=swap`;
    return loadCSS(fontUrl);
}

// Function to load a script dynamically
function loadScript(url, defer = false) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.defer = defer;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

Promise.all([
    loadCSS('/global/global.css'),
    loadHTML('/global/navbar/navbar.html', 'navbar-placeholder'),
    loadHTML('/global/footer/footer.html', 'footer-placeholder'),
    loadCSS('/global/navbar/navbar.css'),
    loadCSS('/global/footer/footer.css'),
    loadCSS('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,500&display=swap'),
    loadCSS('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap'),
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'),
    loadCSS('https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.2/css/fontawesome.min.css'),
    loadScript('https://unpkg.com/sweetalert/dist/sweetalert.min.js'),
    loadScript('https://unpkg.com/scrollreveal'),
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/2.7.3/styles/overlayscrollbars.css'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/2.7.3/browser/overlayscrollbars.browser.es6.min.js').then(() => loadScript('/global/js/overlay-scrollbars.js', true)),
]).catch(error => console.error('Error loading resources:', error));