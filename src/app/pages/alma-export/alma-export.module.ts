import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { containers } from './containers';
import { components } from './components';
import { ALMAExportRoutingModule } from './alma-export-routing.module';

@NgModule({
  declarations: [...containers, ...components],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ALMAExportRoutingModule,
  ],
})
export class ALMAExportModule {}
