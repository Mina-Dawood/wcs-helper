import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  results: string[];
  jsonObject: JSON;
  isMobile: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
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

  search() {
    this.results = [];
    const enteredValue = this.secondFormGroup.controls.text.value;
    this.getObjectPaths(this.jsonObject, enteredValue);
  }

  getObjectPaths(obj: any, val: string, currentPath = 'root') {
    if (obj) {
      const keys = Object.keys(obj);
      keys.forEach(key => {
        if (key) {
          if (obj[key] === val) {
            const fullKey = currentPath + '.' + key;
            this.results.push(fullKey.substr(5));
          } else if (typeof obj[key] === 'object') {
            return this.getObjectPaths(obj[key], val, currentPath + '.' + key);
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
