export interface MomoBarChartData {
  label: string;
  value: number;
  type: "in" | "out";
}

export interface MomoBarChartProps {
  data: MomoBarChartData[];
  height?: number;
  onBarClick?: (label: string, index: number) => void;
  suggestedValue?: number;
  activeIndex?: number | null;
  param: URLSearchParams;
}
