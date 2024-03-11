import { BaseState, initialBaseState } from './base.state';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

export interface TranslationModel {
  key: {
    key: string;
  };
}
export interface TranslationState extends EntityState<any>, BaseState {
  currentLanguage: string;
  selectedSettingsLanguageKey: string;
}

export const translationAdapter: EntityAdapter<any> =
  createEntityAdapter<TranslationModel>();

export const initialTranslationState: TranslationState =
  translationAdapter.getInitialState({
    ...initialBaseState,
    currentLanguage: null,
    selectedSettingsLanguageKey: null,
  });
