const productList = [];
let currentId = 1;

document.getElementById("productForm1").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get form data
    const formData = new FormData(this);

    // Convert FormData to JSON
    const productData = {};
    productData.id = (currentId++).toString();
    for (const [key, value] of formData.entries()) {
        // Handle images separately
        if (key === "thumbnail" || key === "images") {
            if (!productData[key]) productData[key] = key === 'thumbnail' ? '' : [];
            if (value instanceof File && value.type.startsWith('image/')) {
                if (key === 'thumbnail') {
                    productData[key] = `/public/${formData.get('category').toLowerCase()}/${value.name}`;
                } else {
                    productData[key].push(`/public/${formData.get('category').toLowerCase()}/${value.name}`); // Push file name instead of file object
                }
            }
        } else {
            productData[key] = value;
        }
    }


    // Add product data to productList
    productList.push(productData);

    // Clear form inputs
    this.reset();
});

// Get the input element
const priceInput = document.getElementById('price');

// Add event listener for keypress event
priceInput.addEventListener('keypress', (event) => {
    // Get the input value
    const inputValue = event.key;

    // Check if the input value is a valid decimal number or a valid key (like backspace or delete)
    if (!/[\d.]/.test(inputValue) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(inputValue)) {
        // Cancel the input key event
        event.preventDefault();
    }

    // Prevent multiple decimal points in the input
    if (inputValue === '.' && event.target.value.includes('.')) {
        event.preventDefault();
    }
});


// Function to copy JSON result to clipboard
function copyJSONToClipboard(jsonString) {
    // Use navigator.clipboard.writeText to copy the JSON string to clipboard
    navigator.clipboard.writeText(jsonString)
        .then(() => {
            // Success message
            alert('copied to clipboard, length: ' + jsonString.length);
        })
        .catch((error) => {
            // Error message
            alert('Unable to copy JSON to clipboard:' + error);
        });
}

// Event listener for "Get JSON Result" button
document.getElementById("getJsonButton").addEventListener('click', function() {
    // Get the JSON result
    const jsonResult = JSON.stringify({ products: productList }, null, 2);

    // Copy JSON result to clipboard
    copyJSONToClipboard(jsonResult);
});

