import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ChroniclesComponent } from './pages/chronicles/chronicles.component';
import { NofoundComponent } from './pages/nofound/nofound.component';
import { ForgingComponent } from './pages/forging/forging.component';
import { CatacombsComponent } from './pages/catacombs/catacombs.component';
import { OracleComponent } from './pages/oracle/oracle.component';
import { AdventureComponent } from './pages/adventure/adventure.component';
import { usersGuard } from './guards/users.guard';
import { UserRole } from './models/commons.module';
import { ItemComponent } from './pages/item/item.component';
import { CodexComponent } from './pages/codex/codex.component';
import { TheSagaComponent } from './pages/the-saga/the-saga.component';
import { TheFeatComponent } from './pages/the-feat/the-feat.component';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    //canActivate: [usersGuard]
  },
  { path: 'chronicles', component: ChroniclesComponent },
  { path: 'chronicles/theSaga', component: TheSagaComponent },
  { path: 'chronicles/theFeat', component: TheFeatComponent, canDeactivate: [CanDeactivateGuard] },
  {
    path: 'forging',
    component: ForgingComponent,
    canActivate: [usersGuard],
    data: { requiredRole: UserRole.REGISTERED }
  },
  { path: 'catacombs', component: CatacombsComponent },
  { path: 'codex', component: CodexComponent },
  { path: 'oracle', component: OracleComponent },
  { path: 'forging', component: ForgingComponent },
  { path: 'adventure', component: AdventureComponent },
  /*{
    path: 'forging/:item', redirectTo: ({ params }) => {
      const errorHandler = inject(ErrorHandler);
      const itemForging = params['item'];
      if (itemForging) {
        return `/forging/${itemForging}`;
      } else {
        errorHandler.handleError(new Error('Attempted navigation to user page without user ID.'));
        return `/nofound`;
      }
    },
  },*/
  { path: 'forging/:item', component: ItemComponent },
  /*{
    path: 'catacombs/:item', redirectTo: ({ params }) => {
      const errorHandler = inject(ErrorHandler);
      const itemCatacombs = params['item'];
      if (itemCatacombs) {
        return `/catacombs/${itemCatacombs}`;
      } else {
        errorHandler.handleError(new Error('Attempted navigation to user page without user ID.'));
        return `/nofound`;
      }
    },
  },*/
  { path: 'catacombs/:item', component: ItemComponent },
  { path: 'nofound', component: NofoundComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
