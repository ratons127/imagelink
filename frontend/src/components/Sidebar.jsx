import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Dashboard" },
  { to: "/my-day", label: "My Day" },
  { to: "/planned", label: "Planned" },
  { to: "/important", label: "Important" },
  { to: "/completed", label: "Completed" },
  { to: "/kanban", label: "Kanban" },
  { to: "/settings", label: "Settings" }
];

const Sidebar = () => {
  return (
    <aside className="w-64 hidden lg:flex flex-col gap-3">
      <div className="p-6 rounded-3xl bg-white dark:bg-ink-800 shadow-card">
        <h2 className="font-display text-2xl">TaskFlow</h2>
        <p className="text-xs text-ink-500 dark:text-ink-300 mt-2">Personal & team productivity</p>
      </div>
      <nav className="p-4 rounded-3xl bg-white dark:bg-ink-800 shadow-card flex flex-col gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-xl px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-accent-500 text-white"
                  : "text-ink-700 dark:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-700"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto p-4 rounded-3xl bg-white dark:bg-ink-800 shadow-card text-xs text-ink-500 dark:text-ink-300">
        Tip: Press <span className="font-semibold">N</span> to add a task
      </div>
    </aside>
  );
};

export default Sidebar;
