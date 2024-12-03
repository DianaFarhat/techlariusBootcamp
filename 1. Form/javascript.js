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
    } else {
        console.log("Product not found.");
    }
}

function createEditableCell(row, cellIndex, type, defaultValue, callback) {
    const cell = row.insertCell(cellIndex);
    const input = document.createElement('input');
    input.type = 'number';
    input.value = defaultValue;
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
            <td colspan="1">Totals:</td>
            <td>Avg: $${avgPrice.toFixed(2)}</td>
            <td>Quantity: ${totalQuantity}</td>
            <td>Avg: ${avgDiscount.toFixed(2)}%</td>
            <td colspan="2"></td>
            <td>Sum: $${totalExtendedPrice.toFixed(2)}</td>
        </tr>
    `;
}
