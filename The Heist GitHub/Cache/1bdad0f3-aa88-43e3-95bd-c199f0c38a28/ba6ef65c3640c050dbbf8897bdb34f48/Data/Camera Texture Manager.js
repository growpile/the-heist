let cameraModule = require('LensStudio:CameraModule');
let cameraRequest;
let cameraTexture;
let cameraTextureProvider;
var latestFrame = null;
// @input Component.Image cameraTextureDisplayImage
var cameraTextureDisplayImage = script.cameraTextureDisplayImage;

function printEncodedString(result) {
    print("Encoded texture: " + result)
    //decode the string back and display
    decode(result).then(displayTexture).catch(printError)
}

function printError(error) {
    print("Error: " + error)

}

function displayTexture(texture) {
    print("Texture: " + texture)
    if (script.outputImage) {
        script.outputImage.mainMaterial.mainPass.baseTex = texture
    }
}

function encode(texture) {
    return new Promise(function (resolve, reject) {
        Base64.encodeTextureAsync(texture, resolve, reject, CompressionQuality.LowQuality, EncodingType.Png)
        print("encoded!");
    })
}

function decode(encodedString) {
    return new Promise(function (resolve, reject) {
        Base64.decodeTextureAsync(encodedString, resolve, reject)
    })
}

encode(script.texture).then(printEncodedString).catch(printError);

script.createEvent('OnStartEvent').bind(() => {
  cameraRequest = CameraModule.createCameraRequest();
  cameraRequest.cameraId = CameraModule.CameraId.Default_Color;

  cameraTexture = cameraModule.requestCamera(cameraRequest);
  cameraTextureProvider = cameraTexture.control;

  cameraTextureProvider.onNewFrame.add((cameraFrame) => {
      latestFrame = cameraTexture;
  });
});

global.decodeReturnTexture = function(imgString) {
    return decode(imgString);
}

global.takeSnapEncode = async function() {
    if(latestFrame == null) return;
    var data = await encode(latestFrame);
    return data;
}

script.createEvent("LateUpdateEvent").bind(function() {
    if(cameraTextureDisplayImage) cameraTextureDisplayImage.mainPass.baseTex = latestFrame;
})