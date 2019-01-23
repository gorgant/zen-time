import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { resetPasswordFormValidationMessages } from 'src/app/shared/models/validation-messages.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreActions } from 'src/app/root-store';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password-dialogue.component.html',
  styleUrls: ['./reset-password-dialogue.component.scss']
})
export class ResetPasswordDialogueComponent implements OnInit {

  resetPasswordForm: FormGroup;
  RESET_PASSWORD_FORM_VALIDATION_MESSAGES = resetPasswordFormValidationMessages;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ResetPasswordDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private emailFromSignIn: string,
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    if (this.emailFromSignIn) {
      console.log('Patching in value');
      this.resetPasswordForm.patchValue({
        email: this.emailFromSignIn
      });
    }
  }

  onSubmit() {
    this.store$.dispatch(new AuthStoreActions.ResetPasswordRequested({email: this.email.value}));
    this.dialogRef.close();
  }

  // These getters are used for easy access in the HTML template
  get email() { return this.resetPasswordForm.get('email'); }

}
