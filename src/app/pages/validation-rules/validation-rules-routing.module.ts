import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValidationRulesRequestComponent } from './pages/validation-rules-request/validation-rules-request.component';
const routes: Routes = [
  {
    path: '',
    component: ValidationRulesRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidationRulesRequestRoutingModule {}
