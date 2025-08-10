import { usePathname } from "next/navigation";

export function useNavbar(): {
  checkActiveItemNavbar: (href: string) => boolean;
  pathname: string;
} {
  const pathname = usePathname();

  const checkActiveItemNavbar = (href: string): boolean => {
    const pathnameArray = pathname?.split("/");
    const hrefArray = href?.split("/");
    let statusActive = false;
    if (pathnameArray[1] === hrefArray[1]) {
      statusActive = true;
    } else {
      statusActive = false;
    }

    return statusActive;
  };

  return {
    checkActiveItemNavbar,
    pathname,
  };
}
