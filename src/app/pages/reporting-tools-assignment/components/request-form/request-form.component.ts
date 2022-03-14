import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { mergeDataSetsWithAssignedOnes } from 'src/app/shared/helpers/merge-assigned-datasets.helper';
import { DataSets } from 'src/app/shared/models/reporting-tools.models';
import { keyBy } from 'lodash';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css'],
})
export class RequestFormComponent implements OnInit {
  @Input() assignedDataSets: DataSets[];
  @Input() allDataSets: DataSets[];
  mergedDataSets: DataSets[];
  @Output() assignmentDetails = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.mergedDataSets = mergeDataSetsWithAssignedOnes(
      this.assignedDataSets,
      this.allDataSets
    );
    this.assignedDataSets = this.mergedDataSets;
  }

  toggleAssignment(
    event: Event,
    facility: DataSets,
    mergedDataSets: DataSets[],
    action: string
  ): void {
    event.stopPropagation();
    this.mergedDataSets = mergedDataSets.map((dataSet) => {
      return {
        ...dataSet,
        assigned:
          dataSet?.id === facility?.id && action === 'Remove'
            ? false
            : dataSet?.id === facility?.id && action === 'Assign'
            ? true
            : dataSet?.assigned,
      };
    });
    const keyedAssignedDatasets = keyBy(this.assignedDataSets, 'id');
    const assignmentData = {
      deletions: this.mergedDataSets.filter(
        (dataSet) =>
          keyedAssignedDatasets[dataSet?.id]?.assigned && !dataSet?.assigned
      ),
      additions: this.mergedDataSets.filter(
        (dataSet) =>
          !keyedAssignedDatasets[dataSet?.id]?.assigned && dataSet?.assigned
      ),
      assigned: this.mergedDataSets.filter((dataSet) => dataSet?.assigned),
    };
    this.assignmentDetails.emit(assignmentData);
  }
}
