import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataSetsService } from 'src/app/core/services/dataset.service';
import { OuSelectionFormRequestModalComponent } from '../ou-selection-form-request-modal/ou-selection-form-request-modal.component';

@Component({
  selector: 'app-datasets-list',
  templateUrl: './datasets-list.component.html',
  styleUrls: ['./datasets-list.component.css'],
})
export class DatasetsListComponent implements OnInit {
  dataSetsDetails$: Observable<any[]>;
  pageSize: number = 10;
  page: number = 1;
  itemPerPage: number = 10;
  searchingText: string;

  @Input() currentUser: any;
  @Input() configurations: any;
  @Input() systemConfigs: any;

  constructor(
    private dataSetsService: DataSetsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataSetsDetails$ = this.dataSetsService.getDatasetsPaginated({
      page: this.page,
      pageSize: this.pageSize,
    });
  }

  searchDataset(event: any): void {
    this.searchingText = event.target.value;
    this.page = 1;
    this.dataSetsDetails$ = this.dataSetsService.getDatasetsPaginated({
      page: this.page,
      pageSize: this.pageSize,
      searchingText: this.searchingText,
    });
  }

  getItemsPerPage(event: any, pager: any): void {
    this.pageSize = Number(event.target.value);
    this.page = 1;
    this.itemPerPage = this.pageSize;
    this.dataSetsDetails$ = this.dataSetsService.getDatasetsPaginated({
      page: this.page,
      pageSize: this.pageSize,
    });
  }

  getDataSets(event: Event, actionType, pager: any): void {
    event.stopPropagation();
    this.page = actionType === 'next' ? pager?.page + 1 : pager?.page - 1;
    this.dataSetsDetails$ = this.dataSetsService.getDatasetsPaginated({
      page: this.page,
      pageSize: this.pageSize,
    });
  }

  onRequestDataSet(event: Event, dataSet: any): void {
    event.stopPropagation();
    this.dialog
      .open(OuSelectionFormRequestModalComponent, {
        width: '50%',
        data: {
          dataSet,
          currentUser: this.currentUser,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        this.dataSetsDetails$ = this.dataSetsService.getDatasetsPaginated({
          page: this.page,
          pageSize: this.pageSize,
        });
      });
  }
}
