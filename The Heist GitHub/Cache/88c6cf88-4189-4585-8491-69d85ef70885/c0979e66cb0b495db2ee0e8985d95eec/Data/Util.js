global.utils = self;
global.utils.lastAnimatedObject = null;
global.utils.shakeTarget = null;

// Changes the specified index' enabled state and then
// the rest of the array to the opposite
global.utils.stateChangeArrayWithException = function(array, exceptionIndex, exceptionState) {
    for(var i = 0; i<array.length; i++) {
        array[i].enabled = !exceptionState;
    }
    array[exceptionIndex].enabled = exceptionState;
}

// Changes the entire array to a specified enabled state
global.utils.stateChangeArray = function(array, state) {
    for(var i = 0; i<array.length; i++) {
        array[i].enabled = state;
    }
}

// Removes (destroys) all direct children of a SceneObject
global.utils.removeAllChildren = function(sceneObject) {
    if (!sceneObject) return;
    for (var i = sceneObject.getChildrenCount() - 1; i >= 0; i--) {
        var child = sceneObject.getChild(i);
        if (child) {
            child.destroy();
        }
    }
};


// Changes the entire array class property to a specified enabled state
global.utils.stateChangeArrayClassProperty = function(array, propName, state) {
    for(var i = 0; i<array.length; i++) {
        array[i][propName].enabled = state;
    }
}

// Returns a random Int between min/max
global.utils.rng = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Returns a random Float between min/max
global.utils.rngFloat = function(min, max, decimals) {
    var str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

// Linear interpolation
global.utils.lerp = function(start, end, amt){
    return (1-amt)*start+amt*end
}

// Returns true if the array contains the specified item
global.utils.arrayContains = function(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == item) {
            return true;
        }
    }
    return false;
}

// Returns true if every item in the array is true
global.utils.arrayAllTrue = function(array) {
    if (!array || array.length === 0) { return false; }
    for (var i = 0; i < array.length; i++) {
        if (array[i] !== true) {
            return false;
        }
    }
    return true;
}

// Executes a function after the specified time has elapsed
// Can be provided with an ID, so the delay can be prematurely invalidated
// global.utils.delay(2, callback) - No ID provided, can't be invalidated
// global.utils.delay("someId", 2, callback) - ID provided, can be invalidated
global.utils.delayedCallbacks = {};
global.utils.delay = function(idOrDelay, delayOrCallback, callback) {
    var id = null, delay, cb;
    
    if (typeof idOrDelay === "string" && typeof delayOrCallback === "number" && typeof callback === "function") {
        id = idOrDelay;
        delay = delayOrCallback;
        cb = callback;
    } else if (typeof idOrDelay === "number" && typeof delayOrCallback === "function") {
        delay = idOrDelay;
        cb = delayOrCallback;
    } else {
        return;
    }
    
    if (id && global.utils.delayedCallbacks[id]) {
        global.invalidateTimer(id);
    }

    var delayedEvent = script.createEvent("DelayedCallbackEvent");
    delayedEvent.bind(function () {
        if (id) {
            delete global.utils.delayedCallbacks[id];
        }
        cb();
    });

    delayedEvent.reset(delay);
    
    if (id) {
        global.utils.delayedCallbacks[id] = delayedEvent;
    }
};

// Invalidates the delay with matching ID
global.utils.invalidateDelay = function(id) {
    if (global.utils.delayedCallbacks[id]) {
        global.utils.delayedCallbacks[id].cancel();
        delete global.utils.delayedCallbacks[id];
    }
};

var activeAnimations = [];

function registerAnimation(sceneObject, animationData) {
    if (!sceneObject) return;

    // We'll store animations on the object itself
    if (!sceneObject.animations) {
        sceneObject.animations = [];
    }

    // Example: "objectName_position" → prefix = "position"
    var prefix = animationData.id.split("_")[1];

    // Cancel previous animation with same prefix
    for (var i = sceneObject.animations.length - 1; i >= 0; i--) {
        var existing = sceneObject.animations[i];
        if (existing.id.includes(prefix)) {
            if (existing.updateEvent) {
                existing.updateEvent.enabled = false;
            }
            sceneObject.animations.splice(i, 1);
        }
    }

    // Add to object and global list
    sceneObject.animations.push(animationData);
    activeAnimations.push(animationData);

    // Define cleanup method
    animationData.cleanup = function() {
        if (sceneObject.animations) {
            sceneObject.animations = sceneObject.animations.filter(a => a !== animationData);
        }
        activeAnimations = activeAnimations.filter(a => a !== animationData);
    };
}

