export function duduceTheHighetLevelFromOus(organisationUnits: any[]): number {
  let hightestLevel: number = 1;
  (organisationUnits || [])?.forEach((ou: any) => {
    if (ou?.level > hightestLevel) {
      hightestLevel = ou?.level;
    }
  });
  return hightestLevel;
}

export function flattenToArrayGivenOrgUnits(item, result = []): any[] {
  const flattenedItem = { ...item };
  delete flattenedItem?.parent;

  result.push(flattenedItem);

  if (item?.parent) {
    flattenToArrayGivenOrgUnits(item?.parent, result);
  }

  return result;
}
