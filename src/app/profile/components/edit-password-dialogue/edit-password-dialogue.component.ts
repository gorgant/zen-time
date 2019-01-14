import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordFormValidationMessages } from 'src/app/shared/models/validation-messages.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { pwMustMatchValidator, pwMustNotMatchValidator } from '../../validators/pw-match-validator.directive';

@Component({
  selector: 'app-edit-password-dialogue',
  templateUrl: './edit-password-dialogue.component.html',
  styleUrls: ['./edit-password-dialogue.component.scss']
})
export class EditPasswordDialogueComponent implements OnInit {

  passwordForm: FormGroup;
  PASSWORD_FORM_VALIDATION_MESSAGES = PasswordFormValidationMessages;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditPasswordDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private appUser: AppUser,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      updatedPwGroup: this.fb.group({
        newPassword: ['', Validators.required],
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

    this.authService.updatePassword(this.appUser, oldPassword, newPassword);

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
