import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import moment from 'moment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProgramsService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getPrograms(paginationDetails: any): Observable<any> {
    return this.httpClient
      .get(
        `programs.json?fields=-id,name,attributeValues,organisationUnits~size${
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
          const filteredPrograms = response?.programs;
          return {
            ...response,
            programs: filteredPrograms?.map((program: any) => {
              const matchedKeys =
                paginationDetails?.userSupportDataStoreKeys?.filter(
                  (key) => key?.indexOf(program?.id) > -1
                ) || [];
              return {
                ...program,
                hasPendingRequest: matchedKeys?.length > 0,

                keys: matchedKeys,
                timeSinceResponseSent:
                  matchedKeys?.length > 0
                    ? moment(
                        Number(matchedKeys[0]?.split('_')[0]?.replace('DS', ''))
                      ).fromNow()
                    : '',
                date:
                  matchedKeys?.length > 0
                    ? Date.now() -
                      Number(matchedKeys[0]?.split('_')[0]?.replace('DS', ''))
                    : null,
              };
            }),
          };
        }),
        catchError((error: any) => of(error))
      );
  }

  getAllPrograms(): Observable<any[]> {
    return this.httpClient
      .get(`programs.json?paging=false&fields=id,name,attributeValues`)
      .pipe(
        map((response) =>
          response?.programs?.map((program: any) => {
            return {
              ...program,
              type: 'PROGRAM',
            };
          })
        ),
        catchError((error: any) => of(error))
      );
  }

  getProgramById(id: string, fields?: string): Observable<any> {
    return this.httpClient
      .get(
        `programs/${id}.json?fields=${
          fields ? fields : 'id,name,organisationUnits[id,name]'
        }`
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => of(error))
      );
  }
}
