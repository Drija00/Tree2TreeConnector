import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';

export const routes: Routes = [ 
    {
      path: '',
      redirectTo: "main",
      pathMatch: 'full'
    },
   // upload
    //{path:'unos-racuna', component:UnosRacunaComponent, canActivate:[AuthGuard], canDeactivate:[CanDeactivateGuard]}
    {path: 'main', component: MainComponent}
];
