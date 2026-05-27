// -----JS CODE-----
// Chain.js
// Version 2.0
// Event: Lens Initialized
// Description : This script is used to setup physics on rigged objects that are connected as a chain
// Each joint in the rigged object will get a physics body component and a constraint connecting it to the previous joint.

// @ui {"widget": "group_start", "label": "Joint Reference"}

// @input bool useHierarchy = true {"hint" : "automatically build chain from first joint hierarchy - first child from each Scene Object in hierarchy"}
// @input SceneObject chainBase {"hint" : "the first joint in the joints hierarchy" , "showIf":"useHierarchy", "showIfValue": "true"}
// @input SceneObject[] joints {"hint" : "the joints that make up the chain" , "showIf":"useHierarchy", "showIfValue": "false"}

// @ui {"widget": "group_end"}

// @ui {"widget":"label", "label" : " "}
// @ui {"widget": "group_start", "label": "Chain Shape"}

// @input float shapeRadius = 0.2 {"hint" : "the radius of each joint in the chain"}
// @input float cylinderLength = 1.0 {"hint" : "the length of each joint in the chain"}
// @input float HingeOffset = 1.4  { "hint" : "the actual position of the constraint, 0 being the middle of each joint, 1 at the edge, higher value will place the constraint above the chain collider" }
// @input string constraintType = "Point" {"widget":"combobox", "values":[ {"label":"Point", "value":"Point"}, {"label":"Hinge", "value":"Hinge"}], "hint" : "will effect the degrees of freedom in which the joints in the chain can move"}

// @ui {"widget": "group_end"}

// @ui {"widget":"label", "label" : " "}
// @ui {"widget": "group_start", "label": "Chain Mass"}

// @input string massSetting = "Weight" {"widget":"combobox", "values":[ {"label":"Weight", "value":"Weight"}, {"label":"Density", "value":"Density"}], "hint" : "determine the asset weight by its absolute weight or density, if selecting density, the weight will be affected by the physics shape"}

// @input float baseWeight = 1.0 {"showIf":"massSetting", "showIfValue": "Weight", "hint" : "the weight in kg of the first joint in the chain" }
// @input float tipWeight = 0.2 {"showIf":"massSetting", "showIfValue": "Weight", "hint" : "the weight in kg of the last joint in the chain" }
// @input float baseDensity = 1.0 {"showIf":"massSetting", "showIfValue": "Density", "hint" : "the density in kg/l of the first joint in the chain - the weight is calculated by density * shape" }
// @input float tipDensity = 0.2 {"showIf":"massSetting", "showIfValue": "Density", "hint" : "the density in kg/l of the last joint in the chain - the weight is calculated by density * shape" }

// @ui {"widget": "group_end"}

// @ui {"widget":"label", "label" : " "}
// @ui {"widget": "group_start", "label": "Advanced Setup"}

// @input float damping = 0.04 {"widget":"slider","min" : 0.0 , "max" : 1.0, "step": 0.01,  "hint" : "the amount the chain slows down over time"}
// @input float angDamping = 0.04 {"widget":"slider","min" : 0.0 , "max" : 1.0, "step": 0.01, "hint" : "the amount the chain slows down over time in regards to angular speed"}
// @input Physics.Matter physicsMatter { "hint" : "physics matter object that further determines physical behavior of the chain" }
// @input bool anchorBothEnds = true; {"hint" : "set this if the chain is pinned on both ends. "}
// @input string endConstraintType = "Point" {"widget":"combobox","showIf":"anchorBothEnds", "showIfValue": "true", "values":[ {"label":"Point", "value":"Point"},{"label":"Hinge", "value":"Hinge"}, {"label":"Fixed", "value":"Fixed"}], "hint" : "will effect the degrees of freedom in which the end constraint in the chain can move"}
// @input bool intangible = false {"hint" : "set true if chain should be intangible"}
// @input bool customCamera = false
// @input Component.Camera camera {"showIf":"customCamera", "hint" : "camera which will render the chain, use this field if the chain is not under a camera hierarchy already"}
// @ui {"widget": "group_end"}

