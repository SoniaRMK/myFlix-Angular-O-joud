import { Component, Inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-synopsis-info',
  standalone: true,
  templateUrl: './synopsis-info.component.html',
  styleUrls: ['./synopsis-info.component.scss'], // Fixed typo: changed 'styleUrl' to 'styleUrls'
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
  ],
})
export class SynopsisInfoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SynopsisInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Description: string }
  ) {}

  ngOnInit(): void {
    console.log('Synopsis Description:', this.data.Description);
  }
}
