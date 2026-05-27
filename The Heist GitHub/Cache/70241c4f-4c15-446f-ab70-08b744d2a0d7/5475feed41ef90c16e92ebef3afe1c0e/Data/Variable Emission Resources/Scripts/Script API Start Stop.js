//@input Component.VFXComponent vfxComp

script.createEvent("TapEvent").bind(function(){
    script.vfxComp.emitting = !script.vfxComp.emitting;
})

