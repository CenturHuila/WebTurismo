import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';


const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full'},

  { path: "auth", loadChildren:() => import("./modules/auth/auth.module").then((m) => m.AuthModule)},

  { path: "home", loadChildren:() => import("./modules/home/home.module").then((m) => m.HomeModule)},

  { path: "admin-home", loadChildren:() => import("./modules/admin-home/admin-home.module").then((m) => m.AdminHomeModule)},

  { path: '**', redirectTo: 'auth', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy:QuicklinkStrategy})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
