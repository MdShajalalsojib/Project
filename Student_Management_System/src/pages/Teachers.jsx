import { useState } from "react";
import DataTable from "../components/Tables/DataTable.jsx";
import InputField from "../components/Forms/InputField.jsx";
import Button from "../components/Buttons/Button.jsx";

const initialTeachers = [
  { id: "T001", name: "Dr. Kamal Uddin", subject: "Data Structures", dept: "CSE" },
  { id: "T002", name: "Farhana Yasmin", subject: "Circuit Analysis", dept: "EEE" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "id", label: "ID" },
  { key: "subject", label: "Subject" },
  { key: "dept", label: "Department" },
];

export default function Teachers() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [form, setForm] = useState({ id: "", name: "", subject: "", dept: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.id || !form.name) return;
    setTeachers([...teachers, form]);
    setForm({ id: "", name: "", subject: "", dept: "" });
  };

  const handleDelete = (row) =>
    setTeachers(teachers.filter((t) => t.id !== row.id));

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow p-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <InputField placeholder="Teacher ID" value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })} />
        <InputField placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <InputField placeholder="Subject" value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <InputField placeholder="Department" value={form.dept}
          onChange={(e) => setForm({ ...form, dept: e.target.value })} />
        <Button type="submit" className="sm:col-span-4">Save Teacher</Button>
      </form>

      <DataTable columns={columns} rows={teachers} onDelete={handleDelete} />
    </div>
  );
}