global.utils.animatePosition = function(sceneObject, isLocal, newPosition, duration, callback) {
    if (!sceneObject) return;
    global.utils.lastAnimatedObject = sceneObject;

    var transform = sceneObject.getTransform();

    // Create animation data
    var animationData = {
        id: sceneObject.name + "_position",
        startTime: getTime(),
        updateEvent: script.createEvent("UpdateEvent")
    };

    // Register so cleanup() is added automatically
    registerAnimation(sceneObject, animationData);

    var startPosition = isLocal
        ? transform.getLocalPosition()
        : transform.getWorldPosition();

    animationData.updateEvent.bind(function() {
        var elapsed = getTime() - animationData.startTime;
        var t = Math.min(elapsed / duration, 1);

        // Smooth easing
        var smoothT = t * t * (3 - 2 * t);
        var currentPosition = vec3.lerp(startPosition, newPosition, smoothT);

        if (isLocal) {
            transform.setLocalPosition(currentPosition);
        } else {
            transform.setWorldPosition(currentPosition);
        }

        // When finished
        if (t >= 1) {
            if (isLocal) {
                transform.setLocalPosition(newPosition);
            } else {
                transform.setWorldPosition(newPosition);
            }

            // Clean up via registered cleanup()
            if (animationData.cleanup) {
                animationData.cleanup();
            }

            animationData.updateEvent.enabled = false;
            animationData.updateEvent = null;

            if (callback) callback();
        }
    });
};

global.utils.animateRotation = function(sceneObject, isLocal, newRotation, duration, callback) {
    if (!sceneObject) return;
    global.utils.lastAnimatedObject = sceneObject;

    var transform = sceneObject.getTransform();

    var animationData = {
        id: sceneObject.name + "_rotation",
        startTime: getTime(),
        updateEvent: script.createEvent("UpdateEvent")
    };

    // Register so cleanup() gets attached
    registerAnimation(sceneObject, animationData);

    // Convert incoming rotation (vec3 or quat) to quat
    var DEG_TO_RAD = 0.0174533;
    var targetQuat = newRotation instanceof quat
        ? newRotation
        : quat.fromEulerAngles(
            newRotation.x * DEG_TO_RAD,
            newRotation.y * DEG_TO_RAD,
            newRotation.z * DEG_TO_RAD
        );

    // Get starting rotation
    var startQuat = isLocal
        ? transform.getLocalRotation()
        : transform.getWorldRotation();

    animationData.updateEvent.bind(function() {
        var elapsed = getTime() - animationData.startTime;
        var t = Math.min(elapsed / duration, 1);
        var smoothT = t * t * (3 - 2 * t); // smooth easing

        // Slerp between quaternions
        var currentQuat = quat.slerp(startQuat, targetQuat, smoothT);
        currentQuat.normalize();

        if (isLocal) {
            transform.setLocalRotation(currentQuat);
        } else {
            transform.setWorldRotation(currentQuat);
        }

        if (t >= 1) {
            // Snap to final rotation
            if (isLocal) {
                transform.setLocalRotation(targetQuat);
            } else {
                transform.setWorldRotation(targetQuat);
            }

            if (animationData.cleanup) {
                animationData.cleanup();
            }

            animationData.updateEvent.enabled = false;
            animationData.updateEvent = null;

            if (callback) callback();
        }
    });
};

