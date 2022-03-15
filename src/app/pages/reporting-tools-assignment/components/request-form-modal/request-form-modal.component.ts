import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UIDsFromSystemService } from 'src/app/core/services/get-uids-from-system.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { ReportingToolsService } from 'src/app/core/services/reporting-tools.service';
import {
  constructMessageForFacilityAssignment,
  getDataStoreDetailsForFormRequests,
} from 'src/app/shared/helpers/construct-message.helper';
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
  savingData: boolean = false;
  uids$: Observable<string[]>;
  constructor(
    private reportingToolsService: ReportingToolsService,
    private dialogRef: MatDialogRef<RequestFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private uidsFromSystemService: UIDsFromSystemService,
    private messagesAndDatastoreService: MessagesAndDatastoreService
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.assignedDataSets$ = this.reportingToolsService.getAssignedDataSets(
      this.dialogData?.facility?.id
    );
    this.allDataSets$ = this.reportingToolsService.getAllDataSets();
    this.uids$ = this.uidsFromSystemService.getUidsFromSystem(1);
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onSave(
    event: Event,
    assignmentDetails: any,
    uids: string[],
    facility: { id: string; name: string }
  ): void {
    event.stopPropagation();
    this.savingData = true;
    assignmentDetails = {
      ...assignmentDetails,
      organisationUnit: facility,
    };
    const message = constructMessageForFacilityAssignment(assignmentDetails);
    const messageData = {
      id: uids[0],
      subject: message?.subject,
      users: [],
      userGroups: [{ id: 'QYrzIjSfI8z' }],
      organisationUnits: [],
      attachments: [],
      text: message?.message,
    };
    const dataStorePayload =
      getDataStoreDetailsForFormRequests(assignmentDetails);
    this.messagesAndDatastoreService
      .createMessageAndUpdateDataStore(messageData, {
        id: uids[0],
        ...dataStorePayload,
      })
      .subscribe((response) => {
        this.savingData = false;
      });
  }

  onGetAssignmentDetails(assignmentDetails: any) {
    this.assignmentDetails = assignmentDetails;
  }
}
