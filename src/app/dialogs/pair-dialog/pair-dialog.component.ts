import { Component, inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'app-pair-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './pair-dialog.component.html',
  styleUrl: './pair-dialog.component.css'
})
export class PairDialogComponent implements OnInit{
  data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    console.log(this.data)
  }
}
