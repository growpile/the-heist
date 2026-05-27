function createVfxController(script, getPointer) {
    function setupVfx() {
        var vfxPointer = getPointer("pbVfxComponent");
        if (!vfxPointer) {
            print("Score Component: PB VFX pointer not found. Disable 'Particles On PB' to hide this warning.");
            return;
        }
        var vfxComponent = vfxPointer.getComponent('Component.VFXComponent');
        if (!vfxComponent || !vfxComponent.asset || !vfxComponent.asset.properties) return;
        if(script.customParticleTexture && script.particleTextureType == 1) {
            vfxComponent.asset.properties["mainTex"] = script.customParticleTexture;
        } else {
            vfxComponent.asset.properties["mainTex"] = script.starParticleTexture;
        }
    }

    function playVfx() {
        var vfxPointer = getPointer("pbVfxComponent");
        if (!vfxPointer) return;
        var vfxComponent = vfxPointer.getComponent('Component.VFXComponent');
        if (!vfxComponent || !vfxComponent.asset || !vfxComponent.asset.properties) return;
        var burstDur = script.vfxDuration + getTime();
        vfxComponent.asset.properties["burstDuration"] = burstDur;
    }

    return {
        setupVfx: setupVfx,
        playVfx: playVfx
    };
}

module.exports = createVfxController;
