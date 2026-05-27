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
        newCoin.getTransform().setWorldPosition(originPos);

        var randomRot = quat.fromEulerAngles(
            global.utils.rngFloat(0, Math.PI * 2, 3),
            global.utils.rngFloat(0, Math.PI * 2, 3),
            global.utils.rngFloat(0, Math.PI * 2, 3)
        );
        newCoin.getTransform().setWorldRotation(randomRot);

        var body = newCoin.getComponent("Physics.BodyComponent");
        if (!body) {
            body = newCoin.getComponent("Physics.DynamicBodyComponent");
        }
        if (body) {
            var dir = new vec3(
                global.utils.rngFloat(-1, 1, 2),
                global.utils.rngFloat(0.2, 1, 2),
                global.utils.rngFloat(-1, 1, 2)
            );
            if (dir.length === 0) {
                dir = new vec3(0, 1, 0);
            }
            dir = dir.normalize();
            var force = dir.uniformScale(global.utils.rngFloat(200, 400, 2));
            if (body.addImpulse) {
                body.addImpulse(force);
            } else if (body.applyImpulse) {
                body.applyImpulse(force);
            } else if (body.addForce) {
                if (typeof Physics !== "undefined" && Physics.ForceMode && Physics.ForceMode.Impulse) {
                    body.addForce(force, Physics.ForceMode.Impulse);
                } else {
                    body.addForce(force);
                }
            } else if (body.setLinearVelocity) {
                body.setLinearVelocity(force);
            } else if (body.setVelocity) {
                body.setVelocity(force);
            }
        }
    }
    print("spawned cohuns")
}
