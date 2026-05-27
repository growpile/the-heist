// -----JS CODE----- 

//@input Asset.Material Material_Simulate
//@input Asset.Material Material_Feedback
//@input Asset.Material Material_Render

//-------------------------------------------------------------------------------

var createRenderTarget = function()
{
	//var renderTarget = assetSystem.createAsset( 'Texture' );
	//renderTarget.control = scene.createResourceProvider( 'RenderTargetProvider' );
	
	var renderTarget = global.scene.createRenderTargetTexture();
	renderTarget.control.useScreenResolution = false;
	renderTarget.control.resolution = new vec2( 680.0, 1.0 );
	renderTarget.control.clearColorEnabled = true;
	renderTarget.control.clearDepthEnabled = false;
	renderTarget.control.fxaa = false;
	renderTarget.control.msaa = false;
	
	//if ( global.deviceInfoSystem.getTargetOS() != "macos" && global.deviceInfoSystem.getTargetOS() != "win" )
	//	renderTarget.control.textureFormat = TextureFormat.R16G16B16A16_UINT;
	
	return renderTarget;
};


//-------------------------------------------------------------------------------


function checkOrAddColorRenderTarget( colorRenderTargetsArray, colorAttachmentIndex )
{
	if ( colorAttachmentIndex >= colorRenderTargetsArray.length )
	{
		for ( var i = colorRenderTargetsArray.length; i <= colorAttachmentIndex; i++ )
		{
			colorRenderTargetsArray.push( Camera.createColorRenderTarget() );
		}
	}
}


//-------------------------------------------------------------------------------


function setupCamera( camera, layer, renderTargetArray, renderOrder )
{
	camera.enableClearColor = true;
	camera.renderLayer = layer;
	camera.renderOrder = renderOrder;
	camera.depthBufferMode = Camera.DepthBufferMode.Regular;
	camera.devicePropertyUsage = Camera.DeviceProperty.All;
	camera.size = 2.0;
	camera.near = 0.1;
	camera.far  = 100.0;
	camera.type = Camera.Type.Orthographic;
	camera.devicePropertyUsage = Camera.DeviceProperty.None;
	
	var colorRenderTargets = camera.colorRenderTargets;
	var clearColor = new vec4( 0, 0, 0, 0 );
	
	for ( var i = 0; i < 4; i++ )
	{
		if ( renderTargetArray[i] )
		{
			checkOrAddColorRenderTarget( colorRenderTargets, i );
			colorRenderTargets[i].targetTexture = renderTargetArray[i];
			colorRenderTargets[i].clearColor = clearColor;
		}
		else
		{
			print( "renderTargetArray[" + i + "] is null" );
			
			if ( colorRenderTargets[i] != null )
			colorRenderTargets[i].targetTexture = null;
			else
			print( "colorRenderTarget[" + i + "] is null" );
		}
	}
	
	camera.colorRenderTargets = colorRenderTargets;
	//print("Added color attachments: " + colorRenderTargets.length);
};


//-------------------------------------------------------------------------------


function setupMaterialTextures( material, renderTargetArray )
{
	material.mainPass.samplers.renderTarget0.texture = renderTargetArray[0];
	material.mainPass.samplers.renderTarget1.texture = renderTargetArray[1];
	material.mainPass.samplers.renderTarget2.texture = renderTargetArray[2];
	material.mainPass.samplers.renderTarget3.texture = renderTargetArray[3];
	
	material.mainPass.samplers.renderTarget0.filtering = FilteringMode.Nearest;
	material.mainPass.samplers.renderTarget1.filtering = FilteringMode.Nearest;
	material.mainPass.samplers.renderTarget2.filtering = FilteringMode.Nearest;
	material.mainPass.samplers.renderTarget3.filtering = FilteringMode.Nearest;
	
	material.mainPass.samplers.renderTarget0.wrap = WrapMode.ClampToEdge;
	material.mainPass.samplers.renderTarget1.wrap = WrapMode.ClampToEdge;
	material.mainPass.samplers.renderTarget2.wrap = WrapMode.ClampToEdge;
	material.mainPass.samplers.renderTarget3.wrap = WrapMode.ClampToEdge;
}


//-------------------------------------------------------------------------------

