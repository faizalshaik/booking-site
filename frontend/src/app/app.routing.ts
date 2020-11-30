import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PagesComponent } from './pages/pages.component';
import { BlankComponent } from './pages/blank/blank.component';


export const routes: Routes = [
  {
    path: '', 
    component: PagesComponent,
    children:[
      // { path: '', loadChildren: './pages/dashboard/dashboard.module#DashboardModule', data: { breadcrumb: 'Dashboard' }  },      
      { path: '', loadChildren: './pages/booking/booking.module#BookingModule', data: { breadcrumb: 'Booking' } },      
      { path: 'booking', loadChildren: './pages/booking/booking.module#BookingModule', data: { breadcrumb: 'Booking' } },
      { path: 'blank', component: BlankComponent, data: { breadcrumb: 'Blank page' } }
    ]
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterModule' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
   preloadingStrategy: PreloadAllModules,  // <- comment this line for enable lazy load
  // useHash: true
});