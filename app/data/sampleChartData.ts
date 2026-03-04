// Sample data for DonutChart testing
import type { SampleChartData } from "app/types/sampleChartData";

export const sampleDonutChartData: SampleChartData[] = [
  {
    id: "1",
    label: "Chợ, siêu thị",
    value: 500000,
    color: "#7dd5fc",
    icon: "🛒",
  },
  {
    id: "2",
    label: "Ăn uống",
    value: 20000,
    color: "#f9a8d0",
    icon: "🍽️",
  },
  {
    id: "3",
    label: "Du lịch",
    value: 20000,
    color: "#fee28a",
    icon: "✈️",
  },
  {
    id: "4",
    label: "Người thân",
    value: 20000,
    color: "#86efad",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: "5",
    label: "Giải trí",
    value: 15000,
    color: "#dab4fe",
    icon: "🎮",
  },
  {
    id: "6",
    label: "Y tế",
    value: 10000,
    color: "#aab9cf",
    icon: "🏥",
  },
];

// Sample data with more variety
export const sampleDonutChartDataVaried: SampleChartData[] = [
  {
    id: "1",
    label: "Chợ, siêu thị",
    value: 500000,
    color: "#7dd5fc",
    icon: "🛒",
  },
  {
    id: "2",
    label: "Ăn uống",
    value: 150000,
    color: "#f9a8d0",
    icon: "🍽️",
  },
  {
    id: "3",
    label: "Du lịch",
    value: 80000,
    color: "#fee28a",
    icon: "✈️",
  },
  {
    id: "4",
    label: "Người thân",
    value: 50000,
    color: "#86efad",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: "5",
    label: "Giải trí",
    value: 30000,
    color: "#dab4fe",
    icon: "🎮",
  },
  {
    id: "6",
    label: "Y tế",
    value: 20000,
    color: "#aab9cf",
    icon: "🏥",
  },
  {
    id: "7",
    label: "Giáo dục",
    value: 10000,
    color: "#fbbf24",
    icon: "📚",
  },
];

// Sample data with small slices (to test minLabelPercentage)
export const sampleDonutChartDataSmall: SampleChartData[] = [
  {
    id: "1",
    label: "Chợ, siêu thị",
    value: 500000,
    color: "#7dd5fc",
    icon: "🛒",
  },
  {
    id: "2",
    label: "Ăn uống",
    value: 20000,
    color: "#f9a8d0",
    icon: "🍽️",
  },
  {
    id: "3",
    label: "Du lịch",
    value: 20000,
    color: "#fee28a",
    icon: "✈️",
  },
  {
    id: "4",
    label: "Người thân",
    value: 20000,
    color: "#86efad",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: "5",
    label: "Giải trí",
    value: 5000,
    color: "#dab4fe",
    icon: "🎮",
  },
  {
    id: "6",
    label: "Y tế",
    value: 3000,
    color: "#aab9cf",
    icon: "🏥",
  },
];
