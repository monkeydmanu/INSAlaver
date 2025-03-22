function toggleButtonsState(Numero_Machine, desactive) {
    const buttons = document.querySelectorAll(`[id^="bouton_temps_"][id$="_madrillets_machine${Numero_Machine}"]`);
    buttons.forEach(button => {
        button.disabled = desactive;
    });
}

function addTimerButtonClickListeners(Numero_Machine) {
    const buttons = document.querySelectorAll(`[id^="bouton_temps_"][id$="_madrillets_machine${Numero_Machine}"]`);
    buttons.forEach(button => {
        const duration = parseInt(button.id.split("_")[2]);
        button.addEventListener("click", function() {
            toggleButtonsState(Numero_Machine, true);

            const boutonPrincipalId = `bouton_machine${Numero_Machine}_madrillets`;

            if (timers[boutonPrincipalId]) {
                console.log("Un timer est déjà en cours pour ce bouton machine.");
                return;
            }

            const machineId = boutonPrincipalId;
            const résidenceId = "Madrillets";
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
        résidenceId: "Madrillets",
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
                const bouton_annuler = document.querySelector(`#annuler_bouton_madrillets_machine${timer.machineId.split("_")[1].slice(-1)}`);
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



document.querySelectorAll('[id^="annuler_bouton_madrillets_machine"]').forEach((button, index) => {
    button.addEventListener("click", function() {
        const machineId = `bouton_machine${index + 1}_madrillets`;
        cancelTimer(machineId); // Appeler la fonction cancelTimer avec l'identifiant de la machine
    });
});

setInterval(updateButtonStates, 1000);
