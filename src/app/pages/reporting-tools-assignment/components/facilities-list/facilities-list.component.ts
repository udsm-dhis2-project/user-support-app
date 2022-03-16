import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ReportingToolsService } from 'src/app/core/services/reporting-tools.service';
import {
  FacilitiesWithNumberOfDatasets,
  PaginationModel,
  ReportingToolsResponseModel,
} from 'src/app/shared/models/reporting-tools.models';
import { SystemConfigsModel } from 'src/app/shared/models/system-configurations.model';
import { RequestFormModalComponent } from '../request-form-modal/request-form-modal.component';
@Component({
  selector: 'app-facilities-list',
  templateUrl: './facilities-list.component.html',
  styleUrls: ['./facilities-list.component.css'],
})
export class FacilitiesListComponent implements OnInit {
  @Input() currentUser: any;
  @Input() userSupportKeys: string[];
  @Input() configurations: any;
  @Input() systemConfigs: SystemConfigsModel;
  @Output() dataStoreChanged = new EventEmitter<true>();
  searchingText: string;
  reportingToolsResponse$: Observable<ReportingToolsResponseModel>;
  pageCount: number = 10;
  constructor(
    private reportingToolsService: ReportingToolsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let currentPage;
    currentPage = localStorage.getItem('currentFacilityListPage');
    if (Number(currentPage)) {
      currentPage = 1;
    }
    localStorage.setItem('currentFacilityListPage', '1');
    this.reportingToolsResponse$ =
      this.reportingToolsService.getFacilitiesWithNumberOfDataSets(
        this.currentUser?.organisationUnits[0]?.id,
        4,
        Number(currentPage),
        this.pageCount,
        null,
        this.userSupportKeys
      );
  }

  searchFacility(event: any): void {
    this.searchingText = event.target.value;
    this.reportingToolsResponse$ =
      this.reportingToolsService.getFacilitiesWithNumberOfDataSets(
        this.currentUser?.organisationUnits[0]?.id,
        4,
        1,
        this.pageCount,
        this.searchingText,
        this.userSupportKeys
      );
  }

  getFacilities(
    event: Event,
    type: string,
    paginationDetails: PaginationModel
  ): void {
    event.stopPropagation();
    const currentPage =
      type === 'next'
        ? paginationDetails?.page + 1
        : paginationDetails?.page - 1;
    localStorage.setItem('currentFacilityListPage', currentPage.toString());
    this.reportingToolsResponse$ =
      this.reportingToolsService.getFacilitiesWithNumberOfDataSets(
        this.currentUser?.organisationUnits[0]?.id,
        4,
        currentPage,
        this.pageCount,
        this.searchingText,
        this.userSupportKeys
      );
  }

  openRequestFormModal(
    event: Event,
    dataRow: FacilitiesWithNumberOfDatasets,
    userSupportKeys: String[],
    systemConfigs: SystemConfigsModel
  ): void {
    event.stopPropagation();
    this.dialog
      .open(RequestFormModalComponent, {
        width: '50%',
        data: {
          facility: dataRow,
          userSupportKeys,
          systemConfigs,
        },
      })
      .afterClosed()
      .subscribe((response) => {
        this.dataStoreChanged.emit(true);
      });
  }
}
