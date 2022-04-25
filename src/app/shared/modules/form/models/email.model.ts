import { Field } from './field.model';

export class Email extends Field<string> {
  controlType = 'email';
}
