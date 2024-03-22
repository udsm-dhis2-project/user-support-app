import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, zip } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { ReportingToolsService } from 'src/app/core/services/reporting-tools.service';
import {
  constructMessageForFacilityAssignment,
  getDataStoreDetailsForFormRequests,
} from 'src/app/shared/helpers/construct-message.helper';
import { SystemConfigsModel } from 'src/app/shared/models/system-configurations.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgramsService } from 'src/app/core/services/programs.service';
import { map } from 'rxjs/operators';
import { flatten, orderBy } from 'lodash';
import { getCurrentTranslations } from 'src/app/store/selectors/translations.selectors';
import { State } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-request-form-modal',
  templateUrl: './request-form-modal.component.html',
  styleUrls: ['./request-form-modal.component.css'],
})
export class RequestFormModalComponent implements OnInit {
  dialogData: any;
  assignedReportingTools$: Observable<any[]>;
  reportingTools$: Observable<any[]>;
  translations$: Observable<any>;
  assignmentDetails: any;
  savingData: boolean = false;
  uids$: Observable<string[]>;
  dataStoreMessageDetails$: Observable<any>;
  ouHasPendingRequest: boolean = false;
  savedData: boolean = false;
  dataSetAttributesData: any;
  keywordsKeys: any;
  constructor(
    private reportingToolsService: ReportingToolsService,
    private dialogRef: MatDialogRef<RequestFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private messagesAndDatastoreService: MessagesAndDatastoreService,
    private dataStoreService: DataStoreDataService,
    private _snackBar: MatSnackBar,
    private programsService: ProgramsService,
    private store: Store<State>
  ) {
    this.dialogData = data;
    this.keywordsKeys = data?.configurations?.keywordsKeys;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnInit(): void {
    this,this.translations$ = this.store.select(getCurrentTranslations);
    const matchedKeys =
      this.dialogData?.userSupportKeys.filter(
        (key) => key?.indexOf(this.dialogData?.facility?.id) > -1
      ) || [];
    if (matchedKeys.length > 0) {
      this.ouHasPendingRequest = true;
      this.dataStoreMessageDetails$ =
        this.dataStoreService.getDataViaKey(matchedKeys);
    }
    this.assignedReportingTools$ =
      this.reportingToolsService.getAssignedProgramsAndDataSets(
        this.dialogData?.facility?.id
      );
    this.reportingTools$ = zip(
      this.reportingToolsService.getAllDataSets(
        this.dialogData?.configurations &&
          this.dialogData?.configurations?.datasetClosedDateAttribute?.id
          ? this.dialogData?.configurations?.datasetClosedDateAttribute
          : null
      ),
      this.programsService.getAllPrograms()
    ).pipe(
      map((responses: any[]) => {
        return orderBy(flatten(responses), ['name'], ['asc']);
      })
    );
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
    const message = constructMessageForFacilityAssignment(
      assignmentDetails,
      this.keywordsKeys
    );
    const messageData = {
      subject: message?.subject,
      messageType: 'TICKET',
      users: [],
      userGroups: [{ id: systemConfigs?.feedbackRecipients?.id }],
      organisationUnits: [],
      attachments: [],
      text: message?.message,
    };
    const dataStorePayload = getDataStoreDetailsForFormRequests(
      assignmentDetails,
      this.keywordsKeys
    );
    if (dataStorePayload) {
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
          this.dataStoreMessageDetails$ = this.dataStoreService.getDataViaKey([
            dataStoreKey,
          ]);
        });
    } else {
      this.savingData = false;
      this.savedData = false;
      this.openSnackBar('The request miss important information', 'Close');
      setTimeout(() => {
        this._snackBar.dismiss();
      }, 2000);
    }
  }

  onGetAssignmentDetails(assignmentDetails: any, organisationUnit: any): void {
    this.assignmentDetails = assignmentDetails;
    this.dataSetAttributesData = {
      attributesData: this.assignmentDetails?.dataSetAttributesData,
      ou: organisationUnit,
    };
  }
}