// write the scale animation function
global.utils.animateScale = function(sceneObject, isLocal, newScale, duration, callback) {
    if (!sceneObject) return;
    global.utils.lastAnimatedObject = sceneObject;

    var transform = sceneObject.getTransform();

    var animationData = {
        id: sceneObject.name + "_scale",
        startTime: getTime(),
        updateEvent: script.createEvent("UpdateEvent")
};

function randSigned() {
    return Math.random() * 2 - 1;
}

function randomOffset(amplitude, intensity) {
    return new vec3(
        randSigned() * amplitude.x * intensity,
        randSigned() * amplitude.y * intensity,
        randSigned() * amplitude.z * intensity
    );
}

function smoothVec3(current, target, speed, dt) {
    if (speed <= 0) {
        return target;
    }
    var t = 1 - Math.exp(-speed * dt);
    return current.add(target.sub(current).uniformScale(t));
}

function smoothstep01(t) {
    return t * t * (3 - 2 * t);
}

global.utils.animateShake = function(
    sceneObject,
    isLocal,
    duration,
    positionShake,
    rotationShake,
    positionAmplitude,
    positionSettings,
    rotationAmplitude,
    rotationSettings,
    returnSpeed,
    easeInOut,
    onDone
) {
    var targetObject = sceneObject || global.utils.shakeTarget || global.utils.lastAnimatedObject;
    if (!targetObject) {
        if (onDone) { onDone(); }
        return;
    }
    var transform = targetObject.getTransform();
    if (!transform) {
        if (onDone) { onDone(); }
        return;
    }

    var posFreq = positionSettings && positionSettings.length > 0 ? positionSettings[0] : 9;
    var posSmooth = positionSettings && positionSettings.length > 1 ? positionSettings[1] : 14;
    var rotFreq = rotationSettings && rotationSettings.length > 0 ? rotationSettings[0] : 9;
    var rotSmooth = rotationSettings && rotationSettings.length > 1 ? rotationSettings[1] : 14;
    var returnSpeedVal = returnSpeed !== undefined ? returnSpeed : 12;

    var basePos = isLocal ? transform.getLocalPosition() : transform.getWorldPosition();
    var baseRot = isLocal ? transform.getLocalRotation() : transform.getWorldRotation();
    var posOffset = new vec3(0, 0, 0);
    var rotOffset = new vec3(0, 0, 0);
    var posTarget = new vec3(0, 0, 0);
    var rotTarget = new vec3(0, 0, 0);
    var posTimer = 0;
    var rotTimer = 0;
    var startTime = getTime();
    var ending = false;

    var animationData = {
        id: targetObject.name + "_shake",
        startTime: startTime,
        updateEvent: script.createEvent("UpdateEvent")
    };

    registerAnimation(targetObject, animationData);

    animationData.updateEvent.bind(function() {
        var dt = getDeltaTime();
        var elapsed = getTime() - startTime;
        var t = duration > 0 ? Math.min(elapsed / duration, 1) : 1;
        var scale = easeInOut ? Math.sin(Math.PI * t) : 1;

        if (!ending && elapsed >= duration) {
            ending = true;
        }

        if (!ending) {
            if (positionShake) {
                var pFreq = Math.max(posFreq * scale, 0);
                posTimer += dt;
                if (pFreq > 0 && posTimer >= 1 / pFreq) {
                    posTimer = 0;
                    posTarget = randomOffset(positionAmplitude, scale);
                }
                posOffset = smoothVec3(posOffset, posTarget, posSmooth, dt);
            }
            if (rotationShake) {
                var rFreq = Math.max(rotFreq * scale, 0);
                rotTimer += dt;
                if (rFreq > 0 && rotTimer >= 1 / rFreq) {
                    rotTimer = 0;
                    rotTarget = randomOffset(rotationAmplitude, scale);
                }
                rotOffset = smoothVec3(rotOffset, rotTarget, rotSmooth, dt);
            }
        } else {
            posOffset = smoothVec3(posOffset, new vec3(0, 0, 0), returnSpeedVal, dt);
            rotOffset = smoothVec3(rotOffset, new vec3(0, 0, 0), returnSpeedVal, dt);
            var donePos = posOffset.length <= 0.001;
            var doneRot = rotOffset.length <= 0.001;
            if (donePos && doneRot) {
                if (isLocal) {
                    transform.setLocalPosition(basePos);
                    transform.setLocalRotation(baseRot);
                } else {
                    transform.setWorldPosition(basePos);
                    transform.setWorldRotation(baseRot);
                }
                if (animationData.cleanup) {
                    animationData.cleanup();
                }
                animationData.updateEvent.enabled = false;
                animationData.updateEvent = null;
                if (onDone) { onDone(); }
                return;
            }
        }

        var finalPos = basePos;
        if (positionShake) {
            finalPos = basePos.add(posOffset);
        }
        if (isLocal) {
            transform.setLocalPosition(finalPos);
        } else {
            transform.setWorldPosition(finalPos);
        }

        if (rotationShake) {
            var rotQuat = quat.fromEulerAngles(
                rotOffset.x * 0.017453292519943295,
                rotOffset.y * 0.017453292519943295,
                rotOffset.z * 0.017453292519943295
            );
            var finalRot = baseRot.multiply(rotQuat);
            if (isLocal) {
                transform.setLocalRotation(finalRot);
            } else {
                transform.setWorldRotation(finalRot);
            }
        } else {
            if (isLocal) {
                transform.setLocalRotation(baseRot);
            } else {
                transform.setWorldRotation(baseRot);
            }
        }
    });
};

    // Register so cleanup() gets attached
    registerAnimation(sceneObject, animationData);

    var startScale = isLocal
        ? transform.getLocalScale()
        : transform.getWorldScale();

    animationData.updateEvent.bind(function() {
        var elapsed = getTime() - animationData.startTime;
        var t = Math.min(elapsed / duration, 1);
        var smoothT = t * t * (3 - 2 * t); // smooth easing

        var currentScale = vec3.lerp(startScale, newScale, smoothT);
        transform.setLocalScale(currentScale);

        if (t >= 1) {
            // Snap to final scale
            if (isLocal) {
                transform.setLocalScale(newScale);
            } else {
                transform.setWorldScale(newScale);
            }

            if (animationData.cleanup) {
                animationData.cleanup();
            }

            animationData.updateEvent.enabled = false;
            animationData.updateEvent = null;

            if (callback) callback();
        }
    });
}

