import { getStatusDescription, getColorForStatus } from "/src/js/functions.js";

const container = document.querySelector('#stops');

function retrieveAndDisplayData() {
    const savedStops = JSON.parse(localStorage.getItem("savedStops")) || [];

    savedStops.forEach(stop => {
        createCard(stop.value, stop.stop, stop.bus, stop.id);
    });
}


function createRow(id) {
    const row = document.createElement('div');
    row.classList.add('row', 'd-flex', 'mt-1', 'text-center', 'justify-content-center');
    row.id = id
    return row;
}

function createCol(colValue, space) {
    const col = document.createElement('div');
    col.classList.add(colValue, 'text-center', space);
    return col;
}

function createTitle(titleText) {
    const title = document.createElement('p');
    title.classList.add('fw-bold', 'me-2');
    title.textContent = titleText;
    return title;
}

function createValueElement(value) {
    const element = document.createElement('p');
    element.textContent = value;
    return element;
}

function createBtn(text, color, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('btn', color, 'w-100');
    button.addEventListener('click', clickHandler);
    return button;
}

function createCard(routeName, busstop, busNumber, key) {
    const id = key

    const card = document.createElement('div');
    card.id = id
    card.classList.add('card', 'p-2', 'mt-3');

    const deleteRow = createRow();
    const tagRow = createRow();
    const informationRow = createRow();
    const consultRow = createRow();
    const resultRow = createRow("RES" + key);

    const deleteCol = createCol('col-2', 'offset-10');
    const infoTitleStop = createCol('col-6');
    const infoValueStop = createCol('col-6');
    const infoTitleNumber = createCol('col-6');
    const infoValueNumber = createCol('col-6');
    const consultCol = createCol('col-10');

    const deleteBtn = createBtn("x", "btn-light", () => deleteCardAndData(id, card));
    const tagTitle = createTitle("Route TAG: ");
    const busstopTitle = createTitle("Bus Stop: ");
    const busNumberTitle = createTitle("Bus Number: ");
    const consultBtn = createBtn("Consult", "btn-info", () => addStop(busstop, busNumber, id));

    const tagValue = createValueElement(routeName);
    const busstopValue = createValueElement(busstop);
    const busNumberValue = createValueElement(busNumber);

    deleteCol.appendChild(deleteBtn);

    infoTitleStop.appendChild(busstopTitle);
    infoValueStop.appendChild(busstopValue);
    infoTitleNumber.appendChild(busNumberTitle);
    infoValueNumber.appendChild(busNumberValue);

    consultCol.appendChild(consultBtn);

    deleteRow.appendChild(deleteCol);
    tagRow.appendChild(tagTitle);
    tagRow.appendChild(tagValue);
    informationRow.appendChild(infoTitleStop);
    informationRow.appendChild(infoTitleNumber);
    informationRow.appendChild(infoValueStop);
    informationRow.appendChild(infoValueNumber);
    consultRow.appendChild(consultCol);

    card.appendChild(deleteRow);
    card.appendChild(tagRow);
    card.appendChild(informationRow);
    card.appendChild(consultRow);
    card.appendChild(resultRow);

    container.appendChild(card);
}

function deleteCardAndData(id) {
    // Obtener el array de paradas guardadas del almacenamiento local
    const savedStops = JSON.parse(localStorage.getItem("savedStops")) || [];

    // Buscar el índice del elemento en el array que tiene el mismo ID que se pasa a la función
    const index = savedStops.findIndex(stop => stop.id === id);

    // Verificar si se encontró el elemento con el ID proporcionado
    if (index !== -1) {
        // Eliminar el elemento del array usando su índice
        savedStops.splice(index, 1);
        // Guardar el array actualizado en el almacenamiento local
        localStorage.setItem("savedStops", JSON.stringify(savedStops));

        // Obtener la tarjeta del DOM utilizando su ID
        const card = document.getElementById(id);
        // Si la tarjeta existe, eliminarla del DOM
        if (card) {
            card.remove();
        }
    }
}



function addStop(busstop, busNumber, containerId) {
    const apiKey = "B8Vq87yydqWBKKRPrmHb";

    const apiUrl = `https://api.translink.ca/rttiapi/v1/stops/${busstop}/estimates?apikey=${apiKey}&routeNo=${busNumber}`;

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

            consult(routeName, expectedLeaveTime, busStatus, countDown, busstop, busNumber, containerId);
            console.log(data)
        } else {
            alert("Bus data was not found for the provided stop and route.");
        }
    })
    .catch(error => {
        alert('There was a problem with the fetch operation: ' + error.message);
    });
}


function consult(routeName, expectedLeaveTime, busStatus, countDown, busstop, busNumber, containerId){

    const resultContainer = document.getElementById("RES" + containerId);

    // Limpiar el contenido del contenedor
    resultContainer.innerHTML = "";

    const card = document.createElement('div');
    card.classList.add('col-11','card', 'mt-3');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

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

    cardBody.appendChild(routeRow);
    cardBody.appendChild(timeRow);
    cardBody.appendChild(lastUpdateRow);

    card.appendChild(cardBody);
    resultContainer.appendChild(card);

    setTimeout(() => {
        card.remove();
    }, 60000);
}


document.addEventListener('DOMContentLoaded', () => {
    retrieveAndDisplayData();
});
