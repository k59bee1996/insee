export const Gender = {
  FEMALE: 0,
  MALE: 1,
  OTHER: 2,
};

export enum TypeBarcode {
  Order = 0,
  Pallet = 1,
  Location = 2,
  Product = 3,
  User = 4,
  Custom = 5,
}

export const Language = {
  English: {
    'id': 'en',
    'title': 'English',
    'flag': 'us'
  },
  VietNam: {
    'id': 'vi',
    'title': 'Việt Nam',
    'flag': 'vi'
  }
};

export enum SaveType {
  SaveAndBack = 1,
  SaveAndContinue = 2
}

export enum OrderItem {
  InboundOrder = 0,
  OutboundOrder = 1
}

export enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Complete = 2
}

export enum MarkerType {
  Normal = 1,
  Product = 2,
  Warehouse = 3,
  Location = 4,
  Area = 5,
  None=6,
  Image=7
}

export const BillStatus = {
  RECEIVED: {
    name: 'RECEIVED',
    id: 1
  },
  IN_STOCK: {
    name: 'IN_STOCK',
    id: 3
  },
  OUT_STOCK: {
    name: 'OUT_STOCK',
    id: 4
  },
  DELIVERED: {
    name: 'DELIVERED',
    id: 5
  }
};

export const Operator = [
  { id: 1, name: '=' },
  { id: 2, name: '>' },
  { id: 3, name: '<' },
  { id: 4, name: '>=' },
  { id: 5, name: '<=' },
];
