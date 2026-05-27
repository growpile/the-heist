// @input Asset.ObjectPrefab coinPrefab
/** @type {ObjectPrefab} */
var coinPrefab = script.coinPrefab;

// @input SceneObject coinsOrigin
/** @type {SceneObject} */
var coinsOrigin = script.coinsOrigin;

script.play3DParticles = function(callback) {
    for(var i = 0; i < 8; i++) {
        var newCoin = coinPrefab.instantiate(coinsOrigin);
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

    global.utils.delay(1, function() {

    });
}
