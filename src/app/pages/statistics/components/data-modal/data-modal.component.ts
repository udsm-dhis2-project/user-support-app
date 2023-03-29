import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { SqlViewsService } from 'src/app/core/services/sql-views.service';

@Component({
  selector: 'app-data-modal',
  templateUrl: './data-modal.component.html',
  styleUrls: ['./data-modal.component.css'],
})
export class DataModalComponent implements OnInit {
  destinationOu: any;
  otherOus: any[];
  saving: boolean = false;
  errors: any[];
  constructor(
    private dialogRef: MatDialogRef<DataModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private sqlViewService: SqlViewsService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onMerge(event: Event, data: any): void {
    event.stopPropagation();
    this.saving = true;
    this.sqlViewService
      .mergeOus('kXINRTVFEaW', this.otherOus[0]?.data[0], this.destinationOu[0])
      .subscribe((response) => {
        if (response && !response?.error) {
          this.saving = false;
        } else {
          this.saving = false;
          console.log(response);
        }
      });
  }

  onSelectionChange(selectionChange: MatSelectChange): void {
    console.log(selectionChange);
    this.destinationOu = selectionChange?.value;
    this.otherOus =
      this.data?.filter(
        (duplicate) => duplicate?.data[0] !== this.destinationOu[0]
      ) || [];
    console.log(this.otherOus[0]?.data);
  }
}
