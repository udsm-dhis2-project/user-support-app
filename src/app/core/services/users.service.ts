import { flatten, keyBy } from 'lodash';
import { Injectable } from '@angular/core';
import {
  HttpConfig,
  NgxDhis2HttpClientService,
} from '@iapps/ngx-dhis2-http-client';
import { Observable, of, zip } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FeedbackRecepientModel } from 'src/app/shared/models/users.model';
import { HttpClient } from '@angular/common/http';
import { flattenToArrayGivenOrgUnits } from '../helpers/organisation-units.helpers';

@Injectable({
  providedIn: 'root',
})
export class UsersDataService {
  constructor(
    private httpClient: NgxDhis2HttpClientService,
    private httpClientService: HttpClient
  ) { }

  getUsersByUserGroup(
    userGroupId: string
  ): Observable<FeedbackRecepientModel[]> {
    return this.httpClient
      .get(
        `users.json?fields=id,name,userCredentials&filter=userGroups.id:in:[${userGroupId}]`
      )
      .pipe(
        map((response) => response?.users),
        catchError((error) => of(error))
      );
  }

  getUsersList(
    pageSize: number,
    page: number,
    q?: string,
    pathSection?: string,
    levels?: any[],
    selectedLevel?: number,
    accountStatus?: string
  ): Observable<any> {
    return this.httpClient
      .get(
        `users.json?pageSize=${pageSize}&page=${page}${q ? '&query=' + q : ''
        }&fields=id,firstName,organisationUnits[id,level,name,code,path,parent[id,name,level,parent[id,name,level]]],surname,name,email,phoneNumber,userRoles,userGroups,userCredentials[username,lastlogin,disabled]&order=firstName~asc${pathSection
          ? '&filter=organisationUnits.path:ilike:' + pathSection
          : ''
        }${selectedLevel
          ? '&filter=organisationUnits.level:eq:' + selectedLevel
          : ''
        }${accountStatus
          ? '&filter=userCredentials.disabled:eq:' +
          (accountStatus == 'active' ? false : true)
          : ''
        }`
      )
      .pipe(
        map((response) => {
          return {
            ...response,
            users: response?.users?.map((user: any) => {
              return {
                ...user,
                leveledOrgUnitsTree: keyBy(
                  flatten(
                    user?.organisationUnits?.map((orgUnit: any) => {
                      return flattenToArrayGivenOrgUnits(orgUnit);
                    })
                  ),
                  'level'
                ),
              };
            }),
          };
        }),
        catchError((error) => of(error))
      );
  }

  getUserByUsername(username: string): Observable<boolean> {
    return this.httpClient
      .get(`users?filter=userCredentials.username:eq:${username}&fields=id`)
      .pipe(map((response) => response?.users?.length > 0));
  }

