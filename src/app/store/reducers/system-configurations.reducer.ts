import { createReducer, on } from '@ngrx/store';
import {
  addLoadedSystemConfigs,
  loadingSystemConfigurationsFail,
  loadSystemConfigurations,
} from '../actions';
import {
  errorBaseState,
  initialBaseState,
  loadedBaseState,
} from '../states/base.state';
import {
  initialSystemConfigsState,
  SystemConfigsState,
} from '../states/system-configurations.state';
import {} from '../states/system-info.state';

const reducer = createReducer(
  initialSystemConfigsState,
  on(loadSystemConfigurations, (state) => ({
    ...initialBaseState,
    ...state,
  })),
  on(addLoadedSystemConfigs, (state, { configs }) => ({
    ...state,
    ...loadedBaseState,
    configs,
  })),
  on(loadingSystemConfigurationsFail, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  }))
);

export function systemConfigsReducer(state, action): SystemConfigsState {
  return reducer(state, action);
}
