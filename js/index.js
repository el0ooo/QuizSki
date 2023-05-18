//script JavaScitp du TP2 en animation web 
//réaliser par Yuri Eloi Chayer en avril/main 2o23

//declaration des variables
    //bouton jouer
    let boutonJouer = document.querySelector("#boutonJouer");
    //bouton rejouer
    let boutonRejouer;
    //section ou les questions et reponses seront afficher
    let sectionQuiz = document.querySelector("#quiz");
    //section pour mettre les questions et la pente de ski dedans
    let sectionQuestion = document.createElement("div");
    sectionQuestion.classList.add("sectionQuestion");
    sectionQuiz.append(sectionQuestion);
    //footer
    let footer = document.querySelector("footer");
    //variable du meilleur score avec API du local storage
    let meilleurScore = localStorage.getItem("meilleurScore") || 0;
    //tableau avec toutes les questions et images 
    let questionQuiz = [
        {
            question: "Quel est le nom de cette prise de ski?",
            image: "Images/imageQuestion1.JPG",
            choix:["mute", "tail", "nose", "japan"],
            bonneReponse: 0
        },
        {
            question: "Quel est le nom de cette prise de ski?",
            image: "Images/imageQuestion2.png",
            //https://personalsportrecord.com/content/uploads/2017/04/Screen-Shot-2017-04-20-at-8.22.15-AM.png
            choix:["mute", "tail", "nose", "japan"],
            bonneReponse: 1
        },
        {
            question:"Quel est le nom de ce mouvement en ski?",
            image:"Images/videoQestion3.mp4",
            //https://www.youtube.com/watch?v=ySDy0JBroL0&ab_channel=FreerideWorldTour
            choix:["cork 7 tail grab", "cork 3", "rodeo 360", "screaming seamen 360"],
            bonneReponse:3
        },
        {
            question:"Quel est le nom de ce mouvement en ski?",
            image:"Images/videoQuestion4mp4.mp4",
            //https://www.youtube.com/watch?v=ySDy0JBroL0&ab_channel=FreerideWorldTour
            choix:["cork 7 tail grab", "cork 3", "rodeo 360", "screaming seamen 360"],
            bonneReponse:0
        },
        {
            question:"Quel est le nom de cette prise de ski?",
            image:"Images/imageQuestion5.jpeg",
            //https://www.newschoolers.com/forum/thread/867227/Favourite--unknown-and-underrated-grab-
            choix:["mute", "bow n arrow", "stealfish", "safety"],
            bonneReponse:2
        }
    ]

    //variable pour retenir le score du joueur et lui montrer a la fin
    let score = 0;

    //numero de question pour savoir on est rendu a quelle question
    let noQuestion = 0

    //position ud skieur sur la pente
    let positionSkieurY;
    //pour que le skier soit bien alligner sur toute les plateformes
    //ordi
    if(window.matchMedia("(min-width:1080px)").matches){
        positionSkieurY = 17;
    //tablette 
    }else if(window.matchMedia("(min-width:768px)").matches){
        positionSkieurY = 15;
    //telephone
    }else{
        positionSkieurY = 18;
    }
    //section animer entre les questions
    let sectionAnimer = document.querySelector("#animationSection");
    sectionAnimer.style.display = "none";

    //cureur personnalisé
    let root = document.querySelector(":root");
    document.addEventListener("mousemove",deplacerCurseur);

    function deplacerCurseur(event){
        root.style.setProperty("--position-x", event.clientX + "px");
        root.style.setProperty("--position-y", event.clientY + "px");
    }

    //faire un chronometre pour indiquer a l'utilisateur en combien de temps il a réalisé le quiz
    let secondes = 0;
    let minutes = 0;
    
    let intervalChronometre;

    function gestionChronometre(){
        secondes ++;
        if(secondes == 60){
            minutes ++
            secondes =0;
        }
    }

//appeler la premier question (enelever tout ce qui a dans la section quiz et mettre le nouveau contenu)
boutonJouer.addEventListener("click", premiereQuestion);

