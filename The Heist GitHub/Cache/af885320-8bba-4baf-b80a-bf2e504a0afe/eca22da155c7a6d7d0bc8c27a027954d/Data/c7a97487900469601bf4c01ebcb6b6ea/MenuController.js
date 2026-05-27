"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuController = void 0;
var __selfType = requireType("./MenuController");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
const CapsuleButton_1 = require("SpectaclesUIKit.lspkg/Scripts/Components/Button/CapsuleButton");
const MenuViewTransitions_1 = require("./MenuViewTransitions");
const LSTween_1 = require("LSTween.lspkg/LSTween");
const Easing_1 = require("LSTween.lspkg/TweenJS/Easing");
const WorldCameraFinderProvider = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider")
    .default ?? require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
const MENU_SHOW_MS = 400;
const MENU_HIDE_MS = 250;
const MENU_BACKGROUND_LERP_SEC = 0.3;
const LOGO_SCALE_PEAK = 1.1;
const LOGO_SCALE_DURATION_MS = 500;
const LOGO_ROTATE_Z_DEG = 3;
const LOGO_ROTATE_DURATION_MS = 1000;
const RAD_TO_DEG = 180 / Math.PI;
/** Main-menu tab index for Settings (third tab). */
const SETTINGS_TAB_INDEX = 2;
const DEFAULT_TAB_INDEX = 0;
const TAB_SWITCH_COOLDOWN_SEC = 0.5;
const POSTGAME_ROOT_SCALE_SEC = 0.35;
const POSTGAME_OUTLINE_STAGGER_SEC = 0.08;
const POSTGAME_OUTLINE_SCALE_SEC = 0.2;
const POSTGAME_TIME_ANIM_SEC = 1.5;
const POSTGAME_STARS_DELAY_SEC = 0.5;
const POSTGAME_STAR_STAGGER_SEC = 0.1;
const POSTGAME_STAR_POP_SEC = 0.28;
const POSTGAME_STAR_SETTLE_SEC = 0.16;
const POSTGAME_STAR_ROTATE_POP_SEC = 0.45;
const POSTGAME_STAR_ROTATE_SETTLE_SEC = 0.24;
const POSTGAME_STAR_IMAGE_FADE_SEC = 0.22;
const POSTGAME_STAR_IMAGE_TARGET_ALPHA = 0.5;
const POSTGAME_STAR_OVERSHOOT_SCALE = 1.12;
const POSTGAME_STAR_Z_POP = 1;
const POSTGAME_STAR_FLIP_Y_DEG = 180;
const POSTGAME_STAR_WIGGLE_Y_DEG = 7;
const POSTGAME_STAR_WIGGLE_MS = 700;
const SCREEN_CHANGE_LOCK_TIMEOUT_SEC = 3;
const MENU_DEBUG_LOGS = true;
/**
 * Central menu controller: root scale, stepped screens (main → tips → room),
 * main-menu tab switching, and post-game session panel.
 */
