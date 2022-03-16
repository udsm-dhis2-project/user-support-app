import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../../environments/environment';
import { SystemConfigsState } from '../states/system-configurations.state';
import { SystemInfoState } from '../states/system-info.state';
import { UserState } from '../states/user.state';
import { systemConfigsReducer } from './system-configurations.reducer';
import { systemInfoReducer } from './system-info.reducer';
import { userReducer } from './user.reducer';

export interface State {
  user: UserState;
  systemInfo: SystemInfoState;
  router: RouterReducerState;
  systemConfigs: SystemConfigsState;
}

export const reducers: ActionReducerMap<State> = {
  user: userReducer,
  systemInfo: systemInfoReducer,
  router: routerReducer,
  systemConfigs: systemConfigsReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [storeFreeze]
  : [];

/**
 * Root state selector
 */
export const getRootState = (state: State) => state;
