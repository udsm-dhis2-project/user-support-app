import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDhis2OrgUnitFilterModule } from '@iapps/ngx-dhis2-org-unit-filter';
// import { NgxDhis2DataFilterModule } from '@iapps/ngx-dhis2-data-filter';
import { NgxDhis2PeriodFilterModule } from '@iapps/ngx-dhis2-period-filter';
import { materialModules } from './materials.module';
import { sharedComponents, sharedEntryComponents } from './components';
import { FormModule } from './modules/form/form.module';
import { SearchItemPipe } from './pipes/search-item.pipe';
import { FilterFormRequestsPipe } from './pipes/filter-requests.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { FilterItemsPipe } from './pipes/filter-items.pipe';
import { modals } from './modals';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    ...materialModules,
    NgxDhis2OrgUnitFilterModule,
    // NgxDhis2DataFilterModule,
    NgxDhis2PeriodFilterModule,
    TranslateModule,
  ],
  exports: [
    CommonModule,
    FormModule,
    ...materialModules,
    ...sharedComponents,
    ...sharedEntryComponents,
    ...modals,
    NgxDhis2OrgUnitFilterModule,
    // NgxDhis2DataFilterModule,
    NgxDhis2PeriodFilterModule,
    SearchItemPipe,
    FilterFormRequestsPipe,
    FilterItemsPipe,
    TranslateModule,
  ],
  declarations: [
    ...sharedComponents,
    ...sharedEntryComponents,
    ...modals,
    SearchItemPipe,
    FilterFormRequestsPipe,
    FilterItemsPipe,
  ],
})
export class SharedModule {}
