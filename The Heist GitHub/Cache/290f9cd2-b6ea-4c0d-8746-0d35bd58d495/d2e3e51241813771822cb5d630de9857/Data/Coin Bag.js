// @input Asset.ObjectPrefab coinPrefab
/** @type {ObjectPrefab} */
var coinPrefab = script.coinPrefab;

// @input SceneObject coinsOrigin
/** @type {SceneObject} */
var coinsOrigin = script.coinsOrigin;

script.play3DParticles = function() {
    for(var i = 0; i < 8; i++) {
        var newCoin = coinPrefab.instantiate(global.scene.getRootObject(0));
        newCoin.getTransform().setWorldScale(new vec3(4,4,4));
        // newCoin.getTransform().setWorldScale(new vec3(4,4,4));
    }
    print("spawned cohuns")
}