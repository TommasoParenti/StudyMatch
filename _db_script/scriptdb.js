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
        verified: true
    },
    {
        accepted: [],
        accepted_groups: [],
        age: 23,
        city: "Lucca",
        completed: true,
        description: "Sono Alessandra Verdi, studio medicina a UNIPI.",
        faculty: "Medicina",
        instagram: "@ale.verdi",
        locationAndTime: "Aula Magna, 16-18",
        matched: {},
        name: "Alessandra",
        surname: "Verdi",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@alev",
        verified: true
    },
    {
        accepted: [],
        accepted_groups: [],
        age: 20,
        city: "Pisa",
        completed: true,
        description: "Sono Lorenzo Neri, studio fisica a UNIPI.",
        faculty: "Fisica",
        instagram: "@lorenzo_neri",
        locationAndTime: "Biblioteca, 09-11",
        matched: {},
        name: "Lorenzo",
        surname: "Neri",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@lorenzeri",
        verified: true
    },
    {
        accepted: [],
        accepted_groups: [],
        age: 22,
        city: "Livorno",
        completed: true,
        description: "Ciao, sono Giulia Colombo, studio lettere a UNIPI.",
        faculty: "Lettere",
        instagram: "@giuliacolombo",
        locationAndTime: "Cortile, 11-12",
        matched: {},
        name: "Giulia",
        surname: "Colombo",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@giuliac",
        verified: true
    },
    {
        accepted: [],
        accepted_groups: [],
        age: 25,
        city: "Pistoia",
        completed: true,
        description: "Mi chiamo Davide Russo, sono uno studente di chimica.",
        faculty: "Chimica",
        instagram: "@daviderusso",
        locationAndTime: "Laboratorio, 14-16",
        matched: {},
        name: "Davide",
        surname: "Russo",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@davider",
        verified: true
    },
    {
        accepted: [],
        accepted_groups: [],
        age: 23,
        city: "Pisa",
        completed: true,
        description: "Sono Martina Esposito, studio biologia a UNIPI.",
        faculty: "Biologia",
        instagram: "@martinaesposito",
        locationAndTime: "Giardini, 15-17",
        matched: {},
        name: "Martina",
        surname: "Esposito",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@martinae",
        verified: true
    },
    {
        accepted: [],
        accepted_groups: [],
        age: 22,
        city: "Pisa",
        completed: true,
        description: "Ciao, sono Filippo Ricci, studio scienze politiche.",
        faculty: "Scienze Politiche",
        instagram: "@filipporicci",
        locationAndTime: "Cafeteria, 13-14",
        matched: {},
        name: "Filippo",
        surname: "Ricci",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@filippor",
        verified: true
    },
    {
        accepted: [],
        accepted_groups: [],
        age: 21,
        city: "Pisa",
        completed: true,
        description: "Sono Elisa Galli, studentessa di psicologia a UNIPI.",
        faculty: "Psicologia",
        instagram: "@elisagalli",
        locationAndTime: "Biblioteca, 10-12",
        matched: {},
        name: "Elisa",
        surname: "Galli",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@elisag",
        verified: true
    },
    {
        accepted: [],
        accepted_groups: [],
        age: 24,
        city: "Pisa",
        completed: true,
        description: "Sono Andrea Greco, studio giurisprudenza a UNIPI.",
        faculty: "Giurisprudenza",
        instagram: "@andreagreco",
        locationAndTime: "Aula studio, 14-16",
        matched: {},
        name: "Andrea",
        surname: "Greco",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@andreag",
        verified: true
    },
    {
        accepted: [],
        accepted_groups: [],
        age: 22,
        city: "Siena",
        completed: true,
        description: "Ciao, sono Sara Ferri, studio ingegneria biomedica.",
        faculty: "Ingegneria Biomedica",
        instagram: "@saraferri",
        locationAndTime: "Laboratorio, 13-15",
        matched: {},
        name: "Sara",
        surname: "Ferri",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@saraf",
        verified: true
    },
    {
        accepted: [],
        accepted_groups: [],
        age: 23,
        city: "Pisa",
        completed: true,
        description: "Mi chiamo Francesco Marchetti, studio matematica a UNIPI.",
        faculty: "Matematica",
        instagram: "@francescomarchetti",
        locationAndTime: "Aula 2, 09-11",
        matched: {},
        name: "Francesco",
        surname: "Marchetti",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@francescom",
        verified: true
    },
    {
        accepted: [],
        accepted_groups: [],
        age: 24,
        city: "Pisa",
        completed: true,
        description: "Sono Chiara Conti, studentessa di architettura a UNIPI.",
        faculty: "Architettura",
        instagram: "@chiaraconti",
        locationAndTime: "Cafeteria, 12-13",
        matched: {},
        name: "Chiara",
        surname: "Conti",
        phone: "+00 0000000000",
        rejected: [],
        rejected_groups: [],
        requests: {},
        telegram: "@chiarac",
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
        verified: true
    }
];

// Chiama la funzione per inserire i dati degli utenti dal JSON
addUsersFromJSON(userData);