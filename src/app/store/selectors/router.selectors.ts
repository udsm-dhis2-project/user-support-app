import { getRouterSelectors, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';

import { State } from '../reducers';

export const selectRouter = createFeatureSelector<RouterReducerState>('router');

const {
  selectQueryParams: getQueryParams, // select the current route query params
  selectRouteParams: getRouteParams, // select the current route params
  selectRouteData: getRouteData, // select the current route data
  selectUrl: getUrl, // select the current url
} = getRouterSelectors(selectRouter);
