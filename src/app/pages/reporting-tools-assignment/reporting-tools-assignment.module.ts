import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { reportingToolsAssignmentPages } from './pages';
import { ReportingToolsAssignmentRoutingModule } from './reporting-tools-assignment-routing.module';
import { toolsComponents, toolsEntryComponents } from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [...reportingToolsAssignmentPages, ...toolsComponents],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ReportingToolsAssignmentRoutingModule,
    ]
})
export class ReportingToolsAssignmentModule {}
