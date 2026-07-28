const patientsData = getData('patients');
const doctorsData = getData('doctors');
const apptData = getData('appointments');

document.getElementById('totalPatients').textContent = patientsData.length;
document.getElementById('totalDoctors').textContent = doctorsData.length;

const today = new Date().toISOString().split('T')[0];
const todayAppts = apptData.filter(a => a.date === today);
document.getElementById('totalAppointments').textContent = todayAppts.length;

// Recent patients (last 5)
const recentPatientsTable = document.getElementById('recentPatientsTable');
patientsData.slice(-5).reverse().forEach(p => {
  recentPatientsTable.innerHTML += `
    <tr><td>${p.name}</td><td>${p.age}</td><td>${p.disease}</td><td>${p.phone}</td></tr>`;
});

// Recent appointments (last 5)
const recentApptTable = document.getElementById('recentAppointmentsTable');
apptData.slice(-5).reverse().forEach(a => {
  recentApptTable.innerHTML += `
    <tr><td>${a.patient}</td><td>${a.doctor}</td><td>${a.date}</td><td>${a.time}</td></tr>`;
});