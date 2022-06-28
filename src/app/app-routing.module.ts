import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './main/pages/home/home.component';
import { PortfolioComponent } from './main/pages/portfolio/portfolio.component';
import { AllComponent } from './main/pages/all/all.component';
import { HistoryComponent } from './main/pages/history/history.component';
import { DetailsComponent } from './main/pages/details/details.component';
import { ErrorComponent } from './main/pages/error/error.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: '#',
    component: HomeComponent,
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
  },
  {
    path: 'portfolio/:id',
    component: PortfolioComponent,
  },
  {
    path: 'all',
    component: AllComponent,
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
  },
  {
    path: 'history',
    component: HistoryComponent,
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: 'error/:code/:message',
    component: ErrorComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
