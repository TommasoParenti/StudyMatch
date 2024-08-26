import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { finalize, Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore, private auth: AngularFireAuth) {}

  async uploadProfileImage(file: File): Promise<string> {
    try {
      const user: any = await this.auth.currentUser;
      if (!user) {
        throw new Error('User non autenticato');
      }
      var newFile = new File([file], user.uid, {
        type: file.type, 
        lastModified: file.lastModified,
      }); 
      const filePath = `profileImages/${newFile.name}`;
      const fileRef =  await this.storage.ref(filePath);
      const task = await this.storage.upload(filePath, newFile);
      const downloadURL = await firstValueFrom(fileRef.getDownloadURL());
      await this.firestore.collection('user').doc(user.uid).set({profileImageURL: downloadURL}, { merge: true });
      return downloadURL;
    } catch (error) {
      throw error;
    }
  }
}
