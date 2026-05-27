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
exports.SnapCloudRequirements = void 0;
var __selfType = requireType("./SnapCloudRequirements");
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
/** Shared Supabase project asset — CoopNetworkController reads this via getSupabaseProject(). */
let SnapCloudRequirements = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SnapCloudRequirements = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.supabaseProject = this.supabaseProject;
            this.configured = false;
        }
        __initialize() {
            super.__initialize();
            this.supabaseProject = this.supabaseProject;
            this.configured = false;
        }
        onAwake() {
            this.validateConfiguration();
            this.createEvent("OnStartEvent").bind(() => {
                if (this.configured) {
                    this.log("ready — " + (this.supabaseProject?.url ?? "missing url"));
                }
            });
        }
        getSupabaseProject() {
            if (!this.supabaseProject) {
                this.warnMissing();
            }
            return this.supabaseProject;
        }
        isConfigured() {
            return this.configured;
        }
        getSupabaseUrl() {
            return this.supabaseProject?.url ?? "";
        }
        getSupabasePublicToken() {
            return this.supabaseProject?.publicToken ?? "";
        }
        /** Anon/public key headers only — never pass service-role tokens here. */
        getSupabaseHeaders() {
            if (!this.supabaseProject) {
                return {};
            }
            return {
                "Content-Type": "application/json",
                apikey: this.supabaseProject.publicToken,
                Authorization: "Bearer " + this.supabaseProject.publicToken
            };
        }
        getStorageApiUrl() {
            const base = this.getSupabaseUrl().replace(/\/$/, "");
            return base ? base + "/storage/v1/object/public/" : "";
        }
        getRestApiUrl() {
            const base = this.getSupabaseUrl().replace(/\/$/, "");
            return base ? base + "/rest/v1/" : "";
        }
        getFunctionsApiUrl() {
            const base = this.getSupabaseUrl().replace(/\/$/, "");
            return base ? base + "/functions/v1/" : "";
        }
        revalidate() {
            this.validateConfiguration();
        }
        validateConfiguration() {
            this.configured = !!this.supabaseProject;
            if (!this.configured) {
                this.warnMissing();
            }
        }
        warnMissing() {
            print("[SnapCloudRequirements] Assign a SupabaseProject asset in the Inspector.");
        }
        log(message) {
            print("[SnapCloudRequirements] " + message);
        }
    };
    __setFunctionName(_classThis, "SnapCloudRequirements");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SnapCloudRequirements = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SnapCloudRequirements = _classThis;
})();
exports.SnapCloudRequirements = SnapCloudRequirements;
//# sourceMappingURL=SnapCloudRequirements.js.map