import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SqlViewsService } from 'src/app/core/services/sql-views.service';

@Component({
  selector: 'app-sql-view-data',
  templateUrl: './sql-view-data.component.html',
  styleUrls: ['./sql-view-data.component.css'],
})
export class SqlViewDataComponent implements OnInit {
  sqlViewId: string;
  sqlViewResponse$: any;
  constructor(
    private activateRoute: ActivatedRoute,
    private sqlViewService: SqlViewsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sqlViewId = this.activateRoute.snapshot.params['id'];
    this.sqlViewResponse$ = this.sqlViewService.getSqlViewByParameters({
      id: this.sqlViewId,
      pagination: { paging: false },
    });
  }

  onGetBackToList(event: Event): void {
    event.stopPropagation();
    this.router.navigate([`statistics`]);
  }

  downloadTableToExcel(event: Event, id: string, fileName: string): void {
    event.stopPropagation();
    const htmlTable = document.getElementById(id).outerHTML;
    if (htmlTable) {
      const uri = 'data:application/vnd.ms-excel;base64,',
        template =
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:' +
          'office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook>' +
          '<x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/>' +
          '</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
          '</head><body><table border="1">{table}</table><br /><table border="1">{table}</table></body></html>',
        base64 = (s) => window.btoa(unescape(encodeURIComponent(s))),
        format = (s, c) => s.replace(/{(\w+)}/g, (m, p) => c[p]);

      const ctx = { worksheet: 'List', filename: fileName };
      let str =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office' +
        ':excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook>' +
        '<x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/>' +
        '</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
      ctx['div'] = htmlTable;

      str += '{div}</body></html>';
      const link = document.createElement('a');
      link.download = fileName + '.xls';
      link.href = uri + base64(format(str, ctx));
      link.click();
    }
  }
}
