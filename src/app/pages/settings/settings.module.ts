import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { components } from './components';
import { pages } from './pages';
import { SettingsRoutingModule } from './settings-routing.module';
import { FilterItemsPipe } from './pipes/filter-items.pipe';
import { modals } from './modals';

@NgModule({
  declarations: [...pages, ...components, ...modals, FilterItemsPipe],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SettingsRoutingModule,
  ],
})
export class SettingsModule {}
