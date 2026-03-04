"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { useDonutChart } from "app/hooks/useDonutChart";
import type { DonutChartData } from "app/types/DonutChart";

interface DonutChartProps {
  data: DonutChartData[];
  width?: number;
  height?: number;
  innerRadiusRatio?: number;
  labelDistance?: number;
  minLabelPercentage?: number;
  centerText?: string;
  onSliceHover?: (data: DonutChartData | null) => void;
}

export function DonutChart({
  data,
  width = 166,
  height = 277,
  innerRadiusRatio = 0.55,
  labelDistance = 40,
  minLabelPercentage = 5,
  centerText: initialCenterText,
  onSliceHover,
}: DonutChartProps) {
  const { chartRef, containerRef, chartData, options, labelPositions, hoveredIndex, centerText, normalizedData } =
    useDonutChart({
      data,
      innerRadiusRatio,
      labelDistance,
      minLabelPercentage,
      initialCenterText,
      onSliceHover,
    });

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
    >
      {/* Chart.js Doughnut Chart */}
      <div
        className="relative"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <Doughnut
          ref={chartRef}
          data={chartData}
          options={options}
          style={{
            filter: hoveredIndex !== null ? "brightness(0.9)" : "none",
          }}
        />

        {/* Center text */}
        {centerText && (
          <div
            className="absolute flex flex-col items-center justify-center pointer-events-none"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#1F2532",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {centerText}
            </span>
          </div>
        )}

        {/* Highlight overlay for hovered slice */}
        {hoveredIndex !== null && chartRef.current?.chartArea && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${(chartRef.current.chartArea.left + chartRef.current.chartArea.right) / 2}px`,
              top: `${(chartRef.current.chartArea.top + chartRef.current.chartArea.bottom) / 2}px`,
              transform: "translate(-50%, -50%)",
              width: `${(chartRef.current.getDatasetMeta(0)?.data[0] as any)?.outerRadius * 2 || 0}px`,
              height: `${(chartRef.current.getDatasetMeta(0)?.data[0] as any)?.outerRadius * 2 || 0}px`,
              borderRadius: "50%",
              border: `3px solid ${normalizedData[hoveredIndex].color}`,
              opacity: 0.3,
            }}
          />
        )}
      </div>

      {/* Connector lines and labels */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        {labelPositions.map((label) => {
          const isHovered =
            hoveredIndex !== null && normalizedData.findIndex((d) => d.id === label.id) === hoveredIndex;

          return (
            <g key={label.id}>
              {/* Bent connector line (3 points: edge → radial → horizontal) */}
              <polyline
                points={label.polylinePoints}
                fill="none"
                stroke={isHovered ? label.color : "#7C94B4"}
                strokeWidth={isHovered ? 3 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={isHovered ? 1 : 0.6}
              />
            </g>
          );
        })}
      </svg>

      {/* External labels */}
      {labelPositions.map((label) => {
        const isHovered = hoveredIndex !== null && normalizedData.findIndex((d) => d.id === label.id) === hoveredIndex;

        // RIGHT side: icon-text, left edge anchored at label.x (extending right)
        // LEFT side: icon-text, right edge anchored at label.x (extending left)
        const isRightSide = label.side === "right";

        return (
          <div
            key={label.id}
            className="absolute flex items-center gap-1 pointer-events-none whitespace-nowrap"
            style={{
              left: `${label.x}px`,
              top: `${label.y}px`,
              transform: isRightSide ? "translate(0, -50%)" : "translate(-100%, -50%)",
              opacity: isHovered ? 1 : 0.8,
              transition: "opacity 0.2s ease",
            }}
          >
            {label.icon && (
              <span
                style={{
                  fontSize: "16px",
                  lineHeight: 1,
                  filter: isHovered ? "brightness(1.2)" : "none",
                }}
              >
                {label.icon}
              </span>
            )}
            <span
              style={{
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                color: isHovered ? label.color : "#3B4D69",
                lineHeight: 1.5,
                transition: "color 0.2s ease",
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
