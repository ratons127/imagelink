import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { updateMe } from "../features/authSlice.js";

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [prefs, setPrefs] = useState(() => {
    const raw = localStorage.getItem("prefs");
    return raw ? JSON.parse(raw) : { sms: true, email: false };
  });

  useEffect(() => {
    if (user) setForm({ name: user.name || "", phone: user.phone || "" });
  }, [user]);

  const savePrefs = (next) => {
    setPrefs(next);
    localStorage.setItem("prefs", JSON.stringify(next));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white dark:bg-ink-800 p-6 shadow-card">
        <h2 className="font-display text-2xl">Settings</h2>
        <p className="text-sm text-ink-500 dark:text-ink-300">Manage your profile and reminders.</p>
      </div>
      <div className="rounded-3xl bg-white dark:bg-ink-800 p-6 shadow-card space-y-4">
        <h3 className="font-display text-lg">Profile</h3>
        <input
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button className="btn btn-primary" onClick={() => dispatch(updateMe(form))}>
          Save profile
        </button>
      </div>
      <div className="rounded-3xl bg-white dark:bg-ink-800 p-6 shadow-card space-y-4">
        <h3 className="font-display text-lg">Notifications</h3>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={prefs.sms}
            onChange={(e) => savePrefs({ ...prefs, sms: e.target.checked })}
          />
          SMS reminders
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={prefs.email}
            onChange={(e) => savePrefs({ ...prefs, email: e.target.checked })}
          />
          Email reminders
        </label>
      </div>
    </div>
  );
};

export default Settings;
