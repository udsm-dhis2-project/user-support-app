import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DataSetsService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getDataSets(searchingText: string): Observable<any> {
    return this.httpClient
      .get(
        `dataSets.json?fields=id,name,dataEntryForm[*]${
          searchingText
            ? '&filter=name:ilike:' + searchingText.toLowerCase()
            : ''
        }`
      )
      .pipe(map((response) => response?.dataSets));
  }

  getDatasetsPaginated(
    paginationDetails?: any,
    dataSetClosedAttributeDetails?: { id?: string; name?: string }
  ): Observable<any> {
    return this.httpClient
      .get(
        `dataSets.json?fields=-id,name,attributeValues,organisationUnits~size${
          paginationDetails?.page ? '&page=' + paginationDetails?.page : ''
        }${
          paginationDetails?.pageSize
            ? '&pageSize=' + paginationDetails?.pageSize
            : ''
        }${
          paginationDetails?.searchingText
            ? '&filter=name:ilike:' +
              paginationDetails?.searchingText.toLowerCase()
            : ''
        }`
      )
      .pipe(
        map((response) => {
          const filteredDataSets = !dataSetClosedAttributeDetails
            ? response?.dataSets
            : dataSetClosedAttributeDetails
            ? response?.dataSets.filter(
                (dataSet) =>
                  (
                    dataSet?.attributeValues?.filter(
                      (attributeValue) =>
                        attributeValue?.attribute?.id ===
                        dataSetClosedAttributeDetails?.id
                    ) || []
                  ).length === 0
              ) || []
            : response?.dataSets;
          return {
            ...response,
            dataSets: filteredDataSets.map((dataSet) => {
              const matchedKeys =
                paginationDetails?.userSupportDataStoreKeys.filter(
                  (key) => key.indexOf(dataSet?.id) > -1
                ) || [];
              return {
                ...dataSet,
                hasPendingRequest: matchedKeys?.length > 0,

                keys: matchedKeys,
                timeSinceResponseSent:
                  matchedKeys.length > 0
                    ? moment(
                        Number(matchedKeys[0].split('_')[0].replace('DS', ''))
                      ).fromNow()
                    : '',
                date:
                  matchedKeys.length > 0
                    ? Date.now() -
                      Number(matchedKeys[0].split('_')[0].replace('DS', ''))
                    : null,
              };
            }),
          };
        }),
        catchError((error) => of(error))
      );
  }

  getDataSetById(id: string): Observable<any> {
    return this.httpClient
      .get(`dataSets/${id}.json?fields=id,name,organisationUnits[id,name]`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => of(error))
      );
  }
}
