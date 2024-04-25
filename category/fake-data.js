function populateFakeData(count) {
    count = count ? count : 20;

    data = { "products": [] };

    fetch(`https://fakestoreapi.com/products?limit=${count}`)
        .then(res => res.json())
        .then(json => json.forEach(fakeProduct => {
            data.products.push({
                "category": fakeProduct.category,
                "name": fakeProduct.title.slice(0, 12),
                "price": fakeProduct.price,
                "description": fakeProduct.description.slice(0, 30),
                "image": fakeProduct.image,
                "location": "jkt"
            });

            console.log('added => ' + fakeProduct.title);
        }))
        .finally(() => {
            renderProducts(data.products);
            
        })
        .catch(error => { console.log(`error: ${error}`)});
}
