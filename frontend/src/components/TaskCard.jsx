import { useDispatch } from "react-redux";
import { openDrawer } from "../features/uiSlice.js";

const priorityStyles = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-rose-100 text-rose-700"
};

const TaskCard = ({ task, draggable, onDragStart, onDragEnd }) => {
  const dispatch = useDispatch();
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="rounded-2xl bg-white dark:bg-ink-800 p-4 shadow-card cursor-pointer"
      onClick={() => dispatch(openDrawer(task))}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityStyles[task.priority] || priorityStyles.medium}`}>
          {task.priority}
        </span>
      </div>
      {task.dueDate && (
        <p className="text-xs text-ink-500 dark:text-ink-300 mt-2">
          Due {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
      <div className="flex flex-wrap gap-2 mt-3">
        {task.tags?.map((tag) => (
          <span key={tag} className="text-xs bg-ink-100 dark:bg-ink-700 text-ink-600 dark:text-ink-200 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
