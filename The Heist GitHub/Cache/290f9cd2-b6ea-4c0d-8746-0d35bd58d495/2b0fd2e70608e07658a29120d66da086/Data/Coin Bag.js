// @input Asset.ObjectPrefab coinPrefab
/** @type {ObjectPrefab} */
var coinPrefab = script.coinPrefab;

// @input SceneObject coinsOrigin
/** @type {SceneObject} */
var coinsOrigin = script.coinsOrigin;

script.play3DParticles = function(callback) {
    var newMaterial;
    for(var i = 0; i < 8; i++) {
        var newCoin = coinPrefab.instantiate(coinsOrigin);
        if(i == 0) {
            // get first coin material and clone it
            newMaterial = newCoin.getChild(0).getComponent('Component.RenderMeshVisual').mainMaterial.clone();
        }
        newCoin.getChild(0).getComponent('Component.RenderMeshVisual').clearMaterials();
        newCoin.getChild(0).getComponent('Component.RenderMeshVisual').addMaterial(newMaterial);

        var originTransform = coinsOrigin.getTransform();
        var originPos = originTransform.getWorldPosition();
        var spawnOffset = new vec3(
            global.utils.rngFloat(-1, 1, 1),
            0,
            global.utils.rngFloat(-1, 1, 1)
        );
        newCoin.getTransform().setWorldPosition(originPos.add(spawnOffset));

        var randomRot = quat.fromEulerAngles(
            global.utils.rngFloat(0, Math.PI * 2, 3),
            global.utils.rngFloat(0, Math.PI * 2, 3),
            global.utils.rngFloat(0, Math.PI * 2, 3)
        );
        newCoin.getTransform().setWorldRotation(randomRot);
    }
    global.utils.animateMaterialProperty(newMaterial, "mainPass.opacityMultiplier", 0, 0.7, function() {
        print('destroy coins now');
    });
}
