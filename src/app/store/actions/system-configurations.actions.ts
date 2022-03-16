import { createAction, props } from '@ngrx/store';
import { SystemConfigsModel } from 'src/app/shared/models/system-configurations.model';

export const loadSystemConfigurations = createAction(
  '[System Configs] load system configurations'
);

export const addLoadedSystemConfigs = createAction(
  '[System configs] add loaded system configs',
  props<{ configs: SystemConfigsModel }>()
);

export const loadingSystemConfigurationsFail = createAction(
  '[System Configs] loading system configs fails',
  props<{ error: any }>()
);
