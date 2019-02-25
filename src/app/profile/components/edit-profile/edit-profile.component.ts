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
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import { Bounds } from 'ngx-img-cropper/lib/image-cropper/model/bounds';

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

  croppedImageContainer: any;
  cropperSettings1: CropperSettings;
  croppedWidth: number;
  croppedHeight: number;

  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  showCropper = false;
  croppedImage: any = null;
  profileImageLoading$: Observable<boolean>;
  imageUploadProgress$: Observable<number>;

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

    this.setCropperToolSettings();
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

  onCropEvent(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;
    this.croppedImage = this.croppedImageContainer.image;
  }

  fileChangeListener($event) {
    const file: File = $event.target.files[0];

    // Check if file is image
    if (file.type.match('image.*')) {
      const image: any = new Image();
      const myReader: FileReader = new FileReader();
      myReader.onloadend = (loadEvent: any) => {
        image.src = loadEvent.target.result;
        this.cropper.setImage(image);
        this.showCropper = true;
      };
      myReader.readAsDataURL(file);
    } else {
      this.uiService.showSnackBar('Image failed to load. Please make sure the file is a valid image.', null, 5000);
    }
  }

  onUploadImage() {
    if (this.croppedImage) {
      const imageToUpload = this.dataURLtoBlob(this.croppedImage);
      this.appUser$
        .pipe(take(1))
        .subscribe(user => {
          // Dispatch the image to the store
          this.store$.dispatch(new UserStoreActions.UpdateProfileImageRequested({imageFile: imageToUpload, user: user }));
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

  private setCropperToolSettings() {
    this.cropperSettings1 = new CropperSettings();

    this.cropperSettings1.canvasWidth = 200;
    this.cropperSettings1.canvasHeight = 200;
    this.cropperSettings1.width = 200;
    this.cropperSettings1.height = 200;

    this.cropperSettings1.croppedWidth = 100;
    this.cropperSettings1.croppedHeight = 100;



    this.cropperSettings1.minWidth = 50;
    this.cropperSettings1.minHeight = 50;
    this.cropperSettings1.rounded = true;
    this.cropperSettings1.keepAspect = true;

    this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;

    this.cropperSettings1.fileType = 'image/jpeg';

    this.cropperSettings1.markerSizeMultiplier = 0.5;

    // Use custom fileChangeListener on my own input in template
    this.cropperSettings1.noFileInput = true;

    this.croppedImageContainer = {};
  }

  // Courtesy of https://stackoverflow.com/a/30407959/6572208
  private dataURLtoBlob(dataurl): Blob {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }

}
