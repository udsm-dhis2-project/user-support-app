import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndicatorsService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getIndicatorGroups(parameters?: string[]): Observable<any> {
    return this.httpClient
      .get(
        `indicatorGroups.json${parameters ? '?' + parameters?.join('&') : ''}`
      )
      .pipe(
        map((response) => {
          return (response?.indicatorGroups || [])?.map(
            (indicatorGroup: any) => {
              return {
                ...indicatorGroup,
                name: indicatorGroup?.displayName,
              };
            }
          );
        }),
        catchError((error) => of(error))
      );
  }

  getIndicatorsByIndicatorGroup(id: string, fields?: string): Observable<any> {
    return this.httpClient
      .get(`indicatorGroups/${id}.json?fields=${fields ? fields : '*'}`)
      .pipe(
        map((response) => {
          return response?.indicators || [];
        }),
        catchError((error) => of(error))
      );
  }

  getIndicatorTypes(): Observable<any> {
    return this.httpClient
      .get(`indicatorTypes.json?fields=id,name,factor&paging=false`)
      .pipe(
        map((response) => {
          return response?.indicatorTypes || [];
        }),
        catchError((error) => of(error))
      );
  }

  getIndicatorDetails(id: string, fields: string): Observable<any> {
    return this.httpClient.get(`indicators/${id}.json?fields=${fields}`).pipe(
      map((response) => {
        return response || [];
      }),
      catchError((error) => of(error))
    );
  }
}
