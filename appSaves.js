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
        row.classList.add('row', 'd-flex', 'mt-1', 'text-center', 'justify-content-center');
        return row;
    }

    // Función para crear una columna
    function createCol(colValue) {
        const col = document.createElement('div');
        col.classList.add(colValue, 'text-center');
        return col;
    }

    // Función para crear un título
    function createTitle(titleText) {
        const title = document.createElement('p');
        title.classList.add('fw-bold', 'me-2');
        title.textContent = titleText;
        return title;
    }

    // Función para crear un elemento de valor
    function createValueElement(value) {
        const element = document.createElement('p');
        element.textContent = value;
        return element;
    }

    function createBtn(text, color,) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('btn', color);
        return button;
    }

    // Crear elementos de fila
    const deleteRow = createRow();
    const tagRow = createRow();
    const informationRow = createRow();
    const consultRow = createRow();

    // Crear columnas para los títulos y valores
    const deleteCol = createCol('col-2');
    const infoTitleStop = createCol('col-6');
    const infoValueStop = createCol('col-6');
    const infoTitleNumber = createCol('col-6');
    const infoValueNumber = createCol('col-6');
    const consultCol = createCol('col-10');

    // Crear elementos de título
    const deleteBtn = createBtn("x", "btn-light"); // Botón de eliminar
    const tagTitle = createTitle("Route name: ");
    const busstopTitle = createTitle("Bus Stop: ");
    const busNumberTitle = createTitle("Bus Number: ");
    const consultBtn = createBtn("Consult", "btn-info"); // Botón de consulta

    // Crear elementos de valor
    const tagValue = createValueElement(routeName);
    const busstopValue = createValueElement(busstop);
    const busNumberValue = createValueElement(busNumber);

    // Agregar botón de eliminar a la columna correspondiente
    deleteCol.appendChild(deleteBtn);

    // Agregar títulos y valores a las columnas correspondientes
    infoTitleStop.appendChild(busstopTitle);
    infoValueStop.appendChild(busstopValue);
    infoTitleNumber.appendChild(busNumberTitle);
    infoValueNumber.appendChild(busNumberValue);

    // Agregar botón de consulta a la columna correspondiente
    consultCol.appendChild(consultBtn);

    // Agregar columnas a las filas correspondientes
    deleteRow.appendChild(deleteCol);
    tagRow.appendChild(tagTitle);
    tagRow.appendChild(tagValue);
    informationRow.appendChild(infoTitleStop);
    informationRow.appendChild(infoTitleNumber);
    informationRow.appendChild(infoValueStop);
    informationRow.appendChild(infoValueNumber);
    consultRow.appendChild(consultCol);

    // Agregar filas al card
    card.appendChild(deleteRow);
    card.appendChild(tagRow);
    card.appendChild(informationRow);
    card.appendChild(consultRow);

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
