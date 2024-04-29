function isAuthenticated() {
    return localStorage.getItem('authenticated') === 'true';
}

function getProducts() {
    return new Promise((resolve, reject) => {
        const ajax = new XMLHttpRequest();

        ajax.open('GET', '../public/data.json', true);
        ajax.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            if (this.status !== 200) reject(new Error('Failed to load data'));

            resolve(JSON.parse(this.responseText).products);
        };

        ajax.send();
    });
}

function create_posting_handler() {
    if (!isAuthenticated()) {
        swal({
            text: 'You need to Login first before you can create a post!',
            icon: 'error',
            buttons: {
                cancel: 'Cancel',
                login: 'Login'
            }
        }).then((value) => {
            switch (value) {
                case 'login': {
                    window.open('../login/login.html', '_self');
                }
            }
        });

        return;
    }

    swal({
        title: 'Maintenance',
        icon: 'warning',
        text: 'Create posting functionality is on maintenance!'
    });
}

async function populate_category() {
    const containerList = document.getElementById('categories-list');
    const products = await getProducts();

    // Create a Set to keep track of displayed categories
    const displayedCategories = new Set();

    products.forEach(product => {
        // Check if the category has already been displayed
        if (!displayedCategories.has(product.category)) {
            // Add the category to the Set
            displayedCategories.add(product.category);

            // Create a new item-modal div
            const itemModal = document.createElement('div');
            itemModal.classList.add('item-modal');

            // Create an image element
            const image = document.createElement('img');
            image.classList.add('item-image');
            // Replace src attribute with the first image from the product's images array
            image.src = `../${product.thumbnail}`;
            image.alt = product.name;

            // Create a paragraph element for the category name
            const categoryName = document.createElement('p');
            categoryName.classList.add('item-title');
            categoryName.textContent = product.category;

            // Append image and category name to the item-modal div
            itemModal.appendChild(image);
            itemModal.appendChild(categoryName);

            itemModal.addEventListener('click', () => window.open(`../category/category.html?category=${product.category}`));

            // Append item-modal div to the container list
            containerList.appendChild(itemModal);
        }
    });

}

async function populate_picks() {
    const picksList = document.getElementById('picks-list');
    const products = await getProducts();

    // Shuffle the products array to get random products
    const shuffledProducts = shuffleArray(products);

    // Clear the picks list before populating
    picksList.innerHTML = '';

    // Limit the number of picks to display
    const numPicksToShow = 4;
    const picksToShow = shuffledProducts.slice(0, numPicksToShow);

    picksToShow.forEach(product => {
        // Create a new item-modal div
        const itemModal = document.createElement('div');
        itemModal.setAttribute('data-aos', 'fade-down');
        itemModal.classList.add('item-modal');

        // Create an image element
        const image = document.createElement('img');
        image.classList.add('item-image');
        // Replace src attribute with the first image from the product's images array
        image.src = product.thumbnail;
        image.alt = product.name;

        // Create a paragraph element for the product name
        const productName = document.createElement('p');
        productName.classList.add('item-title');
        productName.textContent = product.name;

        // Append image and product name to the item-modal div
        itemModal.appendChild(image);
        itemModal.appendChild(productName);

        itemModal.addEventListener('click', () => window.open(`../product/product.html?id=${product.id}`));

        // Append item-modal div to the picks list
        picksList.appendChild(itemModal);
    });

}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function init() {
    document.getElementById('create-posting').addEventListener('click', create_posting_handler);

    populate_category();
    populate_picks();

    setInterval(populate_picks, 10000);
}

init();