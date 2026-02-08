import { useSelector } from "react-redux";
import KanbanBoard from "../components/KanbanBoard.jsx";

const Kanban = () => {
  const tasks = useSelector((s) => s.tasks.items);
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white dark:bg-ink-800 p-6 shadow-card">
        <h2 className="font-display text-2xl">Kanban Board</h2>
        <p className="text-sm text-ink-500 dark:text-ink-300">Drag tasks across stages.</p>
      </div>
      <KanbanBoard tasks={tasks} />
    </div>
  );
};

export default Kanban;
