import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { containers } from './containers';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { components, entryComponents } from './components';

@NgModule({
  declarations: [...containers, ...components],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    StatisticsRoutingModule,
  ],
  entryComponents: [...entryComponents],
})
export class StatisticsModule {}
