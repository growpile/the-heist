function createViewController(script, objHelpers) {
    var textComponents = [];
    var backplates = [];

    // animation state
    var animDuration = 0.2;
    var animEvent = null;
    var animTime = 0;
    var animType = "bump";
    var originalSizes = [];
    var endViewAnimating = false;
    var endViewQueue = [];

    function toArray(maybeArray) {
        if (!maybeArray) return [];
        return maybeArray instanceof Array ? maybeArray : [maybeArray];
    }
    function getPointer(name) {
        if (!global.hierarchyPointers) return null;
        return global.hierarchyPointers[name] || null;
    }
    function anchorsToVec4(screenTransform) {
        return new vec4(screenTransform.anchors.left, screenTransform.anchors.right, screenTransform.anchors.bottom, screenTransform.anchors.top);
    }
    function setVec4Anchors(screenTransform, anchorVec4) {
        screenTransform.anchors.left = anchorVec4.x;
        screenTransform.anchors.right = anchorVec4.y;
        screenTransform.anchors.bottom = anchorVec4.z;
        screenTransform.anchors.top = anchorVec4.w;
    }
    function lerp(a, b, t) {
        return a + (b - a) * Math.min(Math.max(t, 0), 1);
    }

    function findScoreTextComponents() {
        textComponents = [];
        var scoreEntry = getPointer("score");
        if (!scoreEntry) {
            print("Score Component: No score pointer found. Please flag your score text object as 'score'.");
            return;
        }
        var scoreObjects = toArray(scoreEntry);
        for (var i = 0; i < scoreObjects.length; i++) {
            var textComp = scoreObjects[i].getComponent("Component.Text");
            if (textComp) {
                customizeScoreTextComponent(textComp);
                textComponents.push(textComp);
            }
        }
    }

    function customizeScoreTextComponent(textComponent) {
        if(script.scoreFontType == 0) {
            if(script.scoreFontPreset != 0) {
                textComponent.font = script.fontPresetFontFiles[script.scoreFontPreset - 1];
            }
        } else {
            if(!script.scoreCustomFont) {
                print("Please add the custom font file to the Score Component inspector panel.");
                return;
            }
            textComponent.font = script.scoreCustomFont;
        }

        textComponent.textFill.color = script.scoreColor;
        textComponent.letterSpacing = script.letterSpacing;
        textComponent.outlineSettings.enabled = script.scoreOutline;
        textComponent.outlineSettings.size = script.outlineSize;
        textComponent.outlineSettings.fill.color = script.outlineColor;

        if(script.scoreSize == 1) {
            if(textComponent.getSceneObject().getParent().getComponent("Component.Head")) {
                textComponent.size = script.customScoreSize3d;
            } else {
                textComponent.size = script.customScoreSize;
            }
        }
    }

    function findScoreBackplates() {
        backplates = [];
        var backplateEntry = getPointer("scoreBackplate");
        if (!backplateEntry) {
            return;
        }
        var backplateObjects = toArray(backplateEntry);
        for (var i = 0; i < backplateObjects.length; i++) {
            var backplateObj = backplateObjects[i];
            var imageComp = objHelpers.getComponentRecursive(backplateObj, "Component.Image");
            if (!imageComp) {
                imageComp = objHelpers.getComponentRecursive(backplateObj, "Component.SpriteVisual");
            }
            if (imageComp) {
                backplates.push(imageComp);
            }
        }
        if (backplateObjects.length > 0 && backplates.length === 0) {
            print("Score Component: scoreBackplate flagged object found but no image/sprite component detected.");
        }
        applyBackplateTexture();
    }

    function setBackplatesEnabled(enabled) {
        var allow = enabled && script.scoreBackplate && !!script.customScoreBackplate;
        for (var i = 0; i < backplates.length; i++) {
            var comp = backplates[i];
            if (comp && comp.getSceneObject()) {
                comp.getSceneObject().enabled = allow;
            }
        }
    }

    function applyBackplateTexture() {
        if (!script.scoreBackplate || !script.customScoreBackplate) {
            setBackplatesEnabled(false);
            return;
        }
        for (var i = 0; i < backplates.length; i++) {
            var comp = backplates[i];
            if (comp && comp.mainMaterial && comp.mainMaterial.mainPass) {
                comp.mainMaterial.mainPass.baseTex = script.customScoreBackplate;
            }
        }
        setBackplatesEnabled(true);
    }

    function refreshUI(state) {
        if (textComponents.length === 0) {
            findScoreTextComponents();
        }
        for (var i = 0; i < textComponents.length; i++) {
            var textComp = textComponents[i];
            if (textComp) {
                if (script.scoreType == 1) {
                    textComp.text = state.score.toFixed(script.decimals).toString();
                } else {
                    textComp.text = state.score.toString();
                }
            }
        }
    }

    function animateScore(type) {
        animType = type;

        if (animEvent) {
            script.removeEvent(animEvent);
            resetSizes();
        }

        animTime = 0;
        originalSizes = [];

        if (textComponents.length === 0) {
            findScoreTextComponents();
        }
        for (var i = 0; i < textComponents.length; i++) {
            var textComp = textComponents[i];
            if (textComp) {
                originalSizes.push({
                    comp: textComp,
                    size: textComp.size
                });
            }
        }

        animEvent = script.createEvent("UpdateEvent");
        animEvent.bind(onScoreSizeAnimate);
    }

    function onScoreSizeAnimate() {
        if (originalSizes.length === 0) return;

        var dt = getDeltaTime();
        animTime += dt;

        var halfDuration = animDuration / 2;
        var progress = animTime / animDuration;

        var multiplier = 1.0;
        if (animType === "bump") {
            if (animTime < halfDuration) {
                multiplier = lerp(1.0, 1.3, animTime / halfDuration);
            } else {
                multiplier = lerp(1.1, 1.0, (animTime - halfDuration) / halfDuration);
            }
        } else if (animType === "shrink") {
            if (animTime < halfDuration) {
                multiplier = lerp(1.0, 0.7, animTime / halfDuration);
            } else {
                multiplier = lerp(0.9, 1.0, (animTime - halfDuration) / halfDuration);
            }
        }

        for (var i = 0; i < originalSizes.length; i++) {
            var data = originalSizes[i];
            if (data && data.comp) {
                data.comp.size = data.size * multiplier;
            }
        }

        if (progress >= 1.0) {
            resetSizes();
            script.removeEvent(animEvent);
            animEvent = null;
        }
    }

    function resetSizes() {
        for (var i = 0; i < originalSizes.length; i++) {
            var data = originalSizes[i];
            if (data && data.comp) {
                data.comp.size = data.size;
            }
        }
        originalSizes = [];
    }

    function animateView(slideType, showView, onComplete) {
        if (!script.gameEndView) {
            if (onComplete) { onComplete(); }
            return;
        }
        if (endViewAnimating) {
            endViewQueue.push({ slideType: slideType, showView: showView, onComplete: onComplete });
            return;
        }
        endViewAnimating = true;

        var screenTransform = script.gameEndView.getComponent('Component.ScreenTransform');
        var targetVec4 = new vec4(-1, 1, -1, 1);
        var typeVec4;

        if (slideType == 2) {
            typeVec4 = new vec4(-1, 1, 3, 1);
        } else if (slideType == 1) {
            typeVec4 = new vec4(-1, 1, -1, -3);
        } else {
            typeVec4 = targetVec4;
        }

        var initialVec4 = showView ? typeVec4 : targetVec4;
        var finalVec4   = showView ? targetVec4 : typeVec4;

        setVec4Anchors(screenTransform, initialVec4);

        var animViewEvent = script.createEvent("UpdateEvent");
        var lerpFactor = 0.2;
        var epsilon = 0.01;

        animViewEvent.bind(function onAnimateScreenTransform() {
            var currentVec4Anchors = anchorsToVec4(screenTransform);
            var newVec4Anchors = vec4.lerp(currentVec4Anchors, finalVec4, lerpFactor);
            setVec4Anchors(screenTransform, newVec4Anchors);

            if (newVec4Anchors.distance(finalVec4) < epsilon) {
                setVec4Anchors(screenTransform, finalVec4);
                animViewEvent.enabled = false;
                endViewAnimating = false;
                if (onComplete) { onComplete(); }
                if (endViewQueue.length > 0) {
                    var next = endViewQueue.shift();
                    animateView(next.slideType, next.showView, next.onComplete);
                }
            }
        });
    }

    return {
        toArray: toArray,
        getPointer: getPointer,
        findScoreTextComponents: findScoreTextComponents,
        findScoreBackplates: findScoreBackplates,
        applyBackplateTexture: applyBackplateTexture,
        setBackplatesEnabled: setBackplatesEnabled,
        refreshUI: refreshUI,
        animateScore: animateScore,
        animateView: animateView
    };
}

module.exports = createViewController;
