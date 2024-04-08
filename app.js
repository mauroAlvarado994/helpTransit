const busStop = document.querySelector("#bStop");
const busNumber = document.querySelector("#bNumber");
const message = document.querySelector("#alerts");
const container = document.querySelector("#container");

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
        return 'red';
    } else if (busStatus === '*') {
        return 'green';
    } else if (busStatus === '+') {
        return 'blue';
    } else {
        return 'brown'; // Color por defecto si el estado no es reconocido
    }
}

function createCard(routeName, expectedLeaveTime, busStatus, countDown) {
    const row = document.createElement('div');
    row.classList.add('row', 'card', 'd-flex', 'justify-content-center', 'm-3');

    // Contenedor para la información del título y la fila de texto
    const titleContainer = document.createElement('div');
    titleContainer.classList.add('col-12', 'text-center', 'mb-3');

    const stopInfoRow = document.createElement('div');
    stopInfoRow.classList.add('row', 'mt-3');

    const busStopHeading = document.createElement('p');
    busStopHeading.textContent = `Bus Stop: ${busStop.value}`
    busStopHeading.classList.add('fw-bold', 'col-6');

    const busNameHeading = document.createElement('p');
    busNameHeading.textContent = `Bus Number: ${busNumber.value}`
    busNameHeading.classList.add('fw-bold', 'col-6')

    // Crear párrafo para "Route Name" y centrarlo
    const routeNamePara = document.createElement('p');
    routeNamePara.textContent = 'Route Name:';
    routeNamePara.classList.add('fs-6', 'mb-0', 'fw-bold'); // Agregar negrita
    titleContainer.appendChild(routeNamePara);

    // Crear párrafo para el nombre de la ruta y centrarlo
    const routeNameText = document.createElement('p');
    routeNameText.textContent = routeName;
    routeNameText.classList.add('fs-5', 'mb-3'); // Ajustar el tamaño del texto y el espacio inferior
    titleContainer.appendChild(routeNameText);

    // Crear fila para "Next Bus Time", "Bus Status", y "Countdown"
    const infoRow = document.createElement('div');
    infoRow.classList.add('row', 'mb-2');

    // Columna para "Next Bus Time"
    const timeCol = document.createElement('div');
    timeCol.classList.add('col', 'text-center'); // Centrar el texto

    const timePara = document.createElement('p');
    timePara.textContent = 'Next Bus Time:';
    timePara.classList.add('fs-6', 'mb-0');

    const timeText = document.createElement('p');
    timeText.textContent = expectedLeaveTime;
    timeText.classList.add('fs-6', 'mb-0');
    timeText.style.color = 'blue'; // Color azul

    timeCol.appendChild(timePara);
    timeCol.appendChild(timeText);

    // Columna para "Bus Status"
    const statusCol = document.createElement('div');
    statusCol.classList.add('col', 'text-center'); // Centrar el texto

    const statusPara = document.createElement('p');
    statusPara.textContent = 'Bus Status:';
    statusPara.classList.add('fs-6', 'mb-0');

    const statusText = document.createElement('p');
    statusText.textContent = getStatusDescription(busStatus);
    statusText.classList.add('fs-6', 'mb-0');
    statusText.style.color = getColorForStatus(busStatus); // Mantener el color según el estado

    statusCol.appendChild(statusPara);
    statusCol.appendChild(statusText);

    // Columna para "Countdown"
    const countdownCol = document.createElement('div');
    countdownCol.classList.add('col', 'text-center'); // Centrar el texto

    const countdownPara = document.createElement('p');
    countdownPara.textContent = 'Time Left to Leave:';
    countdownPara.classList.add('fs-6', 'mb-0');

    const countdownText = document.createElement('p');
    countdownText.textContent = countDown;
    countdownText.classList.add('fs-6', 'mb-0');
    countdownText.style.color = 'blue'; // Color azul

    countdownCol.appendChild(countdownPara);
    countdownCol.appendChild(countdownText);

    // Agregar columnas a la fila de información
    infoRow.appendChild(timeCol);
    infoRow.appendChild(statusCol);
    infoRow.appendChild(countdownCol);

    // Agregar fila de información al contenedor del título
    titleContainer.appendChild(infoRow);

    stopInfoRow.appendChild(busStopHeading);
    stopInfoRow.appendChild(busNameHeading);
    // Agregar el contenedor del título al elemento de la fila
    row.appendChild(stopInfoRow)
    row.appendChild(titleContainer);
    container.appendChild(row);
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
});
