import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataSetsService } from 'src/app/core/services/dataset.service';

import {
  constructMessageForDataSetAssignment,
  getDataStoreDetailsForFormRequestsByDataSet,
} from 'src/app/shared/helpers/construct-message.helper';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { ProgramsService } from 'src/app/core/services/programs.service';

@Component({
  selector: 'app-ou-selection-form-request-modal',
  templateUrl: './ou-selection-form-request-modal.component.html',
  styleUrls: ['./ou-selection-form-request-modal.component.css'],
})
export class OuSelectionFormRequestModalComponent implements OnInit {
  dialogData: any;
  selectedOrgUnitItems: any[] = [];
  reportingToolDetails$: Observable<any>;
  additions: any[];
  deletions: any[];
  savingData: boolean = false;
  ouHasPendingRequest: boolean = false;
  savedData: boolean = false;
  dataStoreMessageDetails$: Observable<any>;
  assignmentDetails: any;
  allDataForUserSupport$: Observable<any>;
  keywordsKeys: any;
  constructor(
    private dialogRef: MatDialogRef<OuSelectionFormRequestModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private dataSetsService: DataSetsService,
    private messagesAndDatastoreService: MessagesAndDatastoreService,
    private _snackBar: MatSnackBar,
    private dataStoreService: DataStoreDataService,
    private programService: ProgramsService
  ) {
    this.dialogData = data;
    this.keywordsKeys = data?.configurations?.keywordsKeys;
  }

  ngOnInit(): void {
    this.reportingToolDetails$ =
      !this.dialogData?.type || this.dialogData?.type !== 'program'
        ? this.dataSetsService.getDataSetById(this.dialogData?.dataSet?.id)
        : this.programService.getProgramById(
            this.dialogData?.reportingTool?.id
          );

    this.allDataForUserSupport$ = this.dataStoreService.getAllFromNameSpace(
      'dataStore/dhis2-user-support',
      this.dialogData?.configurations
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  onGetSelectedOus(items: any[], reportingToolDetails: any): void {
    this.selectedOrgUnitItems = items.map((item: any) => {
      return {
        id: item?.id,
        name: item?.name,
      };
    });
    this.additions =
      items.filter(
        (item: any) =>
          (
            reportingToolDetails?.organisationUnits?.filter(
              (ou) => ou?.id === item?.id
            ) || []
          )?.length === 0
      ) || [];
    this.deletions =
      reportingToolDetails?.organisationUnits?.filter(
        (ou: any) =>
          (items?.filter((item) => item?.id == ou?.id) || [])?.length === 0
      ) || [];

    const payload = {
      additions: this.additions,
      deletions: this.deletions,
    };

    const assignmentDetails = {
      ...payload,
      dataSet: this.dialogData?.dataSet,
      ticketNumber: 'DS' + Date.now(),
    };

    this.assignmentDetails = assignmentDetails;
  }

  saveRequest(
    event: Event,
    ous: string[],
    currentUser: any,
    reportingTool: any
  ): void {
    event.stopPropagation();
    this.savingData = true;
    const payload = {
      additions: this.additions,
      deletions: this.deletions,
    };

    const assignmentDetails = {
      ...payload,
      type: this.dialogData?.type ? this.dialogData?.type : 'dataset',
      reportingTool,
      ticketNumber: 'DS' + Date.now(),
    };

    this.assignmentDetails = assignmentDetails;

    const message = constructMessageForDataSetAssignment(
      assignmentDetails,
      this.keywordsKeys
    );

    // console.log(assignmentDetails);
    // console.log(message);
    const messageData = {
      subject: message?.subject,
      messageType: 'TICKET',
      users: [],
      userGroups: [
        { id: this.dialogData?.systemConfigs?.feedbackRecipients?.id },
      ],
      organisationUnits: [],
      attachments: [],
      text: message?.message,
    };

    const dataStorePayload = getDataStoreDetailsForFormRequestsByDataSet(
      assignmentDetails,
      this.keywordsKeys
    );

    // console.log(dataStorePayload);
    const dataStoreKey =
      assignmentDetails?.ticketNumber +
      '_' +
      assignmentDetails?.reportingTool?.id;
    // console.log(dataStoreKey);
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
          this.dialogRef.close(true);
        }, 500);
        setTimeout(() => {
          this._snackBar.dismiss();
        }, 2000);
        this.dataStoreMessageDetails$ = this.dataStoreService.getDataViaKey([
          dataStoreKey,
        ]);
      });
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close(false);
  }
}
