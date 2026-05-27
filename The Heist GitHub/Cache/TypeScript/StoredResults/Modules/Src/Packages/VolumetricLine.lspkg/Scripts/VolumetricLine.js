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
exports.VolumetricLine = void 0;
var __selfType = requireType("./VolumetricLine");
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
/**
 * Enhanced 3D Line component with smooth spline interpolation
 * Creates a 3D tube by extruding a circular cross-section along a path defined by scene objects.
 */
let VolumetricLine = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var VolumetricLine = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.pathPoints = this.pathPoints;
            this._radius = this._radius;
            this._circleSegments = this._circleSegments;
            this._interpolationSteps = this._interpolationSteps;
            this._smoothness = this._smoothness;
            this.material = this.material;
            this._color = this._color;
            this.capEnds = this.capEnds;
            this._zOffset = this._zOffset;
            this._useWorldPosition = this._useWorldPosition;
            this._autoCorrectOffset = this._autoCorrectOffset;
            this._useRelativeToComponent = this._useRelativeToComponent;
            this._debugPositions = this._debugPositions;
            // Internal state for position offset detection
            this.detectedOffset = vec3.zero();
            this.offsetCalculated = false;
            this._enabled = true;
        }
        __initialize() {
            super.__initialize();
            this.pathPoints = this.pathPoints;
            this._radius = this._radius;
            this._circleSegments = this._circleSegments;
            this._interpolationSteps = this._interpolationSteps;
            this._smoothness = this._smoothness;
            this.material = this.material;
            this._color = this._color;
            this.capEnds = this.capEnds;
            this._zOffset = this._zOffset;
            this._useWorldPosition = this._useWorldPosition;
            this._autoCorrectOffset = this._autoCorrectOffset;
            this._useRelativeToComponent = this._useRelativeToComponent;
            this._debugPositions = this._debugPositions;
            // Internal state for position offset detection
            this.detectedOffset = vec3.zero();
            this.offsetCalculated = false;
            this._enabled = true;
        }
        // Property getters and setters
        get radius() {
            return this._radius;
        }
        set radius(value) {
            this._radius = value;
            this.updateMesh();
        }
        get circleSegments() {
            return this._circleSegments;
        }
        set circleSegments(value) {
            this._circleSegments = value;
            this.updateMesh();
        }
        get interpolationSteps() {
            return this._interpolationSteps;
        }
        set interpolationSteps(value) {
            this._interpolationSteps = Math.max(1, Math.floor(value));
            this.updateMesh();
        }
        get smoothness() {
            return this._smoothness;
        }
        set smoothness(value) {
            this._smoothness = Math.max(0, Math.min(1, value));
            this.updateMesh();
        }
        get color() {
            return this._color;
        }
        set color(color) {
            this._color = color;
            this.updateMaterial();
        }
        get zOffset() {
            return this._zOffset;
        }
        set zOffset(value) {
            this._zOffset = value;
            this.updateMesh();
        }
        get useWorldPosition() {
            return this._useWorldPosition;
        }
        set useWorldPosition(value) {
            this._useWorldPosition = value;
            this.updateMesh();
        }
        get debugPositions() {
            return this._debugPositions;
        }
        set debugPositions(value) {
            this._debugPositions = value;
            this.updateMesh();
        }
        get useRelativeToComponent() {
            return this._useRelativeToComponent;
        }
        set useRelativeToComponent(value) {
            this._useRelativeToComponent = value;
            this.updateMesh();
        }
        get autoCorrectOffset() {
            return this._autoCorrectOffset;
        }
        set autoCorrectOffset(value) {
            this._autoCorrectOffset = value;
            this.resetOffsetDetection();
        }
        get isEnabled() {
            return this._enabled;
        }
        set isEnabled(isEnabled) {
            this._enabled = isEnabled;
            if (this.meshVisual)
                this.meshVisual.enabled = isEnabled;
        }
        onAwake() {
            this.setupMeshVisual();
            this.generateMesh();
        }
        setupMeshVisual() {
            this.meshVisual = this.sceneObject.createComponent("Component.RenderMeshVisual");
            this.updateMaterial();
        }
        updateMaterial() {
            if (this.meshVisual) {
                if (this.material) {
                    this.meshVisual.mainMaterial = this.material;
                    try {
                        this.material.mainPass.baseColor = new vec4(this._color.x, this._color.y, this._color.z, 1.0);
                        print("Line3D: Material applied successfully with color (" +
                            this._color.x +
                            ", " +
                            this._color.y +
                            ", " +
                            this._color.z +
                            ")");
                    }
                    catch (e) {
                        print("Line3D: Could not update material color - " + e);
                    }
                }
                else {
                    print("Line3D: Warning - No material assigned. Please assign a material in the Inspector.");
                }
            }
        }
        generateMesh() {
            if (!this.pathPoints || this.pathPoints.length < 2) {
                print("Line3D: Need at least 2 path points to generate mesh");
                return;
            }
            this.meshBuilder = new MeshBuilder([
                { name: "position", components: 3 },
                { name: "normal", components: 3 },
                { name: "texture0", components: 2 },
            ]);
            this.meshBuilder.topology = MeshTopology.Triangles;
            this.meshBuilder.indexType = MeshIndexType.UInt16;
            const pathPositions = this.getPathPositions();
            print("Line3D: Generating mesh with " +
                pathPositions.length +
                " interpolated points from " +
                this.pathPoints.length +
                " control points");
            print("Line3D: Using " +
                (this._useWorldPosition ? "WORLD" : "LOCAL") +
                " coordinate space");
            if (this._zOffset !== 0) {
                print("Line3D: Applied Z-axis offset of " +
                    this._zOffset +
                    " to all path points");
            }
            this.generateTubeGeometry(pathPositions);
            if (this.meshBuilder.isValid()) {
                this.generatedMesh = this.meshBuilder.getMesh();
                this.meshVisual.mesh = this.generatedMesh;
                this.meshBuilder.updateMesh();
                this.updateMaterial();
                print("Line3D: Mesh generated successfully with " +
                    this.meshBuilder.getVerticesCount() +
                    " vertices");
            }
            else {
                print("Line3D: Generated mesh data is invalid");
            }
        }
        getPathPositions() {
            if (this._debugPositions) {
                print("Line3D: --- Enhanced Position Debug Info ---");
                print("Line3D: Using " +
                    (this._useWorldPosition ? "WORLD" : "LOCAL") +
                    " positions");
                print("Line3D: Auto-correct offset: " + this._autoCorrectOffset);
                print("Line3D: Use relative to component: " + this._useRelativeToComponent);
                print("Line3D: Manual Z-offset = " + this._zOffset);
            }
            // Get component's transform for relative positioning
            const componentTransform = this.getTransform();
            const componentWorldPos = componentTransform.getWorldPosition();
            const componentWorldRot = componentTransform.getWorldRotation();
            const originalPositions = this.pathPoints.map((point, index) => {
                const transform = point.getTransform();
                let pos = this._useWorldPosition
                    ? transform.getWorldPosition()
                    : transform.getLocalPosition();
                if (this._debugPositions) {
                    const worldPos = transform.getWorldPosition();
                    const localPos = transform.getLocalPosition();
                    print("Line3D: Point " +
                        index +
                        " - World: (" +
                        worldPos.x.toFixed(2) +
                        ", " +
                        worldPos.y.toFixed(2) +
                        ", " +
                        worldPos.z.toFixed(2) +
                        ") Local: (" +
                        localPos.x.toFixed(2) +
                        ", " +
                        localPos.y.toFixed(2) +
                        ", " +
                        localPos.z.toFixed(2) +
                        ")");
                }
                // Apply coordinate space transformation relative to component
                if (this._useRelativeToComponent && this._useWorldPosition) {
                    // Transform to component's local space
                    pos = pos.sub(componentWorldPos);
                    // Apply inverse rotation to align with component's coordinate system
                    const invRotation = componentWorldRot.invert();
                    pos = invRotation.multiplyVec3(pos);
                    if (this._debugPositions) {
                        print("Line3D: Point " +
                            index +
                            " after component transform: (" +
                            pos.x.toFixed(2) +
                            ", " +
                            pos.y.toFixed(2) +
                            ", " +
                            pos.z.toFixed(2) +
                            ")");
                    }
                }
                // Apply manual offset
                pos = new vec3(pos.x, pos.y, pos.z + this._zOffset);
                // Apply automatic offset detection if enabled
                if (this._autoCorrectOffset && !this.offsetCalculated && index === 0) {
                    this.calculateAutomaticOffset(pos);
                }
                return pos.add(this.detectedOffset);
            });
            // Auto-detect offset on first run
            if (this._autoCorrectOffset && !this.offsetCalculated) {
                this.offsetCalculated = true;
                if (this._debugPositions) {
                    print("Line3D: Auto-detected offset: (" +
                        this.detectedOffset.x.toFixed(2) +
                        ", " +
                        this.detectedOffset.y.toFixed(2) +
                        ", " +
                        this.detectedOffset.z.toFixed(2) +
                        ")");
                }
            }
            if (originalPositions.length < 2) {
                return originalPositions;
            }
            if (originalPositions.length === 2 || this._interpolationSteps <= 1) {
                return originalPositions;
            }
            return this.generateSmoothSpline(originalPositions);
        }
        calculateAutomaticOffset(firstPosition) {
            // When using world positions with relative-to-component transformation,
            // we usually don't need automatic offset correction as the coordinate transformation
            // already handles proper positioning
            if (this._useWorldPosition && this._useRelativeToComponent) {
                this.detectedOffset = vec3.zero();
                if (this._debugPositions) {
                    print("Line3D: Auto-offset disabled when using world positions with component transformation");
                }
                return;
            }
            // For other cases, we can still attempt automatic offset detection
            const componentPos = this.getTransform().getWorldPosition();
            // Calculate potential offset based on the difference between first path point and component position
            const potentialOffset = componentPos.sub(firstPosition);
            // Apply more conservative heuristics to determine if this offset makes sense
            const offsetMagnitude = potentialOffset.length;
            // Be more restrictive about when to apply automatic offsets
            // Only apply if the offset is significant but not too large, and only use a small fraction
            if (offsetMagnitude > 50.0 && offsetMagnitude < 500.0) {
                // Use a much smaller fraction (2% instead of 10%) to avoid overcorrection
                this.detectedOffset = potentialOffset.uniformScale(0.02);
                if (this._debugPositions) {
                    print("Line3D: Auto-offset detected - Component: (" +
                        componentPos.x.toFixed(2) +
                        ", " +
                        componentPos.y.toFixed(2) +
                        ", " +
                        componentPos.z.toFixed(2) +
                        ") First point: (" +
                        firstPosition.x.toFixed(2) +
                        ", " +
                        firstPosition.y.toFixed(2) +
                        ", " +
                        firstPosition.z.toFixed(2) +
                        ") Applying conservative offset: (" +
                        this.detectedOffset.x.toFixed(2) +
                        ", " +
                        this.detectedOffset.y.toFixed(2) +
                        ", " +
                        this.detectedOffset.z.toFixed(2) +
                        ")");
                }
            }
            else {
                this.detectedOffset = vec3.zero();
                if (this._debugPositions) {
                    print("Line3D: Auto-offset calculation - offset magnitude (" +
                        offsetMagnitude.toFixed(2) +
                        ") outside acceptable range (50-500), using zero offset");
                }
            }
        }
        generateSmoothSpline(controlPoints) {
            const interpolatedPoints = [];
            interpolatedPoints.push(controlPoints[0]);
            for (let i = 0; i < controlPoints.length - 1; i++) {
                const p0 = i > 0 ? controlPoints[i - 1] : controlPoints[i];
                const p1 = controlPoints[i];
                const p2 = controlPoints[i + 1];
                const p3 = i < controlPoints.length - 2
                    ? controlPoints[i + 2]
                    : controlPoints[i + 1];
                for (let step = 1; step <= this._interpolationSteps; step++) {
                    const t = step / this._interpolationSteps;
                    const interpolatedPoint = this.catmullRomSpline(p0, p1, p2, p3, t, this._smoothness);
                    interpolatedPoints.push(interpolatedPoint);
                }
            }
            print("Line3D: Generated " +
                interpolatedPoints.length +
                " interpolated points from " +
                controlPoints.length +
                " control points");
            return interpolatedPoints;
        }
        catmullRomSpline(p0, p1, p2, p3, t, tension) {
            const t2 = t * t;
            const t3 = t2 * t;
            const tensionFactor = tension * 0.5;
            const v0 = p2.sub(p0).uniformScale(tensionFactor);
            const v1 = p3.sub(p1).uniformScale(tensionFactor);
            const a = p1.uniformScale(2).sub(p2.uniformScale(2)).add(v0).add(v1);
            const b = p2
                .uniformScale(3)
                .sub(p1.uniformScale(3))
                .sub(v0.uniformScale(2))
                .sub(v1);
            const c = v0;
            const d = p1;
            return a
                .uniformScale(t3)
                .add(b.uniformScale(t2))
                .add(c.uniformScale(t))
                .add(d);
        }
        generateTubeGeometry(pathPositions) {
            const pathLength = pathPositions.length;
            for (let i = 0; i < pathLength; i++) {
                const position = pathPositions[i];
                let forward;
                if (i === 0) {
                    forward = pathPositions[1].sub(pathPositions[0]).normalize();
                }
                else if (i === pathLength - 1) {
                    forward = pathPositions[i].sub(pathPositions[i - 1]).normalize();
                }
                else {
                    forward = pathPositions[i + 1].sub(pathPositions[i - 1]).normalize();
                }
                const worldUp = vec3.up();
                const worldRight = vec3.right();
                let right;
                let actualUp;
                const forwardDotUp = Math.abs(forward.dot(worldUp));
                if (forwardDotUp > 0.99) {
                    right = worldRight;
                    actualUp = forward.cross(right).normalize();
                }
                else {
                    right = forward.cross(worldUp).normalize();
                    actualUp = right.cross(forward).normalize();
                }
                this.generateCircleVertices(position, right, actualUp, i / (pathLength - 1));
            }
            this.generateTubeIndices(pathLength);
            if (this.capEnds) {
                this.generateEndCaps(pathPositions);
            }
        }
        generateCircleVertices(center, right, up, vCoord) {
            for (let i = 0; i < this._circleSegments; i++) {
                const angle = (i / this._circleSegments) * Math.PI * 2;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const localPos = right
                    .uniformScale(cos * this._radius)
                    .add(up.uniformScale(sin * this._radius));
                const worldPos = center.add(localPos);
                const normal = localPos.normalize();
                const uCoord = i / this._circleSegments;
                this.meshBuilder.appendVerticesInterleaved([
                    worldPos.x,
                    worldPos.y,
                    worldPos.z,
                    normal.x,
                    normal.y,
                    normal.z,
                    uCoord,
                    vCoord,
                ]);
            }
        }
        generateTubeIndices(pathLength) {
            for (let segment = 0; segment < pathLength - 1; segment++) {
                for (let i = 0; i < this._circleSegments; i++) {
                    const current = segment * this._circleSegments + i;
                    const next = segment * this._circleSegments + ((i + 1) % this._circleSegments);
                    const currentNext = (segment + 1) * this._circleSegments + i;
                    const nextNext = (segment + 1) * this._circleSegments +
                        ((i + 1) % this._circleSegments);
                    this.meshBuilder.appendIndices([
                        current,
                        currentNext,
                        next,
                        next,
                        currentNext,
                        nextNext,
                    ]);
                }
            }
        }
        generateEndCaps(pathPositions) {
            const pathLength = pathPositions.length;
            const startVertexOffset = pathLength * this._circleSegments;
            // Start cap
            const startPos = pathPositions[0];
            const startForward = pathPositions[1].sub(pathPositions[0]).normalize();
            this.meshBuilder.appendVerticesInterleaved([
                startPos.x,
                startPos.y,
                startPos.z,
                -startForward.x,
                -startForward.y,
                -startForward.z,
                0.5,
                0.5,
            ]);
            for (let i = 0; i < this._circleSegments; i++) {
                const current = i;
                const next = (i + 1) % this._circleSegments;
                this.meshBuilder.appendIndices([startVertexOffset, next, current]);
            }
            // End cap
            const endPos = pathPositions[pathLength - 1];
            const endForward = pathPositions[pathLength - 1]
                .sub(pathPositions[pathLength - 2])
                .normalize();
            this.meshBuilder.appendVerticesInterleaved([
                endPos.x,
                endPos.y,
                endPos.z,
                endForward.x,
                endForward.y,
                endForward.z,
                0.5,
                0.5,
            ]);
            const endCenterIndex = startVertexOffset + 1;
            const endCapOffset = (pathLength - 1) * this._circleSegments;
            for (let i = 0; i < this._circleSegments; i++) {
                const current = endCapOffset + i;
                const next = endCapOffset + ((i + 1) % this._circleSegments);
                this.meshBuilder.appendIndices([endCenterIndex, current, next]);
            }
        }
        updateMesh() {
            if (this.meshVisual && this.pathPoints && this.pathPoints.length >= 2) {
                this.generateMesh();
            }
        }
        refreshPath() {
            this.updateMesh();
        }
        forceRefresh() {
            print("Line3D: Force refreshing mesh...");
            this.generateMesh();
        }
        setTestPositions() {
            const testPositions = [
                new vec3(0, 0, 0), // Start
                new vec3(40, 20, -30), // Curve up and right
                new vec3(10, 60, -80), // Curve left and up
                new vec3(-30, 30, -120), // Curve left and down
                new vec3(20, 10, -160), // End right and down
            ];
            print("Line3D: Setting spline test positions for smooth curve visualization");
            print("Line3D: Interpolation steps = " +
                this._interpolationSteps +
                ", Smoothness = " +
                this._smoothness);
            for (let i = 0; i < testPositions.length; i++) {
                print("Line3D: Control point " +
                    i +
                    ": (" +
                    testPositions[i].x +
                    ", " +
                    testPositions[i].y +
                    ", " +
                    testPositions[i].z +
                    ")");
            }
            if (this.pathPoints.length < testPositions.length) {
                print("Line3D Warning: Not enough pathPoints (" +
                    this.pathPoints.length +
                    ") for all test positions (" +
                    testPositions.length +
                    "). Consider adding more cubes.");
            }
            for (let i = 0; i < Math.min(this.pathPoints.length, testPositions.length); i++) {
                if (this.pathPoints[i] && this.pathPoints[i].getTransform()) {
                    this.pathPoints[i].getTransform().setWorldPosition(testPositions[i]);
                }
            }
            this.updateMesh();
        }
        // Enhanced debugging and diagnostic methods
        resetOffsetDetection() {
            this.offsetCalculated = false;
            this.detectedOffset = vec3.zero();
            print("Line3D: Offset detection reset. Will recalculate on next mesh generation.");
            this.updateMesh();
        }
        testPositionModes() {
            print("Line3D: === Testing Different Position Modes ===");
            // Test world positions
            print("Line3D: Testing WORLD positions...");
            this._useWorldPosition = true;
            this._useRelativeToComponent = false;
            this.resetOffsetDetection();
            // Test local positions
            print("Line3D: Testing LOCAL positions...");
            this._useWorldPosition = false;
            this._useRelativeToComponent = false;
            this.resetOffsetDetection();
            // Test world positions with component relative
            print("Line3D: Testing WORLD positions with component transformation...");
            this._useWorldPosition = true;
            this._useRelativeToComponent = true;
            this.resetOffsetDetection();
        }
        setManualOffset(offset) {
            this.detectedOffset = offset;
            this.offsetCalculated = true;
            print("Line3D: Manual offset set to (" +
                offset.x +
                ", " +
                offset.y +
                ", " +
                offset.z +
                ")");
            this.updateMesh();
        }
        getPositionDiagnostics() {
            let diagnostics = "Line3D Position Diagnostics:\n";
            diagnostics += "- Use World Position: " + this._useWorldPosition + "\n";
            diagnostics +=
                "- Use Relative to Component: " + this._useRelativeToComponent + "\n";
            diagnostics += "- Auto Correct Offset: " + this._autoCorrectOffset + "\n";
            diagnostics += "- Manual Z Offset: " + this._zOffset + "\n";
            diagnostics +=
                "- Detected Offset: (" +
                    this.detectedOffset.x.toFixed(2) +
                    ", " +
                    this.detectedOffset.y.toFixed(2) +
                    ", " +
                    this.detectedOffset.z.toFixed(2) +
                    ")\n";
            diagnostics += "- Offset Calculated: " + this.offsetCalculated + "\n";
            if (this.pathPoints && this.pathPoints.length > 0) {
                diagnostics +=
                    "- Number of Path Points: " + this.pathPoints.length + "\n";
                const firstPoint = this.pathPoints[0].getTransform();
                const worldPos = firstPoint.getWorldPosition();
                const localPos = firstPoint.getLocalPosition();
                diagnostics +=
                    "- First Point World: (" +
                        worldPos.x.toFixed(2) +
                        ", " +
                        worldPos.y.toFixed(2) +
                        ", " +
                        worldPos.z.toFixed(2) +
                        ")\n";
                diagnostics +=
                    "- First Point Local: (" +
                        localPos.x.toFixed(2) +
                        ", " +
                        localPos.y.toFixed(2) +
                        ", " +
                        localPos.z.toFixed(2) +
                        ")\n";
            }
            return diagnostics;
        }
    };
    __setFunctionName(_classThis, "VolumetricLine");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VolumetricLine = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VolumetricLine = _classThis;
})();
exports.VolumetricLine = VolumetricLine;
//# sourceMappingURL=VolumetricLine.js.map