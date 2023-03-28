import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SqlViewsService } from 'src/app/core/services/sql-views.service';

@Component({
  selector: 'app-statistics-home',
  templateUrl: './statistics-home.component.html',
  styleUrls: ['./statistics-home.component.css'],
})
export class StatisticsHomeComponent implements OnInit {
  sqlViewResponse$: Observable<any>;
  nmcpFacilitiesReportedViaOldForm$: Observable<any>;
  constructor(
    private sqlViewService: SqlViewsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sqlViewResponse$ = this.sqlViewService.getSqlViewByParameters({
      id: 'Djy3poKG8Vd',
      pagination: { paging: false },
    });
    this.nmcpFacilitiesReportedViaOldForm$ =
      this.sqlViewService.getSqlViewByParameters({
        id: 'Q9Rj5hAdqiv',
        pagination: { paging: false },
      });
  }

  onView(event: Event, data): void {
    event.stopPropagation();
    console.log(data);
    this.router.navigate([`statistics/view/${data?.sqlView?.id}`]);
    // this.dialog.open(DataModalComponent, {
    //   width: '70%',
    //   data,
    // });
  }
}
