import type { IPaginationResponse } from "@/types/response/common/IBaseResponse";

export interface IColumnTypeTable<IRecordType = any> {
  key?: string;
  dataKey: string;
  title?: string;
  onCell?: (index?: number) => {
    rowSpan?: number;
    colSpan?: number;
  };
  child?: Array<IColumnTypeTableFormatted<IRecordType>>;
  headerProps?: {
    style?: React.CSSProperties;
  };
  bodyProps?: {
    style?: React.CSSProperties;
  };
  renderHeader?: (value?: any) => React.ReactNode;
  renderBody?: (
    value?: IRecordType,
    toggleExpandRow?: (key: string, keyQueryColumn?: string) => void,
  ) => React.ReactNode;
  fixed?: "left" | "right";
}

export interface IColumnTypeTableFormatted<IRecordType = any> extends IColumnTypeTable<IRecordType> {
  level?: number;
  colSpan?: number;
  rowSpan?: number;
}

export interface IUseTableProps<IRecordType = any> {
  columns: IColumnTypeTable[];
  rowSelection?: ITableRowSelectionProps<IRecordType>;
  dataSource?: IRecordType[];
}

export interface IUseRowSelectionProps<IRecordType = any> {
  rowSelection?: ITableRowSelectionProps<IRecordType>;
  dataSource?: IRecordType[];
}

export interface IUseFooterTableProps<IRecordType = any> {
  dataSource?: IRecordType[];
}

export interface IDataHeaderTable {
  level: number;
  item: IColumnTypeTableFormatted[];
}

export interface ITableRowSelectionProps<T> {
  selectedRowKeys?: React.Key[];
  keyQuery: keyof T;
  onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  defaultSelectedRowKeys?: React.Key[];
  rowSelectionHeaderProps?: {
    style?: React.CSSProperties;
  };
  isFixed?: boolean;
}

export interface IColumnFooterTable {
  keyQuery?: string;
  isSummary?: boolean;
  colSpan?: number;
  renderColumnFooter?: (value?: { summary?: number | string }) => React.ReactNode;
}

export interface IFooterTable<IRecordType> {
  renderFooter?: (dataSource: IRecordType[]) => React.ReactNode;
  columnFooters?: IColumnFooterTable[];
}

export interface IAddRowTable {
  title?: string;
  onAddRow?: () => void;
  renderAddRow?: () => React.ReactNode;
}

export interface IExtendTableFrame<IRecordType = any> {
  renderExtendTableFrame: (dataSource?: IRecordType[]) => React.ReactNode;
  position: "top" | "bottom";
}

export interface IUseFixedColumnTableProps {
  columns: IColumnTypeTableFormatted[];
  dataSource: any[];
  tableRef: React.RefObject<HTMLTableElement>;
}

export interface ITable<IRecordType = any> {
  isLoading?: boolean;
  columns: Array<IColumnTypeTable<IRecordType>>;
  dataSource: IRecordType[];
  renderEmptyState?: () => React.ReactNode;
  isHiddenEmptyState?: boolean;
  isLimit?: boolean;
  onChangePagination?: (limit: number, currentPage: number) => void;
  pagination?: IPaginationResponse;
  limitOptions?: number[];
  scroll?: {
    y: string;
  };
  rowSelection?: ITableRowSelectionProps<IRecordType>;
  onRowClick?: (record: IRecordType) => void;
  footer?: IFooterTable<IRecordType>;
  addRow?: IAddRowTable;
  extendTableFrames?: Array<IExtendTableFrame<IRecordType>>;
  dragDropRow?: {
    onMoved: (dragIndex: number, dropIndex: number, newData: IRecordType[]) => void;
    keyQuery: keyof IRecordType;
    renderHeaderDragDrop?: () => React.ReactNode;
    renderBodyDragDrop?: (value: { record: IRecordType; indexRow: number }) => React.ReactNode;
    isFixed?: boolean;
  };
  expandable?: {
    keyQuery: string;
    expandedRowRender: (record: IRecordType, dataKeyColumns: Set<string>) => React.ReactNode;
  };
}
