import { flatten } from 'lodash';
import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FeedbackRecepientModel } from 'src/app/shared/models/users.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersDataService {
  constructor(
    private httpClient: NgxDhis2HttpClientService,
    private httpClientService: HttpClient
  ) {}

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
    pathSection?: string
  ): Observable<any> {
    return this.httpClient
      .get(
        `users.json?pageSize=${pageSize}&page=${page}${
          q ? '&query=' + q : ''
        }&fields=id,firstName,organisationUnits[id,level,name,code,path],surname,name,email,userCredentials[username,lastlogin,disabled]&order=firstName~asc${
          pathSection
            ? '&filter=organisationUnits.path:ilike:' + pathSection
            : ''
        }`
      )
      .pipe(
        map((response) => {
          return response;
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
    console.log('');
    if (data?.method === 'POST') {
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
        map((response) => response),
        catchError((error) => of(error))
      );
    } else if (data?.method === 'DELETE') {
      return this.httpClient
        .delete(`dataStore/dhis2-user-support/${data?.id}`)
        .pipe(
          map((response) => response),
          catchError((error) => of(error))
        );
    } else if (data?.method === 'PATCH') {
      return zip(
        data?.payload
          ? this.httpClientService.patch(
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
    } else if (data?.method === 'PUT') {
      return zip(
        data?.payload
          ? this.httpClient.put(`${data?.url}`, data?.payload)
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
      return of(null);
    }
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
