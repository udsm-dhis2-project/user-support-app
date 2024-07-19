import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndicatorsRoutingModule } from './indicators-requests-routing.module';
import { pages } from './pages';
import { components } from './components';
import { modals } from './modals';

@NgModule({
  declarations: [...pages, ...components, ...modals],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IndicatorsRoutingModule,
  ],
})
export class IndicatorsModule {}
