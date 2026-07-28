const APPT_KEY = 'appointments';
let appointments = getData(APPT_KEY);
let doctorsList = getData('doctors');

const apptForm = document.getElementById('appointmentForm');
const apptTable = document.getElementById('apptTable');
const searchAppt = document.getElementById('searchAppt');
const apDoctorSelect = document.getElementById('apDoctor');
const apDeptInput = document.getElementById('apDept');

// Populate doctor dropdown
function populateDoctors() {
  apDoctorSelect.innerHTML = '<option value="">Select Doctor</option>';
  doctorsList.forEach(d => {
    apDoctorSelect.innerHTML += `<option value="${d.name}" data-dept="${d.dept}">${d.name} (${d.dept})</option>`;
  });
}

apDoctorSelect.addEventListener('change', function() {
  const selected = this.options[this.selectedIndex];
  apDeptInput.value = selected.getAttribute('data-dept') || '';
});

function renderAppointments(list = appointments) {
  apptTable.innerHTML = '';
  list.forEach(a => {
    apptTable.innerHTML += `
      <tr>
        <td>${a.patient}</td>
        <td>${a.doctor}</td>
        <td>${a.dept}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td>${a.problem}</td>
        <td>${a.status}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editAppt('${a.id}')">Edit</button>
          <button class="action-btn delete-btn" onclick="cancelAppt('${a.id}')">Cancel</button>
        </td>
      </tr>`;
  });
}

apptForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('apptId').value;

  const apptData = {
    id: id || generateId(),
    patient: document.getElementById('apPatient').value.trim(),
    doctor: document.getElementById('apDoctor').value,
    dept: document.getElementById('apDept').value,
    date: document.getElementById('apDate').value,
    time: document.getElementById('apTime').value,
    problem: document.getElementById('apProblem').value.trim(),
    status: 'Confirmed'
  };

  if (id) {
    appointments = appointments.map(a => a.id === id ? apptData : a);
    showToast('Appointment updated!');
  } else {
    appointments.push(apptData);
    showToast('Appointment booked successfully!');
  }

  saveData(APPT_KEY, appointments);
  renderAppointments();
  apptForm.reset();
  document.getElementById('apptId').value = '';
});

function editAppt(id) {
  const a = appointments.find(a => a.id === id);
  if (!a) return;
  document.getElementById('apptId').value = a.id;
  document.getElementById('apPatient').value = a.patient;
  document.getElementById('apDoctor').value = a.doctor;
  document.getElementById('apDept').value = a.dept;
  document.getElementById('apDate').value = a.date;
  document.getElementById('apTime').value = a.time;
  document.getElementById('apProblem').value = a.problem;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelAppt(id) {
  if (!confirm('Cancel this appointment?')) return;
  appointments = appointments.filter(a => a.id !== id);
  saveData(APPT_KEY, appointments);
  renderAppointments();
  showToast('Appointment cancelled.');
}

document.getElementById('resetApptForm').addEventListener('click', () => {
  apptForm.reset();
  document.getElementById('apptId').value = '';
});

searchAppt.addEventListener('input', function() {
  const term = this.value.toLowerCase();
  const filtered = appointments.filter(a =>
    a.patient.toLowerCase().includes(term) || a.doctor.toLowerCase().includes(term)
  );
  renderAppointments(filtered);
});

populateDoctors();
renderAppointments();