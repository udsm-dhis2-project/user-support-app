import { DatasetCategoriesComponent } from './dataset-categories/dataset-categories.component';
import { DatasetsListComponent } from './datasets-list/datasets-list.component';
import { FacilitiesListComponent } from './facilities-list/facilities-list.component';
import { FeedbackContainerComponent } from './feedback-container/feedback-container.component';
import { FeedbacksListComponent } from './feedbacks-list/feedbacks-list.component';
import { OuSelectionFormRequestModalComponent } from './ou-selection-form-request-modal/ou-selection-form-request-modal.component';
import { ProgramsListComponent } from './programs-list/programs-list.component';
import { RejectedFormRequestsSummaryComponent } from './rejected-form-requests-summary/rejected-form-requests-summary.component';
import { RequestFormModalComponent } from './request-form-modal/request-form-modal.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { RespondFeedbackComponent } from './respond-feedback/respond-feedback.component';
import { SelectionFilterComponent } from './selection-filter/selection-filter.component';

export const toolsComponents: any[] = [
  FacilitiesListComponent,
  RequestFormModalComponent,
  RequestFormComponent,
  FeedbackContainerComponent,
  FeedbacksListComponent,
  RespondFeedbackComponent,
  RejectedFormRequestsSummaryComponent,
  DatasetsListComponent,
  OuSelectionFormRequestModalComponent,
  SelectionFilterComponent,
  DatasetCategoriesComponent,
  ProgramsListComponent,
];

export const toolsEntryComponents: any[] = [
  RequestFormModalComponent,
  RespondFeedbackComponent,
  OuSelectionFormRequestModalComponent,
];
