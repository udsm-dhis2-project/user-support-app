import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatasetLockingRoutingModule } from './dataset-locking.routing.module';

@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DatasetLockingRoutingModule,
  ],
})
export class DatasetLockingExportModule {}
