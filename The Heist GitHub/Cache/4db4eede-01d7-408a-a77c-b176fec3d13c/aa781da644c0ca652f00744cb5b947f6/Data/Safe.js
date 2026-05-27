// @input Component.Text safeDebugText
/** @type {Text} */
var safeDebugText = script.safeDebugText;

function generateSerialNumber() {

}

function spawnRandomModule() {

}

function addToAppState(serialNumber) {
    global.appState.safe = {
        serialNumber: serialNumber,
        
    }
}

script.init = function() {



    servialNumber = generateSerialNumber();

    addToAppState(serialNumber);

    // generate serial number
    // spawn random modules & configure them
}