function createParticleMesh( rootObject, material, renderOrder )
{
	var meshVisual = rootObject.createComponent('RenderMeshVisual'); //new
	
	var TempMeshVisual = script.getSceneObject().getParent().getComponent("Component.RenderMeshVisual");
	//var TempMeshVisual = rootObject.getComponent("Component.RenderMeshVisual");
	
	if( TempMeshVisual && TempMeshVisual.mesh )
	{
		meshVisual.setRenderOrder( renderOrder );
		meshVisual.mesh = TempMeshVisual.mesh;
		meshVisual.mainMaterial  = material;
		meshVisual.meshShadowMode = 0;
		meshVisual.shadowColor = new vec4( 1, 1, 1, 1 );
		meshVisual.shadowDensity = 1;
		meshVisual.mainPass.frustumCullMin = new vec3( -1000, -1000, -1000 );
		meshVisual.mainPass.frustumCullMax = new vec3( 1000, 1000, 1000 );
		meshVisual.mainPass.frustumCullMode = FrustumCullMode.UserDefinedAABB;
	}
	else
	{
		print( "NGS Particle Error: No Mesh!" );
	}
}

//-------------------------------------------------------------------------------


function createParticleQuad( rootObject, material, renderOrder )
{
	var builder = new MeshBuilder([
			{ name: "position", components: 3 },
			{ name: "normal", components: 3, normalized: true },
			{ name: "texture0", components: 2 },
		]);
	
	builder.topology = MeshTopology.Triangles;
	builder.indexType = MeshIndexType.UInt16;
	
	var scale = 0.5;
	
	var left = -scale; 
	var right = scale;
	var top = scale;
	var bottom = -scale;
	
	builder.appendVerticesInterleaved([
			// Position         Normal      UV       Index
			left, top, 0,       0, 0, 1,    0, 1,    // 0
			left, bottom, 0,    0, 0, 1,    0, 0,    // 1
			right, bottom, 0,   0, 0, 1,    1, 0,    // 2
			right, top, 0,      0, 0, 1,    1, 1,    // 3
		]);
	
	builder.appendIndices([ 
			0,1,2, // First Triangle
			2,3,0, // Second Triangle
		]);
	
	var meshVisual = rootObject.createComponent('RenderMeshVisual'); //new
	meshVisual.setRenderOrder( renderOrder );
	
	if( builder.isValid() )
	{
		meshVisual.mesh = builder.getMesh();
		meshVisual.mainMaterial  = material;
		meshVisual.meshShadowMode = 0;
		meshVisual.shadowColor = new vec4( 1, 1, 1, 1 );
		meshVisual.shadowDensity = 1;
		meshVisual.mainPass.frustumCullMin = new vec3( -1000, -1000, -1000 );
		meshVisual.mainPass.frustumCullMax = new vec3( 1000, 1000, 1000 );
		meshVisual.mainPass.frustumCullMode = FrustumCullMode.UserDefinedAABB;
		builder.updateMesh();
	}
	else
	{
		print( "NGS Particle Error: Quad data invalid!" );
	}
}


//-------------------------------------------------------------------------------


function createScreenQuad( material, meshVisual )
{
	var builder = new MeshBuilder([
			{ name: "position", components: 3 },
			{ name: "normal", components: 3, normalized: true },
			{ name: "texture0", components: 2 },
		]);
	
	builder.topology = MeshTopology.Triangles;
	builder.indexType = MeshIndexType.UInt16;
	
	builder.appendVerticesInterleaved([
			// Position         Normal      UV       Index
			-1.0,  1.0, -1.0,   0, 0, 1,    0, 1,    // 0
			-1.0, -1.0, -1.0,   0, 0, 1,    0, 0,    // 1
			1.0, -1.0, -1.0,   0, 0, 1,    1, 0,    // 2
			1.0,  1.0, -1.0,   0, 0, 1,    1, 1,    // 3
		]);
	
	builder.appendIndices([ 
			0,1,2, // First Triangle
			2,3,0, // Second Triangle
		]);
	
	if( builder.isValid() )
	{
		meshVisual.mesh = builder.getMesh();
		meshVisual.mainMaterial  = material;
		builder.updateMesh();
	}
	else
	{
		print( "NGS Particle Error: Quad data invalid!" );
	}
}


//-------------------------------------------------------------------------------


var isInitialized = false;
var scriptObject = null;
var renderObject = null;
var vfxObject = null;
var vfxComponent = null;
var cameraObject_Feedback = null;
var cameraObject_Simulate = null;
var meshVisual_Feedback = null;
var meshVisual_Simulate = null;


//-------------------------------------------------------------------------------


function setParentBySpace( systemId, refObject, type, inWorldSpace)
{
	if ( inWorldSpace ) 
	{
		refObject.setParent(null);
	}
	else 
	{
		refObject.setParent(scriptObject); 
	}
	vfxComponent.setRefObject(systemId, refObject, type);
}


//-------------------------------------------------------------------------------


