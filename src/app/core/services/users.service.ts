import { flatten } from 'lodash';
import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FeedbackRecepientModel } from 'src/app/shared/models/users.model';

@Injectable({
  providedIn: 'root',
})
export class UsersDataService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

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

  getUsersList(pageSize: number, page: number, q?: string): Observable<any> {
    return this.httpClient
      .get(
        `users.json?pageSize=${pageSize}&page=${page}${
          q ? '&query=' + q : ''
        }&fields=id,firstName,surname,name,email,userCredentials[username,lastlogin,disabled]&order=firstName~asc`
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getUserByUsername(username: string): Observable<boolean> {
    return this.httpClient
      .get(`users?filter=userCredentials.username:eq:${username}&fields=id`)
      .pipe(map((response) => response?.users?.length > 0));
  }

  approveChanges(data: any): Observable<any> {
    if (data?.method === 'POST') {
      return zip(
        this.httpClient.post(data?.url, data?.userPayload),
        this.httpClient.put(
          `dataStore/dhis2-user-support/${data?.id}`,
          data?.payload
        ),
        this.httpClient.post(
          `messageConversations/${data?.messageConversation?.id}`,
          data?.approvalMessage
        ),
        this.httpClient.post(
          `messageConversations/${data?.messageConversation?.id}/status?messageConversationStatus=PENDING`,
          null
        )
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
    } else {
      return of(null);
    }
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
                  response?.users?.length == 0 ? null : userNameData?.username,
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
