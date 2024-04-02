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
import moment from 'moment';

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
      defaultLocale: 'en',
      useTier2: false,
      keywordsKeys: {
        addMessageFormRequest: 'Please add the following datasets on org unit',
        removeMessageFormRequest:
          'Please remove the following datasets on the org unit',
        formRequestMessageHeaderKey: 'FORM REQUEST',
        addMessageFacilitiesFormRequestKey:
          'Please add the following org units on',
        removeMessageFacilitiesFormRequestKey:
          'Please un-assign the following org units on',
        messageChangePrefixKey: 'There are changes',
        Remove: 'Remove',
        Assign: 'Assign',
        Removed: 'Removed',
        Assigned: 'Assigned',
        and: 'and',
        'organisationunits from': 'organisationunits from',
        'organisationunits to': 'organisationunits to',
        'organisationunits from the form': 'organisationunits from the form',
        'organisationunits to the form': 'organisationunits to the form',
        'datasets from': 'datasets from',
        'datasets to': 'datasets to',
      },
      translationKeywords: [
        'Welcome',
        'Settings',
        'User feedback',
        'SN',
        'Request',
        'Date',
        'Actions',
        'View Details',
        'Feedbacks to attend',
        'Requesting',
        'Facilities',
        'Datasets',
        'Facility',
        'Assigned Datasets',
        'Change level',
        'View',
        'Request form',
        'Cancel',
        'Search',
        'Dataset/Form',
        'Category',
        'Waiting assignment',
        'Assign',
        'Remove',
        'Update',
        'Close',
        'Send',
        'No request available',
        'Users',
        'Names',
        'Username',
        'Email',
        'Last login',
        'Disabled',
        'Action',
        'Enable',
        'Activate',
        'Disable',
        'De-activate',
        'Password',
        'Reset',
        'Password Reset',
        'Update Orgunit',
        'Update Userrole',
        'Update User Role',
        'User Role',
        'User',
        'Role',
        'Orgunit',
        'New',
        'Next',
        'Preview',
        'This is alerting request. Approve only when you have confirmed',
        'Approve',
        'Reject',
        'Successfully sent form request',
        'Assign or Remove Facilities for',
        'Saving',
        'Request has been rejected',
        'Dataset',
        'Form',
        'Not a valid reason',
        'Done',
        'Confirm',
        'Already attended',
        'Successfully updated',
        'Successfully sent',
        'Provide reason for cancelling form request',
        'of',
        'Form requests',
        'User accounts',
        'Previous',
        'Access',
        'Demographic',
        'Data entry',
        'Report',
        'User Account Request',
        'Finish request',
        'Groups',
        'Back to Request List',
        'No item Matching the search',
        'Reporting Facilities',
        'No Request is available',
        'Requests',
        'Pending requests',
        'First name',
        'Last name',
        'Phone number',
        'Back to request',
        'Clear',
        'Confirming',
        'Validation Rules request',
        'No potential duplicate',
        'View potential duplicates',
      ],
      languages: [
        {
          key: 'en',
          name: 'English',
        },
      ],
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
          associatedRoles: [
            {
              id: 'ZI4hVQsL7Dq',
              name: 'Data Entrant',
            },
          ],
        },
        {
          id: 'wnEvOlOb9U9',
          name: 'Program Manager (Can not enter data)',
          systemName: 'Program Manager',
          associatedRoles: [
            {
              id: 'wnEvOlOb9U9',
              name: 'Program Manager (Can not enter data)',
            },
          ],
          expectedUserGroups: [
            {
              id: 'zk2Zubvm2kP',
              name: 'Data Manager',
            },
          ],
        },
      ],
      allowedUserGroupsForRequest: [
        {
          id: 'us757WFyTYX',
          name: 'Program Manager',
          systemName: 'Program Manager Group',
          associatedGroups: [
            {
              id: 'zk2Zubvm2kP',
              name: 'Data Entrant Group',
            },
          ],
        },
      ],
      usersSettings: {
        defaultPassword: 'Hmis@' + new Date().getFullYear(),
      },
    };
    return this.httpClient
      .get(`dataStore/dhis2-user-support/configurations`)
      .pipe(
        switchMap((configurationsResponse: any) => {
          const enTranslations: any = {
            Access: 'Access',
            Action: 'Action',
            Actions: 'Actions',
            Activate: 'Activate',
            'Already attended': 'Already attended',
            Approve: 'Approve',
            Assign: 'Assign',
            'Assign or Remove Facilities for':
              'Assign or Remove Facilities for',
            'Assigned Datasets': 'Assigned Datasets',
            'Back to Request List': 'Back to Request List',
            'Back to request': 'Back to request',
            Cancel: 'Cancel',
            Category: 'Category',
            'Change level': 'Change level',
            Clear: 'Clear',
            Close: 'Close',
            Confirm: 'Confirm',
            Confirming: 'Confirming',
            'Data entry': 'Data entry',
            Dataset: 'Dataset',
            'Dataset/Form': 'Dataset/Form',
            Datasets: 'Datasets',
            Date: 'Date',
            'De-activate': 'De-activate',
            Demographic: 'Demographic',
            Disable: 'Disable',
            Disabled: 'Disabled',
            Done: 'Done',
            Email: 'Email',
            Enable: 'Enable',
            Facilities: 'Facilities',
            Facility: 'Facility',
            'Feedbacks to attend': 'Feedbacks to attend',
            'Finish request': 'Finish request',
            'First name': 'First name',
            Form: 'Form',
            'Form requests': 'Form requests',
            Groups: 'Groups',
            'Last login': 'Last login',
            'Last name': 'Last name',
            Names: 'Names',
            New: 'New',
            Next: 'Next',
            'No Request is available': 'No Request is available',
            'No item Matching the search': 'No item Matching the search',
            'No request available': 'No request available',
            'Not a valid reason': 'Not a valid reason',
            Orgunit: 'Orgunit',
            Password: 'Password',
            'Password Reset': 'Password Reset',
            'Pending requests': 'Pending requests',
            'Phone number': 'Phone number',
            Preview: 'Preview',
            Previous: 'Previous',
            'Provide reason for cancelling form request':
              'Provide reason for cancelling form request',
            Reject: 'Reject',
            Remove: 'Remove',
            Report: 'Report',
            'Reporting Facilities': 'Reporting Facilities',
            Request: 'Request',
            'Request form': 'Request form',
            'Request has been rejected': 'Request has been rejected',
            Requesting: 'Requesting',
            Requests: 'Requests',
            Reset: 'Reset',
            SN: 'SN',
            Saving: 'Saving',
            Search: 'Search',
            Send: 'Send',
            Settings: 'Settings',
            'Successfully sent': 'Successfully sent',
            'Successfully sent form request': 'Successfully sent form request',
            'Successfully updated': 'Successfully updated',
            'This is alerting request. Approve only when you have confirmed':
              'This is alerting request. Approve only when you have confirmed',
            Update: 'Update',
            'Update Orgunit': 'Update Orgunit',
            'Update Userrole': 'Update Userrole',
            'User Account Request': 'User Account Request',
            'User Role': 'User Role',
            'User accounts': 'User accounts',
            'User feedback': 'User feedback',
            Username: 'Username',
            Users: 'Users',
            'Validation Rules request': 'Validation Rules request',
            View: 'View',
            'View Details': 'View Details',
            'Waiting assignment': 'Waiting assignment',
            Welcome: 'Welcome',
            addMessageFormRequest: 'Please, add the following datasets',
            of: 'of',
          };
          if (
            configurationsResponse &&
            configurationsResponse?.status &&
            configurationsResponse?.status === 'ERROR'
          ) {
            return zip(
              this.httpClient.post(
                'dataStore/dhis2-user-support/configurations',
                configurations
              ),
              this.httpClient.post(
                `dataStore/dhis2-user-support/en`,
                enTranslations
              )
            );
          } else {
            if (
              !configurationsResponse?.languages &&
              !configurationsResponse?.translationKeywords
            ) {
              return zip(
                this.httpClient.put(
                  'dataStore/dhis2-user-support/configurations',
                  {
                    ...configurationsResponse,
                    translationKeywords: [
                      'Welcome',
                      'Settings',
                      'User feedback',
                      'SN',
                      'Request',
                      'Date',
                      'Actions',
                      'View Details',
                      'Feedbacks to attend',
                      'Requesting',
                      'Facilities',
                      'Datasets',
                      'Facility',
                      'Assigned Datasets',
                      'Change level',
                      'View',
                      'Request form',
                      'Cancel',
                      'Search',
                      'Dataset/Form',
                      'Category',
                      'Waiting assignment',
                      'Assign',
                      'Remove',
                      'Update',
                      'Close',
                      'Send',
                      'No request available',
                      'Users',
                      'Names',
                      'Username',
                      'Email',
                      'Last login',
                      'Disabled',
                      'Action',
                      'Enable',
                      'Activate',
                      'Disable',
                      'De-activate',
                      'Password',
                      'Reset',
                      'Password Reset',
                      'Update Orgunit',
                      'Update Userrole',
                      'Update User Role',
                      'User Role',
                      'User',
                      'Role',
                      'Orgunit',
                      'New',
                      'Next',
                      'Preview',
                      'This is alerting request. Approve only when you have confirmed',
                      'Approve',
                      'Reject',
                      'Successfully sent form request',
                      'Assign or Remove Facilities for',
                      'Saving',
                      'Request has been rejected',
                      'Dataset',
                      'Form',
                      'Not a valid reason',
                      'Done',
                      'Confirm',
                      'Already attended',
                      'Successfully updated',
                      'Successfully sent',
                      'Provide reason for cancelling form request',
                      'of',
                      'Form requests',
                      'User accounts',
                      'Previous',
                      'Access',
                      'Demographic',
                      'Data entry',
                      'Report',
                      'User Account Request',
                      'Finish request',
                      'Groups',
                      'Back to Request List',
                      'No item Matching the search',
                      'Reporting Facilities',
                      'No Request is available',
                      'Requests',
                      'Pending requests',
                      'First name',
                      'Last name',
                      'Phone number',
                      'Back to request',
                      'Clear',
                      'Confirming',
                      'Validation Rules request',
                    ],
                    languages: [
                      {
                        key: 'en',
                        name: 'English',
                      },
                      {
                        key: 'sw',
                        name: 'Swahili',
                      },
                      {
                        key: 'rw',
                        name: 'Kinyarwanda',
                      },
                    ],
                  }
                ),
                this.httpClient.post(
                  `dataStore/dhis2-user-support/en`,
                  enTranslations
                )
              );
            }
          }
        }),
        catchError((error) => of(error))
      );
  }

  getDataStoreKeys(): Observable<string[]> {
    return this.httpClient.get('dataStore/dhis2-user-support', {}).pipe(
      map((response) => {
        return (
          response['dhis2-user-support']?.map((keyData: any) => keyData?.id) ||
          []
        );
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

  createDataStoreKey(key: string, data: any): Observable<any> {
    return this.httpClient
      .post(`dataStore/dhis2-user-support/${key}`, data)
      .pipe(
        map((response) => response),
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
            data: data?.map((dataItem) => {
              if (configurations?.category == 'UA') {
                return {
                  ...dataItem,
                  searchingText: !dataItem?.payload?.userCredentials
                    ? dataItem?.payload?.userCredentials
                        ?.map((user) =>
                          user?.firstName +
                            user?.surname +
                            user?.phoneNumber +
                            user?.email +
                            dataItem?.ticketNumber +
                            user?.organisationUnits?.length >
                          0
                            ? user?.organisationUnits
                                ?.map((ou) => ou?.name)
                                .join('')
                            : '' +
                              dataItem?.user?.organisationUnits[0]?.name +
                              dataItem?.user?.displayName +
                              dataItem?.user?.email
                        )
                        .join(',')
                    : '',
                };
              } else {
                return dataItem;
              }
            }),
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
        const isUA = key?.indexOf('UA') === 0;
        return {
          ...response,
          timeSinceResponseSent: moment(
            Number(response?.ticketNumber?.replace('DS', '')?.replace('UA', ''))
          ).fromNow(),
          shouldAlert: !isUA
            ? configurations
              ? configurations?.minimumNormalMessageLength
                ? response?.message?.message?.length >
                  configurations?.minimumNormalMessageLength
                : false
              : false
            : response?.payload?.length > 10,
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
    category?: string,
    organisationUnitId?: string,
    tier2?: boolean,
    isFeedbackRecepient?: boolean
  ): Observable<string[]> {
    return this.httpClient.get('dataStore/' + namespace).pipe(
      map((serverResponse) => {
        const response = serverResponse[namespace]?.map(
          (keyData: any) => keyData?.id
        );
        return category == 'UA'
          ? response?.filter((key) => {
              if (
                key?.indexOf(category) === 0 &&
                (key?.indexOf(organisationUnitId) > 0 || isFeedbackRecepient)
              ) {
                return key;
              }
            }) || []
          : response?.filter((key) => key?.indexOf(category) === 0) || [];
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
    return this.findNamespaceKeys(
      namespace,
      configurations?.category,
      configurations?.organisationUnitId,
      configurations?.tier2,
      configurations?.isFeedbackRecepient
    ).pipe(
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

  deleteDataStoreKey(key: string): Observable<any> {
    return this.httpClient.delete(`dataStore/dhis2-user-support/${key}`).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  updateDataStoreKey(key: string, data: any): Observable<any> {
    return this.httpClient
      .put(`dataStore/dhis2-user-support/${key}`, data)
      .pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
  }
}
