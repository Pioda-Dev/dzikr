import { useState, useEffect } from "react";
import { Plus, Check, X, Edit, Trash2, ChevronRight } from "lucide-react";
import { getTasks, toggleTaskCompletion, deleteTask } from "../../lib/tasks";
import TaskForm from "./TaskForm";
import { t } from "../../lib/i18n";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState("all"); // all, completed, incomplete

  // Load tasks on mount
  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  }, []);

  // Handle adding new task
  const handleAddTask = () => {
    setTasks(getTasks());
    setShowAddForm(false);
  };

  // Handle editing task
  const handleEditTask = (task) => {
    setEditTask(task);
    setShowAddForm(true);
  };

  // Handle deleting task
  const handleDeleteTask = (id) => {
    if (window.confirm(t("tasks.confirmDelete"))) {
      const updatedTasks = deleteTask(id);
      setTasks(updatedTasks);
    }
  };

  // Handle toggling task completion
  const handleToggleCompletion = (id) => {
    const updatedTasks = toggleTaskCompletion(id);
    setTasks(updatedTasks);
  };

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true; // "all" filter
  });

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-emerald-700 text-white p-4">
        <h2 className="text-xl font-semibold">{t("tasks.title")}</h2>
        <p className="text-sm text-emerald-100 mt-1">{t("tasks.subtitle")}</p>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 py-2 text-sm font-medium ${filter === "all" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-500"}`}
        >
          {t("tasks.all")}
        </button>
        <button
          onClick={() => setFilter("incomplete")}
          className={`flex-1 py-2 text-sm font-medium ${filter === "incomplete" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-500"}`}
        >
          {t("tasks.active")}
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`flex-1 py-2 text-sm font-medium ${filter === "completed" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-500"}`}
        >
          {t("tasks.completed")}
        </button>
      </div>

      {/* Task list */}
      <div className="divide-y divide-slate-100">
        {filteredTasks.length === 0 ? (
          <div className="p-4 text-center text-slate-500">
            {t("tasks.empty")}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start p-4 hover:bg-slate-50"
            >
              <button
                onClick={() => handleToggleCompletion(task.id)}
                className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center ${task.completed ? "bg-emerald-500 border-emerald-500" : "border-slate-300"}`}
              >
                {task.completed && <Check className="h-4 w-4 text-white" />}
              </button>

              <div className="ml-3 flex-1">
                <h3
                  className={`font-medium ${task.completed ? "text-slate-400 line-through" : "text-slate-800"}`}
                >
                  {task.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {task.description}
                </p>
                <div className="text-xs text-slate-400 mt-1">
                  <span className="inline-block px-2 py-0.5 bg-slate-100 rounded-full mr-2">
                    {task.category}
                  </span>
                  {task.completed && task.completedAt && (
                    <span>
                      {t("tasks.completedOn")}:{" "}
                      {new Date(task.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center ml-2">
                <button
                  onClick={() => handleEditTask(task)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 text-slate-400 hover:text-red-500 ml-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action button */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => {
            setEditTask(null);
            setShowAddForm(true);
          }}
          className="w-full py-3 flex items-center justify-center text-emerald-600 font-medium rounded-md border border-emerald-200 hover:bg-emerald-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("tasks.addNew")}
        </button>
      </div>

      {/* Add/Edit task form */}
      {showAddForm && (
        <TaskForm
          onClose={() => {
            setShowAddForm(false);
            setEditTask(null);
          }}
          onSave={handleAddTask}
          editTask={editTask}
        />
      )}
    </div>
  );
};

export default TaskList;
