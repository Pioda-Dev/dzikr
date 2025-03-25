import { useState, useEffect } from "react";
import {
  getTasks,
  getCompletedTasks,
  getIncompleteTasks,
} from "../../lib/tasks";
import { t } from "../../lib/i18n";

const TaskStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    incomplete: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const allTasks = getTasks();
    const completedTasks = getCompletedTasks();
    const incompleteTasks = getIncompleteTasks();

    const completionRate =
      allTasks.length > 0
        ? Math.round((completedTasks.length / allTasks.length) * 100)
        : 0;

    setStats({
      total: allTasks.length,
      completed: completedTasks.length,
      incomplete: incompleteTasks.length,
      completionRate,
    });
  }, []);

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-emerald-700 text-white p-4">
        <h2 className="text-xl font-semibold">{t("tasks.stats")}</h2>
      </div>

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg flex-1 mr-2">
            <div className="text-2xl font-bold text-slate-700">
              {stats.total}
            </div>
            <div className="text-xs text-slate-500">
              {t("tasks.totalTasks")}
            </div>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-lg flex-1 mx-2">
            <div className="text-2xl font-bold text-emerald-700">
              {stats.completed}
            </div>
            <div className="text-xs text-emerald-600">
              {t("tasks.completedTasks")}
            </div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg flex-1 ml-2">
            <div className="text-2xl font-bold text-amber-600">
              {stats.incomplete}
            </div>
            <div className="text-xs text-amber-500">
              {t("tasks.incompleteTasks")}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-slate-700">
              {t("tasks.completionRate")}
            </span>
            <span className="text-sm font-medium text-slate-700">
              {stats.completionRate}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-emerald-600 h-2.5 rounded-full"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
