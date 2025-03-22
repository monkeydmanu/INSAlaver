

//------------------------------ ANCIENNE VERSION PLUS NÉCESSAIRE ------------------------------//

// Fonction pour sauvegarder l'état dans le stockage local
// function saveState(bouton, etat) {
//     localStorage.setItem(bouton.id, etat);
// }

// Fonction pour gérer le clic sur un bouton
// function ChangmentBouton(bouton, etat) {
//     bouton.addEventListener('click', function() {
//         // On écoute l'événement click
//         if (etat) {
//             bouton.innerHTML = "OCCUPE :(";
//             bouton.classList.add("red");
//         } else {
//             bouton.innerHTML = "LIBRE :)";
//             bouton.classList.remove("red");
//         }
//         etat = !etat; // Inversion de l'état
//         // Appel à la fonction pour sauvegarder l'état
//         saveState(bouton, etat);
//     });

//     // Au chargement de la page, vérifie s'il y a un état sauvegardé et le restaure
//     var etatBouton = localStorage.getItem(bouton.id);
//     if (etatBouton) {
//         etat = (etatBouton === 'true'); // Convertit la chaîne en booléen
//         if (!etat) {
//             bouton.innerHTML = "OCCUPE :(";
//             bouton.classList.add("red");
//         }
//     }
// }

// Récupération des boutons
// let bouton1_felling = document.getElementById("bouton_machine1_felling");
// let bouton2_felling = document.getElementById("bouton_machine2_felling");
// let bouton3_felling = document.getElementById("bouton_machine3_felling");
// let bouton4_felling = document.getElementById("bouton_machine4_felling");

// // État initial des boutons
// let etatBouton1_felling = true;
// let etatBouton2_felling = true;
// let etatBouton3_felling = true;
// let etatBouton4_felling = true;

// // Gestion des boutons
// ChangmentBouton(bouton1_felling, etatBouton1_felling);
// ChangmentBouton(bouton2_felling, etatBouton2_felling);
// ChangmentBouton(bouton3_felling, etatBouton3_felling);
// ChangmentBouton(bouton4_felling, etatBouton4_felling);

//--------------------------------------------------------------------------------------------------------//

// // Événement au clic sur le bouton pour lancer les minuteurs
// document.getElementById("bouton_temps_30_felling_machine1").addEventListener("click", function() {
//     startTimer(10, "Afficheur_temps1", "bouton_machine1_felling"); // Démarrer le minuteur avec une durée de 5 secondes
// });

// document.getElementById("bouton_temps_35_felling_machine1").addEventListener("click", function() {
//     startTimer(2100,"Afficheur_temps1", "bouton_machine1_felling"); // Démarrer le minuteur avec une durée de 5 secondes
// });

// document.getElementById("bouton_temps_40_felling_machine1").addEventListener("click", function() {
//     startTimer(2400,"Afficheur_temps1", "bouton_machine1_felling"); // Démarrer le minuteur avec une durée de 5 secondes
// });
// //---------MACHINE 2-------//
// document.getElementById("bouton_temps_30_felling_machine2").addEventListener("click", function() {
//     startTimer(1800, "Afficheur_temps2", "bouton_machine2_felling"); // Démarrer le minuteur avec une durée de 5 secondes
// });

// document.getElementById("bouton_temps_35_felling_machine2").addEventListener("click", function() {
//     startTimer(2100, "Afficheur_temps2", "bouton_machine2_felling"); // Démarrer le minuteur avec une durée de 5 secondes
// });

// document.getElementById("bouton_temps_40_felling_machine2").addEventListener("click", function() {
//     startTimer(2400, "Afficheur_temps2", "bouton_machine2_felling"); // Démarrer le minuteur avec une durée de 5 secondes
// });


// //--------MACHINE 3-------//
// document.getElementById("bouton_temps_30_felling_machine3").addEventListener("click", function() {
//     startTimer(1800, "Afficheur_temps3", "bouton_machine3_felling"); // Démarrer le minuteur avec une durée de 5 secondes
// });

// document.getElementById("bouton_temps_35_felling_machine3").addEventListener("click", function() {
//     startTimer(2100, "Afficheur_temps3", "bouton_machine3_felling"); // Démarrer le minuteur avec une durée de 5 secondes
// });

// document.getElementById("bouton_temps_40_felling_machine3").addEventListener("click", function() {
//     startTimer(2400, "Afficheur_temps3", "bouton_machine3_felling"); // Démarrer le minuteur avec une durée de 5 secondes
// });


// //--------MACHINE 4-------//
// document.getElementById("bouton_temps_30_felling_machine4").addEventListener("click", function() {
//     startTimer(1800, "Afficheur_temps4", "bouton_machine4_felling"); // Démarrer le minuteur avec une durée de 5 secondes
// });

// document.getElementById("bouton_temps_35_felling_machine4").addEventListener("click", function() {
//     startTimer(2100, "Afficheur_temps4", "bouton_machine4_felling"); // Démarrer le minuteur avec une durée de 5 secondes
// });

// document.getElementById("bouton_temps_40_felling_machine4").addEventListener("click", function() {
//     startTimer(2400, "Afficheur_temps4", "bouton_machine4_felling"); // Démarrer le minuteur avec une durée de 5 secondes
// });



