const container = document.querySelector('#stops');

function retrieveAndDisplayData() {
    // Obtener el número total de datos almacenados
    var count = localStorage.getItem("stopCount") || 0;
    count = parseInt(count);

    // Iterar sobre los datos almacenados y crear una tarjeta por cada uno
    for (var i = 0; i < count; i++) {
        // Obtener el JSON almacenado en localStorage
        var datosJSON = localStorage.getItem("DataSaved_" + i);

        // Convertir el JSON de nuevo a un objeto JavaScript
        var datos = JSON.parse(datosJSON);

        // Crear una tarjeta con los datos recuperados
        createCard(datos.value, datos.stop, datos.bus);
    }
}

function createCard(tagValue, stopNumberValue, busNumberValue, index) {
    // Crear la estructura de la tarjeta
    var card = document.createElement('div');
    card.classList.add('card', 'mt-3');

    // Crear el contenido de la tarjeta
    var cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    // Crear elementos para mostrar los datos
    var tagElement = document.createElement('p');
    tagElement.textContent = "Tag: " + tagValue;

    var stopNumberElement = document.createElement('p');
    stopNumberElement.textContent = "Stop Number: " + stopNumberValue;

    var busNumberElement = document.createElement('p');
    busNumberElement.textContent = "Bus Number: " + busNumberValue;

    // Agregar los elementos al contenido de la tarjeta
    cardContent.appendChild(tagElement);
    cardContent.appendChild(stopNumberElement);
    cardContent.appendChild(busNumberElement);

    // Agregar el contenido a la tarjeta
    card.appendChild(cardContent);

    // Crear un botón para eliminar la parada
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'mt-2');
    deleteButton.addEventListener('click', function() {
        deleteStop(index);
        card.remove(); // Eliminar la tarjeta del DOM cuando se hace clic en el botón de eliminar
    });

    // Agregar el botón de eliminar a la tarjeta
    card.appendChild(deleteButton);

    // Agregar la tarjeta al contenedor
    container.appendChild(card);
}

function deleteStop(index) {
    // Eliminar el dato correspondiente al índice del localStorage
    localStorage.removeItem("DataSaved_" + index);
}


// Llama a esta función cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    retrieveAndDisplayData();
});