//la premiere question posee a l'utilisateur est : Quel est ce grab 
//un grab en ski est une figure acrobatique ou on attrape une partie de son ski
//question 1 est une image de moi qui fait un mute grab
function premiereQuestion(event){

    //partir le set interval pour le chronometre
    intervalChronometre = setInterval(gestionChronometre , 1000);

    //pour enlever les enfants de la div une seul fois quand le bouton jouer est cliquer pour par la suite pouvoir mettre les question et d'autre elements.
    sectionQuiz.innerHTML ="";
    sectionQuiz.append(sectionQuestion);
    sectionQuestion.innerHTML = "";
    //mettre no question a 0 pcq c'est la premiere question
    noQuestion = 0;

    //creer une boite qui contient une image et la question
    let boite = document.createElement("div");
    boite.classList.add("boiteQuestion");

    //creer un titre qui possede la question
    let question1 = document.createElement("h1");
    //récuprere la premiere question du tableau
    let elementTableau = questionQuiz[0];
    let texteQuestion = elementTableau.question;
    //mettre la premiere question dans la balise h1
    question1.innerText = texteQuestion;

    //creer une image pour mettre dans la boite ou il y a la question
    let image1 = document.createElement("img");
    image1.src = elementTableau.image;

    sectionQuestion.append(boite);
    boite.append(question1, image1);

    //creer la pente de ski qui indique a l'utilisateur ou il est rendu dans le quiz
    let penteSki = document.createElement("div");
    penteSki.classList.add("penteSki");
    sectionQuestion.append(penteSki);

    //mettre le personnage sur la pente de ski
    let skieur = document.createElement("div");
    skieur.classList.add("skieur");
    //avancer le skieur
    positionSkieurY = positionSkieurY + 4;
    skieur.style.top = positionSkieurY +"vh";
    penteSki.append(skieur);

    //rajouteur une section dans le main pour mettre les choix de réponse
    let sectionReponse = document.createElement("div");
    sectionReponse.classList.add("conteneurReponse");
    sectionQuiz.append(sectionReponse);

    //afficher les choiz de réponse
    let unChoix
    for(let i = 0; i < elementTableau.choix.length; i++){
        //cree une div, lui donner une class et mettre le choix de réponse a l'interrieur
        unChoix = document.createElement("div");
        unChoix.classList.add("boiteChoix");
        unChoix.innerText = elementTableau.choix[i];
        //donner son index de choix
        unChoix.indexChoix = i;
        //ajouter un ecouteur d'evenement qui verifie la réponse quand l'utilisateur click dessus
        unChoix.addEventListener("mousedown", verifierReponse);
        //mettre le choix de réponse dans la section pour les réponses
        sectionReponse.append(unChoix);
    }  
    //rajouter l'animation d'ouverture pour la question
    sectionAnimer.style.display = "block";
    sectionAnimer.style.animation = "animation-ouverture-section-0 2s ease-in forwards"

    //enelver les écouteurs d'événements
    boutonJouer.removeEventListener("click", premiereQuestion);
    boutonRejouer.removeEventListener("click", rejouer);

}


//question 2 qui est une image d'un tail grab 
function question2(){
    //pour enlever les enfants de la div une seul fois quand le bouton jouer est cliquer pour par la suite pouvoir mettre les question et d'autre elements.
    sectionQuiz.innerHTML ="";
    sectionQuiz.append(sectionQuestion);
    sectionQuestion.innerHTML = "";

    //mettre no question a 1 pcq c'est la 2em question
    noQuestion = 1;

    //creer une boite qui contient une image et la question
    let boite = document.createElement("div");
    boite.classList.add("boiteQuestion");
    sectionQuestion.append(boite);

    //creer la prochaine question
    let questionSuivante = document.createElement("h1");
    //recuperer la question dans le tableau
    let elementTableau = questionQuiz[1];
    let texteQuestion = elementTableau.question;
    //mettre le texte dans la balise
    questionSuivante.innerText = texteQuestion;

    //creer une balise image pour la question
    let imageSuivante = document.createElement("img");
    imageSuivante.src = elementTableau.image;

    boite.append(questionSuivante, imageSuivante);

    //creer la pente de ski qui indique a l'utilisateur ou il est rendu dans le quiz
    let penteSki = document.createElement("div");
    penteSki.classList.add("penteSki");
    sectionQuestion.append(penteSki);

    //mettre le personnage sur la pente de ski
    let skieur = document.createElement("div");
    skieur.classList.add("skieur");
    //deplacer le skieur sur la pente
    positionSkieurY = positionSkieurY + 4;
    skieur.style.top = `${positionSkieurY}vh`;
    penteSki.append(skieur);


    //rajouteur une section dans le main pour mettre les choix de réponse
    let sectionReponse = document.createElement("div");
    sectionReponse.classList.add("conteneurReponse");
    sectionQuiz.append(sectionReponse);

    //afficher les choiz de réponse
    let unChoix
    for(let i = 0; i < elementTableau.choix.length; i++){
        //cree une div, lui donner une class et mettre le choix de réponse a l'interrieur
        unChoix = document.createElement("div");
        unChoix.classList.add("boiteChoix");
        unChoix.innerText = elementTableau.choix[i];
        //donner son index de choix
        unChoix.indexChoix = i;
        //ajouter un ecouteur d'evenement qui verifie la réponse quand l'utilisateur click dessus
        unChoix.addEventListener("mousedown", verifierReponse);
        //mettre le choix de réponse dans la section pour les réponses
        sectionReponse.append(unChoix);
    }

    //rajouter l'animation d'ouverture pour la question
    sectionAnimer.style.display = "block";
    sectionAnimer.style.animation = "animation-ouverture-section-1 2s ease-in forwards"

}

