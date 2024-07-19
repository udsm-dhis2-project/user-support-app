import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';

@Component({
  selector: 'app-request-indicator-modal',
  templateUrl: './request-indicator-modal.component.html',
  styleUrl: './request-indicator-modal.component.css',
})
export class RequestIndicatorModalComponent implements OnInit {
  requesting: boolean = false;
  indicator: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RequestIndicatorModalComponent>,
    private messageAndDataStoreService: MessagesAndDatastoreService
  ) {}

  ngOnInit(): void {
    // console.log(this.data);
    this.indicator = this.data?.indicator;
  }

  onConfirm(event: Event, indicator: any): void {
    event.stopPropagation();
    this.requesting = true;

    const dataStoreKey = 'IND' + Date.now();
    // Check potentialUserNames first
    const dataForMessageAndDataStore = {
      id: dataStoreKey,
      ticketNumber: 'IND' + Date.now().toString(),
      action: `Respond to ${
        indicator?.id ? 'Updates on' : 'creation of '
      } Indicator ${indicator?.name} as requested by ${
        this.data?.currentUser?.displayName
      }`,
      message: {
        message: `User ${this.data?.currentUser?.displayName} has requested  ${
          indicator?.id ? 'Updates ' : 'creation '
        } of Indicator: ${
          indicator?.name
        }. \n\nThe details of the indicator are: \n\n Name: ${
          indicator?.name
        } \n Shortname: ${indicator?.shortName} 
        \n Indicator type: ${indicator?.indicatorType?.name} \n Description: ${
          indicator?.description
        }\n Numerator: ${indicator?.numeratorDescription} [ ${
          this.data?.expressionDescriptionNum
        } ]  \n Denominator: ${indicator?.denominatorDescription} [ ${
          this.data?.expressionDescriptionDen
        } ]`,
        htmlMessage: `User ${this.data?.currentUser?.displayName} has requested indicator: ${indicator?.name}. <br /><br /> The details of the indicator are: <br /><br /> Name: ${indicator?.name}   <br /> Shortname: ${indicator?.shortName} <br /> Indicator type: ${indicator?.indicatorType?.name}<br /> Numerator: ${indicator?.numeratorDescription} [${this.data?.expressionDescriptionNum} ]  <br /> Denominator: ${indicator?.denominatorDescription} [ ${this.data?.expressionDescriptionDen} ]`,
        subject: 'VR' + Date.now().toString() + ' - VALIDATION RULE REQUEST',
      },
      replyMessage: `Indicator ${indicator?.name} has been approved successfully. You can now to proceed to use the indicator`,
      payload: indicator,
      url: indicator?.id ? `indicators/${indicator?.id}` : 'indicators',
      method: indicator?.id ? 'PUT' : 'POST',
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
          this.requesting = false;
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 300);
        }
      });
  }
}
