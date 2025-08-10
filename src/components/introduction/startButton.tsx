import { ArrowCircleRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const StartButton = (): JSX.Element => {
  return (
    <div className="w-fit h-fit">
      <Link
        href="auth/login"
        className="w-full flex flex-row gap-1 items-center bg-[#9CF526] text-[#1F2532] px-2 py-1 rounded-full text-lg shadow-md hover:bg-green-600 transition duration-300"
      >
        <p className="pl-6 pr-5 py-2 text-buttonL">Bắt đầu</p>
        <div className=" right-1">
          <ArrowCircleRight size={40} weight="fill" />
        </div>
      </Link>
    </div>
  );
};

export default StartButton;
