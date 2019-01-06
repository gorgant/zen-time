import { Component, OnInit } from '@angular/core';
import { imageUrls } from 'src/app/shared/assets/imageUrls';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  defaultProfileImage = imageUrls.PROFILE_DEFAULT_IMAGE;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }

  onLogout() {
    this.authService.logout();
  }

}
