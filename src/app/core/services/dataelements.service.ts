import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataelementsService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getDataElement(id): Observable<any> {
    return this.httpClient.get(
      `dataElements/${id}.json?fields=id,name,categoryCombo[categoryOptionCombos[id,name]]`
    );
  }
}
