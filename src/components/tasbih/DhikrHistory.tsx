import React, { useRef, useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Trash2,
  Download,
  Save,
  BarChart,
  PieChart,
  FileText,
  Filter,
  Search,
} from "lucide-react";
import {
  getDhikrHistory,
  clearDhikrHistory,
  exportDhikrHistory,
  importDhikrHistory,
} from "../../lib/storage";

interface DhikrHistoryProps {
  history?: {
    id: string | number;
    dhikrId?: number;
    dhikrName: string;
    count: number;
    targetCount: number;
    date: string;
    time: string;
  }[];
  onClose: () => void;
  onClearHistory?: () => void;
  onExportHistory?: () => Promise<void>;
  onImportHistory?: (data: any) => Promise<void>;
}

const DhikrHistory: React.FC<DhikrHistoryProps> = ({
  history: propHistory,
  onClose,
  onClearHistory,
  onExportHistory,
  onImportHistory,
}) => {
  const [history, setHistory] = useState<DhikrHistoryProps["history"]>(
    propHistory || [],
  );
  const [chartType, setChartType] = useState<"bar" | "pie" | "none">("none");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "count">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from storage if not provided as prop
  useEffect(() => {
    if (!propHistory) {
      setHistory(getDhikrHistory());
    }
  }, [propHistory]);

  // Refresh history every 5 seconds to catch any updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!propHistory) {
        const freshHistory = getDhikrHistory();
        if (freshHistory.length !== history?.length) {
          setHistory(freshHistory);
        }
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [propHistory, history]);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      if (onClearHistory) {
        onClearHistory();
      } else {
        clearDhikrHistory();
        setHistory([]);
        // Force reload to ensure UI is updated
        setTimeout(() => {
          setHistory(getDhikrHistory());
        }, 500);
      }
    }
  };

  const handleExportHistory = async () => {
    setIsExporting(true);
    try {
      if (onExportHistory) {
        await onExportHistory();
      } else {
        await exportDhikrHistory();
      }
    } catch (error) {
      console.error("Error exporting history:", error);
      alert("Failed to export history");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportHistory = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonContent = event.target?.result as string;
          if (onImportHistory) {
            const data = JSON.parse(jsonContent);
            await onImportHistory(data);
          } else {
            importDhikrHistory(jsonContent);
            setHistory(getDhikrHistory());
          }
        } catch (error) {
          console.error("Error parsing import file:", error);
          alert("Invalid import file format");
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error reading import file:", error);
      setIsImporting(false);
    }
    // Reset the input
    e.target.value = "";
  };

  const toggleSortOrder = (field: "date" | "name" | "count") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSortedHistory = React.useMemo(() => {
    if (!history) return [];

    // Filter by search term
    let result = searchTerm
      ? history.filter((item) =>
          item.dhikrName.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : [...history];

    // Sort by selected field
    result.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(`${a.date} ${a.time}`).getTime();
        const dateB = new Date(`${b.date} ${b.time}`).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.dhikrName.localeCompare(b.dhikrName)
          : b.dhikrName.localeCompare(a.dhikrName);
      } else {
        return sortOrder === "asc" ? a.count - b.count : b.count - a.count;
      }
    });

    return result;
  }, [history, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    if (chartContainerRef.current) {
      renderChart();
    }
  }, [chartType, filteredAndSortedHistory]);

  const renderChart = () => {
    if (
      !chartContainerRef.current ||
      !filteredAndSortedHistory ||
      filteredAndSortedHistory.length === 0
    )
      return;

    // Clear previous chart
    chartContainerRef.current.innerHTML = "";

    if (chartType === "bar") {
      // Render bar chart
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "200");
      svg.setAttribute("viewBox", "0 0 400 200");

      const maxCount = Math.max(
        ...filteredAndSortedHistory.map((item) => item.count),
      );
      const barWidth = 400 / filteredAndSortedHistory.length - 10;

      filteredAndSortedHistory.forEach((item, index) => {
        const barHeight = (item.count / maxCount) * 150;
        const x = index * (barWidth + 10) + 5;
        const y = 180 - barHeight;

        const bar = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        bar.setAttribute("x", x.toString());
        bar.setAttribute("y", y.toString());
        bar.setAttribute("width", barWidth.toString());
        bar.setAttribute("height", barHeight.toString());
        bar.setAttribute("fill", "#10b981");
        bar.setAttribute("rx", "2");

        const label = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text",
        );
        label.setAttribute("x", (x + barWidth / 2).toString());
        label.setAttribute("y", "195");
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("font-size", "10");
        label.setAttribute("fill", "#64748b");
        label.textContent = item.dhikrName.substring(0, 10);

        const value = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text",
        );
        value.setAttribute("x", (x + barWidth / 2).toString());
        value.setAttribute("y", (y - 5).toString());
        value.setAttribute("text-anchor", "middle");
        value.setAttribute("font-size", "10");
        value.setAttribute("fill", "#64748b");
        value.textContent = item.count.toString();

        svg.appendChild(bar);
        svg.appendChild(label);
        svg.appendChild(value);
      });

      chartContainerRef.current.appendChild(svg);
    } else if (chartType === "pie") {
      // Render pie chart
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "200");
      svg.setAttribute("height", "200");
      svg.setAttribute("viewBox", "0 0 200 200");

      const total = filteredAndSortedHistory.reduce(
        (sum, item) => sum + item.count,
        0,
      );
      const centerX = 100;
      const centerY = 100;
      const radius = 80;
      let startAngle = 0;

      const colors = [
        "#10b981",
        "#3b82f6",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#ec4899",
        "#06b6d4",
        "#84cc16",
      ];

      filteredAndSortedHistory.forEach((item, index) => {
        const percentage = item.count / total;
        const endAngle = startAngle + percentage * 2 * Math.PI;

        // Calculate the coordinates for the arc
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        // Create the arc path
        const largeArcFlag = percentage > 0.5 ? 1 : 0;
        const pathData = [
          `M ${centerX},${centerY}`,
          `L ${x1},${y1}`,
          `A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`,
          "Z",
        ].join(" ");

        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute("d", pathData);
        path.setAttribute("fill", colors[index % colors.length]);

        svg.appendChild(path);

        // Add legend
        const legendY = 160 + index * 15;
        const legendRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        legendRect.setAttribute("x", "10");
        legendRect.setAttribute("y", legendY.toString());
        legendRect.setAttribute("width", "10");
        legendRect.setAttribute("height", "10");
        legendRect.setAttribute("fill", colors[index % colors.length]);

        const legendText = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text",
        );
        legendText.setAttribute("x", "25");
        legendText.setAttribute("y", (legendY + 8).toString());
        legendText.setAttribute("font-size", "8");
        legendText.setAttribute("fill", "#64748b");
        legendText.textContent = `${item.dhikrName}: ${item.count} (${Math.round(percentage * 100)}%)`;

        svg.appendChild(legendRect);
        svg.appendChild(legendText);

        startAngle = endAngle;
      });

      chartContainerRef.current.appendChild(svg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-emerald-700 text-white">
          <h2 className="text-lg font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Dhikr History
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search and filter */}
        <div className="p-3 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search dhikr..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-white border border-slate-300 rounded-md overflow-hidden">
                <button
                  onClick={() => toggleSortOrder("date")}
                  className={`px-3 py-2 text-xs font-medium ${sortBy === "date" ? "bg-emerald-100 text-emerald-700" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSortOrder("name")}
                  className={`px-3 py-2 text-xs font-medium ${sortBy === "name" ? "bg-emerald-100 text-emerald-700" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSortOrder("count")}
                  className={`px-3 py-2 text-xs font-medium ${sortBy === "count" ? "bg-emerald-100 text-emerald-700" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  Count{" "}
                  {sortBy === "count" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart toggle buttons */}
        {filteredAndSortedHistory && filteredAndSortedHistory.length > 0 && (
          <div className="p-2 border-b border-slate-200 flex justify-center space-x-2">
            <button
              onClick={() => setChartType(chartType === "bar" ? "none" : "bar")}
              className={`px-3 py-1.5 rounded-md flex items-center text-sm ${chartType === "bar" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              <BarChart className="h-3.5 w-3.5 mr-1" />
              Bar Chart
            </button>
            <button
              onClick={() => setChartType(chartType === "pie" ? "none" : "pie")}
              className={`px-3 py-1.5 rounded-md flex items-center text-sm ${chartType === "pie" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              <PieChart className="h-3.5 w-3.5 mr-1" />
              Pie Chart
            </button>
          </div>
        )}

        {/* Chart container */}
        {chartType !== "none" &&
          filteredAndSortedHistory &&
          filteredAndSortedHistory.length > 0 && (
            <div
              ref={chartContainerRef}
              className="p-4 border-b border-slate-200 flex justify-center items-center overflow-x-auto"
            >
              {/* Chart will be rendered here */}
            </div>
          )}

        {/* History table */}
        <div className="flex-1 overflow-y-auto">
          {!filteredAndSortedHistory ||
          filteredAndSortedHistory.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p>
                {searchTerm
                  ? "No results found."
                  : "No history yet. Complete some dhikr to see your history here."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Dhikr Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Completion
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredAndSortedHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium"
                            style={{ backgroundColor: "#10b981" }}
                          >
                            {item.dhikrName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-slate-900">
                              {item.dhikrName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {item.count}/
                          {item.targetCount === Infinity
                            ? "∞"
                            : item.targetCount}
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full"
                            style={{
                              width: `${item.targetCount === Infinity ? 100 : Math.min(100, (item.count / item.targetCount) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-500 flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                          {item.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-500 flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                          {item.time}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="p-4 border-t border-slate-200 flex justify-between bg-slate-50">
          <button
            onClick={handleClearHistory}
            className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center text-sm transition-colors"
            disabled={
              !filteredAndSortedHistory || filteredAndSortedHistory.length === 0
            }
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear All
          </button>

          <div className="flex space-x-2">
            <button
              onClick={handleExportHistory}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 flex items-center text-sm transition-colors"
              disabled={
                isExporting ||
                !filteredAndSortedHistory ||
                filteredAndSortedHistory.length === 0
              }
            >
              {isExporting ? (
                <span className="h-3.5 w-3.5 mr-1 rounded-full border-2 border-slate-500 border-t-transparent animate-spin"></span>
              ) : (
                <Download className="h-3.5 w-3.5 mr-1" />
              )}
              Export
            </button>

            <button
              onClick={handleImportClick}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center text-sm transition-colors"
              disabled={isImporting}
            >
              {isImporting ? (
                <span className="h-3.5 w-3.5 mr-1 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              ) : (
                <Save className="h-3.5 w-3.5 mr-1" />
              )}
              Import
            </button>

            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportHistory}
              ref={fileInputRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DhikrHistory;
