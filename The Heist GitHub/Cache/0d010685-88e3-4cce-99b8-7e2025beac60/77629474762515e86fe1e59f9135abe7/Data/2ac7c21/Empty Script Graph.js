


var wrapScript = function(spoof, original)
{
	spoof.createEvent = function(eventType) { return original.createEvent(eventType); };
spoof.removeEvent = function(event) { return original.removeEvent(event); };
spoof.getReferencedEvents = function() { return original.getReferencedEvents(); };
Object.defineProperty(spoof, "api", { get: function() { return original.api;}, set: function(value) { original.api = value; }});
spoof.destroy = function() { return original.destroy(); };
spoof.getSceneObject = function() { return original.getSceneObject(); };
spoof.getTransform = function() { return original.getTransform(); };
Object.defineProperty(spoof, "isEnabledInHierarchy", { get: function() { return original.isEnabledInHierarchy;}, set: function(value) { original.isEnabledInHierarchy = value; }});
Object.defineProperty(spoof, "name", { get: function() { return original.name;}, set: function(value) { original.name = value; }});
Object.defineProperty(spoof, "updatePriority", { get: function() { return original.updatePriority;}, set: function(value) { original.updatePriority = value; }});
Object.defineProperty(spoof, "enabled", { get: function() { return original.enabled;}, set: function(value) { original.enabled = value; }});
Object.defineProperty(spoof, "sceneObject", { get: function() { return original.sceneObject;}, set: function(value) { original.sceneObject = value; }});
Object.defineProperty(spoof, "uniqueIdentifier", { get: function() { return original.uniqueIdentifier;}, set: function(value) { original.uniqueIdentifier = value; }});
spoof.toString = function() { return original.toString(); };
spoof.getTypeName = function() { return original.getTypeName(); };
spoof.isOfType = function(type) { return original.isOfType(type); };
spoof.isSame = function(other) { return original.isSame(other); };

}