// @ui {"widget":"label", "label" : " "}
// @ui {"widget": "group_start", "label": "Debug"}

// @input bool showConstraints = false  { "hint" : "show the constraint points between the chain joints" }
// @input bool showColliders = false { "hint" : "show the chain colliders" }


// @ui {"widget": "group_end"}

global.chainLayer; //global layer for chains that will not interact with other chains and itself
var segmentCount = -1;
var initialized = false;
var count = 0;
var constraintMethod = script.constraintType == "Point" ? Physics.ConstraintType.Point : Physics.ConstraintType.Hinge ;
var joints = [];
var baseConnector; //intangible physics body that will connect to the chain anchor 
var nonMovingSO; 
var chainBase;
var baseMass;
var tipMass;
var disableEvent;
var enableEvent;
var updateEvent;
var baseAnchorSceneObject;
var endConstraintType; 

const BASE_ANCHOR_RADIUS = 0.5;
const CYLINDER_AXIS = 1;
const ANCHOR = "Joints Anchor";

function initialize() {
    if (initialized) {
        return;      
    }
    if (script.useHierarchy && !script.chainBase) {
        print("Warning : if not using API, must include the first joint in the chain. Try to set using setChain(joints)");
        return;
    }
    if (!script.useHierarchy && !(script.joints && script.joints.length > 1)) {
        print("Error : not enough joints specified. Try to set using setChain(joints)");
        return;
    }
    if (script.massSetting == "Weight") {
        baseMass = script.baseWeight;
        tipMass = script.tipWeight;
    } else {
        baseMass = script.baseDensity;
        tipMass = script.tipDensity;
    }
    //joints references
    if (!script.useHierarchy) {
        joints = script.joints;
        chainBase = joints[0];
    } else {
        chainBase = script.chainBase;
        findBones();
    }
    if (script.chainBase.getParent() == null) {
        print("Error : chain base joint should have a parent Scene Object");
        return;
    }
    setEndConstraint();
    addBaseAnchor(); //non dynamic physics body to act as chain anchor
    if (!global.chainLayer) { //set new layer for chain, set physics so chain won't collide with itself
        global.chainLayer = LayerSet.makeUnique();
        var settings = Physics.WorldSettingsAsset.create();
        settings.setLayersCollidable(parseInt(global.chainLayer), parseInt(global.chainLayer), false);
        var lightSources = findObjectsWithType("Component.LightSource");
        for (var i=0;i<lightSources.length;i++) {
            lightSources[i].renderLayer = lightSources[i].renderLayer.union(global.chainLayer);
        }
    }
    var camera = getComponentInParentRecursive(chainBase, "Camera");
    if (camera == null) {
        if (script.camera !=null) {
            camera = script.camera;
        } else {
            print("Error : Chain objects should be under a camera, alternatively, reference the relevant camera under the Chain Advanced Setup ");
            return; 
        }
    }
    camera.renderLayer = camera.renderLayer.union(global.chainLayer);	
    
    initialized = true;
    disableEvent = script.createEvent("OnDisableEvent");
    disableEvent.bind(disable);
    enableEvent = script.createEvent("OnEnableEvent");
    enableEvent.bind(enable);
    updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(update);
}

var event = script.createEvent("UpdateEvent");
event.bind(function(eventData) {   
    if (!initialized) {
        return;
    }   
    if (count===1) {
        createChain();
        event.enabled = false;
        return;
    }
    nonMovingSO = global.scene.createSceneObject(ANCHOR);
    count++;   
});



function disable() {
    setJoints(false);
}

function enable() {
    setJoints(true);
}

/**
 * check if state of first joint is the same as the anchor - we seperate them in the hierarchy and need to make sure they're consistent in state
 */
function update() {
    if (chainBase.enabled != baseAnchorSceneObject.isEnabledInHiearchy) { 
        setJoints(baseAnchorSceneObject.isEnabledInHiearchy);
    }
}