function toggleButtonsState(Numero_Machine, desactive) {
    const buttons = document.querySelectorAll(`[id^="bouton_temps_"][id$="_felling_machine${Numero_Machine}"]`);
    buttons.forEach(button => {
        button.disabled = desactive;
    });
}

function addTimerButtonClickListeners(Numero_Machine) {
    const buttons = document.querySelectorAll(`[id^="bouton_temps_"][id$="_felling_machine${Numero_Machine}"]`);
    buttons.forEach(button => {
        const duration = parseInt(button.id.split("_")[2]);
        button.addEventListener("click", function() {
            toggleButtonsState(Numero_Machine, true);

            const boutonPrincipalId = `bouton_machine${Numero_Machine}_felling`;

            if (timers[boutonPrincipalId]) {
                console.log("Un timer est déjà en cours pour ce bouton machine.");
                return;
            }

            const machineId = boutonPrincipalId;
            const résidenceId = "Felling";
            const état = "Lancé";
            const dateDébut = new Date().toISOString();
            const typeDurée = duration.toString();
            const bodyData = { machineId, résidenceId, état, dateDébut, typeDurée };

            console.log('Données envoyées au backend :', bodyData);

            fetch('http://localhost:3000/timers/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorInfo => {
                        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText} - ${errorInfo.message}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('État et durée du timer mis à jour avec succès dans la base de données.', data);
            })
            .catch(error => {
                console.error('Erreur :', error);
            });

            //startTimer((duration) * 60, `Afficheur_temps${Numero_Machine}`, boutonPrincipalId, false, function() {                
            //    toggleButtonsState(Numero_Machine, false);
            //});
        });
    });
}

for (let i = 1; i <= 4; i++) {
    addTimerButtonClickListeners(i);
}

function cancelTimer(machineId) {
    const bodyData = {
        machineId: machineId,
        résidenceId: "Felling",
        état: "Libre",
        dateDébut: null,
        typeDurée: "30" // Défaut à "30"
    };
    console.log('cancel : Données envoyées au backend :', bodyData);
    fetch('http://localhost:3000/timers/cancel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorInfo => {
                throw new Error(`Erreur HTTP ${response.status}: ${response.statusText} - ${errorInfo.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('État du timer annulé avec succès dans la base de données.', data);
        updateButtonStates(); // Mise à jour des états des boutons après l'annulation
    })
    .catch(error => {
        console.error('Erreur lors de l\'annulation du timer :', error);
    });
}


function checkTimerDuration(timer) {
    const machineButton = document.querySelector(`#${timer.machineId}`);
    const timerDisplay = document.querySelector(`#Afficheur_temps${timer.machineId.split("_")[1].slice(-1)}`);
    const { dateDébut, typeDurée, machineId } = timer;
    const currentDate = new Date();
    const startDate = new Date(dateDébut);
    const durationInSeconds = parseInt(typeDurée) * 60;

    const elapsedTime = (currentDate - startDate) / 1000;
    const timeRemaining = durationInSeconds - elapsedTime;
    const minutesRemaining = Math.floor(timeRemaining / 60);
    const secondsRemaining = Math.floor(timeRemaining % 60);
    timerDisplay.innerText = `Temps restant : ${minutesRemaining} min ${secondsRemaining} sec`;

    if (timeRemaining <= 0) {
        console.log(`Le timer pour ${machineId} a dépassé la durée spécifiée.`);
        cancelTimer(machineId); // Annuler le timer si la durée est dépassée
    } else {
        console.log(`Temps restant pour ${machineId} : ${timeRemaining} secondes.`);
    }
}

function updateButtonStates() {
    fetch('http://localhost:3000/timers')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(timer => {
                const machineButton = document.querySelector(`#${timer.machineId}`);
                const timerDisplay = document.querySelector(`#Afficheur_temps${timer.machineId.split("_")[1].slice(-1)}`);
                const bouton_annuler = document.querySelector(`#annuler_bouton_felling_machine${timer.machineId.split("_")[1].slice(-1)}`);
                if (machineButton && timerDisplay) {
                    if (timer.état === 'Lancé') {
                        machineButton.innerText = 'Occupé';
                        machineButton.classList.add('red');
                        bouton_annuler.style.display = "table-cell";
                        checkTimerDuration(timer);
                    } else if (timer.état === 'Libre') {
                        machineButton.innerText = 'Libre';
                        machineButton.classList.remove('red');
                        timerDisplay.innerText = ''; // Effacer l'affichage du temps si la machine est libre
                        toggleButtonsState(timer.machineId.split("_")[1].slice(-1), false);
                        bouton_annuler.style.display = "none";
                    }
                }
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des états des boutons :', error);
        });
}



document.querySelectorAll('[id^="annuler_bouton_felling_machine"]').forEach((button, index) => {
    button.addEventListener("click", function() {
        const machineId = `bouton_machine${index + 1}_felling`;
        cancelTimer(machineId); // Appeler la fonction cancelTimer avec l'identifiant de la machine
    });
});

setInterval(updateButtonStates, 1000);
