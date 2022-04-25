import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable, of } from 'rxjs';
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
}
