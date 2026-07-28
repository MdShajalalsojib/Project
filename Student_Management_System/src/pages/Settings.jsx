import { useState } from "react";
import Button from "../components/Buttons/Button.jsx";
import InputField from "../components/Forms/InputField.jsx";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState({ name: "Admin", email: "admin@edutrack.com" });

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl space-y-6">
      <h2 className="font-semibold text-lg">Profile Settings</h2>
      <InputField label="Name" value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
      <InputField label="Email" value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })} />

      <div className="flex items-center justify-between pt-4 border-t">
        <span>Dark Mode</span>
        <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
      </div>

      <Button>Save Changes</Button>
    </div>
  );
}