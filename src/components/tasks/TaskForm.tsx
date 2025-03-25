import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { saveTask, Task } from "../../lib/tasks";
import { t } from "../../lib/i18n";

interface TaskFormProps {
  onClose: () => void;
  onSave: () => void;
  editTask?: Task | null;
}

const TaskForm = ({ onClose, onSave, editTask }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("dhikr");

  // Load task data if editing
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setCategory(editTask.category);
    }
  }, [editTask]);

  const handleSave = () => {
    if (!title) {
      alert(t("tasks.titleRequired"));
      return;
    }

    const task: Task = {
      id: editTask?.id || 0, // Will be assigned in storage if new
      title,
      description,
      category,
      completed: editTask?.completed || false,
      createdAt: editTask?.createdAt || new Date().toISOString(),
      completedAt: editTask?.completedAt || null,
    };

    saveTask(task);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            {editTask ? t("tasks.editTask") : t("tasks.addTask")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("tasks.title")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("tasks.titlePlaceholder")}
              className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("tasks.description")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("tasks.descriptionPlaceholder")}
              className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("tasks.category")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="dhikr">{t("tasks.categoryDhikr")}</option>
              <option value="quran">{t("tasks.categoryQuran")}</option>
              <option value="prayer">{t("tasks.categoryPrayer")}</option>
              <option value="other">{t("tasks.categoryOther")}</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              {t("common.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
