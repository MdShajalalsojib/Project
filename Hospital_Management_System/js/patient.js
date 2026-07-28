const PATIENT_KEY = 'patients';
let patients = getData(PATIENT_KEY);

const patientForm = document.getElementById('patientForm');
const patientTable = document.getElementById('patientTable');
const searchPatient = document.getElementById('searchPatient');

function renderPatients(list = patients) {
  patientTable.innerHTML = '';
  list.forEach(p => {
    patientTable.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.blood}</td>
        <td>${p.phone}</td>
        <td>${p.address}</td>
        <td>${p.disease}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editPatient('${p.id}')">Edit</button>
          <button class="action-btn delete-btn" onclick="deletePatient('${p.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

patientForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('patientId').value;

  const patientData = {
    id: id || generateId(),
    name: document.getElementById('pName').value.trim(),
    age: document.getElementById('pAge').value,
    gender: document.getElementById('pGender').value,
    blood: document.getElementById('pBlood').value,
    phone: document.getElementById('pPhone').value.trim(),
    address: document.getElementById('pAddress').value.trim(),
    disease: document.getElementById('pDisease').value.trim()
  };

  if (id) {
    patients = patients.map(p => p.id === id ? patientData : p);
    showToast('Patient updated successfully!');
  } else {
    patients.push(patientData);
    showToast('Patient added successfully!');
  }

  saveData(PATIENT_KEY, patients);
  renderPatients();
  patientForm.reset();
  document.getElementById('patientId').value = '';
});

function editPatient(id) {
  const p = patients.find(p => p.id === id);
  if (!p) return;
  document.getElementById('patientId').value = p.id;
  document.getElementById('pName').value = p.name;
  document.getElementById('pAge').value = p.age;
  document.getElementById('pGender').value = p.gender;
  document.getElementById('pBlood').value = p.blood;
  document.getElementById('pPhone').value = p.phone;
  document.getElementById('pAddress').value = p.address;
  document.getElementById('pDisease').value = p.disease;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deletePatient(id) {
  if (!confirm('Are you sure you want to delete this patient?')) return;
  patients = patients.filter(p => p.id !== id);
  saveData(PATIENT_KEY, patients);
  renderPatients();
  showToast('Patient deleted.');
}

document.getElementById('resetPatientForm').addEventListener('click', () => {
  patientForm.reset();
  document.getElementById('patientId').value = '';
});

searchPatient.addEventListener('input', function() {
  const term = this.value.toLowerCase();
  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(term) || p.phone.includes(term)
  );
  renderPatients(filtered);
});

renderPatients();