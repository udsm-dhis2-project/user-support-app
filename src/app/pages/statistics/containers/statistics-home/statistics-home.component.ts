import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SqlViewsService } from 'src/app/core/services/sql-views.service';
import { DataModalComponent } from '../../components/data-modal/data-modal.component';

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
    private dialog: MatDialog
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
    this.dialog.open(DataModalComponent, {
      width: '70%',
      data,
    });
  }
}
