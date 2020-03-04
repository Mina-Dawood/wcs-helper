import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-url-dialog',
  templateUrl: './url-dialog.component.html',
  styleUrls: ['./url-dialog.component.scss']
})
export class UrlDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UrlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public URL: string) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
