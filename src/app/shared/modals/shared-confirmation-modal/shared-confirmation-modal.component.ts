import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TextArea } from '../../modules/form/models/text-area.model';
import { FormValue } from '../../modules/form/models/form-value.model';

@Component({
  selector: 'app-shared-confirmation-modal',
  templateUrl: './shared-confirmation-modal.component.html',
  styleUrl: './shared-confirmation-modal.component.css',
})
export class SharedConfirmationModalComponent implements OnInit {
  formField: any;
  reason: string;
  constructor(
    private dialogRef: MatDialogRef<SharedConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data?.captureReason) {
      this.formField = new TextArea({
        id: 'reason',
        key: 'reason',
        label: 'Reason',
        required: true,
      });
    }
  }

  onConfirm(event: Event): void {
    event.stopPropagation();
    if (this.data?.captureReason) {
      this.dialogRef.close({
        confirmed: true,
        reason: this.reason,
      });
    } else {
      this.dialogRef.close(true);
    }
  }

  onFormUpdate(formValue: FormValue): void {
    this.reason = formValue.getValues().reason?.value;
  }
}
