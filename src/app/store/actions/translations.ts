import { createAction, props } from '@ngrx/store';

export const loadTranslation = createAction(
  '[Translation] load translation',
  props<{ key: string }>()
);

export const addLoadedTranslation = createAction(
  '[Translation] add loaded translation',
  props<{ translation: any }>()
);

export const loadingTranslationFails = createAction(
  '[Translation] loading translations fails',
  props<{ error: any }>()
);

export const setDefaultLanguage = createAction(
  '[Translation] set default languages',
  props<{ key: string }>()
);
