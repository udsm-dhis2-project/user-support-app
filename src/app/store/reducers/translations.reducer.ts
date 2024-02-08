import { createReducer, on } from '@ngrx/store';
import {
  TranslationState,
  initialTranslationState,
  translationAdapter,
} from '../states/translations.states';
import {
  addLoadedTranslation,
  loadTranslation,
  loadingTranslationFails,
  setDefaultLanguage,
  setSelectedSettingsLanguageKey,
} from '../actions';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from '../states/base.state';

export const reducer = createReducer(
  initialTranslationState,
  on(loadTranslation, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addLoadedTranslation, (state, { translation }) =>
    translationAdapter.addOne(translation, { ...state, ...loadedBaseState })
  ),
  on(loadingTranslationFails, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error,
  })),
  on(setDefaultLanguage, (state, { key }) => ({
    ...state,
    currentLanguage: key,
  })),
  on(setSelectedSettingsLanguageKey, (state, { key }) => ({
    ...state,
    selectedSettingsLanguageKey: key,
  }))
);

export function translationReducer(state, action): TranslationState {
  return reducer(state, action);
}
