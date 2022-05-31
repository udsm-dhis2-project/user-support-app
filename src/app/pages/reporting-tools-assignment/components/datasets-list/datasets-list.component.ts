import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataSetsService } from 'src/app/core/services/dataset.service';

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
  constructor(private dataSetsService: DataSetsService) {}

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
}
