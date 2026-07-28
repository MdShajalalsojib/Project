import { useState } from "react";
import DataTable from "../components/Tables/DataTable.jsx";
import InputField from "../components/Forms/InputField.jsx";
import Button from "../components/Buttons/Button.jsx";

const initialCourses = [
  { id: "C101", name: "Data Structures", teacher: "Dr. Kamal Uddin", schedule: "Mon/Wed 10AM" },
  { id: "C102", name: "Circuit Analysis", teacher: "Farhana Yasmin", schedule: "Tue/Thu 1PM" },
];

const columns = [
  { key: "name", label: "Course" },
  { key: "id", label: "Code" },
  { key: "teacher", label: "Teacher" },
  { key: "schedule", label: "Schedule" },
];

export default function Courses() {
  const [courses, setCourses] = useState(initialCourses);
  const [form, setForm] = useState({ id: "", name: "", teacher: "", schedule: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.id || !form.name) return;
    setCourses([...courses, form]);
    setForm({ id: "", name: "", teacher: "", schedule: "" });
  };

  const handleDelete = (row) => setCourses(courses.filter((c) => c.id !== row.id));

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow p-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <InputField placeholder="Course Code" value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })} />
        <InputField placeholder="Course Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <InputField placeholder="Assign Teacher" value={form.teacher}
          onChange={(e) => setForm({ ...form, teacher: e.target.value })} />
        <InputField placeholder="Schedule" value={form.schedule}
          onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
        <Button type="submit" className="sm:col-span-4">Save Course</Button>
      </form>

      <DataTable columns={columns} rows={courses} onDelete={handleDelete} />
    </div>
  );
}