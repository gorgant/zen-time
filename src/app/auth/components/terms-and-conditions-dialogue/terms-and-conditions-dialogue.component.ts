import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-terms-and-conditions-dialogue',
  templateUrl: './terms-and-conditions-dialogue.component.html',
  styleUrls: ['./terms-and-conditions-dialogue.component.scss']
})
export class TermsAndConditionsDialogueComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<TermsAndConditionsDialogueComponent>
  ) { }

  ngOnInit() {
  }

}
