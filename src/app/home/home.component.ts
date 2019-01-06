import { Component, OnInit } from '@angular/core';
import { imageUrls } from '../shared/assets/imageUrls';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  defaultProfileImage = imageUrls.PROFILE_DEFAULT_IMAGE;

  constructor() { }

  ngOnInit() {
  }

}
