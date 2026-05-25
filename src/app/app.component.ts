import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {SpinnerComponent} from "./shared/spinner/spinner.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, SpinnerComponent],
  standalone: true,
})
export class AppComponent {
  constructor() {}
}
