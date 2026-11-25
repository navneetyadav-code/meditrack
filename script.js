const medicineForm = document.getElementById("medicineForm");
const medicineList = document.getElementById("medicineList");

let medicines = [];

medicineForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const medicine = {
        name: document.getElementById("medicineName").value.trim(),
        dosage: document.getElementById("dosage").value.trim(),
        timing: document.getElementById("timing").value,
        meal: document.getElementById("meal").value,
        stock: Number(document.getElementById("stock").value),
        taken: false
    };

    medicines.push(medicine);
    displayMedicines();
    medicineForm.reset();
});

function displayMedicines() {
    medicineList.innerHTML = "";

    if (medicines.length === 0) {
        medicineList.textContent = "No medicines added yet.";
        updateDashboard();
        return;
    }

    const timingOrder = {
        Morning: 1,
        Afternoon: 2,
        Night: 3
    };

    const sortedMedicines = medicines.slice().sort(function (first, second) {
        return timingOrder[first.timing] - timingOrder[second.timing];
    });

    sortedMedicines.forEach(function (medicine) {
        const medicineCard = document.createElement("div");
        medicineCard.className = "medicine-item";

        const medicineDetails = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = medicine.name;
        medicineDetails.appendChild(name);

        const instructions = document.createElement("p");
        instructions.textContent =
            medicine.dosage + " | " + medicine.timing + " | " + medicine.meal;
        medicineDetails.appendChild(instructions);

        const stockMessage = document.createElement("p");
        stockMessage.textContent = "Stock: ";

        const stockCount = document.createElement("span");
        stockCount.textContent = medicine.stock + " tablets";

        if (medicine.stock <= 5) {
            stockCount.className = "low-stock";
        }

        stockMessage.appendChild(stockCount);
        medicineDetails.appendChild(stockMessage);

        if (medicine.stock <= 5) {
            const refillReminder = document.createElement("p");
            refillReminder.className = "low-stock";
            refillReminder.textContent = "⚠ Low stock! Refill reminder";
            medicineDetails.appendChild(refillReminder);
        }

        const takenLabel = document.createElement("label");
        const takenCheckbox = document.createElement("input");
        takenCheckbox.type = "checkbox";
        takenCheckbox.checked = medicine.taken;
        takenCheckbox.addEventListener("change", function () {
            toggleMedicine(medicine);
        });

        takenLabel.appendChild(takenCheckbox);
        takenLabel.appendChild(document.createTextNode(" Taken"));

        medicineCard.appendChild(medicineDetails);
        medicineCard.appendChild(takenLabel);
        medicineList.appendChild(medicineCard);
    });

    updateDashboard();
}

function toggleMedicine(medicine) {
    medicine.taken = !medicine.taken;

    if (medicine.taken && medicine.stock > 0) {
        medicine.stock--;
    } else if (!medicine.taken) {
        medicine.stock++;
    }

    displayMedicines();
}

function updateDashboard() {
    let takenMedicines = 0;
    let totalStock = 0;

    for (let i = 0; i < medicines.length; i++) {
        if (medicines[i].taken) {
            takenMedicines++;
        }

        totalStock += medicines[i].stock;
    }

    document.getElementById("totalMedicines").textContent = medicines.length;
    document.getElementById("takenMedicines").textContent = takenMedicines;
    document.getElementById("totalStock").textContent = totalStock;
}

displayMedicines();
