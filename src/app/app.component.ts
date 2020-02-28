import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  // @ViewChild('resultElement', { static: false }) resultElement: ElementRef;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      json: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      text: ['', Validators.required]
    });
  }

  search() {
    this.results = []
    const value = this.firstFormGroup.controls.json.value;
    const json = JSON.parse(value);
    const enteredValue = this.secondFormGroup.controls.text.value;
    this.getObjectPaths(json, enteredValue);
  }

  getObjectPaths(obj: any, val: string, currentPath = 'root') {
    if (obj) {
      const keys = Object.keys(obj);
      keys.forEach((key, index) => {
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
  }
}
