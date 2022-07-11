import { flatten } from 'lodash';

export function mergeOusAddedAndRemovedFromDataSet(
  dataSetDetails: any,
  dataStoreDetails: any
) {
  const originalOus = dataSetDetails?.organisationUnits;
  const additions = flatten(
    (
      dataStoreDetails?.data?.filter(
        (dataStoreDataDetails) =>
          dataStoreDataDetails?.id?.indexOf(dataSetDetails?.id) > -1
      ) || []
    )?.map((dataRow) => {
      return dataRow?.payload?.additions;
    })
  );

  const deletions = flatten(
    (
      dataStoreDetails?.data?.filter(
        (dataStoreDataDetails) =>
          dataStoreDataDetails?.id?.indexOf(dataSetDetails?.id) > -1
      ) || []
    )?.map((dataRow) => {
      return dataRow?.payload?.deletions;
    })
  );

  const mergedOriginalAndAdditions = [...originalOus, ...additions];

  return (
    mergedOriginalAndAdditions.filter(
      (ou) =>
        (deletions.filter((deletion) => deletion?.id === ou?.id) || [])
          ?.length === 0
    ) || []
  );
}
