import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountabilityRoutingModule } from './accountability-routing.module';
import { pages } from './pages';
import { components } from './components';

@NgModule({
  declarations: [...pages, ...components],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccountabilityRoutingModule,
  ],
})
export class AccountabilityModule {}
