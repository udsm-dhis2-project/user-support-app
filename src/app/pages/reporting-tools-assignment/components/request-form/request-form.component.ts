import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { mergeDataSetsWithAssignedOnes } from 'src/app/shared/helpers/merge-assigned-datasets.helper';
import {
  DataSets,
  FacilityModel,
} from 'src/app/shared/models/reporting-tools.models';
import { keyBy } from 'lodash';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import {
  constructMessageForFacilityAssignment,
  getDataStoreDetailsForFormRequests,
} from 'src/app/shared/helpers/construct-message.helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessagesAndDatastoreService } from 'src/app/core/services/messages-and-datastore.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css'],
})
export class RequestFormComponent implements OnInit {
  @Input() assignedReportingTools: DataSets[];
  @Input() reportingTools: DataSets[];
  @Input() userSupportKeys: string[];
  @Input() facility: FacilityModel;
  @Input() dataStoreMessageDetails: any[];
  @Input() dataSetAttributesData: any;
  @Input() keywordsKeys: any;
  mergedReportingTools: DataSets[];
  @Output() assignmentDetails = new EventEmitter<any>();
  searchingText: string;
  showConfirmingButtons: boolean = false;
  currentDataset: DataSets;
  updatingRequest: boolean = false;

  attributeBasedDataSetSelections: any = {};
  categoriesHasAssignedOu: any = {};
  constructor(
    private dataStoreService: DataStoreDataService,
    private messageAndDataStoreService: MessagesAndDatastoreService,
    private _snackBar: MatSnackBar
  ) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnInit(): void {
    this.mergedReportingTools = mergeDataSetsWithAssignedOnes(
      this.assignedReportingTools,
      this.reportingTools,
      this.dataStoreMessageDetails
    );
    this.assignedReportingTools = this.mergedReportingTools;
  }

  getIfHasAssignedOuForCategories(
    categoriesHasAssignedOu: boolean,
    dataSet: any
  ): void {
    this.categoriesHasAssignedOu[dataSet?.id] = categoriesHasAssignedOu;
  }

  toggleAssignment(
    event: Event,
    dataSetDetails: DataSets,
    mergedReportingTools: DataSets[],
    action: string
  ): void {
    event.stopPropagation();
    this.mergedReportingTools = mergedReportingTools.map((dataSet) => {
      // console.log('DATASET', dataSet);
      return {
        ...dataSet,
        assigned:
          dataSet?.id === dataSetDetails?.id && action === 'Remove'
            ? false
            : dataSet?.id === dataSetDetails?.id &&
              (action === 'Assign' || action === 'Update')
            ? true
            : dataSet?.assigned,
      };
    });
    const keyedassignedReportingTools = keyBy(
      this.assignedReportingTools,
      'id'
    );
    const assignmentData = {
      deletions:
        (
          this.mergedReportingTools?.filter(
            (reportingTool: any) =>
              reportingTool?.type?.toLowerCase() === 'dataset'
          ) || []
        )?.filter(
          (dataSet) =>
            keyedassignedReportingTools[dataSet?.id]?.assigned &&
            !dataSet?.assigned
        ) || [],
      additions:
        (
          this.mergedReportingTools?.filter(
            (reportingTool: any) =>
              reportingTool?.type?.toLowerCase() === 'dataset'
          ) || []
        )?.filter(
          (dataSet) =>
            (!keyedassignedReportingTools[dataSet?.id]?.assigned ||
              (action === 'Update' && dataSet?.id === dataSetDetails?.id)) &&
            dataSet?.assigned
        ) || [],
      programs: {
        deletions:
          (
            this.mergedReportingTools?.filter(
              (reportingTool: any) =>
                reportingTool?.type?.toLowerCase() === 'program'
            ) || []
          )?.filter(
            (dataSet) =>
              keyedassignedReportingTools[dataSet?.id]?.assigned &&
              !dataSet?.assigned
          ) || [],
        additions:
          (
            this.mergedReportingTools?.filter(
              (reportingTool: any) =>
                reportingTool?.type?.toLowerCase() === 'program'
            ) || []
          )?.filter((dataSet) => {
            if (
              !keyedassignedReportingTools[dataSet?.id]?.assigned &&
              dataSet?.assigned
            ) {
              return dataSet;
            }
          }) || [],
      },
      assigned: this.mergedReportingTools.filter(
        (dataSet) => dataSet?.assigned
      ),
      dataSetAttributesData:
        this.attributeBasedDataSetSelections[dataSetDetails?.id],
    };

    // console.log('assignmentData', assignmentData);
    this.assignmentDetails.emit(assignmentData);
  }