function resolveMaterialPropertyRef(property) {
    if (!property) { return null; }
    if (typeof property.get === "function" && typeof property.set === "function") {
        return { get: property.get, set: property.set, key: property.key || "prop" };
    }
    if (Array.isArray(property) && property.length >= 2) {
        var objArr = property[0];
        var keyArr = property[1];
        if (objArr && keyArr !== undefined) {
            return {
                get: function() { return objArr[keyArr]; },
                set: function(v) { objArr[keyArr] = v; },
                key: String(keyArr)
            };
        }
    }
    if (property.object && property.key !== undefined) {
        var obj = property.object;
        var key = property.key;
        return {
            get: function() { return obj[key]; },
            set: function(v) { obj[key] = v; },
            key: String(key)
        };
    }
    if (property.target && property.property !== undefined) {
        var obj2 = property.target;
        var key2 = property.property;
        return {
            get: function() { return obj2[key2]; },
            set: function(v) { obj2[key2] = v; },
            key: String(key2)
        };
    }
    if (property.material && property.path) {
        var root = property.material;
        var parts = String(property.path).split(".");
        for (var i = 0; i < parts.length - 1; i++) {
            if (!root) { return null; }
            root = root[parts[i]];
        }
        var leaf = parts[parts.length - 1];
        if (!root) { return null; }
        return {
            get: function() { return root[leaf]; },
            set: function(v) { root[leaf] = v; },
            key: parts.join(".")
        };
    }
    if (typeof property === "string" && global.utils.materialTarget) {
        return resolveMaterialPropertyRef({ material: global.utils.materialTarget, path: property });
    }
    return null;
}

// Animate any numeric material property (e.g. {material: mat, path: "mainPass.progress"})
global.utils.animateMaterialProperty = function(property, targetValue, duration, callback) {
    var ref = resolveMaterialPropertyRef(property);
    if (!ref || typeof ref.get !== "function" || typeof ref.set !== "function") {
        if (callback) { callback(); }
        return;
    }
    var startValue = ref.get();
    if (typeof startValue !== "number" || typeof targetValue !== "number") {
        ref.set(targetValue);
        if (callback) { callback(); }
        return;
    }

    var animOwner = ref;
    if (!animOwner.__materialAnims) {
        animOwner.__materialAnims = {};
    }
    var animKey = ref.key || "prop";
    var existing = animOwner.__materialAnims[animKey];
    if (existing && existing.updateEvent) {
        existing.updateEvent.enabled = false;
        existing.updateEvent = null;
    }

    var animData = {
        startTime: getTime(),
        updateEvent: script.createEvent("UpdateEvent")
    };
    animOwner.__materialAnims[animKey] = animData;

    animData.updateEvent.bind(function() {
        var elapsed = getTime() - animData.startTime;
        var t = Math.min(elapsed / duration, 1);
        var smoothT = t * t * (3 - 2 * t);
        ref.set(startValue + (targetValue - startValue) * smoothT);
        if (t >= 1) {
            ref.set(targetValue);
            animData.updateEvent.enabled = false;
            animData.updateEvent = null;
            if (callback) { callback(); }
        }
    });
};
