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
    if (tag.value === "" || stopNumber.value === "" || busNumber === "") {
        alertMessages("Empty inputs you can't continue", danger, "danger");
        return;
    }

    checkStopValidity(stopNumber.value, busNumber.value, function(valid) {
        if (valid) {
            // Obtener el contador actual de paradas guardadas
            var count = localStorage.getItem("stopCount") || 0;
            count = parseInt(count);

            // Crear un objeto con los valores
            var datos = {
                value: tag.value,
                stop: stopNumber.value,
                bus: busNumber.value
            };

            // Convertir el objeto a JSON
            var datosJSON = JSON.stringify(datos);

            // Guardar en localStorage con una clave única
            localStorage.setItem("DataSaved_" + Date.now(), datosJSON);

            // Incrementar el contador de paradas guardadas
            localStorage.setItem("stopCount", count + 1);

            alertMessages("Stop bus added to your list.", alert, "success");

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