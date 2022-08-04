import { Component, Input, OnInit } from '@angular/core';
import { formatSQLData } from 'src/app/core/helpers/format-sql-data.helpers';

@Component({
  selector: 'app-sqlview-count-data',
  templateUrl: './sqlview-count-data.component.html',
  styleUrls: ['./sqlview-count-data.component.css'],
})
export class SqlviewCountDataComponent implements OnInit {
  @Input() data: any;
  formattedData: any;
  count: number = 0;
  constructor() {}

  ngOnInit(): void {
    this.formattedData = formatSQLData(this.data);
    this.count = Object.keys(this.formattedData?.groupedRows).length;
  }
}
