import { flatten } from 'lodash';

export function mergeOusAddedAndRemovedFromDataSet(
  originalOus: any[],
  dataStoreDetails: any
) {
  const additions = flatten(
    dataStoreDetails?.data?.map((dataRow) => {
      return dataRow?.payload?.additions;
    })
  );

  const deletions = flatten(
    dataStoreDetails?.data?.map((dataRow) => {
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
