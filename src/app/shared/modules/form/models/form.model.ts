import { DropdownOption } from './dropdown-option.model';
import { Field } from './field.model';

export interface GeneralFormModel {
  id: string;
  name: string;
  options?: DropdownOption[];
  dataType?: string;
  formField?: Field<string>;
  formFields?: Field<string>[];
}
