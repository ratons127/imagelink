import { useDispatch, useSelector } from "react-redux";
import { closeDrawer } from "../features/uiSlice.js";
import { updateTask } from "../features/tasksSlice.js";
import { useState, useEffect } from "react";

const TaskDrawer = () => {
  const dispatch = useDispatch();
  const task = useSelector((s) => s.ui.drawerTask);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
        reminderTime: task.reminderTime ? task.reminderTime.slice(0, 16) : "",
        priority: task.priority,
        status: task.status,
        tags: (task.tags || []).join(",")
      });
    }
  }, [task]);

  if (!task || !form) return null;

  const handleSave = () => {
    dispatch(
      updateTask({
        id: task.id,
        data: {
          ...form,
          dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
          reminderTime: form.reminderTime ? new Date(form.reminderTime).toISOString() : null,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        }
      })
    );
    dispatch(closeDrawer());
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-end z-50">
      <div className="w-full max-w-md bg-white dark:bg-ink-800 h-full p-6 shadow-card overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Task Details</h2>
          <button className="text-sm" onClick={() => dispatch(closeDrawer())}>
            Close
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <input
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="input min-h-[100px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase text-ink-500">Due date</label>
              <input
                type="date"
                className="input"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs uppercase text-ink-500">Reminder</label>
              <input
                type="datetime-local"
                className="input"
                value={form.reminderTime}
                onChange={(e) => setForm({ ...form, reminderTime: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase text-ink-500">Priority</label>
              <select
                className="input"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase text-ink-500">Status</label>
              <select
                className="input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase text-ink-500">Tags</label>
            <input
              className="input"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="design,urgent"
            />
          </div>
          <button className="btn btn-primary w-full" onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDrawer;
