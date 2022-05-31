import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetadataDescriptionService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getMetadataExpressionDescription(expression): Observable<any> {
    return this.httpClient.post(
      'indicators/expression/description',
      expression
    );
  }
}
