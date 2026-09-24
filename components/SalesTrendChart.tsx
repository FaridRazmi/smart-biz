"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export type DailySale = { day: string; date: string; total: number };

export default function SalesTrendChart({ data }: { data: DailySale[] }) {
  return (
    <Bar
      data={{
        labels: data.map((item) => `${item.day} (${item.date})`),
        datasets: [
          {
            label: "Revenue (RM)",
            data: data.map((item) => item.total),
            backgroundColor: "#0f172a",
            hoverBackgroundColor: "#334155",
            borderRadius: 6,
            maxBarThickness: 36,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0f172a",
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (ctx) => `RM ${Number(ctx.raw).toLocaleString()}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11, family: "'Inter', sans-serif" }, color: "#64748b" },
          },
          y: {
            beginAtZero: true,
            grid: { color: "#f1f5f9" },
            ticks: {
              font: { size: 11, family: "'Inter', sans-serif" },
              color: "#64748b",
              callback: (value) => `RM ${Number(value).toLocaleString()}`,
            },
          },
        },
      }}
    />
  );
}
