const container = document.querySelector('#stops');

function retrieveAndDisplayData() {
    var count = localStorage.getItem("stopCount") || 0;
    count = parseInt(count);

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.startsWith("DataSaved_")) {
            var datosJSON = localStorage.getItem(key);
            var datos = JSON.parse(datosJSON);
            createCard(datos.value, datos.stop, datos.bus, key);
        }
    }
}

function createRow() {
    const row = document.createElement('div');
    row.classList.add('row', 'd-flex', 'mt-1', 'text-center', 'justify-content-center');
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

    const deleteCol = createCol('col-2', 'offset-10');
    const infoTitleStop = createCol('col-6');
    const infoValueStop = createCol('col-6');
    const infoTitleNumber = createCol('col-6');
    const infoValueNumber = createCol('col-6');
    const consultCol = createCol('col-10');

    const deleteBtn = createBtn("x", "btn-light", () => deleteCardAndData(id, card));
    const tagTitle = createTitle("Route name: ");
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

    container.appendChild(card);
}

function deleteCardAndData(id, card) {
    var count = localStorage.getItem("stopCount") || 0;
    count = parseInt(count);
    localStorage.setItem("stopCount", count - 1);

    localStorage.removeItem(id);
    card.remove();
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
            alertMessages("Bus data was not found for the provided stop and route.", containerId, "danger");
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function consult(routeName, expectedLeaveTime, busStatus, countDown, busstop, busNumber, containerId){
    const card = document.createElement('Div');
    card.classList.add('card', 'text-center', 'mt-2');
    card.id = containerId;

    const deletRow = createRow();
    const deleteCol = createCol('col-2', 'offset-10');
    const deleteBtn = createBtn("x", "btn-light");

    deleteCol.appendChild(deleteBtn);    
    deletRow.appendChild(deleteCol)    
    card.appendChild(deletRow);

    const container = document.getElementById(containerId);
    container.appendChild(card);
}

document.addEventListener('DOMContentLoaded', () => {
    retrieveAndDisplayData();
});
