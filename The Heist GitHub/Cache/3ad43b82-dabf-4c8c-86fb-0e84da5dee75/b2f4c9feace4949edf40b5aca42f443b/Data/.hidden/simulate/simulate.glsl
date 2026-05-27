#version 310 es

#define NODEFLEX 0 // Hack for now to know if a shader is running in Studio or on a released lens

#define SIMULATION_PASS

#define NF_PRECISION highp

#define SC_USE_USER_DEFINED_VS_MAIN

//-----------------------------------------------------------------------



//-----------------------------------------------------------------------


//-----------------------------------------------------------------------
// Standard defines
//-----------------------------------------------------------------------


#pragma paste_to_backend_at_the_top_begin
#define SC_DISABLE_FRUSTUM_CULLING
#define SC_ALLOW_16_TEXTURES
#define SC_ENABLE_INSTANCED_RENDERING
#pragma paste_to_backend_at_the_top_end


//-----------------------------------------------------------------------
// Standard includes
//-----------------------------------------------------------------------

#include <std2.glsl>
#include <std2_vs.glsl>
#include <std2_texture.glsl>
#include <std2_receiver.glsl>
#include <std2_fs.glsl>
#if (SC_BACKEND_LANGUAGE_VERSION >= 310) || defined (SC_BACKEND_LANGUAGE_METAL)
#if !SC_RT_RECEIVER_MODE
#include <std2_proxy.glsl>
#endif
#endif

//-----------------------------------------------------------------------
// Global defines
//-----------------------------------------------------------------------

#define SCENARIUM


#ifdef SC_BACKEND_LANGUAGE_MOBILE
#define MOBILE
#endif


#ifdef SC_BACKEND_LANGUAGE_GL
const bool DEVICE_IS_FAST = SC_DEVICE_CLASS >= SC_DEVICE_CLASS_C && bool(SC_GL_FRAGMENT_PRECISION_HIGH);
#else
const bool DEVICE_IS_FAST = SC_DEVICE_CLASS >= SC_DEVICE_CLASS_C;
#endif


const bool SC_ENABLE_SRGB_EMULATION_IN_SHADER = false;


//-----------------------------------------------------------------------
// Varyings
//-----------------------------------------------------------------------

varying vec4 varColor;

//-----------------------------------------------------------------------
// User includes
//-----------------------------------------------------------------------
#include "includes/utils.glsl"		
// in SC_RT_RECEIVER_MODE, the following headers cannot be included as they reference std2_fs_output functions: 
#if !SC_RT_RECEIVER_MODE
#include "includes/blend_modes.glsl"
#include "includes/oit.glsl" 
#endif

#include "includes/uniforms.glsl"

//-----------------------------------------------------------------------

// The next 60 or so lines of code are for debugging support, live tweaks, node previews, etc and will be included in a 
// shared glsl file.

//-----------------------------------------------------------------------

// Hack for now to know if a shader is running in Studio or on a released lens

#if !defined(MOBILE) && !NODEFLEX
#define STUDIO
#endif

//-----------------------------------------------------------------------

#if defined( SIMULATION_PASS )


#define ngsLocalAabbMin						vfxLocalAabbMin
#define ngsWorldAabbMin						vfxWorldAabbMin
#define ngsLocalAabbMax						vfxLocalAabbMax
#define ngsWorldAabbMax						vfxWorldAabbMax
#define ngsCameraAspect 					vfxCameraAspect
#define ngsCameraNear                       vfxCameraNear
#define ngsCameraFar                        vfxCameraFar
#define ngsCameraPosition                   vfxViewMatrixInverse[3].xyz
#define ngsModelMatrix                      vfxModelMatrix
#define ngsModelMatrixInverse               vfxModelMatrixInverse
#define ngsModelViewMatrix                  vfxModelViewMatrix
#define ngsModelViewMatrixInverse           vfxModelViewMatrixInverse
#define ngsProjectionMatrix                 vfxProjectionMatrix
#define ngsProjectionMatrixInverse          vfxProjectionMatrixInverse
#define ngsModelViewProjectionMatrix        vfxModelViewProjectionMatrix
#define ngsModelViewProjectionMatrixInverse vfxModelViewProjectionMatrixInverse
#define ngsViewMatrix                       vfxViewMatrix
#define ngsViewMatrixInverse                vfxViewMatrixInverse
#define ngsViewProjectionMatrix             vfxViewProjectionMatrix
#define ngsViewProjectionMatrixInverse      vfxViewProjectionMatrixInverse
#define ngsCameraUp 					    vfxCameraUp
#define ngsCameraForward                    -vfxCameraForward
#define ngsCameraRight                      vfxCameraRight
#define ngsFrame    	                    vfxFrame


#else


#define ngsLocalAabbMin						sc_LocalAabbMin
#define ngsWorldAabbMin						sc_WorldAabbMin
#define ngsLocalAabbMax						sc_LocalAabbMax
#define ngsWorldAabbMax						sc_WorldAabbMax
#define ngsCameraAspect 					sc_Camera.aspect;
#define ngsCameraNear                       sc_Camera.clipPlanes.x
#define ngsCameraFar                        sc_Camera.clipPlanes.y
#define ngsCameraPosition                   sc_Camera.position
#define ngsModelMatrix                      sc_ModelMatrix
#define ngsModelMatrixInverse               sc_ModelMatrixInverse
#define ngsModelViewMatrix                  sc_ModelViewMatrix
#define ngsModelViewMatrixInverse           sc_ModelViewMatrixInverse
#define ngsProjectionMatrix                 sc_ProjectionMatrix
#define ngsProjectionMatrixInverse          sc_ProjectionMatrixInverse
#define ngsModelViewProjectionMatrix        sc_ModelViewProjectionMatrix
#define ngsModelViewProjectionMatrixInverse sc_ModelViewProjectionMatrixInverse
#define ngsViewMatrix                       sc_ViewMatrix
#define ngsViewMatrixInverse                sc_ViewMatrixInverse
#define ngsViewProjectionMatrix             sc_ViewProjectionMatrix
#define ngsViewProjectionMatrixInverse      sc_ViewProjectionMatrixInverse
#define ngsCameraUp 					    sc_ViewMatrixInverse[1].xyz
#define ngsCameraForward                    -sc_ViewMatrixInverse[2].xyz
#define ngsCameraRight                      sc_ViewMatrixInverse[0].xyz
#define ngsFrame 		                    0


#endif

//-----------------------------------------------------------------------

// Time Overrides

uniform       int   overrideTimeEnabled;
uniform highp float overrideTimeElapsed;
uniform highp float overrideTimeDelta;

//-----------------------------------------------------------------------

#if defined( STUDIO )
#define ssConstOrUniformPrecision	uniform NF_PRECISION
#define ssConstOrUniform			uniform
#else
#define ssConstOrUniformPrecision   const
#define ssConstOrUniform    		const
#endif

//--------------------------------------------------------

// When compiling the shader for rendering in a node-based editor, we need any unconnected dynamic input port's value to
// be tweakable in real-time so we expose it to the engine as a uniform. If we're compiling the shader for a release build
// we use a literal or const value

#if defined( STUDIO )
#define NF_PORT_CONSTANT( xValue, xUniform )	xUniform
#else
#define NF_PORT_CONSTANT( xValue, xUniform )	xValue
#endif

//--------------------------------------------------------

#define float2   vec2
#define float3   vec3
#define float4   vec4
#define bool2    bvec2
#define bool3    bvec3
#define bool4    bvec4
#define float2x2 mat2
#define float3x3 mat3
#define float4x4 mat4

//--------------------------------------------------------

#define ssConditional( C, A, B ) ( ( C * 1.0 != 0.0 ) ? A : B )
#define ssEqual( A, B )          ( ( A == B ) ? 1.0 : 0.0 )
#define ssNotEqual( A, B )       ( ( A == B ) ? 0.0 : 1.0 )
#define ssLarger( A, B )         ( ( A > B ) ? 1.0 : 0.0 )
#define ssLargerOrEqual( A, B )  ( ( A >= B ) ? 1.0 : 0.0 )
#define ssSmaller( A,  B ) 		 ( ( A < B ) ? 1.0 : 0.0 )
#define ssSmallerOrEqual( A, B ) ( ( A <= B ) ? 1.0 : 0.0 )
#define ssNot( A ) 		         ( ( A * 1.0 != 0.0 ) ? 0.0 : 1.0 )

//--------------------------------------------------------

int ssIntMod( int x, int y )
{
	return x - y * ( x / y );
}

//--------------------------------------------------------

float ssSRGB_to_Linear( float value ) { return ( DEVICE_IS_FAST ) ? pow( value, 2.2 ) : value * value; }
vec2  ssSRGB_to_Linear( vec2  value ) { return ( DEVICE_IS_FAST ) ? vec2( pow( value.x, 2.2 ), pow( value.y, 2.2 ) ) : value * value; }
vec3  ssSRGB_to_Linear( vec3  value ) { return ( DEVICE_IS_FAST ) ? vec3( pow( value.x, 2.2 ), pow( value.y, 2.2 ), pow( value.z, 2.2 ) ) : value * value; }
vec4  ssSRGB_to_Linear( vec4  value ) { return ( DEVICE_IS_FAST ) ? vec4( pow( value.x, 2.2 ), pow( value.y, 2.2 ), pow( value.z, 2.2 ), pow( value.w, 2.2 ) ) : value * value; }

float ssLinear_to_SRGB( float value ) { return ( DEVICE_IS_FAST ) ? pow( value, 0.45454545 ) : sqrt( value ); }
vec2  ssLinear_to_SRGB( vec2  value ) { return ( DEVICE_IS_FAST ) ? vec2( pow( value.x, 0.45454545 ), pow( value.y, 0.45454545 ) ) : sqrt( value ); }
vec3  ssLinear_to_SRGB( vec3  value ) { return ( DEVICE_IS_FAST ) ? vec3( pow( value.x, 0.45454545 ), pow( value.y, 0.45454545 ), pow( value.z, 0.45454545 ) ) : sqrt( value ); }
vec4  ssLinear_to_SRGB( vec4  value ) { return ( DEVICE_IS_FAST ) ? vec4( pow( value.x, 0.45454545 ), pow( value.y, 0.45454545 ), pow( value.z, 0.45454545 ), pow( value.w, 0.45454545 ) ) : sqrt( value ); }

//--------------------------------------------------------

float3 ssWorldToScreen( float3 Vector, mat4 ViewProjectionMatrix )
{
	float4 ScreenVector = ViewProjectionMatrix * float4( Vector, 1.0 );
	return ScreenVector.xyz / ScreenVector.w;
}

//--------------------------------------------------------

float  Dummy1;
float2 Dummy2;
float3 Dummy3;
float4 Dummy4;

//--------------------------------------------------------

#define ssPRECISION_LIMITER( Value ) Value = floor( Value * 10000.0 ) * 0.0001;
#define ssPRECISION_LIMITER2( Value ) Value = floor( Value * 2000.0 + 0.5 ) * 0.0005;

float rand( vec2 Seed ) // old, used by shader graph...
{ 
	float RandomValue = dot( Seed.xy, vec2( 0.98253, 0.72662 ) );
	RandomValue = sin( RandomValue ) * 479.371;
	RandomValue = fract( RandomValue ); 
	ssPRECISION_LIMITER( RandomValue ) 
	return RandomValue; 
}

//--------------------------------------------------------

float rand_float( float Seed )
{ 
	float RandomValue = Seed;
	RandomValue = sin( RandomValue ) * 479.371;
	RandomValue = fract( RandomValue ); 
	ssPRECISION_LIMITER( RandomValue ) 
	return RandomValue; 
}

float rand_float( vec2 Seed ) { return rand_float( dot( Seed, vec2( 0.38253, 0.42662 ) ) ); }
float rand_float( vec3 Seed ) { return rand_float( dot( Seed, vec3( 0.38253, 0.42662, 0.65295  ) ) ); }
float rand_float( vec4 Seed ) { return rand_float( dot( Seed, vec4( 0.38253, 0.42662, 0.65295, 0.29582 ) ) ); }

//--------------------------------------------------------

vec2 rand_vec2( float Seed )
{ 
	vec2 RandomValue = Seed * vec2( 0.457831, 0.623433 );
	RandomValue = sin( RandomValue ) * vec2( 479.371, 389.531 );
	RandomValue = fract( RandomValue ); 
	ssPRECISION_LIMITER( RandomValue ) 
	return RandomValue; 
}

vec2 rand_vec2( vec2 Seed ) { return rand_vec2( dot( Seed, vec2( 0.38253, 0.42662 ) ) ); }
vec2 rand_vec2( vec3 Seed ) { return rand_vec2( dot( Seed, vec3( 0.38253, 0.42662, 0.65295  ) ) ); }
vec2 rand_vec2( vec4 Seed ) { return rand_vec2( dot( Seed, vec4( 0.38253, 0.42662, 0.65295, 0.29582 ) ) ); }

//--------------------------------------------------------

vec3 rand_vec3( float Seed )
{ 
	vec3 RandomValue = Seed * vec3( 0.457831, 0.623433, 0.976253 );
	RandomValue = sin( RandomValue ) * vec3( 479.371, 389.531, 513.035 );
	RandomValue = fract( RandomValue ); 
	ssPRECISION_LIMITER( RandomValue ) 
	return RandomValue; 
}

vec3 rand_vec3( vec2 Seed ) { return rand_vec3( dot( Seed, vec2( 0.38253, 0.42662 ) ) ); }
vec3 rand_vec3( vec3 Seed ) { return rand_vec3( dot( Seed, vec3( 0.38253, 0.42662, 0.65295  ) ) ); }
vec3 rand_vec3( vec4 Seed ) { return rand_vec3( dot( Seed, vec4( 0.38253, 0.42662, 0.65295, 0.29582 ) ) ); }

//--------------------------------------------------------

vec4 rand_vec4( float Seed )
{ 
	vec4 RandomValue = Seed * vec4( 0.457831, 0.623433, 0.976253, 0.877913 );
	RandomValue = sin( RandomValue ) * vec4( 479.371, 389.531, 513.035, 397.895 );
	RandomValue = fract( RandomValue ); 
	ssPRECISION_LIMITER( RandomValue ) 
	return RandomValue; 
}

