import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataSetsService } from 'src/app/core/services/dataset.service';

@Component({
  selector: 'app-ou-selection-form-request-modal',
  templateUrl: './ou-selection-form-request-modal.component.html',
  styleUrls: ['./ou-selection-form-request-modal.component.css'],
})
export class OuSelectionFormRequestModalComponent implements OnInit {
  dialogData: any;
  selectedOrgUnitItems: string[] = [];
  dataSetDetails$: Observable<any>;
  constructor(
    private dialogRef: MatDialogRef<OuSelectionFormRequestModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private dataSetsService: DataSetsService
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.dataSetDetails$ = this.dataSetsService.getDataSetById(
      this.dialogData?.dataSet?.id
    );
  }

  onGetSelectedOus(items: string[]): void {
    this.selectedOrgUnitItems = items;
    console.log(items);
  }

  saveRequest(event: Event, ous: string[]): void {
    event.stopPropagation();
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
