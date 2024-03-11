import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { Textbox } from 'src/app/shared/modules/form/models/text-box.model';

@Component({
  selector: 'app-capture-translation',
  templateUrl: './capture-translation.component.html',
  styleUrl: './capture-translation.component.css',
})
export class CaptureTranslationComponent implements OnInit {
  @Input() translation: string;
  @Output() translationValue: EventEmitter<string> = new EventEmitter<string>();
  formField: any;

  ngOnInit(): void {
    this.translationValue.emit(this.translation);
    this.formField = new Textbox({
      id: 'translation',
      key: 'translation',
      label: '',
      required: true,
      value: this.translation,
    });
  }

  onFormUpdate(formValue: FormValue): void {
    this.translationValue.emit(formValue.getValues()?.translation?.value);
  }
}
