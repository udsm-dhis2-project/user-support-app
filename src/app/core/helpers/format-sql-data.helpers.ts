import { groupBy } from 'lodash';

export function formatSQLData(sqlViewData: any) {
  const headers = sqlViewData?.headers || [];
  if (headers?.length === 0) {
    return [];
  }

  const formattedRows = formatRows(sqlViewData?.rows, headers);
  return {
    ...sqlViewData,
    groupedRows: groupBy(formattedRows, 'duplicateReference'),
  };
}

function formatRows(rows: any[], headers: any[]) {
  return rows.map((row) => {
    let newRow = [];
    headers.forEach((header, index) => {
      newRow = [
        ...newRow,
        {
          key: header?.name,
          value: row[index],
        },
      ];
    });
    return {
      data: row,
      duplicateReference: row[3] + '-' + row[2],
    };
  });
}

function formatSQLViewData(headers, rows) {}