  approveChanges(data: any): Observable<any> {
    if (data?.method === 'POST') {
      if (
        !(data?.url?.includes('enabled') || data?.url?.includes('disabled'))
      ) {
        return zip(
          data?.userPayload
            ? this.httpClient.post('users', data?.userPayload)
            : of(null),
          this.httpClient.put(
            `dataStore/dhis2-user-support/${data?.id}`,
            data?.payload
          ),
          data?.messageConversation
            ? this.httpClient.post(
              `messageConversations/${data?.messageConversation?.id}`,
              data?.messageConversation?.approvalMessage
            )
            : of(null),
          data?.messageConversation
            ? this.httpClient.post(
              `messageConversations/${data?.messageConversation?.id}/status?messageConversationStatus=SOLVED`,
              null
            )
            : this.httpClient.post(`messageConversations`, data?.messageBody)
        ).pipe(
          switchMap((responses: any[]) => {
            console.log('responses:::', responses);
            console.log('DATA:::', data);
            const userResponse: any = responses[0];
            return userResponse
              ? this.httpClient.post(`messageConversations`, {
                subject: 'HMIS DHIS2 ACCOUNT',
                users: [
                  {
                    id: userResponse?.id
                      ? userResponse?.id
                      : userResponse?.response?.uid,
                    username: userResponse?.userCredentials?.username
                      ? userResponse?.userCredentials?.username
                      : data?.userPayload?.userCredentials?.username,
                    type: 'user',
                  },
                ],
                userGroups: [],
                text: `Your creadentials are: \n Username: ${userResponse?.userCredentials?.username
                    ? userResponse?.userCredentials?.username
                    : data?.userPayload?.userCredentials?.username
                  } \n
                    Password: ${data?.userPayload?.userCredentials?.password
                  } \n\n
                    MoH requires you to change password after login.
                    The account will be disabled if it is not used for 3 months consecutively`,
              })
              : of([]);
          }),
          catchError((error) => of(error))
        );
      } else if (data?.method === 'POST') {
        return zip(
          data?.payload
            ? this.httpClientService.post(
              `../../../api/${data?.url}`,
              data?.payload
            )
            : of(null),
          this.httpClient.delete(`dataStore/dhis2-user-support/${data?.id}`),
          data?.messageConversation
            ? this.httpClient.post(
              `messageConversations/${data?.messageConversation?.id}`,
              data?.messageConversation?.approvalMessage
            )
            : of(null),
          data?.messageConversation
            ? this.httpClient.post(
              `messageConversations/${data?.messageConversation?.id}/status?messageConversationStatus=SOLVED`,
              null
            )
            : this.httpClient.post(`messageConversations`, data?.messageBody)
        ).pipe(
          map((response) => response),
          catchError((error) => of(error))
        );
      } else {
        /**
         * TODO: Add error message if checks result to this block
         */
        return of(null);
      }
    } else if (data?.method === 'DELETE') {
      return this.httpClient
        .delete(`dataStore/dhis2-user-support/${data?.id}`)
        .pipe(
          map((response) => response),
          catchError((error) => of(error))
        );
    } else if (data?.method === 'PATCH') {
      const httpOptions: HttpConfig = {
        httpHeaders: { 'Content-Type': 'application/json-patch+json' },
      };
      return zip(
        data?.payload
          ? this.httpClient.patch(`${data?.url}`, data?.payload, httpOptions)
          : of(null),
        this.httpClient.delete(`dataStore/dhis2-user-support/${data?.id}`),
        data?.messageConversation
          ? this.httpClient.post(
            `messageConversations/${data?.messageConversation?.id}`,
            data?.messageConversation?.approvalMessage
          )
          : of(null),
        data?.messageConversation
          ? this.httpClient.post(
            `messageConversations/${data?.messageConversation?.id}/status?messageConversationStatus=SOLVED`,
            null
          )
          : this.httpClient.post(`messageConversations`, data?.messageBody),
        data?.payload[0] && data?.payload[0]?.path === '/password'
          ? this.httpClient.post(`messageConversations`, data?.privateMessage)
          : of(null)
      ).pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
    } else {
      return of(null);
    }
  }

  rejectChanges(data: any): Observable<any> {
    return zip(
      this.httpClient.put(`dataStore/dhis2-user-support/${data?.id}`, data),
      data?.messageConversation
        ? this.httpClient.post(
          `messageConversations/${data?.messageConversation?.id}`,
          data?.rejectionReasonMessage)
        : this.httpClient.post(`messageConversations`, data?.messageBody)
    ).pipe(
      map((response) => response),
      catchError((error) => error)
    );
  }

  verifyUsername(username: string): Observable<any> {
    return this.httpClient
      .get(`users?filter=userCredentials.username:eq:${username}&fields=id`)
      .pipe(
        map((response) => {
          return response?.users;
        })
      );
  }

  checkForUserNamesAvailability(potentialUserNames: any[]): Observable<any> {
    return zip(
      ...potentialUserNames.map((userNameData) => {
        return this.httpClient
          .get(
            `users?filter=userCredentials.username:eq:${userNameData?.username}&fields=id`
          )
          .pipe(
            map((response) => {
              return {
                key: userNameData?.key,
                username:
                  response?.users?.length > 0 ? null : userNameData?.username,
              };
            })
          );
      })
    ).pipe(
      map((response) => {
        return flatten(response);
      })
    );
  }
}
