import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { firstValueFrom, Observable } from 'rxjs';
import { LoggedService } from './logged.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, private login: LoggedService) {}

  async signUpWithEmail(email: string, password: string): Promise<void> {
    try {
      const usercr = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (usercr.user) {
        await usercr.user.sendEmailVerification();
        this.login.register();
      }
    } catch (error) {
      this.handleAuthErrors(error);
    }
  }

  async googleSignUp(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const usercr = await this.afAuth.signInWithPopup(provider);
      if (!usercr.additionalUserInfo.isNewUser) {
        throw new Error('Già registrato.');
      }
      if (usercr.user) {
        this.login.register();
      }
    } catch (error) {
      this.handleAuthErrors(error);
    }
  }

  async facebookSignUp(): Promise<void> {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      const usercr = await this.afAuth.signInWithPopup(provider);
      if (!usercr.additionalUserInfo.isNewUser) {
        throw new Error('Già registrato.');
      }
      if (usercr.user) {
        await usercr.user.sendEmailVerification();
        this.login.register();
      }
    } catch (error) {
      this.handleAuthErrors(error);
    }
  }

  async githubSignUp(): Promise<void> {
    try {
      const provider = new firebase.auth.GithubAuthProvider;
      const usercr = await this.afAuth.signInWithPopup(provider);
      if (!usercr.additionalUserInfo.isNewUser) {
        throw new Error('Già registrato.');
      }
      if (usercr.user) {
        this.login.register();
      }
    } catch (error) {
      this.handleAuthErrors(error);
    }
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    try {
      const usercr = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (!usercr.user?.emailVerified) {
        throw new Error('Per favore verifica la tua email per accedere.');
      }
      const data: any = await firstValueFrom(this.firestore.collection("user").doc(usercr.user.uid).valueChanges());
      if (!data?.completed) {
        this.login.register();
        throw new Error('Prima devi completare il profilo.');
      } else {
        this.login.login();
      }
    } catch (error) {
      this.handleAuthErrors(error);
    }
  }

  async googleSignIn(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const usercr = await this.afAuth.signInWithPopup(provider);
      if (!usercr.user?.emailVerified) {
        throw new Error('Per favore verifica la tua email per accedere.');
      } else if (usercr.additionalUserInfo.isNewUser) {
        await usercr.user.delete();
        throw new Error('Prima devi registrarti.');
      }
      const data: any = await firstValueFrom(this.firestore.collection("user").doc(usercr.user.uid).valueChanges());
      if (!data?.completed) {
        this.login.register();
        throw new Error('Prima devi completare il profilo.');
      } else {
        this.login.login();
      }
    } catch (error) {
      this.handleAuthErrors(error);
    }
  }

  async facebookSignIn(): Promise<void> {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      const usercr = await this.afAuth.signInWithPopup(provider);
      if (!usercr.user?.emailVerified) {
        throw new Error('Per favore verifica la tua email per accedere.');
      } else if (usercr.additionalUserInfo.isNewUser) {
        await usercr.user.delete();
        throw new Error('Prima devi registrarti.');
      }
      const data: any = await firstValueFrom(this.firestore.collection("user").doc(usercr.user.uid).valueChanges());
      if (!data?.completed) {
        
        this.login.register();
        throw new Error('Prima devi completare il profilo.');
      } else {
        this.login.login();
      }
    } catch (error) {
      this.handleAuthErrors(error);
    }
  }

  async githubSignIn(): Promise<void> {
    try {
      const provider = new firebase.auth.GithubAuthProvider();
      const usercr = await this.afAuth.signInWithPopup(provider);
      if (usercr.additionalUserInfo.isNewUser) {
        await usercr.user.delete();
        throw new Error('Prima devi registrarti.');
      }
      const data: any = await firstValueFrom(this.firestore.collection("user").doc(usercr.user.uid).valueChanges());
      if (!data?.completed) {
        this.login.register();
        throw new Error('Prima devi completare il profilo.');
      } else {
        this.login.login();
      }
    } catch (error) {
      this.handleAuthErrors(error);
    }
  }

  getUser(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      this.handleAuthErrors(error);
    }
  }

  async reset(email): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      this.handleAuthErrors(error);
    }
  }

  private handleAuthErrors(error: any) {
    switch (error.code) {
      case 'auth/argument-error':
        error.message = 'Errore nelle informazioni date.';
        break;
      case 'auth/credential-already-in-use':
        error.message = 'Credenziali già in uso.';
        break;
      case 'auth/email-already-in-use':
        error.message = 'Email già in uso.';
        break;
      case 'auth/internal-error':
        error.message = 'Errore interno al sistema.';
        break;
      case 'auth/weak-password':
        error.message = 'Password troppo debole.';
        break;
      case 'auth/too-many-requests':
        error.message = 'Troppi tentativi; riprova più tardi.';
        break;
      case 'auth/provider-already-linked':
        error.message = 'Già registrato.';
        break;
      case 'auth/invalid-email':
        error.message = 'Email non valida.';
        break;
      case 'auth/invalid-app-id':
        error.message = 'App id non valido.';
        break;
      case 'auth/invalid-user-token':
        error.message = 'User invalido.';
        break;
      case 'auth/missing-verification-id':
        error.message = 'Verifica ancora non completata.';
        break;
      case 'auth/unverified-email':
        error.message = 'Verifica via email ancora non completata.';
        break;
      case 'auth/invalid-credential':
        error.message = 'Credenziali invalide.';
        break;
      case 'auth/cancelled-popup-request':
        error.message = 'Annullata l\'operazione.';
        break;
      case 'auth/popup-closed-by-user':
        error.message = 'Annullata l\'operazione.';
        break;
      case 'auth/missing-email':
        error.message = 'Devi inserire un email nel campo email.';
        break;
      case 'auth/account-exists-with-different-credential':
        error.message = "L'account già esiste ma con delle credenziali o provider differente";
        break;
      case 'auth/network-request-failed':
        error.message = "Sei offline, ricarica la pagina";
        break;
    }         
    throw new Error(error.message);
  }
}
