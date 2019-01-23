import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { passwordFormValidationMessages } from 'src/app/shared/models/validation-messages.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { pwMustMatchValidator, pwMustNotMatchValidator } from '../../validators/pw-match-validator.directive';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreActions } from 'src/app/root-store';

@Component({
  selector: 'app-edit-password-dialogue',
  templateUrl: './edit-password-dialogue.component.html',
  styleUrls: ['./edit-password-dialogue.component.scss']
})
export class EditPasswordDialogueComponent implements OnInit {

  passwordForm: FormGroup;
  PASSWORD_FORM_VALIDATION_MESSAGES = passwordFormValidationMessages;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditPasswordDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private appUser: AppUser,
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      updatedPwGroup: this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ['', Validators.required]
      }, {validator: pwMustMatchValidator()})
    }, {validator: pwMustNotMatchValidator()});

    this.passwordForm.patchValue({
      email: this.appUser.email
    });
  }

  onSave() {

    const oldPassword: string = this.oldPassword.value;
    const newPassword: string = this.newPassword.value;

    this.store$.dispatch( new AuthStoreActions.UpdatePasswordRequested({
      appUser: this.appUser,
      oldPassword: oldPassword,
      newPassword: newPassword
    }));

    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close(false);
  }

  // These getters are used for easy access in the HTML template
  get oldPassword() { return this.passwordForm.get('oldPassword'); }
  get updatedPwGroup() { return this.passwordForm.get('updatedPwGroup'); }
  get newPassword() { return this.passwordForm.get('updatedPwGroup.newPassword'); }
  get confirmNewPassword() { return this.passwordForm.get('updatedPwGroup.confirmNewPassword'); }

}
