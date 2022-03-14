import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ReportingToolsService } from 'src/app/core/services/reporting-tools.service';
import {
  FacilitiesWithNumberOfDatasets,
  PaginationModel,
  ReportingToolsResponseModel,
} from 'src/app/shared/models/reporting-tools.models';
import { RequestFormModalComponent } from '../request-form-modal/request-form-modal.component';
@Component({
  selector: 'app-facilities-list',
  templateUrl: './facilities-list.component.html',
  styleUrls: ['./facilities-list.component.css'],
})
export class FacilitiesListComponent implements OnInit {
  @Input() currentUser: any;
  searchingText: string;
  reportingToolsResponse$: Observable<ReportingToolsResponseModel>;
  constructor(
    private reportingToolsService: ReportingToolsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.reportingToolsResponse$ =
      this.reportingToolsService.getFacilitiesWithNumberOfDataSets(
        this.currentUser?.organisationUnits[0]?.id,
        4,
        1,
        10,
        null
      );
  }

  searchFacility(event: any): void {
    this.searchingText = event.target.value;
    this.reportingToolsResponse$ =
      this.reportingToolsService.getFacilitiesWithNumberOfDataSets(
        this.currentUser?.organisationUnits[0]?.id,
        4,
        1,
        10,
        this.searchingText
      );
  }

  getFacilities(
    event: Event,
    type: string,
    paginationDetails: PaginationModel
  ): void {
    event.stopPropagation();
    this.reportingToolsResponse$ =
      this.reportingToolsService.getFacilitiesWithNumberOfDataSets(
        this.currentUser?.organisationUnits[0]?.id,
        4,
        type === 'next'
          ? paginationDetails?.page + 1
          : paginationDetails?.page - 1,
        10,
        this.searchingText
      );
  }

  openRequestFormModal(
    event: Event,
    dataRow: FacilitiesWithNumberOfDatasets
  ): void {
    event.stopPropagation();
    this.dialog.open(RequestFormModalComponent, {
      width: '50%',
      data: {
        facility: dataRow,
      },
    });
  }
}
