export function removeDuplicates(originalArray: any[], key: string) {
  const newArray = [];
  const lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][key]] = originalArray[i];
  }
  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}
