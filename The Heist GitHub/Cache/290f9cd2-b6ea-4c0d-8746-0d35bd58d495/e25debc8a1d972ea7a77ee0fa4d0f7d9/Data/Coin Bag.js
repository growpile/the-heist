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
            if (body.setDynamic) {
                body.setDynamic(true);
            } else if (body.setBodyType && typeof Physics !== "undefined" && Physics.BodyComponent && Physics.BodyComponent.BodyType) {
                body.setBodyType(Physics.BodyComponent.BodyType.Dynamic);
            } else if (body.bodyType !== undefined && typeof Physics !== "undefined" && Physics.BodyComponent && Physics.BodyComponent.BodyType) {
                body.bodyType = Physics.BodyComponent.BodyType.Dynamic;
            } else if (body.dynamic !== undefined) {
                body.dynamic = true;
            }
            if (body.sleeping !== undefined) {
                body.sleeping = false;
            } else if (body.wakeUp) {
                body.wakeUp();
            }
            var dir = new vec3(
                global.utils.rngFloat(-1, 1, 2),
                global.utils.rngFloat(0.2, 1, 2),
                global.utils.rngFloat(-1, 1, 2)
            );
            if (dir.length === 0) {
                dir = new vec3(0, 1, 0);
            }
            dir = dir.normalize();
            var velocity = dir.uniformScale(global.utils.rngFloat(600, 1000, 2));
            if (body.setLinearVelocity) {
                body.setLinearVelocity(velocity);
            } else if (body.setVelocity) {
                body.setVelocity(velocity);
            } else if (body.addImpulse) {
                body.addImpulse(velocity);
            } else if (body.applyImpulse) {
                body.applyImpulse(velocity);
            } else if (body.addForce) {
                if (typeof Physics !== "undefined" && Physics.ForceMode && Physics.ForceMode.Impulse) {
                    body.addForce(velocity, Physics.ForceMode.Impulse);
                } else {
                    body.addForce(velocity);
                }
            }
        }
    }
    print("spawned cohuns")
}
