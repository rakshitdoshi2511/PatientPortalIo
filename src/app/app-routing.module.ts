import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)},
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)},
  { path: 'laboratory', loadChildren: () => import('./laboratory/laboratory.module').then( m => m.LaboratoryPageModule)},
  { path: 'nutrition',  loadChildren: () => import('./nutrition/nutrition.module').then( m => m.NutritionPageModule)},
  { path: 'radiology',  loadChildren: () => import('./radiology/radiology.module').then( m => m.RadiologyPageModule)},
  { path: 'medical-reports',  loadChildren: () => import('./medical-reports/medical-reports.module').then( m => m.MedicalReportsPageModule)},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
