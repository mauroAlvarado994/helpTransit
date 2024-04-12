const container = document.querySelector('#stops');

function retrieveAndDisplayData() {
    var count = localStorage.getItem("stopCount") || 0;
    count = parseInt(count);

    for (var i = 0; i < count; i++) {
        var datosJSON = localStorage.getItem("DataSaved_" + i);
        var datos = JSON.parse(datosJSON);
        createCard(datos.value, datos.stop, datos.bus);
    }
}

function createCard(routeName, busstop, busNumber) {
    const card = document.createElement('div');
    card.classList.add('card', 'p-2', 'mt-3');

    // Función para crear una fila
    function createRow() {
        const row = document.createElement('div');
        row.classList.add('row', 'd-flex', 'mt-1', 'text-center');
        return row;
    }

    // Función para crear una columna
    function createCol(colValue) {
        const col = document.createElement('div'); // Cambié 'createAttribute' a 'createElement'
        col.classList.add(colValue, 'text-center');
        return col;
    }

    // Función para crear un título
    function createTitle(titleText) {
        const title = document.createElement('p');
        title.classList.add('fw-bold', 'me-2'); // Agregué 'me-2' para un espacio entre el título y el valor
        title.textContent = titleText;
        return title;
    }

    // Función para crear un elemento de valor
    function createValueElement(value) {
        const element = document.createElement('p');
        element.textContent = value;
        return element;
    }

    // Crear elementos de fila
    const deleteRow = createRow();
    const tagRow = createRow();
    const informationRow = createRow();

    // Crear columnas para los títulos y valores
    const infoTitleStop = createCol('col-6');
    const infoValueStop = createCol('col-6');
    const infoTitleNumber = createCol('col-6');
    const infoValueNumber = createCol('col-6');

    // Crear elementos de título
    const tagTitle = createTitle("Route name: ")

    const busstopTitle = createTitle("Bus Stop: ");
    const busNumberTitle = createTitle("Bus Number: ");

    // Crear elementos de valor
    const tagValue = createValueElement(routeName);
    const busstopValue = createValueElement(busstop);
    const busNumberValue = createValueElement(busNumber);

    // Agregar títulos y valores a las columnas correspondientes
    infoTitleStop.appendChild(busstopTitle);
    infoValueStop.appendChild(busstopValue);
    infoTitleNumber.appendChild(busNumberTitle);
    infoValueNumber.appendChild(busNumberValue);

    // Agregar columnas a la fila de información
    tagRow.appendChild(tagTitle);
    tagRow.appendChild(tagValue);

    informationRow.appendChild(infoTitleStop);
    informationRow.appendChild(infoTitleNumber);
    informationRow.appendChild(infoValueStop);
    informationRow.appendChild(infoValueNumber);

    // Agregar fila de información al card
    card.appendChild(deleteRow);
    card.appendChild(tagRow);
    card.appendChild(informationRow);

    // Agregar card al contenedor principal
    container.appendChild(card);
}



function deleteStop(index) {
    localStorage.removeItem("DataSaved_" + index);
}

function addStop(busstop, busNumber, container) {
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

            createCard(routeName, expectedLeaveTime, busStatus, countDown, busstop, busNumber); // Corregido: pasamos 'busstop' y 'busNumber' como argumentos
            console.log(data)
        } else {
            alertMessages("Bus data was not found for the provided stop and route.", container, "danger");
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    retrieveAndDisplayData();
});
