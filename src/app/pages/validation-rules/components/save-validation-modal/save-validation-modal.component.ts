import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';
import { ValidationRulesService } from 'src/app/core/services/validation-rules.service';
import { State } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors';

@Component({
  selector: 'app-save-validation-modal',
  templateUrl: './save-validation-modal.component.html',
  styleUrls: ['./save-validation-modal.component.css'],
})
export class SaveValidationModalComponent implements OnInit {
  validationRule: any;
  created: boolean = false;
  creating: boolean = false;
  currentUser$: Observable<any>;
  constructor(
    private dialogRef: MatDialogRef<SaveValidationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataStoreService: DataStoreDataService,
    private messageAndDataStoreService: MessagesAndDatastoreService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUser);
    this.validationRule = {
      id: this.data?.id,
      name: this.data?.name,
      shortName: this.data?.shortName,
      description: this.data?.description,
      importance: this.data?.importance,
      instrunctions: this.data?.instructions,
      publicAccess: 'rw------',
      operator: this.data?.operator,
      periodType: this.data?.periodType,
      skipFormValidation: false,
      leftSide: {
        expression: this.data?.leftSide?.expression,
        description: this.data?.leftSide?.description,
        missingValueStrategy: 'NEVER_SKIP',
        slidingWindow: false,
      },
      rightSide: {
        expression: this.data?.rightSide?.expression,
        description: this.data?.rightSide?.description,
        missingValueStrategy: 'NEVER_SKIP',
        slidingWindow: false,
      },
    };
  }

  onSave(event: Event, validationRule: any): void {
    event.stopPropagation();
    this.creating = true;

    const dataStoreKey = 'VR' + Date.now();
    // Check potentialUserNames first
    const dataForMessageAndDataStore = {
      id: dataStoreKey,
      ticketNumber: 'UA' + Date.now().toString(),
      action: `Respond to creation of validation rule ${validationRule?.name} as requested by ${this.data?.currentUser?.displayName}`,
      message: {
        message: `User ${this.data?.currentUser?.displayName} has requested validation rule: ${validationRule?.name}. \n\nThe details of the rule are: \n\n Name: ${validationRule?.name} \n Shortname: ${validationRule?.shortName} \n Importance: ${validationRule?.importance}\n Left side: ${validationRule?.leftSide?.description} (${this.data?.expressionDescriptionLeft})  \n Operator:${validationRule?.operator}   \n Right side: ${validationRule?.rightSide?.description} (${this.data?.expressionDescriptionRight})`,
        htmlMessage: `User ${this.data?.currentUser?.displayName} has requested validation rule: ${validationRule?.name}. <br /><br /> The details of the rule are: <br /><br /> Name: ${validationRule?.name}   <br /> Shortname: ${validationRule?.shortName} <br /> Importance: ${validationRule?.importance}<br /> Left side: ${validationRule?.leftSide?.description} (${this.data?.expressionDescriptionLeft}) <br /> Operator:${validationRule?.operator}  <br />s Right side: ${validationRule?.rightSide?.description} (${this.data?.expressionDescriptionRight})`,
        subject: 'VR' + Date.now().toString() + ' - VALIDATION RULE REQUEST',
      },
      replyMessage: `Validation rule ${validationRule?.name} has been approved successfully. You can now to proceed to use the rule`,
      payload: validationRule,
      url: 'validationRules',
      method: 'POST',
      user: this.data?.currentUser,
    };

    const messageData = {
      subject: dataForMessageAndDataStore?.message?.subject,
      messageType: 'TICKET',
      users: [],
      userGroups: [{ id: this.data?.systemConfigs?.feedbackRecipients?.id }],
      organisationUnits: [],
      attachments: [],
      text: dataForMessageAndDataStore?.message?.message,
    };

    this.messageAndDataStoreService
      .createMessageAndUpdateDataStore(messageData, {
        id: dataStoreKey,
        user: {
          id: this.data?.currentUser?.id,
          displayName: this.data?.currentUser?.displayName,
          userName: this.data?.currentUser?.userCredentials?.username,
          jobTitle: this.data?.currentUser?.jobTitle,
          email: this.data?.currentUser?.email,
          organisationUnits: this.data?.currentUser?.organisationUnits,
          phoneNumber: this.data?.currentUser?.phoneNumber,
        },
        message: dataForMessageAndDataStore?.message,
        ...dataForMessageAndDataStore,
      })
      .subscribe((response) => {
        if (response) {
          this.created = true;
          this.creating = false;
          setTimeout(() => {
            this.dialogRef.close();
          }, 300);
        }
      });
  }
}