function setJoints(state) {
    for (var i=0; i<joints.length; i++) {
        joints[i].enabled = state;
    }
}

/**
 * creates a chain from list of joints
 */
function createChain() {
    segmentCount = joints.length;        
    for (var i=0; i < segmentCount; i++) {
        var j0 = joints[i];
        var targetBody = (i==0 ? baseConnector : joints[i-1].getFirstComponent("Physics.BodyComponent"));
        var hPerc = segmentCount-1 === 0 ? 0 : i / segmentCount; //mass is lineary calculated along the chain
        var density = baseMass - hPerc*(baseMass - tipMass);
        var constraint = ((i==0 && segmentCount > 2)? endConstraintType : constraintMethod);
        addLink(j0, targetBody, density, constraint, i);
    }
    if (script.anchorBothEnds) {
        constrainEnd();
    }
}

/**
 * Adds non dynamic physics body to the parent of the first joint
 */
function addBaseAnchor() {
    baseAnchorSceneObject = script.chainBase.getParent();
    var body = baseAnchorSceneObject.createComponent("Physics.BodyComponent");
    body.intangible = true;
    body.dynamic = false;
    body.shape = Shape.createSphereShape();
    body.shape.radius = BASE_ANCHOR_RADIUS;
    baseConnector = baseAnchorSceneObject.getComponent("Physics.ColliderComponent");
}

/**
 * Creates a list of joints from a given joint base, the list is created on a parent-child basis, taking the first child as the joint
 */
function findBones() {
    joints.push(script.chainBase);
    if (script.chainBase.getChildrenCount() > 0) { //check if there are multiple joints
        var joint = script.chainBase.getChild(0);
        while (joint.getChildrenCount() > 0) { //keep on going through the hierarchy 
            joints.push(joint);
            joint = joint.getChild(0);
        }
        joints.push(joint);  
    }
}

/**
 * Adds a physics body component and a constraint to create a part of a chain
 * @param {*} j0 joint to work with
 * @param {*} targetBody constraint target
 * @param {*} density joint mass value
 * @param {*} constraintTypeOf type of constraint
 * @param {*} index joint's index in the chain
 */
function addLink(j0, targetBody,density, constraintTypeOf, index) {
    var isIntangible = ((index == 0 && joints.length > 1) || (index == joints.length-1 && script.anchorBothEnds) || script.intangible);
    j0.setParentPreserveWorldTransform(nonMovingSO);
    var body = j0.createComponent("Physics.BodyComponent");
    j0.layer = global.chainLayer;
    var HingeOffsetY = 0;
    body.shape = Shape.createCylinderShape();
    body.shape.axis = CYLINDER_AXIS;
    body.shape.length = script.cylinderLength;
    body.shape.radius = script.shapeRadius;
    HingeOffsetY = script.cylinderLength * script.HingeOffset;
    body.density = density;
    body.intangible = isIntangible;
    body.dynamic = true;
    body.debugDrawEnabled = script.showColliders;
    body.damping = script.damping;
    body.angularDamping = script.angDamping;         
    var constraintObject = global.scene.createSceneObject("Constraint");    
    constraintObject.setParent(j0);
    constraintObject.layer = j0.layer;
    var currentPos = constraintObject.getTransform().getLocalPosition();
    constraintObject.getTransform().setLocalPosition(new vec3(currentPos.x,currentPos.y - HingeOffsetY, currentPos.z));    
    var constraint = constraintObject.createComponent("Physics.ConstraintComponent");
    constraint.debugDrawEnabled = script.showConstraints;
    constraint.constraint = Physics.Constraint.create(constraintTypeOf);
    constraint.target = targetBody;
    if (script.physicsMatter) {
        body.matter = script.physicsMatter;
    }
}

/**
 * set the last joint in the chain as fixed non dynamic object
 */
