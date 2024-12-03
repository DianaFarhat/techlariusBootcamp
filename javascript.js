// Sample products database (mock)
const productsDb = [
    { productId: 1, productName: 'Coffee Maker', unitPrice: 50, category: 'Electronics', supplier: 'Nespresso' },
    { productId: 2, productName: 'Espresso', unitPrice: 20, category: 'Beverages', supplier: 'Nespresso' },
    { productId: 3, productName: 'Juicer', unitPrice: 80, category: 'Appliances', supplier: 'Super Chef' }
];

const countries = [
    {code: "LB", name: "Lebanon"},
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "FR", name: "France" },
    { code: "DE", name: "Germany" },
    { code: "IN", name: "India" },
    { code: "CN", name: "China" },
    { code: "JP", name: "Japan" },
    // Add more countries
];

//Script
document.addEventListener('DOMContentLoaded', () => {

    // Populate the shipping country dropdown
    const shipCountrySelect = document.getElementById('ship-country');
    countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.code;
    option.textContent = country.name;
    shipCountrySelect.appendChild(option);
    });

    //Populate the items dropdown
    populateProductSelect();
  


    //Form submission
    const okButton = document.getElementById('ok-button');
    okButton.addEventListener('click', () => {
        const formData= new FormData(e.target);

        console.log(formData.entries());
    });

});


// Populate the Product Select Dropdown with detailed information
function populateProductSelect() {
    const productSelect = document.getElementById('product-select');
    productsDb.forEach(product => {
        const option = document.createElement('option');
        option.value = product.productId;
        option.textContent = `${product.productName} | $${product.unitPrice} | ${product.category} | ${product.supplier}`;
        productSelect.appendChild(option);
    });
}


// This is the function you call when the "Add" button is clicked
function addProductToTable(event) {
    event.preventDefault();  // Prevent form submission on button click
    
    const productSelect = document.getElementById('product-select');
    const selectedProductId = productSelect.value;  // Get the selected productId

    // Find the product from productsDb using the selected productId
    const selectedProduct = productsDb.find(product => product.productId == selectedProductId);

    if (selectedProduct) {
         // Extract product details from the selected product
    const productName = selectedProduct.productName;
    const price = selectedProduct.unitPrice;
    const category = selectedProduct.category;
    const supplier = selectedProduct.supplier;

    // Example: Add product details to the table (you can customize this part)
    const table = document.getElementById('order-details-table').getElementsByTagName('tbody')[0];
    const row = table.insertRow();

    // Add product details to the row
    row.insertCell(0).textContent = productName;  // Product Name
    row.insertCell(1).textContent = `$${price.toFixed(2)}`;  // Unit Price

    // Create input fields for editable Quantity and Discount
    const quantityCell = row.insertCell(2);
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = 1;  // Default quantity
    quantityInput.min = 1;  // Minimum value
    quantityCell.appendChild(quantityInput);

    const discountCell = row.insertCell(3);
    const discountInput = document.createElement('input');
    discountInput.type = 'number';
    discountInput.value = 0;  // Default discount
    discountInput.min = 0;  // Minimum value
    discountCell.appendChild(discountInput);

    // Add Category and Supplier details
    row.insertCell(4).textContent = category;  // Category
    row.insertCell(5).textContent = supplier;  // Supplier

    // Add Extended Price cell (calculated as price * quantity)
    const extendedPriceCell = row.insertCell(6);
    extendedPriceCell.textContent = `$${(price * 1).toFixed(2)}`;  // Default Extended Price

      // Create the "X" delete button
      const deleteCell = row.insertCell(7);
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'X';
      deleteBtn.style.color = 'white';  // White text color for the "X"
      deleteBtn.style.backgroundColor = 'red';  // Red background
      deleteBtn.style.border = 'none';  // Remove border
      deleteBtn.style.padding = '5px 10px';  // Padding for a nice button size
      deleteBtn.style.cursor = 'pointer';  // Pointer cursor on hover
      deleteBtn.style.borderRadius = '5px';  // Rounded corners for the button
      deleteCell.appendChild(deleteBtn);
  
      // Event listener to delete the row when the "X" is clicked
      deleteBtn.addEventListener('click', () => {
          row.remove();  // Remove the row from the table
      });


    } else {
        console.log("Product not found.");
    }
}


/*
*
*
*/

// Update Extended Price on Quantity Change and Discount Change
function updateExtendedPrice(input, price, discount) {
    //
    updateTotalPrice();
}

// Update Total Price in Footer
function updateTotalPrice() {
    const extendedPrices = document.querySelectorAll('.extended-price');
    let total = 0;

    extendedPrices.forEach(priceCell => {
        total += parseFloat(priceCell.textContent.replace('$', ''));
    });

    document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;
}


