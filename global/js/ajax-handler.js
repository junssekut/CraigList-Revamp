function isAuthenticated() {
    return localStorage.getItem('authenticated') === 'true';
}

function load_ajax() {
    return new Promise((resolve, reject) => {
        const ajax = new XMLHttpRequest();

        ajax.open('GET', '../../public/data.json', true);
        ajax.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            if (this.status !== 200) reject(new Error('Failed to load data'));

            resolve(JSON.parse(this.responseText));
        };

        ajax.send();
    });
}

function getProductFromID(id = null) {
    if (!id) {
        console.error(`Failed to get product from id, argument given was not valid.`);
        return null;
    }
    
    return new Promise((resolve, reject) => {
        const ajax = new XMLHttpRequest();

        ajax.open('GET', '../../public/data.json', true);
        ajax.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            if (this.status !== 200) reject(new Error('Failed to load data'));

            const products = JSON.parse(this.responseText).products.filter(product => product.id === id);

            if (products.length === 0) {
                reject(new Error(`Product with ID ${id} does not exists.`));
            }

            resolve(products[0]);
        };

        ajax.send();
    });
}