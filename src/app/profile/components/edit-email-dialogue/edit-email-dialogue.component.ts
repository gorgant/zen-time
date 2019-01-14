import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailFormValidationMessages } from 'src/app/shared/models/validation-messages.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-edit-email-dialogue',
  templateUrl: './edit-email-dialogue.component.html',
  styleUrls: ['./edit-email-dialogue.component.scss']
})
export class EditEmailDialogueComponent implements OnInit {

  emailForm: FormGroup;
  EMAIL_FORM_VALIDATION_MESSAGES = EmailFormValidationMessages;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditEmailDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private appUser: AppUser,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.emailForm.patchValue({
      email: this.appUser.email
    });
  }

  onSave() {

    console.log('Update email to:', this.email.value, );

    const password: string = this.password.value;
    const newEmail: string = this.email.value;

    this.authService.updateEmail(this.appUser, password, newEmail);

    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close(false);
  }

  // These getters are used for easy access in the HTML template
  get password() { return this.emailForm.get('password'); }
  get email() { return this.emailForm.get('email'); }

}
