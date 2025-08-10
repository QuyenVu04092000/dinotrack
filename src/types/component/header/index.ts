export interface IHeaderProps {
  showBackButton: boolean;
  title?: string;
  rightElement?: React.ReactNode;
}

export interface IHeaderButtonProps {
  content: IHeaderButtonContentProps;
}

export interface IHeaderButtonContentProps {
  icon?: React.ReactElement;
  title?: string;
}
