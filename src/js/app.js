import { checkInput, checkBusStop, checkBusNumber, addStop} from "/functions.js"

const busStop = document.querySelector("#bStop");
const busNumber = document.querySelector("#bNumber");
const message = document.querySelector("#alerts");
const addStopBus = document.querySelector("#btnAddStop");



document.addEventListener('DOMContentLoaded', () => {
    busStop.addEventListener('input', e => {
        checkInput(busStop, message);
    });

    busStop.addEventListener('change', e => {
        checkBusStop(busStop, message);
    });
    
    busNumber.addEventListener('input', e => {
        checkInput(busNumber, message);
        checkBusNumber(busNumber, message);
    });

    addStopBus.addEventListener('click', e =>{
        addStop(busStop, busNumber, message)
    });
});
