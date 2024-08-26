import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(private firestore: AngularFirestore) {}

  addItemWOid(collectionName: string, data: any) {
    return this.firestore.collection(collectionName).add(data)
  }

  addItem(collectionName: string, docId:any , data: any) {
    return this.firestore.collection(collectionName).doc(docId).set(data)
  }

  getItems(collectionName: string): Observable<any[]> {
    return this.firestore.collection(collectionName).get().pipe(
      map(snapshot => snapshot.docs.map(doc => {
        const data = doc.data() as { [key: string]: any };
        const id = doc.id;
        return { id, ...data };
      }))
    );
  }

  getItem(collectionName: string, id: string): Observable<any> {
    return this.firestore.collection(collectionName).doc(id).valueChanges();
  }

  updateItem(collectionName: string, id: string, data: any) {
    return this.firestore.collection(collectionName).doc(id).update(data);
  }

  deleteItem(collectionName: string, id: string) {
    return this.firestore.collection(collectionName).doc(id).delete();
  }
}
