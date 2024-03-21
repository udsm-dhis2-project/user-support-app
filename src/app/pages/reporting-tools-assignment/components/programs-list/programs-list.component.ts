import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgramsService } from 'src/app/core/services/programs.service';
import { MatDialog } from '@angular/material/dialog';
import { OuSelectionFormRequestModalComponent } from '../ou-selection-form-request-modal/ou-selection-form-request-modal.component';
import { MessagesDataService } from 'src/app/core/services/messages.service';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  Store } from '@ngrx/store';
import { State } from 'src/app/store/reducers';
import { getCurrentTranslations } from 'src/app/store/selectors/translations.selectors';

@Component({
  selector: 'app-programs-list',
  templateUrl: './programs-list.component.html',
  styleUrls: ['./programs-list.component.css'],
})
export class ProgramsListComponent implements OnInit {
  programsDetails$: Observable<any[]>;
  translations$: Observable<any[]>;
  pageSize: number = 10;
  page: number = 1;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 25, 50, 100, 200];
  searchingText: string;
  currentProgram: any;
  showConfirmButtons: boolean = false;
  updating: boolean = false;
  reasonForCancellingRequest: string;
  currentOrgUnit: any;


  @Input() currentUser: any;
  @Input() configurations: any;
  @Input() systemConfigs: any;
  @Input() userSupportDataStoreKeys: any;

  @Output() dataStoreChanged: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(
    private programsService: ProgramsService,
    private dialog: MatDialog,
    private messageService: MessagesDataService,
    private dataStoreService: DataStoreDataService,
    private _snackBar: MatSnackBar,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.translations$ = this.store.select(getCurrentTranslations);
    this.getPrograms();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  getPrograms(): void {
    this.programsDetails$ = this.programsService.getPrograms({
      page: this.page,
      pageSize: this.pageSize,
      searchingText: this.searchingText,
      userSupportDataStoreKeys: this.userSupportDataStoreKeys,
    });
  }

  searchProgram(event: any): void {
    this.searchingText = (event?.target as any)?.value;
    this.getPrograms();
  }

  getProgramsList(event: any): void {
    this.pageIndex = event.pageIndex;
    this.page = event.pageIndex + 1;
    this.pageSize = Number(event?.pageSize);
    this.getPrograms();
  }

  onRequestProgram(event: Event, reportingTool: any): void {
    event.stopPropagation();
    this.dialog
      .open(OuSelectionFormRequestModalComponent, {
        width: '50%',
        data: {
          reportingTool,
          type: 'program',
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

  onCancelAll(
    event: Event,
    currentProgramDetails: any,
    confirm: boolean
  ): void {
    event.stopPropagation();
    this.currentProgram = currentProgramDetails;
    if (confirm) {
      this.showConfirmButtons = false;
      this.updating = true;
      this.messageService
        .getMessagesMatchingTicketNumbers(currentProgramDetails?.keys)
        .subscribe((messageResponse) => {
          if (messageResponse) {
            this.dataStoreService
              .deleteAllKeysAndUpdateMessage(
                currentProgramDetails?.keys,
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
                  this.getPrograms();
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