vec4 rand_vec4( vec2 Seed ) { return rand_vec4( dot( Seed, vec2( 0.38253, 0.42662 ) ) ); }
vec4 rand_vec4( vec3 Seed ) { return rand_vec4( dot( Seed, vec3( 0.38253, 0.42662, 0.65295  ) ) ); }
vec4 rand_vec4( vec4 Seed ) { return rand_vec4( dot( Seed, vec4( 0.38253, 0.42662, 0.65295, 0.29582 ) ) ); }

//--------------------------------------------------------

#define ssDELTA_TIME_MIN 0.00

//--------------------------------------------------------


vec4 EncodeFloat32( float v /* 0 - 1 range only */ ) 
{
	vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
	enc = fract(enc);
	enc -= enc.yzww * vec4(1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
	return enc;
}

vec3 EncodeFloat24( float v /* 0 - 1 range only */ ) 
{
	vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
	enc = fract(enc);
	enc -= enc.yzww * vec4(1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
	return enc.rgb;
}

vec2 EncodeFloat16( float v /* 0 - 1 range only */ ) 
{
	vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
	enc = fract(enc);
	enc -= enc.yzww * vec4(1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
	return enc.rg;
}

float EncodeFloat8( float v /* 0 - 1 range only */ ) 
{
	vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
	enc = fract(enc);
	enc -= enc.yzww * vec4(1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
	return enc.r;
}

float DecodeFloat32( vec4 rgba /* 0 - 1 range only */, const bool Quantize ) 
{ 
	if ( Quantize ) 
	rgba = floor(rgba * 255.0 + 0.5) / 255.0;
	return dot( rgba, vec4(1.0, 1.0/255.0, 1.0/65025.0, 1.0/16581375.0) );
}

float DecodeFloat24( vec3 rgb /* 0 - 1 range only */, const bool Quantize ) 
{
	if ( Quantize ) 
	rgb = floor(rgb * 255.0 + 0.5) / 255.0;
	return dot( rgb, vec3(1.0, 1.0/255.0, 1.0/65025.0) );
}

float DecodeFloat16( vec2 rg /* 0 - 1 range only */, const bool Quantize ) 
{
	if ( Quantize ) 
	rg = floor(rg * 255.0 + 0.5) / 255.0;
	return dot( rg, vec2(1.0, 1.0/255.0) );
}

float DecodeFloat8( float r /* 0 - 1 range only */, const bool Quantize ) 
{
	if ( Quantize ) 
	r = floor(r * 255.0 + 0.5) / 255.0;
	return r;
}

#define ssDEFAULT_REMAP_RANGE 0.99999
#define ssDEFAULT_REMAP_RANGE2 1.0

vec4  remap (vec4 value, vec4 oldmin, vec4 oldmax, vec4 newmin, vec4 newmax) { return newmin + (value - oldmin) * (newmax - newmin) / (oldmax - oldmin); }
vec3  remap (vec3 value, vec3 oldmin, vec3 oldmax, vec3 newmin, vec3 newmax) { return newmin + (value - oldmin) * (newmax - newmin) / (oldmax - oldmin); }
vec2  remap (vec2 value, vec2 oldmin, vec2 oldmax, vec2 newmin, vec2 newmax) { return newmin + (value - oldmin) * (newmax - newmin) / (oldmax - oldmin); }
float remap (float value, float oldmin, float oldmax, float newmin, float newmax) { return newmin + (value - oldmin) * (newmax - newmin) / (oldmax - oldmin); }
float remapTo01 (float value) { return (value + 1.0) * 0.5; }
float remapFrom01 (float value ) { return (value * 2.0) - 1.0; }

vec4  ssEncodeFloat32( float Value, float Min, float Max, float RemapRange )                      { return EncodeFloat32( remap( clamp( Value, Min, Max ), Min, Max, 0.0, RemapRange ) ); }
vec4  ssEncodeFloat32( float Value, float Min, float Max )                     					  { return ssEncodeFloat32( Value, Min, Max, ssDEFAULT_REMAP_RANGE ); }
vec4  ssEncodeFloat32( float Value, float RemapRange )                                            { return ssEncodeFloat32( Value, 0.0, 1.0, RemapRange ); }
vec3  ssEncodeFloat24( float Value, float Min, float Max, float RemapRange )                      { return EncodeFloat24( remap( clamp( Value, Min, Max ), Min, Max, 0.0, RemapRange ) ); }
vec3  ssEncodeFloat24( float Value, float Min, float Max )                     					  { return ssEncodeFloat24( Value, Min, Max, ssDEFAULT_REMAP_RANGE ); }
vec3  ssEncodeFloat24( float Value, float RemapRange )                                            { return ssEncodeFloat24( Value, 0.0, 1.0, RemapRange ); }
vec2  ssEncodeFloat16( float Value, float Min, float Max, float RemapRange )                      { return EncodeFloat16( remap( clamp( Value, Min, Max ), Min, Max, 0.0, RemapRange ) ); }
vec2  ssEncodeFloat16( float Value, float Min, float Max )                     					  { return ssEncodeFloat16( Value, Min, Max, ssDEFAULT_REMAP_RANGE ); }
vec2  ssEncodeFloat16( float Value, float RemapRange )                                            { return ssEncodeFloat16( Value, 0.0, 1.0, RemapRange ); }
float ssEncodeFloat8(  float Value, float Min, float Max, float RemapRange )                      { return remap( clamp( Value, Min, Max ), Min, Max, 0.0, RemapRange ); }
float ssEncodeFloat8(  float Value, float Min, float Max )                     					  { return remap( clamp( Value, Min, Max ), Min, Max, 0.0, ssDEFAULT_REMAP_RANGE2 ); }
float ssEncodeFloat8(  float Value, float RemapRange )                                            { return ssEncodeFloat8( Value, 0.0, 1.0, RemapRange ); }

float ssDecodeFloat32(  vec4 Value, float Min, float Max, const bool Quantize, float RemapRange ) { return remap( DecodeFloat32( Value, Quantize ), 0.0, RemapRange, Min, Max ); }
float ssDecodeFloat32(  vec4 Value, float Min, float Max ) 										  { return ssDecodeFloat32( Value, Min, Max, true, ssDEFAULT_REMAP_RANGE ); }
float ssDecodeFloat32(  vec4 Value, const bool Quantize, float RemapRange )                       { return ssDecodeFloat32( Value, 0.0, 1.0, Quantize, RemapRange ); }
float ssDecodeFloat24(  vec3 Value, float Min, float Max, const bool Quantize, float RemapRange ) { return remap( DecodeFloat24( Value, Quantize ), 0.0, RemapRange, Min, Max ); }
float ssDecodeFloat24(  vec3 Value, float Min, float Max ) 										  { return ssDecodeFloat24( Value, Min, Max, true, ssDEFAULT_REMAP_RANGE ); }
float ssDecodeFloat24(  vec3 Value, const bool Quantize, float RemapRange )                       { return ssDecodeFloat24( Value, 0.0, 1.0, Quantize, RemapRange ); }
float ssDecodeFloat16(  vec2 Value, float Min, float Max, const bool Quantize, float RemapRange ) { return remap( DecodeFloat16( Value, Quantize ), 0.0, RemapRange, Min, Max ); }
float ssDecodeFloat16(  vec2 Value, float Min, float Max ) 										  { return ssDecodeFloat16( Value, Min, Max, true, ssDEFAULT_REMAP_RANGE ); }
float ssDecodeFloat16(  vec2 Value, const bool Quantize, float RemapRange )                       { return ssDecodeFloat16( Value, 0.0, 1.0, Quantize, RemapRange ); }
float ssDecodeFloat8(  float Value, float Min, float Max, const bool Quantize, float RemapRange ) { return remap( DecodeFloat8( Value, Quantize ), 0.0, RemapRange, Min, Max ); }
float ssDecodeFloat8(  float Value, float Min, float Max ) 										  { return ssDecodeFloat8( Value, Min, Max, true, ssDEFAULT_REMAP_RANGE2); }
float ssDecodeFloat8(  float Value, const bool Quantize, float RemapRange )                       { return ssDecodeFloat8( Value, 0.0, 1.0, Quantize, RemapRange ); }

//--------------------------------------------------------


#if 0

struct ssPreviewInfo
{
	float4 Color;
	bool   Saved;
};

ssPreviewInfo PreviewInfo;

uniform NF_PRECISION int PreviewEnabled; // PreviewEnabled is set to 1 by the renderer when Lens Studio is rendering node previews
uniform NF_PRECISION int PreviewNodeID;  // PreviewNodeID is set to the node's ID that a preview is being rendered for

varying float4 PreviewVertexColor;
varying float  PreviewVertexSaved;

#define NF_DISABLE_VERTEX_CHANGES() 				( PreviewEnabled == 1 )		
#define NF_SETUP_PREVIEW_VERTEX()					PreviewInfo.Color = PreviewVertexColor = float4( 0.5 ); PreviewInfo.Saved = false; PreviewVertexSaved = 0.0;
#define NF_SETUP_PREVIEW_PIXEL()					PreviewInfo.Color = PreviewVertexColor; PreviewInfo.Saved = ( PreviewVertexSaved * 1.0 != 0.0 ) ? true : false;
#define NF_PREVIEW_SAVE( xCode, xNodeID, xAlpha ) 	if ( PreviewEnabled == 1 && !PreviewInfo.Saved && xNodeID == PreviewNodeID ) { PreviewInfo.Saved = true; { PreviewInfo.Color = xCode; if ( !xAlpha ) PreviewInfo.Color.a = 1.0; } }
#define NF_PREVIEW_FORCE_SAVE( xCode ) 				if ( PreviewEnabled == 0 ) { PreviewInfo.Saved = true; { PreviewInfo.Color = xCode; } }
#define NF_PREVIEW_OUTPUT_VERTEX()					if ( PreviewInfo.Saved ) { PreviewVertexColor = float4( PreviewInfo.Color.rgb, 1.0 ); PreviewVertexSaved = 1.0; }
#define NF_PREVIEW_OUTPUT_PIXEL()					if ( PreviewEnabled == 1 ) { if ( PreviewInfo.Saved ) { Output_Color0 = float4( PreviewInfo.Color ); } else { Output_Color0 = vec4( 0.0, 0.0, 0.0, 0.0 ); /*FinalColor.a = 1.0;*/ /* this will be an option later */ }  }

#else

#define NF_DISABLE_VERTEX_CHANGES()					false		
#define NF_SETUP_PREVIEW_VERTEX()
#define NF_SETUP_PREVIEW_PIXEL()
#define NF_PREVIEW_SAVE( xCode, xNodeID, xAlpha )
#define NF_PREVIEW_FORCE_SAVE( xCode )
#define NF_PREVIEW_OUTPUT_VERTEX()
#define NF_PREVIEW_OUTPUT_PIXEL()

#endif


//--------------------------------------------------------



//--------------------------------------------------------

float4 ssGetScreenPositionNDC( float4 vertexPosition, float3 transformedPosition, mat4 viewProjectionMatrix )
{
	float4 screenPosition = vec4( 0.0 );
	
	#ifdef VERTEX_SHADER
	
	if ( sc_RenderingSpace == SC_RENDERING_SPACE_SCREEN )
	{
		screenPosition = vertexPosition;
	}
	else
	{
		screenPosition = ( viewProjectionMatrix * float4( transformedPosition, 1.0 ) );
		screenPosition.xyz /= screenPosition.w;
	}
	
	#endif
	
	return screenPosition;
}

//--------------------------------------------------------

#ifdef FRAGMENT_SHADER

#define ngsAlphaTest( opacity )

#endif // #ifdef FRAGMENT_SHADER

#ifdef FRAGMENT_SHADER
#if !SC_RT_RECEIVER_MODE
vec4 ngsPixelShader( vec4 result ) 
{	
	if ( sc_ProjectiveShadowsCaster )
	{
		return evaluateShadowCasterColor( result );
	}
	else if ( sc_RenderAlphaToColor )
	{
		return vec4(result.a);
	}
	
	// Blending
	
	if ( sc_BlendMode_Custom )
	{				
		result = applyCustomBlend(result);
	}					
	else if ( sc_BlendMode_MultiplyOriginal )
	{
		result.rgb = mix(vec3(1.0), result.rgb, result.a); 
	}					
	else if ( sc_BlendMode_Screen )
	{
		result.rgb = result.rgb * result.a;
	}
	
	return result;
}
#endif
#endif


//-----------------------------------------------------------------------


//--------------------------------------------------------

SC_DECLARE_TEXTURE(renderTarget0);
SC_DECLARE_TEXTURE(renderTarget1);
SC_DECLARE_TEXTURE(renderTarget2);
SC_DECLARE_TEXTURE(renderTarget3);

//--------------------------------------------------------

uniform float       _sc_allow16TexturesMarker;
uniform highp vec3  vfxLocalAabbMin;
uniform highp vec3  vfxWorldAabbMin;
uniform highp vec3  vfxLocalAabbMax;
uniform highp vec3  vfxWorldAabbMax;
uniform highp float vfxCameraAspect;
uniform highp float vfxCameraNear;
uniform highp float vfxCameraFar;
uniform highp vec3  vfxCameraUp;
uniform highp vec3  vfxCameraForward;
uniform highp vec3  vfxCameraRight;
uniform highp mat4  vfxModelMatrix;
uniform highp mat4  vfxModelMatrixInverse;
uniform highp mat4  vfxModelViewMatrix;
uniform highp mat4  vfxModelViewMatrixInverse;
uniform highp mat4  vfxProjectionMatrix;
uniform highp mat4  vfxProjectionMatrixInverse;
uniform highp mat4  vfxModelViewProjectionMatrix;
uniform highp mat4  vfxModelViewProjectionMatrixInverse;
uniform highp mat4  vfxViewMatrix;
uniform highp mat4  vfxViewMatrixInverse;
uniform highp mat4  vfxViewProjectionMatrix;
uniform highp mat4  vfxViewProjectionMatrixInverse;
uniform       int   vfxFrame;


//--------------------------------------------------------


#define ssTEXEL_COUNT_INT           4
#define ssTEXEL_COUNT_FLOAT         4.0
#define ssPARTICLE_COUNT_1D_INT		170
#define ssPARTICLE_COUNT_1D_FLOAT	170.0
#define ssPARTICLE_COUNT_2D_INT		ivec2( 170, 1 )
#define ssPARTICLE_COUNT_2D_FLOAT	float2( 170.0, 1.0 )
#define ssTARGET_SIZE_INT 			ivec2( 680, 1 )
#define ssTARGET_SIZE_FLOAT			float2( 680.0, 1.0 )
#define ssPARTICLE_LIFE_MAX 		float( 1.0 )
#define ssPARTICLE_TOTAL_LIFE_MAX 	float( 1.0 )
#define ssPARTICLE_BURST_GROUPS 	float( 1.0 )
#define ssPARTICLE_SPAWN_RATE 		float( 170.0 )
#define ssPARTICLE_BURST_EVERY 		float( 2.0 )
#define ssPARTICLE_DELAY_MAX        float( 0.5 )
#define ssPARTICLE_MASS_MAX         float( 100.0 )
#define ssPARTICLE_SIZE_MAX         float( 100.0 )


//--------------------------------------------------------


int    ssParticle_Index2D_to_Index1D( ivec2 Index2D )  { return Index2D.y * ssPARTICLE_COUNT_2D_INT.x + Index2D.x; }
ivec2  ssParticle_Index1D_to_Index2D( int Index1D )	   { return ivec2( Index1D % ssPARTICLE_COUNT_2D_INT.x, Index1D / ssPARTICLE_COUNT_2D_INT.x ); }
float  ssParticle_Index1D_to_Coord1D( int Index1D )    { return ( float( Index1D ) + 0.5 ) / ssPARTICLE_COUNT_1D_FLOAT; }
float  ssParticle_Index1D_to_Ratio1D( int Index1D )    { return float( Index1D ) / max( ssPARTICLE_COUNT_1D_FLOAT - 1.0, 1.0 ); }
float2 ssParticle_Index2D_to_Coord2D( ivec2 Index2D )  { return ( float2( Index2D ) + 0.5 ) / ssPARTICLE_COUNT_2D_FLOAT; }
float2 ssParticle_Index2D_to_Ratio2D( ivec2 Index2D )  { return float2( Index2D ) / max( ssPARTICLE_COUNT_2D_FLOAT - float2( 1.0, 1.0 ), float2( 1.0, 1.0 ) ); }
int    ssParticle_Coord1D_to_Index1D( float Coord1D )  { return int( Coord1D * ssPARTICLE_COUNT_1D_FLOAT ); }
ivec2  ssParticle_Coord2D_to_Index2D( float2 Coord2D ) { return ivec2( Coord2D * ssPARTICLE_COUNT_2D_FLOAT ); }	
float2 ssParticle_Index1D_to_Coord2D( int Index1D )    { return ssParticle_Index2D_to_Coord2D( ssParticle_Index1D_to_Index2D( Index1D ) ); }
float  ssParticle_Index2D_to_Coord1D( ivec2 Index2D )  { return ssParticle_Index1D_to_Coord1D( ssParticle_Index2D_to_Index1D( Index2D ) ); }
int    ssParticle_Coord2D_to_Index1D( float2 Coord2D ) { return ssParticle_Index2D_to_Index1D( ssParticle_Coord2D_to_Index2D( Coord2D ) ); }
ivec2  ssParticle_Coord1D_to_Index2D( float Coord1D )  { return ssParticle_Index1D_to_Index2D( ssParticle_Coord1D_to_Index1D( Coord1D ) ); }
float2 ssParticle_Coord1D_to_Coord2D( float Coord1D )  { return ssParticle_Index2D_to_Coord2D( ssParticle_Coord1D_to_Index2D( Coord1D ) ); }	
float  ssParticle_Coord2D_to_Coord1D( float2 Coord2D ) { return ssParticle_Index1D_to_Coord1D( ssParticle_Coord2D_to_Index1D( Coord2D ) ); }


//--------------------------------------------------------


struct ssParticle
{
	// Feedback Attributes
	
	vec3  Position;
	vec3  Velocity;
	vec4  Color;
	float Size;
	float Age;
	float Life;
	float Mass;
	mat3  Matrix;
	vec4  Quaternion;
	float Dead;
	
	// Custom
	
	
	
	// Calculated
	
	float SpawnOffset;
	float Seed;
	vec2  Seed2000;
	float TimeShift;
	int   Index1D;
	float Coord1D;
	float Ratio1D;
	ivec2 Index2D;
	vec2  Coord2D;
	vec2  Ratio2D;
	vec3  Force;
	bool  Spawned;
};


//--------------------------------------------------------


void ssCalculateParticleSeed( inout ssParticle Particle )
{
	#if 0
	// Spawn Once - Live Forever
	//Particle.Seed = rand( vec2( Particle.Ratio1D + 0.141435 ) * 0.6789 );	
	Particle.Seed = Particle.Ratio1D * 0.976379 + 0.151235;
	ivec2 Index2D = ivec2( Particle.Index1D % 400, Particle.Index1D / 400 );	
	Particle.Seed2000 = ( vec2( Index2D ) + vec2( 1.0, 1.0 ) ) / max( vec2( 400.0, 400.0 ) - float2( 1.0, 1.0 ), float2( 1.0, 1.0 ) );
	#else
	// Any time max life is used
	float ElapsedTime = ( overrideTimeEnabled == 1 ) ? overrideTimeElapsed : sc_TimeElapsed;
	
	Particle.Seed = Particle.Ratio1D * 0.976379 + 0.151235;
	Particle.Seed = Particle.Seed + floor( ( ElapsedTime - Particle.SpawnOffset - 0.0 /*delay*/ + 0.0 /*warmup*/  + ssPARTICLE_TOTAL_LIFE_MAX * 2.0 ) / ssPARTICLE_TOTAL_LIFE_MAX ) * 4.32723;
	Particle.Seed = fract( abs( Particle.Seed ) );
	ivec2 Index2D = ivec2( Particle.Index1D % 400, Particle.Index1D / 400 );	
	Particle.Seed2000 = ( vec2( Index2D ) + vec2( 1.0, 1.0 ) ) / max( vec2( 400.0, 400.0 ) - float2( 1.0, 1.0 ), float2( 1.0, 1.0 ) );
	#endif
	
	//ssPRECISION_LIMITER( Particle.Seed )
}


//--------------------------------------------------------


void ssCalculateDynamicAttributes( int InstanceID, inout ssParticle Particle )
{
	Particle.Spawned     = false;
	Particle.Force       = vec3( 0.0 );
	Particle.Index1D     = InstanceID;
	Particle.Index2D     = ssParticle_Index1D_to_Index2D( Particle.Index1D );
	Particle.Coord1D     = ssParticle_Index1D_to_Coord1D( Particle.Index1D );
	Particle.Coord2D     = ssParticle_Index2D_to_Coord2D( Particle.Index2D );
	Particle.Ratio1D     = ssParticle_Index1D_to_Ratio1D( Particle.Index1D );
	Particle.Ratio2D     = ssParticle_Index2D_to_Ratio2D( Particle.Index2D );
	Particle.Seed        = 0.0;
	
	#if 1
	Particle.TimeShift   = rand( vec2( Particle.Ratio1D ) * vec2( 0.3452, 0.52254 ) );
	Particle.SpawnOffset = Particle.Ratio1D * ssPARTICLE_LIFE_MAX;
	#elif  0
	Particle.TimeShift   = 0.0;
	Particle.SpawnOffset = float( Particle.Index1D / int( ssPARTICLE_SPAWN_RATE ) ) * ssPARTICLE_BURST_EVERY;
	#else
	Particle.TimeShift   = 0.0;
	Particle.SpawnOffset = 0.0;
	#endif
	
	ssCalculateParticleSeed( Particle );
}


//--------------------------------------------------------


vec4 ssGetParticleRandom( int Dimension, bool UseTime, bool UseNodeID, bool UseParticleID, float NodeID, vec2 ParticleSeed, float ExtraSeed, float Time )
{
	vec4  Random          = vec4( 0.0 );
	vec4  TimeRatio       = vec4( 1.0 );
	float NodeRatio       = 1.0;
	vec2  ParticleIDRatio = vec2(1.0);
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( UseTime )
	{
		TimeRatio = vec4( fract( Time * 10.0 ) ); 
		ssPRECISION_LIMITER( TimeRatio )
		TimeRatio = vec4( 0.3234, 0.6574, 0.2258, 0.8763 ) + TimeRatio;
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( UseNodeID )
	{
		NodeRatio = 1.0 + ( NodeID + 1.0 ) * 0.01; /* don't use node count */
		//ssPRECISION_LIMITER( NodeRatio )
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( UseParticleID )
	{
		ParticleIDRatio = ParticleSeed;
	}
	
	ExtraSeed = ( ExtraSeed + 1.0 ) * 0.5;
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( Dimension >= 1 )
	{
		Random.x = rand( vec2( 0.2353, 0.7875 ) * ParticleIDRatio * NodeRatio * TimeRatio.x * ExtraSeed );
	}
	
	if ( Dimension >= 2 )
	{
		Random.y = rand( vec2( 0.5751, 0.6273 ) * ParticleIDRatio * NodeRatio * TimeRatio.y * ExtraSeed ); 
	}
	
	if ( Dimension >= 3 )
	{
		Random.z = rand( vec2( 0.6947, 0.5217 ) * ParticleIDRatio * NodeRatio * TimeRatio.z * ExtraSeed );
	}
	
	if ( Dimension >= 4 )
	{
		Random.w = rand( vec2( 0.4789, 0.3967 ) * ParticleIDRatio * NodeRatio * TimeRatio.w * ExtraSeed );
	}
	
	return Random;
}


//--------------------------------------------------------


ssParticle gParticle;


//-----------------------------------------------------------------------


highp vec4  Output_Color0;
highp vec4  Output_Color1;
highp vec4  Output_Color2;
highp vec4  Output_Color3;
highp float Output_Depth;


//-----------------------------------------------------------------------


flat varying highp int Interp_Particle_Index;
varying highp vec3     Interp_Particle_Force;
varying highp vec2     Interp_Particle_Coord;

varying highp float4 Interp_Particle_Color;
varying highp float Interp_Particle_Size;
varying highp float3 Interp_Particle_Position;
varying highp float3 Interp_Particle_Velocity;
varying highp float Interp_Particle_Life;
varying highp float Interp_Particle_Age;
varying highp float Interp_Particle_Dead;



//--------------------------------------------------------


#ifdef asdf_____USE_16_BIT_TEXTURES
#define ssENCODE_TO_TARGET0( Value, Min, Max ) fragOut[0] = remap( Value, 0, 65534 );
#define ssENCODE_TO_TARGET1( Value, Min, Max ) fragOut[1] = remap( Value, 0, 65534 );
#define ssENCODE_TO_TARGET2( Value, Min, Max ) fragOut[2] = remap( Value, 0, 65534 );
#define ssENCODE_TO_TARGET3( Value, Min, Max ) fragOut[3] = remap( Value, 0, 65534 );
#else
#define ssENCODE_TO_TARGET0( Value, Min, Max ) rt0 = ssEncodeFloat32( Value, Min, Max );
#define ssENCODE_TO_TARGET1( Value, Min, Max ) rt1 = ssEncodeFloat32( Value, Min, Max );
#define ssENCODE_TO_TARGET2( Value, Min, Max ) rt2 = ssEncodeFloat32( Value, Min, Max );
#define ssENCODE_TO_TARGET3( Value, Min, Max ) rt3 = ssEncodeFloat32( Value, Min, Max );
#endif


//-----------------------------------------------------------------------


int ngsModInt( int x, int y )
{
	return x - ( ( x / y ) * y );
}


//-----------------------------------------------------------------------


void ssDecodeParticle( int InstanceID )
{
	gParticle.Position   = vec3( 0.0 );
	gParticle.Velocity   = vec3( 0.0 );
	gParticle.Color      = vec4( 0.0 );
	gParticle.Size       = 0.0; 
	gParticle.Age        = 0.0;
	gParticle.Life       = 0.0;
	gParticle.Mass       = 1.0;
	gParticle.Quaternion = vec4( 0.0 );
	gParticle.Matrix     = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0 );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	ssCalculateDynamicAttributes( InstanceID, gParticle );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	ivec2  Index2D = ivec2( ngsModInt( InstanceID * ssTEXEL_COUNT_INT, ssTARGET_SIZE_INT.x ), ( InstanceID * ssTEXEL_COUNT_INT ) / ssTARGET_SIZE_INT.x );
	float2 Coord   = ( float2( Index2D ) + 0.5 ) / ssTARGET_SIZE_FLOAT;
	float2 Offset  = float2( 1.0 / ssTARGET_SIZE_FLOAT.x, 0.0 ); 
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	vec2  uv    = vec2( 0.0 );
	float Scalar0 = 0.0;
	float Scalar1 = 0.0;
	float Scalar2 = 0.0;
	float Scalar3 = 0.0;
	float Scalar4 = 0.0;
	float Scalar5 = 0.0;
	float Scalar6 = 0.0;
	float Scalar7 = 0.0;
	float Scalar8 = 0.0;
	float Scalar9 = 0.0;
	float Scalar10 = 0.0;
	float Scalar11 = 0.0;
	float Scalar12 = 0.0;
	float Scalar13 = 0.0;
	float Scalar14 = 0.0;
	float Scalar15 = 0.0;
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	uv = Coord + Offset * 0.0;
	{ vec4 renderTarget0Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget0, uv, 0.0); Scalar0  = renderTarget0Sample.x; Scalar1  = renderTarget0Sample.y; Scalar2  = renderTarget0Sample.z; Scalar3  = renderTarget0Sample.w; }
	{ vec4 renderTarget1Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget1, uv, 0.0); Scalar4  = renderTarget1Sample.x; Scalar5  = renderTarget1Sample.y; Scalar6  = renderTarget1Sample.z; Scalar7  = renderTarget1Sample.w; }
	{ vec4 renderTarget2Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget2, uv, 0.0); Scalar8  = renderTarget2Sample.x; Scalar9  = renderTarget2Sample.y; Scalar10 = renderTarget2Sample.z; Scalar11 = renderTarget2Sample.w; }
	{ vec4 renderTarget3Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget3, uv, 0.0); Scalar12 = renderTarget3Sample.x; Scalar13 = renderTarget3Sample.y; Scalar14 = renderTarget3Sample.z; Scalar15 = renderTarget3Sample.w; }
	
	gParticle.Color.x = ssDecodeFloat32( vec4( Scalar0, Scalar1, Scalar2, Scalar3 ), 0.0, 1.0 );
	gParticle.Color.y = ssDecodeFloat32( vec4( Scalar4, Scalar5, Scalar6, Scalar7 ), 0.0, 1.0 );
	gParticle.Color.z = ssDecodeFloat32( vec4( Scalar8, Scalar9, Scalar10, Scalar11 ), 0.0, 1.0 );
	gParticle.Color.w = ssDecodeFloat32( vec4( Scalar12, Scalar13, Scalar14, Scalar15 ), 0.0, 1.0 );
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	uv = Coord + Offset * 1.0;
	{ vec4 renderTarget0Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget0, uv, 0.0); Scalar0  = renderTarget0Sample.x; Scalar1  = renderTarget0Sample.y; Scalar2  = renderTarget0Sample.z; Scalar3  = renderTarget0Sample.w; }
	{ vec4 renderTarget1Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget1, uv, 0.0); Scalar4  = renderTarget1Sample.x; Scalar5  = renderTarget1Sample.y; Scalar6  = renderTarget1Sample.z; Scalar7  = renderTarget1Sample.w; }
	{ vec4 renderTarget2Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget2, uv, 0.0); Scalar8  = renderTarget2Sample.x; Scalar9  = renderTarget2Sample.y; Scalar10 = renderTarget2Sample.z; Scalar11 = renderTarget2Sample.w; }
	{ vec4 renderTarget3Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget3, uv, 0.0); Scalar12 = renderTarget3Sample.x; Scalar13 = renderTarget3Sample.y; Scalar14 = renderTarget3Sample.z; Scalar15 = renderTarget3Sample.w; }
	
	gParticle.Size = ssDecodeFloat32( vec4( Scalar0, Scalar1, Scalar2, Scalar3 ), 0.0, 100.0 );
	gParticle.Position.x = ssDecodeFloat32( vec4( Scalar4, Scalar5, Scalar6, Scalar7 ), -1000.0, 1000.0 );
	gParticle.Position.y = ssDecodeFloat32( vec4( Scalar8, Scalar9, Scalar10, Scalar11 ), -1000.0, 1000.0 );
	gParticle.Position.z = ssDecodeFloat32( vec4( Scalar12, Scalar13, Scalar14, Scalar15 ), -1000.0, 1000.0 );
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	uv = Coord + Offset * 2.0;
	{ vec4 renderTarget0Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget0, uv, 0.0); Scalar0  = renderTarget0Sample.x; Scalar1  = renderTarget0Sample.y; Scalar2  = renderTarget0Sample.z; Scalar3  = renderTarget0Sample.w; }
	{ vec4 renderTarget1Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget1, uv, 0.0); Scalar4  = renderTarget1Sample.x; Scalar5  = renderTarget1Sample.y; Scalar6  = renderTarget1Sample.z; Scalar7  = renderTarget1Sample.w; }
	{ vec4 renderTarget2Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget2, uv, 0.0); Scalar8  = renderTarget2Sample.x; Scalar9  = renderTarget2Sample.y; Scalar10 = renderTarget2Sample.z; Scalar11 = renderTarget2Sample.w; }
	{ vec4 renderTarget3Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget3, uv, 0.0); Scalar12 = renderTarget3Sample.x; Scalar13 = renderTarget3Sample.y; Scalar14 = renderTarget3Sample.z; Scalar15 = renderTarget3Sample.w; }
	
	gParticle.Velocity.x = ssDecodeFloat32( vec4( Scalar0, Scalar1, Scalar2, Scalar3 ), -1000.0, 1000.0 );
	gParticle.Velocity.y = ssDecodeFloat32( vec4( Scalar4, Scalar5, Scalar6, Scalar7 ), -1000.0, 1000.0 );
	gParticle.Velocity.z = ssDecodeFloat32( vec4( Scalar8, Scalar9, Scalar10, Scalar11 ), -1000.0, 1000.0 );
	gParticle.Life = ssDecodeFloat32( vec4( Scalar12, Scalar13, Scalar14, Scalar15 ), 0.0, 1.0 );
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	uv = Coord + Offset * 3.0;
	{ vec4 renderTarget0Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget0, uv, 0.0); Scalar0  = renderTarget0Sample.x; Scalar1  = renderTarget0Sample.y; Scalar2  = renderTarget0Sample.z; Scalar3  = renderTarget0Sample.w; }
	{ vec4 renderTarget1Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget1, uv, 0.0); Scalar4  = renderTarget1Sample.x; Scalar5  = renderTarget1Sample.y; Scalar6  = renderTarget1Sample.z; Scalar7  = renderTarget1Sample.w; }
	{ vec4 renderTarget2Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget2, uv, 0.0); Scalar8  = renderTarget2Sample.x; Scalar9  = renderTarget2Sample.y; Scalar10 = renderTarget2Sample.z; Scalar11 = renderTarget2Sample.w; }
	{ vec4 renderTarget3Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget3, uv, 0.0); Scalar12 = renderTarget3Sample.x; Scalar13 = renderTarget3Sample.y; Scalar14 = renderTarget3Sample.z; Scalar15 = renderTarget3Sample.w; }
	
	gParticle.Age = ssDecodeFloat32( vec4( Scalar0, Scalar1, Scalar2, Scalar3 ), 0.0, 1.0 );
	gParticle.Dead = ssDecodeFloat8( Scalar4, 0.0, 255.0 );
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	ssPRECISION_LIMITER2( gParticle.Velocity )
	ssPRECISION_LIMITER2( gParticle.Position )
	ssPRECISION_LIMITER2( gParticle.Color )
	ssPRECISION_LIMITER2( gParticle.Size )
	ssPRECISION_LIMITER2( gParticle.Mass )
	ssPRECISION_LIMITER2( gParticle.Life )
}


