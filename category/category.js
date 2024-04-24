$(document).ready(function() {
    localStorage.setItem('selected-category', 'Books');

    
});

let selected_category = localStorage.getItem('selected-category');

function load_ajax() {
    const ajax = new XMLHttpRequest();

    ajax.open('GET', '../public/data.json', true);
    ajax.onreadystatechange = function () {
        if (this.readyState !== 4 || this.status !== 200) return;

        let data = JSON.parse(this.responseText);
        data.products.forEach(product => {
            const element = document.getElementById('container');
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            //
            productDiv.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Category: ${product.category}</p>
                <p>Price: $${product.price}</p>
                <p>Description: ${product.description}</p>
                <p>Location: ${product.location}</p>
            `;

            element.appendChild(productDiv);
        });
        
    };

    ajax.send();
}

// load_ajax();

document.getElementById('location-href').textContent = selected_category;