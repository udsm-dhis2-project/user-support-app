import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  addLoadedSystemConfigs,
  loadingSystemConfigurationsFail,
  loadSystemConfigurations,
} from '../actions';

@Injectable()
export class SystemConfigsEffects {
  systemConfigs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSystemConfigurations),
      switchMap(() => {
        return this.httpClient.get('configuration').pipe(
          map((configs) => {
            return addLoadedSystemConfigs({ configs });
          }),
          catchError((error) => of(loadingSystemConfigurationsFail({ error })))
        );
      })
    )
  );
  constructor(
    private httpClient: NgxDhis2HttpClientService,
    private actions$: Actions
  ) {}
}
