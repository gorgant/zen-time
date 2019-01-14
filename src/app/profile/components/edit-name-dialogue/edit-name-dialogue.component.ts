import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreActions } from 'src/app/root-store';
import { NameFormValidationMessages } from 'src/app/shared/models/validation-messages.model';

@Component({
  selector: 'app-edit-name-dialogue',
  templateUrl: './edit-name-dialogue.component.html',
  styleUrls: ['./edit-name-dialogue.component.scss']
})
export class EditNameDialogueComponent implements OnInit {

  nameForm: FormGroup;
  NAME_FORM_VALIDATION_MESSAGES = NameFormValidationMessages;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditNameDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private appUser: AppUser,
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.nameForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.nameForm.patchValue({
      name: this.appUser.displayName
    });
  }

  onSave() {
    const updatedUser: AppUser = {
      ...this.appUser,
      displayName: this.name.value
    };
    this.store$.dispatch(new UserStoreActions.StoreUserDataRequested({userData: updatedUser, userId: this.appUser.id}));
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close(false);
  }

  // These getters are used for easy access in the HTML template
  get name() { return this.nameForm.get('name'); }

}