//question 3 est une video de quelqu'un qui réalise un screaming seamen 360
function question3(){
    //pour enlever les enfants de la div une seul fois quand le bouton jouer est cliquer pour par la suite pouvoir mettre les question et d'autre elements.
    sectionQuiz.innerHTML ="";
    sectionQuiz.append(sectionQuestion);
    sectionQuestion.innerHTML = "";

    //mettre no question a 2 pcq c'est la 3em question
    noQuestion = 2;

    //creer une boite qui contient une image et la question
    let boite = document.createElement("div");
    boite.classList.add("boiteQuestion");
    sectionQuestion.append(boite);

    //creer la prochaine question
    let questionSuivante = document.createElement("h1");
    //recuperer la question dans le tableau
    let elementTableau = questionQuiz[2];
    let texteQuestion = elementTableau.question;
    //mettre le texte dans la balise
    questionSuivante.innerText = texteQuestion;

    //creer une balise video pour faire jouer une video 
    let videoSuivante = document.createElement("video");
    videoSuivante.src = elementTableau.image
    videoSuivante.play();
    videoSuivante.loop = true;

    boite.append(questionSuivante, videoSuivante);

    //creer la pente de ski qui indique a l'utilisateur ou il est rendu dans le quiz
    let penteSki = document.createElement("div");
    penteSki.classList.add("penteSki");
    sectionQuestion.append(penteSki);

    //mettre le personnage sur la pente de ski
    let skieur = document.createElement("div");
    skieur.classList.add("skieur");
    //deplacer le skieur sur la pente
    positionSkieurY = positionSkieurY + 4;
    skieur.style.top = `${positionSkieurY}vh`;
    penteSki.append(skieur);

    //rajouteur une section dans le main pour mettre les choix de réponse
    let sectionReponse = document.createElement("div");
    sectionReponse.classList.add("conteneurReponse");
    sectionQuiz.append(sectionReponse);

    //afficher les choiz de réponse
    let unChoix
    for(let i = 0; i < elementTableau.choix.length; i++){
        //cree une div, lui donner une class et mettre le choix de réponse a l'interrieur
        unChoix = document.createElement("div");
        unChoix.classList.add("boiteChoix");
        unChoix.innerText = elementTableau.choix[i];
        //donner son index de choix
        unChoix.indexChoix = i;
        //ajouter un ecouteur d'evenement qui verifie la réponse quand l'utilisateur click dessus
        unChoix.addEventListener("mousedown", verifierReponse);
        //mettre le choix de réponse dans la section pour les réponses
        sectionReponse.append(unChoix);
    }
    //rajouter l'animation d'ouverture pour la question
    sectionAnimer.style.display = "block";
    sectionAnimer.style.animation = "animation-ouverture-section-2 2s ease-in forwards"
}

