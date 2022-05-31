import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataSetsService } from 'src/app/core/services/dataset.service';

import { difference } from 'lodash';

@Component({
  selector: 'app-ou-selection-form-request-modal',
  templateUrl: './ou-selection-form-request-modal.component.html',
  styleUrls: ['./ou-selection-form-request-modal.component.css'],
})
export class OuSelectionFormRequestModalComponent implements OnInit {
  dialogData: any;
  selectedOrgUnitItems: any[] = [];
  dataSetDetails$: Observable<any>;
  additions: any[];
  deletions: any[];
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

  onGetSelectedOus(items: any[], dataSetDetails: any): void {
    this.selectedOrgUnitItems = items.map((item: any) => {
      return {
        id: item?.id,
      };
    });
    this.additions =
      items.filter(
        (item: any) =>
          (
            dataSetDetails?.organisationUnits?.filter(
              (ou) => ou?.id === item?.id
            ) || []
          )?.length === 0
      ) || [];
    this.deletions =
      dataSetDetails?.organisationUnits?.filter(
        (ou: any) =>
          (items?.filter((item) => item?.id == ou?.id) || [])?.length === 0
      ) || [];
  }

  saveRequest(event: Event, ous: string[]): void {
    event.stopPropagation();
    const payload = {
      additions: this.additions,
      deletions: this.deletions,
    };
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
