import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addLoadedTranslation,
  loadTranslation,
  loadingTranslationFails,
  setDefaultLanguage,
  setSelectedSettingsLanguageKey,
} from '../actions';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { DataStoreDataService } from 'src/app/core/services/datastore.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { getTranslationsEntities } from '../selectors/translations.selectors';

@Injectable()
export class TranslationsEffects {
  constructor(
    private actions$: Actions,
    private datastoreService: DataStoreDataService,
    private store: Store<State>
  ) {}

  translations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTranslation),
      withLatestFrom(this.store.select(getTranslationsEntities)),
      switchMap(([action, entities]: [any, any]) => {
        if (!entities[action.key])
          return this.datastoreService.getKeyData(action.key).pipe(
            mergeMap((response: any) => {
              return [
                setDefaultLanguage({ key: action.key }),
                setSelectedSettingsLanguageKey({ key: action.key }),
                addLoadedTranslation({
                  translation: { id: action.key, data: response },
                }),
              ];
            }),
            catchError((error: any) => of(loadingTranslationFails(error)))
          );
        return of(
          setDefaultLanguage({ key: action.key }),
          setSelectedSettingsLanguageKey({ key: action.key })
        );
      })
    )
  );
}
