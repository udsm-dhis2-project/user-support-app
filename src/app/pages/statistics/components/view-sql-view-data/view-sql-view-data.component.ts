import { Component, Input, OnInit } from '@angular/core';
import { formatSQLData } from 'src/app/core/helpers/format-sql-data.helpers';

@Component({
  selector: 'app-view-sql-view-data',
  templateUrl: './view-sql-view-data.component.html',
  styleUrls: ['./view-sql-view-data.component.css'],
})
export class ViewSqlViewDataComponent implements OnInit {
  @Input() data: any;
  formattedSQLViewData: any;
  keys: string[];
  constructor() {}

  ngOnInit(): void {
    this.formattedSQLViewData = formatSQLData(this.data?.listGrid || {});
    this.keys = Object.keys(this.formattedSQLViewData?.groupedRows);
  }
}
