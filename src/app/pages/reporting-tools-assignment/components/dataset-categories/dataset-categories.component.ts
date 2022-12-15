import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportingToolsService } from 'src/app/core/services/reporting-tools.service';
import { omit } from 'lodash';

@Component({
  selector: 'app-dataset-categories',
  templateUrl: './dataset-categories.component.html',
  styleUrls: ['./dataset-categories.component.css'],
})
export class DatasetCategoriesComponent implements OnInit {
  @Input() organisationUnit: any;
  @Input() categoryOptions: any[];
  categoriesData$: Observable<any>;
  @Output() categoryOptionsUpdateInfo: EventEmitter<any> =
    new EventEmitter<any>();
  selections: any = {};
  constructor(private reportingToolsService: ReportingToolsService) {}

  ngOnInit(): void {
    this.categoriesData$ = this.reportingToolsService.getCategoryOptionsDetails(
      this.categoryOptions
    );
  }

  getSelectedOption(
    selected: boolean,
    option: any,
    categoryOptionInfo: any
  ): void {
    const matchedOrgUnit =
      (categoryOptionInfo?.categoryOption?.organisationUnits?.filter(
        (ou) => ou?.id === this.organisationUnit?.id
      ) || [])[0];
    const categoryOptionId = option?.id;
    if (!selected) {
      if (!matchedOrgUnit) {
        this.selections = omit(this.selections, categoryOptionId);
      } else {
        this.selections[option?.id] = {
          additions: [
            ...((this.selections[option?.id]?.additions || [])?.filter(
              (addition) => addition?.id !== this.organisationUnit?.id
            ) || []),
          ],
          deletions: [
            ...(this.selections[option?.id]?.deletions || []),
            { id: this.organisationUnit?.id },
          ],
          catetoryOption: option,
        };
      }
    } else {
      this.selections[option?.id] = {
        additions: !matchedOrgUnit
          ? [
              ...(this.selections[option?.id]?.additions || []),
              { id: this.organisationUnit?.id },
            ]
          : this.selections[option?.id]?.additions || [],
        deletions: [
          ...((this.selections[option?.id]?.deletions || [])?.filter(
            (deletion) => deletion?.id != this.organisationUnit?.id
          ) || []),
        ],
        categoryOption: option,
      };
    }
    this.categoryOptionsUpdateInfo.emit(this.selections);
  }
}
