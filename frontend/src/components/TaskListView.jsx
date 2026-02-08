import { useDispatch } from "react-redux";
import { openDrawer } from "../features/uiSlice.js";
import { updateTask } from "../features/tasksSlice.js";

const TaskListView = ({ tasks }) => {
  const dispatch = useDispatch();
  const sorted = [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="rounded-3xl bg-white dark:bg-ink-800 shadow-card overflow-hidden">
      <div className="grid grid-cols-6 gap-4 p-4 text-xs uppercase text-ink-500 dark:text-ink-300 border-b border-ink-100 dark:border-ink-700">
        <div>Status</div>
        <div className="col-span-2">Title</div>
        <div>Due</div>
        <div>Priority</div>
        <div>Tags</div>
      </div>
      {sorted.map((task, index) => (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/taskId", task.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const fromId = e.dataTransfer.getData("text/taskId");
            if (fromId && fromId !== task.id) {
              dispatch(updateTask({ id: fromId, data: { order: index } }));
            }
          }}
          className="grid grid-cols-6 gap-4 p-4 items-center border-b border-ink-100 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-700/40 cursor-pointer"
          onClick={() => dispatch(openDrawer(task))}
        >
          <div>
            <input
              type="checkbox"
              checked={task.status === "done"}
              onChange={(e) => {
                e.stopPropagation();
                dispatch(updateTask({ id: task.id, data: { status: e.target.checked ? "done" : "todo" } }));
              }}
            />
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium">{task.title}</p>
            {task.description && <p className="text-xs text-ink-500 dark:text-ink-300">{task.description}</p>}
          </div>
          <div className="text-sm">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
          </div>
          <div className="text-sm capitalize">{task.priority}</div>
          <div className="flex flex-wrap gap-2">
            {task.tags?.map((tag) => (
              <span key={tag} className="text-xs bg-ink-100 dark:bg-ink-700 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="p-6 text-sm text-ink-500 dark:text-ink-300">No tasks yet.</div>
      )}
    </div>
  );
};

export default TaskListView;
