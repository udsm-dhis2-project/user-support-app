import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAccountsHomeComponent } from './pages/user-accounts-home/user-accounts-home.component';

const routes: Routes = [
  {
    path: '',
    component: UserAccountsHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAccountsRoutingModule {}
