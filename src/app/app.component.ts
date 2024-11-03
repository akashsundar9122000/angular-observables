import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);
  // interval = signal(0);
  // doubleInterval = computed(() => this.interval() * 2);
  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$, {initialValue:0});
  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0;
    const interval = setInterval(() =>{
      if(timesExecuted > 3){
        clearInterval(interval);
        subscriber.complete(); //to clean up the subscription
        return
      }
      console.log('emitting new value...');
      subscriber.next({message: 'New Value'}); //this will emit new value from observable every 2 seconds Now this next() will emit value that can be received when subscribe() this observable
      timesExecuted ++;
    },2000);
  });
  private destroyRef = inject(DestroyRef);

constructor(){
  // effect(() => { //automatically executes whenever signal used inside it updates.
  //   console.log( `clicked ${this.clickCount()} times.`)
  // })
}

  ngOnInit(): void {
    // setInterval(() =>{
    //   this.interval.update(prevInterval => prevInterval + 1);
    // })
    // const subscription = interval(1000).pipe(
    //   map((val) =>val*2)         //it is a function that takes function as a argument which will execute to all the emitted value from observable
    // ).subscribe({
    //   next: (val) => console.log(val)
    // });
    // this.destroyRef.onDestroy(()=>{
    //   subscription.unsubscribe();
    // })
    this.customInterval$.subscribe({
      next: (val) =>console.log(val), //this is the value that emitted
      complete: () => console.log("completed"), //to read that completed function
      error: (err) => console.log(err)
    });
    const subscription = this.clickCount$.subscribe({
      next: (val) =>{
        console.log( `clicked ${this.clickCount()} times.`)
      }
    });
    this.destroyRef.onDestroy(()=>{
        subscription.unsubscribe();
      });
  }

  onClick(){
    this.clickCount.update(oldCount => oldCount + 1);
  }
}
