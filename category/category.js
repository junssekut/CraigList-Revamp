let category;
let data, data_display;

function onProductClick(product) {
    product = product.currentTarget;
    
    window.open(`/product/product.html?id=${product.getAttribute('product-id')}`, '_self');
}

function load_location_filter() {
    const locations = [];

    data_display.products.forEach(product => {
        if (locations.includes(product.location)) return;
        
        locations.push(product.location);
    });

    locations.sort(function(a, b) {
        return a.localeCompare(b);
    });

    const list = document.getElementById('filter-location');
    list.innerHTML = '';
    
    locations.forEach(location => {
        const checkbox = document.createElement('div');
        const product_count = data_display.products.reduce((count, item) => {
            return item.location === location ? count + 1 : count;
        }, 0);

        checkbox.classList.add('filter-checkbox');
        checkbox.innerHTML = `
            <input type="checkbox" id="filter-location-${location}" onclick="checkbox_filter_location_handler(this)">
            <label for="filter-location-${location}">${location} (${product_count})</label>
        `;
        list.appendChild(checkbox);
    });
}

function checkbox_filter_price_handler(checkbox) {
    const isChecked = checkbox.checked;

    const checkboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (cb !== checkbox) {
            if (cb.parentNode.parentNode.id !== 'filter-price') return;

            cb.checked = false;
        }
    });

    if (!isChecked) {
        return;
    }

    const prompt = checkbox.getAttribute('id');

    switch (prompt) {
        case 'filter-low-to-high': {
            sort_price(true);
            break;
        }
        case 'filter-high-to-low': {
            sort_price(false);
            break;
        }
    }
}

function checkbox_filter_location_handler(checkbox) {
    const checked = checkbox.checked;
    const checked_locations = [];

    if (checked) checked_locations.push(checkbox.id.replace('filter-location-', ''));

    const checkboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (cb !== checkbox) {
            if (cb.parentNode.parentNode.id !== 'filter-location') return;
            if (!cb.checked) return;

            checked_locations.push(cb.id.replace('filter-location-', ''));
        }
    });

    if (checked_locations.length === 0) {
        data_display = data;
        render();
        
        getCheckedCheckboxes().forEach(checkbox => {
            if (checkbox.parentNode.parentNode.id !== 'filter-price') return;

            const prompt = checkbox.getAttribute('id');
    
            switch (prompt) {
                case 'filter-low-to-high': {
                    sort_price(true);
                    break;
                }
                case 'filter-high-to-low': {
                    sort_price(false);
                    break;
                }
            }
        })
        return;
    }

    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const location = product.parentNode.getAttribute('product-location');
        const visible = checked_locations.includes(location);

        product.classList.remove('aos-animate');
        setTimeout(function() {
            product.style.display = visible ? 'flex' : 'none';

            product.classList.add('aos-animate');
        }, 100);
    });
}

function checkbox_handler(checkbox) {
    const type = checkbox.parentNode.parentNode.id;

    switch (type) {
        case 'filter-price':
            checkbox_filter_price_handler(checkbox);
            break;
        case 'filter-location':
            checkbox_filter_location_handler(checkbox);
            break;
        default:
            alert('?? unknown checkbox');
            break;
    }
}

function sort_price(ascending = true) {
    const productList = document.getElementById('products-list');
    const products = Array.from(productList.children);

    products.sort((a, b) => {
        const priceA = +a.querySelector('.product-price').textContent.slice(1);
        const priceB = +b.querySelector('.product-price').textContent.slice(1);

        return ascending ? priceA - priceB : priceB - priceA;
    });

    products.forEach(product => {
        productList.appendChild(product);
    });
}

function load_data() {
    return new Promise((resolve, reject) => {
        const ajax = new XMLHttpRequest();

        ajax.open('GET', '../public/data.json', true);
        ajax.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            if (this.status !== 200) reject(new Error('Failed to load data'));

            data = JSON.parse(this.responseText);
            data_display = data;

            data.products = data.products.filter((product) => product.category === category);    

            resolve(true);
        };

        ajax.send();
    });
}

function load_tilt() {
    $('[data-tilt]').tilt();
}

function getCheckedCheckboxes() {
    return Array.from(document.querySelectorAll('.filter-checkbox input[type="checkbox"]:checked'));
}

function render() {
    const list = document.getElementById('products-list');
    list.innerHTML = '';

    data_display.products.forEach(product => {
        let element = document.createElement('div');
        element.setAttribute('product-location', product.location);
        element.setAttribute('product-id', product.id);
        element.addEventListener('click', onProductClick);
        // data-tilt data-tilt-maxTilt="15" data-tilt-speed="5000" data-tilt-perspective="1000"
        element.innerHTML = `
            <div class="product" data-aos="flip-down">
                <img class="product-image" src="${product.thumbnail}" alt="${product.image}" >
                <div class="product-detail">
                    <h1 class="product-name">${product.name}</h1>
                    <p class="product-price">$${product.price}</p>
                    <p class="product-description">${product.briefDescription || product.description}</p>
                </div>
            </div>
        `;

        list.appendChild(element);
    });

    load_tilt();
    load_location_filter();
}

function init() {
    AOS.init({
        offset: 0,
        duration: 400,
        delay: 0,
    });

    $(document).ready(function() {
        var params = new URLSearchParams(window.location.search);
        const query_category = params.get('category');

        if (!query_category)
            swal("Error", "You must select a category to enter this page.", "error")
                .then(() => {
                    window.open('/home/home.html', '_self');   
                });

        category = query_category;

        document.getElementById('location-href').textContent = category;
    });

    load_data().then(() => render()).catch(err => console.error(err));
}

init();