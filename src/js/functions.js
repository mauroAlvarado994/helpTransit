function ClearHTML(result) {
    if (result && result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

function alertMessages(messages, container, color) {
    ClearHTML(container);

    const alert = document.createElement('P');
    alert.textContent = messages;
    alert.classList.add(`text-${color}`, 'fw-bold', 'fs-6', 'mx-3', 'text-center');

    container.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function checkInput(input, container) {
    if (input.value.length < 1) {
        alertMessages("This input is empty, please fill it to continue", container, "danger");
    }
    
    if (isNaN(input.value)) {
        alertMessages('This is not a number, you have to write a number to continue', container, "danger");
        input.value = "";
    }
    return;
}

function checkBusStop(input, container) {
    const value = input.value.trim();
    if (value.length < 5) {
        alertMessages('The bus stop number must be at least 5 digits', container, "danger");
        input.value = "";
    } else if (value.length > 5) {
        alertMessages('The bus stop number cannot be more than 5 digits', container, "danger");
        input.value = "";
    }

    return;
}

function checkBusNumber(input, container) {
    const value = input.value.trim();
    if (value.length > 3) {
        alertMessages('The bus number cannot be more than 3 digits', container, "danger");
        input.value = "";
    }
}

function addStop(stop, number, container) {
    if (stop.value.trim() === '' || number.value.trim() === '') {
        alertMessages('Please fill all fields before adding a stop bus.', container, "danger");
        return;
    }

    const apiKey = "B8Vq87yydqWBKKRPrmHb";

    const apiUrl = `https://api.translink.ca/rttiapi/v1/stops/${stop.value}/estimates?apikey=${apiKey}&routeNo=${number.value}`;

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

            createCard(routeName, expectedLeaveTime, busStatus, countDown, stop, number);
            console.log(data)
        } else {
            alertMessages("Bus data was not found for the provided stop and route.", container, "danger");
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

function createCard(routeName, expectedLeaveTime, busStatus, countDown, stop, number) {
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
    stopValue.textContent = stop.value;
    stopValue.classList.add('text-truncate', 'text-primary');
    stopCol.appendChild(stopValue);

    const busNumCol = document.createElement('div');
    busNumCol.classList.add('col-6');

    const busNumLabel = document.createElement('p');
    busNumLabel.textContent = 'Bus number:';
    busNumLabel.classList.add('fw-bold')
    busNumCol.appendChild(busNumLabel);

    const busNumValue = document.createElement('p');
    busNumValue.textContent = number.value;
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

function dontEmpty(input, container){
    if(input.value.length <= 0 ){
        alertMessages("this input can't be empty", container, "danger")
    }
}
export {ClearHTML, alertMessages, checkInput, checkBusStop, checkBusNumber, addStop, dontEmpty}