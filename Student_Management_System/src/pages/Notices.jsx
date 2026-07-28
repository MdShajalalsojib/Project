import { useState } from "react";
import Button from "../components/Buttons/Button.jsx";
import InputField from "../components/Forms/InputField.jsx";

const initialNotices = [
  { id: 1, title: "Semester Final Exam Routine Published", date: "2026-07-20" },
  { id: 2, title: "Fee Payment Deadline Extended", date: "2026-07-25" },
];

export default function Notices() {
  const [notices, setNotices] = useState(initialNotices);
  const [title, setTitle] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title) return;
    setNotices([
      { id: Date.now(), title, date: new Date().toISOString().slice(0, 10) },
      ...notices,
    ]);
    setTitle("");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow p-5 flex gap-4">
        <InputField
          placeholder="New notice title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit">Post Notice</Button>
      </form>

      <div className="bg-white rounded-xl shadow divide-y">
        {notices.map((n) => (
          <div key={n.id} className="p-4 flex justify-between">
            <span>{n.title}</span>
            <span className="text-sm text-slate-400">{n.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}