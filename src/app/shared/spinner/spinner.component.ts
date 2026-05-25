import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {SpinnerService} from "../../service/spinner.service";

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class SpinnerComponent {
  loading$ = this.spinnerService.loading$;

  constructor(private spinnerService: SpinnerService) {}

}