function constrainEnd() {
    var lastJoint = joints[joints.length-1];
    var lastJointPos = lastJoint.getTransform().getWorldPosition();
    var endPointObj = global.scene.createSceneObject("End Anchor");
    endPointObj.getTransform().setWorldPosition(lastJointPos);
    endPointObj.setParent(baseAnchorSceneObject);
    var body = endPointObj.createComponent("Physics.BodyComponent");
    body.intangible = true;
    body.dynamic = false;
    body.shape = Shape.createSphereShape();
    var physicsConstraint = lastJoint.createComponent("Physics.ConstraintComponent");
    physicsConstraint.constraint = Physics.Constraint.create(endConstraintType);
    physicsConstraint.target = body;
}

// Helper Functions
/**
 * returns a list of objects of type 'objectType'
 * @param {*} objectType type of object to search in scene
 * @returns 
 */
function findObjectsWithType(objectType) {
    var rootObjectCount = global.scene.getRootObjectsCount();
    var obj;
    var components = [];
    for (var i=0; i< rootObjectCount; i++) {
        obj = global.scene.getRootObject(i);
        var foundComponents = getComponentsRecursive(obj, objectType);
        if (foundComponents.length>0) {
            for (var k = 0;k<foundComponents.length;k++) {
                components.push(foundComponents[k]);
            }
        }
    }
    if (components.length<1) {
        print("No Components of type "+objectType+" found.");
    }
    return components;
}

// From SceneObjectHelper - copied since it creates collision with other CC. To remove once resolved
/**
* Returns a list of all Components of `componentType` found in the object and its children.
* @template {keyof ComponentNameMap} T
* @param {SceneObject} object Object to search
* @param {T} componentType Component type name to search for
* @param {ComponentNameMap[componentType][]=} results Optional list to store results in
* @returns {ComponentNameMap[componentType][]} Matching Components in `object` and children
*/
function getComponentsRecursive(object, componentType, results) {
    results = results || [];
    var components = object.getComponents(componentType);
    for (var i=0; i<components.length; i++) {
        results.push(components[i]);
    }
    var childCount = object.getChildrenCount();
    for (var j=0; j<childCount; j++) {
        getComponentsRecursive(object.getChild(j), componentType, results);
    }
    return results;
}

// From SceneObjectHelper - copied since it creates collision with other CC. To remove once resolved
/**
* Returns the first Component of `componentType` found in the object or its parents.
* @template {keyof ComponentNameMap} T
* @param {SceneObject} object Object to search
* @param {T} componentType Component type name to search for
* @returns {ComponentNameMap[componentType]} Matching Component in `object` and its parents
*/
function getComponentInParentRecursive(object, componentType) {
    var component = object.getComponent(componentType);
    if (component) {
        return component;
    }
    if (object.hasParent()) {
        return getComponentInParentRecursive(object.getParent(), componentType);
    }
    return null;
}

function setEndConstraint() {
    if (script.endConstraintType === "Fixed") {
        script.endConstraintType = Physics.ConstraintType.Fixed;
    } else if (script.endConstraintType === "Hinge") {
        script.endConstraintType = Physics.ConstraintType.Hinge;
    } else {
        script.endConstraintType = Physics.ConstraintType.Point;
    }
    endConstraintType = script.endConstraintType;
}

//API

/**
 * Will make a chain from a given list of joints, can be called only if the chain wasn't created yet.
 * @param {*} newJoints list of joints to create chain from
 * @param {*} isConstrained should this chain be double ended or not.
 * @returns 
 */
script.setChain = function(newJoints,isConstrained) {
    if (script.joints && script.joints.length > 0) {
        print("Error setting chain, conflict with existing joints, make sure no joints are referenced before calling setChain");
        return;
    }
    script.anchorBothEnds = isConstrained;
    setEndConstraint();
    script.useHierarchy = newJoints.length == 1 ? true : false;
    script.joints = newJoints;
    joints = newJoints;
    script.chainBase = script.joints[0];
    initialize();
};

/**
 * 
 * @returns list of joints in current chain
 */
script.getJoints = function() {
    return joints;
};

initialize();




