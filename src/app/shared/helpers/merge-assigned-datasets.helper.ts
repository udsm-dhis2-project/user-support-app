import { DataSets, FacilityModel } from '../models/reporting-tools.models';
import { keyBy } from 'lodash';

export function mergeDataSetsWithAssignedOnes(
  assignedDataSets: DataSets[],
  allDataSets: DataSets[],
  dataStoreMessageDetails: any
): DataSets[] {
  const keyedAssignedDataSets = keyBy(assignedDataSets, 'id');
  const keyedAdditionsAndDeletions = dataStoreMessageDetails
    ? keyBy(
        [
          ...dataStoreMessageDetails?.payload?.deletions,
          ...dataStoreMessageDetails?.payload?.additions,
        ],
        'id'
      )
    : {};
  return allDataSets.map((dataSet) => {
    return {
      ...dataSet,
      assigned: keyedAssignedDataSets[dataSet?.id] ? true : false,
      hasPendingRequest: keyedAdditionsAndDeletions[dataSet?.id] ? true : false,
    };
  });
}
