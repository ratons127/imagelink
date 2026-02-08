import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/authSlice.js";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", phone: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (result.type.endsWith("fulfilled")) navigate("/");
  };

  return (
    <div>
      <h2 className="font-display text-2xl">Create account</h2>
      <p className="text-sm text-ink-500 mt-2">Start organizing tasks with TaskFlow.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          className="input"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="input"
          placeholder="Phone number"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn btn-primary w-full" type="submit">
          Create account
        </button>
      </form>
      <p className="text-sm mt-4">
        Already have an account? <Link className="text-accent-500" to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
