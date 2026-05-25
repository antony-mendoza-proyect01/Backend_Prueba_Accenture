import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem, IonLabel, IonList, IonRippleEffect, IonSegment, IonSegmentButton, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonButton, IonIcon,
    IonList, IonLabel, IonCheckbox,
    IonSegment, IonSegmentButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonSelect, IonSelectOption, IonChip, IonRippleEffect
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonButton, IonIcon,
    IonList, IonLabel, IonCheckbox,
    IonSegment, IonSegmentButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonSelect, IonSelectOption, IonChip, IonRippleEffect
  ]
})
export class SharedModule { }
