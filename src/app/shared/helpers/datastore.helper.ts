import { chunk } from 'lodash';

export function getDataStoreUrlParams(dataStoreUrl: string): {
  namespace: string;
  key: string;
  pager?: any;
} {
  const urlSection = (dataStoreUrl || '').split('?');
  const resourceSection = (urlSection[0] || '').split('/');

  const dataStoreNamespace = resourceSection[1];
  const dataStoreKey = resourceSection[2];

  return {
    namespace: dataStoreNamespace
      ? dataStoreNamespace.replace('.json', '')
      : undefined,
    key: dataStoreKey ? dataStoreKey.replace('.json', '') : undefined,
    pager: getDataStorePager(urlSection[1]),
  };
}

function getDataStorePager(urlQuerySection: string): any {
  const pagerParams = getPagerParams(urlQuerySection);

  if (!pagerParams?.paging) {
    return null;
  }

  return {
    page: (pagerParams.page as number) || 1,
    pageSize: (pagerParams.pageSize as number) || 50,
  };
}

function getPagerParams(urlQuerySection: string) {
  return (urlQuerySection || '').split('&').reduce(
    (
      params: { [param: string]: number | boolean | string },
      queryParam: string
    ) => {
      const splitedParam = (queryParam || '').split('=');
      if (splitedParam[0]?.length > 0) {
        params[splitedParam[0]] = sanitizePagerParamValue(splitedParam[1]);
      }
      return params;
    },
    { paging: true }
  );
}

function sanitizePagerParamValue(
  paramValue: string
): number | boolean | string {
  if (paramValue === 'false') {
    return false;
  }

  if (paramValue === 'true') {
    return true;
  }

  try {
    return parseInt(paramValue, 10);
  } catch (e) {
    return paramValue;
  }
}

export function getPaginatedDataStoreKeys(keys: string[], pager: any) {
  if (!pager?.pageSize) {
    return keys || [];
  }

  const chunkedKeys = chunk(keys || [], pager.pageSize);
  return chunkedKeys[(pager.page || 1) - 1];
}
