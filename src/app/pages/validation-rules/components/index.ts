import { FormatCustomFormComponent } from './format-custom-form/format-custom-form.component';
import { SaveValidationModalComponent } from './save-validation-modal/save-validation-modal.component';
import { ValidationRulesListContainerComponent } from './validation-rules-list-container/validation-rules-list-container.component';
import { ValidationRulesListComponent } from './validation-rules-list/validation-rules-list.component';

export const validationRulesRequestComponents: any[] = [
  ValidationRulesListContainerComponent,
  ValidationRulesListComponent,
  SaveValidationModalComponent,
  FormatCustomFormComponent,
];
export const entryValidationRulesRequestComponents: any[] = [
  SaveValidationModalComponent,
];
