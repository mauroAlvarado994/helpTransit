const busStop = document.querySelector("#bStop");
const busNumber = document.querySelector("#bNumber");
const message = document.querySelector("#alerts");
const container = document.querySelector("#container");
const addStopBus = document.querySelector("#btnAddStop")

function ClearHTML(result) {
    if (result && result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

function alertMessages(messages) {
    ClearHTML(message);

    const alert = document.createElement('P');
    alert.textContent = messages;
    alert.classList.add('text-danger', 'fw-bold', 'fs-6', 'mx-3', 'text-center');

    message.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function checkInput(input) {
    if (input.value.length < 1) {
        alertMessages("This input is empty, please fill it to continue");
    }
    
    if (isNaN(input.value)) {
        alertMessages('This is not a number, you have to write a number to continue');
        input.value = "";
    }
    return;
}

function checkBusStop(input) {
    const value = input.value.trim();
    if (value.length < 5) {
        alertMessages('The bus stop number must be at least 5 digits');
        input.value = "";
    } else if (value.length > 5) {
        alertMessages('The bus stop number cannot be more than 5 digits');
        input.value = "";
    }

    return;
}

function checkBusNumber(input) {
    const value = input.value.trim();
    if (value.length > 3) {
        alertMessages('The bus number cannot be more than 3 digits');
        input.value = "";
    }
}

function agregarParada() {
    if (busStop.value.trim() === '' || busNumber.value.trim() === '') {
        alertMessages('Please fill all fields before adding a stop bus.');
        return;
    }

    const apiKey = "B8Vq87yydqWBKKRPrmHb";

    const apiUrl = `https://api.translink.ca/rttiapi/v1/stops/${busStop.value}/estimates?apikey=${apiKey}&routeNo=${busNumber.value}`;

    fetch(apiUrl, {
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    })
    .then(data => {
        if (data && data.length > 0) {
            const firstBus = data[0];
            const routeName = firstBus.RouteName;
            const firstBusSchedule = firstBus.Schedules[0];
            const expectedLeaveTime = firstBusSchedule.ExpectedLeaveTime;
            const busStatus = firstBusSchedule.ScheduleStatus;
            const countDown = firstBusSchedule.ExpectedCountdown;

            createCard(routeName, expectedLeaveTime, busStatus, countDown);
            console.log(data)
        } else {
            alertMessages("Bus data was not found for the provided stop and route.");
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function getStatusDescription(busStatus) {
    if (busStatus === "*") {
        return 'On Time';
    } else if (busStatus === '-') {
        return 'Delayed';
    } else if (busStatus === '+') {
        return 'Ahead of Schedule';
    } else {
        return 'No info';
    }
}

function getColorForStatus(busStatus) {
    if (busStatus === '-') {
        return 'text-danger';
    } else if (busStatus === '*') {
        return 'text-success';
    } else if (busStatus === '+') {
        return 'text-primary';
    } else {
        return 'text-danger'; // Color por defecto si el estado no es reconocido
    }
}

function createCard(routeName, expectedLeaveTime, busStatus, countDown) {
    ClearHTML(container);

    const card = document.createElement('div');
    card.classList.add('card', 'mt-3');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const stopRow = document.createElement('div');
    stopRow.classList.add('row', 'text-center');

    const stopCol = document.createElement('div');
    stopCol.classList.add('col-6');

    const stopLabel = document.createElement('p');
    stopLabel.textContent = 'Bus Stop:';
    stopLabel.classList.add('fw-bold')
    stopCol.appendChild(stopLabel);

    const stopValue = document.createElement('p');
    stopValue.textContent = busStop.value;
    stopValue.classList.add('text-truncate', 'text-primary');
    stopCol.appendChild(stopValue);

    const busNumCol = document.createElement('div');
    busNumCol.classList.add('col-6');

    const busNumLabel = document.createElement('p');
    busNumLabel.textContent = 'Bus number:';
    busNumLabel.classList.add('fw-bold')
    busNumCol.appendChild(busNumLabel);

    const busNumValue = document.createElement('p');
    busNumValue.textContent = busNumber.value;
    busNumValue.classList.add('text-truncate', 'text-primary');
    busNumCol.appendChild(busNumValue);

    stopRow.appendChild(stopCol);
    stopRow.appendChild(busNumCol);

    const routeRow = document.createElement('div');
    routeRow.classList.add('row', 'text-center');

    const routeLabel = document.createElement('p');
    routeLabel.textContent = 'Route Name:';
    routeLabel.classList.add('fw-bold')
    routeRow.appendChild(routeLabel);

    const routeValue = document.createElement('p');
    routeValue.textContent = routeName;
    routeValue.classList.add('text-truncate', 'text-primary');
    routeRow.appendChild(routeValue);

    const timeRow = document.createElement('div');
    timeRow.classList.add('row', 'text-center');

    const netBusCol = document.createElement('div');
    netBusCol.classList.add('col-4');

    const netBusLabel = document.createElement('p');
    netBusLabel.textContent = 'Next Bus:';
    netBusLabel.classList.add('fw-bold')
    netBusCol.appendChild(netBusLabel);

    const netBusValue = document.createElement('p');
    const horaSalida = expectedLeaveTime.split(" ")[0]; // Aquí se extrae solo la hora
    netBusValue.textContent = horaSalida;
    netBusValue.classList.add('text-truncate', 'text-primary');
    netBusCol.appendChild(netBusValue);

    const statusCol = document.createElement('div');
    statusCol.classList.add('col-4');

    const statusLabel = document.createElement('p');
    statusLabel.textContent = 'Bus Status:';
    statusLabel.classList.add('fw-bold')
    statusCol.appendChild(statusLabel);

    const statusValue = document.createElement('p');
    statusValue.textContent = getStatusDescription(busStatus);
    statusValue.classList.add(`${getColorForStatus(busStatus)}`)
    statusCol.appendChild(statusValue);

    const timeLeftCol = document.createElement('div');
    timeLeftCol.classList.add('col-4');

    const timeLeftLabel = document.createElement('p');
    timeLeftLabel.textContent = 'Time Left:';
    timeLeftLabel.classList.add('fw-bold')
    timeLeftCol.appendChild(timeLeftLabel);

    const timeLeftValue = document.createElement('p');
    timeLeftValue.textContent = `${countDown} Min`;
    timeLeftValue.classList.add('text-truncate', 'text-primary');
    timeLeftCol.appendChild(timeLeftValue);

    timeRow.appendChild(netBusCol);
    timeRow.appendChild(statusCol);
    timeRow.appendChild(timeLeftCol);

    const lastUpdateRow = document.createElement('div');
    lastUpdateRow.classList.add('row', 'text-center');

    const lastUpdateLabel = document.createElement('p');
    lastUpdateLabel.textContent = 'Last Update:';
    lastUpdateLabel.classList.add('fw-bold')
    lastUpdateRow.appendChild(lastUpdateLabel);

    const lastUpdateValue = document.createElement('p');
    lastUpdateValue.textContent = new Date().toLocaleTimeString();
    lastUpdateValue.classList.add('text-truncate', 'text-primary');
    lastUpdateRow.appendChild(lastUpdateValue);

    cardBody.appendChild(stopRow);
    cardBody.appendChild(routeRow);
    cardBody.appendChild(timeRow);
    cardBody.appendChild(lastUpdateRow);

    card.appendChild(cardBody);
    container.appendChild(card);
}

function guardarEnLocalStorage() {
    // Obtener los valores de los elementos HTML
    var valorInput = document.getElementById("valorInput").value;
    var numeroParada = document.getElementById("numeroParada").value;
    var numeroBus = document.getElementById("numeroBus").value;

    // Crear un objeto con los valores
    var datos = {
        valor: valorInput,
        parada: numeroParada,
        bus: numeroBus
    };

    // Convertir el objeto a JSON
    var datosJSON = JSON.stringify(datos);

    // Guardar en localStorage
    localStorage.setItem("datosGuardados", datosJSON);

    alert("Datos guardados en localStorage.");
}


document.addEventListener('DOMContentLoaded', () => {
    busStop.addEventListener('input', e => {
        checkInput(busStop);
    });

    busStop.addEventListener('change', e => {
        checkBusStop(busStop);
    });
    
    busNumber.addEventListener('input', e => {
        checkInput(busNumber);
        checkBusNumber(busNumber);
    });

    addStopBus.addEventListener('click', e =>{
        agregarParada()
    });
});
