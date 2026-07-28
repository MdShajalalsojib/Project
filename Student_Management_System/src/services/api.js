// Placeholder service layer — swap with real API calls later.
const BASE_URL = "/api";

export async function getStudents() {
  // return fetch(`${BASE_URL}/students`).then((r) => r.json());
  return []; // mock until backend is connected
}

export async function addStudent(student) {
  // return fetch(`${BASE_URL}/students`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(student),
  // }).then((r) => r.json());
  return student;
}