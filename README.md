
# :school: StudyMatch

StudyMatch è un'applicazione che ho creato come progetto per l'esame di Sviluppo Applicazioni Web di UniPi. L'obiettivo della web app è quello di permettere di trovare tramite un semplice sistema di like o dislike, persone con cui studiare. E' un app che permette in pratica agli studenti universitari di trovare altre persone tramite il quale fare gruppi di lavoro e studio. L'appllicazione è in pratica divisa in due:
- **Sezione singole persone**: si presenta una carta profilo like-abile con informazioni sulla persona. Dopo un like, l’altra persona viene informata tramite una richiesta; a quel punto se l'altra persona accetta la richiesta o ti lascia like, è possibile contattarla tramite telegram, tramite Instagram o tramite numero di telefono (Tutti e 3 obbligatori).
- **Sezione gruppi**: vi è la possibilità di creare un proprio gruppo da far like-are; quando questo viene fatto si richiede l’ingresso nel gruppo o meno. Se una persona che appartiene al gruppo accetta la richiesta allora viene aggiunto il nuovo membro, che potrà vedere le informazioni del gruppo insieme ai vari contatti: un link telegram ad un gruppo, l'instagram dell'admin del gruppo instagram e il link per il gruppo whatsapp (Tutti e 3 obbligatori).

L'app è stata hostata tramite firebase: [StudyMatch](https://studymatch-99924.firebaseapp.com/).

La console firebase è la seguente: [Console firebase](https://console.firebase.google.com/u/0/project/studymatch-99924/overview)

> [!NOTE]
> E' una applicazione complessa da testare, essendo pensata per l'utilizzo con più persone; per questo all'interno dei file troverà uno script per popolare il DB e vedere la casistica in cui ci siano un paio di persone da swipare. Questi chiaramente non potranno accettare ne inviare richieste, essendo semplici utenti inanimati.

> [!NOTE]
> Per fare un ottimo testing consiglio di utilizzare due email differenti email in proprio possesso in modo da verificare anche il matching, l'aggiungersi ai gruppi, ecc.

## Struttura dell'applicazione
- **/Access** (Pagina di accesso)
    - **/Login** (Pagina di login)
    - **/Register** (Pagina di registrazione)
        - **/Complete-profile** (Pagina per inserire le prime informazioni per il profilo)
        - **/End-complete-profile** (Pagina per completare con le ultime informazioni per il profilo)
- **/Userswiper** (Pagina dove puoi swipare le persone con cui puoi andare a studiare)
    - **/Search** (Pagina dove puoi cercare le persone)
    - **/Requests** (Pagina dove ti arrivano le richieste delle persone)
    - **/Messages** (Pagina dove vedi i match che hai fatto e le relative informazioni)
    - **/Personal-profile** (Pagina personale con anche il QR)
- **/Groupswiper** (Pagina dove puoi swipare i gruppi studio con cui puoi andare a studiare)
    - **/Search** (Pagina dove puoi cercare i gruppi)
    - **/Requests** (Pagina dove ti arrivano le richieste delle persone per entrare in uno dei tuoi gruppi)
    - **/Messages** (Pagina dove vedi i gruppi che ti hanno accettato e le relative informazioni)
    - **/Create-group** (Pagina dove creare un gruppo)
    - **/Personal-profile** (Pagina personale con anche il QR)


## Utilizzo
Per utilizzare questa applicazione basta andare al seguente link: [StudyMatch](https://studymatch-99924.firebaseapp.com/) oppure avviare l'applicazione tramite il comando `ng serve`. 

L'applicazione possiede un sistema di autenticazione tramite firebase, potendosi registrare e poi accedere tramite email&pw, Google, Facebook e GitHub; solo nel primo caso è richiesto di verificarsi tramite un email. E' possibile anche richiedere un cambio di password tramite il pulsante apposito. Non esistono credenziali admin.

A quel punto si arriva alla pagina userswiper; swipando a destra accettiamo uno user, mentre swipando a sinistra lo rifiutiamo; nel momento in cui lo swipiamo a destra li inviamo una richiesta. Scrollando troviamo inoltre le informazioni sull'attuale carta.

Nella navbar troviamo anche i pulsanti per accedere alla ricerca, il controllo delle richieste (dove arrivano le richieste che tu puoi accettare o rifiutare), il controllo dei match (dove ci sono le informazioni delle persone con cui hai matchato), la sezione per filtrare in base alla necessità, la possibilità di fare log out e infine il profilo personale.

In alto al centro c'è un segmented control che permette di cambiare da userswiper a groupswiper.

Il groupswiper è praticamente strutturato come lo userswiper con la sola opzione di creare un gruppo.
### Creare un profilo
Per creare un profilo è necessario prima registrarsi tramite uno delle modalità possibili, e poi è necessario inserire diverse informazioni:
- Nome
- Cognome
- Età
- Luogo frequentato per studaire, ora di inizio-ora di fine
- Città di provenienza
- Facoltà 
- Descrizione
- Account telegram
- Account instagram
- Numero di telefono

### Consigli sul testing dell'applicazione
Testare questa applicazione risulta complesso a causa del fatto che è un'applicazione studiata per più persone; per questo consiglio di creare due account propri, tramite due metodi di registrazione e accesso differenti, per poi provare le varie opzioni tramite i due account (accettarsi entrambi per fare match, rifiutarsi entrambi, ...); per migliore l'esperienza di testing fornisco il db firebase che trova al seguente link: [Console firebase](https://console.firebase.google.com/u/0/project/studymatch-99924/overview); dovrebbe già avere l'invito per partecipare, ma se non lo possiede lo può richiedere a questa email: t.parenti1@studenti.unipi.it.

Invece per vedere il caso in cui ci sono più persone nel db, ho fornito uno script per popolare il db con altri 3 utenti random. 

> [!NOTE]
> Il filtro ha una funzione particolare: l'età selezionata va nel range di 5 anni; ciò significa che prende persone che hanno +5 anni o -5 anni dell'età selezionata. Inoltre il range è già preselezionato, quindi modificarlo sempre!
