import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject } from 'rxjs';

interface CheckboxPair {
  left: HTMLElement | null;
  leftName: string | null;
  right: HTMLElement | null;
  rightName: string | null;
  hidden: boolean;
  line: any;
}

@Injectable({
  providedIn: 'root'
})
export class DialogServiceService {

 // private pairsSource = new Subject<CheckboxPair[] | null>()
 
  private pairsSource = new Subject<void>();


 // private callFunctionSource = new Subject<void>();

  // Observable to listen to
  currentPairs = this.pairsSource.asObservable();

public lista: any 

  constructor() { }

  setData(data: CheckboxPair[]) {
    //this.pairsSource.next();
    console.log(data)
    this.lista = data;
    
  }

  getData(){
    return  this.lista;
  }

  // Method to trigger function call
  triggerFunctionCall() {
    console.log('upao u sercis')
    this.pairsSource.next();
  }
}