//question 4 est une video de quelqu'un qui realise un cork 7 tail grab
function question4(){
    //pour enlever les enfants de la div une seul fois quand le bouton jouer est cliquer pour par la suite pouvoir mettre les question et d'autre elements.
    sectionQuiz.innerHTML ="";
    sectionQuiz.append(sectionQuestion);
    sectionQuestion.innerHTML = "";

    //mettre no question a 3 pcq c'est la 4em question
    noQuestion = 3;


    //creer une boite qui contient une image et la question
    let boite = document.createElement("div");
    boite.classList.add("boiteQuestion");
    sectionQuestion.append(boite);

    //creer la prochaine question
    let questionSuivante = document.createElement("h1");
    //recuperer la question dans le tableau
    let elementTableau = questionQuiz[3];
    let texteQuestion = elementTableau.question;
    //mettre le texte dans la balise
    questionSuivante.innerText = texteQuestion;

    //creer une balise video pour faire jouer une video 
    let videoSuivante = document.createElement("video");
    videoSuivante.src = elementTableau.image
    videoSuivante.play();
    videoSuivante.loop = true;

    boite.append(questionSuivante, videoSuivante);

    //creer la pente de ski qui indique a l'utilisateur ou il est rendu dans le quiz
    let penteSki = document.createElement("div");
    penteSki.classList.add("penteSki");
    sectionQuestion.append(penteSki);

    //mettre le personnage sur la pente de ski
    let skieur = document.createElement("div");
    skieur.classList.add("skieur");
    //deplacer le skieur sur la pente
    positionSkieurY = positionSkieurY + 4;
    skieur.style.top = `${positionSkieurY}vh`;
    penteSki.append(skieur);

    //rajouteur une section dans le main pour mettre les choix de réponse
    let sectionReponse = document.createElement("div");
    sectionReponse.classList.add("conteneurReponse");
    sectionQuiz.append(sectionReponse);

    //afficher les choiz de réponse
    let unChoix
    for(let i = 0; i < elementTableau.choix.length; i++){
        //cree une div, lui donner une class et mettre le choix de réponse a l'interrieur
        unChoix = document.createElement("div");
        unChoix.classList.add("boiteChoix");
        unChoix.innerText = elementTableau.choix[i];
        //donner son index de choix
        unChoix.indexChoix = i;
        //ajouter un ecouteur d'evenement qui verifie la réponse quand l'utilisateur click dessus
        unChoix.addEventListener("mousedown", verifierReponse);
        //mettre le choix de réponse dans la section pour les réponses
        sectionReponse.append(unChoix);
    }
    //rajouter l'animation d'ouverture pour la question
    sectionAnimer.style.display = "block";
    sectionAnimer.style.animation = "animation-ouverture-section-3 2s ease-in forwards"
}

//question 5 est 
function question5(){
    //pour enlever les enfants de la div une seul fois quand le bouton jouer est cliquer pour par la suite pouvoir mettre les question et d'autre elements.
    sectionQuiz.innerHTML ="";
    sectionQuiz.append(sectionQuestion);
    sectionQuestion.innerHTML = "";

    //mettre no question a 4 pcq c'est la 5em question
    noQuestion = 4;

    //creer une boite qui contient une image et la question
    let boite = document.createElement("div");
    boite.classList.add("boiteQuestion");
    sectionQuestion.append(boite);

    //creer la prochaine question
    let questionSuivante = document.createElement("h1");
    //recuperer la question dans le tableau
    let elementTableau = questionQuiz[4];
    let texteQuestion = elementTableau.question;
    //mettre le texte dans la balise
    questionSuivante.innerText = texteQuestion;

    let imageSuivante = document.createElement("img");
    imageSuivante.src = elementTableau.image;

    boite.append(questionSuivante, imageSuivante);

    //creer la pente de ski qui indique a l'utilisateur ou il est rendu dans le quiz
    let penteSki = document.createElement("div");
    penteSki.classList.add("penteSki");
    sectionQuestion.append(penteSki);

    //mettre le personnage sur la pente de ski
    let skieur = document.createElement("div");
    skieur.classList.add("skieur");
    //deplacer le skieur sur la pente
    positionSkieurY = positionSkieurY + 4;
    skieur.style.top = `${positionSkieurY}vh`;
    penteSki.append(skieur);

    //rajouteur une section dans le main pour mettre les choix de réponse
    let sectionReponse = document.createElement("div");
    sectionReponse.classList.add("conteneurReponse");
    sectionQuiz.append(sectionReponse);

    //afficher les choiz de réponse
    let unChoix
    for(let i = 0; i < elementTableau.choix.length; i++){
        //cree une div, lui donner une class et mettre le choix de réponse a l'interrieur
        unChoix = document.createElement("div");
        unChoix.classList.add("boiteChoix");
        unChoix.innerText = elementTableau.choix[i];
        //donner son index de choix
        unChoix.indexChoix = i;
        //ajouter un ecouteur d'evenement qui verifie la réponse quand l'utilisateur click dessus
        unChoix.addEventListener("mousedown", verifierReponse);
        //mettre le choix de réponse dans la section pour les réponses
        sectionReponse.append(unChoix);
    }
    //rajouter l'animation d'ouverture pour la question
    sectionAnimer.style.display = "block";
    sectionAnimer.style.animation = "animation-ouverture-section-4 2s ease-in forwards"
}

