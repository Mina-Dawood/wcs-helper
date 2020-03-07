import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getValueByPath'
})
export class GetValueByPathPipe implements PipeTransform {

  transform(obj: JSON, path: string): any {
    return this.getValueByPath(obj, path);
  }

  private getValueByPath(originalObject: any, filedPath: string) {
    const parts = filedPath.split('.');
    let obj = originalObject;
    parts.forEach((part, index) => {
      if (!obj[parts[index]]) {
        obj[parts[index]] = {};
      }
      obj = obj[parts[index]];
    });

    return obj;
  }

}
