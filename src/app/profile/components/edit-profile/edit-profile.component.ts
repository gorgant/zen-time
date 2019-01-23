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

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  loading$: Observable<boolean>;
  appUser$: Observable<AppUser>;
  defaultProfileImage = imageUrls.PROFILE_DEFAULT_IMAGE;
  @ViewChild('matButton') matButton;
  @ViewChild('matButton2') matButton2;
  @ViewChild('fileInput') fileInput: ElementRef;

  profileImage: File;
  imageUploadProgress$: Observable<number>;
  imageUploadUrl$: Observable<string>;

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

    this.loading$ = this.store$.select(
      UserStoreSelectors.selectUserIsLoading
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

  onChooseFile(event) {
    const file: File = event.target.files[0];
    if (file) {
      this.checkImgDimensions(file) // This is an async operation using the file reader, so do it first
        .then(validImageSize => {
          if (file.type.split('/')[0] !== 'image') {
            // Confirm file is an image
            this.uiService.showSnackBar('Invalid file type. File must be a standard image format.', null, 3000);
            this.renderer.setProperty(this.fileInput.nativeElement, 'value', '');
            this.profileImage = null;
          } else if (file.size > 4000000) {
            // Confirm file size is less than 4 MB
            this.uiService.showSnackBar('File too large.  Must be less than 4 MB.', null, 3000);
            this.renderer.setProperty(this.fileInput.nativeElement, 'value', '');
            this.profileImage = null;
          } else if (!validImageSize) {
            // Confirms file is a square
            this.uiService.showSnackBar('Image dimensions must be square (image height must equal its width)', null, 3000);
            this.renderer.setProperty(this.fileInput.nativeElement, 'value', '');
            this.profileImage = null;
          } else {
            this.profileImage = file;
          }
        });
    }

  }

  onUploadImage() {
    if (this.profileImage) {
      this.appUser$
        .pipe(take(1))
        .subscribe(user => {
          this.store$.dispatch(new UserStoreActions.UpdateProfileImageRequested({imageFile: this.profileImage, user: user }));
          this.imageUploadProgress$ = this.userService.imageUploadPercentage;
          this.profileImage = null;
        });
    } else {
      this.uiService.showSnackBar('You must first choose a file to upload.', null, 3000);
    }
  }

  private async checkImgDimensions(file: File): Promise<boolean> {
    let validImage: boolean;
    const readFile = (fileToRead) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image;
      reader.onload = () => {
        img.src = <string>reader.result;
        // Return the image with the source
        return resolve(img);
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileToRead);  // or a different mode
    });
    let loadedImage = new Image;
    loadedImage = await <any>readFile(file);
    if (loadedImage.height === loadedImage.width) {
      validImage = true;
    } else {
      validImage = false;
    }
    return validImage;
  }

}
