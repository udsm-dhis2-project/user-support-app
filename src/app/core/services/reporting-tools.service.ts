import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
    searchingText?: string
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
            data: response?.organisationUnits,
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
