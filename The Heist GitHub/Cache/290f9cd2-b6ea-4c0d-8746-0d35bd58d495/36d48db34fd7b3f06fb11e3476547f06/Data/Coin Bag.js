// @input Asset.ObjectPrefab coinPrefab
/** @type {ObjectPrefab} */
var coinPrefab = script.coinPrefab;

// @input SceneObject coinsOrigin
/** @type {SceneObject} */
var coinsOrigin = script.coinsOrigin;

script.play3DParticles = function() {
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

        var body = newCoin.getComponent("Physics.BodyComponent");
        if (body) {
            var coinPos = newCoin.getTransform().getWorldPosition();
            var dir = coinPos.sub(originPos);
            if (dir.length === 0) {
                dir = new vec3(1, 0, 0);
            }
            dir = dir.normalize();
            dir.y = global.utils.rngFloat(0, 1, 0);
            dir = dir.normalize();
            var force = dir.uniformScale(global.utils.rngFloat(60, 100, 2));
            print('a')
            body.addForce(new vec3(0, 1500, 0), Physics.ForceMode.VelocityChange);
            script.bodyComponent.addRelativeForce(new vec3(0, 2000, 0),
        }
    }
    print("spawned cohuns")
}
