"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuViewTransitions = void 0;
const LSTween_1 = require("LSTween.lspkg/LSTween");
const Easing_1 = require("LSTween.lspkg/TweenJS/Easing");
/** Staggered pop animations matching MainMenuTabination. */
class MenuViewTransitions {
    constructor() {
        this.popOutBumpScale = 1;
        this.popInOvershootScale = 0;
        this.popOutBumpDurationMs = 100;
        this.popOutShrinkDurationMs = 100;
        this.popInOvershootDurationMs = 100;
        this.popInSettleDurationMs = 100;
        this.elementStaggerMs = 100;
        /** View roots (Main Menu shell, tips window root, etc.) pop in faster. */
        this.rootPopInSpeedMultiplier = 1.5;
        /** Child elements begin when the root's visible scale pop is this far along (0–1). */
        this.childPopInOverlapRootProgress = 0.35;
        this.restScales = new Map();
        this.activeTweens = [];
    }
    cacheRestScales(elements) {
        for (const element of elements) {
            if (!element || this.restScales.has(element)) {
                continue;
            }
            this.restScales.set(element, element.getTransform().getLocalScale());
        }
    }
    stopAll() {
        for (const tween of this.activeTweens) {
            tween?.stop?.();
        }
        this.activeTweens = [];
    }
    popOutElements(elements, onComplete) {
        this.animateElementsStaggered(elements, (element, transform, restScale, startDelayMs, onElementComplete) => {
            this.popOutElement(element, transform, restScale, startDelayMs, onElementComplete);
        }, onComplete);
    }
    popInElements(elements, onComplete) {
        this.popInElementsWithBaseDelay(elements, 0, onComplete);
    }
    /**
     * Pops the view root faster, then overlaps child elements at childPopInOverlapRootProgress.
     */
    popInRootThenElements(root, elements, onComplete) {
        const children = elements.filter((element) => !!element);
        if (!root) {
            this.popInElements(children, onComplete);
            return;
        }
        const rootOvershootMs = this.popInOvershootDurationMs / this.rootPopInSpeedMultiplier;
        const rootSettleMs = this.popInSettleDurationMs / this.rootPopInSpeedMultiplier;
        const rootHasVisibleOvershoot = this.popInOvershootScale > 0.01;
        const rootVisiblePopMs = rootHasVisibleOvershoot ? rootOvershootMs + rootSettleMs : rootSettleMs;
        const childBaseDelayMs = Math.round(rootVisiblePopMs * this.childPopInOverlapRootProgress);
        let rootDone = false;
        let childrenDone = children.length === 0;
        const tryFinish = () => {
            if (rootDone && childrenDone) {
                onComplete();
            }
        };
        root.enabled = true;
        this.popInElement(root, root.getTransform(), this.getRestScale(root), 0, () => {
            rootDone = true;
            tryFinish();
        }, rootOvershootMs, rootSettleMs);
        if (children.length === 0) {
            return;
        }
        this.popInElementsWithBaseDelay(children, childBaseDelayMs, () => {
            childrenDone = true;
            tryFinish();
        });
    }
    popInElementsWithBaseDelay(elements, baseDelayMs, onComplete) {
        this.animateElementsStaggered(elements, (element, transform, restScale, startDelayMs, onElementComplete) => {
            this.popInElement(element, transform, restScale, baseDelayMs + startDelayMs, onElementComplete);
        }, onComplete);
    }
    setElementsHidden(elements) {
        for (const element of elements) {
            if (!element) {
                continue;
            }
            element.enabled = false;
            element.getTransform().setLocalScale(vec3.zero());
        }
    }
    prepareElementsForPopIn(elements) {
        for (const element of elements) {
            if (!element) {
                continue;
            }
            element.enabled = true;
            element.getTransform().setLocalScale(vec3.zero());
        }
    }
    getRestScale(element) {
        return this.restScales.get(element) ?? vec3.one();
    }
    animateElementsStaggered(elements, step, onComplete) {
        const validElements = elements.filter((element) => !!element);
        if (validElements.length === 0) {
            onComplete();
            return;
        }
        let remaining = validElements.length;
        const onElementComplete = () => {
            remaining--;
            if (remaining <= 0) {
                onComplete();
            }
        };
        for (let i = 0; i < validElements.length; i++) {
            const element = validElements[i];
            const startDelayMs = i * this.elementStaggerMs;
            step(element, element.getTransform(), this.getRestScale(element), startDelayMs, onElementComplete);
        }
    }
    popOutElement(element, transform, restScale, startDelayMs, onComplete) {
        const currentScale = transform.getLocalScale();
        const bumpScale = restScale.uniformScale(this.popOutBumpScale);
        const bumpTween = LSTween_1.LSTween.scaleFromToLocal(transform, currentScale, bumpScale, this.popOutBumpDurationMs).easing(Easing_1.default.Cubic.Out);
        const shrinkTween = LSTween_1.LSTween.scaleFromToLocal(transform, bumpScale, vec3.zero(), this.popOutShrinkDurationMs)
            .easing(Easing_1.default.Cubic.In)
            .onComplete(() => {
            element.enabled = false;
            onComplete();
        });
        if (startDelayMs > 0) {
            bumpTween.delay(startDelayMs);
        }
        bumpTween.chain(shrinkTween);
        this.trackTween(bumpTween);
        this.trackTween(shrinkTween);
        bumpTween.start();
    }
    popInElement(element, transform, restScale, startDelayMs, onComplete, overshootDurationMs, settleDurationMs) {
        element.enabled = true;
        transform.setLocalScale(vec3.zero());
        const overshootMs = overshootDurationMs ?? this.popInOvershootDurationMs;
        const settleMs = settleDurationMs ?? this.popInSettleDurationMs;
        const overshootScale = restScale.uniformScale(this.popInOvershootScale);
        const skipOvershoot = overshootScale.length < 0.01;
        const settleTween = LSTween_1.LSTween.scaleFromToLocal(transform, skipOvershoot ? vec3.zero() : overshootScale, restScale, settleMs)
            .easing(skipOvershoot ? Easing_1.default.Back.Out : Easing_1.default.Cubic.Out)
            .onComplete(() => {
            onComplete();
        });
        if (skipOvershoot) {
            if (startDelayMs > 0) {
                settleTween.delay(startDelayMs);
            }
            this.trackTween(settleTween);
            settleTween.start();
            return;
        }
        const overshootTween = LSTween_1.LSTween.scaleFromToLocal(transform, vec3.zero(), overshootScale, overshootMs).easing(Easing_1.default.Back.Out);
        if (startDelayMs > 0) {
            overshootTween.delay(startDelayMs);
        }
        overshootTween.chain(settleTween);
        this.trackTween(overshootTween);
        this.trackTween(settleTween);
        overshootTween.start();
    }
    trackTween(tween) {
        this.activeTweens.push(tween);
    }
}
exports.MenuViewTransitions = MenuViewTransitions;
//# sourceMappingURL=MenuViewTransitions.js.map