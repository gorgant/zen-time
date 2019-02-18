import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors, UserStoreActions } from 'src/app/root-store';
import { imageUrls } from 'src/app/shared/assets/imageUrls';
import { take } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { EditNameDialogueComponent } from '../edit-name-dialogue/edit-name-dialogue.component';
import { EditEmailDialogueComponent } from '../edit-email-dialogue/edit-email-dialogue.component';
import { UserService } from 'src/app/shared/services/user.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  userLoading$: Observable<boolean>;
  appUser$: Observable<AppUser>;

  @ViewChild('matButton') matButton;
  @ViewChild('matButton2') matButton2;

  defaultProfileImage = imageUrls.PROFILE_DEFAULT_IMAGE;
  @ViewChild('cropperInput') cropperInput: ElementRef;
  imageUploadProgress$: Observable<number>;
  imageChangedEvent: any = '';
  croppedImage: any = null;
  showCropper = false;
  profileImageLoading$: Observable<boolean>;

  constructor(
    private store$: Store<RootStoreState.State>,
    private dialog: MatDialog,
    private userService: UserService,
    private uiService: UiService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.appUser$ = this.store$.select(
      UserStoreSelectors.selectAppUser
    );

    this.userLoading$ = this.store$.select(
      UserStoreSelectors.selectUserIsLoading
    );

    this.profileImageLoading$ = this.store$.select(
      UserStoreSelectors.selectProfileImageIsLoading
    );
  }

  onEditName() {
    // This hacky solution is required to remove ripple effect from menu icon after closing sidenav
    this.matButton._elementRef.nativeElement.blur();

    this.appUser$
      .pipe(take(1))
      .subscribe(user => {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';

        dialogConfig.data = user;

        const dialogRef = this.dialog.open(EditNameDialogueComponent, dialogConfig);
      });
  }

  onEditEmail() {
    // This hacky solution is required to remove ripple effect from menu icon after closing sidenav
    // Must be 'matButton' and #matButton
    this.matButton2._elementRef.nativeElement.blur();

    this.appUser$
      .pipe(take(1))
      .subscribe(user => {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';

        dialogConfig.data = user;

        const dialogRef = this.dialog.open(EditEmailDialogueComponent, dialogConfig);
      });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.file;
  }

  imageLoaded() {
      // show cropper tool
      this.showCropper = true;
  }

  loadImageFailed() {
      // show message
      this.uiService.showSnackBar('Image failed to load. Please make sure the image file is valid.', null, 5000);
  }

  onUploadImage() {
    if (this.croppedImage) {
      this.appUser$
        .pipe(take(1))
        .subscribe(user => {
          // Dispatch the image to the store
          this.store$.dispatch(new UserStoreActions.UpdateProfileImageRequested({imageFile: this.croppedImage, user: user }));
          // Track the image upload progress
          this.imageUploadProgress$ = this.userService.imageUploadPercentage;
          // Clear the input file once the image has been dispatched to server
          this.renderer.setProperty(this.cropperInput.nativeElement, 'value', '');
        });
    } else {
      this.uiService.showSnackBar('You must first choose a file to upload.', null, 3000);
    }

    // Once operation is done, hide cropper tool and clear temp image store
    this.showCropper = false;
    this.croppedImage = null;
  }

}
