// Modifiez la fonction startTimer comme suit :
function startTimer(durationInSeconds, Afficheur_temps, bouton_machine, isCancelled, callback) {
    var Afficheur_temps = document.getElementById(Afficheur_temps);
    var bouton_machine = document.getElementById(bouton_machine);
    var interval; // Déclaration de la variable interval

    // Mettre à jour l'état du bouton
    bouton_machine.textContent = "OCCUPE :(";
    bouton_machine.classList.add("red"); // Ajouter la classe "red" pour indiquer l'état occupé

    // Si le timer doit être annulé, arrêtez l'intervalle et réinitialisez le timer
    if (isCancelled) {
        clearInterval(interval);
        timers[bouton_machine.id] = 0; // Mettre à zéro la valeur du timer dans le dictionnaire
        Afficheur_temps.textContent = ""; // Réinitialiser l'affichage du minuteur
        bouton_machine.textContent = "LIBRE :)";
        bouton_machine.classList.remove("red"); // Retirer la classe "red"
        //console.log("État actuel du dictionnaire timers dans minuteur.js :", timers);
        if (typeof callback === 'function') {
            callback(); // Appel de la fonction de rappel si elle est fournie
        }
        return; // Sortir de la fonction
    }

    // Stocker l'état initial du timer pour ce bouton principal
    timers[bouton_machine.id] = durationInSeconds; // Stocker la valeur initiale du timer dans le dictionnaire
    //console.log("État actuel du dictionnaire timers dans minuteur.js :", timers);

    // Mettre à jour le minuteur chaque seconde
    interval = setInterval(function() {
        // Vérifier si le timer est supérieur à 0
        if (timers[bouton_machine.id] > 0) {
            // Décrémente la valeur du timer associée au bouton principal
            timers[bouton_machine.id]--;

            // Mettre à jour l'affichage du minuteur
            var minutes = parseInt(timers[bouton_machine.id] / 60, 10);
            var seconds = parseInt(timers[bouton_machine.id] % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            Afficheur_temps.textContent = minutes + ":" + seconds;
            
            //console.log("État actuel du dictionnaire timers dans minuteur.js :", timers); // Afficher l'état du dictionnaire chaque seconde
        } else {
            // Arrêter l'intervalle si le timer est égal à 0
            clearInterval(interval);
            Afficheur_temps.textContent = ""; // Réinitialiser l'affichage du minuteur
            bouton_machine.textContent = "LIBRE :)";
            bouton_machine.classList.remove("red"); // Retirer la classe "red"
            //console.log("État actuel du dictionnaire timers dans minuteur.js :", timers);
            if (typeof callback === 'function') {
                callback(); // Appel de la fonction de rappel si elle est fournie
            }
        }
    }, 1000);
}
