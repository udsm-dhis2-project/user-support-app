import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ReportingToolsService } from 'src/app/core/services/reporting-tools.service';
import { DataSets } from 'src/app/shared/models/reporting-tools.models';

@Component({
  selector: 'app-request-form-modal',
  templateUrl: './request-form-modal.component.html',
  styleUrls: ['./request-form-modal.component.css'],
})
export class RequestFormModalComponent implements OnInit {
  dialogData: any;
  assignedDataSets$: Observable<DataSets[]>;
  allDataSets$: Observable<DataSets[]>;
  assignmentDetails: any;
  constructor(
    private reportingToolsService: ReportingToolsService,
    private dialogRef: MatDialogRef<RequestFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.assignedDataSets$ = this.reportingToolsService.getAssignedDataSets(
      this.dialogData?.facility?.id
    );
    this.allDataSets$ = this.reportingToolsService.getAllDataSets();
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onSave(event: Event): void {
    event.stopPropagation();
  }

  onGetAssignmentDetails(assignmentDetails: any) {
    console.log(assignmentDetails);
    this.assignmentDetails = assignmentDetails;
  }
}
