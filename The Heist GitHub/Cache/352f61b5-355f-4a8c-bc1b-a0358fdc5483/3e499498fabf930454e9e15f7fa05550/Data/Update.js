//@input Component.ScriptComponent volLine
/** @type {ScriptComponent} */
var volLine = script.volLine;

script.createEvent("UpdateEvent").bind(function() {
    if(volLine) volLine.updateMesh();
})