import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValidationRulesHomeComponent } from './pages/validation-rules-home/validation-rules-home.component';
const routes: Routes = [
  {
    path: '',
    component: ValidationRulesHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidationRulesRequestRoutingModule {}
