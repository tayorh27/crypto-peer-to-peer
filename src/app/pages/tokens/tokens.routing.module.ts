import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenTransactionsComponent } from './token-transactions/token-transactions.component';
import { TokensComponent } from './tokens.component';

const routes: Routes = [
  {
    path: '',
    component: TokensComponent
  },
  {
    path: ':id',
    component: TokensComponent
  },
  {
    path: ':id/:token',
    component: TokensComponent
  },
  {
    path: 'transaction',
    component: TokenTransactionsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TokensRoutingModule { }