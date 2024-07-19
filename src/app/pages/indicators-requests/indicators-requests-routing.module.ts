import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndicatorsRequestsHomeComponent } from './pages/indicators-requests-home/indicators-requests-home.component';
const routes: Routes = [
  {
    path: '',
    component: IndicatorsRequestsHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorsRoutingModule {}
