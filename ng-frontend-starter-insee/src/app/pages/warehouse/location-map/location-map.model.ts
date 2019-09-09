export interface ILocation {
  id: number;
  name: string;
  locationStatusId: number;
  locationTypeId: number;
  colorCode: string;
  palletNumber: number;
  xAxis: number;
  yAxis: number;
  temperature?: number;
  humidity?: number;
  capacity?: number;
  itemQuantity?: number;
  points?: string;
  acreage?: string;
  column?:boolean;
  customIcon?:boolean;
  data?: any;
}

export interface IPoint {
  xAxis: number;
  yAxis: number;
}
