import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {addIcons} from "ionicons";
import {checkmarkDoneOutline, trashOutline} from "ionicons/icons";
import {
  IonButton, IonCheckbox,
  IonContent, IonHeader,
  IonIcon,
  IonInput,
  IonItem, IonLabel,
  IonList, IonSegment, IonSegmentButton,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
interface Tarea {
  texto: string;
  completada: boolean;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonButton, IonIcon,
    IonList, IonLabel, IonCheckbox,
    IonSegment, IonSegmentButton
  ],
})
export class HomePage {
  nuevaTarea: string = '';
  filtro: string = 'todas';
  tareas: Tarea[] = [];
  tareasFiltradas: Tarea[] = [];

  constructor() {
    addIcons({ trashOutline, checkmarkDoneOutline });
  }

  agregarTarea() {
    const texto = this.nuevaTarea.trim();
    if (!texto) return;
    this.tareas.push({ texto, completada: false });
    this.nuevaTarea = '';
    this.aplicarFiltro();
  }

  eliminarTarea(tarea: Tarea) {
    this.tareas = this.tareas.filter(t => t !== tarea);
    this.aplicarFiltro();
  }

  cambiarFiltro() {
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (this.filtro === 'pendientes') {
      this.tareasFiltradas = this.tareas.filter(t => !t.completada);
    } else if (this.filtro === 'completadas') {
      this.tareasFiltradas = this.tareas.filter(t => t.completada);
    } else {
      this.tareasFiltradas = [...this.tareas];
    }
  }
}
