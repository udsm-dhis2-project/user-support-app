import { createSelector } from '@ngrx/store';
import { State, getRootState } from '../reducers';
import {
  TranslationState,
  translationAdapter,
} from '../states/translations.states';

export const translationsState = createSelector(
  getRootState,
  (state: State) => state.translations
);

export const {
  selectAll: getAllTranslations,
  selectEntities: getTranslationsEntities,
} = translationAdapter.getSelectors(translationsState);

export const getTranslationsLoadedState = createSelector(
  translationsState,
  (state: TranslationState) => state.loaded
);

export const getTranslationsByKey = (key) =>
  createSelector(
    translationsState,
    (state: TranslationState) => state.entities[key]
  );

export const getCurrentLanguageKey = createSelector(
  translationsState,
  (state: TranslationState) => state.currentLanguage
);

export const getCurrentTranslations = createSelector(
  translationsState,
  getCurrentLanguageKey,
  (state: TranslationState, key: string) => state.entities[key]?.data
);

export const getCurrentSettingsSelectedLanguageKey = createSelector(
  translationsState,
  (state: TranslationState) => state.selectedSettingsLanguageKey
);
