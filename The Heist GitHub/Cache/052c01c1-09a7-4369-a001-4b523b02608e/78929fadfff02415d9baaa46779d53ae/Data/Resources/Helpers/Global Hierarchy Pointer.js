// @input string pointerIdentifier
if (!global.hierarchyPointers) { global.hierarchyPointers = {} }
var id = script.pointerIdentifier;
var obj = script.getSceneObject();

if (id && obj) {
    var existing = global.hierarchyPointers[id];
    if (!existing) {
        global.hierarchyPointers[id] = obj;
    } else if (existing instanceof Array) {
        existing.push(obj);
    } else {
        global.hierarchyPointers[id] = [existing, obj];
    }
}