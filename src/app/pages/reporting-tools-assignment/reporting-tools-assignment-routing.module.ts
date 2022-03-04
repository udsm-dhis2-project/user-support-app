import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportingToolsAssignmentHomeComponent } from './pages/reporting-tools-assignment-home/reporting-tools-assignment-home.component';
import { RequestToolAssignmentComponent } from './pages/request-tool-assignment/request-tool-assignment.component';

const routes: Routes = [
  {
    path: '',
    component: ReportingToolsAssignmentHomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'request',
        pathMatch: 'full',
      },
      {
        path: 'request',
        component: RequestToolAssignmentComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingToolsAssignmentRoutingModule {}
