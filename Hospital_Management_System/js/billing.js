const BILL_KEY = 'bills';
let bills = getData(BILL_KEY);

const billForm = document.getElementById('billingForm');
const billTable = document.getElementById('billTable');
const billTotalEl = document.getElementById('billTotal');

const treatmentInput = document.getElementById('bTreatment');
const medicineInput = document.getElementById('bMedicine');
const roomInput = document.getElementById('bRoom');

function calculateTotal() {
  const total =
    (+treatmentInput.value || 0) +
    (+medicineInput.value || 0) +
    (+roomInput.value || 0);
  billTotalEl.textContent = total;
  return total;
}

[treatmentInput, medicineInput, roomInput].forEach(input => {
  input.addEventListener('input', calculateTotal);
});

function renderBills(list = bills) {
  billTable.innerHTML = '';
  list.forEach(b => {
    billTable.innerHTML += `
      <tr>
        <td>${b.patient}</td>
        <td>$${b.treatment}</td>
        <td>$${b.medicine}</td>
        <td>$${b.room}</td>
        <td>$${b.total}</td>
        <td>
          <button class="action-btn delete-btn" onclick="deleteBill('${b.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

billForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const billData = {
    id: generateId(),
    patient: document.getElementById('bPatient').value.trim(),
    treatment: +treatmentInput.value || 0,
    medicine: +medicineInput.value || 0,
    room: +roomInput.value || 0,
    total: calculateTotal()
  };

  bills.push(billData);
  saveData(BILL_KEY, bills);
  renderBills();
  billForm.reset();
  billTotalEl.textContent = '0';
  showToast('Bill saved successfully!');
});

function deleteBill(id) {
  if (!confirm('Delete this bill?')) return;
  bills = bills.filter(b => b.id !== id);
  saveData(BILL_KEY, bills);
  renderBills();
  showToast('Bill deleted.');
}

document.getElementById('printBill').addEventListener('click', () => {
  window.print();
});

document.getElementById('resetBillForm').addEventListener('click', () => {
  billForm.reset();
  billTotalEl.textContent = '0';
});

renderBills();