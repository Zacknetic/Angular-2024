// In your Angular app routing module (app-routing.module.ts)
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './room/room.component';
import { LobbyComponent } from './lobby/lobby.component';

export const routes: Routes = [
    { path: 'lobby', component: LobbyComponent },
    { path: 'room/:id', component: RoomComponent },
    { path: '', redirectTo: '/lobby', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
