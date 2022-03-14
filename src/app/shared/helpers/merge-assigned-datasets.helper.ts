import { DataSets } from '../models/reporting-tools.models';
import { keyBy } from 'lodash';

export function mergeDataSetsWithAssignedOnes(
  assignedDataSets: DataSets[],
  allDataSets: DataSets[]
): DataSets[] {
  const keyedAssignedDataSets = keyBy(assignedDataSets, 'id');
  return allDataSets.map((dataSet) => {
    return {
      ...dataSet,
      assigned: keyedAssignedDataSets[dataSet?.id] ? true : false,
    };
  });
}
