"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { useDonutChart } from "app/hooks/useDonutChart";
import type { DonutChartData } from "app/types/DonutChart";

interface DonutChartProps {
  data: DonutChartData[];
  innerRadiusRatio?: number;
  labelDistance?: number;
  minLabelPercentage?: number;
  centerText?: string;
  activeIndex?: number | null;
  onSliceHover?: (data: DonutChartData | null) => void;
  onSliceClick?: (data: DonutChartData | null, index: number | null) => void;
}

export function DonutChart({
  data,
  innerRadiusRatio = 0.55,
  labelDistance = 38,
  minLabelPercentage = 5,
  centerText: initialCenterText,
  activeIndex: externalActiveIndex,
  onSliceHover,
  onSliceClick,
}: DonutChartProps) {
  const { chartRef, containerRef, chartData, options, labelPositions, hoveredIndex, activeIndex, centerText, centerSubText, normalizedData } =
    useDonutChart({
      data,
      innerRadiusRatio,
      labelDistance,
      minLabelPercentage,
      initialCenterText,
      activeIndex: externalActiveIndex,
      onSliceHover,
      onSliceClick,
    });

  const highlightIndex = activeIndex !== null ? activeIndex : hoveredIndex;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ overflow: "visible" }}
    >
      {/* Chart */}
      <div className="relative w-full" style={{ overflow: "visible" }}>
        <Doughnut
          ref={chartRef}
          data={chartData}
          options={options}
          style={{ cursor: "pointer" }}
        />

        {/* Center text */}
        <div
          className="absolute flex flex-col items-center justify-center pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            maxWidth: `${innerRadiusRatio * 80}%`,
          }}
        >
          {centerSubText ? (
            <>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#597397",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.3,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                {centerText}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#1F2532",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.4,
                  whiteSpace: "nowrap",
                }}
              >
                {centerSubText}
              </span>
            </>
          ) : (
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1F2532",
                fontFamily: "Inter, sans-serif",
                lineHeight: 1.4,
                textAlign: "center",
                wordBreak: "break-word",
              }}
            >
              {centerText}
            </span>
          )}
        </div>

        {/* Active ring highlight */}
        {highlightIndex !== null && chartRef.current?.chartArea && (() => {
          const meta = chartRef.current?.getDatasetMeta(0);
          const arc = meta?.data[highlightIndex] as any;
          if (!arc) return null;
          const r = (arc.outerRadius || 0) * 2;
          return (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${(chartRef.current.chartArea.left + chartRef.current.chartArea.right) / 2}px`,
                top: `${(chartRef.current.chartArea.top + chartRef.current.chartArea.bottom) / 2}px`,
                transform: "translate(-50%, -50%)",
                width: `${r}px`,
                height: `${r}px`,
                borderRadius: "50%",
                border: `2.5px solid ${normalizedData[highlightIndex]?.color}`,
                opacity: 0.35,
                transition: "opacity 0.2s",
              }}
            />
          );
        })()}
      </div>

      {/* Connector lines */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        {labelPositions.map((label) => {
          const idx = normalizedData.findIndex((d) => d.id === label.id);
          const isActive = highlightIndex === idx;
          const isDimmed = highlightIndex !== null && !isActive;

          return (
            <polyline
              key={label.id}
              points={label.polylinePoints}
              fill="none"
              stroke={isActive ? label.color : "#7C94B4"}
              strokeWidth={isActive ? 2.5 : 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={isDimmed ? 0.25 : isActive ? 1 : 0.55}
              style={{ transition: "opacity 0.2s, stroke 0.2s" }}
            />
          );
        })}
      </svg>

      {/* External labels */}
      {labelPositions.map((label) => {
        const idx = normalizedData.findIndex((d) => d.id === label.id);
        const isActive = highlightIndex === idx;
        const isDimmed = highlightIndex !== null && !isActive;
        const isRightSide = label.side === "right";

        return (
          <div
            key={label.id}
            className="absolute flex items-center gap-1 pointer-events-none whitespace-nowrap"
            style={{
              left: `${label.x}px`,
              top: `${label.y}px`,
              transform: isRightSide ? "translate(0, -50%)" : "translate(-100%, -50%)",
              opacity: 1,
            }}
          >
            <span style={{ fontSize: "14px", lineHeight: 1 }}>
              {label.icon || "📂"}
            </span>
            <span
              style={{
                fontSize: isActive ? "13px" : "12px",
                fontFamily: "Inter, sans-serif",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? label.color : "#3B4D69",
                lineHeight: 1.4,
                transition: "all 0.2s ease",
              }}
            >
              {label.percentage.toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
// test-2

