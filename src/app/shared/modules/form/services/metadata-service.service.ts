import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MetadataService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  searchUserByUsername(username: string): Observable<any> {
    return this.httpClient
      .get(`users?filter=userCredentials.username:eq:${username}&fields=id`)
      .pipe(map((response) => response?.users?.length > 0));
  }
}
