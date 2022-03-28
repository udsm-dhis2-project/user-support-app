import { DataSets, FacilityModel } from '../models/reporting-tools.models';
import { keyBy } from 'lodash';

export function mergeDataSetsWithAssignedOnes(
  assignedDataSets: DataSets[],
  allDataSets: DataSets[],
  dataStoreMessageDetails: any
): DataSets[] {
  const keyedAssignedDataSets = keyBy(assignedDataSets, 'id');
  let additions = [];
  let deletions = [];

  dataStoreMessageDetails && dataStoreMessageDetails?.length > 0
    ? dataStoreMessageDetails.forEach((detail) => {
        additions = [
          ...additions,
          ...detail?.payload?.additions.map((addition) => {
            return {
              ...addition,
              addition: true,
              dataStoreDetails: detail,
            };
          }),
        ];
        deletions = [
          ...deletions,
          ...detail?.payload?.deletions.map((deletion) => {
            return {
              ...deletion,
              deletion: true,
              dataStoreDetails: detail,
            };
          }),
        ];
      })
    : null;
  const keyedAdditionsAndDeletions = dataStoreMessageDetails
    ? keyBy([...deletions, ...additions], 'id')
    : {};
  return allDataSets.map((dataSet) => {
    return {
      ...dataSet,
      assigned: keyedAssignedDataSets[dataSet?.id] ? true : false,
      hasPendingRequest: keyedAdditionsAndDeletions[dataSet?.id] ? true : false,
      forAddition: keyedAdditionsAndDeletions[dataSet?.id]?.addition
        ? true
        : false,
      details: keyedAdditionsAndDeletions[dataSet?.id]
        ? keyedAdditionsAndDeletions[dataSet?.id].dataStoreDetails
        : null,
    };
  });
}
