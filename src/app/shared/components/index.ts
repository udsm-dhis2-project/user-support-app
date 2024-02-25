import { CapturePasswordComponent } from './capture-password/capture-password.component';
import { CreateMessageComponent } from './create-message/create-message.component';
import { MessagesModalComponent } from './messages-modal/messages-modal.component';
import { MultipleItemsSelectionComponent } from './multiple-items-selection/multiple-items-selection.component';

export const sharedComponents: any[] = [
  MessagesModalComponent,
  CreateMessageComponent,
  MultipleItemsSelectionComponent,
  CapturePasswordComponent,
];

export const sharedEntryComponents: any[] = [MessagesModalComponent];
