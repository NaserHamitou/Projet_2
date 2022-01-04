import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlaceCommand } from '@app/classes/commands/place-command';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GameOptionsComponent } from '@app/pages/game-options/game-options.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { BonusDisplayComponent } from './components/bonus-display/bonus-display.component';
import { CommunicationBoxComponent } from './components/communication-box/communication-box.component';
import { GameOverComponent } from './components/game-over/game-over.component';
import { GridComponent } from './components/grid/grid.component';
import { PanneauInfoComponent } from './components/info-pannel/panneau-info.component';
import { LetterHolderComponent } from './components/letter-holder/letter-holder.component';
import { LettersAreaComponent } from './components/letters-area/letters-area.component';
import { RoomManagerComponent } from './components/room-manager/room-manager.component';
import { SettingsComponent } from './components/settings/settings.component';
import { VirtualPlayerComponent } from './components/virtual-player/virtual-player.component';
import { NewGameComponent } from './new-game/new-game.component';
import { LoadingPageComponent } from './pages/loading-page/loading-page.component';
import { BonusTest } from './services/objectives/classes/bonus-test';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { DictionaryUploadComponent } from './components/dictionary-upload/dictionary-upload.component';
import { ResetSystemDataComponent } from './components/reset-system-data/reset-system-data.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        GridComponent,
        PanneauInfoComponent,
        CommunicationBoxComponent,
        GameOptionsComponent,
        NewGameComponent,
        GameOptionsComponent,
        LettersAreaComponent,
        LetterHolderComponent,
        GameOptionsComponent,
        GameOverComponent,
        RoomManagerComponent,
        VirtualPlayerComponent,
        LoadingPageComponent,
        SettingsComponent,
        BonusDisplayComponent,
        AdminPageComponent,
        DictionaryUploadComponent,
        ResetSystemDataComponent,
    ],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MatGridListModule,
        DragDropModule,
        FormsModule,
        BrowserModule,
        FormsModule,
    ],
    providers: [PlaceCommand, BonusTest],
    bootstrap: [AppComponent],
})
export class AppModule {}
