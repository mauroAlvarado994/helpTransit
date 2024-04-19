import{alertMessages, checkInput, checkBusStop, checkBusNumber, dontEmpty} from "/src/js/functions.js";

const tag = document.querySelector('#tag');
const stopNumber = document.querySelector('#bStop');
const busNumber = document.querySelector('#bNumber');
const alert = document.querySelector('#succes');
const save = document.querySelector('#btnAddStop');
const danger = document.querySelector('#alerts');


function checkStopValidity(stop, number, callback) {
    if (stop.trim() === '' || number.trim() === '') {
        callback(false); // Indicar que no se proporcionaron datos de parada o número de autobús
        return;
    }

    const apiKey = "B8Vq87yydqWBKKRPrmHb";

    const apiUrl = `https://api.translink.ca/rttiapi/v1/stops/${stop}/estimates?apikey=${apiKey}&routeNo=${number}`;

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
            callback(true); // Indicar que la parada de autobús es válida
        } else {
            callback(false); // Indicar que la parada de autobús no es válida
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        callback(false); // Indicar que hubo un error al verificar la parada de autobús
    });
}

function saveStop() {
    if (stopNumber.value === "" || busNumber.value === "") {
        alertMessages("Empty inputs, you can't continue", alert, "danger");
        return;
    }

    const savedStops = JSON.parse(localStorage.getItem("savedStops")) || [];

    // Verificar si ya existe una parada de autobús con el mismo número de parada y número de autobús
    const existingStop = savedStops.find(stop => {
        return stop.stop === stopNumber.value && stop.bus === busNumber.value;
    });

    if (existingStop) {
        alertMessages("This bus stop is already saved.", container, "danger");
        stopNumber.value = "";
        busNumber.value = "";
        return;
    }

    // Si no se encuentra una parada de autobús con el mismo nombre y número, continuar con la verificación de la parada de autobús
    checkStopValidity(stopNumber.value, busNumber.value, function(valid) {
        if (valid) {
            // Crear un objeto con los valores
            var newStop = {
                value: tag.value,
                stop: stopNumber.value,
                bus: busNumber.value,
                id: "Card_" + Date.now()
            };

            // Agregar la nueva parada al array
            savedStops.push(newStop);

            // Guardar el array actualizado en el almacenamiento local
            localStorage.setItem("savedStops", JSON.stringify(savedStops));

            alertMessages("Stop bus added to your list.", container, "success");

            tag.value = "";
            stopNumber.value = "";
            busNumber.value = "";
        } else {
            alertMessages("Bus data was not found for the provided stop and route.", container, "danger");
            stopNumber.value = "";
            busNumber.value = "";
            return;
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    save.addEventListener('click', e =>{
        saveStop();
    });

    tag.addEventListener('input', e =>{
        dontEmpty(tag, danger);
    });

    stopNumber.addEventListener('input', e =>{
        checkInput(stopNumber, danger);
    });

    stopNumber.addEventListener('change', e =>{
        checkBusStop(stopNumber, danger);
    });

    busNumber.addEventListener('input', e =>{
        checkInput(busNumber, danger);
        checkBusNumber(busNumber, danger);
    });
});