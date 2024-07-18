import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dropdown } from 'src/app/shared/modules/form/models/dropdown.model';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';

@Component({
  selector: 'app-selection-filter',
  templateUrl: './selection-filter.component.html',
  styleUrl: './selection-filter.component.css',
})
export class SelectionFilterComponent implements OnInit {
  @Input() itemsList: any[];
  @Input() label: string;
  selectionFormField: any;
  @Output() selectedItem: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    this.selectionFormField = new Dropdown({
      id: 'selection',
      key: 'selection',
      label: this.label,
      options: this.itemsList?.map((item: any) => {
        return {
          key: item?.id,
          value: item?.id,
          label: item?.name,
        };
      }),
    });
  }

  onFormUpdate(formValue: FormValue): void {
    this.selectedItem.emit(formValue.getValues()?.selection?.value);
  }
}
