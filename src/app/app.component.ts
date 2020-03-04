import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { UrlDialogComponent } from './url-dialog/url-dialog.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  resultsByValue: { value: string, isFull: boolean }[];
  resultsByKey: { value: string, isFull: boolean }[];
  jsonObject: JSON;
  isMobile: boolean;
  isLoading: boolean;
  isFullMatch: boolean;
  panelOpenState: boolean;
  isImage: boolean;
  domain = 'https://assets-es-staging2.myvdf.aws.cps.vodafone.com';

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent);
    this.firstFormGroup = this.formBuilder.group({
      json: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      text: ['', Validators.required]
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UrlDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(url => {
      this.isLoading = true;
      this.http.get(url).subscribe(data => {
        this.isLoading = false;
        this.firstFormGroup.controls.json.setValue(JSON.stringify(data));
      }, err => {
        this.isLoading = false;
        this.openSnackBar('Please Enter Valid URL, Try Again!', 'Ok');
      });
    });
  }



  checkJSON(stepper: MatStepper) {
    const value = this.firstFormGroup.controls.json.value;
    /** convert normal object no JSON format */
    try {
      this.jsonObject = JSON.parse(value);
      stepper.next();
    } catch {
      this.openSnackBar('Please Enter Valid JSON', 'Ok');
    }
  }

  search(isFullMatch?: boolean) {
    this.isFullMatch = isFullMatch;
    this.resultsByValue = [];
    this.resultsByKey = [];
    const enteredValue: string = this.secondFormGroup.controls.text.value;
    this.isImage = ['.jpg', '.png', '.gif', 'jpeg'].includes(enteredValue.substr(enteredValue.lastIndexOf('.')));
    this.getObjectPathsByValue(this.jsonObject, enteredValue);
    this.getObjectPathsByKey(this.jsonObject, enteredValue);
  }

  getObjectPathsByValue(obj: any, val: string, currentPath = 'root') {
    if (obj) {
      const keys = Object.keys(obj);
      keys.forEach(key => {
        if (key) {
          if (obj[key] &&
            ((this.isFullMatch && obj[key] === val)
              ||
              (!this.isFullMatch && obj[key].toString().includes(val)))) {
            const fullKey = currentPath + '.' + key;
            this.resultsByValue.push({ value: fullKey.substr(5), isFull: obj[key] === val });
          } else if (typeof obj[key] === 'object') {
            return this.getObjectPathsByValue(obj[key], val, currentPath + '.' + key);
          }
        }
      });
    }
    return;
  }
  getObjectPathsByKey(obj: any, val: string, currentPath = 'root') {
    if (obj) {
      const keys = Object.keys(obj);
      keys.forEach(key => {
        if (key) {
          if (obj[key] &&
            ((this.isFullMatch && key === val)
              ||
              (!this.isFullMatch && key.toString().includes(val)))) {
            const fullKey = currentPath + '.' + key;
            this.resultsByKey.push({ value: fullKey.substr(5), isFull: key === val });
          } else if (typeof obj[key] === 'object') {
            return this.getObjectPathsByKey(obj[key], val, currentPath + '.' + key);
          }
        }
      });
    }
    return;
  }

  addToClipboard(el: HTMLInputElement, result: string) {
    el.value = result;
    el.select();
    document.execCommand('copy');
    el.setSelectionRange(0, 0);
    this.openSnackBar('Copied', 'Ok');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
