"use client";

import { useState, useEffect } from "react";
import { useTransition, animated, useSpringRef } from "@react-spring/web";
import { IntroductionText } from "@/components/introduction/introductionText";
import StartButton from "@/components/introduction/startButton";
import images from "@/styles/images";

const texts = [
  "1. Chào mừng bạn đến với ứng dụng quản lý chi tiêu cá nhân",
  "2. Dễ dàng quản lý tài chính của bạn mọi lúc, mọi nơi",
  "3. Hãy bắt đầu hành trình tài chính của bạn ngay hôm nay",
];

const IntroPage = (): JSX.Element => {
  const [index, setIndex] = useState(0);
  const onClick = (): void => {
    setIndex((index) => (index + 1) % 3);
  };
  const transRef = useSpringRef();
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [texts.length]);

  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-30%,0,0)" },
    ref: transRef,
  });
  useEffect(() => {
    transRef.start();
  }, [index]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 65px)",
        backgroundImage: `url(${images.introBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative h-screen flex flex-col justify-left items-left p-4" onClick={onClick}>
        <div className="h-32 flex items-left justify-left text-left">
          {transitions((style, i) => (
            <animated.div style={style} className="absolute w-[266px] ml-5 mt-28 mr-12">
              {IntroductionText({ content: texts[i] })}
            </animated.div>
          ))}
        </div>

        <div className="absolute bottom-10 right-2">
          <StartButton />
        </div>
        {/* Button */}
      </div>
    </div>
  );
};

export default IntroPage;