//section ou on affiche le score, le meilleur score et la possibilite de rejouer
function fin(){
    //pour enlever les enfants de la div une seul fois quand le bouton jouer est cliquer pour par la suite pouvoir mettre les question et d'autre elements.
    sectionQuiz.innerHTML ="";
    sectionQuiz.append(sectionQuestion);
    sectionQuestion.innerHTML = "";
    //section pour afficher le score et les autres elements
    let sectionScore = document.createElement("div");
    sectionScore.classList.add("fin");
    sectionQuestion.append(sectionScore);

    //texte du score
    let textScore = document.createElement("h1");
    textScore.innerText = "Votre score : " + score + "/5";
    sectionScore.append(textScore);

    //afficher le temps et arreter le setinterval
    clearInterval(intervalChronometre);
    let textTemps = document.createElement("h1");
    textTemps.innerText =  "Vous avez réussi le quiz en " + minutes +" minutes et "+ secondes +" secondes";
    sectionScore.append(textTemps) 

    //texte du meilleur score
    meilleurScore = Math.max(meilleurScore, score);
    localStorage.setItem("meilleurScore", meilleurScore);
    let textMeilleurScore = document.createElement("h1");
    textMeilleurScore.innerText = "Votre record : " + meilleurScore + "/5";//finir ca une fois que l'enregistrement des score est finis
    sectionScore.append(textMeilleurScore);

    //bouton rejouer
    boutonRejouer = document.createElement("div");
    boutonRejouer.innerHTML = `<span class="material-icons rejouer">replay</span>`;
    boutonRejouer.addEventListener("click", rejouer);
    sectionScore.append(boutonRejouer);  
    //enlever le clip-path dasn les animations pour voir l'animation de fin au complet
    sectionAnimer.style.display = "none";
}

//fonction pour verifier si la reponse cliquer est la bonne
function verifierReponse(event){
    //pour appeler la prochaine question
    if(noQuestion == 0){
        event.target.addEventListener("animationend",question2);
    }else if(noQuestion == 1){
        event.target.addEventListener("animationend",question3);
    }else if(noQuestion == 2){
        event.target.addEventListener("animationend",question4);
    }else if(noQuestion == 3){
        event.target.addEventListener("animationend",question5);
    }else if(noQuestion == 4){
        event.target.addEventListener("animationend",fin);
    }

    //verifier si la reponse est la bonne
    if(event.target.indexChoix == questionQuiz[noQuestion].bonneReponse){
        event.target.classList.add("victoire");
        score++;
    }else{
        event.target.classList.add("erreur");
    }

    //enlever les écouteur d'événement sur les autres choix de réponse pour pas pouvoir appuyer sur deux boutons en meme temps
    let lesChoix = document.querySelectorAll(".boiteChoix");
    for (let unChoix  of lesChoix) {
        unChoix.removeEventListener("mousedown", verifierReponse);
    }
}

//fonction pour remettre a 0 tout les variable qui change et recommencer le quiz
function rejouer(){
    //remettre a 0 des varibles pour recommencer
    noQuestion = 0
    score = 0;
    minutes = 0;
    secondes = 0;
    if(window.matchMedia("(min-width:1080px)").matches){
        positionSkieurY = 17;
    //tablette 
    }else if(window.matchMedia("(min-width:768px)").matches){
        positionSkieurY = 15;
    //telephone
    }else{
        positionSkieurY = 18;
    }
    //appeler la premier question
    premiereQuestion();
}
