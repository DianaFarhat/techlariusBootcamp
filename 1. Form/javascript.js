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
  
    //Add freight event listener
    document.getElementById('freight').addEventListener('input', updateFooter);

   

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
    event.preventDefault(); // Prevent form submission on button click

    const productSelect = document.getElementById('product-select');
    const selectedProductId = productSelect.value; // Get the selected productId

    // Find the product from productsDb using the selected productId
    const selectedProduct = productsDb.find(product => product.productId == selectedProductId);

    if (selectedProduct) {
        const { productName, unitPrice: price, category, supplier } = selectedProduct;

        // Add product details to the table
        const table = document.getElementById('order-details-table').getElementsByTagName('tbody')[0];
        const row = table.insertRow();

        // Populate row cells
        row.insertCell(0).textContent = productName;
        row.insertCell(1).textContent = `$${price.toFixed(2)}`;

        createEditableCell(row, 2, 'quantity', 1, updateFooter);
        createEditableCell(row, 3, 'discount', 0, updateFooter);

        row.insertCell(4).textContent = category;
        row.insertCell(5).textContent = supplier;

        // Add extended price cell
        const extendedPriceCell = row.insertCell(6);
        updateExtendedPrice(row, price, extendedPriceCell);

        // Add delete button
        addDeleteButton(row, updateFooter);

        // Update footer
        updateFooter();

        // Disable the selected option in the dropdown
        const selectedOption = productSelect.querySelector(`option[value="${selectedProductId}"]`);
        if (selectedOption) {
            selectedOption.disabled = true;
        }

        // Reset the select to the first option or any specific option
        productSelect.selectedIndex = 0; // Or change this to another index if you prefer a different default
    } else {
        console.log("Product not found.");
    }
}

function createEditableCell(row, cellIndex, type, defaultValue, callback) {
    const cell = row.insertCell(cellIndex);
    const input = document.createElement('input');
    input.type = 'number';
    input.value = defaultValue;
    input.style.width = '40px'; 
    input.min = type === 'quantity' ? 1 : 0; // Quantity must be at least 1, discount at least 0
    input.addEventListener('input', () => {
        updateExtendedPrice(row, parseFloat(row.cells[1].textContent.replace('$', '')) || 0, row.cells[6]);
        callback(); // Update footer on input change
    });
    cell.appendChild(input);
}

function addDeleteButton(row, callback) {
    const deleteCell = row.insertCell(7);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    Object.assign(deleteBtn.style, {
        color: 'white',
        backgroundColor: 'red',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
        borderRadius: '5px'
    });
    deleteCell.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', () => {
        const productName = row.cells[0].textContent;
        const productId = productsDb.find(product => product.productName === productName).productId;

        // Re-enable the option in the select dropdown
        const productSelect = document.getElementById('product-select');
        const optionToEnable = productSelect.querySelector(`option[value="${productId}"]`);
        if (optionToEnable) {
            optionToEnable.disabled = false;
        }

        row.remove();
        callback(); // Update footer on row deletion
    });
}

function updateExtendedPrice(row, price, extendedPriceCell) {
    const quantity = parseFloat(row.cells[2].querySelector('input').value) || 1;
    const discount = parseFloat(row.cells[3].querySelector('input').value) || 0;
    const extendedPrice = price * quantity * (1 - discount / 100);
    extendedPriceCell.textContent = `$${extendedPrice.toFixed(2)}`;
}

function updateFooter() {
    const table = document.getElementById('order-details-table');
    const tbody = table.querySelector('tbody');
    const rows = tbody.rows;

    let totalPrice = 0;
    let totalQuantity = 0;
    let totalDiscount = 0;
    let totalExtendedPrice = 0;
    let rowCount = rows.length;

    for (let i = 0; i < rowCount; i++) {
        const cells = rows[i].cells;
        const unitPrice = parseFloat(cells[1].textContent.replace('$', '')) || 0;
        const quantity = parseFloat(cells[2].querySelector('input').value) || 0;
        const discount = parseFloat(cells[3].querySelector('input').value) || 0;
        const extendedPrice = parseFloat(cells[6].textContent.replace('$', '')) || 0;

        totalPrice += unitPrice;
        totalQuantity += quantity;
        totalDiscount += discount;
        totalExtendedPrice += extendedPrice;
    }

    const avgPrice = rowCount > 0 ? totalPrice / rowCount : 0;
    const avgDiscount = rowCount > 0 ? totalDiscount / rowCount : 0;

    // Update the footer
    const tfoot = table.querySelector('tfoot') || table.createTFoot();
    tfoot.innerHTML = `
        <tr>
            <td>Totals:</td>
            <td>Avg: $${avgPrice.toFixed(2)}</td>
            <td>Quantity: ${totalQuantity}</td>
            <td>Avg: ${avgDiscount.toFixed(2)}%</td>
            <td colspan="2"></td>
            <td>Sum: $${totalExtendedPrice.toFixed(2)}</td>
        </tr>
    `;

    //Update Shipping-Right
    document.getElementById('subtotal').innerHTML= `$${totalExtendedPrice.toFixed(2)}`;
    const freightCost= parseFloat(document.getElementById('freight').value);
    const total= totalExtendedPrice + freightCost;
    document.getElementById('total').innerHTML=  `$${total.toFixed(2)}`;;
}


function okOrder(event) {
    event.preventDefault(); // Prevent form submission

    // Make sure you select the form by its ID or other method
    const form = document.getElementById('order-form'); // Replace with your actual form ID
    const formData = new FormData(form); // Pass the form element to FormData
    const formObject = Object.fromEntries(formData.entries()); // Convert to an object

    // Add Custom Data (Order Items)
    const order = [];
    const table = document.getElementById('order-details-table');
    const tbody = table.querySelector('tbody');
    const rows = tbody.rows;

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        const productId = productsDb.find(product => product.productName === cells[0].textContent).productId;
        const quantity = parseFloat(cells[2].querySelector('input').value) || 0;
        const discount = parseFloat(cells[3].querySelector('input').value) || 0;

        const item = { "productId": productId, "quantity": quantity, "discount": discount };
        order.push(item); // Use push to add to the array
    }

    formObject.customerOrder = order;

    // Debug log for order data
    console.log("Order Data: ", order);

    // Transform the Object to a JSON String
    const jsonString = JSON.stringify(formObject, null, 2);
    console.log("Generated JSON String: ", jsonString);  // Debug log

    const blob = new Blob([jsonString], { type: 'application/json' });
    console.log("Blob created: ", blob); // Debug log

    const url = URL.createObjectURL(blob);
    console.log("Object URL created: ", url); // Debug log

    // Trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_order.json'; // File name for download
    a.click();

    // Revoke URL after download
    URL.revokeObjectURL(url);
    console.log("Blob URL revoked");
}



 