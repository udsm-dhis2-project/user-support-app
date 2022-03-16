import { SystemConfigsModel } from 'src/app/shared/models/system-configurations.model';
import { BaseState, initialBaseState } from './base.state';

export interface SystemConfigsState extends BaseState {
  configs: SystemConfigsModel;
}

export const initialSystemConfigsState: SystemConfigsState = {
  ...initialBaseState,
  configs: null,
};
