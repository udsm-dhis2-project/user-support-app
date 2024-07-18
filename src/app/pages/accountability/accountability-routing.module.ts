import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountabilityHomeComponent } from './pages/accountability-home/accountability-home.component';
const routes: Routes = [
  {
    path: '',
    component: AccountabilityHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountabilityRoutingModule {}
