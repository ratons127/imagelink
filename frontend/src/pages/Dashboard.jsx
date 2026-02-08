import { useDispatch, useSelector } from "react-redux";
import TaskListView from "../components/TaskListView.jsx";
import { useEffect } from "react";
import { fetchReminders } from "../features/remindersSlice.js";

const Dashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((s) => s.tasks.items);
  const reminders = useSelector((s) => s.reminders.items);

  useEffect(() => {
    dispatch(fetchReminders());
  }, [dispatch]);

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    important: tasks.filter((t) => t.priority === "high").length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-white dark:bg-ink-800 p-6 shadow-card">
          <p className="text-xs text-ink-500">Total tasks</p>
          <h3 className="font-display text-2xl mt-2">{stats.total}</h3>
        </div>
        <div className="rounded-3xl bg-white dark:bg-ink-800 p-6 shadow-card">
          <p className="text-xs text-ink-500">Completed</p>
          <h3 className="font-display text-2xl mt-2">{stats.done}</h3>
        </div>
        <div className="rounded-3xl bg-white dark:bg-ink-800 p-6 shadow-card">
          <p className="text-xs text-ink-500">Important</p>
          <h3 className="font-display text-2xl mt-2">{stats.important}</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskListView tasks={tasks} />
        </div>
        <div className="rounded-3xl bg-white dark:bg-ink-800 p-6 shadow-card">
          <h3 className="font-display text-lg">Notifications</h3>
          <p className="text-xs text-ink-500 dark:text-ink-300">Upcoming reminders</p>
          <div className="mt-4 space-y-3">
            {reminders.slice(0, 5).map((r) => (
              <div key={r.id} className="rounded-xl border border-ink-100 dark:border-ink-700 p-3 text-sm">
                <p className="font-medium">Reminder</p>
                <p className="text-xs text-ink-500 dark:text-ink-300">
                  {new Date(r.remindAt).toLocaleString()}
                </p>
              </div>
            ))}
            {reminders.length === 0 && (
              <p className="text-sm text-ink-500 dark:text-ink-300">No reminders scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
