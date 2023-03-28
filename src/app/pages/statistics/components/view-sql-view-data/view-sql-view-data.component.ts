import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { formatSQLData } from 'src/app/core/helpers/format-sql-data.helpers';
import { DataModalComponent } from '../data-modal/data-modal.component';

@Component({
  selector: 'app-view-sql-view-data',
  templateUrl: './view-sql-view-data.component.html',
  styleUrls: ['./view-sql-view-data.component.css'],
})
export class ViewSqlViewDataComponent implements OnInit {
  @Input() data: any;
  formattedSQLViewData: any;
  keys: string[];
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.formattedSQLViewData = formatSQLData(this.data?.listGrid || {});
    this.keys = Object.keys(this.formattedSQLViewData?.groupedRows);
  }

  onViewData(event: Event, data: any): void {
    event.stopPropagation();
    this.dialog.open(DataModalComponent, {
      width: '60%',
      data,
    });
  }
}
