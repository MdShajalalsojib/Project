import { useState } from "react";
import DataTable from "../components/Tables/DataTable.jsx";
import InputField from "../components/Forms/InputField.jsx";
import Button from "../components/Buttons/Button.jsx";

const initialBooks = [
  { id: "B001", title: "Introduction to Algorithms", author: "Cormen", status: "Available" },
  { id: "B002", title: "Digital Logic Design", author: "Morris Mano", status: "Issued" },
];

const columns = [
  { key: "title", label: "Title" },
  { key: "author", label: "Author" },
  { key: "status", label: "Status" },
];

export default function Library() {
  const [books, setBooks] = useState(initialBooks);
  const [form, setForm] = useState({ id: "", title: "", author: "", status: "Available" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title) return;
    setBooks([...books, { ...form, id: `B${books.length + 1}` }]);
    setForm({ id: "", title: "", author: "", status: "Available" });
  };

  const handleDelete = (row) => setBooks(books.filter((b) => b.id !== row.id));

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField placeholder="Book Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <InputField placeholder="Author" value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })} />
        <select className="border rounded px-3 py-2" value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>Available</option>
          <option>Issued</option>
        </select>
        <Button type="submit" className="sm:col-span-3">Add Book</Button>
      </form>

      <DataTable columns={columns} rows={books} onDelete={handleDelete} />
    </div>
  );
}