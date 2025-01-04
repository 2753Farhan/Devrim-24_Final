import React, { useState } from "react";
import ChartLibrary from "../components/ChartLibrary";
import { BarChart3, LineChart, PieChart } from "lucide-react";

export default function ChartDemo() {
  const [activeTab, setActiveTab] = useState("all");

  const sampleData = {
    labels: ["8 am", "F8:15 am", "8:17 am", "8:19 am", "9:20 am", "9:25 am"],
    datasets: [
      {
        label: "Total uploads",
        data: [3, 2, 5, 8, 3, 4],
        backgroundColor: [
          "rgba(99, 102, 241, 0.2)",   // Indigo
          "rgba(168, 85, 247, 0.2)",   // Purple
          "rgba(236, 72, 153, 0.2)",   // Pink
          "rgba(239, 68, 68, 0.2)",    // Red
          "rgba(245, 158, 11, 0.2)",   // Amber
          "rgba(16, 185, 129, 0.2)",   // Emerald
        ],
        borderColor: [
          "rgb(99, 102, 241)",
          "rgb(168, 85, 247)",
          "rgb(236, 72, 153)",
          "rgb(239, 68, 68)",
          "rgb(245, 158, 11)",
          "rgb(16, 185, 129)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
      },
    },
  };

  const chartTypes = [
    { id: "all", label: "All Charts" },
    { id: "bar", label: "Bar Chart", icon: BarChart3 },
    { id: "line", label: "Line Chart", icon: LineChart },
    { id: "pie", label: "Pie Chart", icon: PieChart },
  ];

  const renderChart = (type) => (
    <div className="shadow-lg rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        {type === "bar" && <BarChart3 className="h-5 w-5 text-indigo-500" />}
        {type === "line" && <LineChart className="h-5 w-5 text-purple-500" />}
        {type === "pie" && <PieChart className="h-5 w-5 text-pink-500" />}
        {type.charAt(0).toUpperCase() + type.slice(1)} Chart
      </h2>
      <div className="h-72">
        <ChartLibrary 
          chartType={type} 
          chartData={sampleData} 
          chartOptions={type === "pie" ? { ...chartOptions, plugins: { ...chartOptions.plugins, legend: { position: 'right' } } } : chartOptions} 
        />
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Analytics</h1>
        
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          {chartTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                activeTab === type.id
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTab === "all" ? (
            <>
              {renderChart("bar")}
              {renderChart("line")}
              {renderChart("pie")}
            </>
          ) : (
            renderChart(activeTab)
          )}
        </div>
      </div>
    </div>
  );
}