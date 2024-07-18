import { Component, Input, OnInit } from '@angular/core';
import { AccountabilityService } from '../../services/accountability.service';
import { map, Observable, of } from 'rxjs';
import { orderBy, sortBy } from 'lodash';
import { MatSelectChange } from '@angular/material/select';
import {
  getStartAndEndDatesUsingQuarter,
  getYears,
} from 'src/app/core/helpers/format-dates.helper';

@Component({
  selector: 'app-accountability-list',
  templateUrl: './accountability-list.component.html',
  styleUrl: './accountability-list.component.css',
})
export class AccountabilityListComponent implements OnInit {
  @Input() userGroup: { id: string; name: string };
  @Input() currentUser: any;
  responsibilityPayload$: Observable<any>;
  selectedPeriod: any;
  years: number[];
  selectedYear: number = new Date().getFullYear();
  selectedQuarter: string;

  constructor(private accountabilityService: AccountabilityService) {}

  ngOnInit(): void {
    this.years = getYears(2012);
  }

  getAccountabilityData(selectedPeriod: any): void {
    this.responsibilityPayload$ = of(null);
    this.responsibilityPayload$ = this.accountabilityService
      .getUsersAndMessageConversations(this.userGroup?.id, selectedPeriod)
      .pipe(map((response: any) => orderBy(response, ['count'], ['desc'])));
  }

  onYearChange(event: MatSelectChange): void {
    this.selectedYear = event.value;

    if (this.selectedQuarter) {
      this.selectedPeriod = getStartAndEndDatesUsingQuarter(
        this.selectedQuarter,
        this.selectedYear
      );
      this.getAccountabilityData(this.selectedPeriod);
    }
  }

  onPeriodChange(event: MatSelectChange): void {
    this.selectedQuarter = event.value;
    this.selectedPeriod = getStartAndEndDatesUsingQuarter(
      this.selectedQuarter,
      this.selectedYear
    );
    this.getAccountabilityData(this.selectedPeriod);
  }
}
