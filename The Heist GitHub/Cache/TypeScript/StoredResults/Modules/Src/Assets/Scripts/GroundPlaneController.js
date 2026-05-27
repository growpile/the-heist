"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroundPlaneController = void 0;
const MaterialPropertyHelpers_1 = require("./Safe/MaterialPropertyHelpers");
const FAIL_GROUND_DURATION_SEC = 0.25;
/**
 * Ground plane grid material — resolves live material from a scene object at runtime.
 * No inspector inputs; wired via GameFlowController.groundPlane SceneObject.
 */
class GroundPlaneController {
    constructor(groundPlane) {
        this.groundPlane = groundPlane;
    }
    resolveMaterial() {
        if (!this.groundPlane) {
            return null;
        }
        const rmv = this.groundPlane.getComponent("Component.RenderMeshVisual");
        return rmv?.mainMaterial ?? null;
    }
    resetHidden() {
        this.setScalar("opacityMultiplier", 0);
        this.setScalar("size", 0);
        this.setScalar("rotation", 0);
    }
    show() {
        this.resetHidden();
        this.animateScalar("opacityMultiplier", 1, 0.25);
        global.utils.delay(1, () => {
            this.animateScalar("size", 1, 0.25);
        });
    }
    hide() {
        this.animateScalar("opacityMultiplier", 0, 0.25);
        this.animateScalar("size", 0, 0.25);
        this.setScalar("rotation", 0);
    }
    shrinkForFail() {
        const duration = FAIL_GROUND_DURATION_SEC;
        this.animateScalar("size", 0, duration);
        global.utils.delay(duration * 0.5, () => {
            this.animateScalar("opacityMultiplier", 0, duration);
        });
    }
    setScalar(key, value) {
        (0, MaterialPropertyHelpers_1.setMaterialScalar)(this.resolveMaterial(), key, value);
    }
    animateScalar(key, value, duration, callback) {
        (0, MaterialPropertyHelpers_1.animateMaterialScalar)(this.resolveMaterial(), key, value, duration, callback);
    }
}
exports.GroundPlaneController = GroundPlaneController;
//# sourceMappingURL=GroundPlaneController.js.map