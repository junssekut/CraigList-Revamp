let product_id;

function onPreviewImageClick(preview_image) {
    const product_image = document.getElementById('thumbnail-image');

    if (preview_image.srcElement.src.split('/').pop() === product_image.getAttribute('src').split('/').pop()) return;

    product_image.classList.remove('aos-animate');
    
    setTimeout(function() {
        product_image.setAttribute('src', preview_image.srcElement.src);
        product_image.classList.add('aos-animate');
    }, 100);
}

function renderMap(city) {
    if (!city) return;

    fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + city)
        .then(response => response.json())
        .then(data => {
            if (data.length == 0) {
                console.error('No results found for the city: ' + city);
                return;
            }

            var latitude = parseFloat(data[0].lat);
            var longitude = parseFloat(data[0].lon);
            
            var map = L.map('product-location-map').setView([latitude, longitude], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            var marker = L.marker([latitude, longitude]).addTo(map);
            
            marker.on('click', function() {
                var googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + latitude + ',' + longitude;
                window.open(googleMapsUrl, '_blank');
            });
        })
        .catch(error => console.error('Error fetching geocoding data:', error));
}

async function load_product() {
    const product = await getProductFromID(product_id);

    document.title = product.name;
    if (document.getElementById('location-href').textContent === '') document.getElementById('location-href').textContent = product.category;

    {
        const previewImages = document.getElementById('list-preview-images').querySelectorAll('.preview-image');

        for (let i = 0; i < product.images.length; i++) {
            const imageURL = product.images[i];
            const imageElement = previewImages[i];
            
            imageElement.src = imageURL;
        }
    }

    {
        const element_thumbnail_image = document.getElementById('thumbnail-image');
        
        element_thumbnail_image.src = product.thumbnail;
    }

    {
        const element_product_name = document.getElementById('product-name');
        const element_product_price = document.getElementById('product-price');
        const element_product_description = document.getElementById('product-description');
        
        element_product_name.textContent = product.name;
        element_product_price.textContent = `$${product.price}`;
        element_product_description.textContent = product.briefDescription;
    }

    {
        renderMap(product.location);

        const element_product_description_big = document.getElementById('product-description-big');

        element_product_description_big.innerHTML = product.description.replaceAll('\n', '</br>');
    }
}

async function init() {
    AOS.init({
        offset: 0,
        duration: 400,
        delay: 0,
    });

    $(document).ready(function() {
        var params = new URLSearchParams(window.location.search);
        const query_product_id = params.get('id');

        if (!query_product_id)
            swal("Error", "You must select a product to enter this page.", "error")
                .then(() => {
                    window.open('/home/home.html', '_self');
                });

        product_id = query_product_id;

        load_product();
    });
    
    const previewImages = document.getElementsByClassName('preview-image');
    for (const image_element of previewImages) {
        image_element.addEventListener('click', onPreviewImageClick);
    }
}

init();