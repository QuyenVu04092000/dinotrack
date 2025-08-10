"use client";
import type { IItemNavbarProps } from "@/types/component/navbar";
import PageUrls from "@/utilities/enums/pageUrl";
import { ChartPieSlice, User, Files, CurrencyCircleDollar, Plus } from "@phosphor-icons/react/dist/ssr";
import { NavbarItem } from "@/components/common/navbar/navbarItem";
import { useNavbar } from "@/hooks/common/navbar/useNavbar";

const Navbar = (): JSX.Element => {
  const { checkActiveItemNavbar } = useNavbar();

  const navBarItems: IItemNavbarProps[] = [
    {
      id: 1,
      level: 0,
      title: "Báo cáo",
      href: PageUrls.REPORT.BASE,
      icon: <ChartPieSlice size={24} />,
      iconFill: <ChartPieSlice size={24} weight="fill" />,
    },
    {
      id: 2,
      level: 0,
      title: "Sổ giao dịch",
      href: PageUrls.TRANSACTION.BASE,
      icon: <Files size={24} />,
      iconFill: <Files size={24} weight="fill" />,
    },
    {
      id: 3,
      level: 0,
      title: "",
      href: "#",
      icon: <Plus size={24} />,
      iconFill: <Plus size={24} weight="fill" />,
    },
    {
      id: 4,
      level: 0,
      title: "Ngân sách",
      href: PageUrls.BUDGET.BASE,
      icon: <CurrencyCircleDollar size={24} />,
      iconFill: <CurrencyCircleDollar size={24} weight="fill" />,
    },
    {
      id: 5,
      level: 0,
      title: "Tài khoản",
      href: PageUrls.ACCOUNT.BASE,
      icon: <User size={24} />,
      iconFill: <User size={24} weight="fill" />,
    },
  ];

  return (
    <nav className="relative w-full h-fit justify-center items-center z-50 bg-white rounded-t-3xl">
      <div className="flex flex-row gap-4 px-4 justify-center items-center">
        {navBarItems.map((item) => (
          <div key={item.id}>
            <NavbarItem content={item} active={checkActiveItemNavbar(item.href)} />
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
