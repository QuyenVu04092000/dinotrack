"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  ChartOptions,
  ChartEvent,
  ActiveElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { formatVietnameseCurrency } from "app/utilities/common/functions";
import type { MomoBarChartData, MomoBarChartProps } from "app/types/MomoBarChart";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function MomoBarChart({
  data,
  height = 200,
  onBarClick,
  suggestedValue,
  activeIndex,
  param,
}: MomoBarChartProps) {
  const chartRef = useRef<ChartJS<"bar">>(null);
  const [chartArea, setChartArea] = useState<{
    top: number;
    bottom: number;
    left: number;
    right: number;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Get chart area from Chart.js instance after render
  useEffect(() => {
    const updateChartArea = () => {
      const chart = chartRef.current;
      if (chart && chart.chartArea) {
        setChartArea({
          top: chart.chartArea.top,
          bottom: chart.chartArea.bottom,
          left: chart.chartArea.left,
          right: chart.chartArea.right,
        });
      }
    };

    // Update on mount and when data changes
    const timer = setTimeout(updateChartArea, 100);
    window.addEventListener("resize", updateChartArea);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateChartArea);
    };
  }, [data, height]);

  // Calculate dynamic max value for Y-axis (add 10% padding so tallest bar doesn't touch top)
  const maxValue = useMemo(() => {
    if (data.length === 0) return 100000;
    const maxAmount = Math.max(...data.map((d) => Math.abs(d.value)));
    if (maxAmount <= 0) return 100000;
    return Math.ceil(maxAmount * 1.1);
  }, [data]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return {
      labels: data.map((d) => d.label),
      datasets: [
        {
          data: data.map((d) => Math.abs(d.value)),
          // If activeIndex is provided, highlight only the selected bar with #0797FF
          // and dim the others with #BAE8FD. If activeIndex is null, all bars use #0797FF.
          backgroundColor: data.map((d, index) => {
            if (typeof activeIndex === "number") {
              return index === activeIndex ? "#0797FF" : "#BAE8FD";
            }
            // When no bar is selected, all bars use the selected color
            return "#0797FF";
          }),
          borderColor: data.map((d, index) => {
            if (typeof activeIndex === "number") {
              return index === activeIndex ? "#0797FF" : "#BAE8FD";
            }
            // When no bar is selected, all bars use the selected color
            return "#0797FF";
          }),
          borderWidth: 0,
          borderRadius: {
            topLeft: 99,
            topRight: 99,
            bottomLeft: 0,
            bottomRight: 0,
          },
          barThickness: "flex" as const,
          maxBarThickness: 64, // Increased bar thickness
          categoryPercentage: 0.9, // Control space between categories
          barPercentage: 0.8, // Control space between bars in same category
          minBarLength: 2, // Minimum height for bars with value = 0 or very small
        },
      ],
    };
  }, [data, activeIndex]);

  // Chart options
  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 40, // Space for tooltip
          bottom: 10,
          left: 0, // Space for Y-axis labels
          right: 0,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => {
              const dataIndex = context.dataIndex;
              const dataPoint = data[dataIndex];
              if (!dataPoint) return "";
              return formatVietnameseCurrency(Math.abs(dataPoint.value));
            },
            title: () => "",
            labelColor: () => ({
              borderColor: "transparent",
              backgroundColor: "transparent",
            }),
          },
          backgroundColor: "rgba(255, 255, 255, 1)",
          titleColor: "rgba(0, 0, 0, 0)",
          bodyColor: "rgba(31, 37, 50, 1)",
          bodyFont: {
            size: 14,
            weight: "bold",
            family: "Inter, sans-serif",
          },
          padding: 12,
          displayColors: false,
          borderColor: "rgba(0, 0, 0, 0.1)",
          borderWidth: 1,
          boxPadding: 0,
          cornerRadius: 8,
          caretSize: 0, // No arrow
          caretPadding: 0,
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: "#597397",
            font: {
              size: 10, // Smaller font size
              family: "Inter, sans-serif",
              weight: "normal",
            },
            padding: 8,
            maxRotation: 0, // Keep labels horizontal
            minRotation: 0, // Keep labels horizontal
            autoSkip: false, // Show all labels
          },
        },
        y: {
          display: true,
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          beginAtZero: true,
          max: maxValue,
          ticks: {
            color: "#597397",
            font: {
              size: 11,
              family: "Inter, sans-serif",
              weight: "bold",
            },
            padding: 4,
            callback: function (value) {
              const numValue = typeof value === "number" ? value : 0;
              if (numValue >= 1000) {
                return `${Math.round(numValue / 1000)}K`;
              }
              return numValue.toString();
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index" as const,
      },
      onHover: (event: ChartEvent, elements: ActiveElement[]) => {
        const chart = chartRef.current;
        if (!chart) return;

        // Change cursor on hover
        const target = event.native?.target as HTMLElement;
        if (target) {
          target.style.cursor = elements.length > 0 ? "pointer" : "default";
        }
      },
      onClick: (event: ChartEvent, elements: ActiveElement[]) => {
        if (elements.length > 0 && onBarClick) {
          const element = elements[0];
          const index = element.index;
          const label = data[index]?.label;
          if (label !== undefined) {
            onBarClick(label, index);
          }
        }
      },
      animation: {
        onComplete: () => {
          const chart = chartRef.current;
          if (chart && chart.chartArea) {
            setChartArea({
              top: chart.chartArea.top,
              bottom: chart.chartArea.bottom,
              left: chart.chartArea.left,
              right: chart.chartArea.right,
            });
          }
        },
      },
    }),
    [data, maxValue, onBarClick],
  );

  // Calculate chart width: show max 7 bars visible, allow scroll for more
  const barWidth = 72; // Width per bar including spacing
  const visibleBars = 7;
  const viewportWidth = visibleBars * barWidth; // Width for 7 bars
  const chartWidth = data.length * barWidth; // Total width needed for all bars

  // Auto-scroll to keep the active bar in view (approximately centered)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    if (typeof activeIndex !== "number" || activeIndex < 0 || activeIndex >= data.length) {
      return;
    }

    const viewWidth = container.clientWidth || viewportWidth;

    // Target the center of the active bar
    const targetCenter = activeIndex * barWidth + barWidth / 2;
    let newScrollLeft = targetCenter - viewWidth / 2;

    const maxScroll = Math.max(0, chartWidth - viewWidth);
    if (newScrollLeft < 0) newScrollLeft = 0;
    if (newScrollLeft > maxScroll) newScrollLeft = maxScroll;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  }, [activeIndex, data, chartWidth, viewportWidth, barWidth]);

  // Calculate Y position for suggested value line
  const suggestedLineY = useMemo(() => {
    if (!suggestedValue || suggestedValue <= 0 || maxValue <= 0 || !chartArea) {
      return null;
    }

    // Use actual chart area from Chart.js
    const chartAreaTop = chartArea.top;
    const chartAreaBottom = chartArea.bottom;
    const chartAreaHeight = chartAreaBottom - chartAreaTop;

    // Calculate Y position (from top of container)
    // suggestedValue / maxValue gives us the ratio
    // We need to invert it because Y=0 is at top, and maxValue is at bottom
    const ratio = suggestedValue / maxValue;
    const yPosition = chartAreaBottom - chartAreaHeight * ratio;

    // Validate yPosition is within bounds
    if (yPosition < chartAreaTop || yPosition > chartAreaBottom) {
      return null;
    }

    return yPosition;
  }, [suggestedValue, maxValue, chartArea]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-[#597397]" style={{ height: `${height}px` }}>
        Chưa có dữ liệu
      </div>
    );
  }

  // Compute position and value for the active bar label
  let activeBarLabel: {
    x: number;
    y: number;
    value: number;
  } | null = null;

  if (typeof activeIndex === "number" && activeIndex >= 0 && activeIndex < data.length && chartRef.current) {
    const chart = chartRef.current;
    const meta = chart.getDatasetMeta(0);
    const barElement: any = meta.data[activeIndex];
    if (barElement && typeof barElement.x === "number" && typeof barElement.y === "number") {
      activeBarLabel = {
        x: barElement.x,
        y: barElement.y,
        value: data[activeIndex].value,
      };
    }
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <div
        ref={scrollRef}
        className="overflow-x-auto overflow-y-visible"
        style={{
          height: `${height}px`,
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${chartWidth}px`, // Total width for all bars
            height: `${height}px`,
            position: "relative",
          }}
        >
          <Bar ref={chartRef} data={chartData} options={options} />
          {/* Suggested value dashed line */}
          {suggestedLineY !== null && suggestedValue && chartArea && param.get("subCategoryId") && (
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              <line
                x1={chartArea.left}
                y1={suggestedLineY}
                x2={chartArea.right}
                y2={suggestedLineY}
                stroke="#0EA5E9"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
            </svg>
          )}
          {/* Active bar value label above selected bar */}
          {activeBarLabel && (
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 11,
              }}
            >
              <text
                x={activeBarLabel.x}
                y={activeBarLabel.y - 8}
                textAnchor="middle"
                fill="#1F2532"
                fontSize="11"
                fontWeight="600"
              >
                {formatVietnameseCurrency(Math.abs(activeBarLabel.value)).replace("₫", "đ")}
              </text>
            </svg>
          )}
        </div>
      </div>
      {/* Label above the line - fixed at right side of viewport */}
      {suggestedLineY !== null && suggestedValue && param.get("subCategoryId") && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: "10px",
            pointerEvents: "none",
            zIndex: 11,
            width: "fit-content",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            padding: "4px 8px",
          }}
        >
          <span
            style={{
              color: "#0EA5E9",
              fontSize: "12px",
              fontWeight: "500",
              whiteSpace: "nowrap",
            }}
          >
            Đề xuất: {formatVietnameseCurrency(suggestedValue).replace("₫", "đ")}
          </span>
        </div>
      )}
    </div>
  );
}
