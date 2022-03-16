import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { getDateDifferenceBetweenDates } from 'src/app/shared/helpers/date-formatting.helper';
import {
  DataSets,
  ReportingToolsResponseModel,
} from 'src/app/shared/models/reporting-tools.models';

@Injectable({
  providedIn: 'root',
})
export class ReportingToolsService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getFacilitiesWithNumberOfDataSets(
    ouId: string,
    level: number,
    page?: number,
    pageCount?: number,
    searchingText?: string,
    userSupportKeys?: string[]
  ): Observable<ReportingToolsResponseModel> {
    return this.httpClient
      .get(
        `organisationUnits.json?${page ? 'page=' + page + '&' : ''}${
          pageCount ? 'pageSize=' + pageCount + '&' : ''
        }filter=level:eq:${level}&fields=id,name,dataSets~size,parent[id,name]${
          searchingText ? '&filter=name:ilike:' + searchingText : ''
        }&filter=path:ilike:${ouId}`
      )
      .pipe(
        map((response) => {
          return {
            data: response?.organisationUnits.map((orgUnit) => {
              const matchedKeys =
                userSupportKeys.filter(
                  (key) => key?.indexOf(orgUnit?.id) > -1
                ) || [];
              return {
                ...orgUnit,
                hasPendingRequest: matchedKeys?.length > 0,
                timeSinceLastResponse:
                  matchedKeys.length > 0
                    ? getDateDifferenceBetweenDates(
                        Date.now(),
                        Number(matchedKeys[0].split('_')[0].replace('DS', ''))
                      )
                    : '',
                date:
                  matchedKeys.length > 0
                    ? Date.now() -
                      Number(matchedKeys[0].split('_')[0].replace('DS', ''))
                    : null,
              };
            }),
            pagination: response?.pager,
          };
        }),
        catchError((error) => of(error))
      );
  }

  getAssignedDataSets(ouId: string): Observable<DataSets[]> {
    return this.httpClient
      .get(`organisationUnits/${ouId}.json?fields=dataSets[id,name]`)
      .pipe(
        map((response) => {
          return response?.dataSets;
        }),
        catchError((error) => of(error))
      );
  }

  getAllDataSets(): Observable<DataSets[]> {
    return this.httpClient
      .get(`dataSets.json?paging=false&fields=id,name`)
      .pipe(
        map((response) => {
          return response?.dataSets;
        }),
        catchError((error) => of(error))
      );
  }
}
