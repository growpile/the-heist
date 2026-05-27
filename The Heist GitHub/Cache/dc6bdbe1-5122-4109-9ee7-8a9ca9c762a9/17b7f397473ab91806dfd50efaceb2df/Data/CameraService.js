// @input Component.Camera editorCamera
// @input Asset.Texture screenCropTexture
let cameraModule = require('LensStudio:CameraModule');

var CameraModule = require('LensStudio:CameraModule');

var cameraModule = script.camModule && script.camModule.requestCamera ? script.camModule : CameraModule;
var isEditor = global.deviceInfoSystem.isEditor();

script.createEvent("OnStartEvent").bind(function () {
    var camID = isEditor ? CameraModule.CameraId.Default_Color : CameraModule.CameraId.Right_Color;
    var camRequest = CameraModule.createCameraRequest();
    camRequest.cameraId = camID;

    var camTexture = cameraModule.requestCamera(camRequest);
    var camTexControl = camTexture.control;

    if (script.screenCropTexture && script.screenCropTexture.control) {
        var cropTexControl = script.screenCropTexture.control;
        cropTexControl.inputTexture = camTexture;
    }

    // Keep the stream alive
    camTexControl.onNewFrame.add(function () {});
});
