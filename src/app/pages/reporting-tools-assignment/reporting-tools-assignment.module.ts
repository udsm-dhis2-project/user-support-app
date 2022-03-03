import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { reportingToolsAssignmentPages } from './pages';
import { ReportingToolsAssignmentRoutingModule } from './reporting-tools-assignment-routing.module';

@NgModule({
  declarations: [...reportingToolsAssignmentPages],
  imports: [CommonModule, SharedModule, ReportingToolsAssignmentRoutingModule],
})
export class ReportingToolsAssignmentModule {}
