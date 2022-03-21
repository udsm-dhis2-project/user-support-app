import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ReportingToolsService } from 'src/app/core/services/reporting-tools.service';
import { OrgUnitLevelsModel } from 'src/app/shared/models/organisation-units.model';
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
  @Input() orgUnitLevels: OrgUnitLevelsModel;
  @Output() dataStoreChanged = new EventEmitter<true>();
  searchingText: string;
  reportingToolsResponse$: Observable<ReportingToolsResponseModel>;
  pageCount: number = 10;
  lowestLevel: number;
  constructor(
    private reportingToolsService: ReportingToolsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.lowestLevel = this.orgUnitLevels[0]?.level;
    let currentPage;
    currentPage = localStorage.getItem('currentFacilityListPage');
    if (Number(currentPage)) {
      currentPage = 1;
    }
    localStorage.setItem('currentFacilityListPage', '1');
    this.reportingToolsResponse$ =
      this.reportingToolsService.getFacilitiesWithNumberOfDataSets(
        this.currentUser?.organisationUnits[0]?.id,
        this.lowestLevel,
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
        this.lowestLevel,
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
        this.lowestLevel,
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
    systemConfigs: SystemConfigsModel,
    currentUser: any
  ): void {
    event.stopPropagation();
    this.dialog
      .open(RequestFormModalComponent, {
        width: '50%',
        data: {
          facility: dataRow,
          userSupportKeys,
          systemConfigs,
          currentUser,
        },
      })
      .afterClosed()
      .subscribe((response) => {
        this.dataStoreChanged.emit(true);
      });
  }

  getItemsPerPage(event: any, paginationDetails: PaginationModel): void {
    this.pageCount = Number(event.target.value);
    const currentPage = paginationDetails?.page;
    this.reportingToolsResponse$ =
      this.reportingToolsService.getFacilitiesWithNumberOfDataSets(
        this.currentUser?.organisationUnits[0]?.id,
        this.lowestLevel,
        currentPage,
        this.pageCount,
        this.searchingText,
        this.userSupportKeys
      );
  }
}
