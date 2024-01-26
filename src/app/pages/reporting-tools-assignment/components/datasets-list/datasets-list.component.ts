import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable} from 'rxjs';
import { Store } from '@ngrx/store';
import { DataSetsService } from 'src/app/core/services/dataset.service';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MessagesDataService } from 'src/app/core/services/messages.service';
import { OuSelectionFormRequestModalComponent } from '../ou-selection-form-request-modal/ou-selection-form-request-modal.component';
import { getCurrentTranslations } from 'src/app/store/selectors/translations.selectors';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-datasets-list',
  templateUrl: './datasets-list.component.html',
  styleUrls: ['./datasets-list.component.css'],
})
export class DatasetsListComponent implements OnInit {
  dataSetsDetails$: Observable<any[]>;
  translations$: Observable<any>;
  pageSize: number = 10;
  page: number = 1;
  itemPerPage: number = 10;
  searchingText: string;
  currentDataSet: any;
  showConfirmButtons: boolean = false;
  updating: boolean = false;
  reasonForCancellingRequest: string;

  @Input() currentUser: any;
  @Input() configurations: any;
  @Input() systemConfigs: any;
  @Input() userSupportDataStoreKeys: any;

  @Output() dataStoreChanged = new EventEmitter<boolean>();

  constructor(
    private dataSetsService: DataSetsService,
    private store: Store<State>,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private dataStoreService: DataStoreDataService,
    private messageService: MessagesDataService
  ) {}

  ngOnInit(): void {
    this.translations$ = this.store.select(getCurrentTranslations);
    this.getDataSetsList();

  }

  getDataSetsList(): void {
    this.dataSetsDetails$ = this.dataSetsService.getDatasetsPaginated(
      {
        page: this.page,
        pageSize: this.pageSize,
        searchingText: this.searchingText,
        userSupportDataStoreKeys: this.userSupportDataStoreKeys,
      },
      this.configurations?.datasetClosedDateAttribute
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  searchDataset(event: any): void {
    this.searchingText = event.target.value;
    this.page = 1;
    this.getDataSetsList();
  }

  getItemsPerPage(event: any, pager: any): void {
    this.pageSize = Number(event.target.value);
    this.page = 1;
    this.itemPerPage = this.pageSize;
    this.getDataSetsList();
  }

  getDataSets(event: Event, actionType, pager: any): void {
    event.stopPropagation();
    this.page = actionType === 'next' ? pager?.page + 1 : pager?.page - 1;
    this.getDataSetsList();
  }

  onRequestDataSet(event: Event, dataSet: any): void {
    event.stopPropagation();
    this.dialog
      .open(OuSelectionFormRequestModalComponent, {
        width: '50%',
        data: {
          dataSet,
          currentUser: this.currentUser,
          configurations: this.configurations,
          systemConfigs: this.systemConfigs,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        this.dataStoreChanged.emit(res);
      });
  }

  onCancelAll(event: Event, dataSetDetails: any, confirm: boolean): void {
    event.stopPropagation();
    this.currentDataSet = dataSetDetails;
    if (confirm) {
      this.showConfirmButtons = false;
      this.updating = true;
      this.messageService
        .getMessagesMatchingTicketNumbers(dataSetDetails?.keys)
        .subscribe((messageResponse) => {
          if (messageResponse) {
            this.dataStoreService
              .deleteAllKeysAndUpdateMessage(
                dataSetDetails?.keys,
                messageResponse,
                this.reasonForCancellingRequest
              )
              .subscribe((response) => {
                if (response) {
                  // TODO: Add support to handle errors
                  this.reasonForCancellingRequest = null;
                  this.updating = false;
                  this.openSnackBar(
                    'Successfully cancelled all requests',
                    'Close'
                  );

                  // this.dataStoreChanged.emit(true);
                  this.getDataSetsList();
                  setTimeout(() => {
                    this._snackBar.dismiss();
                  }, 2000);
                }
              });
          }
        });
    } else {
      this.showConfirmButtons = true;
    }
  }

  onUnConfirm(event: Event): void {
    event.stopPropagation();
    this.showConfirmButtons = false;
  }
}
