import { useSelector } from "react-redux";
import TaskListView from "../components/TaskListView.jsx";

const Planned = () => {
  const tasks = useSelector((s) => s.tasks.items);
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white dark:bg-ink-800 p-6 shadow-card">
        <h2 className="font-display text-2xl">Planned</h2>
        <p className="text-sm text-ink-500 dark:text-ink-300">Every task with a due date.</p>
      </div>
      <TaskListView tasks={tasks} />
    </div>
  );
};

export default Planned;
