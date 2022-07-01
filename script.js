// ceci n'est vraiment pas ce par quoi on a commencé, même si c'est écrit tout au dessus
const quoteContainer = document.getElementById('quote-container');
// s'assurer que les id correspondent bien avec les id du document html
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
// Loader
const loader = document.getElementById('loader');
// pour un loader, il faut deux fonctions. une "loading" (pour montrer qu'on load) et une "complete"

// Show Loading
function loading() {
    loader.hidden = false;
    // si on veut montrer que ça charge, il ne faut évidemment pas le cacher
    // par contre, si le loader est actif, il faut cacher le générateur de quotes :
    quoteContainer.hidden = true;
}

// Hide loading
function complete() {
    loader.hidden = true;
    quoteContainer.hidden = false;
}


// prendre les quotes d'une api

// Ces lignes sont écrites après l'async fonction plus bas
// l'écrire au dessus et pas à la suite permet à cette variable d'être disponible dans n'importe quelle fonction et pas seulement dans celle-là.

let apiQuotes = [];

// la raison pour laquelle on utilise let au lieu de const est qu'on l'établi au départ comme une array vide mais par après on changera sa valeur pour insérer les quotes. on utilise "const" si la valeur n'est pas appelée à changer (comme l'url de l'api par exemple qui est une constante)

// pour montrer une nouvelle quote :
function newQuote() {
    // cette première ligne est ajoutée tout à la fin après création du loader (voir plus bas aussi d'abord)
    loading();
    // on va utiliser une fonction math.random pour que l'index de l'array soit dynamique
    //  cette fonction renvoie un nombre compris entre 0 et 1 mais avec une blinde de décimales !
    // on va multiplier cette décimale, ce nombre, par la longueur de notre array de apiQuote pour que ce ne soit jamais un nombre supérieur à cette array et donc le nombre de quotes disponibles. donc on doit combiner ça avec math.floor qui est important pour récupérer le plus grand nombre entier qui est plus PETIT ou EGAL à un nombre donné. 
    // en gros, on wrap notre math.random à l'intérieur d'un math.floor pour s'assurer d'avoir un nombre entier qui ne dépasse pas l'index de l'array. par exemple si on obtient 16.6754, la quote affichée sera la 16ème (en fait la 17ème puisque le 0 compte)

    // on commence par choisir une quote au hasard dans l'array de apiQuotes :
    // version api :
    const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];

    // version fichier local :
    // const quote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
    // console.log(quote); 
    // <-- à ce point, une citation aléatoire s'affiche dans la console :)

    // ici on va peupler un peu les éléments quotes et author :
    // donc on prend par exemple la constante authorText qui ici va établir la valeur du textContent. ça nous permet de passer une string pour la faire apparaitre dans cet élément :
    // authorText.textContent = quote.author;

    // check pour les cas où il n'y a pas d'auteur et ajouter 'unknown' à la place
    if (!quote.author) {
        authorText.textContent = 'Unknown.';
    } else {
        authorText.textContent = quote.author;
    }
// Maintenant on va vérifier si le texte est trop long et s'il vaut mieux activer le css prévu pour l'afficher en un peu plus petit
    if (quote.text.length > 60) {
        quoteText.classList.add('long-quote');
    } else {
        quoteText.classList.remove('long-quote');
    }
    // afficher le quote, masquer le loader avec complete();
    quoteText.textContent = quote.text;
    complete();
}


 // aller chercher l'url de l'api
// async fetch request - une fonction async peut se lancer n'importe quand et n'empêche pas le browser d'afficher le reste de la page

async function getQuotes() {
    // cette première ligne est ajoutée tout à la fin après création du loader et on remonte dans function newQuote
      loading();
      const apiUrl = 'https://type.fit/api/quotes';

    // tryCatch permet d'essayer d'exécuter une requête "fetch" mais si ça ne marche pas, on peut récupérer l'information d'erreur et en faire quelque chose
    
    try {
       
        // la fetch request :
       
        const response = await fetch(apiUrl);
       
        // ça signifie que cette constante (response) ne sera pas exécutée tant qu'elle n'aura pas récupéré d'info de l'api
        // sans les paramètres "async" et "await", la fonction essaierait d'établir la réponse sans avoir eu le temps de la trouver et ça causerait une erreur
        // ensuite on utilise une variable globale ci-dessous, appelée apiQuotes (nom au choix) et qui est égale à "await response.json". ça veut dire qu'on va prendre le fichier json de l'api comme réponse et qu'ensuite on adapte cette réponse en objet json car c'est juste une série de "strings" et on passe tout ça dans la variable globale "apiQuotes"
        
        apiQuotes = await response.json();
        
        // on prévoit une nouvelle fonction pour le renouvellement des quotes et on la crée encore au dessus comme "let apiQuotes"
        
        newQuote();
    } catch (error) {
    
        // l'erreur éventuelle serait gérée ici
    
    };
}

// Faire fonctionner les boutons

// Tweet une quote
function tweetQuote() {
    // on va utiliser une "template string" avec les guillemets qui sont des accents : `` . Ça permet de passer des variables en même temps que l'url. (à partir du "$")
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
    // ça va ouvrir une nouvelle fenêtre (ou onglet) en utilisant cette url :
    window.open(twitterUrl, '_blank');
}

// Event listeners - on déclare une fonction avant de l'"appeler" (declare before you call it)
// ici on fait en sorte qu'en cliquant sur le bouton, on génère une nouvelle quote
newQuoteBtn.addEventListener('click', newQuote);

twitterBtn.addEventListener('click', tweetQuote);


// On load
// ici, on lance notre fonction getQuotes dès le lancement de la page :

getQuotes();

// newQuote();