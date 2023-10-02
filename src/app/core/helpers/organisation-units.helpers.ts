export function duduceTheHighetLevelFromOus(organisationUnits: any[]): number {
  let hightestLevel: number = 1;
  organisationUnits.forEach((ou: any) => {
    if (ou?.level > hightestLevel) {
      hightestLevel = ou?.level;
    }
  });
  return hightestLevel;
}
