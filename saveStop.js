import{alertMessages, checkInput, checkBusStop, checkBusNumber, dontEmpty} from "/functions.js";

const tag = document.querySelector('#tag');
const stopNumber = document.querySelector('#bStop');
const busNumber = document.querySelector('#bNumber');
const alert = document.querySelector('#succes');
const save = document.querySelector('#btnAddStop');
const danger = document.querySelector('#alerts');


function saveStop() {

    if(tag.value === "" || stopNumber.value === "" || busNumber === ""){
        alertMessages("Empty inputs you can't continue", danger, "danger");
        return
    }

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
    localStorage.setItem("DataSaved_" + count, datosJSON);

    // Incrementar el contador de paradas guardadas
    localStorage.setItem("stopCount", count + 1);

    alertMessages("Stop bus added to your list.", alert, "success");

    tag.value = "";
    stopNumber.value = "";
    busNumber.value = "";
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