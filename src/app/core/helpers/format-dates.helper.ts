export function getStartAndEndDatesUsingQuarter(quarter: string, year: number) {
  if (quarter === 'Q1') {
    return {
      startDate: new Date('01-01-' + year),
      endDate: new Date('03-31-' + year),
    };
  } else if (quarter === 'Q2') {
    return {
      startDate: new Date('01-04-' + year),
      endDate: new Date('06-30-' + year),
    };
  } else if (quarter === 'Q3') {
    return {
      startDate: new Date('01-07-' + year),
      endDate: new Date('09-30-' + year),
    };
  } else if (quarter === 'Q4') {
    return {
      startDate: new Date('01-10-' + year),
      endDate: new Date('12-31-' + year),
    };
  } else {
    return {};
  }
}

export function getYears(startYear: number): number[] {
  const countOfYears = new Date().getFullYear() - startYear;
  let years = [];
  for (let count = 0; count < countOfYears; count++) {
    years = [...years, new Date().getFullYear() - count];
  }
  return years;
}