let MenuController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var MenuController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.menuRoot = this.menuRoot;
            this.menuYOffsetFromCameraCm = this.menuYOffsetFromCameraCm;
            this.menuBackground = this.menuBackground;
            this.logo = this.logo;
            this.tabs = this.tabs;
            this.mainMenuView = this.mainMenuView;
            this.soloTipsView = this.soloTipsView;
            this.tutorialTipsView = this.tutorialTipsView;
            this.onlineRoomView = this.onlineRoomView;
            this.settingsView = this.settingsView;
            this.postGameRoot = this.postGameRoot;
            this.bronzeMaterial = this.bronzeMaterial;
            this.silverMaterial = this.silverMaterial;
            this.goldMaterial = this.goldMaterial;
            this.timeElapsedText = this.timeElapsedText;
            this.solvedCopy = this.solvedCopy;
            this.failedCopy = this.failedCopy;
            this.menuButton = this.menuButton;
            this.starOutlinesParent = this.starOutlinesParent;
            this.starsParent = this.starsParent;
            this.transitions = new MenuViewTransitions_1.MenuViewTransitions();
            this.activeTween = null;
            this.logoScaleTween = null;
            this.logoRotateTween = null;
            /** Invalidates stale hide/show scale callbacks when returning from gameplay. */
            this.menuScaleGeneration = 0;
            this.isMenuVisible = false;
            this.currentScreen = "main";
            this.pendingSafeType = null;
            this.isTransitioning = false;
            /** Non-tab screen/nav transitions are single-flight (play/outbound/buttons). */
            this.isScreenChangeLocked = false;
            this.screenChangeLockDelayId = null;
            this.transitionToken = 0;
            this.returnInProgress = false;
            this.menuRevealInProgress = false;
            /** True after hideForGameplay until returnFromGameplay finishes. */
            this.hiddenForGameplay = false;
            /** Invalidates stale gameplay-return scale/pop chains (not tab transitionToken). */
            this.gameplayRestoreId = 0;
            this.postGameSessionId = 0;
            this.postGameActive = false;
            this.postGameMenuHandler = null;
            this.postGameTimeAnimEvent = null;
            this.postGameStarTweens = [];
            this.postGameImageFadeEvents = [];
            this.settingsTabSelectedHandler = null;
            this.selectedTabIndex = -1;
            this.isTabTransitioning = false;
            this.tabSwitchLocked = false;
            this.tabTransitionToken = 0;
        }
        __initialize() {
            super.__initialize();
            this.menuRoot = this.menuRoot;
            this.menuYOffsetFromCameraCm = this.menuYOffsetFromCameraCm;
            this.menuBackground = this.menuBackground;
            this.logo = this.logo;
            this.tabs = this.tabs;
            this.mainMenuView = this.mainMenuView;
            this.soloTipsView = this.soloTipsView;
            this.tutorialTipsView = this.tutorialTipsView;
            this.onlineRoomView = this.onlineRoomView;
            this.settingsView = this.settingsView;
            this.postGameRoot = this.postGameRoot;
            this.bronzeMaterial = this.bronzeMaterial;
            this.silverMaterial = this.silverMaterial;
            this.goldMaterial = this.goldMaterial;
            this.timeElapsedText = this.timeElapsedText;
            this.solvedCopy = this.solvedCopy;
            this.failedCopy = this.failedCopy;
            this.menuButton = this.menuButton;
            this.starOutlinesParent = this.starOutlinesParent;
            this.starsParent = this.starsParent;
            this.transitions = new MenuViewTransitions_1.MenuViewTransitions();
            this.activeTween = null;
            this.logoScaleTween = null;
            this.logoRotateTween = null;
            /** Invalidates stale hide/show scale callbacks when returning from gameplay. */
            this.menuScaleGeneration = 0;
            this.isMenuVisible = false;
            this.currentScreen = "main";
            this.pendingSafeType = null;
            this.isTransitioning = false;
            /** Non-tab screen/nav transitions are single-flight (play/outbound/buttons). */
            this.isScreenChangeLocked = false;
            this.screenChangeLockDelayId = null;
            this.transitionToken = 0;
            this.returnInProgress = false;
            this.menuRevealInProgress = false;
            /** True after hideForGameplay until returnFromGameplay finishes. */
            this.hiddenForGameplay = false;
            /** Invalidates stale gameplay-return scale/pop chains (not tab transitionToken). */
            this.gameplayRestoreId = 0;
            this.postGameSessionId = 0;
            this.postGameActive = false;
            this.postGameMenuHandler = null;
            this.postGameTimeAnimEvent = null;
            this.postGameStarTweens = [];
            this.postGameImageFadeEvents = [];
            this.settingsTabSelectedHandler = null;
            this.selectedTabIndex = -1;
            this.isTabTransitioning = false;
            this.tabSwitchLocked = false;
            this.tabTransitionToken = 0;
        }
        /** Called when the user selects the settings tab (not the legacy openSettings overlay). */
        setSettingsTabSelectedHandler(handler) {
            this.settingsTabSelectedHandler = handler;
        }
        onAwake() {
            this.unlockTabSwitchEvent = this.createEvent("DelayedCallbackEvent");
            this.unlockTabSwitchEvent.bind(() => {
                this.tabSwitchLocked = false;
                this.setTabButtonsInteractable(true);
            });
            this.cacheAllViewElements();
            this.hideAllScreensImmediate();
            this.prepareMenuHidden();
            this.preparePostGameHidden();
            this.createEvent("LateUpdateEvent").bind(() => this.maintainMenuHeightRelativeToCamera());
            this.createEvent("OnStartEvent").bind(() => {
                this.initializeMainMenuTabs();
                this.startLogoIdleAnimation();
                this.bindPostGameMenuButton();
            });
        }
        /** After gameplay — scale menu root up and pop tab content back in. */
        returnFromGameplay(callback) {
            if (this.returnInProgress) {
                this.logMenu("returnFromGameplay skipped — already in progress");
                callback?.();
                return;
            }
            this.returnInProgress = true;
            this.logMenuState("returnFromGameplay start");
            if (!this.tryBeginScreenChange()) {
                this.logMenu("returnFromGameplay lock busy — forcing snap recovery");
                this.snapMenuVisibleAfterGameplay();
                this.endScreenChange();
                this.returnInProgress = false;
                callback?.();
                return;
            }
            this.pendingSafeType = null;
            this.transitions.stopAll();
            this.cancelActiveTween();
            const restoreId = ++this.gameplayRestoreId;
            this.logMenu("returnFromGameplay animated restore id=" + restoreId);
            this.prepareMenuForGameplayReturn();
            this.runGameplayMenuReveal(restoreId, () => {
                this.endScreenChange();
                this.returnInProgress = false;
                this.logMenuState("returnFromGameplay complete");
                callback?.();
            });
        }
        logMenu(message) {
            if (!MENU_DEBUG_LOGS) {
                return;
            }
            print("[MenuController] " + message);
        }
        /** Snapshot of menu restore state — grep `[MenuState]` on device logs. */
        logMenuState(context) {
            if (!MENU_DEBUG_LOGS) {
                return;
            }
            const root = this.menuRoot;
            const rootScale = root ? root.getTransform().getLocalScale() : null;
            const host = this.getSceneObject();
            print("[MenuState] " +
                context +
                " hiddenForGameplay=" +
                this.hiddenForGameplay +
                " isMenuVisible=" +
                this.isMenuVisible +
                " menuRevealInProgress=" +
                this.menuRevealInProgress +
                " returnInProgress=" +
                this.returnInProgress +
                " postGameActive=" +
                this.postGameActive +
                " screen=" +
                this.currentScreen +
                " lock=" +
                this.isScreenChangeLocked +
                " scaleGen=" +
                this.menuScaleGeneration +
                " restoreId=" +
                this.gameplayRestoreId +
                " needsRestore=" +
                this.needsFullMenuRestore() +
                " hostEnabled=" +
                (host ? host.enabled : "n/a") +
                " menuRoot=" +
                (root
                    ? "enabled=" +
                        root.enabled +
                        " scale=" +
                        rootScale.x.toFixed(3) +
                        "," +
                        rootScale.y.toFixed(3) +
                        "," +
                        rootScale.z.toFixed(3)
                    : "null"));
        }
        /** Lens open or return to main: pop transition; scale menuRoot only when it was hidden. */
        showMainMenu(callback) {
            this.pendingSafeType = null;
            if (this.hiddenForGameplay) {
                this.returnFromGameplay(callback);
                return;
            }
            if (!this.tryBeginScreenChange()) {
                return;
            }
            const menuHiddenByScale = !!this.menuRoot && this.menuRoot.getTransform().getLocalScale().x < 0.01;
            const needsRestore = !this.isMenuVisible ||
                menuHiddenByScale ||
                this.menuRevealInProgress ||
                this.needsFullMenuRestore();
            if (needsRestore) {
                this.menuRevealInProgress = false;
                this.isTransitioning = false;
                this.transitions.stopAll();
                this.cancelActiveTween();
                print("[MenuController] showMainMenu — restore (visible=" + this.isMenuVisible + ")");
                this.restoreMainMenuFromHidden(() => {
                    this.endScreenChange();
                    callback?.();
                });
                return;
            }
            if (this.currentScreen === "main" && !this.isTransitioning) {
                this.ensureMenuRootShown();
                this.restoreMainMenuShell();
                this.endScreenChange();
                callback?.();
                return;
            }
            this.transitionToScreen("main", () => {
                this.ensureMenuRootShown();
                this.restoreMainMenuShell();
                this.endScreenChange();
                callback?.();
            });
        }
        /** Main menu → Solo or Tutorial tips (first run uses tutorial). */
        requestSoloTips(callback) {
            if (!this.tryBeginScreenChange()) {
                return;
            }
            const hasPlayed = global.appState?.checkStorage("tutorialPlayed") ?? false;
            this.pendingSafeType = hasPlayed ? "solo" : "tutorial";
            const target = hasPlayed ? "soloTips" : "tutorialTips";
            this.transitionToScreen(target, () => {
                this.endScreenChange();
                callback?.();
            });
        }
        /** Settings → Replay Tutorial: always open tutorial tips (Start runs tutorial safe). */
        requestTutorialTips(callback) {
            if (!this.tryBeginScreenChange()) {
                return;
            }
            this.pendingSafeType = "tutorial";
            this.logMenu("requestTutorialTips → tutorialTips");
            this.transitionToScreen("tutorialTips", () => {
                this.logMenuState("requestTutorialTips done");
                this.endScreenChange();
                callback?.();
            });
        }
        /** Main menu → online room step, then run networking in the callback. */
        requestOnlineRoom(callback) {
            if (!this.tryBeginScreenChange()) {
                return;
            }
            this.pendingSafeType = "coop";
            this.transitionToScreen("onlineRoom", () => {
                this.endScreenChange();
                callback?.();
            });
        }
        /** Tips / room Start button: returns safe type chosen when entering tips. */
        consumePendingSafeType() {
            const type = this.pendingSafeType;
            this.pendingSafeType = null;
            return type;
        }
        hasPendingSafeType() {
            return this.pendingSafeType !== null;
        }
        tryBeginScreenChange() {
            if (this.isScreenChangeLocked) {
                return false;
            }
            this.isScreenChangeLocked = true;
            if (this.screenChangeLockDelayId && global.utils?.invalidateDelay) {
                global.utils.invalidateDelay(this.screenChangeLockDelayId);
            }
            this.screenChangeLockDelayId = "menu_screen_change_lock_" + getTime().toString();
            if (global.utils?.delay) {
                const lockId = this.screenChangeLockDelayId;
                global.utils.delay(lockId, SCREEN_CHANGE_LOCK_TIMEOUT_SEC, () => {
                    if (!this.isScreenChangeLocked || this.screenChangeLockDelayId !== lockId) {
                        return;
                    }
                    print("[MenuController] screen-change lock watchdog released stale lock");
                    if (this.hiddenForGameplay || this.menuRevealInProgress) {
                        this.snapMenuVisibleAfterGameplay();
                    }
                    this.endScreenChange();
                });
            }
            this.setTabButtonsInteractable(false);
            this.setCapsuleButtonPressable(this.menuButton, false);
            return true;
        }
        endScreenChange() {
            this.isScreenChangeLocked = false;
            if (this.screenChangeLockDelayId && global.utils?.invalidateDelay) {
                global.utils.invalidateDelay(this.screenChangeLockDelayId);
                this.screenChangeLockDelayId = null;
            }
            this.setTabButtonsInteractable(true);
            if (this.postGameActive) {
                // Keep disabled until post-game sequence explicitly enables it.
                return;
            }
            this.setCapsuleButtonPressable(this.menuButton, false);
        }
        getCurrentScreen() {
            return this.currentScreen;
        }
        /** Unified external UI route API for non-tab screen changes. */
        showUI(route, callback) {
            switch (route) {
                case "main":
                    this.showMainMenu(callback);
                    return;
                case "soloTips":
                    this.requestSoloTips(callback);
                    return;
                case "tutorialTips":
                    this.requestTutorialTips(callback);
                    return;
                case "teamTips":
                    this.requestOnlineRoom(callback);
                    return;
                case "postGame":
                    // Post-game view is driven by outcome payload; no-op route helper.
                    callback?.();
                    return;
            }
        }
        /** Hide menu UI for gameplay (scale + step views only; no transform position changes). */
        hideForGameplay(callback) {
            if (!this.tryBeginScreenChange()) {
                this.logMenu("hideForGameplay blocked — screen change locked");
                return;
            }
            this.logMenuState("hideForGameplay start");
            this.hiddenForGameplay = true;
            this.isMenuVisible = false;
            this.beginMenuScaleOperation();
            this.transitions.stopAll();
            this.isTransitioning = false;
            this.isTabTransitioning = false;
            this.tabTransitionToken++;
            this.hideAllMenuScreensImmediate();
            this.hide(() => {
                this.logMenuState("hideForGameplay hide() done");
                this.endScreenChange();
                callback?.();
            });
        }
        /** Coop/network failure or cancel — same restore path as showMainMenu. */
        returnToMainMenu(callback) {
            this.showMainMenu(callback);
        }
        /** Legacy overlay API; now only supports settings + room routes. */
        showOverlay(overlay, callback) {
            this.logSettingsDiag("showOverlay(" + overlay + ") menuVisible=" + this.isMenuVisible);
            this.setPostGameOverlay(overlay);
            if (this.isMenuVisible) {
                this.logSettingsDiag("showOverlay → ensureMenuRootShown (skip scale-from-zero)");
                this.ensureMenuRootShown();
                this.logSettingsHierarchy("after ensureMenuRootShown");
                callback?.();
                return;
            }
            this.logSettingsDiag("showOverlay → show() full menu intro");
            this.show(() => {
                this.logSettingsHierarchy("after show()");
                callback?.();
            });
        }
        /** Show dedicated post-game panel after safe hide animation (win or fail). */
        showPostGameSession(options) {
            const sessionId = ++this.postGameSessionId;
            this.stopPostGameTimeAnimation();
            this.postGameActive = true;
            this.postGameMenuHandler = options.onMenu;
            this.ensurePostGameHostVisible();
            this.setCapsuleButtonPressable(this.menuButton, false);
            this.preparePostGameHidden();
            this.logMenu("showPostGameSession — " + options.outcome);
            this.logMenuState("showPostGameSession");
            this.popInPostGameRoot(() => {
                if (sessionId !== this.postGameSessionId) {
                    return;
                }
                this.runPostGamePresentation(sessionId, options);
            });
        }
        hidePostGameSession() {
            this.logMenuState("hidePostGameSession");
            this.postGameSessionId++;
            this.postGameActive = false;
            this.postGameMenuHandler = null;
            this.stopPostGameTimeAnimation();
            this.cancelPostGameAnimations();
            this.setCapsuleButtonPressable(this.menuButton, false);
            this.preparePostGameHidden();
        }
        isVisible() {
            return this.isMenuVisible;
        }
        updateMenuBackgroundForTab(tabIndex) {
            if (!this.menuBackground || !global.utils?.animateMaterialProperty) {
                return;
            }
            const duration = MENU_BACKGROUND_LERP_SEC;
            if (tabIndex === 0) {
                global.utils.animateMaterialProperty(this.menuBackground, "mainPass.state", 0, duration);
                global.utils.animateMaterialProperty(this.menuBackground, "mainPass.opacity", 1, duration);
                return;
            }
            if (tabIndex === 1) {
                global.utils.animateMaterialProperty(this.menuBackground, "mainPass.state", 1, duration);
                global.utils.animateMaterialProperty(this.menuBackground, "mainPass.opacity", 1, duration);
                return;
            }
            if (tabIndex === 2) {
                global.utils.animateMaterialProperty(this.menuBackground, "mainPass.opacity", 0, duration);
            }
        }
        transitionToScreen(target, callback) {
            if (target === this.currentScreen && !this.isTransitioning && this.isScreenShowing(target)) {
                callback?.();
                return;
            }
            const token = ++this.transitionToken;
            this.isTransitioning = true;
            this.isTabTransitioning = false;
            this.tabTransitionToken++;
            this.transitions.stopAll();
            const from = this.currentScreen;
            const fromElements = this.getScreenElements(from, true);
            const toView = this.getViewForScreen(target);
            const toElements = this.resolveElements(toView);
            const finish = () => {
                if (token !== this.transitionToken) {
                    return;
                }
                this.isTransitioning = false;
                this.currentScreen = target;
                this.applyScreenRoots(target);
                if (target === "main") {
                    const tabIndex = this.getSelectedTabIndex();
                    if (tabIndex >= 0) {
                        this.updateMenuBackgroundForTab(tabIndex);
                    }
                }
                callback?.();
            };
            const popInTarget = () => {
                if (!toView?.root) {
                    finish();
                    return;
                }
                toView.root.enabled = true;
                const popInList = this.buildPopInElements(toView, toElements);
                this.transitions.prepareElementsForPopIn(popInList);
                this.transitions.popInElements(popInList, () => {
                    if (target !== "main") {
                        finish();
                        return;
                    }
                    const tabElements = this.getTabElements();
                    if (tabElements.length === 0) {
                        finish();
                        return;
                    }
                    this.transitions.prepareElementsForPopIn(tabElements);
                    this.transitions.popInElements(tabElements, finish);
                });
            };
            if (fromElements.length === 0) {
                popInTarget();
                return;
            }
            this.transitions.popOutElements(fromElements, () => {
                if (token !== this.transitionToken) {
                    return;
                }
                this.disableScreenRootsExcept(target);
                popInTarget();
            });
        }
        getViewForScreen(screen) {
            switch (screen) {
                case "main":
                    return this.mainMenuView;
                case "soloTips":
                    return this.soloTipsView;
                case "tutorialTips":
                    return this.tutorialTipsView;
                case "onlineRoom":
                    return this.onlineRoomView;
            }
        }
        getScreenElements(screen, forTransitionOut = false) {
            const view = this.getViewForScreen(screen);
            let elements = this.resolveElements(view);
            if (forTransitionOut && screen === "main") {
                const tabElements = this.getTabElements();
                elements = this.uniqueElements([...elements, ...tabElements]);
            }
            if (forTransitionOut && view?.root) {
                elements = this.uniqueElements([...elements, view.root]);
            }
            return elements;
        }
        buildPopInElements(view, elements) {
            if (!view.root) {
                return elements;
            }
            return this.uniqueElements([view.root, ...elements]);
        }
        hideViewRoot(root) {
            root.getTransform().setLocalScale(vec3.zero());
            root.enabled = false;
        }
        enableSceneObjectAncestors(target) {
            let current = target;
            let depth = 0;
            while (current && depth < 24) {
                current.enabled = true;
                current = current.getParent();
                depth++;
            }
        }
        uniqueElements(elements) {
            const seen = [];
            for (const element of elements) {
                if (element && seen.indexOf(element) < 0) {
                    seen.push(element);
                }
            }
            return seen;
        }
        resolveElements(view) {
            if (!view?.root) {
                return [];
            }
            const assigned = (view.elements ?? []).filter((e) => !!e);
            if (assigned.length > 0) {
                return assigned;
            }
            return this.collectPopElements(view.root);
        }
        /** Prefer assigned elements; otherwise children of root, or children of a lone Content child. */
        collectPopElements(root) {
            const count = root.getChildrenCount();
            if (count === 1) {
                const only = root.getChild(0);
                if (only && only.getChildrenCount() > 0) {
                    const name = only.name;
                    if (name === "Content" || name.indexOf("Content") !== -1) {
                        return this.collectDirectChildren(only);
                    }
                }
            }
            return this.collectDirectChildren(root);
        }
        collectDirectChildren(root) {
            const result = [];
            const childCount = root.getChildrenCount();
            for (let i = 0; i < childCount; i++) {
                const child = root.getChild(i);
                if (child) {
                    result.push(child);
                }
            }
            return result;
        }
        isScreenShowing(screen) {
            const view = this.getViewForScreen(screen);
            if (!view?.root?.enabled) {
                return false;
            }
            for (const element of this.resolveElements(view)) {
                const scale = element.getTransform().getLocalScale();
                if (element.enabled && scale.x > 0.01) {
                    return true;
                }
            }
            return false;
        }
        cacheAllViewElements() {
            const all = [];
            for (const screen of ["main", "soloTips", "tutorialTips", "onlineRoom"]) {
                const view = this.getViewForScreen(screen);
                all.push(...this.getScreenElements(screen));
                if (screen === "main") {
                    all.push(...this.getAllTabElements());
                }
                if (view?.root) {
                    all.push(view.root);
                }
            }
            this.transitions.cacheRestScales(this.uniqueElements(all));
        }
        hideAllScreensImmediate() {
            this.hideAllMenuScreensImmediate();
            this.currentScreen = "main";
        }
        /** Disable step views only — menuRoot transform position is not modified. */
        hideAllMenuScreensImmediate() {
            for (const screen of ["main", "soloTips", "tutorialTips", "onlineRoom"]) {
                const view = this.getViewForScreen(screen);
                if (!view?.root) {
                    continue;
                }
                this.hideViewRoot(view.root);
                this.transitions.setElementsHidden(this.resolveElements(view));
            }
        }
        disableScreenRootsExcept(active) {
            for (const screen of ["main", "soloTips", "tutorialTips", "onlineRoom"]) {
                const view = this.getViewForScreen(screen);
                if (!view?.root) {
                    continue;
                }
                if (screen !== active) {
                    this.hideViewRoot(view.root);
                }
            }
        }
        applyScreenRoots(active) {
            for (const screen of ["main", "soloTips", "tutorialTips", "onlineRoom"]) {
                const view = this.getViewForScreen(screen);
                if (!view?.root) {
                    continue;
                }
                view.root.enabled = screen === active;
            }
        }
        setPostGameOverlay(overlay) {
            this.logSettingsDiag("setPostGameOverlay(" + overlay + ")");
            this.setSettingsOverlayActive(false);
            if (overlay === "main") {
                this.logSettingsDiag("setPostGameOverlay → main (tabs restored)");
                return;
            }
            if (overlay === "settings") {
                this.setSettingsOverlayActive(true);
                this.logSettingsHierarchy("after setSettingsOverlayActive(true)");
                return;
            }
            const map = {
                room: this.onlineRoomView?.root
            };
            const active = map[overlay];
            if (active) {
                active.enabled = true;
            }
        }
        /**
         * Settings View lives under Main Menu. Toggle tab chrome vs settings panel visibility.
         */
        setSettingsOverlayActive(active) {
            const mainRoot = this.mainMenuView?.root;
            if (!mainRoot) {
                this.logSettingsDiag("setSettingsOverlayActive(" +
                    active +
                    ") ABORT — mainMenuView.root missing (assign Main Menu on MenuController)");
                return;
            }
            if (!this.settingsView) {
                this.logSettingsDiag("setSettingsOverlayActive(" +
                    active +
                    ") ABORT — settingsView missing (assign Settings View on MenuController)");
                return;
            }
            this.logSettingsDiag("setSettingsOverlayActive(" +
                active +
                ") mainRoot=" +
                mainRoot.name +
                " enabled=" +
                mainRoot.enabled);
            const childCount = mainRoot.getChildrenCount();
            for (let i = 0; i < childCount; i++) {
                const child = mainRoot.getChild(i);
                if (!child) {
                    continue;
                }
                if (!active) {
                    mainRoot.enabled = true;
                    child.enabled = true;
                    continue;
                }
                const isSettings = child === this.settingsView;
                child.enabled = isSettings ? active : !active;
                if (isSettings && active) {
                    child.getTransform().setLocalScale(new vec3(1, 1, 1));
                }
                const scale = child.getTransform().getLocalScale();
                this.logSettingsDiag("  child[" +
                    i +
                    "] " +
                    child.name +
                    " isSettings=" +
                    isSettings +
                    " enabled=" +
                    child.enabled +
                    " scale=" +
                    scale.x.toFixed(2) +
                    "," +
                    scale.y.toFixed(2) +
                    "," +
                    scale.z.toFixed(2));
            }
        }
        /** Settings panel lives under Settings View; parent must be enabled for tab pop-in. */
        ensureSettingsTabVisible() {
            if (!this.settingsView) {
                this.logSettingsDiag("ensureSettingsTabVisible ABORT — settingsView not assigned");
                return;
            }
            this.settingsView.enabled = true;
            this.settingsView.getTransform().setLocalScale(new vec3(1, 1, 1));
            this.logSettingsDiag("ensureSettingsTabVisible OK — " + this.settingsView.name);
        }
        logSettingsDiag(msg) {
            if (!MenuController.ENABLE_SETTINGS_DEBUG) {
                return;
            }
            print("[SettingsDiag][MenuController] " + msg);
        }
        logSettingsHierarchy(context) {
            this.logSettingsDiag("── hierarchy " + context + " ──");
            this.logSettingsDiag("menuRoot: " +
                this.describeSceneObject(this.menuRoot) +
                " | settingsView input: " +
                this.describeSceneObject(this.settingsView) +
                " | mainMenuView.root: " +
                this.describeSceneObject(this.mainMenuView?.root));
            if (this.settingsView) {
                this.logSceneSubtree(this.settingsView, "  ", 0, 4);
            }
        }
        describeSceneObject(obj) {
            if (!obj) {
                return "(null)";
            }
            const scale = obj.getTransform().getLocalScale();
            return (obj.name +
                " enabled=" +
                obj.enabled +
                " scale=" +
                scale.x.toFixed(2) +
                "," +
                scale.y.toFixed(2) +
                "," +
                scale.z.toFixed(2));
        }
        logSceneSubtree(obj, indent, depth, maxDepth) {
            if (depth > maxDepth) {
                return;
            }
            this.logSettingsDiag(indent + this.describeSceneObject(obj));
            const n = obj.getChildrenCount();
            for (let i = 0; i < n; i++) {
                const child = obj.getChild(i);
                if (child) {
                    this.logSceneSubtree(child, indent + "  ", depth + 1, maxDepth);
                }
            }
        }
        prepareMenuForGameplayReturn() {
            this.isTransitioning = false;
            this.isTabTransitioning = false;
            this.currentScreen = "main";
            const host = this.getSceneObject();
            if (host) {
                host.enabled = true;
            }
            this.applyScreenRoots("main");
            this.restoreMainMenuShell();
            if (this.menuRoot) {
                this.enableSceneObjectAncestors(this.menuRoot);
                this.menuRoot.enabled = true;
                const scale = this.menuRoot.getTransform().getLocalScale();
                this.logMenu("prepareMenuForGameplayReturn menuRoot scale=" +
                    scale.x.toFixed(3) +
                    "," +
                    scale.y.toFixed(3) +
                    "," +
                    scale.z.toFixed(3));
            }
            else {
                this.logMenu("prepareMenuForGameplayReturn — menuRoot null");
            }
            this.logMenuState("prepareMenuForGameplayReturn");
        }
        runGameplayMenuReveal(restoreId, callback) {
            this.isMenuVisible = true;
            this.menuRevealInProgress = true;
            this.logMenu("runGameplayMenuReveal id=" + restoreId);
            const popElements = this.getMainMenuPopElements();
            const tabIndex = this.getSelectedTabIndex();
            const complete = () => {
                if (restoreId !== this.gameplayRestoreId) {
                    return;
                }
                this.menuRevealInProgress = false;
                this.hiddenForGameplay = false;
                if (tabIndex >= 0) {
                    this.updateMenuBackgroundForTab(tabIndex);
                }
                this.setTabButtonsInteractable(true);
                this.tabSwitchLocked = false;
                this.logMenuState("runGameplayMenuReveal complete");
                callback?.();
            };
            const runPop = () => {
                if (restoreId !== this.gameplayRestoreId) {
                    this.logMenu("runGameplayMenuReveal runPop stale id=" +
                        restoreId +
                        " current=" +
                        this.gameplayRestoreId);
                    return;
                }
                this.logMenu("runGameplayMenuReveal popIn count=" + popElements.length);
                this.maintainMenuHeightRelativeToCamera();
                if (popElements.length === 0) {
                    this.logMenu("runGameplayMenuReveal — no pop elements, finishing");
                    complete();
                    return;
                }
                this.transitions.prepareElementsForPopIn(popElements);
                this.transitions.popInElements(popElements, complete);
            };
            this.show(() => {
                if (restoreId !== this.gameplayRestoreId) {
                    this.logMenu("runGameplayMenuReveal show() stale id=" +
                        restoreId +
                        " current=" +
                        this.gameplayRestoreId);
                    return;
                }
                this.logMenuState("runGameplayMenuReveal after show()");
                runPop();
            });
            const fallbackSec = (MENU_SHOW_MS + popElements.length * 100 + 400) / 1000;
            global.utils.delay(fallbackSec, () => {
                if (restoreId !== this.gameplayRestoreId) {
                    return;
                }
                if (!this.needsFullMenuRestore()) {
                    this.logMenu("runGameplayMenuReveal fallback skipped — menu looks restored");
                    return;
                }
                this.logMenu("runGameplayMenuReveal — snap fallback (needsRestore still true)");
                this.logMenuState("runGameplayMenuReveal before snap fallback");
                this.snapMenuVisibleAfterGameplay();
                if (this.menuRevealInProgress) {
                    complete();
                }
            });
        }
        /**
         * Immediate menu restore — fallback if animated return stalls.
         */
        snapMenuVisibleAfterGameplay() {
            this.logMenu("snapMenuVisibleAfterGameplay");
            this.logMenuState("snapMenuVisibleAfterGameplay before");
            this.beginMenuScaleOperation();
            this.isMenuVisible = true;
            this.menuRevealInProgress = false;
            this.hiddenForGameplay = false;
            this.isTransitioning = false;
            this.isTabTransitioning = false;
            this.currentScreen = "main";
            const host = this.getSceneObject();
            if (host) {
                host.enabled = true;
            }
            this.applyScreenRoots("main");
            this.restoreMainMenuShell();
            if (this.menuRoot) {
                this.enableSceneObjectAncestors(this.menuRoot);
                this.menuRoot.enabled = true;
                this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1));
            }
            for (const element of this.getMainMenuPopElements()) {
                if (!element) {
                    continue;
                }
                element.enabled = true;
                element.getTransform().setLocalScale(this.transitions.getRestScale(element));
            }
            const tabIndex = this.selectedTabIndex >= 0
                ? this.selectedTabIndex
                : Math.min(DEFAULT_TAB_INDEX, Math.max(0, (this.tabs?.length ?? 1) - 1));
            if (this.tabs && this.tabs.length > 0) {
                this.selectedTabIndex = tabIndex;
                this.initializeVisibleTab(tabIndex);
                this.updateTabToggles();
                this.handleTabChanged(tabIndex);
            }
            if (global.appState) {
                global.appState.currentState = "mainMenu";
            }
            this.maintainMenuHeightRelativeToCamera();
            this.setTabButtonsInteractable(true);
            this.tabSwitchLocked = false;
            this.logMenuState("snapMenuVisibleAfterGameplay after");
        }
        /** After gameplay the whole menu was scaled away — restore main + pop tab content. */
        restoreMainMenuFromHidden(callback) {
            this.isMenuVisible = true;
            const token = ++this.transitionToken;
            this.menuRevealInProgress = true;
            this.isTransitioning = false;
            this.transitions.stopAll();
            this.currentScreen = "main";
            this.applyScreenRoots("main");
            this.restoreMainMenuShell();
            const popElements = this.getMainMenuPopElements();
            const afterPop = () => {
                if (token !== this.transitionToken) {
                    return;
                }
                this.menuRevealInProgress = false;
                const tabIndex = this.getSelectedTabIndex();
                if (tabIndex >= 0) {
                    this.updateMenuBackgroundForTab(tabIndex);
                }
                callback?.();
            };
            this.show(() => {
                if (token !== this.transitionToken) {
                    return;
                }
                this.maintainMenuHeightRelativeToCamera();
                if (popElements.length === 0) {
                    afterPop();
                    return;
                }
                this.transitions.prepareElementsForPopIn(popElements);
                this.transitions.popInElements(popElements, afterPop);
            });
        }
        /** Tab/button pieces only — not Main Menu root (show() already scales the UI shell). */
        getMainMenuPopElements() {
            const view = this.mainMenuView;
            if (!view) {
                return [];
            }
            const tabElements = this.getTabElements();
            return this.uniqueElements([...this.resolveElements(view), ...tabElements]);
        }
        restoreMainMenuShell() {
            const mainRoot = this.mainMenuView?.root;
            if (mainRoot) {
                mainRoot.enabled = true;
                mainRoot.getTransform().setLocalScale(new vec3(1, 1, 1));
            }
            if (this.settingsView) {
                this.settingsView.enabled = true;
                this.settingsView.getTransform().setLocalScale(new vec3(1, 1, 1));
            }
        }
        /**
         * Pins menu world Y to camera Y + offset. Does not call Headlock APIs.
         * Headlock still drives XZ / pitch; this only prevents pitch from shifting height.
         */
        maintainMenuHeightRelativeToCamera() {
            if (!this.menuRoot || !this.isMenuVisible || !this.menuRoot.enabled) {
                return;
            }
            const scale = this.menuRoot.getTransform().getLocalScale();
            if (scale.x < 0.01) {
                return;
            }
            const cameraY = WorldCameraFinderProvider.getInstance()
                .getTransform()
                .getWorldPosition().y;
            const targetY = cameraY + this.menuYOffsetFromCameraCm;
            const menuTransform = this.menuRoot.getTransform();
            const menuPos = menuTransform.getWorldPosition();
            if (Math.abs(menuPos.y - targetY) < 0.05) {
                return;
            }
            menuTransform.setWorldPosition(new vec3(menuPos.x, targetY, menuPos.z));
        }
        /** Keeps menuRoot visible without the 0→1 scale intro (e.g. after a screen pop-in). */
        ensureMenuRootShown() {
            if (!this.menuRoot) {
                return;
            }
            this.cancelActiveTween();
            this.menuRoot.enabled = true;
            this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1));
            this.isMenuVisible = true;
            this.maintainMenuHeightRelativeToCamera();
            if (global.appState) {
                global.appState.currentState = "mainMenu";
            }
        }
        needsFullMenuRestore() {
            if (this.menuRoot) {
                const rootScale = this.menuRoot.getTransform().getLocalScale().x;
                if (!this.menuRoot.enabled || rootScale < 0.01) {
                    return true;
                }
            }
            for (const element of this.getMainMenuPopElements()) {
                if (!element) {
                    continue;
                }
                if (!element.enabled) {
                    return true;
                }
                if (element.getTransform().getLocalScale().x < 0.01) {
                    return true;
                }
            }
            return false;
        }
        beginMenuScaleOperation() {
            this.menuScaleGeneration++;
            this.cancelActiveTween();
            if (this.menuRoot && global.utils?.cancelObjectAnimations) {
                global.utils.cancelObjectAnimations(this.menuRoot);
            }
            return this.menuScaleGeneration;
        }
        isMenuScaleOperationCurrent(generation) {
            return generation === this.menuScaleGeneration;
        }
        show(callback) {
            if (!this.menuRoot) {
                print("[MenuController] show() skipped — menuRoot not assigned");
                callback?.();
                return;
            }
            const scaleGeneration = this.beginMenuScaleOperation();
            this.menuRoot.enabled = true;
            this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0));
            this.isMenuVisible = true;
            this.maintainMenuHeightRelativeToCamera();
            if (global.appState) {
                global.appState.currentState = "mainMenu";
            }
            const finish = () => {
                if (!this.isMenuScaleOperationCurrent(scaleGeneration)) {
                    this.logMenu("show() finish stale gen=" + scaleGeneration + " current=" + this.menuScaleGeneration);
                    return;
                }
                this.logMenu("show() finish gen=" + scaleGeneration);
                callback?.();
            };
            this.logMenu("show() start gen=" + scaleGeneration);
            if (this.tryAnimateScale(this.menuRoot, new vec3(1, 1, 1), MENU_SHOW_MS, scaleGeneration, finish)) {
                return;
            }
            this.logMenu("show() instant scale (no tween)");
            this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1));
            finish();
        }
        hide(callback) {
            if (!this.menuRoot) {
                callback?.();
                return;
            }
            const scaleGeneration = this.beginMenuScaleOperation();
            const finish = () => {
                if (!this.isMenuScaleOperationCurrent(scaleGeneration)) {
                    this.logMenu("hide() finish stale gen=" + scaleGeneration + " current=" + this.menuScaleGeneration);
                    return;
                }
                this.isMenuVisible = false;
                this.logMenu("hide() finish gen=" + scaleGeneration);
                callback?.();
            };
            this.logMenu("hide() start gen=" + scaleGeneration);
            if (this.tryAnimateScale(this.menuRoot, new vec3(0, 0, 0), MENU_HIDE_MS, scaleGeneration, finish)) {
                return;
            }
            this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0));
            finish();
        }
        prepareMenuHidden() {
            if (!this.menuRoot) {
                return;
            }
            this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0));
            this.menuRoot.enabled = false;
        }
        tryAnimateScale(target, toScale, durationMs, scaleGeneration, onComplete) {
            const durationSec = durationMs / 1000;
            if (global.utils && typeof global.utils.animateScale === "function") {
                global.utils.animateScale(target, true, toScale, durationSec, () => {
                    if (!this.isMenuScaleOperationCurrent(scaleGeneration)) {
                        return;
                    }
                    onComplete?.();
                });
                return true;
            }
            try {
                this.activeTween = LSTween_1.LSTween.scaleToLocal(target.getTransform(), toScale, durationMs)
                    .easing(toScale.x > 0 ? Easing_1.default.Quadratic.Out : Easing_1.default.Quadratic.In)
                    .onComplete(() => {
                    this.activeTween = null;
                    if (!this.isMenuScaleOperationCurrent(scaleGeneration)) {
                        return;
                    }
                    onComplete?.();
                })
                    .start();
                return true;
            }
            catch (e) {
                print("[MenuController] LSTween scale failed: " + e);
                return false;
            }
        }
        cancelActiveTween() {
            if (this.activeTween && typeof this.activeTween.stop === "function") {
                this.activeTween.stop();
            }
            this.activeTween = null;
        }
        /** Playful idle logo — scale and Z wobble loop while the lens runs. */
        startLogoIdleAnimation() {
            if (!this.logo) {
                return;
            }
            this.stopLogoIdleAnimation();
            const transform = this.logo.getTransform();
            const restScale = transform.getLocalScale();
            const peakScale = restScale.uniformScale(LOGO_SCALE_PEAK);
            this.logoScaleTween = LSTween_1.LSTween.scaleFromToLocal(transform, restScale, peakScale, LOGO_SCALE_DURATION_MS)
                .easing(Easing_1.default.Sinusoidal.InOut)
                .yoyo(true)
                .repeat(Infinity)
                .start();
            const eulerRad = transform.getLocalRotation().toEulerAngles();
            const restDeg = eulerRad.uniformScale(RAD_TO_DEG);
            const fromDeg = new vec3(restDeg.x, restDeg.y, restDeg.z - LOGO_ROTATE_Z_DEG);
            const toDeg = new vec3(restDeg.x, restDeg.y, restDeg.z + LOGO_ROTATE_Z_DEG);
            this.logoRotateTween = LSTween_1.LSTween.rotateFromToLocalInDegrees(transform, fromDeg, toDeg, LOGO_ROTATE_DURATION_MS)
                .easing(Easing_1.default.Sinusoidal.InOut)
                .yoyo(true)
                .repeat(Infinity)
                .start();
        }
        stopLogoIdleAnimation() {
            if (this.logoScaleTween && typeof this.logoScaleTween.stop === "function") {
                this.logoScaleTween.stop();
            }
            if (this.logoRotateTween && typeof this.logoRotateTween.stop === "function") {
                this.logoRotateTween.stop();
            }
            this.logoScaleTween = null;
            this.logoRotateTween = null;
        }
        // ── Post-game session UI ───────────────────────────────────────────────────
        bindPostGameMenuButton() {
            const button = this.resolveCapsuleButton(this.menuButton);
            if (!button) {
                return;
            }
            const bind = () => {
                button.onTriggerUp.add(() => {
                    this.onPostGameMenuPressed();
                });
            };
            if (button.initialized) {
                bind();
                return;
            }
            button.onInitialized.add(bind);
        }
        onPostGameMenuPressed() {
            if (!this.postGameActive || !this.postGameMenuHandler) {
                return;
            }
            this.setCapsuleButtonPressable(this.menuButton, false);
            const handler = this.postGameMenuHandler;
            this.postGameMenuHandler = null;
            handler?.();
        }
        ensurePostGameHostVisible() {
            const host = this.getSceneObject();
            if (host) {
                host.enabled = true;
            }
            if (this.menuRoot) {
                this.enableSceneObjectAncestors(this.menuRoot);
                this.menuRoot.enabled = true;
                this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1));
                this.maintainMenuHeightRelativeToCamera();
            }
        }
        cancelPostGameAnimations() {
            this.stopPostGameStarTweens();
            const targets = [
                this.postGameRoot,
                ...this.getDirectChildren(this.starOutlinesParent),
                ...this.getDirectChildren(this.starsParent)
            ];
            for (const target of targets) {
                if (target && global.utils?.cancelObjectAnimations) {
                    global.utils.cancelObjectAnimations(target);
                }
            }
        }
        stopPostGameStarTweens() {
            for (const tween of this.postGameStarTweens) {
                tween?.stop?.();
            }
            this.postGameStarTweens = [];
            for (const ev of this.postGameImageFadeEvents) {
                ev.enabled = false;
            }
            this.postGameImageFadeEvents = [];
        }
        preparePostGameHidden() {
            this.cancelPostGameAnimations();
            if (this.postGameRoot) {
                this.postGameRoot.enabled = false;
                this.postGameRoot.getTransform().setLocalScale(vec3.zero());
            }
            if (this.solvedCopy) {
                this.solvedCopy.enabled = false;
            }
            if (this.failedCopy) {
                this.failedCopy.enabled = false;
            }
            this.resetPostGameStarVisuals();
            if (this.timeElapsedText) {
                this.timeElapsedText.text = "000.0s";
            }
        }
        resetPostGameStarVisuals() {
            const outlines = this.getDirectChildren(this.starOutlinesParent);
            const stars = this.getDirectChildren(this.starsParent);
            this.transitions.cacheRestScales(outlines);
            this.transitions.cacheRestScales(stars);
            this.resetChildren(outlines);
            this.resetChildren(stars);
        }
        resetChildren(children) {
            for (const child of children) {
                if (!child) {
                    continue;
                }
                child.enabled = false;
                child.getTransform().setLocalScale(vec3.zero());
            }
        }
        popInPostGameRoot(onComplete) {
            if (!this.postGameRoot) {
                onComplete();
                return;
            }
            this.postGameRoot.enabled = true;
            this.postGameRoot.getTransform().setLocalScale(vec3.zero());
            global.utils.animateScale(this.postGameRoot, true, vec3.one(), POSTGAME_ROOT_SCALE_SEC, onComplete);
        }
        runPostGamePresentation(sessionId, options) {
            const isWin = options.outcome === "win";
            if (this.solvedCopy) {
                this.solvedCopy.enabled = isWin;
            }
            if (this.failedCopy) {
                this.failedCopy.enabled = !isWin;
            }
            const outlineChildren = this.getDirectChildren(this.starOutlinesParent);
            this.transitions.cacheRestScales(outlineChildren);
            this.scaleChildrenStaggered(outlineChildren, POSTGAME_OUTLINE_SCALE_SEC, POSTGAME_OUTLINE_STAGGER_SEC, () => {
                if (sessionId !== this.postGameSessionId) {
                    return;
                }
                if (!isWin) {
                    this.setPostGameMissingOutlines(0);
                    this.finishPostGamePresentation(sessionId);
                    return;
                }
                const solveDuration = Math.max(0, options.solveDurationSeconds ?? 0);
                const bombTimer = Math.max(1, options.bombTimerSeconds ?? 1);
                const penalties = Math.max(0, options.penaltyCount ?? 0);
                const starCount = this.computeStarCount(solveDuration, bombTimer, penalties);
                let timeDone = false;
                let starsDone = starCount <= 0;
                const tryFinishWin = () => {
                    if (timeDone && starsDone) {
                        this.finishPostGamePresentation(sessionId);
                    }
                };
                this.playPostGameTimeAnimation(sessionId, solveDuration, () => {
                    timeDone = true;
                    tryFinishWin();
                });
                global.utils.delay(POSTGAME_STARS_DELAY_SEC, () => {
                    if (sessionId !== this.postGameSessionId) {
                        return;
                    }
                    this.popInPostGameStars(sessionId, starCount, () => {
                        this.setPostGameMissingOutlines(starCount);
                        starsDone = true;
                        tryFinishWin();
                    });
                });
            });
        }
        finishPostGamePresentation(sessionId) {
            if (sessionId !== this.postGameSessionId) {
                return;
            }
            this.setCapsuleButtonPressable(this.menuButton, true);
        }
        computeStarCount(solveDurationSec, bombTimerSec, penaltyCount) {
            const ratio = solveDurationSec / bombTimerSec;
            if (ratio < 0.5 && penaltyCount <= 0) {
                return 3;
            }
            if (ratio < 0.6) {
                return 2;
            }
            return 1;
        }
        /**
         * Outlines are only shown for missing stars after reveal.
         * - 3 stars => 0 outlines
         * - 2 stars => 1 outline
         * - 1 star  => 2 outlines
         * - 0 stars => 3 outlines
         */
        setPostGameMissingOutlines(starCount) {
            const outlines = this.getDirectChildren(this.starOutlinesParent);
            const maxStars = Math.min(3, outlines.length);
            const clampedStars = Math.max(0, Math.min(starCount, maxStars));
            for (let i = 0; i < outlines.length; i++) {
                const outline = outlines[i];
                if (!outline) {
                    continue;
                }
                // Show only outlines for star slots that are missing.
                const show = i >= clampedStars && i < maxStars;
                outline.enabled = show;
                if (!show) {
                    outline.getTransform().setLocalScale(vec3.zero());
                }
                else {
                    outline.getTransform().setLocalScale(this.transitions.getRestScale(outline));
                }
            }
        }
        scaleChildrenStaggered(children, durationSec, staggerSec, onComplete) {
            if (children.length === 0) {
                onComplete();
                return;
            }
            let remaining = children.length;
            const finishOne = () => {
                remaining--;
                if (remaining <= 0) {
                    onComplete();
                }
            };
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const restScale = this.transitions.getRestScale(child);
                child.enabled = true;
                child.getTransform().setLocalScale(vec3.zero());
                global.utils.delay(i * staggerSec, () => {
                    global.utils.animateScale(child, true, restScale, durationSec, finishOne);
                });
            }
        }
        popInPostGameStars(sessionId, starCount, onComplete) {
            const stars = this.getDirectChildren(this.starsParent);
            if (stars.length === 0 || starCount <= 0) {
                onComplete();
                return;
            }
            this.transitions.cacheRestScales(stars);
            const visibleStars = stars.slice(0, Math.min(starCount, stars.length));
            for (let i = starCount; i < stars.length; i++) {
                stars[i].enabled = false;
                stars[i].getTransform().setLocalScale(vec3.zero());
            }
            let remaining = visibleStars.length;
            const finishOne = () => {
                remaining--;
                if (remaining <= 0) {
                    onComplete();
                }
            };
            for (let i = 0; i < visibleStars.length; i++) {
                const star = visibleStars[i];
                const transform = star.getTransform();
                const starImage = this.getStarFillImage(star);
                const restScale = this.transitions.getRestScale(star);
                const restPos = transform.getLocalPosition();
                const restRotRad = transform.getLocalRotation().toEulerAngles();
                const restRotDeg = restRotRad.uniformScale(RAD_TO_DEG);
                const popPos = new vec3(restPos.x, restPos.y, restPos.z + POSTGAME_STAR_Z_POP);
                const flipRotDeg = new vec3(restRotDeg.x, restRotDeg.y + POSTGAME_STAR_FLIP_Y_DEG, restRotDeg.z);
                star.enabled = true;
                this.setImageOpacity(starImage, 0);
                transform.setLocalScale(vec3.zero());
                transform.setLocalPosition(restPos);
                transform.setLocalRotation(quat.fromEulerAngles(restRotDeg.x * (Math.PI / 180), restRotDeg.y * (Math.PI / 180), restRotDeg.z * (Math.PI / 180)));
                const delaySec = i * POSTGAME_STAR_STAGGER_SEC;
                global.utils.delay(delaySec, () => {
                    if (sessionId !== this.postGameSessionId) {
                        return;
                    }
                    if (!star.enabled) {
                        finishOne();
                        return;
                    }
                    const overshootScale = restScale.uniformScale(POSTGAME_STAR_OVERSHOOT_SCALE);
                    global.utils.animateScale(star, true, overshootScale, POSTGAME_STAR_POP_SEC, () => {
                        if (sessionId !== this.postGameSessionId || !star.enabled) {
                            return;
                        }
                        global.utils.animateScale(star, true, restScale, POSTGAME_STAR_SETTLE_SEC, () => {
                            if (sessionId !== this.postGameSessionId || !star.enabled) {
                                return;
                            }
                            this.fadeInStarImage(starImage);
                            this.startPostGameStarWiggle(star, sessionId);
                            finishOne();
                        });
                    });
                    global.utils.animatePosition(star, true, popPos, POSTGAME_STAR_POP_SEC, () => {
                        if (sessionId !== this.postGameSessionId || !star.enabled) {
                            return;
                        }
                        global.utils.animatePosition(star, true, restPos, POSTGAME_STAR_SETTLE_SEC, () => { });
                    });
                    const masterVolume = global.appState && typeof global.appState.checkStorage === "function"
                        ? global.appState.checkStorage("masterVolume")
                        : 1;
                    global.playSfx(29, 1, masterVolume * 1);
                    global.utils.animateRotation(star, true, flipRotDeg, POSTGAME_STAR_ROTATE_POP_SEC, () => {
                        if (sessionId !== this.postGameSessionId || !star.enabled) {
                            return;
                        }
                        global.utils.animateRotation(star, true, restRotDeg, POSTGAME_STAR_ROTATE_SETTLE_SEC, () => { });
                    });
                });
            }
        }
        startPostGameStarWiggle(star, sessionId) {
            if (!star || sessionId !== this.postGameSessionId) {
                return;
            }
            const transform = star.getTransform();
            const eulerRad = transform.getLocalRotation().toEulerAngles();
            const restDeg = eulerRad.uniformScale(RAD_TO_DEG);
            const fromDeg = new vec3(restDeg.x, restDeg.y - POSTGAME_STAR_WIGGLE_Y_DEG, restDeg.z);
            const toDeg = new vec3(restDeg.x, restDeg.y + POSTGAME_STAR_WIGGLE_Y_DEG, restDeg.z);
            try {
                const tween = LSTween_1.LSTween.rotateFromToLocalInDegrees(transform, fromDeg, toDeg, POSTGAME_STAR_WIGGLE_MS)
                    .easing(Easing_1.default.Sinusoidal.InOut)
                    .yoyo(true)
                    .repeat(Infinity);
                this.postGameStarTweens.push(tween);
                tween.start();
            }
            catch (_e) {
                // Keep stars static if tween setup fails.
            }
        }
        /** Each filled star's second child holds an Image that should fade in. */
        getStarFillImage(star) {
            const secondChild = star?.getChild(1);
            if (!secondChild) {
                return null;
            }
            return secondChild.getComponent("Component.Image");
        }
        fadeInStarImage(image) {
            if (!image) {
                return;
            }
            const material = image.mainMaterial ?? null;
            if (material && material.mainPass && material.mainPass.baseColor) {
                const start = this.getBaseColorAlpha(material);
                const target = POSTGAME_STAR_IMAGE_TARGET_ALPHA;
                const duration = Math.max(0.001, POSTGAME_STAR_IMAGE_FADE_SEC);
                const startTime = getTime();
                const ev = this.createEvent("UpdateEvent");
                this.postGameImageFadeEvents.push(ev);
                ev.bind(() => {
                    const t = Math.min(1, (getTime() - startTime) / duration);
                    const smooth = t * t * (3 - 2 * t);
                    const alpha = start + (target - start) * smooth;
                    this.setImageOpacity(image, alpha);
                    if (t >= 1) {
                        this.setImageOpacity(image, target);
                        ev.enabled = false;
                        this.postGameImageFadeEvents = this.postGameImageFadeEvents.filter((entry) => entry !== ev);
                    }
                });
                return;
            }
            this.setImageOpacity(image, POSTGAME_STAR_IMAGE_TARGET_ALPHA);
        }
        setImageOpacity(image, alpha) {
            if (!image) {
                return;
            }
            const a = Math.max(0, Math.min(1, alpha));
            const material = image.mainMaterial ?? null;
            if (!material) {
                return;
            }
            if (material.mainPass && material.mainPass.baseColor) {
                const c = material.mainPass.baseColor;
                material.mainPass.baseColor = new vec4(c.x, c.y, c.z, a);
            }
        }
        getBaseColorAlpha(material) {
            if (!material.mainPass || !material.mainPass.baseColor) {
                return 0;
            }
            const c = material.mainPass.baseColor;
            return c.w;
        }
        playPostGameTimeAnimation(sessionId, targetSeconds, onComplete) {
            this.stopPostGameTimeAnimation();
            if (!this.timeElapsedText) {
                onComplete();
                return;
            }
            this.timeElapsedText.text = "000.0s";
            let elapsed = 0;
            this.postGameTimeAnimEvent = this.createEvent("UpdateEvent");
            this.postGameTimeAnimEvent.bind(() => {
                if (sessionId !== this.postGameSessionId) {
                    return;
                }
                elapsed += getDeltaTime();
                const progress = Math.min(1, elapsed / POSTGAME_TIME_ANIM_SEC);
                const currentSeconds = targetSeconds * progress;
                this.timeElapsedText.text = this.formatPostGameElapsed(currentSeconds);
                if (progress >= 1) {
                    this.timeElapsedText.text = this.formatPostGameElapsed(targetSeconds);
                    this.stopPostGameTimeAnimation();
                    onComplete();
                }
            });
        }
        stopPostGameTimeAnimation() {
            if (this.postGameTimeAnimEvent) {
                this.postGameTimeAnimEvent.enabled = false;
                this.postGameTimeAnimEvent = null;
            }
        }
        formatPostGameElapsed(seconds) {
            const clamped = Math.max(0, Math.min(999.9, seconds));
            const whole = Math.floor(clamped);
            const tenths = Math.min(9, Math.floor((clamped - whole) * 10 + 0.0001));
            return ("000" + whole.toString()).slice(-3) + "." + tenths + "s";
        }
        getDirectChildren(parent) {
            if (!parent) {
                return [];
            }
            const children = [];
            const count = parent.getChildrenCount();
            for (let i = 0; i < count; i++) {
                const child = parent.getChild(i);
                if (child) {
                    children.push(child);
                }
            }
            return children;
        }
        resolveCapsuleButton(buttonInput) {
            if (!buttonInput) {
                return null;
            }
            const direct = buttonInput;
            if (typeof direct.inactive !== "undefined") {
                return direct;
            }
            const asScript = buttonInput;
            const sceneObject = asScript?.getSceneObject?.();
            if (!sceneObject) {
                return null;
            }
            return sceneObject.getComponent(CapsuleButton_1.CapsuleButton.getTypeName());
        }
        setCapsuleButtonPressable(buttonInput, pressable) {
            const button = this.resolveCapsuleButton(buttonInput);
            if (!button) {
                return;
            }
            const apply = () => {
                const resolved = this.resolveCapsuleButton(buttonInput);
                if (!resolved) {
                    return;
                }
                if (pressable) {
                    resolved.inactive = true;
                    resolved.inactive = false;
                }
                else {
                    resolved.inactive = false;
                    resolved.inactive = true;
                }
                const interactable = resolved.interactable;
                if (interactable) {
                    interactable.enabled = pressable;
                }
            };
            if (button.initialized) {
                apply();
                return;
            }
            button.onInitialized.add(apply);
        }
        // ── Main menu tabs (formerly MainMenuTabination) ─────────────────────────
        /** Currently selected main-menu tab (0-based), or -1 if none. */
        getSelectedTabIndex() {
            return this.selectedTabIndex;
        }
        /** All tab panel elements across every tab. */
        getAllTabElements() {
            const elements = [];
            for (const tab of this.tabs ?? []) {
                for (const element of tab?.elements ?? []) {
                    if (element) {
                        elements.push(element);
                    }
                }
            }
            return elements;
        }
        /** SceneObjects for a tab panel (defaults to the selected tab). */
        getTabElements(tabIndex) {
            if (!this.tabs || this.tabs.length === 0) {
                return [];
            }
            const index = tabIndex !== undefined && tabIndex >= 0
                ? Math.min(tabIndex, this.tabs.length - 1)
                : this.selectedTabIndex;
            if (index < 0) {
                return [];
            }
            return (this.tabs[index]?.elements ?? []).filter((element) => !!element);
        }
        initializeMainMenuTabs() {
            if (!this.tabs || this.tabs.length === 0) {
                print("[MenuController] No main menu tabs assigned.");
                return;
            }
            for (let i = 0; i < this.tabs.length; i++) {
                const button = this.getTabButton(this.tabs[i]);
                if (!button) {
                    continue;
                }
                button.setIsToggleable(true);
                const tabIndex = i;
                const bindTrigger = () => {
                    button.onTriggerUp.add(() => {
                        this.selectTab(tabIndex);
                    });
                };
                if (button.initialized) {
                    bindTrigger();
                }
                else {
                    button.onInitialized.add(bindTrigger);
                }
            }
            const startIndex = Math.min(Math.max(DEFAULT_TAB_INDEX, 0), this.tabs.length - 1);
            this.initializeVisibleTab(startIndex);
            this.selectedTabIndex = startIndex;
            this.updateTabToggles();
            this.handleTabChanged(startIndex);
        }
        selectTab(index) {
            if (!this.tabs || index < 0 || index >= this.tabs.length) {
                return;
            }
            if (this.isScreenChangeLocked) {
                this.updateTabToggles();
                return;
            }
            if (this.tabSwitchLocked) {
                this.updateTabToggles();
                return;
            }
            const changed = index !== this.selectedTabIndex;
            const previousIndex = this.selectedTabIndex;
            this.selectedTabIndex = index;
            this.updateTabToggles();
            if (!changed) {
                return;
            }
            this.handleTabChanged(index);
            this.lockTabSwitch();
            if (this.isTabTransitioning) {
                this.interruptAndShowTab(index);
                return;
            }
            if (previousIndex < 0) {
                const token = this.beginTabTransition();
                this.popInTab(index, () => {
                    this.finishTabTransition(token);
                });
                return;
            }
            const token = this.beginTabTransition();
            this.popOutTab(previousIndex, () => {
                if (!this.isTabTransitionTokenCurrent(token)) {
                    return;
                }
                this.popInTab(index, () => {
                    this.finishTabTransition(token);
                });
            });
        }
        handleTabChanged(tabIndex) {
            if (this.currentScreen === "main") {
                this.updateMenuBackgroundForTab(tabIndex);
            }
            if (tabIndex === SETTINGS_TAB_INDEX) {
                this.ensureSettingsTabVisible();
                this.settingsTabSelectedHandler?.();
            }
        }
        lockTabSwitch() {
            this.tabSwitchLocked = true;
            this.setTabButtonsInteractable(false);
            this.unlockTabSwitchEvent.reset(TAB_SWITCH_COOLDOWN_SEC);
        }
        setTabButtonsInteractable(enabled) {
            for (const tab of this.tabs) {
                const button = this.getTabButton(tab);
                if (!button?.interactable) {
                    continue;
                }
                button.interactable.enabled = enabled;
            }
        }
        beginTabTransition() {
            this.tabTransitionToken++;
            this.isTabTransitioning = true;
            return this.tabTransitionToken;
        }
        finishTabTransition(token) {
            if (!this.isTabTransitionTokenCurrent(token)) {
                return;
            }
            this.isTabTransitioning = false;
        }
        isTabTransitionTokenCurrent(token) {
            return token === this.tabTransitionToken;
        }
        interruptAndShowTab(index) {
            const token = this.beginTabTransition();
            this.hideAllTabElementsExcept(index);
            this.popInTab(index, () => {
                this.finishTabTransition(token);
            });
        }
        hideAllTabElementsExcept(activeIndex) {
            for (let i = 0; i < this.tabs.length; i++) {
                if (i === activeIndex) {
                    this.prepareTabElementsForPopIn(i);
                }
                else {
                    this.setTabElementsHidden(i);
                }
            }
        }
        setTabElementsHidden(tabIndex) {
            const elements = this.tabs[tabIndex]?.elements ?? [];
            this.transitions.setElementsHidden(elements.filter((element) => !!element));
        }
        prepareTabElementsForPopIn(tabIndex) {
            const elements = this.tabs[tabIndex]?.elements ?? [];
            this.transitions.prepareElementsForPopIn(elements.filter((element) => !!element));
        }
        initializeVisibleTab(activeIndex) {
            for (let i = 0; i < this.tabs.length; i++) {
                const tab = this.tabs[i];
                if (!tab?.elements) {
                    continue;
                }
                const isActive = i === activeIndex;
                for (const element of tab.elements) {
                    if (!element) {
                        continue;
                    }
                    const restScale = this.transitions.getRestScale(element);
                    element.enabled = isActive;
                    element.getTransform().setLocalScale(isActive ? restScale : vec3.zero());
                }
            }
        }
        getTabButton(tab) {
            if (!tab?.button) {
                return null;
            }
            return tab.button;
        }
        updateTabToggles() {
            for (let i = 0; i < this.tabs.length; i++) {
                const button = this.getTabButton(this.tabs[i]);
                if (!button) {
                    continue;
                }
                button.toggle(i === this.selectedTabIndex);
            }
        }
        popOutTab(tabIndex, onComplete) {
            const elements = (this.tabs[tabIndex]?.elements ?? []).filter((element) => !!element);
            this.transitions.popOutElements(elements, onComplete);
        }
        popInTab(tabIndex, onComplete) {
            const elements = (this.tabs[tabIndex]?.elements ?? []).filter((element) => !!element);
            this.transitions.popInElements(elements, onComplete);
        }
    };
    __setFunctionName(_classThis, "MenuController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MenuController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.ENABLE_SETTINGS_DEBUG = false;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MenuController = _classThis;
})();
exports.MenuController = MenuController;
//# sourceMappingURL=MenuController.js.map