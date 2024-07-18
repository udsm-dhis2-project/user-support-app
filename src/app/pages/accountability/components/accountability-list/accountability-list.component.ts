import { Component, Input, OnInit } from '@angular/core';
import { AccountabilityService } from '../../services/accountability.service';
import { map, Observable } from 'rxjs';
import { orderBy } from 'lodash';
import { MatSelectChange } from '@angular/material/select';
import { getStartAndEndDatesUsingQuarter } from 'src/app/core/helpers/format-dates.helper';

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

  constructor(private accountabilityService: AccountabilityService) {}

  ngOnInit(): void {}

  getAccountabilityData(): void {
    this.responsibilityPayload$ = this.accountabilityService
      .getUsersAndMessageConversations(this.userGroup?.id, this.selectedPeriod)
      .pipe(map((response: any) => orderBy(response, ['count'], ['desc'])));
  }

  onPeriodChange(event: MatSelectChange): void {
    const quarter = event.value;
    this.selectedPeriod = getStartAndEndDatesUsingQuarter(
      quarter,
      new Date().getFullYear()
    );
    this.getAccountabilityData();
  }
}
