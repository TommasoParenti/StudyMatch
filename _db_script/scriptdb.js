// Importa le funzioni necessarie da Firebase SDK
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, updateDoc } = require('firebase/firestore');

// Configura Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBIwDasolZhudDZZaVa2vyJyryW3ERI_sE",
  authDomain: "studymatch-99924.firebaseapp.com",
  databaseURL: "https://studymatch-99924-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "studymatch-99924",
  storageBucket: "studymatch-99924.appspot.com",
  messagingSenderId: "794596806953",
  appId: "1:794596806953:web:a3f75286cb4fb546e5e738",
  measurementId: "G-ENMF1ZHQ5T"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funzione per inserire i dati di un JSON nella collezione "user"
async function addUsersFromJSON(userData) {
    try {
        for (const user of userData) {
            const docRef = await addDoc(collection(db, "user"), {
                ...user,
            });
            await updateDoc(docRef, {
                id: docRef.id
            })
            console.log("Documento aggiunto con ID: ", docRef.id);
        }
    } catch (e) {
        console.error("Errore nell'aggiungere i documenti: ", e);
    }
}

// Esempio di JSON con i dati dell'utente
const userData = [
    {
        accepted: [],
        accepted_groups: [],
        age: 21,
        city: "Firenze",
        completed: true,
        description: "Ciao, sono Lucia Bianchi, una studentessa di economia a UNIFI.",
        faculty: "Economia",
        instagram: "@lucia.bianchi",
        locationAndTime: "Aula studio, 10-12",
        matched: {},
        name: "Lucia",
        surname: "Bianchi",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@luciab",
        profileImageULR: "",
        verified: true
    },
    {
        accepted: [],
        accepted_groups: [],
        age: 24,
        city: "Pisa",
        completed: true,
        description: "Mi chiamo Marco Rossi, studio ingegneria a UNIPI.",
        faculty: "Ingegneria",
        instagram: "@marco_rossi_",
        locationAndTime: "Cafeteria, 14-15",
        matched: {},
        name: "Marco",
        surname: "Rossi",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@marcorossi",
        profileImageULR: "",
        verified: true
    },
    {
        accepted: [],
        accepted_groups: [],
        age: 22,
        city: "Firenze",
        completed: true,
        description: "Ciao, sono Mattia Barbieri, studio informatica a UNIFI.",
        faculty: "Informatica",
        instagram: "@mattiabarbieri",
        locationAndTime: "Biblioteca, 11-13",
        matched: {},
        name: "Mattia",
        surname: "Barbieri",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@mattiab",
        profileImageULR: "",
        verified: true
    }
];

// Chiama la funzione per inserire i dati degli utenti dal JSON
addUsersFromJSON(userData);