import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EditNameDialogueComponent } from './components/edit-name-dialogue/edit-name-dialogue.component';

@NgModule({
  declarations: [
    ProfileComponent,
    EditProfileComponent,
    EditNameDialogueComponent
  ],
  imports: [
    SharedModule,
    ProfileRoutingModule
  ],
  entryComponents: [
    EditNameDialogueComponent
  ]
})
export class ProfileModule { }
