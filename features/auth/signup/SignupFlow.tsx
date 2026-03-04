"use client";

import { useEffect, useState } from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";

export type SignupStepId = "STEP1" | "STEP2" | "STEP3" | "STEP4";

const ORDERED_STEPS: SignupStepId[] = ["STEP1", "STEP2", "STEP3", "STEP4"];

type Direction = "forward" | "backward";

function SlidingContainer({ direction, children }: { direction: Direction; children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsActive(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const translateClass = isActive
    ? "translate-x-0"
    : direction === "forward"
      ? "translate-x-full"
      : "-translate-x-full";

  return <div className={`transform transition-transform duration-300 ${translateClass}`}>{children}</div>;
}

export default function SignupFlow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("forward");
  const [transitionKey, setTransitionKey] = useState(0);

  const currentStepId = ORDERED_STEPS[currentIndex];

  const goNext = () => {
    if (currentIndex >= ORDERED_STEPS.length - 1) return;
    setDirection("forward");
    setCurrentIndex((prev) => Math.min(prev + 1, ORDERED_STEPS.length - 1));
    setTransitionKey((key) => key + 1);
  };

  const goBack = () => {
    if (currentIndex <= 0) return;
    setDirection("backward");
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setTransitionKey((key) => key + 1);
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === ORDERED_STEPS.length - 1;

  const sharedProps = { goNext, goBack, isFirst, isLast };

  const renderStep = (stepId: SignupStepId) => {
    switch (stepId) {
      case "STEP1":
        return <Step1 {...sharedProps} />;
      case "STEP2":
        return <Step2 {...sharedProps} />;
      case "STEP3":
        return <Step3 {...sharedProps} />;
      case "STEP4":
        return <Step4 {...sharedProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-none">
      <SlidingContainer key={transitionKey} direction={direction}>
        {renderStep(currentStepId)}
      </SlidingContainer>
    </div>
  );
}
