import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'user-accounts',
    loadChildren: () =>
      import('../user-accounts/user-accounts.module').then(
        (m) => m.UserAccountsModule
      ),
  },
  {
    path: 'reporting-tools',
    loadChildren: () =>
      import(
        '../reporting-tools-assignment/reporting-tools-assignment.module'
      ).then((m) => m.ReportingToolsAssignmentModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
