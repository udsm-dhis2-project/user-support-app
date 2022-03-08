import { CreateMessageComponent } from './create-message/create-message.component';
import { MessagesModalComponent } from './messages-modal/messages-modal.component';

export const sharedComponents: any[] = [
  MessagesModalComponent,
  CreateMessageComponent,
];

export const sharedEntryComponents: any[] = [MessagesModalComponent];
