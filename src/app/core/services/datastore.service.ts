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

import { orderBy } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class DataStoreDataService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  createNameSpaceIfMissing(): Observable<any> {
    const configurations = {
      datasetClosedDateAttribute: { id: 'wTO29uRscGn' },
      defaultToRequest: true,
      messageKeys: {},
      userGroupsToToggleFormRequests: [
        {
          id: '',
          name: '',
        },
      ],
      validationRuleRequest: {
        userGroupsToRequest: [
          {
            id: 'B6JNeAQ6akX',
            name: '_DATASET_Superuser',
          },
        ],
        userGroupsToApprove: [
          {
            id: 'wl5cDMuUhmF',
            name: 'Administrators',
          },
        ],
      },
      referenceTitles: [
        {
          id: 'NO',
          name: 'Nutrition Officer',
        },
      ],
      allowedUserRolesForRequest: [
        {
          id: 'ZI4hVQsL7Dq',
          name: 'Data Entrant',
          systemName: 'Data Manager',
        },
        {
          id: 'wnEvOlOb9U9',
          name: 'Program Manager (Can not enter data)',
          systemName: 'Program Manager',
          expectedUserGroups: [
            {
              id: 'zk2Zubvm2kP',
              name: 'Data Manager',
            },
          ],
        },
        {
          id: 'TFlh0xqlzAo',
          name: 'IPC Data Manager',
        },
        {
          id: 'o4FG5PxbDNR',
          name: 'District HMIS Focal',
        },
      ],
      allowedUserGroupsForRequest: [
        {
          id: 'zk2Zubvm2kP',
          name: 'Data Entrant Group',
          systemName: 'Data Manager',
          associatedGroups: [
            {
              id: '',
              name: '',
            },
          ],
        },
        {
          id: 'us757WFyTYX',
          name: 'Program Manager',
          systemName: 'Program Manager Group',
        },
      ],
      usersSettings: {
        defaultPassword: 'HMIS@2022',
      },
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

  getDataViaKey(keys: string[]): Observable<any[]> {
    let data = [];
    let errors = {};
    return new Observable((observer) => {
      async.mapLimit(
        keys,
        2,
        async.reflect((key, callback) => {
          this.httpClient.get(`dataStore/dhis2-user-support/${key}`).subscribe(
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
          observer.next(data);
          observer.complete();
        }
      );
    });
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
            Number(response?.ticketNumber?.replace('DS', '')?.replace('UA', ''))
          ).fromNow(),
          shouldAlert: configurations
            ? configurations?.minimumNormalMessageLength
              ? response?.message?.message?.length >
                configurations?.minimumNormalMessageLength
              : false
            : false,
          message: {
            ...response?.message,
            messageContentsLength: response?.message?.message?.length,
            message: response?.message?.message
              ? response?.message?.message.split('\n').join('<br />')
              : response?.message?.text.split('\n').join('<br />'),
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

    return this.findAll(namespace, pager, configurations).pipe(
      map((response) => {
        return {
          ...response,
          data: orderBy(response?.data, ['ticketNumber'], ['desc']),
        };
      }),
      catchError((error) => of(error))
    );
  }

  findNamespaceKeys(
    namespace: string,
    category?: string
  ): Observable<string[]> {
    return this.httpClient.get('dataStore/' + namespace).pipe(
      map((response) => {
        return response.filter((key) => key?.indexOf(category) === 0);
      }),
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
    return this.findNamespaceKeys(namespace, configurations?.category).pipe(
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

  updateKeyAndCreateMessage(
    key: string,
    data: any,
    message: any
  ): Observable<any> {
    return zip(
      this.httpClient.put(`dataStore/dhis2-user-support/${key}`, data),
      this.httpClient.post(`messageConversations/${message?.id}`, message?.text)
    ).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  deleteKeyAndSendMessage(key: string, message: any): Observable<any> {
    return zip(
      this.httpClient.delete(`dataStore/dhis2-user-support/${key}`),
      this.httpClient.post(`messageConversations/${message?.id}`, message?.text)
    ).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  deleteAllKeysAndUpdateMessage(
    keys: string[],
    keyedMessages: any,
    reasonForCancellingRequest: string
  ): Observable<any> {
    let data = [];
    let errors = {};
    return new Observable((observer) => {
      async.mapLimit(
        keys,
        10,
        async.reflect((key, callback) => {
          zip(
            this.httpClient.delete(`dataStore/dhis2-user-support/${key}`),
            this.httpClient.post(
              `messageConversations/${keyedMessages[key]?.id}`,
              keyedMessages[key]?.text + '\n \n' + reasonForCancellingRequest
            ),
            this.httpClient.post(
              `messageConversations/${keyedMessages[key]?.id}/status?messageConversationStatus=INVALID`,
              null
            )
          ).subscribe(
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

          observer.next(response);
          observer.complete();
        }
      );
    });
  }

  createValidationRuleRequest(key: string, data: any): Observable<any> {
    return this.httpClient
      .post(`dataStore/dhis2-user-support/${key}`, data)
      .pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
  }
}