//--------------------------------------------------------


void ssEncodeParticle( float2 Coord, out vec4 rt0, out vec4 rt1, out vec4 rt2, out vec4 rt3 )
{
	#ifdef FRAGMENT_SHADER
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	int TexelIndex = int( floor( Coord.x * ssTEXEL_COUNT_FLOAT ) );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	vec4  Vector = vec4( 0.0 );
	float Scalar0 = 0.0;
	float Scalar1 = 0.0;
	float Scalar2 = 0.0;
	float Scalar3 = 0.0;
	float Scalar4 = 0.0;
	float Scalar5 = 0.0;
	float Scalar6 = 0.0;
	float Scalar7 = 0.0;
	float Scalar8 = 0.0;
	float Scalar9 = 0.0;
	float Scalar10 = 0.0;
	float Scalar11 = 0.0;
	float Scalar12 = 0.0;
	float Scalar13 = 0.0;
	float Scalar14 = 0.0;
	float Scalar15 = 0.0;
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( TexelIndex == 0 )
	{
		Vector.xyzw = ssEncodeFloat32( gParticle.Color.x, 0.0, 1.0 ); Scalar0 = Vector.x; Scalar1 = Vector.y; Scalar2 = Vector.z; Scalar3 = Vector.w;
		Vector.xyzw = ssEncodeFloat32( gParticle.Color.y, 0.0, 1.0 ); Scalar4 = Vector.x; Scalar5 = Vector.y; Scalar6 = Vector.z; Scalar7 = Vector.w;
		Vector.xyzw = ssEncodeFloat32( gParticle.Color.z, 0.0, 1.0 ); Scalar8 = Vector.x; Scalar9 = Vector.y; Scalar10 = Vector.z; Scalar11 = Vector.w;
		Vector.xyzw = ssEncodeFloat32( gParticle.Color.w, 0.0, 1.0 ); Scalar12 = Vector.x; Scalar13 = Vector.y; Scalar14 = Vector.z; Scalar15 = Vector.w;
	}
	else if ( TexelIndex == 1 )
	{
		Vector.xyzw = ssEncodeFloat32( gParticle.Size, 0.0, 100.0 );            Scalar0 = Vector.x; Scalar1 = Vector.y; Scalar2 = Vector.z; Scalar3 = Vector.w;
		Vector.xyzw = ssEncodeFloat32( gParticle.Position.x, -1000.0, 1000.0 ); Scalar4 = Vector.x; Scalar5 = Vector.y; Scalar6 = Vector.z; Scalar7 = Vector.w;
		Vector.xyzw = ssEncodeFloat32( gParticle.Position.y, -1000.0, 1000.0 ); Scalar8 = Vector.x; Scalar9 = Vector.y; Scalar10 = Vector.z; Scalar11 = Vector.w;
		Vector.xyzw = ssEncodeFloat32( gParticle.Position.z, -1000.0, 1000.0 ); Scalar12 = Vector.x; Scalar13 = Vector.y; Scalar14 = Vector.z; Scalar15 = Vector.w;
	}
	else if ( TexelIndex == 2 )
	{
		Vector.xyzw = ssEncodeFloat32( gParticle.Velocity.x, -1000.0, 1000.0 ); Scalar0 = Vector.x; Scalar1 = Vector.y; Scalar2 = Vector.z; Scalar3 = Vector.w;
		Vector.xyzw = ssEncodeFloat32( gParticle.Velocity.y, -1000.0, 1000.0 ); Scalar4 = Vector.x; Scalar5 = Vector.y; Scalar6 = Vector.z; Scalar7 = Vector.w;
		Vector.xyzw = ssEncodeFloat32( gParticle.Velocity.z, -1000.0, 1000.0 ); Scalar8 = Vector.x; Scalar9 = Vector.y; Scalar10 = Vector.z; Scalar11 = Vector.w;
		Vector.xyzw = ssEncodeFloat32( gParticle.Life, 0.0, 1.0 );              Scalar12 = Vector.x; Scalar13 = Vector.y; Scalar14 = Vector.z; Scalar15 = Vector.w;
	}
	else if ( TexelIndex == 3 )
	{
		Vector.xyzw = ssEncodeFloat32( gParticle.Age, 0.0, 1.0 ); Scalar0 = Vector.x; Scalar1 = Vector.y; Scalar2 = Vector.z; Scalar3 = Vector.w;
		Vector.x = ssEncodeFloat8( gParticle.Dead, 0.0, 255.0 );  Scalar4 = Vector.x;
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	rt0 = vec4( Scalar0,  Scalar1,  Scalar2,  Scalar3 ); 
	rt1 = vec4( Scalar4,  Scalar5,  Scalar6,  Scalar7 ); 
	rt2 = vec4( Scalar8,  Scalar9,  Scalar10, Scalar11 ); 
	rt3 = vec4( Scalar12, Scalar13, Scalar14, Scalar15 );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	//rt0 = rt1 = rt2 = rt3 = vec4( float( TexelIndex ) / max( ssTEXEL_COUNT_FLOAT - 1.0, 1.0 ), 0.0, 0.0, 1.0 );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	#endif
}


//-----------------------------------------------------------------------

#ifndef saturate // HACK 05/15/2019: SAMPLETEX() uses saturate(), but core doesn't define it. This can be removed after Core 10.59.
#define saturate(A) clamp(A, 0.0, 1.0)
#endif

//-----------------------------------------------------------------------


// Material Parameters ( Tweaks )

uniform NF_PRECISION float  burstDuration; // Title: Burst Duration
uniform NF_PRECISION float  explosionForce; // Title: Explosion Force	


// Uniforms ( Ports )

#if defined( STUDIO )
uniform NF_PRECISION float3 Port_Import_N216;
uniform NF_PRECISION float Port_Input1_N029;
uniform NF_PRECISION float3 Port_Min_N213;
uniform NF_PRECISION float3 Port_Max_N213;
uniform NF_PRECISION float Port_Import_N004;
uniform NF_PRECISION float Port_Input1_N005;
uniform NF_PRECISION float3 Port_Max_N027;
uniform NF_PRECISION float Port_Import_N214;
uniform NF_PRECISION float3 Port_Import_N212;
uniform NF_PRECISION float Port_Input1_N034;
uniform NF_PRECISION float Port_Input1_N037;
uniform NF_PRECISION float Port_Multiplier_N012;
uniform NF_PRECISION float Port_Import_N285;
uniform NF_PRECISION float3 Port_Import_N284;
uniform NF_PRECISION float Port_Import_N121;
uniform NF_PRECISION float Port_Input2_N146;
uniform NF_PRECISION float3 Port_Import_N071;
uniform NF_PRECISION float3 Port_Import_N024;
uniform NF_PRECISION float3 Port_Import_N318;
uniform NF_PRECISION float Port_Multiplier_N319;
uniform NF_PRECISION float3 Port_Import_N322;
uniform NF_PRECISION float2 Port_Input1_N326;
uniform NF_PRECISION float2 Port_Scale_N327;
uniform NF_PRECISION float2 Port_Input1_N329;
uniform NF_PRECISION float2 Port_Scale_N330;
uniform NF_PRECISION float2 Port_Input1_N332;
uniform NF_PRECISION float2 Port_Scale_N333;
uniform NF_PRECISION float3 Port_Input1_N335;
uniform NF_PRECISION float Port_Import_N075;
uniform NF_PRECISION float Port_Import_N068;
uniform NF_PRECISION float Port_Import_N082;
uniform NF_PRECISION float Port_Input0_N088;
uniform NF_PRECISION float Port_Import_N076;
uniform NF_PRECISION float Port_Import_N083;
uniform NF_PRECISION float Port_Input1_N008;
uniform NF_PRECISION float Port_Input2_N008;
uniform NF_PRECISION float Port_Input0_N099;
uniform NF_PRECISION float Port_Import_N077;
uniform NF_PRECISION float Port_Import_N084;
uniform NF_PRECISION float Port_Input1_N112;
uniform NF_PRECISION float Port_Input2_N112;
uniform NF_PRECISION float Port_Import_N087;
uniform NF_PRECISION float Port_Import_N089;
uniform NF_PRECISION float Port_Import_N116;
uniform NF_PRECISION float Port_Input2_N136;
#endif	



//-----------------------------------------------------------------------

#ifdef VERTEX_SHADER

//----------

// Globals

struct ssGlobals
{
	float gTimeElapsed;
	float gTimeDelta;
	float gTimeElapsedShifted;
	
	
};

ssGlobals tempGlobals;
#define scCustomCodeUniform	

//----------

// Functions

void Node61_Spawn_Particle_Local_Space( ssGlobals Globals )
{ 
	ssCalculateParticleSeed( gParticle );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	float DividerF = floor( sqrt( ssPARTICLE_COUNT_1D_FLOAT ) );
	int   DividerI = int( DividerF );
	
	gParticle.Position   = vec3( float( ngsModInt( gParticle.Index1D, DividerI ) ) / DividerF * 2.0 - 1.0, float( gParticle.Index1D / DividerI ) / DividerF * 2.0 - 1.0, 0.0 ) * 20.0 + vec3( 1.0, 1.0, 0.0 );
	gParticle.Velocity   = vec3( 0.0 );
	gParticle.Color	     = vec4( 1.0 ); 
	gParticle.Dead       = 0.0;
	gParticle.Age        = 0.0;
	gParticle.Life       = ssPARTICLE_LIFE_MAX;  
	gParticle.Size       = 1.0;//mix( 0.4, 0.8, rand( vec2( gParticle.Seed, 0.3453 ) ) );
	gParticle.Mass	     = 1.0; 
	gParticle.Quaternion = vec4( 0.0, 0.0, 0.0, 1.0 );
	gParticle.Matrix     = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0 );
}
#define Node216_Float_Import( Import, Value, Globals ) Value = Import
#define Node3_Droplist_Import( Value, Globals ) Value = 0.0
#define Node29_Is_Equal( Input0, Input1, Output, Globals ) Output = ssEqual( Input0, Input1 )
void Node213_Particle_Random( in float3 Min, in float3 Max, out float3 Random, ssGlobals Globals )
{ 
	vec4 RandomVec4 = ssGetParticleRandom( 3, true, true, true, 213.0, gParticle.Seed2000, 1.0, Globals.gTimeElapsed );
	Random = mix( Min, Max, RandomVec4.xyz );
}
#define Node253_Length( Input0, Output, Globals ) Output = length( Input0 )
#define Node255_Divide( Input0, Input1, Output, Globals ) Output = Input0 / float3(Input1)
#define Node4_Float_Import( Import, Value, Globals ) Value = clamp( Import, 0.0, 1.0 )
#define Node106_One_Minus( Input0, Output, Globals ) Output = 1.0 - Input0
#define Node5_Pow( Input0, Input1, Output, Globals ) Output = ( Input0 <= 0.0 ) ? 0.0 : pow( Input0, Input1 )
void Node27_Particle_Random( in float3 Min, in float3 Max, out float3 Random, ssGlobals Globals )
{ 
	vec4 RandomVec4 = ssGetParticleRandom( 3, true, true, true, 27.0, gParticle.Seed2000, 1.0, Globals.gTimeElapsed );
	Random = mix( Min, Max, RandomVec4.xyz );
}
#define Node28_Sqrt( Input0, Output, Globals ) Output = vec3( ( Input0.x <= 0.0 ) ? 0.0 : sqrt( Input0.x ), ( Input0.y <= 0.0 ) ? 0.0 : sqrt( Input0.y ), ( Input0.z <= 0.0 ) ? 0.0 : sqrt( Input0.z ) )
#define Node30_Sqrt( Input0, Output, Globals ) Output = vec3( ( Input0.x <= 0.0 ) ? 0.0 : sqrt( Input0.x ), ( Input0.y <= 0.0 ) ? 0.0 : sqrt( Input0.y ), ( Input0.z <= 0.0 ) ? 0.0 : sqrt( Input0.z ) )
#define Node214_Float_Import( Import, Value, Globals ) Value = Import
#define Node212_Float_Import( Import, Value, Globals ) Value = Import
#define Node256_Multiply( Input0, Input1, Input2, Input3, Output, Globals ) Output = Input0 * Input1 * float3(Input2) * Input3
void Node31_Split_Vector( in float3 Value, out float Value1, out float Value2, out float Value3, ssGlobals Globals )
{ 
	Value1 = Value.x;
	Value2 = Value.y;
	Value3 = Value.z;
}
#define Node32_Abs( Input0, Output, Globals ) Output = abs( Input0 )
void Node33_If_else( in float Bool1, in float Value1, in float Default, out float Result, ssGlobals Globals )
{ 
	/* Input port: "Bool1"  */
	
	{
		float Value_N3 = 0.0; Node3_Droplist_Import( Value_N3, Globals );
		float Output_N29 = 0.0; Node29_Is_Equal( Value_N3, NF_PORT_CONSTANT( float( 1.0 ), Port_Input1_N029 ), Output_N29, Globals );
		
		Bool1 = Output_N29;
	}
	if ( bool( Bool1 * 1.0 != 0.0 ) )
	{
		/* Input port: "Value1"  */
		
		{
			float3 Random_N213 = float3(0.0); Node213_Particle_Random( NF_PORT_CONSTANT( float3( -1.0, -1.0, -1.0 ), Port_Min_N213 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Max_N213 ), Random_N213, Globals );
			float Output_N253 = 0.0; Node253_Length( Random_N213, Output_N253, Globals );
			float3 Output_N255 = float3(0.0); Node255_Divide( Random_N213, Output_N253, Output_N255, Globals );
			float Value_N4 = 0.0; Node4_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N004 ), Value_N4, Globals );
			float Output_N106 = 0.0; Node106_One_Minus( Value_N4, Output_N106, Globals );
			float Output_N5 = 0.0; Node5_Pow( Output_N106, NF_PORT_CONSTANT( float( 4.0 ), Port_Input1_N005 ), Output_N5, Globals );
			float3 Random_N27 = float3(0.0); Node27_Particle_Random( float3( Output_N5 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Max_N027 ), Random_N27, Globals );
			float3 Output_N28 = float3(0.0); Node28_Sqrt( Random_N27, Output_N28, Globals );
			float3 Output_N30 = float3(0.0); Node30_Sqrt( Output_N28, Output_N30, Globals );
			float Value_N214 = 0.0; Node214_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N214 ), Value_N214, Globals );
			float3 Value_N212 = float3(0.0); Node212_Float_Import( NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Import_N212 ), Value_N212, Globals );
			float3 Output_N256 = float3(0.0); Node256_Multiply( Output_N255, Output_N30, Value_N214, Value_N212, Output_N256, Globals );
			float Value1_N31 = 0.0; float Value2_N31 = 0.0; float Value3_N31 = 0.0; Node31_Split_Vector( Output_N256, Value1_N31, Value2_N31, Value3_N31, Globals );
			float Output_N32 = 0.0; Node32_Abs( Value1_N31, Output_N32, Globals );
			
			Value1 = Output_N32;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float3 Random_N213 = float3(0.0); Node213_Particle_Random( NF_PORT_CONSTANT( float3( -1.0, -1.0, -1.0 ), Port_Min_N213 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Max_N213 ), Random_N213, Globals );
			float Output_N253 = 0.0; Node253_Length( Random_N213, Output_N253, Globals );
			float3 Output_N255 = float3(0.0); Node255_Divide( Random_N213, Output_N253, Output_N255, Globals );
			float Value_N4 = 0.0; Node4_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N004 ), Value_N4, Globals );
			float Output_N106 = 0.0; Node106_One_Minus( Value_N4, Output_N106, Globals );
			float Output_N5 = 0.0; Node5_Pow( Output_N106, NF_PORT_CONSTANT( float( 4.0 ), Port_Input1_N005 ), Output_N5, Globals );
			float3 Random_N27 = float3(0.0); Node27_Particle_Random( float3( Output_N5 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Max_N027 ), Random_N27, Globals );
			float3 Output_N28 = float3(0.0); Node28_Sqrt( Random_N27, Output_N28, Globals );
			float3 Output_N30 = float3(0.0); Node30_Sqrt( Output_N28, Output_N30, Globals );
			float Value_N214 = 0.0; Node214_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N214 ), Value_N214, Globals );
			float3 Value_N212 = float3(0.0); Node212_Float_Import( NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Import_N212 ), Value_N212, Globals );
			float3 Output_N256 = float3(0.0); Node256_Multiply( Output_N255, Output_N30, Value_N214, Value_N212, Output_N256, Globals );
			float Value1_N31 = 0.0; float Value2_N31 = 0.0; float Value3_N31 = 0.0; Node31_Split_Vector( Output_N256, Value1_N31, Value2_N31, Value3_N31, Globals );
			
			Default = Value1_N31;
		}
		Result = Default;
	}
}
#define Node34_Is_Equal( Input0, Input1, Output, Globals ) Output = ssEqual( Input0, Input1 )
#define Node35_Abs( Input0, Output, Globals ) Output = abs( Input0 )
void Node36_If_else( in float Bool1, in float Value1, in float Default, out float Result, ssGlobals Globals )
{ 
	/* Input port: "Bool1"  */
	
	{
		float Value_N3 = 0.0; Node3_Droplist_Import( Value_N3, Globals );
		float Output_N34 = 0.0; Node34_Is_Equal( Value_N3, NF_PORT_CONSTANT( float( 2.0 ), Port_Input1_N034 ), Output_N34, Globals );
		
		Bool1 = Output_N34;
	}
	if ( bool( Bool1 * 1.0 != 0.0 ) )
	{
		/* Input port: "Value1"  */
		
		{
			float3 Random_N213 = float3(0.0); Node213_Particle_Random( NF_PORT_CONSTANT( float3( -1.0, -1.0, -1.0 ), Port_Min_N213 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Max_N213 ), Random_N213, Globals );
			float Output_N253 = 0.0; Node253_Length( Random_N213, Output_N253, Globals );
			float3 Output_N255 = float3(0.0); Node255_Divide( Random_N213, Output_N253, Output_N255, Globals );
			float Value_N4 = 0.0; Node4_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N004 ), Value_N4, Globals );
			float Output_N106 = 0.0; Node106_One_Minus( Value_N4, Output_N106, Globals );
			float Output_N5 = 0.0; Node5_Pow( Output_N106, NF_PORT_CONSTANT( float( 4.0 ), Port_Input1_N005 ), Output_N5, Globals );
			float3 Random_N27 = float3(0.0); Node27_Particle_Random( float3( Output_N5 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Max_N027 ), Random_N27, Globals );
			float3 Output_N28 = float3(0.0); Node28_Sqrt( Random_N27, Output_N28, Globals );
			float3 Output_N30 = float3(0.0); Node30_Sqrt( Output_N28, Output_N30, Globals );
			float Value_N214 = 0.0; Node214_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N214 ), Value_N214, Globals );
			float3 Value_N212 = float3(0.0); Node212_Float_Import( NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Import_N212 ), Value_N212, Globals );
			float3 Output_N256 = float3(0.0); Node256_Multiply( Output_N255, Output_N30, Value_N214, Value_N212, Output_N256, Globals );
			float Value1_N31 = 0.0; float Value2_N31 = 0.0; float Value3_N31 = 0.0; Node31_Split_Vector( Output_N256, Value1_N31, Value2_N31, Value3_N31, Globals );
			float Output_N35 = 0.0; Node35_Abs( Value2_N31, Output_N35, Globals );
			
			Value1 = Output_N35;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float3 Random_N213 = float3(0.0); Node213_Particle_Random( NF_PORT_CONSTANT( float3( -1.0, -1.0, -1.0 ), Port_Min_N213 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Max_N213 ), Random_N213, Globals );
			float Output_N253 = 0.0; Node253_Length( Random_N213, Output_N253, Globals );
			float3 Output_N255 = float3(0.0); Node255_Divide( Random_N213, Output_N253, Output_N255, Globals );
			float Value_N4 = 0.0; Node4_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N004 ), Value_N4, Globals );
			float Output_N106 = 0.0; Node106_One_Minus( Value_N4, Output_N106, Globals );
			float Output_N5 = 0.0; Node5_Pow( Output_N106, NF_PORT_CONSTANT( float( 4.0 ), Port_Input1_N005 ), Output_N5, Globals );
			float3 Random_N27 = float3(0.0); Node27_Particle_Random( float3( Output_N5 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Max_N027 ), Random_N27, Globals );
			float3 Output_N28 = float3(0.0); Node28_Sqrt( Random_N27, Output_N28, Globals );
			float3 Output_N30 = float3(0.0); Node30_Sqrt( Output_N28, Output_N30, Globals );
			float Value_N214 = 0.0; Node214_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N214 ), Value_N214, Globals );
			float3 Value_N212 = float3(0.0); Node212_Float_Import( NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Import_N212 ), Value_N212, Globals );
			float3 Output_N256 = float3(0.0); Node256_Multiply( Output_N255, Output_N30, Value_N214, Value_N212, Output_N256, Globals );
			float Value1_N31 = 0.0; float Value2_N31 = 0.0; float Value3_N31 = 0.0; Node31_Split_Vector( Output_N256, Value1_N31, Value2_N31, Value3_N31, Globals );
			
			Default = Value2_N31;
		}
		Result = Default;
	}
}
#define Node37_Is_Equal( Input0, Input1, Output, Globals ) Output = ssEqual( Input0, Input1 )
#define Node38_Abs( Input0, Output, Globals ) Output = abs( Input0 )
void Node41_If_else( in float Bool1, in float Value1, in float Default, out float Result, ssGlobals Globals )
{ 
	/* Input port: "Bool1"  */
	
	{
		float Value_N3 = 0.0; Node3_Droplist_Import( Value_N3, Globals );
		float Output_N37 = 0.0; Node37_Is_Equal( Value_N3, NF_PORT_CONSTANT( float( 3.0 ), Port_Input1_N037 ), Output_N37, Globals );
		
		Bool1 = Output_N37;
	}
	if ( bool( Bool1 * 1.0 != 0.0 ) )
	{
		/* Input port: "Value1"  */
		
		{
			float3 Random_N213 = float3(0.0); Node213_Particle_Random( NF_PORT_CONSTANT( float3( -1.0, -1.0, -1.0 ), Port_Min_N213 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Max_N213 ), Random_N213, Globals );
			float Output_N253 = 0.0; Node253_Length( Random_N213, Output_N253, Globals );
			float3 Output_N255 = float3(0.0); Node255_Divide( Random_N213, Output_N253, Output_N255, Globals );
			float Value_N4 = 0.0; Node4_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N004 ), Value_N4, Globals );
			float Output_N106 = 0.0; Node106_One_Minus( Value_N4, Output_N106, Globals );
			float Output_N5 = 0.0; Node5_Pow( Output_N106, NF_PORT_CONSTANT( float( 4.0 ), Port_Input1_N005 ), Output_N5, Globals );
			float3 Random_N27 = float3(0.0); Node27_Particle_Random( float3( Output_N5 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Max_N027 ), Random_N27, Globals );
			float3 Output_N28 = float3(0.0); Node28_Sqrt( Random_N27, Output_N28, Globals );
			float3 Output_N30 = float3(0.0); Node30_Sqrt( Output_N28, Output_N30, Globals );
			float Value_N214 = 0.0; Node214_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N214 ), Value_N214, Globals );
			float3 Value_N212 = float3(0.0); Node212_Float_Import( NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Import_N212 ), Value_N212, Globals );
			float3 Output_N256 = float3(0.0); Node256_Multiply( Output_N255, Output_N30, Value_N214, Value_N212, Output_N256, Globals );
			float Value1_N31 = 0.0; float Value2_N31 = 0.0; float Value3_N31 = 0.0; Node31_Split_Vector( Output_N256, Value1_N31, Value2_N31, Value3_N31, Globals );
			float Output_N38 = 0.0; Node38_Abs( Value3_N31, Output_N38, Globals );
			
			Value1 = Output_N38;
		}
		Result = Value1;
	}
	else
	{
		/* Input port: "Default"  */
		
		{
			float3 Random_N213 = float3(0.0); Node213_Particle_Random( NF_PORT_CONSTANT( float3( -1.0, -1.0, -1.0 ), Port_Min_N213 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Max_N213 ), Random_N213, Globals );
			float Output_N253 = 0.0; Node253_Length( Random_N213, Output_N253, Globals );
			float3 Output_N255 = float3(0.0); Node255_Divide( Random_N213, Output_N253, Output_N255, Globals );
			float Value_N4 = 0.0; Node4_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N004 ), Value_N4, Globals );
			float Output_N106 = 0.0; Node106_One_Minus( Value_N4, Output_N106, Globals );
			float Output_N5 = 0.0; Node5_Pow( Output_N106, NF_PORT_CONSTANT( float( 4.0 ), Port_Input1_N005 ), Output_N5, Globals );
			float3 Random_N27 = float3(0.0); Node27_Particle_Random( float3( Output_N5 ), NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Max_N027 ), Random_N27, Globals );
			float3 Output_N28 = float3(0.0); Node28_Sqrt( Random_N27, Output_N28, Globals );
			float3 Output_N30 = float3(0.0); Node30_Sqrt( Output_N28, Output_N30, Globals );
			float Value_N214 = 0.0; Node214_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N214 ), Value_N214, Globals );
			float3 Value_N212 = float3(0.0); Node212_Float_Import( NF_PORT_CONSTANT( float3( 1.0, 1.0, 1.0 ), Port_Import_N212 ), Value_N212, Globals );
			float3 Output_N256 = float3(0.0); Node256_Multiply( Output_N255, Output_N30, Value_N214, Value_N212, Output_N256, Globals );
			float Value1_N31 = 0.0; float Value2_N31 = 0.0; float Value3_N31 = 0.0; Node31_Split_Vector( Output_N256, Value1_N31, Value2_N31, Value3_N31, Globals );
			
			Default = Value3_N31;
		}
		Result = Default;
	}
}
#define Node42_Construct_Vector( Value1, Value2, Value3, Value, Globals ) Value.x = Value1; Value.y = Value2; Value.z = Value3
#define Node215_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
#define Node219_Modify_Attribute_Set_Position( Value, Globals ) gParticle.Position = Value
#define Node12_Elapsed_Time( Multiplier, Time, Globals ) Time = Globals.gTimeElapsedShifted * Multiplier
void Node11_Float_Parameter( out float Output, ssGlobals Globals ) { Output = burstDuration; }
#define Node13_Is_Greater( Input0, Input1, Output, Globals ) Output = ssLarger( Input0, Input1 )
void Node10_Kill_Particle( in float Condition, ssGlobals Globals )
{ 
	if ( Condition * 1.0 != 0.0 )
	{
		gParticle.Dead = 128.0;
	}
}
#define Node65_Particle_Get_Attribute( Value, Globals ) Value = gParticle.Position
void Node69_Normalize( in float3 Input0, out float3 Output, ssGlobals Globals )
{ 
	float lengthSquared = dot( Input0, Input0 );
	float l = ( lengthSquared > 0.0 ) ? 1.0 / sqrt( lengthSquared  ) : 0.0;
	Output = Input0 * l;
}
void Node166_Float_Parameter( out float Output, ssGlobals Globals ) { Output = explosionForce; }
#define Node70_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * float3(Input1)
#define Node86_Modify_Attribute_Set_Force( Value, Globals ) gParticle.Force = Value
#define Node285_Float_Import( Import, Value, Globals ) Value = Import
#define Node284_Float_Import( Import, Value, Globals ) Value = Import
#define Node279_Particle_Get_Attribute( Value, Globals ) Value = gParticle.Position
#define Node281_Subtract( Input0, Input1, Output, Globals ) Output = Input0 - Input1
void Node282_Normalize( in float3 Input0, out float3 Output, ssGlobals Globals )
{ 
	float lengthSquared = dot( Input0, Input0 );
	float l = ( lengthSquared > 0.0 ) ? 1.0 / sqrt( lengthSquared  ) : 0.0;
	Output = Input0 * l;
}
#define Node283_Multiply( Input0, Input1, Output, Globals ) Output = float3(Input0) * Input1
#define Node276_Modify_Attribute_Add_Force( Value, Globals ) gParticle.Force += Value
#define Node121_Float_Import( Import, Value, Globals ) Value = Import
#define Node140_Particle_Get_Attribute( Value, Globals ) Value = gParticle.Mass
#define Node146_Multiply( Input0, Input1, Input2, Output, Globals ) Output = Input0 * Input1 * Input2
#define Node148_Swizzle( Input, Output, Globals ) Output = float3( 0.0, Input, 0.0 )
#define Node149_Modify_Attribute_Add_Force( Value, Globals ) gParticle.Force += Value
void SpawnParticle( ssGlobals Globals )
{
	Node61_Spawn_Particle_Local_Space( Globals );
	float3 Value_N216 = float3(0.0); Node216_Float_Import( NF_PORT_CONSTANT( float3( 0.0, 0.0, 0.0 ), Port_Import_N216 ), Value_N216, Globals );
	float Result_N33 = 0.0; Node33_If_else( float( 0.0 ), float( 0.0 ), float( 0.0 ), Result_N33, Globals );
	float Result_N36 = 0.0; Node36_If_else( float( 0.0 ), float( 0.0 ), float( 0.0 ), Result_N36, Globals );
	float Result_N41 = 0.0; Node41_If_else( float( 0.0 ), float( 0.0 ), float( 0.0 ), Result_N41, Globals );
	float3 Value_N42 = float3(0.0); Node42_Construct_Vector( Result_N33, Result_N36, Result_N41, Value_N42, Globals );
	float3 Output_N215 = float3(0.0); Node215_Add( Value_N216, Value_N42, Output_N215, Globals );
	Node219_Modify_Attribute_Set_Position( Output_N215, Globals );
	float Time_N12 = 0.0; Node12_Elapsed_Time( NF_PORT_CONSTANT( float( 1.0 ), Port_Multiplier_N012 ), Time_N12, Globals );
	float Output_N11 = 0.0; Node11_Float_Parameter( Output_N11, Globals );
	float Output_N13 = 0.0; Node13_Is_Greater( Time_N12, Output_N11, Output_N13, Globals );
	Node10_Kill_Particle( Output_N13, Globals );
	float3 Value_N65 = float3(0.0); Node65_Particle_Get_Attribute( Value_N65, Globals );
	float3 Output_N69 = float3(0.0); Node69_Normalize( Value_N65, Output_N69, Globals );
	float Output_N166 = 0.0; Node166_Float_Parameter( Output_N166, Globals );
	float3 Output_N70 = float3(0.0); Node70_Multiply( Output_N69, Output_N166, Output_N70, Globals );
	Node86_Modify_Attribute_Set_Force( Output_N70, Globals );
	float Value_N285 = 0.0; Node285_Float_Import( NF_PORT_CONSTANT( float( -200.0 ), Port_Import_N285 ), Value_N285, Globals );
	float3 Value_N284 = float3(0.0); Node284_Float_Import( NF_PORT_CONSTANT( float3( 0.0, 0.0, 0.0 ), Port_Import_N284 ), Value_N284, Globals );
	float3 Value_N279 = float3(0.0); Node279_Particle_Get_Attribute( Value_N279, Globals );
	float3 Output_N281 = float3(0.0); Node281_Subtract( Value_N284, Value_N279, Output_N281, Globals );
	float3 Output_N282 = float3(0.0); Node282_Normalize( Output_N281, Output_N282, Globals );
	float3 Output_N283 = float3(0.0); Node283_Multiply( Value_N285, Output_N282, Output_N283, Globals );
	Node276_Modify_Attribute_Add_Force( Output_N283, Globals );
	float Value_N121 = 0.0; Node121_Float_Import( NF_PORT_CONSTANT( float( -1.0 ), Port_Import_N121 ), Value_N121, Globals );
	float Value_N140 = 0.0; Node140_Particle_Get_Attribute( Value_N140, Globals );
	float Output_N146 = 0.0; Node146_Multiply( Value_N121, Value_N140, NF_PORT_CONSTANT( float( -980.0 ), Port_Input2_N146 ), Output_N146, Globals );
	float3 Output_N148 = float3(0.0); Node148_Swizzle( Output_N146, Output_N148, Globals );
	Node149_Modify_Attribute_Add_Force( Output_N148, Globals );
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	gParticle.Velocity += gParticle.Force / gParticle.Mass * 0.03333; // make sure the velocity added on spawn is always the same...
	gParticle.Force = vec3( 0.0 );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	
	gParticle.Position = ( ngsModelMatrix * vec4( gParticle.Position, 1.0 ) ).xyz; 
	gParticle.Velocity = mat3( ngsModelMatrix ) * gParticle.Velocity;
	gParticle.Force    = mat3( ngsModelMatrix ) * gParticle.Force;
	gParticle.Matrix   = mat3( ngsModelMatrix ) * gParticle.Matrix;
	
}
#define Node25_Particle_Spawn_End( Globals ) /*nothing*/
#define Node85_Update_Particle_World_Space( Globals ) // does nothing
#define Node71_Float_Import( Import, Value, Globals ) Value = Import
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) 
{
	if ( DEVICE_IS_FAST )
	{
		// Precompute values for skewed triangular grid
		const vec4 C = vec4(0.211324865405187,
			// (3.0-sqrt(3.0))/6.0
			0.366025403784439,
			// 0.5*(sqrt(3.0)-1.0)
			-0.577350269189626,
			// -1.0 + 2.0 * C.x
			0.024390243902439);
		// 1.0 / 41.0
		
		// First corner (x0)
		vec2 i  = floor(v + dot(v, C.yy));
		vec2 x0 = v - i + dot(i, C.xx);
		
		// Other two corners (x1, x2)
		vec2 i1 = vec2(0.0);
		i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
		vec2 x1 = x0.xy + C.xx - i1;
		vec2 x2 = x0.xy + C.zz;
		
		// Do some permutations to avoid
		// truncation effects in permutation
		i = mod289(i);
		vec3 p = permute(
			permute( i.y + vec3(0.0, i1.y, 1.0))
			+ i.x + vec3(0.0, i1.x, 1.0 ));
		
		vec3 m = max(0.5 - vec3(
				dot(x0,x0),
				dot(x1,x1),
				dot(x2,x2)
			), 0.0);
		
		m = m*m ;
		m = m*m ;
		
		// Gradients:
		//  41 pts uniformly over a line, mapped onto a diamond
		//  The ring size 17*17 = 289 is close to a multiple
		//      of 41 (41*7 = 287)
		
		vec3 x = 2.0 * fract(p * C.www) - 1.0;
		vec3 h = abs(x) - 0.5;
		vec3 ox = floor(x + 0.5);
		vec3 a0 = x - ox;
		
		// Normalise gradients implicitly by scaling m
		// Approximation of: m *= inversesqrt(a0*a0 + h*h);
		m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
		
		// Compute final noise value at P
		vec3 g = vec3(0.0);
		g.x  = a0.x  * x0.x  + h.x  * x0.y;
		g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
		return 130.0 * dot(m, g);
	}
	else
	{
		return 0.0;
	}
}
#define Node23_Particle_Get_Attribute( Value, Globals ) Value = gParticle.Position
#define Node24_Float_Import( Import, Value, Globals ) Value = Import
#define Node318_Float_Import( Import, Value, Globals ) Value = Import
#define Node319_Elapsed_Time( Multiplier, Time, Globals ) Time = Globals.gTimeElapsedShifted * Multiplier
#define Node320_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * float3(Input1)
#define Node321_Add( Input0, Input1, Input2, Output, Globals ) Output = Input0 + Input1 + Input2
#define Node322_Float_Import( Import, Value, Globals ) Value = Import
#define Node323_Reciprocal( Input0, Output, Globals ) Output = 1.0 / Input0
#define Node324_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node325_Swizzle( Input, Output, Globals ) Output = float2( Input.x, Input.y )
#define Node326_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
void Node327_Noise_Simplex( in float2 Seed, in float2 Scale, out float Noise, ssGlobals Globals )
{ 
	ssPRECISION_LIMITER( Seed.x )
	ssPRECISION_LIMITER( Seed.y )
	Seed *= Scale * 0.5;
	Noise = snoise( Seed ) * 0.5 + 0.5;
	ssPRECISION_LIMITER( Noise );
}
#define Node328_Swizzle( Input, Output, Globals ) Output = float2( Input.y, Input.z )
#define Node329_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
void Node330_Noise_Simplex( in float2 Seed, in float2 Scale, out float Noise, ssGlobals Globals )
{ 
	ssPRECISION_LIMITER( Seed.x )
	ssPRECISION_LIMITER( Seed.y )
	Seed *= Scale * 0.5;
	Noise = snoise( Seed ) * 0.5 + 0.5;
	ssPRECISION_LIMITER( Noise );
}
#define Node331_Swizzle( Input, Output, Globals ) Output = float2( Input.z, Input.x )
#define Node332_Add( Input0, Input1, Output, Globals ) Output = Input0 + Input1
void Node333_Noise_Simplex( in float2 Seed, in float2 Scale, out float Noise, ssGlobals Globals )
{ 
	ssPRECISION_LIMITER( Seed.x )
	ssPRECISION_LIMITER( Seed.y )
	Seed *= Scale * 0.5;
	Noise = snoise( Seed ) * 0.5 + 0.5;
	ssPRECISION_LIMITER( Noise );
}
#define Node334_Construct_Vector( Value1, Value2, Value3, Value, Globals ) Value.x = Value1; Value.y = Value2; Value.z = Value3
#define Node335_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node336_Subtract_One( Input0, Output, Globals ) Output = Input0 - 1.0
#define Node337_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node338_Modify_Attribute_Add_Force( Value, Globals ) gParticle.Force += Value
#define Node75_Float_Import( Import, Value, Globals ) Value = Import
#define Node68_Float_Import( Import, Value, Globals ) Value = Import
#define Node179_Particle_Get_Attribute( Value, Globals ) Value = clamp( gParticle.Age / gParticle.Life, 0.0, 1.0 )
#define Node82_Float_Import( Import, Value, Globals ) Value = Import
#define Node76_Float_Import( Import, Value, Globals ) Value = Import
#define Node6_Particle_Get_Attribute( Value, Globals ) Value = gParticle.Life
#define Node114_Divide( Input0, Input1, Output, Globals ) Output = Input0 / Input1
#define Node83_Float_Import( Import, Value, Globals ) Value = Import
#define Node88_Divide( Input0, Input1, Output, Globals ) Output = Input0 / Input1
#define Node111_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node8_Clamp( Input0, Input1, Input2, Output, Globals ) Output = clamp( Input0 + 0.001, Input1 + 0.001, Input2 + 0.001 ) - 0.001
#define Node184_One_Minus( Input0, Output, Globals ) Output = 1.0 - Input0
#define Node77_Float_Import( Import, Value, Globals ) Value = Import
#define Node147_Divide( Input0, Input1, Output, Globals ) Output = Input0 / Input1
#define Node84_Float_Import( Import, Value, Globals ) Value = Import
#define Node99_Divide( Input0, Input1, Output, Globals ) Output = Input0 / Input1
#define Node113_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node112_Clamp( Input0, Input1, Input2, Output, Globals ) Output = clamp( Input0 + 0.001, Input1 + 0.001, Input2 + 0.001 ) - 0.001
#define Node177_Multiply( Input0, Input1, Output, Globals ) Output = Input0 * Input1
#define Node178_Float_Export( Value, Export, Globals ) Export = Value
#define Node9_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, Input2 )
#define Node174_Modify_Attribute_Set_Size( Value, Globals ) gParticle.Size = Value
#define Node67_Particle_Get_Attribute( Value, Globals ) Value = gParticle.Color
#define Node87_Float_Import( Import, Value, Globals ) Value = Import
#define Node89_Float_Import( Import, Value, Globals ) Value = Import
#define Node91_Particle_Get_Attribute( Value, Globals ) Value = clamp( gParticle.Age / gParticle.Life, 0.0, 1.0 )
#define Node98_Mix( Input0, Input1, Input2, Output, Globals ) Output = mix( Input0, Input1, Input2 )
#define Node176_Construct_Vector( Value1, Value2, Value, Globals ) Value.xyz = Value1; Value.w = Value2
#define Node108_Modify_Attribute_Set_Color( Value, Globals ) gParticle.Color = Value
#define Node116_Float_Import( Import, Value, Globals ) Value = Import
#define Node117_Particle_Get_Attribute( Value, Globals ) Value = gParticle.Mass
#define Node136_Multiply( Input0, Input1, Input2, Output, Globals ) Output = Input0 * Input1 * Input2
#define Node137_Swizzle( Input, Output, Globals ) Output = float3( 0.0, Input, 0.0 )
#define Node138_Modify_Attribute_Add_Force( Value, Globals ) gParticle.Force += Value

