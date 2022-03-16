import { createSelector } from '@ngrx/store';
import { getRootState, State } from '../reducers';
import { SystemConfigsState } from '../states/system-configurations.state';

export const getSystemConfigsState = createSelector(
  getRootState,
  (state: State) => state.systemConfigs
);

export const getSystemConfigsLoadingState = createSelector(
  getSystemConfigsState,
  (state: SystemConfigsState) => state.loading
);

export const getSystemConfigs = createSelector(
  getSystemConfigsState,
  (state: SystemConfigsState) => state.configs
);
