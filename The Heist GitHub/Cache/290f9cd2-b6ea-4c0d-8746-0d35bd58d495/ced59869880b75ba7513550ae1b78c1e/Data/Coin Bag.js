// @input Asset.ObjectPrefab coinPrefab
/** @type {ObjectPrefab} */
var coinPrefab = script.coinPrefab;

// @input SceneObject coinsOrigin
/** @type {SceneObject} */
var coinsOrigin = script.coinsOrigin;

script.play3DParticles = function() {
    for(var i = 0; i < 8; i++) {
        var newCoin = coinPrefab.instantiate(coinsOrigin);
    }
    print("spawned cohuns")
}