import "react-toastify/dist/ReactToastify.css";
import images from "@/styles/images";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <div className="w-full h-[100vh] overflow-auto">
      <div
        className="w-full h-fit bg-local"
        style={{
          minHeight: "calc(100vh - 65px)",
          backgroundImage: `url(${images.introBackground})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