  onCancelRequest(
    event: Event,
    requestDetails: any,
    mergedReportingTools: DataSets[],
    confirm: boolean
  ): void {
    event.stopPropagation();
    this.currentDataset = requestDetails;
    if (confirm) {
      this.showConfirmingButtons = false;
      this.updatingRequest = true;
      // Update the cancelled request
      this.mergedReportingTools = mergedReportingTools.map((dataSet) => {
        return {
          ...dataSet,
          assigned:
            requestDetails?.id === dataSet?.id
              ? requestDetails?.assigned
              : dataSet?.assigned,
          hasPendingRequest:
            requestDetails?.id === dataSet?.id
              ? false
              : dataSet?.hasPendingRequest,
        };
      });
      const newPayload = {
        deletions:
          requestDetails?.details?.payload?.deletions?.length > 0
            ? requestDetails?.details?.payload?.deletions.filter(
                (deletion) => deletion?.id !== requestDetails?.id
              ) || []
            : [],
        additions:
          requestDetails?.details?.payload?.additions?.length > 0
            ? requestDetails?.details?.payload?.additions.filter(
                (addition) => addition?.id !== requestDetails?.id
              ) || []
            : [],
      };
      setTimeout(() => {
        this.showConfirmingButtons = false;
      }, 1000);
      const assignmentDetails = {
        ...newPayload,
        organisationUnit: this.facility,
        ticketNumber: requestDetails?.details?.ticketNumber,
      };
      const message = constructMessageForFacilityAssignment(
        assignmentDetails,
        this.keywordsKeys
      );
      const messageData = {
        subject: requestDetails?.details?.message?.subject,
        messageType: 'TICKET',
        text:
          (this.keywordsKeys && this.keywordsKeys['messageChangePrefixKey']
            ? this.keywordsKeys['messageChangePrefixKey']
            : 'Kuna mabadiliko') +
          ', \n\n' +
          message?.message,
        message:
          (this.keywordsKeys && this.keywordsKeys['messageChangePrefixKey']
            ? this.keywordsKeys['messageChangePrefixKey']
            : 'Kuna mabadiliko') +
          ', \n\n' +
          message?.message,
      };

      const dataStorePayload = getDataStoreDetailsForFormRequests(
        assignmentDetails,
        this.keywordsKeys
      );
      if (dataStorePayload) {
        const data = {
          ...requestDetails?.details,
          message: messageData,
          ticketNumber: requestDetails?.details?.ticketNumber,
          ...dataStorePayload,
          payload: newPayload,
        };

        // TODO: Handle error on update

        this.messageAndDataStoreService
          .searchMessageConversationByTicketNumber(
            requestDetails?.details?.ticketNumber
          )
          .subscribe((messageConversationResponse) => {
            if (
              messageConversationResponse &&
              messageConversationResponse?.id
            ) {
              this.dataStoreService
                .updateKeyAndCreateMessage(data?.id, data, {
                  text:
                    (this.keywordsKeys &&
                    this.keywordsKeys['messageChangePrefixKey']
                      ? this.keywordsKeys['messageChangePrefixKey']
                      : 'Kuna mabadiliko') +
                    ', \n\n' +
                    data?.message?.text,
                  id: messageConversationResponse?.id,
                })
                .subscribe((response) => {
                  if (response) {
                    this.updatingRequest = false;
                    this.openSnackBar('Successfully updated request', 'Close');
                    setTimeout(() => {
                      this._snackBar.dismiss();
                    }, 2000);
                  }
                });
            }
          });
      } else {
        this.updatingRequest = false;
        this.openSnackBar('The request miss important information', 'Close');
        setTimeout(() => {
          this._snackBar.dismiss();
        }, 2000);
      }
    } else {
      this.showConfirmingButtons = true;
    }
  }

  onUnConfirm(event: Event): void {
    event.stopPropagation();
    this.showConfirmingButtons = false;
  }

  onGetCategoryOptionsUpdateInfo(selections: any, dataSet: any): void {
    const validSelections =
      Object.keys(selections)
        ?.map((key) => {
          if (
            selections[key]?.additions?.length > 0 ||
            selections[key]?.deletions?.length > 0
          ) {
            return { ...selections[key], dataSet };
          }
        })
        ?.filter((selection) => selection) || [];
    this.attributeBasedDataSetSelections[dataSet?.id] =
      validSelections?.length > 0 ? validSelections : null;
  }
}
