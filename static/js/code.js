//// INITIALISATION ////

var user = {};
if (sessionStorage.getItem('user') == null) { // Si non connecté
} else { // Si connecté
    user = JSON.parse(sessionStorage.getItem('user'));
}

$("#navLoginCard").toggle();
$("#navLoginCard").removeClass("invisible");

function checkIfLoggedIn() {
    if (sessionStorage.getItem('user') == null && window.location.href.indexOf('login.html') < 0) { // Si non connecté et pas sur la page de connexion
        // Redirection vers la page de connexion
        window.location.href = 'login.html';
    } else if (sessionStorage.getItem('user') !== null && user.email.split("@").pop() == "essec.edu") { // Si connecté avec un compte ESSEC
        // On ne fait rien
    } else if (sessionStorage.getItem('user') !== null && user.email.split("@").pop() !== "essec.edu" && window.location.href.indexOf('login.html') < 0) { // Si connecté avec un compte non ESSEC et pas sur la page de connexion
        // Redirection vers la page de connexion
        window.location.href = 'login.html';
    } else if (sessionStorage.getItem('user') !== null && user.email.split("@").pop() !== "essec.edu") { // Si connecté avec un compte non ESSEC
        $("#notESSECAlert").addClass("collapse.show"); // On affiche l'alerte demandant la connexion avec un compte ESSEC
        $("#notESSECAlert").removeClass("collapse"); // On affiche l'alerte demandant la connexion avec un compte ESSEC
    }
    else { // Sinon
    }
}

checkIfLoggedIn();

function init() {
    gapi.load('auth2', function () { // Ready. });
        gapi.auth2.init({
            client_id: '86515575791-2qr4ukigk6qrjcotvqp5u04l60k67k4b.apps.googleusercontent.com',
            /*This two lines are important not to get profile info from your users
            fetch_basic_profile: false,
            scope: 'email' */
        });
    });
}

// BARRE DE NAVIGATION

// Si on clique en dehors du navLoginCard, on cache le navLoginCard
$("html").click(function (e) {
    if (e.target.id != "navLoginCard" && e.target.id != "nav-profile-img") {
        console.log("You clicked outside navLoginCard and navProfileImg");
        $("#navLoginCard").toggle(false);
        console.log(e.target.id);
    } else {
        console.log('You clicked inside navLoginCard');
    }
});

$("#nav-profile-img").click(function () {
    $("#navLoginCard").toggle();
});

// Une fois la page chargée...
window.onload = function () {
    if (sessionStorage.getItem('user') == null) { // Si non connecté
        var log = document.getElementById("log");
        log.innerHTML = log.innerHTML.replace("Déconnexion", "Connexion"); // On modifie le texte du bouton 
        log.href = "login.html"; // On modifie le lien du bouton
        if (sessionStorage.logOut == "true" && window.location.href.indexOf('login.html') >= 1) { // Si on vient de se déconnecter et sur la page de login
            $("#loggedOutAlert").addClass("collapse.show"); // On affiche l'alerte de déconnexion
            $("#loggedOutAlert").removeClass("collapse"); // On affiche l'alerte de déconnexion
            sessionStorage.setItem('logOut', false); // "On ne vient plus de se déconnecter"
        }
    }
    else { // Sinon
        document.getElementById('profile-img').src = user.photoURL; // On remplace l'image de profil de la page
        document.getElementById('name').innerText = "Connecté en tant que " + user.name;
        $("#logoutButton").addClass("collapse.show"); // On affiche le bouton de déconnexion
        $("#logoutButton").removeClass("collapse"); // On affiche le bouton de déconnexion
        if (sessionStorage.getItem('user') !== null && user.email.split("@").pop() !== "essec.edu") { // Si connecté avec un compte non ESSEC
            $("#notESSECAlert").addClass("collapse.show"); // On affiche l'alerte demandant la connexion avec un compte ESSEC
            $("#notESSECAlert").removeClass("collapse"); // On affiche l'alerte demandant la connexion avec un compte ESSEC
        }
        var log = document.getElementById("log");
        log.innerHTML = log.innerHTML.replace("Connexion", "Déconnexion"); // On modifie le texte du bouton
        log.href = "login.html"; // On modifie le lien du bouton | To update
        var link = document.getElementById('nav-profile-img');
        console.log(link);
        document.getElementById('nav-profile-img').src = user.photoURL; // On remplace l'image de profil de la barre de navigation
    }
}

// REPAIR BROKEN IMAGES

function imgError(image) {
    image.onerror = "";
    image.src = "./images/noimage.png";
    return true;
}


// NOUVEAU SCRIPT LOGIN

var googleUser = {};
var startApp = function () {
    gapi.load('auth2', function () {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '86515575791-2qr4ukigk6qrjcotvqp5u04l60k67k4b.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
        });
        onSignin(document.getElementById('customBtn'));
    });
};

function onSignin(element) {
    console.log(element.id);
    auth2.attachClickHandler(element, {},
        function (googleUser) {
            $("#loggedOutAlert").removeClass("collapse.show"); // On cache l'alerte de déconnexion si elle était affichée
            $("#loggedOutAlert").addClass("collapse"); // On cache l'alerte de déconnexion si elle était affichée
            document.getElementById('name').innerText = "Connecté en tant que " +
                googleUser.getBasicProfile().getName();
            console.log("onSignIn");

            // Récupération des infos de l'utilisateur
            var profile = googleUser.getBasicProfile();
            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            user.ID = profile.getId();
            console.log('Name: ' + profile.getName());
            user.name = profile.getName();
            console.log('Image URL: ' + profile.getImageUrl());
            user.photoURL = profile.getImageUrl();
            console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
            user.email = profile.getEmail();

            // Stockage des infos dans sessionStorage, qui sera accessible depuis n'importe quelle page du site
            sessionStorage.setItem('user', JSON.stringify(user));

            // Mise à jour de la barre de navigation pour prendre en compte la connexion
            log.innerHTML = log.innerHTML.replace("Connexion", "Déconnexion"); // On modifie le texte du bouton
            log.href = "login.html"; // On modifie le lien du bouton | To update
            document.getElementById('profile-img').src = user.photoURL; // On remplace l'image de profil de la page
            document.getElementById('nav-profile-img').src = user.photoURL; // On remplace l'image de profil de la barre de navigation
            $("#logoutButton").addClass("collapse.show"); // On affiche le bouton de déconnexion
            $("#logoutButton").removeClass("collapse"); // On affiche le bouton de déconnexion
            console.log("Bouton de déconnexion affiché");

            if (sessionStorage.getItem('user') !== null && user.email.split("@").pop() !== "essec.edu") { // Si connecté avec un compte non ESSEC
                $("#notESSECAlert").addClass("collapse.show"); // On affiche l'alerte demandant la connexion avec un compte ESSEC
                $("#notESSECAlert").removeClass("collapse"); // On affiche l'alerte demandant la connexion avec un compte ESSEC
                console.log("Alerte de connexion avec un compte non ESSEC affichée");
            }

            // Redirection vers l'accueil du site
            // window.location.href = 'index.html';

            console.log("endOfSignIn");
        }, function (error) {
            alert(JSON.stringify(error, undefined, 2));
        });
}


// FONCTIONS

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    sessionStorage.removeItem('user')
    sessionStorage.setItem('logOut', true);
    // Redirection vers la page de connexion
    window.location.href = 'login.html';
}



// RECHERCHE 

$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        console.log("Recherche : " + value);
        $(".company").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
