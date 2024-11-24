// Get DOM elements
const medicineGrid = document.getElementById('medicineGrid');
const addForm = document.getElementById('addMedicineForm');

// Fetch medicines from backend
async function fetchMedicines() {
    try {
        const response = await fetch('http://localhost:8000/medicines');
        const data = await response.json();
        displayMedicines(data.medicines);
    } catch (error) {
        console.error('Error fetching medicines:', error);
        medicineGrid.innerHTML = '<p>Error loading medicines.</p>';
    }
}

// Display medicines in grid
function displayMedicines(medicines) {
    medicineGrid.innerHTML = '';
    
    medicines.forEach(medicine => {
        const card = document.createElement('div');
        card.className = `medicine-card ${(!medicine.name || medicine.price === null) ? 'error' : ''}`;
        
        // Handle missing or invalid data
        const name = medicine.name || 'Unknown Medicine';
        const price = medicine.price !== null ? 
            `$${parseFloat(medicine.price).toFixed(2)}` : 
            'Price unavailable';
        
        card.innerHTML = `
            <h3>${name}</h3>
            <div class="price">${price}</div>
            <button onclick="deleteMedicine('${name}')">Delete</button>
        `;
        
        medicineGrid.appendChild(card);
    });
}

// Add new medicine
addForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('name', document.getElementById('medicineName').value);
    formData.append('price', document.getElementById('medicinePrice').value);
    
    try {
        const response = await fetch('http://localhost:8000/create', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            addForm.reset();
            fetchMedicines();
        }
    } catch (error) {
        console.error('Error adding medicine:', error);
    }
});

// Delete medicine
async function deleteMedicine(name) {
    if (!confirm(`Delete ${name}?`)) return;
    
    const formData = new FormData();
    formData.append('name', name);
    
    try {
        const response = await fetch('http://localhost:8000/delete', {
            method: 'DELETE',
            body: formData
        });
        
        if (response.ok) {
            fetchMedicines();
        }
    } catch (error) {
        console.error('Error deleting medicine:', error);
    }
}

// Load medicines when page loads
document.addEventListener('DOMContentLoaded', fetchMedicines);