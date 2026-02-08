import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import TaskDrawer from "./TaskDrawer.jsx";
import { fetchLists } from "../features/listsSlice.js";
import { createTask, fetchTasks } from "../features/tasksSlice.js";

const viewMap = {
  "/": "all",
  "/my-day": "my-day",
  "/planned": "planned",
  "/important": "important",
  "/completed": "completed",
  "/kanban": "all"
};

const AppLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [quickTitle, setQuickTitle] = useState("");
  const lists = useSelector((s) => s.lists.items);

  useEffect(() => {
    dispatch(fetchLists());
  }, [dispatch]);

  useEffect(() => {
    const view = viewMap[location.pathname] || "all";
    dispatch(fetchTasks({ view }));
  }, [dispatch, location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key.toLowerCase() === "n") {
        document.getElementById("quick-task")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleQuickAdd = () => {
    if (!quickTitle.trim()) return;
    const listId = lists[0]?.id;
    if (!listId) return;
    dispatch(createTask({ title: quickTitle, listId }));
    setQuickTitle("");
  };

  return (
    <div className="min-h-screen gradient-surface">
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar />
          <div className="rounded-3xl bg-white/80 dark:bg-ink-800/80 p-4 shadow-card flex items-center gap-3">
            <input
              id="quick-task"
              className="input"
              placeholder="Add a quick task..."
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? handleQuickAdd() : null)}
            />
            <button className="btn btn-primary" onClick={handleQuickAdd}>
              Add
            </button>
          </div>
          <Outlet />
        </main>
      </div>
      <TaskDrawer />
    </div>
  );
};

export default AppLayout;
