import {inject, Injectable} from '@angular/core';
import {collection, deleteDoc, doc, Firestore, onSnapshot, setDoc, updateDoc} from "@angular/fire/firestore";
import {BehaviorSubject} from "rxjs";
import {Category} from "../models/category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private firestore = inject(Firestore);

  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.loadCategories();
  }

  loadCategories() {
    const ref = collection(this.firestore, 'categories');
    onSnapshot(ref, snapshot => {

      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];

      this.categoriesSubject.next(categories);
    });
  }

  async addCategory(category: Category) {
    const ref = doc(this.firestore, `categories/${category.id}`);
    await setDoc(ref, category);
  }

  async updateCategory(category: Category) {
    const ref = doc(this.firestore, `categories/${category.id}`);
    await updateDoc(ref, {
      name: category.name
    });
  }

  async deleteCategory(id: string) {
    const ref = doc(this.firestore, `categories/${id}`);
    await deleteDoc(ref);
  }
}
