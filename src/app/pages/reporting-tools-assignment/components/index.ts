import { FacilitiesListComponent } from './facilities-list/facilities-list.component';
import { FeedbackContainerComponent } from './feedback-container/feedback-container.component';
import { FeedbacksListComponent } from './feedbacks-list/feedbacks-list.component';
import { RejectedFormRequestsSummaryComponent } from './rejected-form-requests-summary/rejected-form-requests-summary.component';
import { RequestFormModalComponent } from './request-form-modal/request-form-modal.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { RespondFeedbackComponent } from './respond-feedback/respond-feedback.component';

export const toolsComponents: any[] = [
  FacilitiesListComponent,
  RequestFormModalComponent,
  RequestFormComponent,
  FeedbackContainerComponent,
  FeedbacksListComponent,
  RespondFeedbackComponent,
  RejectedFormRequestsSummaryComponent,
];

export const toolsEntryComponents: any[] = [
  RequestFormModalComponent,
  RespondFeedbackComponent,
];