var initialize = function()
{
	script.vfxFrame = 0;
	
	//scriptObject = scene.createSceneObject('');
	scriptObject = script.getSceneObject();
	vfxObject = scriptObject.getParent();
	vfxComponent = vfxObject.getComponent("Component.VFXComponent");
	
	var layer1 = LayerSet.makeUnique();			
	cameraObject_Simulate = scene.createSceneObject('cameraObject' );
	cameraObject_Simulate.layer = layer1;
	// We need the system id, set true if it is in world space
	setParentBySpace( "39", cameraObject_Simulate, VFXRefObjectType.Simulate, false);
	
	var camera_Simulate = cameraObject_Simulate.createComponent('Camera');
	
	if ( camera_Simulate.supportedColorRenderTargetCount < 4 ) 
	{
		print("VFX is not supported");
		return;
	}
	
	isInitialized = true;
	
	script.Material_Simulate.mainPass.instanceCount = 170;
	
	meshVisual_Simulate = cameraObject_Simulate.createComponent('RenderMeshVisual');
	
	createScreenQuad( script.Material_Simulate, meshVisual_Simulate );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	var layer2 = LayerSet.makeUnique();							  
	cameraObject_Feedback = scene.createSceneObject( 'cameraObject' );
	cameraObject_Feedback.layer = layer2;
	// We need the system id, set true if it is in world space
	setParentBySpace( "39", cameraObject_Feedback, VFXRefObjectType.Feedback, false);
	
	var camera_Feedback = cameraObject_Feedback.createComponent('Camera');
	
	meshVisual_Feedback = cameraObject_Feedback.createComponent('RenderMeshVisual');
	
	createScreenQuad( script.Material_Feedback, meshVisual_Feedback );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	// Create render targets
	
	var targetArray_Simulate = [];  
	var targetArray_Feedback = [];
	
	for ( var i = 0; i < 4; i++ ) 
	{
		targetArray_Simulate.push( createRenderTarget() );
		var feedbackTarget = createRenderTarget();
		feedbackTarget.control.replayCapture = true; // Capture and restore image content for replay.
		targetArray_Feedback.push( feedbackTarget );
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	// Assign render targets as textures to materials ( resolution is auto generated by NGS )
	
	setupMaterialTextures( script.Material_Simulate, targetArray_Feedback );
	setupMaterialTextures( script.Material_Feedback, targetArray_Simulate );
	setupMaterialTextures( script.Material_Render, targetArray_Simulate );
	
	script.Material_Render.mainPass.instanceCount = 170;
	script.Material_Render.mainPass.targetResolution = new vec2(680.0, 1.0);
	script.Material_Render.mainPass.targetResolutionInv = new vec2(1.0, 1.0).div(new vec2(680.0, 1.0) );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	// Create the quad we instance and render with
	
	// We need to create a new SceneObject instead of using Script
	renderObject = scene.createSceneObject('renderObject' );
	// We need the system id, set true if it is in world space
	setParentBySpace( "39", renderObject, VFXRefObjectType.Rendering, true );
	
	if ( false )
	{
		createParticleMesh( renderObject, script.Material_Render /* we'll override this if user chooses custom material */, vfxComponent.getRenderOrder() );
	}
	else
	{
		createParticleQuad( renderObject, script.Material_Render, vfxComponent.getRenderOrder() );
	}
	
	renderObject.layer = vfxObject.layer;
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	var objects = {arrayKey : []};
	
	for (var i = 0; i < global.scene.getRootObjectsCount(); i++) 
	{
		var rootObject = global.scene.getRootObject(i);
		componentSearchRecursive(rootObject, "Component.Camera", objects);
	}
	
	// Find a camera that matches this script's render layer
	// If it matches, assign the camera component to 'renderCamera'
	var renderCamera = null;
	//print( script.getSceneObject().layer );
	var objectLayer = renderObject.layer;
	for (var i = 0; i < objects.arrayKey.length; i++) 
	{
		var cameraComponent = objects.arrayKey[i].getComponent("Component.Camera");
		var cameraLayer = cameraComponent.renderLayer;
		
		if (cameraLayer.contains(objectLayer)) {
			script.renderCamera = cameraComponent;
			break;
		}
	}
	
	if ( script.renderCamera == null )
	print( "VFX: Did not find main camera" )
	
	//print( script.renderCamera.getSceneObject().name + ": FOUND MATCH on layer " + objectLayer );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	// Assign render targets to cameras
	
	setupCamera( camera_Simulate, layer1, targetArray_Simulate, ( script.renderCamera.renderOrder ) ? script.renderCamera.renderOrder - 2 : -100 );
	setupCamera( camera_Feedback, layer2, targetArray_Feedback, ( script.renderCamera.renderOrder ) ? script.renderCamera.renderOrder - 1 : -100 );
	
	if ( script.Material_Simulate != undefined )
	script.Material_Simulate.mainPass.vfxFrame = 0;
};

//-------------------------------------------------------------------------------


var event = script.createEvent( "SceneEvent.OnStartEvent" );
event.bind( function( eventData )
	{
		initialize();
	});


//-------------------------------------------------------------------------------


var newEvent = script.createEvent('UpdateEvent');
newEvent.bind(function() 
	{
		if ( !isInitialized || script.Material_Simulate == undefined /*|| !script.Material_Simulate.hasOwnProperty( 'mainPass' )*/ )
		{
			return;
		}
		
		// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
		
		/* no delay */
		
		// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
		
		renderObject.getComponent('RenderMeshVisual').setRenderOrder(vfxComponent.getRenderOrder()); // re-enable this for Kurt to test
		renderObject.layer = vfxObject.layer;
		
		// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
		
		// AABB
		
		script.Material_Simulate.mainPass.vfxLocalAabbMin = script.getSceneObject().localAabbMin;
		script.Material_Simulate.mainPass.vfxWorldAabbMin = script.getSceneObject().worldAabbMin;
		script.Material_Simulate.mainPass.vfxLocalAabbMax = script.getSceneObject().localAabbMax;
		script.Material_Simulate.mainPass.vfxWorldAabbMax = script.getSceneObject().worldAabbMax;
		
		// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
		
		// Camera
		
		script.Material_Simulate.mainPass.vfxCameraAspect = script.renderCamera.aspect;
		script.Material_Simulate.mainPass.vfxCameraNear = script.renderCamera.near;
		script.Material_Simulate.mainPass.vfxCameraFar = script.renderCamera.far;
		script.Material_Simulate.mainPass.vfxCameraUp = script.renderCamera.getTransform().up;
		script.Material_Simulate.mainPass.vfxCameraForward = script.renderCamera.getTransform().forward;
		script.Material_Simulate.mainPass.vfxCameraRight = script.renderCamera.getTransform().right;
		
		// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
		
		var modelMatrix         = script.getSceneObject().getTransform().getWorldTransform();
		var modelMatrixInv      = script.getSceneObject().getTransform().getInvertedWorldTransform(); 
		var viewMatrix          = script.renderCamera.getTransform().getInvertedWorldTransform();
		var projectionMatrix    = mat4.perspective(script.renderCamera.fov, script.renderCamera.aspect, script.renderCamera.near, script.renderCamera.far );
		var modelViewMatrix     = viewMatrix.mult(modelMatrix); // change this once we have camera...
		var modelViewProjection = projectionMatrix.mult(viewMatrix.mult(modelMatrix));
		var viewProjection      = projectionMatrix.mult(viewMatrix);
		
		// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
		
		// Model 
		
		script.Material_Simulate.mainPass.vfxModelMatrix = modelMatrix;
		script.Material_Simulate.mainPass.vfxModelMatrixInverse = modelMatrixInv;
		
		// Model x View
		
		script.Material_Simulate.mainPass.vfxModelViewMatrix = modelViewMatrix;
		script.Material_Simulate.mainPass.vfxModelViewMatrixInverse = modelViewMatrix.inverse();
		
		// Projection
		
		script.Material_Simulate.mainPass.vfxProjectionMatrix = projectionMatrix;
		script.Material_Simulate.mainPass.vfxProjectionMatrixInverse = projectionMatrix.inverse();
		
		// Model View Projection
		
		script.Material_Simulate.mainPass.vfxModelViewProjectionMatrix = modelViewProjection;
		script.Material_Simulate.mainPass.vfxModelViewProjectionMatrixInverse = modelViewProjection.inverse();
		
		// View
		
		script.Material_Simulate.mainPass.vfxViewMatrix = viewMatrix;
		script.Material_Simulate.mainPass.vfxViewMatrixInverse = viewMatrix.inverse();
		
		// View Projection
		
		script.Material_Simulate.mainPass.vfxViewProjectionMatrix = viewProjection;
		script.Material_Simulate.mainPass.vfxViewProjectionMatrixInverse = viewProjection.inverse();
		
		script.Material_Simulate.mainPass.vfxFrame = script.vfxFrame;
		script.vfxFrame++;
	});


//-------------------------------------------------------------------------------


function componentSearchRecursive(baseObject, component, objects) 
{
	var result = null;
	if (baseObject.getComponentCount(component) > 0) {
		if(baseObject.getFirstComponent(component)) {
			result = baseObject; 
			objects.arrayKey.push(result);
		}
	}
	for (var i = 0; i < baseObject.getChildrenCount(); i++) {
		var childResult = componentSearchRecursive(baseObject.getChild(i), component, objects);
		if (childResult) result = childResult;
	}
	return result;
}

