const PageUrls = {
  HOME: {
    BASE: "/",
  },
  AUTHENTICATION: {
    LOGIN: "/login",
  },
  PRODUCT: {
    BASE: "/product",
    CREATE_PRODUCT: "/product/create-product",
  },
  REPORT: {
    BASE: "/report",
    INVENTORY_QUANTITY: "/report/inventory-quantity",
    WAREHOUSE_REPORT: {
      BASE: "/report/warehouse-report",
      WAREHOUSE_TRANSACTION_REPORT: "/report/warehouse-report/warehouse-transaction-report",
      WAREHOUSE_INVENTORY_REPORT: "/report/warehouse-report/warehouse-inventory-report",
    },
    RAW_DATA: "/report/raw-data",
    SALE_REPORT: {
      BASE: "/report/sale-report",
      ORDER_STATUS_REPORT: "/report/sale-report/order-status-report",
    },
  },
  WAREHOUSE: {
    BASE: "/warehouse",
    LIST_WAREHOUSE: "/warehouse/list-warehouse",
    LIST_WAREHOUSE_TRANSACTION: "/warehouse/warehouse-transaction",
  },
  SALE: {
    BASE: "/sale",
    LIST_ORDER: "/sale/list-order",
    CREATE_ORDER: "/sale/list-order/create-order",
  },
  CUSTOMER: {
    BASE: "/customer",
    GENERAL_TRADE: "/customer/customer-general-trade",
  },
  ROUTE: {
    BASE: "/route",
  },
  ADMIN: {
    BUSINESS: {
      BASE: "/business",
    },
    USER: {
      BASE: "/user",
    },
    APPLICABLE_ZONE: {
      BASE: "/applicable-zone",
    },
    AUTHORIZATION: {
      BASE: "/authorization",
    },
  },
};

export default PageUrls;
