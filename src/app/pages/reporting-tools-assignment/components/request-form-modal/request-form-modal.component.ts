import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { ReportingToolsService } from 'src/app/core/services/reporting-tools.service';
import {
  constructMessageForFacilityAssignment,
  getDataStoreDetailsForFormRequests,
} from 'src/app/shared/helpers/construct-message.helper';
import { DataSets } from 'src/app/shared/models/reporting-tools.models';
import { SystemConfigsModel } from 'src/app/shared/models/system-configurations.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  dataStoreMessageDetails$: Observable<any>;
  ouHasPendingRequest: boolean = false;
  savedData: boolean = false;
  constructor(
    private reportingToolsService: ReportingToolsService,
    private dialogRef: MatDialogRef<RequestFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private messagesAndDatastoreService: MessagesAndDatastoreService,
    private dataStoreService: DataStoreDataService,
    private _snackBar: MatSnackBar
  ) {
    this.dialogData = data;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnInit(): void {
    const matchedKeys =
      this.dialogData?.userSupportKeys.filter(
        (key) => key?.indexOf(this.dialogData?.facility?.id) > -1
      ) || [];
    if (matchedKeys.length > 0) {
      this.ouHasPendingRequest = true;
      this.dataStoreMessageDetails$ = this.dataStoreService.getDataViaKey(
        matchedKeys[0]
      );
    }
    this.assignedDataSets$ = this.reportingToolsService.getAssignedDataSets(
      this.dialogData?.facility?.id
    );
    this.allDataSets$ = this.reportingToolsService.getAllDataSets();
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onSave(
    event: Event,
    assignmentDetails: any,
    facility: { id: string; name: string },
    systemConfigs: SystemConfigsModel,
    currentUser: any
  ): void {
    event.stopPropagation();
    // TODO: Add logic to get ticket number
    this.savingData = true;
    this.savedData = false;
    assignmentDetails = {
      ...assignmentDetails,
      organisationUnit: facility,
      ticketNumber: 'DS' + Date.now(),
    };
    const message = constructMessageForFacilityAssignment(assignmentDetails);
    const messageData = {
      subject: message?.subject,
      messageType: 'TICKET',
      users: [],
      userGroups: [{ id: systemConfigs?.feedbackRecipients?.id }],
      organisationUnits: [],
      attachments: [],
      text: message?.message,
    };
    const dataStorePayload =
      getDataStoreDetailsForFormRequests(assignmentDetails);
    const dataStoreKey = assignmentDetails?.ticketNumber + '_' + facility?.id;
    this.messagesAndDatastoreService
      .createMessageAndUpdateDataStore(messageData, {
        id: dataStoreKey,
        user: {
          id: currentUser?.id,
          displayName: currentUser?.displayName,
          userName: currentUser?.userCredentials?.username,
          jobTitle: currentUser?.jobTitle,
          email: currentUser?.email,
          organisationUnits: currentUser?.organisationUnits,
          phoneNumber: currentUser?.phoneNumber,
        },
        message: message,
        ...dataStorePayload,
      })
      .subscribe((response) => {
        this.savingData = false;
        this.ouHasPendingRequest = true;
        this.savedData = true;
        this.openSnackBar('Successfully sent form request', 'Close');
        setTimeout(() => {
          this.dialogRef.close();
        }, 500);
        setTimeout(() => {
          this._snackBar.dismiss();
        }, 2000);
        this.dataStoreMessageDetails$ =
          this.dataStoreService.getDataViaKey(dataStoreKey);
      });
  }

  onGetAssignmentDetails(assignmentDetails: any) {
    this.assignmentDetails = assignmentDetails;
  }
}
