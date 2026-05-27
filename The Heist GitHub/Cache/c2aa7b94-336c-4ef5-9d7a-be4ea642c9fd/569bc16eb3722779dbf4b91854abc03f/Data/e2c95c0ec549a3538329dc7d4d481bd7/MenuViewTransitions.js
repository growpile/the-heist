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
        /** Window shell — full-duration pop so the frame growth reads clearly. */
        this.shellPopInOvershootDurationMs = 100;
        this.shellPopInSettleDurationMs = 100;
        /** Out / generic root phases (unchanged). */
        this.popInOvershootDurationMs = 50;
        this.popInSettleDurationMs = 50;
        /** Child pieces keep full-duration pop so the scale-up stays visible. */
        this.childPopInOvershootDurationMs = 100;
        this.childPopInSettleDurationMs = 100;
        this.elementStaggerMs = 50;
        /** Child elements begin halfway through the root's visible pop. */
        this.childPopInOverlapRootProgress = 0.5;
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
     * View root snaps to full scale (children are parented under it).
     * First pop element = window/shell; remaining elements overlap at childPopInOverlapRootProgress.
     */
    popInRootThenElements(root, elements, onComplete) {
        const children = elements.filter((element) => !!element);
        if (!root) {
            this.popInElements(children, onComplete);
            return;
        }
        root.enabled = true;
        root.getTransform().setLocalScale(this.getRestScale(root));
        if (children.length === 0) {
            onComplete();
            return;
        }
        const { shell, content } = this.splitShellAndContent(children);
        if (!shell) {
            this.popInChildElementsWithBaseDelay(content, 0, onComplete);
            return;
        }
        const shellPopMs = this.shellPopInSettleDurationMs;
        const contentDelayMs = Math.round(shellPopMs * this.childPopInOverlapRootProgress);
        let shellDone = false;
        let contentDone = content.length === 0;
        const tryFinish = () => {
            if (shellDone && contentDone) {
                onComplete();
            }
        };
        // Shell children inherit parent scale — hide them so only the empty frame grows.
        this.prepareElementsForPopIn(content);
        this.setDescendantsEnabled(shell, false);
        shell.enabled = true;
        shell.getTransform().setLocalScale(vec3.zero());
        this.popInElement(shell, shell.getTransform(), this.getRestScale(shell), 0, () => {
            shellDone = true;
            tryFinish();
        }, this.shellPopInOvershootDurationMs, this.shellPopInSettleDurationMs);
        if (content.length === 0) {
            return;
        }
        this.popInChildElementsWithBaseDelay(content, contentDelayMs, () => {
            contentDone = true;
            tryFinish();
        });
    }
    popInElementsWithBaseDelay(elements, baseDelayMs, onComplete) {
        this.popInChildElementsWithBaseDelay(elements, baseDelayMs, onComplete);
    }
    popInChildElementsWithBaseDelay(elements, baseDelayMs, onComplete) {
        this.animateElementsStaggered(elements, (element, transform, restScale, startDelayMs, onElementComplete) => {
            this.popInElement(element, transform, restScale, baseDelayMs + startDelayMs, onElementComplete, this.childPopInOvershootDurationMs, this.childPopInSettleDurationMs);
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
    setDescendantsEnabled(root, enabled) {
        const childCount = root.getChildrenCount();
        for (let i = 0; i < childCount; i++) {
            const child = root.getChild(i);
            if (!child) {
                continue;
            }
            child.enabled = enabled;
            this.setDescendantsEnabled(child, enabled);
        }
    }
    /** First pop target = window/shell; rest overlap halfway through that pop. */
    splitShellAndContent(elements) {
        if (elements.length === 0) {
            return { shell: null, content: [] };
        }
        if (elements.length === 1) {
            return { shell: elements[0], content: [] };
        }
        const shellNamePattern = /background|backdrop|panel|window|frame|plate|shell|cover/i;
        const containerViewPattern = /^(solo|coop)\s*view$/i;
        let shellIndex = 0;
        let bestArea = -1;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (shellNamePattern.test(element.name) &&
                !containerViewPattern.test(element.name.trim())) {
                shellIndex = i;
                break;
            }
            const scale = this.getRestScale(element);
            const area = scale.x * scale.y;
            if (area > bestArea) {
                bestArea = area;
                shellIndex = i;
            }
        }
        const shell = elements[shellIndex];
        const content = elements.filter((_element, index) => index !== shellIndex);
        return { shell, content };
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