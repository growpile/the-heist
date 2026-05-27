function createCameraResolver(script, objHelpers) {
    var existingCameras = {
        orthographic: [],
        perspective: []
    };

    function findAllCameras() {
        existingCameras.orthographic = [];
        existingCameras.perspective = [];

        if (script.useSpecificCameras) {
            if (script.orthographicCamera) existingCameras.orthographic.push(script.orthographicCamera);
            if (script.worldCamera) existingCameras.perspective.push(script.worldCamera);
            return existingCameras;
        }

        var cameras = [];
        var rootObjectsCount = global.scene.getRootObjectsCount();
        for (var i = 0; i < rootObjectsCount; i++) {
            var cams = objHelpers.getComponentsRecursive(global.scene.getRootObject(i), "Component.Camera") || [];
            cameras = cameras.concat(cams);
        }

        for (var i = 0; i < cameras.length; i++) {
            var camera = cameras[i];
            if (camera.type == 1) {
                existingCameras.orthographic.push(camera);
            } else {
                // treat any non-ortho camera as perspective to avoid missing custom/unknown types
                existingCameras.perspective.push(camera);
            }
        }
        return existingCameras;
    }

    function checkEnoughCamerasAndReturnMissingTypes(scoreDisplayType) {
        if (script.useSpecificCameras) {
            return [false, false];
        }

        findAllCameras();

        var neededTypes = [false, false];
        var hasOrtho = existingCameras.orthographic.length > 0;
        var hasPerspective = existingCameras.perspective.length > 0;
        switch (scoreDisplayType) {
            case 0:
                neededTypes[0] = !hasOrtho;
                neededTypes[1] = !hasPerspective;
                break;
            case 1:
                neededTypes[0] = !hasOrtho;
                // still require perspective if PB VFX is enabled
                neededTypes[1] = script.newBestVFX ? !hasPerspective : false;
                break;
        }
        return neededTypes;
    }

    return {
        findAllCameras: findAllCameras,
        checkEnoughCamerasAndReturnMissingTypes: checkEnoughCamerasAndReturnMissingTypes,
        existingCameras: existingCameras
    };
}

module.exports = createCameraResolver;