//-----------------------------------------------------------------------

void main() 
{
	sc_Vertex_t v = sc_LoadVertexAttributes();
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( sc_IsEditor )
	{
		v.texture0.x += _sc_allow16TexturesMarker;
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	int InstanceID = sc_LocalInstanceID;
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	ssDecodeParticle( InstanceID );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	ssGlobals Globals;
	Globals.gTimeElapsed        = ( overrideTimeEnabled == 1 ) ? overrideTimeElapsed : sc_TimeElapsed;
	Globals.gTimeDelta          = ( overrideTimeEnabled == 1 ) ? overrideTimeDelta : max( sc_TimeDelta, ssDELTA_TIME_MIN );
	Globals.gTimeElapsedShifted = Globals.gTimeElapsed - gParticle.TimeShift * Globals.gTimeDelta - 0.0;
	
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	/* Warmup */
	
	float Warmup = 0.0;
	float Delay  = 0.0;
	
	#if 0
	
	Warmup = 1.0;
	
	int Frames = 1;
	if ( ngsFrame < 2 )
	{
		Globals.gTimeDelta = 0.0333333;
		Globals.gTimeElapsed -= 1.0;
		Globals.gTimeElapsedShifted -= 1.0;
		Frames = 30;
	}
	
	for ( int i = 0; i < Frames; i++ )
	
	#endif
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	{
		#if 1 // continuous
		
		gParticle.Age = mod( Globals.gTimeElapsedShifted - gParticle.SpawnOffset, ssPARTICLE_TOTAL_LIFE_MAX );
		bool Dead = ( Globals.gTimeElapsed - gParticle.SpawnOffset < Delay - Warmup || gParticle.Age > ssPARTICLE_LIFE_MAX ) ? true : false;
		
		if ( !Dead && gParticle.Life <= 0.0001 || mod( Globals.gTimeElapsed - gParticle.SpawnOffset - Delay + Warmup, ssPARTICLE_TOTAL_LIFE_MAX ) <= Globals.gTimeDelta )
		{
			SpawnParticle( Globals );
			gParticle.Spawned = true;
		}
		
		#elif 0 // burst
		
		gParticle.Age = mod( Globals.gTimeElapsedShifted - gParticle.SpawnOffset, ssPARTICLE_TOTAL_LIFE_MAX );
		bool Dead = ( Globals.gTimeElapsed - gParticle.SpawnOffset < Delay - Warmup || gParticle.Age > ssPARTICLE_LIFE_MAX ) ? true : false;
		
		// epsilong to avoid decompression precision
		
		if ( !Dead && ( gParticle.Life < 0.0001 || mod( Globals.gTimeElapsed - gParticle.SpawnOffset - Delay + Warmup, ssPARTICLE_TOTAL_LIFE_MAX ) <= Globals.gTimeDelta ) )
		{
			SpawnParticle( Globals );
			gParticle.Spawned = true;
		}
		
		#elif 0 // once - live forever
		
		if ( gParticle.Life < 0.1 )
		{
			SpawnParticle( Globals );
			gParticle.Spawned = true;	
			gParticle.Age  = Globals.gTimeElapsedShifted;
		}
		
		gParticle.Life = 1.0;
		
		#else // once - max life
		
		gParticle.Age = Globals.gTimeElapsedShifted + 0.0;
		
		if ( gParticle.Age >= ssPARTICLE_LIFE_MAX )
		{
			gParticle.Spawned = false;
			gParticle.Life = 0.0;
			gParticle.Age  = 0.0;
		}
		else if ( gParticle.Life < 0.1 )
		{
			gParticle.Life = ssPARTICLE_LIFE_MAX;
			SpawnParticle( Globals );
			gParticle.Spawned = true;
			gParticle.Age  = 0.0;					
		}
		else 
		{
			gParticle.Age = Globals.gTimeElapsedShifted + 0.0;
		}
		
		#endif
		
		// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
		
		// Execution Code
		
		Node25_Particle_Spawn_End( Globals );
		Node85_Update_Particle_World_Space( Globals );
		float3 Value_N71 = float3(0.0); Node71_Float_Import( NF_PORT_CONSTANT( float3( 5.0, 5.0, 5.0 ), Port_Import_N071 ), Value_N71, Globals );
		float3 Value_N23 = float3(0.0); Node23_Particle_Get_Attribute( Value_N23, Globals );
		float3 Value_N24 = float3(0.0); Node24_Float_Import( NF_PORT_CONSTANT( float3( 0.0, 0.0, 0.0 ), Port_Import_N024 ), Value_N24, Globals );
		float3 Value_N318 = float3(0.0); Node318_Float_Import( NF_PORT_CONSTANT( float3( 0.0, 0.0, 0.0 ), Port_Import_N318 ), Value_N318, Globals );
		float Time_N319 = 0.0; Node319_Elapsed_Time( NF_PORT_CONSTANT( float( 1.0 ), Port_Multiplier_N319 ), Time_N319, Globals );
		float3 Output_N320 = float3(0.0); Node320_Multiply( Value_N318, Time_N319, Output_N320, Globals );
		float3 Output_N321 = float3(0.0); Node321_Add( Value_N23, Value_N24, Output_N320, Output_N321, Globals );
		float3 Value_N322 = float3(0.0); Node322_Float_Import( NF_PORT_CONSTANT( float3( 15.0, 15.0, 15.0 ), Port_Import_N322 ), Value_N322, Globals );
		float3 Output_N323 = float3(0.0); Node323_Reciprocal( Value_N322, Output_N323, Globals );
		float3 Output_N324 = float3(0.0); Node324_Multiply( Output_N321, Output_N323, Output_N324, Globals );
		float2 Output_N325 = float2(0.0); Node325_Swizzle( Output_N324.xy, Output_N325, Globals );
		float2 Output_N326 = float2(0.0); Node326_Add( Output_N325, NF_PORT_CONSTANT( float2( 4.38271, 0.35927 ), Port_Input1_N326 ), Output_N326, Globals );
		float Noise_N327 = 0.0; Node327_Noise_Simplex( Output_N326, NF_PORT_CONSTANT( float2( 1.0, 1.0 ), Port_Scale_N327 ), Noise_N327, Globals );
		float2 Output_N328 = float2(0.0); Node328_Swizzle( Output_N324, Output_N328, Globals );
		float2 Output_N329 = float2(0.0); Node329_Add( Output_N328, NF_PORT_CONSTANT( float2( 0.3452, 2.23425 ), Port_Input1_N329 ), Output_N329, Globals );
		float Noise_N330 = 0.0; Node330_Noise_Simplex( Output_N329, NF_PORT_CONSTANT( float2( 1.0, 1.0 ), Port_Scale_N330 ), Noise_N330, Globals );
		float2 Output_N331 = float2(0.0); Node331_Swizzle( Output_N324, Output_N331, Globals );
		float2 Output_N332 = float2(0.0); Node332_Add( Output_N331, NF_PORT_CONSTANT( float2( 2.05939, 0.877664 ), Port_Input1_N332 ), Output_N332, Globals );
		float Noise_N333 = 0.0; Node333_Noise_Simplex( Output_N332, NF_PORT_CONSTANT( float2( 1.0, 1.0 ), Port_Scale_N333 ), Noise_N333, Globals );
		float3 Value_N334 = float3(0.0); Node334_Construct_Vector( Noise_N327, Noise_N330, Noise_N333, Value_N334, Globals );
		float3 Output_N335 = float3(0.0); Node335_Multiply( Value_N334, NF_PORT_CONSTANT( float3( 2.0, 2.0, 2.0 ), Port_Input1_N335 ), Output_N335, Globals );
		float3 Output_N336 = float3(0.0); Node336_Subtract_One( Output_N335, Output_N336, Globals );
		float3 Output_N337 = float3(0.0); Node337_Multiply( Value_N71, Output_N336, Output_N337, Globals );
		Node338_Modify_Attribute_Add_Force( Output_N337, Globals );
		float Value_N75 = 0.0; Node75_Float_Import( NF_PORT_CONSTANT( float( 3.0 ), Port_Import_N075 ), Value_N75, Globals );
		float Value_N68 = 0.0; Node68_Float_Import( NF_PORT_CONSTANT( float( 5.0 ), Port_Import_N068 ), Value_N68, Globals );
		float Value_N179 = 0.0; Node179_Particle_Get_Attribute( Value_N179, Globals );
		float Value_N82 = 0.0; Node82_Float_Import( Value_N179, Value_N82, Globals );
		float Value_N76 = 0.0; Node76_Float_Import( NF_PORT_CONSTANT( float( 0.5 ), Port_Import_N076 ), Value_N76, Globals );
		float Value_N6 = 0.0; Node6_Particle_Get_Attribute( Value_N6, Globals );
		float Output_N114 = 0.0; Node114_Divide( Value_N76, Value_N6, Output_N114, Globals );
		float Value_N83 = 0.0; Node83_Float_Import( Output_N114, Value_N83, Globals );
		float Output_N88 = 0.0; Node88_Divide( NF_PORT_CONSTANT( float( 1.0 ), Port_Input0_N088 ), Value_N83, Output_N88, Globals );
		float Output_N111 = 0.0; Node111_Multiply( Value_N82, Output_N88, Output_N111, Globals );
		float Output_N8 = 0.0; Node8_Clamp( Output_N111, NF_PORT_CONSTANT( float( 0.0 ), Port_Input1_N008 ), NF_PORT_CONSTANT( float( 1.0 ), Port_Input2_N008 ), Output_N8, Globals );
		float Output_N184 = 0.0; Node184_One_Minus( Value_N82, Output_N184, Globals );
		float Value_N77 = 0.0; Node77_Float_Import( NF_PORT_CONSTANT( float( 0.5 ), Port_Import_N077 ), Value_N77, Globals );
		float Output_N147 = 0.0; Node147_Divide( Value_N77, Value_N6, Output_N147, Globals );
		float Value_N84 = 0.0; Node84_Float_Import( Output_N147, Value_N84, Globals );
		float Output_N99 = 0.0; Node99_Divide( NF_PORT_CONSTANT( float( 1.0 ), Port_Input0_N099 ), Value_N84, Output_N99, Globals );
		float Output_N113 = 0.0; Node113_Multiply( Output_N184, Output_N99, Output_N113, Globals );
		float Output_N112 = 0.0; Node112_Clamp( Output_N113, NF_PORT_CONSTANT( float( 0.0 ), Port_Input1_N112 ), NF_PORT_CONSTANT( float( 1.0 ), Port_Input2_N112 ), Output_N112, Globals );
		float Output_N177 = 0.0; Node177_Multiply( Output_N8, Output_N112, Output_N177, Globals );
		float Export_N178 = 0.0; Node178_Float_Export( Output_N177, Export_N178, Globals );
		float Output_N9 = 0.0; Node9_Mix( Value_N75, Value_N68, Export_N178, Output_N9, Globals );
		Node174_Modify_Attribute_Set_Size( Output_N9, Globals );
		float4 Value_N67 = float4(0.0); Node67_Particle_Get_Attribute( Value_N67, Globals );
		float Value_N87 = 0.0; Node87_Float_Import( NF_PORT_CONSTANT( float( 1.0 ), Port_Import_N087 ), Value_N87, Globals );
		float Value_N89 = 0.0; Node89_Float_Import( NF_PORT_CONSTANT( float( 0.0 ), Port_Import_N089 ), Value_N89, Globals );
		float Value_N91 = 0.0; Node91_Particle_Get_Attribute( Value_N91, Globals );
		float Output_N98 = 0.0; Node98_Mix( Value_N87, Value_N89, Value_N91, Output_N98, Globals );
		float4 Value_N176 = float4(0.0); Node176_Construct_Vector( Value_N67.xyz, Output_N98, Value_N176, Globals );
		Node108_Modify_Attribute_Set_Color( Value_N176, Globals );
		float Value_N116 = 0.0; Node116_Float_Import( NF_PORT_CONSTANT( float( 0.07 ), Port_Import_N116 ), Value_N116, Globals );
		float Value_N117 = 0.0; Node117_Particle_Get_Attribute( Value_N117, Globals );
		float Output_N136 = 0.0; Node136_Multiply( Value_N116, Value_N117, NF_PORT_CONSTANT( float( -980.0 ), Port_Input2_N136 ), Output_N136, Globals );
		float3 Output_N137 = float3(0.0); Node137_Swizzle( Output_N136, Output_N137, Globals );
		Node138_Modify_Attribute_Add_Force( Output_N137, Globals );
		
		
		// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
		
		float DeltaTime = clamp( Globals.gTimeDelta, 0.0001, 0.5 );
		float Drift = 0.005;
		//vec3  Force = gParticle.Force;
		//float Mass  = gParticle.Mass;
		
		#if 1
		
		gParticle.Force.x = ( abs(gParticle.Force.x) < Drift ) ? 0.0 : gParticle.Force.x;
		gParticle.Force.y = ( abs(gParticle.Force.y) < Drift ) ? 0.0 : gParticle.Force.y;
		gParticle.Force.z = ( abs(gParticle.Force.z) < Drift ) ? 0.0 : gParticle.Force.z;
		
		gParticle.Mass = max( Drift, gParticle.Mass );
		
		#endif
		
		gParticle.Velocity += gParticle.Force / gParticle.Mass * DeltaTime;	
		
		gParticle.Velocity.x = ( abs(gParticle.Velocity.x) < Drift ) ? 0.0 : gParticle.Velocity.x;
		gParticle.Velocity.y = ( abs(gParticle.Velocity.y) < Drift ) ? 0.0 : gParticle.Velocity.y;
		gParticle.Velocity.z = ( abs(gParticle.Velocity.z) < Drift ) ? 0.0 : gParticle.Velocity.z;
		
		gParticle.Position += gParticle.Velocity * DeltaTime;	
		
		// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
		
		#if 0
		{
			ssCalculateDynamicAttributes( InstanceID, gParticle );
			
			Globals.gTimeElapsed += Globals.gTimeDelta;
			Globals.gTimeElapsedShifted += Globals.gTimeDelta;
			
			//float ElapsedTime = ( overrideTimeEnabled == 1 ) ? overrideTimeElapsed : Globals.gTimeElapsed;
			//gParticle.Seed = rand( gParticle.Coord2D + floor( ( ElapsedTime - gParticle.SpawnOffset + ssPARTICLE_LIFE_MAX * 2.0 ) / ssPARTICLE_LIFE_MAX ) * 4.32422 );
		}
		#endif
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	float2 QuadSize = vec2( ssTEXEL_COUNT_FLOAT, 1.0 ) / ssTARGET_SIZE_FLOAT;
	float2 Offset   = float2( ssParticle_Index1D_to_Index2D( sc_LocalInstanceID ) ) * QuadSize;
	float2 Vertex   = Offset + float2( v.texture0.x < 0.5 ? 0.0 : QuadSize.x, v.texture0.y < 0.5 ? 0.0 : QuadSize.y );
	
	sc_SetClipPosition( vec4( Vertex * 2.0 - 1.0, 1.0, 1.0 ) );
	
	// Write Position
	
	//float2 Index2D    = float2( mod( InstanceID, ssPARTICLE_COUNT_2D_FLOAT.x ), floor( InstanceID / ssPARTICLE_COUNT_2D_FLOAT.x ) );
	//float2 Size       = 1.0 / ssPARTICLE_COUNT_2D_FLOAT /* because quad is -1 to 1 */;
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	// this is to splat the data to the render target
	
	//gl_Position = float4( ( v.position.xy * 0.5 + 0.5 + /*Index2D*/ gParticle.Ratio2D ) * QuadSize * 2.0 - 1.0, 1.0, 1.0 );
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	// Convert Particle.Matrix to Quaternion and Position
	/*
	float Divider = 0.0;
	
	if ( Particle.m_Matrix[2][2] < 0.0 )
	{
		if ( Particle.m_Matrix[0][0] > Particle.m_Matrix[1][1] )
		{
			Divider = 1.0 + Particle.m_Matrix[0][0] - Particle.m_Matrix[1][1] - Particle.m_Matrix[2][2];
			Particle.Quaternion = vec4( Divider, Particle.m_Matrix[0][1] + Particle.m_Matrix[1][0], Particle.m_Matrix[2][0] + Particle.m_Matrix[0][2], Particle.m_Matrix[1][2] - Particle.m_Matrix[2][1] );
		}
		else
		{
			Divider = 1.0 - Particle.m_Matrix[0][0] + Particle.m_Matrix[1][1] - Particle.m_Matrix[2][2];
			Particle.Quaternion = vec4( Particle.m_Matrix[0][1] + Particle.m_Matrix[1][0], Divider, Particle.m_Matrix[1][2] + Particle.m_Matrix[2][1], Particle.m_Matrix[2][0] - Particle.m_Matrix[0][2] );
		}
	}
	else
	{
		if ( Particle.m_Matrix[0][0] < -Particle.m_Matrix[1][1] )
		{
			Divider = 1.0 - Particle.m_Matrix[0][0] - Particle.m_Matrix[1][1] + Particle.m_Matrix[2][2];
			Particle.Quaternion = vec4( Particle.m_Matrix[2][0] + Particle.m_Matrix[0][2], Particle.m_Matrix[1][2] + Particle.m_Matrix[2][1], Divider, Particle.m_Matrix[0][1] - Particle.m_Matrix[1][0] );
		}
		else
		{ 
			Divider = 1.0 + Particle.m_Matrix[0][0] + Particle.m_Matrix[1][1] + Particle.m_Matrix[2][2];
			Particle.Quaternion = vec4( Particle.m_Matrix[1][2] - Particle.m_Matrix[2][1], Particle.m_Matrix[2][0] - Particle.m_Matrix[0][2], Particle.m_Matrix[0][1] - Particle.m_Matrix[1][0], Divider );
		}
	}
	
	Particle.Quaternion = Particle.Quaternion * 0.5 / sqrt( Divider );
	//Particle.Position   = vec3( Particle.Matrix[3][0], Particle.Matrix[3][1], Particle.Matrix[3][2] );
	*/
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	Interp_Particle_Index = sc_LocalInstanceID;
	Interp_Particle_Coord = v.texture0;
	Interp_Particle_Force = gParticle.Force;
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	Interp_Particle_Color = gParticle.Color;
	Interp_Particle_Size = gParticle.Size;
	Interp_Particle_Position = gParticle.Position;
	Interp_Particle_Velocity = gParticle.Velocity;
	Interp_Particle_Life = gParticle.Life;
	Interp_Particle_Age = gParticle.Age;
	Interp_Particle_Dead = gParticle.Dead;
	
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	if ( ( overrideTimeEnabled == 1 ) && overrideTimeDelta == 0.0 )
	{
		sc_SetClipPosition( ( sc_LocalInstanceID == 0 ) ? vec4( v.texture0.xy * 2.0 - 1.0, 1.0, 1.0 ) : vec4( 0.0 ) );
		varTex0 = v.texture0.xy;
	}
}

//-----------------------------------------------------------------------

#endif // #ifdef VERTEX_SHADER

//-----------------------------------------------------------------------

#ifdef FRAGMENT_SHADER

//-----------------------------------------------------------------------------

//----------

// Globals

struct ssGlobals
{
	float gTimeElapsed;
	float gTimeDelta;
	float gTimeElapsedShifted;
	
	
};

ssGlobals tempGlobals;
#define scCustomCodeUniform

//-----------------------------------------------------------------------------
/*
#ifdef USE_16_BIT_TEXTURES
layout(location = 0) out highp uvec4 fragOut[4];
#endif
*/
//-----------------------------------------------------------------------------

void main() 
{
	sc_DiscardStereoFragment();
	
	float4 renderTarget0Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget0, vec2( 0.5 ), 0.0);
	float4 renderTarget1Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget1, vec2( 0.5 ), 0.0);
	float4 renderTarget2Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget2, vec2( 0.5 ), 0.0);
	float4 renderTarget3Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget3, vec2( 0.5 ), 0.0);
	
	if ( dot( renderTarget0Sample + renderTarget1Sample + renderTarget2Sample + renderTarget3Sample, vec4( 0.2542325 ) ) == 0.3423183476 )
	{
		discard; // hack so the texture filter modes don't get wiped out
	}
	
	// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
	
	#if __VERSION__ == 100
	{
		gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	}				 
	#else
	{
		vec4 Data0 = vec4( 0.0 );
		vec4 Data1 = vec4( 0.0 );
		vec4 Data2 = vec4( 0.0 );
		vec4 Data3 = vec4( 0.0 );
		
		if ( ( overrideTimeEnabled == 1 ) && overrideTimeDelta == 0.0 )
		{
			renderTarget0Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget0, varTex0, 0.0);
			renderTarget1Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget1, varTex0, 0.0);
			renderTarget2Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget2, varTex0, 0.0);
			renderTarget3Sample = SC_SAMPLE_TEX_LEVEL_R(renderTarget3, varTex0, 0.0);
			
			Data0 = renderTarget0Sample;
			Data1 = renderTarget1Sample;
			Data2 = renderTarget2Sample;
			Data3 = renderTarget3Sample;
		}
		else
		{
			gParticle.Color = Interp_Particle_Color;
			gParticle.Size = Interp_Particle_Size;
			gParticle.Position = Interp_Particle_Position;
			gParticle.Velocity = Interp_Particle_Velocity;
			gParticle.Life = Interp_Particle_Life;
			gParticle.Age = Interp_Particle_Age;
			gParticle.Dead = Interp_Particle_Dead;
			
			
			// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
			
			ssEncodeParticle( Interp_Particle_Coord, Data0, Data1, Data2, Data3 );
			
			// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
			
			#if 0
			{
				float TexelRatio = floor( Interp_Particle_Coord.x * 5.0 ) / 4.0;
				Data0 = vec4( TexelRatio, 0.0, 0.0, 1.0 );
				Data1 = vec4( TexelRatio, 0.0, 0.0, 1.0 );
				Data2 = vec4( TexelRatio, 0.0, 0.0, 1.0 );
				Data3 = vec4( TexelRatio, 0.0, 0.0, 1.0 );
			}	
			#endif
			
			// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
			
			#ifndef MOBILE
			if ( dot( Data0.xyzw + Data1.xyzw + Data2.xyzw + Data3.xyzw, vec4( 0.23454 ) ) == 0.3423183476 )
			Data0.xyzw += SC_EPSILON; // fix for missing parameters in UI
			#endif
		}
		
		// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
		
		sc_writeFragData0( Data0 );
		sc_writeFragData1( Data1 );
		sc_writeFragData2( Data2 );
		sc_writeFragData3( Data3 );
	}
	#endif
}

#endif //FRAGMENT SHADER
