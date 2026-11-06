
// Get HTML elements
const medicineForm = document.getElementById("medicineForm");
const medicineList = document.getElementById("medicineList");

// Store medicines
let medicines = JSON.parse(localStorage.getItem("medicines")) || [];

// Add medicine
medicineForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const medicine = {
        id: Date.now(),
        name: document.getElementById("medicineName").value.trim(),
        dosage: document.getElementById("dosage").value.trim(),
        timing: document.getElementById("timing").value,
        meal: document.getElementById("meal").value,
        stock: Number(document.getElementById("stock").value),
        taken: false
    };

    medicines.push(medicine);

    saveMedicines();

    medicineForm.reset();

});

// Save data
function saveMedicines() {

    localStorage.setItem("medicines", JSON.stringify(medicines));

    displayMedicines();

}

// Display medicines
function displayMedicines() {

    medicineList.innerHTML = "";

    medicines.sort((a, b) => {
        const order = {
            Morning: 1,
            Afternoon: 2,
            Night: 3
        };

        return order[a.timing] - order[b.timing];
    });

    medicines.forEach(function(medicine) {

        const item = document.createElement("div");

        item.className = "medicine-item";

        item.innerHTML = `
            <div>
                <h3>${medicine.name}</h3>

                <p>
                    ${medicine.dosage} |
                    ${medicine.timing} |
                    ${medicine.meal}
                </p>

                <p>
                    Stock: <span class="${medicine.stock <= 5 ? "low-stock" : ""}">
                    ${medicine.stock} tablets
                    </span>
                </p>

                ${medicine.stock <= 5
                    ? '<p class="low-stock">⚠ Low stock! Refill reminder</p>'
                    : ''}
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        ${medicine.taken ? "checked" : ""}
                        onchange="toggleMedicine(${medicine.id})"
                    >
                    Taken
                </label>
            </div>
        `;

        medicineList.appendChild(item);

    });

    updateDashboard();

}

// Mark medicine as taken or not taken
function toggleMedicine(id) {

    const medicine = medicines.find(m => m.id === id);

    if (!medicine) return;

    medicine.taken = !medicine.taken;

    if (medicine.taken) {
        medicine.stock = Math.max(0, medicine.stock - 1);
    } else {
        medicine.stock++;
    }

    saveMedicines();

}

// Update dashboard numbers
function updateDashboard() {

    const total = medicines.length;

    const taken = medicines.filter(m => m.taken).length;

    const stock = medicines.reduce((sum, m) => sum + m.stock, 0);

    document.getElementById("totalMedicines").innerText = total;

    document.getElementById("takenMedicines").innerText = taken;

    document.getElementById("totalStock").innerText = stock;

}

// Load saved medicines when page opens
displayMedicines();
