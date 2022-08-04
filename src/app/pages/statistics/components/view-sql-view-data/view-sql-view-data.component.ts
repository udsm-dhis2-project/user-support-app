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
    console.log('key', this.keys);
    const x = {
      data: [
        { key: 'id', value: 'zxKtX2rIQha' },
        { key: 'code', value: '121017-8' },
        { key: 'facilityname', value: 'AFYACHECK Other Clinic' },
        { key: 'councilname', value: 'Mbeya City Council' },
        { key: 'regionname', value: 'Mbeya Region' },
        { key: 'created', value: '2022-03-10T13:14:37.855' },
        { key: 'lastupdated', value: '2022-03-10T13:14:37.978' },
        { key: 'Ownership', value: 'Private' },
        { key: 'Type', value: 'Clinics' },
      ],
      duplicateReference: 'Mbeya City Council-AFYACHECK Other Clinic',
    };
  }
}
