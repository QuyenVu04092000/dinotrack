import icons from "@/styles/icons";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  variable: "--font-inter",
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "DinoApp",
  description: "DigiSale - Phần mềm quản trị tùy chỉnh",
  icons: {
    icon: {
      url: icons.logoDigiSaleMini,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body id="portal-root" className={`${inter.variable} font-sans flex`}>
        <div className="w-full h-[100vh] overflow-auto">
          <div
            className="w-full h-fit bg-local bg-white"
            style={{
              minHeight: "calc(100vh - 65px)",
            }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
