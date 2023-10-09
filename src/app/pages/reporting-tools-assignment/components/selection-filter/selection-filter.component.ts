import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { mergeOusAddedAndRemovedFromDataSet } from 'src/app/shared/helpers/merge-assigned-ous.helpers';

@Component({
  selector: 'app-selection-filter',
  templateUrl: './selection-filter.component.html',
  styleUrls: ['./selection-filter.component.css'],
})
export class SelectionFilterComponent implements OnInit {
  @Input() reportingToolDetails: any;
  @Input() allDataForUserSupport: any[];
  /** For Org Unit Filter */
  orgUnitObject: any;
  orgUnitFilterConfig: any = {
    singleSelection: false,
    showOrgUnitLevelGroupSection: false,
    showUserOrgUnitSection: false,
    reportUse: false,
    emitOnSelection: true,
    hideActionButtons: true,
    minLevel: 4,
  };
  selectedOrgUnitItems: any[];
  @Output() selectedOus: EventEmitter<string[]> = new EventEmitter<string[]>();
  constructor() {}

  ngOnInit(): void {
    this.selectedOrgUnitItems = mergeOusAddedAndRemovedFromDataSet(
      this.reportingToolDetails,
      this.allDataForUserSupport
    );
    this.selectedOus.emit(this.selectedOrgUnitItems);
  }

  onOrgUnitUpdate(selection: any, action: string): void {
    this.selectedOrgUnitItems = selection?.items;
    this.selectedOus.emit(this.selectedOrgUnitItems);
  }
}
