import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SMS {

  constructor(
    public http: Http
  ) {
    console.log('Hello SMS Provider');
  }

  SignupCode(Link,Mobile,Sender){
    let apiKey = 'SignupCode';
    let data = JSON.stringify({apiKey,Mobile,Sender});
    return this.http.post(Link,data);
   }

  
}
