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
/** Main-menu tab index for Settings (MainMenuTabination tab 3 → print "3"). */
const SETTINGS_TAB_INDEX = 2;
/**
 * Owns menu visibility, stepped navigation (main → tips → room), and pop animations.
 * GameFlowController calls the request_* / hideForGameplay APIs; buttons stay on scene callbacks.
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
            this.mainMenuTabination = this.mainMenuTabination;
            this.menuRoot = this.menuRoot;
            this.menuYOffsetFromCameraCm = this.menuYOffsetFromCameraCm;
            this.menuBackground = this.menuBackground;
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
            this.isMenuVisible = false;
            this.currentScreen = "main";
            this.pendingSafeType = null;
            this.isTransitioning = false;
            this.transitionToken = 0;
            this.menuRevealInProgress = false;
            this.settingsTabSelectedHandler = null;
        }
        __initialize() {
            super.__initialize();
            this.mainMenuTabination = this.mainMenuTabination;
            this.menuRoot = this.menuRoot;
            this.menuYOffsetFromCameraCm = this.menuYOffsetFromCameraCm;
            this.menuBackground = this.menuBackground;
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
            this.isMenuVisible = false;
            this.currentScreen = "main";
            this.pendingSafeType = null;
            this.isTransitioning = false;
            this.transitionToken = 0;
            this.menuRevealInProgress = false;
            this.settingsTabSelectedHandler = null;
        }
        /** Called when the user selects the settings tab (not the legacy openSettings overlay). */
        setSettingsTabSelectedHandler(handler) {
            this.settingsTabSelectedHandler = handler;
        }
        onAwake() {
            this.cacheAllViewElements();
            this.hideAllScreensImmediate();
            this.hidePostGameOverlaysImmediate();
            this.prepareMenuHidden();
            this.createEvent("LateUpdateEvent").bind(() => this.maintainMenuHeightRelativeToCamera());
            this.mainMenuTabination?.setTabChangedListener((tabIndex) => {
                if (this.currentScreen === "main") {
                    this.updateMenuBackgroundForTab(tabIndex);
                }
                if (tabIndex === SETTINGS_TAB_INDEX) {
                    this.ensureSettingsTabVisible();
                    this.settingsTabSelectedHandler?.();
                }
            });
        }
        /** Lens open or return to main: pop transition; scale menuRoot only when it was hidden. */
        showMainMenu(callback) {
            this.pendingSafeType = null;
            this.hidePostGameOverlaysImmediate();
            if (!this.isMenuVisible) {
                this.menuRevealInProgress = false;
                this.restoreMainMenuFromHidden(callback);
                return;
            }
            if (this.menuRevealInProgress) {
                callback?.();
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
            this.transitions.stopAll();
            this.isTransitioning = false;
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
                    const tabIndex = this.mainMenuTabination?.getSelectedIndex() ?? 0;
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
                const shellElements = this.resolveElements(toView);
                let childElements = shellElements;
                if (target === "main") {
                    const tabElements = this.mainMenuTabination?.getTabElements() ?? [];
                    childElements = this.uniqueElements([...shellElements, ...tabElements]);
                }
                this.transitions.prepareElementsForPopIn([toView.root, ...childElements]);
                this.transitions.popInRootThenElements(toView.root, childElements, finish);
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
                const tabElements = this.mainMenuTabination?.getTabElements() ?? [];
                elements = this.uniqueElements([...elements, ...tabElements]);
            }
            if (forTransitionOut && view?.root) {
                elements = this.uniqueElements([...elements, view.root]);
            }
            return elements;
        }
        /** Root leads pop-in so shell/background appears before child elements. */
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
                if (screen === "main") {
                    all.push(...this.getMainMenuChildPopElements());
                }
                else {
                    all.push(...this.getScreenElements(screen));
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
            // settingsView is main-menu tab content; MainMenuTabination + ensureSettingsTabVisible own visibility
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
            this.menuRevealInProgress = true;
            this.isTransitioning = false;
            this.transitions.stopAll();
            this.currentScreen = "main";
            this.applyScreenRoots("main");
            this.restoreMainMenuShell();
            this.maintainMenuHeightRelativeToCamera();
            const mainRoot = this.mainMenuView?.root;
            const childElements = this.getMainMenuChildPopElements();
            const afterPop = () => {
                this.menuRevealInProgress = false;
                const tabIndex = this.mainMenuTabination?.getSelectedIndex() ?? 0;
                if (tabIndex >= 0) {
                    this.updateMenuBackgroundForTab(tabIndex);
                }
                callback?.();
            };
            let showDone = false;
            let contentPopDone = childElements.length === 0 && !mainRoot;
            const tryFinishReveal = () => {
                if (showDone && contentPopDone) {
                    afterPop();
                }
            };
            const startContentPop = () => {
                if (!mainRoot && childElements.length === 0) {
                    contentPopDone = true;
                    tryFinishReveal();
                    return;
                }
                this.transitions.prepareElementsForPopIn(childElements);
                this.transitions.popInRootThenElements(mainRoot, childElements, () => {
                    contentPopDone = true;
                    tryFinishReveal();
                });
            };
            if (this.menuRoot) {
                this.menuRoot.enabled = true;
                this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1));
            }
            this.isMenuVisible = true;
            if (global.appState) {
                global.appState.currentState = "mainMenu";
            }
            startContentPop();
            showDone = true;
            tryFinishReveal();
        }
        /** Main menu content + tabs (not the UI/menuRoot shell — that uses show()). */
        getMainMenuChildPopElements() {
            const view = this.mainMenuView;
            if (!view) {
                return [];
            }
            const tabElements = this.mainMenuTabination?.getTabElements() ?? [];
            const assigned = this.resolveElements(view);
            const backdrops = this.collectMainMenuBackdropElements(view.root, assigned);
            return this.uniqueElements([...backdrops, ...assigned, ...tabElements]);
        }
        /** Cover/background panels live on Main Menu root but are not always in `elements`. */
        collectMainMenuBackdropElements(root, assigned) {
            if (!root) {
                return [];
            }
            const coverPattern = /cover|background|backdrop/i;
            const assignedSet = new Set(assigned);
            const result = [];
            const childCount = root.getChildrenCount();
            for (let i = 0; i < childCount; i++) {
                const child = root.getChild(i);
                if (child && coverPattern.test(child.name) && !assignedSet.has(child)) {
                    result.push(child);
                }
            }
            return result;
        }
        restoreMainMenuShell() {
            const mainRoot = this.mainMenuView?.root;
            if (mainRoot) {
                mainRoot.enabled = true;
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
        show(callback) {
            if (!this.menuRoot) {
                print("[MenuController] show() skipped — menuRoot not assigned");
                callback?.();
                return;
            }
            this.cancelActiveTween();
            this.menuRoot.enabled = true;
            this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0));
            this.isMenuVisible = true;
            this.maintainMenuHeightRelativeToCamera();
            if (global.appState) {
                global.appState.currentState = "mainMenu";
            }
            if (this.tryAnimateScale(this.menuRoot, new vec3(1, 1, 1), MENU_SHOW_MS, callback)) {
                return;
            }
            this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1));
            callback?.();
        }
        hide(callback) {
            if (!this.menuRoot) {
                callback?.();
                return;
            }
            this.cancelActiveTween();
            if (this.tryAnimateScale(this.menuRoot, new vec3(0, 0, 0), MENU_HIDE_MS, () => {
                this.isMenuVisible = false;
                callback?.();
            })) {
                return;
            }
            this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0));
            this.isMenuVisible = false;
            callback?.();
        }
        prepareMenuHidden() {
            if (!this.menuRoot) {
                return;
            }
            this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0));
            this.menuRoot.enabled = false;
        }
        tryAnimateScale(target, toScale, durationMs, onComplete) {
            const durationSec = durationMs / 1000;
            if (global.utils && typeof global.utils.animateScale === "function") {
                global.utils.animateScale(target, true, toScale, durationSec, () => {
                    onComplete?.();
                });
                return true;
            }
            try {
                this.activeTween = LSTween_1.LSTween.scaleToLocal(target.getTransform(), toScale, durationMs)
                    .easing(toScale.x > 0 ? Easing_1.default.Back.Out : Easing_1.default.Quadratic.In)
                    .onComplete(() => {
                    this.activeTween = null;
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
    };
    __setFunctionName(_classThis, "MenuController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MenuController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MenuController = _classThis;
})();
exports.MenuController = MenuController;
//# sourceMappingURL=MenuController.js.map