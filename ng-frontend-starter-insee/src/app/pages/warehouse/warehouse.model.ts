export class WarehouseModel {
  id: number;
  name: string;
  warehouseStatusId: number;
  imageUrl: string;
  pictureId: number;
  height: number;
  width: number;
  locations: LocationModel[];
  areaId: number;
  xAxis: number;
  yAxis: number;
  points: string;
  temperature: number;
  humidity: number;
  capacity: number;
  acreage: string;

  constructor(data?) {
    data = data || {};
    this.id = data.id;
    this.name = data.name;
    this.warehouseStatusId = data.warehouseStatusId;
    this.imageUrl = data.imageUrl;
    this.pictureId = data.pictureId;
    this.height = data.height;
    this.width = data.width;
    this.locations = data.locations || [];
    this.areaId = data.areaId;
    this.xAxis = data.xAxis || 0;
    this.yAxis = data.yAxis || 0;
    this.points = data.points || '';
    this.temperature = data.temperature;
    this.humidity = data.humidity;
    this.capacity = data.capacity;
    this.acreage = data.acreage;
  }
}

export class WarehouseResponse {
  warehouses: WarehouseModel[];
  total?: number;
}

export class LocationModel {
  id: number;
  name: string;
  area: string;
  line: string;
  row: string;
  cell: string;
  warehouseId: number;
  locationStatusId: number;
  locationTypeId: number;
  colorCode: string;
  xAxis: number;
  yAxis: number;
  points: string;

  constructor(data?) {
    data = data || {};
    this.id = data.id;
    this.name = data.name;
    this.area = data.area;
    this.line = data.line;
    this.row = data.row;
    this.cell = data.cell;
    this.warehouseId = data.warehouseId;
    this.locationStatusId = data.locationStatusId || 10;
    this.locationTypeId = data.locationTypeId || 10;
    this.colorCode = data.colorCode || '#63b9ff';
    this.xAxis = data.xAxis || 0;
    this.yAxis = data.yAxis || 0;
    this.points = data.points;
  }
}

export class LocationResponse {
  locations: LocationModel[];
  total?: number;
}

export const WarehouseStatus = [
  { id: 10, name: 'Available' },
  { id: 20, name: 'Unavailable' },
  { id: 30, name: 'Inactive' },
];

export const LocationStatus = [
  { id: 10, name: 'Available' },
  { id: 20, name: 'Unavailable' },
  { id: 30, name: 'Inactive' },
];

export const LocationType = [
  { id: 10, name: 'Shelf' },
  { id: 20, name: 'Packing' },
  { id: 30, name: 'Loading' },
];
