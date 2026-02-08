import { useDispatch } from "react-redux";
import TaskCard from "./TaskCard.jsx";
import { updateTask } from "../features/tasksSlice.js";

const columns = [
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" }
];

const KanbanBoard = ({ tasks }) => {
  const dispatch = useDispatch();

  const onDrop = (status, e) => {
    const id = e.dataTransfer.getData("text/taskId");
    if (id) {
      dispatch(updateTask({ id, data: { status } }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map((col) => (
        <div
          key={col.key}
          className="rounded-3xl bg-white dark:bg-ink-800 shadow-card p-4 min-h-[320px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(col.key, e)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg">{col.label}</h3>
            <span className="text-xs text-ink-500 dark:text-ink-300">
              {tasks.filter((t) => t.status === col.key).length}
            </span>
          </div>
          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === col.key)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/taskId", task.id)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
