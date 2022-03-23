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
}
