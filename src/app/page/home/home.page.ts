import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertController, IonicModule} from "@ionic/angular";
import {Task} from "../../models/task";
import {CommonModule} from "@angular/common";
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonButton, IonIcon,
  IonList, IonLabel, IonCheckbox,
  IonSegment, IonSegmentButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonSelect, IonSelectOption, IonChip, IonRippleEffect
} from '@ionic/angular/standalone';
import { v4 as uuid } from 'uuid';
import {TaskService} from "../../service/task.service";
import {CategoryService} from "../../service/category.service";
import {RemoteconfigService} from "../../service/remoteconfig.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
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
})
export class HomePage {
  showCategories = false;
  categoryForm: FormGroup;
  taskForm: FormGroup;
  allTasks: any[] = [];
  tasks: any[] = [];
  categories: any[] = [];
  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private alertCtrl: AlertController,
    private remoteConfig: RemoteconfigService,
    private fb: FormBuilder,

  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      categoryId: ['']
    });
  }

  async ngOnInit() {
    await this.remoteConfig.init();
    this.showCategories = this.remoteConfig.showCategories;

    this.categoryService.categories$.subscribe(categories => {
      this.categories = categories;
    });

    await this.taskService.loadTasks();
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.allTasks = tasks;
    });

  }

  async addCategory() {
    if (this.categoryForm.invalid) return;
    await this.categoryService.addCategory({
      id: uuid(),
      name: this.categoryForm.value.name
    });

    this.categoryForm.reset({
      name: ''
    });
  }


  async addTask() {
    if (this.taskForm.invalid) return;
    const form = this.taskForm.value;
    const task: Task = {
      id: uuid(),
      title: form.title,
      completed: false,
      categoryId: form.categoryId || undefined,
      createdAt: new Date()
    };

    await this.taskService.addTask(task);

    this.taskForm.reset({
      title: '',
      categoryId: ''
    });
  }
  trackByTaskId(index: number, task: any) {
    return task.id;
  }
  async toggleTask(id: string) {
    await this.taskService.toggleTask(id);
  }

  async deleteTask(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Tarea',
      message: 'Si eliminas esta tarea.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.taskService.deleteTask(id);
            await alert.dismiss();
            return true;
          }
        }
      ]
    });
    await alert.present();
  }


  async filterTasks(categoryId: string) {
    await this.taskService.filterByCategory(categoryId);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }

  trackByCategoryId(index: number, cat: any) {
    return cat.id;
  }
  async deleteCategory(id: string) {

    const alert = await this.alertCtrl.create({
      header: 'Eliminar categoría',
      message: 'Si eliminas esta categoría, también se eliminarán sus tareas.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {

            await this.taskService.deleteTasksByCategoryId(id);

            await this.categoryService.deleteCategory(id);

            await alert.dismiss();

            return true;
          }
        }
      ]
    });

    await alert.present();
  }
  async editCategory(category: any) {

    const alert = await this.alertCtrl.create({
      header: 'Editar categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: category.name,
          placeholder: 'Nombre de categoría'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {

            if (!data.name.trim()) {
              return false;
            }
            await this.categoryService.updateCategory({
              ...category,
              name: data.name
            });
            await alert.dismiss();
            return true;
          }
        }
      ]
    });

    await alert.present();
  }
}
