import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseDialogComponent } from './warehouse-dialog/warehouse-dialog.component';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';
import { AppSharedModule } from '@common/index';
import { WarehouseListComponent } from '@pages/warehouse/warehouse-list/warehouse-list.component';
import { WarehouseService } from '@pages/warehouse/warehouse.service';
import { GenericListModule } from '@modules/generic-list/generic-list.module';
import { UploaderModule } from '@modules/uploader';
import { LocationMapComponent } from '@pages/warehouse/location-map/location-map.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { PrintQrCodeModule } from '@modules/print-qr-code/print-qr-code.module';
import { FactoryMapComponent } from '@pages/warehouse/factory-map/factory-map.component';


const routes: Routes = [
  {path: '', redirectTo: 'overview', pathMatch: 'full'},
  {path: 'list/:id', component: WarehouseListComponent},
  {path: 'overview', component: FactoryMapComponent},
  {path: 'manage/:id/:locationId', component: LocationListComponent},
  {path: 'manage/:id', component: LocationListComponent},
  {path: '**', redirectTo: 'overview'},
];

@NgModule({
  imports: [
    AppSharedModule,
    RouterModule.forChild(routes),
    GenericListModule,
    UploaderModule,
    ColorPickerModule,
    PrintQrCodeModule,
  ],
  declarations: [
    WarehouseListComponent,
    WarehouseDialogComponent,
    LocationListComponent,
    LocationDialogComponent,
    LocationMapComponent,
    FactoryMapComponent
  ],
  entryComponents: [
    WarehouseDialogComponent,
    LocationDialogComponent,
  ],
  providers: [
    WarehouseService,
  ]
})
export class WarehouseModule {
}
