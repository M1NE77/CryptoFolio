import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table'
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { ToolbarModule } from 'primeng/toolbar';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { HomeComponent } from './pages/home/home.component';
import { AllComponent } from './pages/all/all.component';
import { DetailsComponent } from './pages/details/details.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { HistoryComponent } from './pages/history/history.component';
import { ErrorComponent } from './pages/error/error.component';

@NgModule({
  declarations: [
    HomeComponent,
    AllComponent,
    DetailsComponent,
    PortfolioComponent,
    HistoryComponent,
    ErrorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    PaginatorModule,
    ProgressSpinnerModule,
    DialogModule,
    ButtonModule,
    BrowserAnimationsModule,
    InputTextModule,
    ChartModule,
    ConfirmDialogModule,
    FieldsetModule,
    ToolbarModule,
    ToggleButtonModule
  ],
  exports: [
    HomeComponent,
    AllComponent,
    DetailsComponent,
    PortfolioComponent,
    HistoryComponent,
  ]
})
export class MainModule { }
