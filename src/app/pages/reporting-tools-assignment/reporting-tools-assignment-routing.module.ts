import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportingToolsAssignmentHomeComponent } from './pages/reporting-tools-assignment-home/reporting-tools-assignment-home.component';

const routes: Routes = [
  {
    path: '',
    component: ReportingToolsAssignmentHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingToolsAssignmentRoutingModule {}
