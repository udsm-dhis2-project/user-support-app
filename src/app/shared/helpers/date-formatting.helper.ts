export function getDateDifferenceBetweenDates(
  dateOne: number,
  dateTwo: number
) {
  const difference = new Date(dateOne).getTime() - new Date(dateTwo).getTime();
  const days = (difference / (1000 * 3600 * 24)).toFixed(0);
  return Number(days) >= 1
    ? days + ' days'
    : (difference / (1000 * 3600)).toFixed(1) + ' hours';
}
