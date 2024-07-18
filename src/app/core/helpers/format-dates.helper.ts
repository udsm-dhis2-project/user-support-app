export function getStartAndEndDatesUsingQuarter(quarter: string, year: number) {
  if (quarter === 'Q1') {
    return {
      startDate: new Date(year + '-01-01'),
      endDate: new Date(year + '-03-31'),
    };
  } else if (quarter === 'Q2') {
    return {
      startDate: new Date(year + '-04-01'),
      endDate: new Date(year + '-06-30'),
    };
  } else if (quarter === 'Q3') {
    return {
      startDate: new Date(year + '-07-01'),
      endDate: new Date(year + '-09-30'),
    };
  } else if (quarter === 'Q4') {
    return {
      startDate: new Date(year + '-10-01'),
      endDate: new Date(year + '-12-31'),
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
