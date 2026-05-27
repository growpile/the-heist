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
const LOGO_ROTATE_Z_DEG = 15;
const LOGO_ROTATE_DURATION_MS = 1000;
const RAD_TO_DEG = 180 / Math.PI;
/** Main-menu tab index for Settings (third tab). */
const SETTINGS_TAB_INDEX = 2;
const DEFAULT_TAB_INDEX = 0;
const TAB_SWITCH_COOLDOWN_SEC = 0.5;
/**
 * Central menu controller: root scale, stepped screens (main → tips → room),
 * main-menu tab switching, and post-game overlays.
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
            this.tabs = this.tabs;
            this.mainMenuView = this.mainMenuView;
            this.soloTipsView = this.soloTipsView;
            this.tutorialTipsView = this.tutorialTipsView;
            this.onlineRoomView = this.onlineRoomView;
            this.settingsView = this.settingsView;
            this.solvedView = this.solvedView;
            this.timedView = this.timedView;
            this.tutorialSolvedView = this.tutorialSolvedView;
            this.loadingView = this.loadingView;
            this.solvedSecondsText = this.solvedSecondsText;
            this.transitions = new MenuViewTransitions_1.MenuViewTransitions();
            this.activeTween = null;
            /** Invalidates stale hide/show scale callbacks when returning from gameplay. */
            this.menuScaleGeneration = 0;
            this.isMenuVisible = false;
            this.currentScreen = "main";
            this.pendingSafeType = null;
            this.isTransitioning = false;
            this.transitionToken = 0;
            this.menuRevealInProgress = false;
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
            this.tabs = this.tabs;
            this.mainMenuView = this.mainMenuView;
            this.soloTipsView = this.soloTipsView;
            this.tutorialTipsView = this.tutorialTipsView;
            this.onlineRoomView = this.onlineRoomView;
            this.settingsView = this.settingsView;
            this.solvedView = this.solvedView;
            this.timedView = this.timedView;
            this.tutorialSolvedView = this.tutorialSolvedView;
            this.loadingView = this.loadingView;
            this.solvedSecondsText = this.solvedSecondsText;
            this.transitions = new MenuViewTransitions_1.MenuViewTransitions();
            this.activeTween = null;
            /** Invalidates stale hide/show scale callbacks when returning from gameplay. */
            this.menuScaleGeneration = 0;
            this.isMenuVisible = false;
            this.currentScreen = "main";
            this.pendingSafeType = null;
            this.isTransitioning = false;
            this.transitionToken = 0;
            this.menuRevealInProgress = false;
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
            this.hidePostGameOverlaysImmediate();
            this.prepareMenuHidden();
            this.createEvent("LateUpdateEvent").bind(() => this.maintainMenuHeightRelativeToCamera());
            this.createEvent("OnStartEvent").bind(() => this.initializeMainMenuTabs());
        }
        /** Lens open or return to main: pop transition; scale menuRoot only when it was hidden. */
        showMainMenu(callback) {
            this.pendingSafeType = null;
            this.hidePostGameOverlaysImmediate();
            const menuHiddenByScale = !!this.menuRoot && this.menuRoot.getTransform().getLocalScale().x < 0.01;
            if (!this.isMenuVisible || menuHiddenByScale || this.menuRevealInProgress) {
                this.menuRevealInProgress = false;
                this.isTransitioning = false;
                this.transitions.stopAll();
                this.cancelActiveTween();
                this.restoreMainMenuFromHidden(callback);
                return;
            }
            if (this.currentScreen === "main" && !this.isTransitioning) {
                this.ensureMenuRootShown();
                this.restoreMainMenuShell();
                callback?.();
                return;
            }
            this.transitionToScreen("main", () => {
                this.ensureMenuRootShown();
                this.restoreMainMenuShell();
                callback?.();
            });
        }
        /** Main menu → Solo or Tutorial tips (first run uses tutorial). */
        requestSoloTips(callback) {
            const hasPlayed = global.appState?.checkStorage("tutorialPlayed") ?? false;
            this.pendingSafeType = hasPlayed ? "solo" : "tutorial";
            const target = hasPlayed ? "soloTips" : "tutorialTips";
            this.transitionToScreen(target, callback);
        }
        /** Settings → Replay Tutorial: always open tutorial tips (Start runs tutorial safe). */
        requestTutorialTips(callback) {
            this.hidePostGameOverlaysImmediate();
            this.pendingSafeType = "tutorial";
            this.transitionToScreen("tutorialTips", callback);
        }
        /** Main menu → online room step, then run networking in the callback. */
        requestOnlineRoom(callback) {
            this.pendingSafeType = "coop";
            this.transitionToScreen("onlineRoom", callback);
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
        getCurrentScreen() {
            return this.currentScreen;
        }
        /** Hide menu UI for gameplay (scale + step views only; no transform position changes). */
        hideForGameplay(callback) {
            this.beginMenuScaleOperation();
            this.transitions.stopAll();
            this.isTransitioning = false;
            this.isTabTransitioning = false;
            this.tabTransitionToken++;
            this.hideAllMenuScreensImmediate();
            this.hide(callback);
        }
        /** Coop/network failure or cancel — same restore path as showMainMenu. */
        returnToMainMenu(callback) {
            this.showMainMenu(callback);
        }
        /** Legacy post-game overlays — toggled without pop stack for now. */
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
        setSolvedSeconds(seconds) {
            if (this.solvedSecondsText) {
                this.solvedSecondsText.text = seconds.toFixed(0).toString();
            }
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
        hidePostGameOverlaysImmediate() {
            // settingsView is main-menu tab content; tab switch + ensureSettingsTabVisible own visibility
            const overlays = [
                this.solvedView,
                this.timedView,
                this.tutorialSolvedView,
                this.loadingView
            ];
            for (const view of overlays) {
                if (view) {
                    view.enabled = false;
                }
            }
        }
        setPostGameOverlay(overlay) {
            this.logSettingsDiag("setPostGameOverlay(" + overlay + ")");
            this.setSettingsOverlayActive(false);
            this.hidePostGameOverlaysImmediate();
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
                solved: this.solvedView,
                timed: this.timedView,
                tutorialSolved: this.tutorialSolvedView,
                loading: this.loadingView,
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
        /** After gameplay the whole menu was scaled away — restore main + pop tab content. */
        restoreMainMenuFromHidden(callback) {
            this.beginMenuScaleOperation();
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
        beginMenuScaleOperation() {
            this.menuScaleGeneration++;
            this.cancelActiveTween();
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
                    return;
                }
                callback?.();
            };
            if (this.tryAnimateScale(this.menuRoot, new vec3(1, 1, 1), MENU_SHOW_MS, scaleGeneration, finish)) {
                return;
            }
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
                    return;
                }
                this.isMenuVisible = false;
                callback?.();
            };
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
                    .easing(toScale.x > 0 ? Easing_1.default.Back.Out : Easing_1.default.Quadratic.In)
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