// -----JS CODE-----
// @input float duration
// @input Component.VFXComponent vfx
// @input float particleZ
// @input Component.Camera mainCamera

vfxTransform = script.vfx.getSceneObject().getTransform();

script.createEvent("TapEvent").bind(function(eventData){
    
    vfxTransform.setWorldPosition(script.mainCamera.screenSpaceToWorldSpace(eventData.getTapPosition(), script.particleZ));
    
    // EXPLODE VFX
    if (!script.vfx) {
        print("ERROR: Please set the VFX component to the script.");
        return;
    }       
    if (!script.vfx.asset) {
        print("ERROR: Please make sure VFX component contains VFX asset.");
        return;
    }
    var burstDur = script.duration + getTime();
    script.vfx.asset.properties["burstDuration"] = burstDur;
});