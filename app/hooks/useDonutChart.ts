"use client";

import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, ChartEvent, ActiveElement } from "chart.js";
import { DonutChartData, LabelPosition, UseDonutChartParams, UseDonutChartResult } from "app/types/DonutChart";
import { formatVietnameseCurrency } from "app/utilities/common/functions";

ChartJS.register(ArcElement, Tooltip, Legend);

export function useDonutChart({
  data,
  innerRadiusRatio,
  labelDistance,
  minLabelPercentage,
  initialCenterText,
  activeIndex: externalActiveIndex,
  onSliceHover,
  onSliceClick,
}: UseDonutChartParams): UseDonutChartResult {
  const chartRef = useRef<ChartJS<"doughnut">>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [labelPositions, setLabelPositions] = useState<LabelPosition[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [internalActiveIndex, setInternalActiveIndex] = useState<number | null>(null);
  const [centerText, setCenterText] = useState<string | undefined>(initialCenterText);
  const [centerSubText, setCenterSubText] = useState<string | undefined>(undefined);

  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex;

  const { total, normalizedData } = useMemo(() => {
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    const normalized = data.map((item) => ({
      ...item,
      percentage: sum > 0 ? (item.value / sum) * 100 : 0,
    }));
    return { total: sum, normalizedData: normalized };
  }, [data]);

  // Update center text based on active/hovered slice
  useEffect(() => {
    if (activeIndex !== null && normalizedData[activeIndex]) {
      const item = normalizedData[activeIndex];
      setCenterText(item.label);
      setCenterSubText(formatVietnameseCurrency(item.value));
    } else if (hoveredIndex !== null && normalizedData[hoveredIndex]) {
      const item = normalizedData[hoveredIndex];
      setCenterText(item.label);
      setCenterSubText(formatVietnameseCurrency(item.value));
    } else {
      setCenterText(initialCenterText ?? formatVietnameseCurrency(total));
      setCenterSubText(undefined);
    }
  }, [activeIndex, hoveredIndex, normalizedData, total, initialCenterText]);

  const chartData = useMemo(
    () => ({
      labels: normalizedData.map((item) => item.label),
      datasets: [
        {
          data: normalizedData.map((item) => item.percentage),
          backgroundColor: normalizedData.map((item, i) => {
            if (activeIndex !== null && i !== activeIndex) return item.color + "60";
            return item.color;
          }),
          borderColor: "#ffffff",
          borderWidth: 2,
          hoverOffset: 10,
          spacing: 2,
          cutout: `${innerRadiusRatio * 100}%`,
        },
      ],
    }),
    [normalizedData, innerRadiusRatio, activeIndex],
  );

  useEffect(() => {
    const calculatePositions = () => {
      const chart = chartRef.current;
      if (!chart || !chart.chartArea || !chart.canvas) return;

      try {
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data || meta.data.length === 0) return;

        const firstArc = meta.data[0] as any;
        if (!firstArc || typeof firstArc.outerRadius !== "number") return;
        if (typeof firstArc.x !== "number" || typeof firstArc.y !== "number") return;

        const canvas = chart.canvas;
        const container = containerRef.current;
        if (!container) return;

        const canvasRect = canvas.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const canvasOffsetX = canvasRect.left - containerRect.left;
        const canvasOffsetY = canvasRect.top - containerRect.top;

        const cx = firstArc.x + canvasOffsetX;
        const cy = firstArc.y + canvasOffsetY;
        const outerRadius = firstArc.outerRadius;

        const borderWidth = chartData.datasets[0].borderWidth || 2;
        const innerRadius = outerRadius * innerRadiusRatio;
        const visualOuterRadius = outerRadius - borderWidth / 2;
        const visualInnerRadius = innerRadius + borderWidth / 2;

        const allPositions: LabelPosition[] = [];

        meta.data.forEach((arc: any, index: number) => {
          const item = normalizedData[index];
          if (!item) return;

          const startAngle = arc.startAngle;
          const endAngle = arc.endAngle;
          const midAngle = (startAngle + endAngle) / 2;

          const isRightSide = Math.cos(midAngle) >= 0;
          const side: "left" | "right" = isRightSide ? "right" : "left";

          const point1X = cx + visualOuterRadius * Math.cos(midAngle);
          const point1Y = cy + visualOuterRadius * Math.sin(midAngle);

          const radialDistance = visualOuterRadius + labelDistance * 0.5;
          const point2X = cx + radialDistance * Math.cos(midAngle);
          const point2Y = cy + radialDistance * Math.sin(midAngle);

          const horizontalExtension = labelDistance * 0.8;
          const labelX = isRightSide ? point2X + horizontalExtension : point2X - horizontalExtension;
          const labelY = point2Y;

          const polylinePoints = `${point1X},${point1Y} ${point2X},${point2Y} ${labelX},${labelY}`;

          allPositions.push({
            id: item.id,
            x: labelX,
            y: labelY,
            icon: item.icon,
            label: item.label,
            value: item.value,
            percentage: item.percentage,
            color: item.color,
            side,
            polylinePoints,
            angle: (midAngle * 180) / Math.PI,
          });
        });

        // Sort by Y so labels are processed top-to-bottom for stable pushdown
        const filteredPositions = allPositions
          .filter((pos) => pos.percentage >= minLabelPercentage)
          .sort((a, b) => a.y - b.y);

        const adjustedPositions: LabelPosition[] = [];
        const labelRowHeight = 22;

        filteredPositions.forEach((pos) => {
          let adjustedPos = { ...pos };
          let attempts = 0;
          const maxAttempts = 30;

          while (attempts < maxAttempts) {
            let hasOverlap = false;

            for (const placed of adjustedPositions) {
              if (placed.side !== adjustedPos.side) continue;
              const dy = Math.abs(adjustedPos.y - placed.y);

              if (dy < labelRowHeight) {
                hasOverlap = true;
                const push = labelRowHeight - dy + 2;
                adjustedPos.y += adjustedPos.y <= placed.y ? -push : push;
                const parts = adjustedPos.polylinePoints.split(" ");
                adjustedPos.polylinePoints = `${parts[0]} ${parts[1]} ${adjustedPos.x},${adjustedPos.y}`;
                break;
              }
            }

            if (!hasOverlap) break;
            attempts++;
          }

          adjustedPositions.push(adjustedPos);
        });

        setLabelPositions(adjustedPositions);
      } catch (error) {
        console.error("Error calculating label positions:", error);
      }
    };

    // Wait for animation (500ms) to finish before calculating label positions
    const timeout = setTimeout(calculatePositions, 600);
    window.addEventListener("resize", calculatePositions);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", calculatePositions);
    };
  }, [chartData, normalizedData, labelDistance, minLabelPercentage, innerRadiusRatio]);

  const handleChartHover = useCallback(
    (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setHoveredIndex(index);
        onSliceHover?.(normalizedData[index]);
      } else {
        setHoveredIndex(null);
        onSliceHover?.(null);
      }
    },
    [normalizedData, onSliceHover],
  );

  const handleChartClick = useCallback(
    (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const newActive = internalActiveIndex === index ? null : index;
        setInternalActiveIndex(newActive);
        onSliceClick?.(newActive !== null ? normalizedData[newActive] : null, newActive);
      } else {
        setInternalActiveIndex(null);
        onSliceClick?.(null, null);
      }
    },
    [normalizedData, internalActiveIndex, onSliceClick],
  );

  const options: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        duration: 500,
        easing: "easeInOutQuart",
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      rotation: -90,
      circumference: 360,
      onHover: handleChartHover,
      onClick: handleChartClick,
      interaction: {
        intersect: true,
        mode: "nearest",
      },
    }),
    [handleChartHover, handleChartClick],
  );

  return {
    chartRef,
    containerRef,
    chartData,
    options,
    labelPositions,
    hoveredIndex,
    activeIndex,
    centerText,
    centerSubText,
    normalizedData,
    total,
  };
}
