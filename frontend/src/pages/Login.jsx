import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice.js";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((s) => s.auth.status);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (result.type.endsWith("fulfilled")) navigate("/");
  };

  return (
    <div>
      <h2 className="font-display text-2xl">Sign in</h2>
      <p className="text-sm text-ink-500 mt-2">Access your TaskFlow workspace.</p>
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
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn btn-primary w-full" type="submit" disabled={status === "loading"}>
          Sign in
        </button>
      </form>
      <p className="text-sm mt-4">
        No account? <Link className="text-accent-500" to="/register">Create one</Link>
      </p>
    </div>
  );
};

export default Login;
