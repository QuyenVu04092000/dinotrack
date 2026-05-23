import type React from "react";
import type { Chart as ChartJS, ChartOptions, ChartEvent, ActiveElement } from "chart.js";

export interface DonutChartData {
  id: string;
  label: string;
  value: number;
  color: string;
  icon?: string;
}

export interface LabelPosition {
  id: string;
  x: number;
  y: number;
  icon?: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
  side: "left" | "right";
  polylinePoints: string;
  angle: number;
}

export interface UseDonutChartParams {
  data: DonutChartData[];
  innerRadiusRatio: number;
  labelDistance: number;
  minLabelPercentage: number;
  initialCenterText?: string;
  activeIndex?: number | null;
  onSliceHover?: (data: DonutChartData | null) => void;
  onSliceClick?: (data: DonutChartData | null, index: number | null) => void;
}

export interface UseDonutChartResult {
  chartRef: React.RefObject<ChartJS<"doughnut">>;
  containerRef: React.RefObject<HTMLDivElement>;
  chartData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string;
      borderWidth: number;
      hoverOffset: number;
      spacing: number;
      cutout: string;
    }[];
  };
  options: ChartOptions<"doughnut">;
  labelPositions: LabelPosition[];
  hoveredIndex: number | null;
  activeIndex: number | null;
  centerText?: string;
  centerSubText?: string;
  normalizedData: (DonutChartData & { percentage: number })[];
  total: number;
}
