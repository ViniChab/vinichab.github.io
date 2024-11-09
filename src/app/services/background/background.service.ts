import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  public showOverlay$: BehaviorSubject<boolean | undefined> =
    new BehaviorSubject<boolean | undefined>(undefined);

  constructor() {
    const showOverlay = localStorage.getItem('showOverlay') === 'true';
    this.showOverlay$.next(showOverlay);
  }

  public toggleBackgroundOverlay(): void {
    const showOverlay = !this.showOverlay$.value;

    localStorage.setItem('showOverlay', showOverlay.toString());
    this.showOverlay$.next(showOverlay);
  }
}
