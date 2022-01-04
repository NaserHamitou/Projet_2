import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameOverComponent } from '@app/components/game-over/game-over.component';
import { RoomManagerComponent } from '@app/components/room-manager/room-manager.component';
import { NewGameComponent } from '@app/new-game/new-game.component';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { GameOptionsComponent } from '@app/pages/game-options/game-options.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { LoadingPageComponent } from '@app/pages/loading-page/loading-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/game-options', pathMatch: 'full' },
    { path: 'home', component: GameOptionsComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'game-options', component: MainPageComponent },
    { path: 'new-game', component: NewGameComponent },
    { path: 'game-over', component: GameOverComponent },
    { path: 'roomManager', component: RoomManagerComponent },
    { path: 'connection', component: LoadingPageComponent },
    { path: 'admin', component: AdminPageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
