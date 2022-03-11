import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormValue } from '../../models/form-value.model';
import { GeneralFormModel } from '../../models/form.model';

@Component({
  selector: 'app-repeatable-form',
  templateUrl: './repeatable-form.component.html',
  styleUrls: ['./repeatable-form.component.scss'],
})
export class RepeatableFormComponent implements OnInit {
  @Input() formObject: GeneralFormModel;
  @Input() formData: any;

  @Output() formUpdate = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}

  onFormUpdate(formValue: FormValue): void {
    this.formUpdate.emit({
      [this.formObject.id]: {
        id: this.formObject.id,
        memberEntities: formValue.getValues(),
      },
    });
  }
}
