"use client";

import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, ChartEvent, ActiveElement } from "chart.js";
import { DonutChartData, LabelPosition, UseDonutChartParams, UseDonutChartResult } from "app/types/DonutChart";

ChartJS.register(ArcElement, Tooltip, Legend);

export function useDonutChart({
  data,
  innerRadiusRatio,
  labelDistance,
  minLabelPercentage,
  initialCenterText,
  onSliceHover,
}: UseDonutChartParams): UseDonutChartResult {
  const chartRef = useRef<ChartJS<"doughnut">>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [labelPositions, setLabelPositions] = useState<LabelPosition[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [centerText, setCenterText] = useState<string | undefined>(initialCenterText);

  const { total, normalizedData } = useMemo(() => {
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    const normalized = data.map((item) => ({
      ...item,
      percentage: sum > 0 ? (item.value / sum) * 100 : 0,
    }));
    return { total: sum, normalizedData: normalized };
  }, [data]);

  const chartData = useMemo(
    () => ({
      labels: normalizedData.map((item) => item.label),
      datasets: [
        {
          data: normalizedData.map((item) => item.percentage),
          backgroundColor: normalizedData.map((item) => item.color),
          borderColor: "#ffffff",
          borderWidth: 2,
          spacing: 2,
          cutout: `${innerRadiusRatio * 100}%`,
        },
      ],
    }),
    [normalizedData, innerRadiusRatio],
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
        const visualSliceRadius = (visualInnerRadius + visualOuterRadius) / 2;

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

          const point3X = labelX;
          const point3Y = labelY;

          const polylinePoints = `${point1X},${point1Y} ${point2X},${point2Y} ${point3X},${point3Y}`;

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

        const filteredPositions = allPositions.filter((pos) => pos.percentage >= minLabelPercentage);

        const adjustedPositions: LabelPosition[] = [];
        const minDistance = 50;

        filteredPositions.forEach((pos) => {
          let adjustedPos = { ...pos };
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts) {
            let hasOverlap = false;

            for (const placed of adjustedPositions) {
              if (placed.side !== adjustedPos.side) continue;

              const dx = adjustedPos.x - placed.x;
              const dy = adjustedPos.y - placed.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < minDistance) {
                hasOverlap = true;
                const pushDistance = minDistance - distance + 5;
                if (adjustedPos.y < placed.y) {
                  adjustedPos.y -= pushDistance;
                } else {
                  adjustedPos.y += pushDistance;
                }

                const polylineParts = adjustedPos.polylinePoints.split(" ");
                const point3X = adjustedPos.x;
                const point3Y = adjustedPos.y;
                adjustedPos.polylinePoints = `${polylineParts[0]} ${polylineParts[1]} ${point3X},${point3Y}`;
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

    const timeout = setTimeout(calculatePositions, 100);

    const handleResize = () => {
      calculatePositions();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [chartData, normalizedData, labelDistance, minLabelPercentage, innerRadiusRatio]);

  const handleChartHover = useCallback(
    (event: ChartEvent, elements: ActiveElement[]) => {
      const chart = chartRef.current;
      if (!chart) return;

      if (elements.length > 0) {
        const index = elements[0].index;
        setHoveredIndex(index);
        const hoveredData = normalizedData[index];
        setCenterText(`${hoveredData.value.toLocaleString()}đ`);
        onSliceHover?.(hoveredData);
      } else {
        setHoveredIndex(null);
        setCenterText(initialCenterText);
        onSliceHover?.(null);
      }
    },
    [normalizedData, initialCenterText, onSliceHover],
  );

  const options: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      rotation: -90,
      circumference: 360,
      onHover: handleChartHover,
      interaction: {
        intersect: false,
        mode: "index",
      },
    }),
    [handleChartHover],
  );

  return {
    chartRef,
    containerRef,
    chartData,
    options,
    labelPositions,
    hoveredIndex,
    centerText,
    normalizedData,
  };
}
