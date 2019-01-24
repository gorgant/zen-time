import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EditNameDialogueComponent } from './components/edit-name-dialogue/edit-name-dialogue.component';
import { EditPasswordDialogueComponent } from './components/edit-password-dialogue/edit-password-dialogue.component';
import { EditEmailDialogueComponent } from './components/edit-email-dialogue/edit-email-dialogue.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    ProfileComponent,
    EditProfileComponent,
    EditNameDialogueComponent,
    EditPasswordDialogueComponent,
    EditEmailDialogueComponent
  ],
  imports: [
    SharedModule,
    ProfileRoutingModule,
    ImageCropperModule
  ],
  entryComponents: [
    EditNameDialogueComponent,
    EditEmailDialogueComponent,
    EditPasswordDialogueComponent
  ]
})
export class ProfileModule { }
