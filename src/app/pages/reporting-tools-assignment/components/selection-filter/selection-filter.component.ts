import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-selection-filter',
  templateUrl: './selection-filter.component.html',
  styleUrls: ['./selection-filter.component.css'],
})
export class SelectionFilterComponent implements OnInit {
  @Input() dataSetDetails: any;
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
    this.selectedOrgUnitItems = this.dataSetDetails?.organisationUnits;
    this.selectedOus.emit(this.selectedOrgUnitItems);
  }

  onOrgUnitUpdate(selection: any, action: string): void {
    this.selectedOrgUnitItems = selection?.items;
    this.selectedOus.emit(this.selectedOrgUnitItems);
  }
}
