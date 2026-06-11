"use client";

interface MonthNavigatorProps {
  periodLabel: string;
  onPrev: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
}

export default function MonthNavigator({ periodLabel, onPrev, onNext, isNextDisabled }: MonthNavigatorProps) {
  return (
    <div className="flex items-center justify-between px-3 pt-2.5">
      <button
        type="button"
        onClick={onPrev}
        className="flex h-8 w-8 items-center justify-center rounded-full active:bg-gray-100"
        aria-label="Tháng trước"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="#1F2532"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <p className="text-sm font-semibold text-[#090A0B]">{periodLabel}</p>

      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
        className="flex h-8 w-8 items-center justify-center rounded-full active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Tháng sau"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="#1F2532"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
