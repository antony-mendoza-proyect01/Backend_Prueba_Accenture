import { inject,Injectable } from '@angular/core';
import {collection, deleteDoc, doc, Firestore, onSnapshot, setDoc, updateDoc} from "@angular/fire/firestore";
import {BehaviorSubject} from "rxjs";
import {Task} from "../models/task";
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private firestore = inject(Firestore);
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor() {
    this.loadTasks();
  }

  loadTasks() {

    const ref = collection(this.firestore, 'tasks');
    onSnapshot(ref, snapshot => {
      const tasks: Task[] = snapshot.docs.map(doc => ({
        ...(doc.data() as Task),
        id: doc.id
      }));

      this.tasksSubject.next(tasks);
    });
  }

  async addTask(task: Task) {
    const ref = doc(this.firestore, `tasks/${task.id}`);
    await setDoc(ref, task);
  }

  async toggleTask(id: string) {
    const task = this.tasksSubject.value.find(t => t.id === id);
    if (!task) return;

    const ref = doc(this.firestore, `tasks/${id}`);

    await updateDoc(ref, {
      completed: !task.completed
    });
  }

  async deleteTask(id: string) {
    const ref = doc(this.firestore, `tasks/${id}`);
    await deleteDoc(ref);
  }

  async deleteTasksByCategoryId(categoryId: string) {
    const tasks = this.tasksSubject.value.filter(t => t.categoryId === categoryId);
    for (const task of tasks) {
      const ref = doc(this.firestore, `tasks/${task.id}`);
      await deleteDoc(ref);
    }
  }

  async filterByCategory(categoryId: string) {
    if (!categoryId) {
      this.loadTasks();
      return;
    }

    const filtered = this.tasksSubject.value.filter(t => t.categoryId === categoryId);
    this.tasksSubject.next(filtered);
  }
}
