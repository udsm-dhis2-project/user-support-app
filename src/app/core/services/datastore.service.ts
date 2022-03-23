import { Injectable } from '@angular/core';
import {
  ErrorMessage,
  NgxDhis2HttpClientService,
} from '@iapps/ngx-dhis2-http-client';
import { Observable, of, throwError, zip } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as async from 'async';
import {
  getDataStoreUrlParams,
  getPaginatedDataStoreKeys,
} from 'src/app/shared/helpers/datastore.helper';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DataStoreDataService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  createNameSpaceIfMissing(): Observable<string[]> {
    const configurations = {
      defaultToRequest: true,
      messageKeys: {},
      userGroupsToToggleFormRequests: [
        {
          id: '',
          name: '',
        },
      ],
    };
    return this.httpClient
      .post(`dataStore/dhis2-user-support/configurations`, configurations)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => of(error))
      );
  }

  getDataStoreKeys(): Observable<string[]> {
    return this.httpClient.get('dataStore/dhis2-user-support').pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }

  getUserSupportConfigurations(): Observable<any> {
    return this.httpClient
      .get('dataStore/dhis2-user-support/configurations')
      .pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
  }

  getDataViaKey(key: string): Observable<any> {
    return this.httpClient.get(`dataStore/dhis2-user-support/${key}`).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }

  findByKeys(
    namespace: string,
    keys: string[],
    pager?: any,
    configurations?: any
  ): Observable<any> {
    keys = keys.filter((key) => key !== 'configurations') || [];
    if (keys?.length === 0) {
      return of({
        data: [],
      });
    }

    let data = [];
    let errors = {};

    const paginatedKeys: string[] = getPaginatedDataStoreKeys(keys, pager);
    return new Observable((observer) => {
      async.mapLimit(
        paginatedKeys,
        10,
        async.reflect((key, callback) => {
          this.findOne(namespace, key, configurations).subscribe(
            (results) => {
              data = [...data, results];
              callback(null, results);
            },
            (err) => {
              errors[key] = err;
              callback(err, null);
            }
          );
        }),
        () => {
          const response = {
            data,
            errors,
          };
          const newPager = pager
            ? {
                ...pager,
                page: pager.page || 1,
                pageCount:
                  paginatedKeys?.length > 0
                    ? Math.ceil((keys?.length || 0) / paginatedKeys.length)
                    : 1,
                total: keys.length,
              }
            : null;

          observer.next(newPager ? { ...response, pager: newPager } : response);
          observer.complete();
        }
      );
    });
  }

  findOne(
    namespace: string,
    key: string,
    configurations: any
  ): Observable<any> {
    return this.httpClient.get(`${'dataStore/' + namespace}/${key}`).pipe(
      map((response) => {
        return {
          ...response,
          timeSinceResponseSent: moment(
            Number(response?.ticketNumber?.replace('DS', ''))
          ).fromNow(),
          shouldAlert: configurations?.minimumNormalMessageLength
            ? response?.message?.message?.length >
              configurations?.minimumNormalMessageLength
            : false,
          message: {
            ...response?.message,
            messageContentsLength: response?.message?.message?.length,
            message: response?.message?.message.split('\n').join('<br />'),
          },
        };
      }),
      catchError((error) => of(error))
    );
  }

  getAllFromNameSpace(
    dataStoreUrl: string,
    configurations: any
  ): Observable<any> {
    const { key, namespace, pager } = getDataStoreUrlParams(dataStoreUrl) || {
      key: undefined,
      namespace: undefined,
    };

    if (key) {
      return this.findOne(namespace, key, configurations);
    }

    return this.findAll(namespace, pager, configurations);
  }

  findNamespaceKeys(namespace: string): Observable<string[]> {
    return this.httpClient.get('dataStore/' + namespace).pipe(
      catchError((error: ErrorMessage) => {
        if (error.status === 404) {
          return of([]);
        }

        return throwError(error);
      })
    );
  }

  findAll(
    namespace: string,
    pager?: any,
    configurations?: any
  ): Observable<{ [namespace: string]: any }> {
    return this.findNamespaceKeys(namespace).pipe(
      switchMap((keys: string[]) => {
        return this.findByKeys(namespace, keys, pager, configurations).pipe(
          map((values) => values)
        );
      })
    );
  }

  getKeyData(key: string): Observable<any> {
    return this.httpClient.get(`dataStore/dhis2-user-support/${key}`).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }
}
