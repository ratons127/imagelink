import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/uiSlice.js";
import { logout } from "../features/authSlice.js";

const Topbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  return (
    <header className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">TaskFlow</p>
        <h1 className="font-display text-2xl">Welcome {user?.name || user?.email}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="btn btn-secondary" onClick={() => dispatch(toggleTheme())}>
          Toggle theme
        </button>
        <button className="btn btn-secondary" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
