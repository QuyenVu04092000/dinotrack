export interface IItemNavbarProps {
  id: number;
  level: number;
  title: string;
  href: string;
  disabled?: boolean;
  active?: boolean;
  icon?: React.ReactElement;
  iconFill?: React.ReactElement;
  pathIcon?: string;
  children?: IItemNavbarProps[];
}
