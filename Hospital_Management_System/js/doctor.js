const DOCTOR_KEY = 'doctors';
let doctors = getData(DOCTOR_KEY);

const doctorForm = document.getElementById('doctorForm');
const doctorTable = document.getElementById('doctorTable');
const searchDoctor = document.getElementById('searchDoctor');

function renderDoctors(list = doctors) {
  doctorTable.innerHTML = '';
  list.forEach(d => {
    doctorTable.innerHTML += `
      <tr>
        <td>${d.name}</td>
        <td>${d.dept}</td>
        <td>${d.experience} yrs</td>
        <td>${d.email}</td>
        <td>${d.phone}</td>
        <td>${d.time}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editDoctor('${d.id}')">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteDoctor('${d.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

doctorForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('doctorId').value;

  const doctorData = {
    id: id || generateId(),
    name: document.getElementById('dName').value.trim(),
    dept: document.getElementById('dDept').value,
    experience: document.getElementById('dExperience').value,
    email: document.getElementById('dEmail').value.trim(),
    phone: document.getElementById('dPhone').value.trim(),
    time: document.getElementById('dTime').value.trim()
  };

  if (id) {
    doctors = doctors.map(d => d.id === id ? doctorData : d);
    showToast('Doctor updated successfully!');
  } else {
    doctors.push(doctorData);
    showToast('Doctor added successfully!');
  }

  saveData(DOCTOR_KEY, doctors);
  renderDoctors();
  doctorForm.reset();
  document.getElementById('doctorId').value = '';
});

function editDoctor(id) {
  const d = doctors.find(d => d.id === id);
  if (!d) return;
  document.getElementById('doctorId').value = d.id;
  document.getElementById('dName').value = d.name;
  document.getElementById('dDept').value = d.dept;
  document.getElementById('dExperience').value = d.experience;
  document.getElementById('dEmail').value = d.email;
  document.getElementById('dPhone').value = d.phone;
  document.getElementById('dTime').value = d.time;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteDoctor(id) {
  if (!confirm('Are you sure you want to delete this doctor?')) return;
  doctors = doctors.filter(d => d.id !== id);
  saveData(DOCTOR_KEY, doctors);
  renderDoctors();
  showToast('Doctor deleted.');
}

document.getElementById('resetDoctorForm').addEventListener('click', () => {
  doctorForm.reset();
  document.getElementById('doctorId').value = '';
});

searchDoctor.addEventListener('input', function() {
  const term = this.value.toLowerCase();
  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(term) || d.dept.toLowerCase().includes(term)
  );
  renderDoctors(filtered);
});

renderDoctors();