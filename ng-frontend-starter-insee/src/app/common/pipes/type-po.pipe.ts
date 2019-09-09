import {
  Pipe,
  PipeTransform
} from '@angular/core';

export const TYPES_PO = [
  {
    id: 1,
    name: 'PO'
  },
  {
    id: 2,
    name: 'MB'
  },
  {
    id: 3,
    name: 'BPOR'
  },
  {
    id: 4,
    name: 'BIM'
  },
  {
    id: 5,
    name: 'SUPPLIES'
  }
];

@Pipe({ name: 'typePO' })

export class TypePoPipe implements PipeTransform {
  transform(id): string {
    return TYPES_PO.find(type => type.id === id).name;
  }
}
