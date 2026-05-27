//SG_REFLECTION_BEGIN(100)
//sampler sampler intensityTextureSmpSC 2:14
//sampler sampler mainTexSmpSC 2:15
//sampler sampler renderTarget0SmpSC 2:16
//sampler sampler renderTarget1SmpSC 2:17
//sampler sampler renderTarget2SmpSC 2:18
//sampler sampler renderTarget3SmpSC 2:19
//sampler sampler sc_OITCommonSampler 2:20
//texture texture2D intensityTexture 2:0:2:14
//texture texture2D mainTex 2:1:2:15
//texture texture2D renderTarget0 2:2:2:16
//texture texture2D renderTarget1 2:3:2:17
//texture texture2D renderTarget2 2:4:2:18
//texture texture2D renderTarget3 2:5:2:19
//texture texture2D sc_OITAlpha0 2:6:2:20
//texture texture2D sc_OITAlpha1 2:7:2:20
//texture texture2D sc_OITDepthHigh0 2:8:2:20
//texture texture2D sc_OITDepthHigh1 2:9:2:20
//texture texture2D sc_OITDepthLow0 2:10:2:20
//texture texture2D sc_OITDepthLow1 2:11:2:20
//texture texture2D sc_OITFilteredDepthBoundsTexture 2:12:2:20
//texture texture2D sc_OITFrontDepthTexture 2:13:2:20
//SG_REFLECTION_END
#if defined VERTEX_SHADER
#define SC_DISABLE_FRUSTUM_CULLING
#define SC_ALLOW_16_TEXTURES
#define SC_ENABLE_INSTANCED_RENDERING
#include <std2.glsl>
#include <std2_vs.glsl>
#include <std2_texture.glsl>
#include <std2_receiver.glsl>
#include <std2_fs.glsl>
struct ssParticle
{
vec3 Position;
vec3 Velocity;
vec4 Color;
float Size;
float Age;
float Life;
float Mass;
mat3 Matrix;
vec4 Quaternion;
float Dead;
float SpawnOffset;
float Seed;
vec2 Seed2000;
float TimeShift;
int Index1D;
float Coord1D;
float Ratio1D;
ivec2 Index2D;
vec2 Coord2D;
vec2 Ratio2D;
vec3 Force;
bool Spawned;
};
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
vec2 Surface_UVCoord0;
};
#ifndef renderTarget0HasSwappedViews
#define renderTarget0HasSwappedViews 0
#elif renderTarget0HasSwappedViews==1
#undef renderTarget0HasSwappedViews
#define renderTarget0HasSwappedViews 1
#endif
#ifndef renderTarget0Layout
#define renderTarget0Layout 0
#endif
#ifndef renderTarget1HasSwappedViews
#define renderTarget1HasSwappedViews 0
#elif renderTarget1HasSwappedViews==1
#undef renderTarget1HasSwappedViews
#define renderTarget1HasSwappedViews 1
#endif
#ifndef renderTarget1Layout
#define renderTarget1Layout 0
#endif
#ifndef renderTarget2HasSwappedViews
#define renderTarget2HasSwappedViews 0
#elif renderTarget2HasSwappedViews==1
#undef renderTarget2HasSwappedViews
#define renderTarget2HasSwappedViews 1
#endif
#ifndef renderTarget2Layout
#define renderTarget2Layout 0
#endif
#ifndef renderTarget3HasSwappedViews
#define renderTarget3HasSwappedViews 0
#elif renderTarget3HasSwappedViews==1
#undef renderTarget3HasSwappedViews
#define renderTarget3HasSwappedViews 1
#endif
#ifndef renderTarget3Layout
#define renderTarget3Layout 0
#endif
#ifndef SC_USE_UV_TRANSFORM_renderTarget0
#define SC_USE_UV_TRANSFORM_renderTarget0 0
#elif SC_USE_UV_TRANSFORM_renderTarget0==1
#undef SC_USE_UV_TRANSFORM_renderTarget0
#define SC_USE_UV_TRANSFORM_renderTarget0 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_renderTarget0
#define SC_SOFTWARE_WRAP_MODE_U_renderTarget0 -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_renderTarget0
#define SC_SOFTWARE_WRAP_MODE_V_renderTarget0 -1
#endif
#ifndef SC_USE_UV_MIN_MAX_renderTarget0
#define SC_USE_UV_MIN_MAX_renderTarget0 0
#elif SC_USE_UV_MIN_MAX_renderTarget0==1
#undef SC_USE_UV_MIN_MAX_renderTarget0
#define SC_USE_UV_MIN_MAX_renderTarget0 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_renderTarget0
#define SC_USE_CLAMP_TO_BORDER_renderTarget0 0
#elif SC_USE_CLAMP_TO_BORDER_renderTarget0==1
#undef SC_USE_CLAMP_TO_BORDER_renderTarget0
#define SC_USE_CLAMP_TO_BORDER_renderTarget0 1
#endif
#ifndef SC_USE_UV_TRANSFORM_renderTarget1
#define SC_USE_UV_TRANSFORM_renderTarget1 0
#elif SC_USE_UV_TRANSFORM_renderTarget1==1
#undef SC_USE_UV_TRANSFORM_renderTarget1
#define SC_USE_UV_TRANSFORM_renderTarget1 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_renderTarget1
#define SC_SOFTWARE_WRAP_MODE_U_renderTarget1 -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_renderTarget1
#define SC_SOFTWARE_WRAP_MODE_V_renderTarget1 -1
#endif
#ifndef SC_USE_UV_MIN_MAX_renderTarget1
#define SC_USE_UV_MIN_MAX_renderTarget1 0
#elif SC_USE_UV_MIN_MAX_renderTarget1==1
#undef SC_USE_UV_MIN_MAX_renderTarget1
#define SC_USE_UV_MIN_MAX_renderTarget1 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_renderTarget1
#define SC_USE_CLAMP_TO_BORDER_renderTarget1 0
#elif SC_USE_CLAMP_TO_BORDER_renderTarget1==1
#undef SC_USE_CLAMP_TO_BORDER_renderTarget1
#define SC_USE_CLAMP_TO_BORDER_renderTarget1 1
#endif
#ifndef SC_USE_UV_TRANSFORM_renderTarget2
#define SC_USE_UV_TRANSFORM_renderTarget2 0
#elif SC_USE_UV_TRANSFORM_renderTarget2==1
#undef SC_USE_UV_TRANSFORM_renderTarget2
#define SC_USE_UV_TRANSFORM_renderTarget2 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_renderTarget2
#define SC_SOFTWARE_WRAP_MODE_U_renderTarget2 -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_renderTarget2
#define SC_SOFTWARE_WRAP_MODE_V_renderTarget2 -1
#endif
#ifndef SC_USE_UV_MIN_MAX_renderTarget2
#define SC_USE_UV_MIN_MAX_renderTarget2 0
#elif SC_USE_UV_MIN_MAX_renderTarget2==1
#undef SC_USE_UV_MIN_MAX_renderTarget2
#define SC_USE_UV_MIN_MAX_renderTarget2 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_renderTarget2
#define SC_USE_CLAMP_TO_BORDER_renderTarget2 0
#elif SC_USE_CLAMP_TO_BORDER_renderTarget2==1
#undef SC_USE_CLAMP_TO_BORDER_renderTarget2
#define SC_USE_CLAMP_TO_BORDER_renderTarget2 1
#endif
#ifndef SC_USE_UV_TRANSFORM_renderTarget3
#define SC_USE_UV_TRANSFORM_renderTarget3 0
#elif SC_USE_UV_TRANSFORM_renderTarget3==1
#undef SC_USE_UV_TRANSFORM_renderTarget3
#define SC_USE_UV_TRANSFORM_renderTarget3 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_renderTarget3
#define SC_SOFTWARE_WRAP_MODE_U_renderTarget3 -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_renderTarget3
#define SC_SOFTWARE_WRAP_MODE_V_renderTarget3 -1
#endif
#ifndef SC_USE_UV_MIN_MAX_renderTarget3
#define SC_USE_UV_MIN_MAX_renderTarget3 0
#elif SC_USE_UV_MIN_MAX_renderTarget3==1
#undef SC_USE_UV_MIN_MAX_renderTarget3
#define SC_USE_UV_MIN_MAX_renderTarget3 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_renderTarget3
#define SC_USE_CLAMP_TO_BORDER_renderTarget3 0
#elif SC_USE_CLAMP_TO_BORDER_renderTarget3==1
#undef SC_USE_CLAMP_TO_BORDER_renderTarget3
#define SC_USE_CLAMP_TO_BORDER_renderTarget3 1
#endif
uniform vec4 intensityTextureDims;
uniform vec4 renderTarget0Dims;
uniform vec4 renderTarget1Dims;
uniform vec4 renderTarget2Dims;
uniform vec4 renderTarget3Dims;
uniform int overrideTimeEnabled;
uniform float overrideTimeElapsed;
uniform mat3 renderTarget0Transform;
uniform vec4 renderTarget0UvMinMax;
uniform vec4 renderTarget0BorderColor;
uniform mat3 renderTarget1Transform;
uniform vec4 renderTarget1UvMinMax;
uniform vec4 renderTarget1BorderColor;
uniform mat3 renderTarget2Transform;
uniform vec4 renderTarget2UvMinMax;
uniform vec4 renderTarget2BorderColor;
uniform mat3 renderTarget3Transform;
uniform vec4 renderTarget3UvMinMax;
uniform vec4 renderTarget3BorderColor;
uniform vec4 mainTexDims;
uniform float Port_Value_N046;
uniform float Port_Import_N048;
uniform float Port_Input1_N049;
uniform vec3 Port_Value0_N094;
uniform vec3 Port_Default_N094;
uniform float _sc_allow16TexturesMarker;
uniform float overrideTimeDelta;
uniform vec2 Port_Input1_N062;
uniform vec2 Port_Import_N063;
uniform float Port_Input1_N107;
uniform float correctedIntensity;
uniform vec4 intensityTextureSize;
uniform vec4 intensityTextureView;
uniform mat3 intensityTextureTransform;
uniform vec4 intensityTextureUvMinMax;
uniform vec4 intensityTextureBorderColor;
uniform float reflBlurWidth;
uniform float reflBlurMinRough;
uniform float reflBlurMaxRough;
uniform vec4 renderTarget0Size;
uniform vec4 renderTarget0View;
uniform vec4 renderTarget1Size;
uniform vec4 renderTarget1View;
uniform vec4 renderTarget2Size;
uniform vec4 renderTarget2View;
uniform vec4 renderTarget3Size;
uniform vec4 renderTarget3View;
uniform vec3 vfxLocalAabbMin;
uniform vec3 vfxWorldAabbMin;
uniform vec3 vfxLocalAabbMax;
uniform vec3 vfxWorldAabbMax;
uniform float vfxCameraAspect;
uniform float vfxCameraNear;
uniform float vfxCameraFar;
uniform vec3 vfxCameraUp;
uniform vec3 vfxCameraForward;
uniform vec3 vfxCameraRight;
uniform mat4 vfxModelMatrix;
uniform mat4 vfxModelMatrixInverse;
uniform mat4 vfxModelViewMatrix;
uniform mat4 vfxModelViewMatrixInverse;
uniform mat4 vfxProjectionMatrix;
uniform mat4 vfxProjectionMatrixInverse;
uniform mat4 vfxModelViewProjectionMatrix;
uniform mat4 vfxModelViewProjectionMatrixInverse;
uniform mat4 vfxViewMatrix;
uniform mat4 vfxViewMatrixInverse;
uniform mat4 vfxViewProjectionMatrix;
uniform mat4 vfxViewProjectionMatrixInverse;
uniform int vfxFrame;
uniform vec4 mainTexSize;
uniform vec4 mainTexView;
uniform mat3 mainTexTransform;
uniform vec4 mainTexUvMinMax;
uniform vec4 mainTexBorderColor;
uniform float Port_AlphaTestThreshold_N039;
uniform sampler2D renderTarget0;
uniform sampler2D renderTarget1;
uniform sampler2D renderTarget2;
uniform sampler2D renderTarget3;
flat varying int Interp_Particle_Index;
varying vec3 Interp_Particle_Force;
varying vec4 Interp_Particle_Color;
varying float Interp_Particle_Size;
varying vec3 Interp_Particle_Position;
varying vec3 Interp_Particle_Velocity;
varying float Interp_Particle_Life;
varying float Interp_Particle_Age;
varying float Interp_Particle_Dead;
varying vec4 varColor;
varying vec2 Interp_Particle_Coord;
varying float gParticlesDebug;
varying vec2 ParticleUV;
ssParticle gParticle;
int renderTarget0GetStereoViewIndex()
{
#if (renderTarget0HasSwappedViews)
{
return 1-sc_GetStereoViewIndex();
}
#else
{
return sc_GetStereoViewIndex();
}
#endif
}
int renderTarget1GetStereoViewIndex()
{
#if (renderTarget1HasSwappedViews)
{
return 1-sc_GetStereoViewIndex();
}
#else
{
return sc_GetStereoViewIndex();
}
#endif
}
int renderTarget2GetStereoViewIndex()
{
#if (renderTarget2HasSwappedViews)
{
return 1-sc_GetStereoViewIndex();
}
#else
{
return sc_GetStereoViewIndex();
}
#endif
}
int renderTarget3GetStereoViewIndex()
{
#if (renderTarget3HasSwappedViews)
{
return 1-sc_GetStereoViewIndex();
}
#else
{
return sc_GetStereoViewIndex();
}
#endif
}
void ssDecodeParticle(int InstanceID)
{
gParticle.Position=vec3(0.0);
gParticle.Velocity=vec3(0.0);
gParticle.Color=vec4(0.0);
gParticle.Size=0.0;
gParticle.Age=0.0;
gParticle.Life=0.0;
gParticle.Mass=1.0;
gParticle.Quaternion=vec4(0.0);
gParticle.Matrix=mat3(vec3(1.0,0.0,0.0),vec3(0.0,1.0,0.0),vec3(0.0,0.0,1.0));
int l9_0=InstanceID;
ivec2 l9_1=ivec2(l9_0%170,l9_0/170);
float l9_2=float(l9_0);
vec2 l9_3=vec2(l9_1);
float l9_4=l9_2*0.00591716;
float l9_5;
if (overrideTimeEnabled==1)
{
l9_5=overrideTimeElapsed;
}
else
{
l9_5=sc_Time.x;
}
gParticle=ssParticle(gParticle.Position,gParticle.Velocity,gParticle.Color,gParticle.Size,gParticle.Age,gParticle.Life,gParticle.Mass,gParticle.Matrix,gParticle.Quaternion,gParticle.Dead,l9_4,fract(abs(((l9_2*0.00577739)+0.151235)+(floor((l9_5-l9_4)+2.0)*4.32723))),(vec2(ivec2(l9_0%400,l9_0/400))+vec2(1.0))*vec2(0.00250627),floor(fract(sin(dot(vec2(l9_4)*vec2(0.3452,0.52254),vec2(0.98253,0.72662)))*479.371)*10000.0)*0.0001,l9_0,(l9_2+0.5)*0.00588235,l9_4,l9_1,(l9_3+vec2(0.5))*vec2(0.00588235,1.0),l9_3*vec2(0.00591716,1.0),vec3(0.0),false);
int l9_6=InstanceID*4;
vec2 l9_7=(vec2(ivec2(l9_6-((l9_6/680)*680),(InstanceID*4)/680))+vec2(0.5))*vec2(0.00147059,1.0);
gParticle.Color.x=dot(floor((sc_SampleTextureLevel(renderTarget0Dims.xy,renderTarget0Layout,renderTarget0GetStereoViewIndex(),l9_7,(int(SC_USE_UV_TRANSFORM_renderTarget0)!=0),renderTarget0Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget0,SC_SOFTWARE_WRAP_MODE_V_renderTarget0),(int(SC_USE_UV_MIN_MAX_renderTarget0)!=0),renderTarget0UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget0)!=0),renderTarget0BorderColor,0.0,renderTarget0)*255.0)+vec4(0.5))*vec4(0.00392157),vec4(1.0,0.00392157,1.53787e-05,6.03086e-08))*1.00001;
gParticle.Color.y=dot(floor((sc_SampleTextureLevel(renderTarget1Dims.xy,renderTarget1Layout,renderTarget1GetStereoViewIndex(),l9_7,(int(SC_USE_UV_TRANSFORM_renderTarget1)!=0),renderTarget1Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget1,SC_SOFTWARE_WRAP_MODE_V_renderTarget1),(int(SC_USE_UV_MIN_MAX_renderTarget1)!=0),renderTarget1UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget1)!=0),renderTarget1BorderColor,0.0,renderTarget1)*255.0)+vec4(0.5))*vec4(0.00392157),vec4(1.0,0.00392157,1.53787e-05,6.03086e-08))*1.00001;
gParticle.Color.z=dot(floor((sc_SampleTextureLevel(renderTarget2Dims.xy,renderTarget2Layout,renderTarget2GetStereoViewIndex(),l9_7,(int(SC_USE_UV_TRANSFORM_renderTarget2)!=0),renderTarget2Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget2,SC_SOFTWARE_WRAP_MODE_V_renderTarget2),(int(SC_USE_UV_MIN_MAX_renderTarget2)!=0),renderTarget2UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget2)!=0),renderTarget2BorderColor,0.0,renderTarget2)*255.0)+vec4(0.5))*vec4(0.00392157),vec4(1.0,0.00392157,1.53787e-05,6.03086e-08))*1.00001;
gParticle.Color.w=dot(floor((sc_SampleTextureLevel(renderTarget3Dims.xy,renderTarget3Layout,renderTarget3GetStereoViewIndex(),l9_7,(int(SC_USE_UV_TRANSFORM_renderTarget3)!=0),renderTarget3Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget3,SC_SOFTWARE_WRAP_MODE_V_renderTarget3),(int(SC_USE_UV_MIN_MAX_renderTarget3)!=0),renderTarget3UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget3)!=0),renderTarget3BorderColor,0.0,renderTarget3)*255.0)+vec4(0.5))*vec4(0.00392157),vec4(1.0,0.00392157,1.53787e-05,6.03086e-08))*1.00001;
vec2 l9_8=l9_7+vec2(0.00147059,0.0);
gParticle.Size=dot(floor((sc_SampleTextureLevel(renderTarget0Dims.xy,renderTarget0Layout,renderTarget0GetStereoViewIndex(),l9_8,(int(SC_USE_UV_TRANSFORM_renderTarget0)!=0),renderTarget0Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget0,SC_SOFTWARE_WRAP_MODE_V_renderTarget0),(int(SC_USE_UV_MIN_MAX_renderTarget0)!=0),renderTarget0UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget0)!=0),renderTarget0BorderColor,0.0,renderTarget0)*255.0)+vec4(0.5))*vec4(0.00392157),vec4(1.0,0.00392157,1.53787e-05,6.03086e-08))*100.001;
gParticle.Position.x=(-1000.0)+(dot(floor((sc_SampleTextureLevel(renderTarget1Dims.xy,renderTarget1Layout,renderTarget1GetStereoViewIndex(),l9_8,(int(SC_USE_UV_TRANSFORM_renderTarget1)!=0),renderTarget1Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget1,SC_SOFTWARE_WRAP_MODE_V_renderTarget1),(int(SC_USE_UV_MIN_MAX_renderTarget1)!=0),renderTarget1UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget1)!=0),renderTarget1BorderColor,0.0,renderTarget1)*255.0)+vec4(0.5))*vec4(0.00392157),vec4(1.0,0.00392157,1.53787e-05,6.03086e-08))*2000.02);
gParticle.Position.y=(-1000.0)+(dot(floor((sc_SampleTextureLevel(renderTarget2Dims.xy,renderTarget2Layout,renderTarget2GetStereoViewIndex(),l9_8,(int(SC_USE_UV_TRANSFORM_renderTarget2)!=0),renderTarget2Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget2,SC_SOFTWARE_WRAP_MODE_V_renderTarget2),(int(SC_USE_UV_MIN_MAX_renderTarget2)!=0),renderTarget2UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget2)!=0),renderTarget2BorderColor,0.0,renderTarget2)*255.0)+vec4(0.5))*vec4(0.00392157),vec4(1.0,0.00392157,1.53787e-05,6.03086e-08))*2000.02);
gParticle.Position.z=(-1000.0)+(dot(floor((sc_SampleTextureLevel(renderTarget3Dims.xy,renderTarget3Layout,renderTarget3GetStereoViewIndex(),l9_8,(int(SC_USE_UV_TRANSFORM_renderTarget3)!=0),renderTarget3Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget3,SC_SOFTWARE_WRAP_MODE_V_renderTarget3),(int(SC_USE_UV_MIN_MAX_renderTarget3)!=0),renderTarget3UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget3)!=0),renderTarget3BorderColor,0.0,renderTarget3)*255.0)+vec4(0.5))*vec4(0.00392157),vec4(1.0,0.00392157,1.53787e-05,6.03086e-08))*2000.02);
vec2 l9_9=l9_7+vec2(0.00294118,0.0);
gParticle.Velocity.x=(-1000.0)+(dot(floor((sc_SampleTextureLevel(renderTarget0Dims.xy,renderTarget0Layout,renderTarget0GetStereoViewIndex(),l9_9,(int(SC_USE_UV_TRANSFORM_renderTarget0)!=0),renderTarget0Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget0,SC_SOFTWARE_WRAP_MODE_V_renderTarget0),(int(SC_USE_UV_MIN_MAX_renderTarget0)!=0),renderTarget0UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget0)!=0),renderTarget0BorderColor,0.0,renderTarget0)*255.0)+vec4(0.5))*vec4(0.00392157),vec4(1.0,0.00392157,1.53787e-05,6.03086e-08))*2000.02);
gParticle.Velocity.y=(-1000.0)+(dot(floor((sc_SampleTextureLevel(renderTarget1Dims.xy,renderTarget1Layout,renderTarget1GetStereoViewIndex(),l9_9,(int(SC_USE_UV_TRANSFORM_renderTarget1)!=0),renderTarget1Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget1,SC_SOFTWARE_WRAP_MODE_V_renderTarget1),(int(SC_USE_UV_MIN_MAX_renderTarget1)!=0),renderTarget1UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget1)!=0),renderTarget1BorderColor,0.0,renderTarget1)*255.0)+vec4(0.5))*vec4(0.00392157),vec4(1.0,0.00392157,1.53787e-05,6.03086e-08))*2000.02);
gParticle.Velocity.z=(-1000.0)+(dot(floor((sc_SampleTextureLevel(renderTarget2Dims.xy,renderTarget2Layout,renderTarget2GetStereoViewIndex(),l9_9,(int(SC_USE_UV_TRANSFORM_renderTarget2)!=0),renderTarget2Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget2,SC_SOFTWARE_WRAP_MODE_V_renderTarget2),(int(SC_USE_UV_MIN_MAX_renderTarget2)!=0),renderTarget2UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget2)!=0),renderTarget2BorderColor,0.0,renderTarget2)*255.0)+vec4(0.5))*vec4(0.00392157),vec4(1.0,0.00392157,1.53787e-05,6.03086e-08))*2000.02);
gParticle.Life=dot(floor((sc_SampleTextureLevel(renderTarget3Dims.xy,renderTarget3Layout,renderTarget3GetStereoViewIndex(),l9_9,(int(SC_USE_UV_TRANSFORM_renderTarget3)!=0),renderTarget3Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget3,SC_SOFTWARE_WRAP_MODE_V_renderTarget3),(int(SC_USE_UV_MIN_MAX_renderTarget3)!=0),renderTarget3UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget3)!=0),renderTarget3BorderColor,0.0,renderTarget3)*255.0)+vec4(0.5))*vec4(0.00392157),vec4(1.0,0.00392157,1.53787e-05,6.03086e-08))*1.00001;
vec2 l9_10=l9_7+vec2(0.00441176,0.0);
gParticle.Age=dot(floor((sc_SampleTextureLevel(renderTarget0Dims.xy,renderTarget0Layout,renderTarget0GetStereoViewIndex(),l9_10,(int(SC_USE_UV_TRANSFORM_renderTarget0)!=0),renderTarget0Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget0,SC_SOFTWARE_WRAP_MODE_V_renderTarget0),(int(SC_USE_UV_MIN_MAX_renderTarget0)!=0),renderTarget0UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget0)!=0),renderTarget0BorderColor,0.0,renderTarget0)*255.0)+vec4(0.5))*vec4(0.00392157),vec4(1.0,0.00392157,1.53787e-05,6.03086e-08))*1.00001;
gParticle.Dead=floor((sc_SampleTextureLevel(renderTarget1Dims.xy,renderTarget1Layout,renderTarget1GetStereoViewIndex(),l9_10,(int(SC_USE_UV_TRANSFORM_renderTarget1)!=0),renderTarget1Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget1,SC_SOFTWARE_WRAP_MODE_V_renderTarget1),(int(SC_USE_UV_MIN_MAX_renderTarget1)!=0),renderTarget1UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget1)!=0),renderTarget1BorderColor,0.0,renderTarget1).x*255.0)+0.5);
gParticle.Velocity=floor((gParticle.Velocity*2000.0)+vec3(0.5))*0.0005;
gParticle.Position=floor((gParticle.Position*2000.0)+vec3(0.5))*0.0005;
gParticle.Color=floor((gParticle.Color*2000.0)+vec4(0.5))*0.0005;
gParticle.Size=floor((gParticle.Size*2000.0)+0.5)*0.0005;
gParticle.Mass=floor((gParticle.Mass*2000.0)+0.5)*0.0005;
gParticle.Life=floor((gParticle.Life*2000.0)+0.5)*0.0005;
}
void Node78_Switch(float Switch,vec3 Value0,vec3 Value1,vec3 Default,out vec3 Result,ssGlobals Globals)
{
Switch=1.0;
Switch=floor(Switch);
if (Switch==0.0)
{
Value0=sc_Camera.position-gParticle.Position;
Result=Value0;
}
else
{
if (Switch==1.0)
{
Value1=sc_ViewMatrixInverseArray[sc_GetStereoViewIndex()][2].xyz;
Result=Value1;
}
else
{
Default=sc_ViewMatrixInverseArray[sc_GetStereoViewIndex()][2].xyz;
Result=Default;
}
}
}
void Node97_Conditional(float Input0,vec3 Input1,vec3 Input2,out vec3 Output,ssGlobals Globals)
{
vec3 l9_0=gParticle.Velocity;
bool l9_1=float(length(l9_0)<Port_Value_N046)!=0.0;
bool l9_2;
if (!l9_1)
{
l9_2=float(Port_Import_N048<Port_Input1_N049)!=0.0;
}
else
{
l9_2=l9_1;
}
Input0=float(l9_2);
if (Input0!=0.0)
{
float l9_3=floor(0.0);
vec3 l9_4;
if (l9_3==0.0)
{
l9_4=Port_Value0_N094;
}
else
{
vec3 l9_5;
if (l9_3==1.0)
{
l9_5=normalize(sc_ViewMatrixInverseArray[sc_GetStereoViewIndex()][1].xyz);
}
else
{
l9_5=Port_Default_N094;
}
l9_4=l9_5;
}
Input1=l9_4;
Output=Input1;
}
else
{
vec3 l9_6=gParticle.Velocity;
float l9_7=dot(l9_6,l9_6);
float l9_8;
if (l9_7>0.0)
{
l9_8=1.0/sqrt(l9_7);
}
else
{
l9_8=0.0;
}
Input2=l9_6*l9_8;
Output=Input2;
}
}
void main()
{
sc_Vertex_t l9_0=sc_LoadVertexAttributes();
vec4 l9_1=l9_0.position;
vec2 l9_2=l9_0.texture0;
vec4 l9_3;
#if (sc_IsEditor)
{
vec4 l9_4=l9_1;
l9_4.x=l9_1.x+_sc_allow16TexturesMarker;
l9_3=l9_4;
}
#else
{
l9_3=l9_1;
}
#endif
int l9_5=sc_GetLocalInstanceID();
if (l9_5>=170)
{
sc_SetClipPosition(vec4(0.0));
return;
}
ssDecodeParticle(l9_5);
bool l9_6=overrideTimeEnabled==1;
float l9_7;
if (l9_6)
{
l9_7=overrideTimeElapsed;
}
else
{
l9_7=sc_Time.x;
}
float l9_8;
if (l9_6)
{
l9_8=overrideTimeDelta;
}
else
{
l9_8=max(sc_Time.y,0.0);
}
float l9_9=gParticle.TimeShift;
float l9_10=l9_9*l9_8;
float l9_11=l9_7-l9_10;
float l9_12=gParticle.Dead;
bool l9_13=l9_12>16.0;
bool l9_14;
if (!l9_13)
{
l9_14=gParticle.Size<1e-05;
}
else
{
l9_14=l9_13;
}
bool l9_15;
if (!l9_14)
{
l9_15=gParticle.Age>=gParticle.Life;
}
else
{
l9_15=l9_14;
}
if (l9_15)
{
sc_SetClipPosition(vec4(0.0));
return;
}
gParticle.Matrix=mat3(sc_ModelMatrix[0].xyz,sc_ModelMatrix[1].xyz,sc_ModelMatrix[2].xyz)*gParticle.Matrix;
varPos=gParticle.Position+(gParticle.Matrix*vec3(l9_3.x*gParticle.Size,l9_3.y*gParticle.Size,0.0));
varNormal=gParticle.Matrix*vec3(0.0,0.0,1.0);
vec3 l9_16=gParticle.Matrix*vec3(1.0,0.0,0.0);
varTangent=vec4(l9_16.x,l9_16.y,l9_16.z,varTangent.w);
varTangent.w=1.0;
varPackedTex=vec4(l9_2,l9_0.texture1);
float l9_17=gParticle.Size;
mat4 l9_18=mat4(0.0);
l9_18[0]=vec4(gParticle.Matrix[0],gParticle.Position.x);
mat4 l9_19=l9_18;
l9_19[1]=vec4(gParticle.Matrix[1],gParticle.Position.y);
mat4 l9_20=l9_19;
l9_20[2]=vec4(gParticle.Matrix[2],gParticle.Position.z);
mat4 l9_21=l9_20;
l9_21[3]=vec4(0.0,0.0,0.0,1.0);
vec4 l9_22=l9_21*vec4((l9_2-Port_Input1_N062)+clamp(Port_Import_N063,vec2(-0.5),vec2(0.5)),0.0,1.0);
ssGlobals l9_23=ssGlobals(l9_7,l9_8,l9_11,l9_2);
vec3 param_7;
Node78_Switch(0.0,vec3(0.0),vec3(0.0),vec3(0.0),param_7,l9_23);
vec3 l9_24=param_7;
float l9_25=dot(l9_24,l9_24);
float l9_26;
if (l9_25>0.0)
{
l9_26=1.0/sqrt(l9_25);
}
else
{
l9_26=0.0;
}
vec3 l9_27=l9_24*l9_26;
vec3 param_12;
Node97_Conditional(1.0,vec3(0.0,1.0,0.0),vec3(0.0),param_12,l9_23);
vec3 l9_28=param_12;
vec3 l9_29=cross(l9_27,l9_28);
float l9_30=dot(l9_29,l9_29);
float l9_31;
if (l9_30>0.0)
{
l9_31=1.0/sqrt(l9_30);
}
else
{
l9_31=0.0;
}
vec3 l9_32=l9_29*l9_31;
vec3 l9_33=vec3(l9_17);
vec3 l9_34=gParticle.Position;
vec3 l9_35=gParticle.Velocity;
vec3 l9_36=cross(l9_32,l9_27);
float l9_37=dot(l9_36,l9_36);
float l9_38;
if (l9_37>0.0)
{
l9_38=1.0/sqrt(l9_37);
}
else
{
l9_38=0.0;
}
vec3 l9_39=l9_36*l9_38;
varPos=(((l9_33*vec3(l9_22.x))*(-l9_32))+l9_34)+(((l9_33*vec3(l9_22.y))*vec3(max(length(l9_35)*Port_Import_N048,Port_Input1_N107)))*l9_39);
varTangent=vec4(l9_39.x,l9_39.y,l9_39.z,varTangent.w);
varNormal=l9_27;
#if (UseViewSpaceDepthVariant&&((sc_OITDepthGatherPass||sc_OITCompositingPass)||sc_OITDepthBoundsPass))
{
vec4 l9_40=sc_ViewMatrixArray[sc_GetStereoViewIndex()]*vec4(varPos,1.0);
varViewSpaceDepth=-l9_40.z;
sc_SetClipPosition(sc_ProjectionMatrixArray[sc_GetStereoViewIndex()]*l9_40);
}
#else
{
sc_SetClipPosition(sc_ViewProjectionMatrixArray[sc_GetStereoViewIndex()]*vec4(varPos,1.0));
}
#endif
Interp_Particle_Index=sc_GetLocalInstanceID();
Interp_Particle_Force=gParticle.Force;
Interp_Particle_Color=gParticle.Color;
Interp_Particle_Size=gParticle.Size;
Interp_Particle_Position=gParticle.Position;
Interp_Particle_Velocity=gParticle.Velocity;
Interp_Particle_Life=gParticle.Life;
Interp_Particle_Age=gParticle.Age;
Interp_Particle_Dead=gParticle.Dead;
}
#elif defined FRAGMENT_SHADER // #if defined VERTEX_SHADER
#define SC_DISABLE_FRUSTUM_CULLING
#define SC_ALLOW_16_TEXTURES
#define SC_ENABLE_INSTANCED_RENDERING
#include <std2.glsl>
#include <std2_vs.glsl>
#include <std2_texture.glsl>
#include <std2_receiver.glsl>
#include <std2_fs.glsl>
#ifndef intensityTextureHasSwappedViews
#define intensityTextureHasSwappedViews 0
#elif intensityTextureHasSwappedViews==1
#undef intensityTextureHasSwappedViews
#define intensityTextureHasSwappedViews 1
#endif
#ifndef intensityTextureLayout
#define intensityTextureLayout 0
#endif
#ifndef BLEND_MODE_REALISTIC
#define BLEND_MODE_REALISTIC 0
#elif BLEND_MODE_REALISTIC==1
#undef BLEND_MODE_REALISTIC
#define BLEND_MODE_REALISTIC 1
#endif
#ifndef BLEND_MODE_FORGRAY
#define BLEND_MODE_FORGRAY 0
#elif BLEND_MODE_FORGRAY==1
#undef BLEND_MODE_FORGRAY
#define BLEND_MODE_FORGRAY 1
#endif
#ifndef BLEND_MODE_NOTBRIGHT
#define BLEND_MODE_NOTBRIGHT 0
#elif BLEND_MODE_NOTBRIGHT==1
#undef BLEND_MODE_NOTBRIGHT
#define BLEND_MODE_NOTBRIGHT 1
#endif
#ifndef BLEND_MODE_DIVISION
#define BLEND_MODE_DIVISION 0
#elif BLEND_MODE_DIVISION==1
#undef BLEND_MODE_DIVISION
#define BLEND_MODE_DIVISION 1
#endif
#ifndef BLEND_MODE_BRIGHT
#define BLEND_MODE_BRIGHT 0
#elif BLEND_MODE_BRIGHT==1
#undef BLEND_MODE_BRIGHT
#define BLEND_MODE_BRIGHT 1
#endif
#ifndef BLEND_MODE_INTENSE
#define BLEND_MODE_INTENSE 0
#elif BLEND_MODE_INTENSE==1
#undef BLEND_MODE_INTENSE
#define BLEND_MODE_INTENSE 1
#endif
#ifndef SC_USE_UV_TRANSFORM_intensityTexture
#define SC_USE_UV_TRANSFORM_intensityTexture 0
#elif SC_USE_UV_TRANSFORM_intensityTexture==1
#undef SC_USE_UV_TRANSFORM_intensityTexture
#define SC_USE_UV_TRANSFORM_intensityTexture 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_intensityTexture
#define SC_SOFTWARE_WRAP_MODE_U_intensityTexture -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_intensityTexture
#define SC_SOFTWARE_WRAP_MODE_V_intensityTexture -1
#endif
#ifndef SC_USE_UV_MIN_MAX_intensityTexture
#define SC_USE_UV_MIN_MAX_intensityTexture 0
#elif SC_USE_UV_MIN_MAX_intensityTexture==1
#undef SC_USE_UV_MIN_MAX_intensityTexture
#define SC_USE_UV_MIN_MAX_intensityTexture 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_intensityTexture
#define SC_USE_CLAMP_TO_BORDER_intensityTexture 0
#elif SC_USE_CLAMP_TO_BORDER_intensityTexture==1
#undef SC_USE_CLAMP_TO_BORDER_intensityTexture
#define SC_USE_CLAMP_TO_BORDER_intensityTexture 1
#endif
#ifndef BLEND_MODE_LIGHTEN
#define BLEND_MODE_LIGHTEN 0
#elif BLEND_MODE_LIGHTEN==1
#undef BLEND_MODE_LIGHTEN
#define BLEND_MODE_LIGHTEN 1
#endif
#ifndef BLEND_MODE_DARKEN
#define BLEND_MODE_DARKEN 0
#elif BLEND_MODE_DARKEN==1
#undef BLEND_MODE_DARKEN
#define BLEND_MODE_DARKEN 1
#endif
#ifndef BLEND_MODE_DIVIDE
#define BLEND_MODE_DIVIDE 0
#elif BLEND_MODE_DIVIDE==1
#undef BLEND_MODE_DIVIDE
#define BLEND_MODE_DIVIDE 1
#endif
#ifndef BLEND_MODE_AVERAGE
#define BLEND_MODE_AVERAGE 0
#elif BLEND_MODE_AVERAGE==1
#undef BLEND_MODE_AVERAGE
#define BLEND_MODE_AVERAGE 1
#endif
#ifndef BLEND_MODE_SUBTRACT
#define BLEND_MODE_SUBTRACT 0
#elif BLEND_MODE_SUBTRACT==1
#undef BLEND_MODE_SUBTRACT
#define BLEND_MODE_SUBTRACT 1
#endif
#ifndef BLEND_MODE_DIFFERENCE
#define BLEND_MODE_DIFFERENCE 0
#elif BLEND_MODE_DIFFERENCE==1
#undef BLEND_MODE_DIFFERENCE
#define BLEND_MODE_DIFFERENCE 1
#endif
#ifndef BLEND_MODE_NEGATION
#define BLEND_MODE_NEGATION 0
#elif BLEND_MODE_NEGATION==1
#undef BLEND_MODE_NEGATION
#define BLEND_MODE_NEGATION 1
#endif
#ifndef BLEND_MODE_EXCLUSION
#define BLEND_MODE_EXCLUSION 0
#elif BLEND_MODE_EXCLUSION==1
#undef BLEND_MODE_EXCLUSION
#define BLEND_MODE_EXCLUSION 1
#endif
#ifndef BLEND_MODE_OVERLAY
#define BLEND_MODE_OVERLAY 0
#elif BLEND_MODE_OVERLAY==1
#undef BLEND_MODE_OVERLAY
#define BLEND_MODE_OVERLAY 1
#endif
#ifndef BLEND_MODE_SOFT_LIGHT
#define BLEND_MODE_SOFT_LIGHT 0
#elif BLEND_MODE_SOFT_LIGHT==1
#undef BLEND_MODE_SOFT_LIGHT
#define BLEND_MODE_SOFT_LIGHT 1
#endif
#ifndef BLEND_MODE_HARD_LIGHT
#define BLEND_MODE_HARD_LIGHT 0
#elif BLEND_MODE_HARD_LIGHT==1
#undef BLEND_MODE_HARD_LIGHT
#define BLEND_MODE_HARD_LIGHT 1
#endif
#ifndef BLEND_MODE_COLOR_DODGE
#define BLEND_MODE_COLOR_DODGE 0
#elif BLEND_MODE_COLOR_DODGE==1
#undef BLEND_MODE_COLOR_DODGE
#define BLEND_MODE_COLOR_DODGE 1
#endif
#ifndef BLEND_MODE_COLOR_BURN
#define BLEND_MODE_COLOR_BURN 0
#elif BLEND_MODE_COLOR_BURN==1
#undef BLEND_MODE_COLOR_BURN
#define BLEND_MODE_COLOR_BURN 1
#endif
#ifndef BLEND_MODE_LINEAR_LIGHT
#define BLEND_MODE_LINEAR_LIGHT 0
#elif BLEND_MODE_LINEAR_LIGHT==1
#undef BLEND_MODE_LINEAR_LIGHT
#define BLEND_MODE_LINEAR_LIGHT 1
#endif
#ifndef BLEND_MODE_VIVID_LIGHT
#define BLEND_MODE_VIVID_LIGHT 0
#elif BLEND_MODE_VIVID_LIGHT==1
#undef BLEND_MODE_VIVID_LIGHT
#define BLEND_MODE_VIVID_LIGHT 1
#endif
#ifndef BLEND_MODE_PIN_LIGHT
#define BLEND_MODE_PIN_LIGHT 0
#elif BLEND_MODE_PIN_LIGHT==1
#undef BLEND_MODE_PIN_LIGHT
#define BLEND_MODE_PIN_LIGHT 1
#endif
#ifndef BLEND_MODE_HARD_MIX
#define BLEND_MODE_HARD_MIX 0
#elif BLEND_MODE_HARD_MIX==1
#undef BLEND_MODE_HARD_MIX
#define BLEND_MODE_HARD_MIX 1
#endif
#ifndef BLEND_MODE_HARD_REFLECT
#define BLEND_MODE_HARD_REFLECT 0
#elif BLEND_MODE_HARD_REFLECT==1
#undef BLEND_MODE_HARD_REFLECT
#define BLEND_MODE_HARD_REFLECT 1
#endif
#ifndef BLEND_MODE_HARD_GLOW
#define BLEND_MODE_HARD_GLOW 0
#elif BLEND_MODE_HARD_GLOW==1
#undef BLEND_MODE_HARD_GLOW
#define BLEND_MODE_HARD_GLOW 1
#endif
#ifndef BLEND_MODE_HARD_PHOENIX
#define BLEND_MODE_HARD_PHOENIX 0
#elif BLEND_MODE_HARD_PHOENIX==1
#undef BLEND_MODE_HARD_PHOENIX
#define BLEND_MODE_HARD_PHOENIX 1
#endif
#ifndef BLEND_MODE_HUE
#define BLEND_MODE_HUE 0
#elif BLEND_MODE_HUE==1
#undef BLEND_MODE_HUE
#define BLEND_MODE_HUE 1
#endif
#ifndef BLEND_MODE_SATURATION
#define BLEND_MODE_SATURATION 0
#elif BLEND_MODE_SATURATION==1
#undef BLEND_MODE_SATURATION
#define BLEND_MODE_SATURATION 1
#endif
#ifndef BLEND_MODE_COLOR
#define BLEND_MODE_COLOR 0
#elif BLEND_MODE_COLOR==1
#undef BLEND_MODE_COLOR
#define BLEND_MODE_COLOR 1
#endif
#ifndef BLEND_MODE_LUMINOSITY
#define BLEND_MODE_LUMINOSITY 0
#elif BLEND_MODE_LUMINOSITY==1
#undef BLEND_MODE_LUMINOSITY
#define BLEND_MODE_LUMINOSITY 1
#endif
#ifndef renderTarget0HasSwappedViews
#define renderTarget0HasSwappedViews 0
#elif renderTarget0HasSwappedViews==1
#undef renderTarget0HasSwappedViews
#define renderTarget0HasSwappedViews 1
#endif
#ifndef renderTarget0Layout
#define renderTarget0Layout 0
#endif
#ifndef renderTarget1HasSwappedViews
#define renderTarget1HasSwappedViews 0
#elif renderTarget1HasSwappedViews==1
#undef renderTarget1HasSwappedViews
#define renderTarget1HasSwappedViews 1
#endif
#ifndef renderTarget1Layout
#define renderTarget1Layout 0
#endif
#ifndef renderTarget2HasSwappedViews
#define renderTarget2HasSwappedViews 0
#elif renderTarget2HasSwappedViews==1
#undef renderTarget2HasSwappedViews
#define renderTarget2HasSwappedViews 1
#endif
#ifndef renderTarget2Layout
#define renderTarget2Layout 0
#endif
#ifndef renderTarget3HasSwappedViews
#define renderTarget3HasSwappedViews 0
#elif renderTarget3HasSwappedViews==1
#undef renderTarget3HasSwappedViews
#define renderTarget3HasSwappedViews 1
#endif
#ifndef renderTarget3Layout
#define renderTarget3Layout 0
#endif
#ifndef SC_USE_UV_TRANSFORM_renderTarget0
#define SC_USE_UV_TRANSFORM_renderTarget0 0
#elif SC_USE_UV_TRANSFORM_renderTarget0==1
#undef SC_USE_UV_TRANSFORM_renderTarget0
#define SC_USE_UV_TRANSFORM_renderTarget0 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_renderTarget0
#define SC_SOFTWARE_WRAP_MODE_U_renderTarget0 -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_renderTarget0
#define SC_SOFTWARE_WRAP_MODE_V_renderTarget0 -1
#endif
#ifndef SC_USE_UV_MIN_MAX_renderTarget0
#define SC_USE_UV_MIN_MAX_renderTarget0 0
#elif SC_USE_UV_MIN_MAX_renderTarget0==1
#undef SC_USE_UV_MIN_MAX_renderTarget0
#define SC_USE_UV_MIN_MAX_renderTarget0 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_renderTarget0
#define SC_USE_CLAMP_TO_BORDER_renderTarget0 0
#elif SC_USE_CLAMP_TO_BORDER_renderTarget0==1
#undef SC_USE_CLAMP_TO_BORDER_renderTarget0
#define SC_USE_CLAMP_TO_BORDER_renderTarget0 1
#endif
#ifndef SC_USE_UV_TRANSFORM_renderTarget1
#define SC_USE_UV_TRANSFORM_renderTarget1 0
#elif SC_USE_UV_TRANSFORM_renderTarget1==1
#undef SC_USE_UV_TRANSFORM_renderTarget1
#define SC_USE_UV_TRANSFORM_renderTarget1 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_renderTarget1
#define SC_SOFTWARE_WRAP_MODE_U_renderTarget1 -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_renderTarget1
#define SC_SOFTWARE_WRAP_MODE_V_renderTarget1 -1
#endif
#ifndef SC_USE_UV_MIN_MAX_renderTarget1
#define SC_USE_UV_MIN_MAX_renderTarget1 0
#elif SC_USE_UV_MIN_MAX_renderTarget1==1
#undef SC_USE_UV_MIN_MAX_renderTarget1
#define SC_USE_UV_MIN_MAX_renderTarget1 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_renderTarget1
#define SC_USE_CLAMP_TO_BORDER_renderTarget1 0
#elif SC_USE_CLAMP_TO_BORDER_renderTarget1==1
#undef SC_USE_CLAMP_TO_BORDER_renderTarget1
#define SC_USE_CLAMP_TO_BORDER_renderTarget1 1
#endif
#ifndef SC_USE_UV_TRANSFORM_renderTarget2
#define SC_USE_UV_TRANSFORM_renderTarget2 0
#elif SC_USE_UV_TRANSFORM_renderTarget2==1
#undef SC_USE_UV_TRANSFORM_renderTarget2
#define SC_USE_UV_TRANSFORM_renderTarget2 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_renderTarget2
#define SC_SOFTWARE_WRAP_MODE_U_renderTarget2 -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_renderTarget2
#define SC_SOFTWARE_WRAP_MODE_V_renderTarget2 -1
#endif
#ifndef SC_USE_UV_MIN_MAX_renderTarget2
#define SC_USE_UV_MIN_MAX_renderTarget2 0
#elif SC_USE_UV_MIN_MAX_renderTarget2==1
#undef SC_USE_UV_MIN_MAX_renderTarget2
#define SC_USE_UV_MIN_MAX_renderTarget2 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_renderTarget2
#define SC_USE_CLAMP_TO_BORDER_renderTarget2 0
#elif SC_USE_CLAMP_TO_BORDER_renderTarget2==1
#undef SC_USE_CLAMP_TO_BORDER_renderTarget2
#define SC_USE_CLAMP_TO_BORDER_renderTarget2 1
#endif
#ifndef SC_USE_UV_TRANSFORM_renderTarget3
#define SC_USE_UV_TRANSFORM_renderTarget3 0
#elif SC_USE_UV_TRANSFORM_renderTarget3==1
#undef SC_USE_UV_TRANSFORM_renderTarget3
#define SC_USE_UV_TRANSFORM_renderTarget3 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_renderTarget3
#define SC_SOFTWARE_WRAP_MODE_U_renderTarget3 -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_renderTarget3
#define SC_SOFTWARE_WRAP_MODE_V_renderTarget3 -1
#endif
#ifndef SC_USE_UV_MIN_MAX_renderTarget3
#define SC_USE_UV_MIN_MAX_renderTarget3 0
#elif SC_USE_UV_MIN_MAX_renderTarget3==1
#undef SC_USE_UV_MIN_MAX_renderTarget3
#define SC_USE_UV_MIN_MAX_renderTarget3 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_renderTarget3
#define SC_USE_CLAMP_TO_BORDER_renderTarget3 0
#elif SC_USE_CLAMP_TO_BORDER_renderTarget3==1
#undef SC_USE_CLAMP_TO_BORDER_renderTarget3
#define SC_USE_CLAMP_TO_BORDER_renderTarget3 1
#endif
#ifndef mainTexHasSwappedViews
#define mainTexHasSwappedViews 0
#elif mainTexHasSwappedViews==1
#undef mainTexHasSwappedViews
#define mainTexHasSwappedViews 1
#endif
#ifndef mainTexLayout
#define mainTexLayout 0
#endif
#ifndef SC_USE_UV_TRANSFORM_mainTex
#define SC_USE_UV_TRANSFORM_mainTex 0
#elif SC_USE_UV_TRANSFORM_mainTex==1
#undef SC_USE_UV_TRANSFORM_mainTex
#define SC_USE_UV_TRANSFORM_mainTex 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_mainTex
#define SC_SOFTWARE_WRAP_MODE_U_mainTex -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_mainTex
#define SC_SOFTWARE_WRAP_MODE_V_mainTex -1
#endif
#ifndef SC_USE_UV_MIN_MAX_mainTex
#define SC_USE_UV_MIN_MAX_mainTex 0
#elif SC_USE_UV_MIN_MAX_mainTex==1
#undef SC_USE_UV_MIN_MAX_mainTex
#define SC_USE_UV_MIN_MAX_mainTex 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_mainTex
#define SC_USE_CLAMP_TO_BORDER_mainTex 0
#elif SC_USE_CLAMP_TO_BORDER_mainTex==1
#undef SC_USE_CLAMP_TO_BORDER_mainTex
#define SC_USE_CLAMP_TO_BORDER_mainTex 1
#endif
uniform vec4 intensityTextureDims;
uniform float correctedIntensity;
uniform mat3 intensityTextureTransform;
uniform vec4 intensityTextureUvMinMax;
uniform vec4 intensityTextureBorderColor;
uniform vec4 renderTarget0Dims;
uniform vec4 renderTarget1Dims;
uniform vec4 renderTarget2Dims;
uniform vec4 renderTarget3Dims;
uniform int overrideTimeEnabled;
uniform float overrideTimeElapsed;
uniform mat3 renderTarget0Transform;
uniform vec4 renderTarget0UvMinMax;
uniform vec4 renderTarget0BorderColor;
uniform mat3 renderTarget1Transform;
uniform vec4 renderTarget1UvMinMax;
uniform vec4 renderTarget1BorderColor;
uniform mat3 renderTarget2Transform;
uniform vec4 renderTarget2UvMinMax;
uniform vec4 renderTarget2BorderColor;
uniform mat3 renderTarget3Transform;
uniform vec4 renderTarget3UvMinMax;
uniform vec4 renderTarget3BorderColor;
uniform vec4 mainTexDims;
uniform float overrideTimeDelta;
uniform mat3 mainTexTransform;
uniform vec4 mainTexUvMinMax;
uniform vec4 mainTexBorderColor;
uniform vec4 intensityTextureSize;
uniform vec4 intensityTextureView;
uniform float reflBlurWidth;
uniform float reflBlurMinRough;
uniform float reflBlurMaxRough;
uniform vec4 renderTarget0Size;
uniform vec4 renderTarget0View;
uniform vec4 renderTarget1Size;
uniform vec4 renderTarget1View;
uniform vec4 renderTarget2Size;
uniform vec4 renderTarget2View;
uniform vec4 renderTarget3Size;
uniform vec4 renderTarget3View;
uniform float _sc_allow16TexturesMarker;
uniform vec3 vfxLocalAabbMin;
uniform vec3 vfxWorldAabbMin;
uniform vec3 vfxLocalAabbMax;
uniform vec3 vfxWorldAabbMax;
uniform float vfxCameraAspect;
uniform float vfxCameraNear;
uniform float vfxCameraFar;
uniform vec3 vfxCameraUp;
uniform vec3 vfxCameraForward;
uniform vec3 vfxCameraRight;
uniform mat4 vfxModelMatrix;
uniform mat4 vfxModelMatrixInverse;
uniform mat4 vfxModelViewMatrix;
uniform mat4 vfxModelViewMatrixInverse;
uniform mat4 vfxProjectionMatrix;
uniform mat4 vfxProjectionMatrixInverse;
uniform mat4 vfxModelViewProjectionMatrix;
uniform mat4 vfxModelViewProjectionMatrixInverse;
uniform mat4 vfxViewMatrix;
uniform mat4 vfxViewMatrixInverse;
uniform mat4 vfxViewProjectionMatrix;
uniform mat4 vfxViewProjectionMatrixInverse;
uniform int vfxFrame;
uniform vec4 mainTexSize;
uniform vec4 mainTexView;
uniform vec2 Port_Input1_N062;
uniform vec2 Port_Import_N063;
uniform float Port_Value_N046;
uniform float Port_Import_N048;
uniform float Port_Input1_N049;
uniform vec3 Port_Value0_N094;
uniform vec3 Port_Default_N094;
uniform float Port_Input1_N107;
uniform float Port_AlphaTestThreshold_N039;
uniform sampler2D renderTarget0;
uniform sampler2D renderTarget1;
uniform sampler2D renderTarget2;
uniform sampler2D renderTarget3;
uniform sampler2D mainTex;
uniform sampler2D intensityTexture;
uniform sampler2D sc_OITFrontDepthTexture;
uniform sampler2D sc_OITDepthHigh0;
uniform sampler2D sc_OITDepthLow0;
uniform sampler2D sc_OITAlpha0;
uniform sampler2D sc_OITDepthHigh1;
uniform sampler2D sc_OITDepthLow1;
uniform sampler2D sc_OITAlpha1;
uniform sampler2D sc_OITFilteredDepthBoundsTexture;
varying vec4 Interp_Particle_Color;
varying float Interp_Particle_Size;
varying vec3 Interp_Particle_Position;
varying vec3 Interp_Particle_Velocity;
varying float Interp_Particle_Life;
varying float Interp_Particle_Age;
varying float Interp_Particle_Dead;
flat varying int Interp_Particle_Index;
varying vec4 varColor;
varying vec3 Interp_Particle_Force;
varying vec2 Interp_Particle_Coord;
varying float gParticlesDebug;
varying vec2 ParticleUV;
int renderTarget0GetStereoViewIndex()
{
#if (renderTarget0HasSwappedViews)
{
return 1-sc_GetStereoViewIndex();
}
#else
{
return sc_GetStereoViewIndex();
}
#endif
}
int renderTarget1GetStereoViewIndex()
{
#if (renderTarget1HasSwappedViews)
{
return 1-sc_GetStereoViewIndex();
}
#else
{
return sc_GetStereoViewIndex();
}
#endif
}
int renderTarget2GetStereoViewIndex()
{
#if (renderTarget2HasSwappedViews)
{
return 1-sc_GetStereoViewIndex();
}
#else
{
return sc_GetStereoViewIndex();
}
#endif
}
int renderTarget3GetStereoViewIndex()
{
#if (renderTarget3HasSwappedViews)
{
return 1-sc_GetStereoViewIndex();
}
#else
{
return sc_GetStereoViewIndex();
}
#endif
}
int mainTexGetStereoViewIndex()
{
#if (mainTexHasSwappedViews)
{
return 1-sc_GetStereoViewIndex();
}
#else
{
return sc_GetStereoViewIndex();
}
#endif
}
int intensityTextureGetStereoViewIndex()
{
#if (intensityTextureHasSwappedViews)
{
return 1-sc_GetStereoViewIndex();
}
#else
{
return sc_GetStereoViewIndex();
}
#endif
}
float transformSingleColor(float original,float intMap,float target)
{
#if ((BLEND_MODE_REALISTIC||BLEND_MODE_FORGRAY)||BLEND_MODE_NOTBRIGHT)
{
return original/pow(1.0-target,intMap);
}
#else
{
#if (BLEND_MODE_DIVISION)
{
return original/(1.0-target);
}
#else
{
#if (BLEND_MODE_BRIGHT)
{
return original/pow(1.0-target,2.0-(2.0*original));
}
#endif
}
#endif
}
#endif
return 0.0;
}
vec3 transformColor(float yValue,vec3 original,vec3 target,float weight,float intMap)
{
#if (BLEND_MODE_INTENSE)
{
vec3 l9_0=original;
vec4 l9_1;
if (l9_0.y<l9_0.z)
{
l9_1=vec4(l9_0.zy,-1.0,0.666667);
}
else
{
l9_1=vec4(l9_0.yz,0.0,-0.333333);
}
vec4 l9_2;
if (l9_0.x<l9_1.x)
{
l9_2=vec4(l9_1.xy,0.0,l9_0.x);
}
else
{
l9_2=vec4(l9_0.x,l9_1.y,0.0,l9_1.x);
}
float l9_3=l9_2.x-((l9_2.x-min(l9_2.w,l9_2.y))*0.5);
float l9_4=6.0*target.x;
return mix(original,((clamp(vec3(abs(l9_4-3.0)-1.0,2.0-abs(l9_4-2.0),2.0-abs(l9_4-4.0)),vec3(0.0),vec3(1.0))-vec3(0.5))*((1.0-abs((2.0*l9_3)-1.0))*target.y))+vec3(l9_3),vec3(weight));
}
#else
{
vec3 l9_5=vec3(0.0);
l9_5.x=transformSingleColor(yValue,intMap,target.x);
vec3 l9_6=l9_5;
l9_6.y=transformSingleColor(yValue,intMap,target.y);
vec3 l9_7=l9_6;
l9_7.z=transformSingleColor(yValue,intMap,target.z);
return mix(original,clamp(l9_7,vec3(0.0),vec3(1.0)),vec3(weight));
}
#endif
}
vec3 definedBlend(vec3 a,vec3 b)
{
#if (BLEND_MODE_LIGHTEN)
{
return max(a,b);
}
#else
{
#if (BLEND_MODE_DARKEN)
{
return min(a,b);
}
#else
{
#if (BLEND_MODE_DIVIDE)
{
return b/a;
}
#else
{
#if (BLEND_MODE_AVERAGE)
{
return (a+b)*0.5;
}
#else
{
#if (BLEND_MODE_SUBTRACT)
{
return max((a+b)-vec3(1.0),vec3(0.0));
}
#else
{
#if (BLEND_MODE_DIFFERENCE)
{
return abs(a-b);
}
#else
{
#if (BLEND_MODE_NEGATION)
{
return vec3(1.0)-abs((vec3(1.0)-a)-b);
}
#else
{
#if (BLEND_MODE_EXCLUSION)
{
return (a+b)-((a*2.0)*b);
}
#else
{
#if (BLEND_MODE_OVERLAY)
{
float l9_0;
if (a.x<0.5)
{
l9_0=(2.0*a.x)*b.x;
}
else
{
l9_0=1.0-((2.0*(1.0-a.x))*(1.0-b.x));
}
float l9_1;
if (a.y<0.5)
{
l9_1=(2.0*a.y)*b.y;
}
else
{
l9_1=1.0-((2.0*(1.0-a.y))*(1.0-b.y));
}
float l9_2;
if (a.z<0.5)
{
l9_2=(2.0*a.z)*b.z;
}
else
{
l9_2=1.0-((2.0*(1.0-a.z))*(1.0-b.z));
}
return vec3(l9_0,l9_1,l9_2);
}
#else
{
#if (BLEND_MODE_SOFT_LIGHT)
{
return (((vec3(1.0)-(b*2.0))*a)*a)+((a*2.0)*b);
}
#else
{
#if (BLEND_MODE_HARD_LIGHT)
{
float l9_3;
if (b.x<0.5)
{
l9_3=(2.0*b.x)*a.x;
}
else
{
l9_3=1.0-((2.0*(1.0-b.x))*(1.0-a.x));
}
float l9_4;
if (b.y<0.5)
{
l9_4=(2.0*b.y)*a.y;
}
else
{
l9_4=1.0-((2.0*(1.0-b.y))*(1.0-a.y));
}
float l9_5;
if (b.z<0.5)
{
l9_5=(2.0*b.z)*a.z;
}
else
{
l9_5=1.0-((2.0*(1.0-b.z))*(1.0-a.z));
}
return vec3(l9_3,l9_4,l9_5);
}
#else
{
#if (BLEND_MODE_COLOR_DODGE)
{
float l9_6;
if (b.x==1.0)
{
l9_6=b.x;
}
else
{
l9_6=min(a.x/(1.0-b.x),1.0);
}
float l9_7;
if (b.y==1.0)
{
l9_7=b.y;
}
else
{
l9_7=min(a.y/(1.0-b.y),1.0);
}
float l9_8;
if (b.z==1.0)
{
l9_8=b.z;
}
else
{
l9_8=min(a.z/(1.0-b.z),1.0);
}
return vec3(l9_6,l9_7,l9_8);
}
#else
{
#if (BLEND_MODE_COLOR_BURN)
{
float l9_9;
if (b.x==0.0)
{
l9_9=b.x;
}
else
{
l9_9=max(1.0-((1.0-a.x)/b.x),0.0);
}
float l9_10;
if (b.y==0.0)
{
l9_10=b.y;
}
else
{
l9_10=max(1.0-((1.0-a.y)/b.y),0.0);
}
float l9_11;
if (b.z==0.0)
{
l9_11=b.z;
}
else
{
l9_11=max(1.0-((1.0-a.z)/b.z),0.0);
}
return vec3(l9_9,l9_10,l9_11);
}
#else
{
#if (BLEND_MODE_LINEAR_LIGHT)
{
float l9_12;
if (b.x<0.5)
{
l9_12=max((a.x+(2.0*b.x))-1.0,0.0);
}
else
{
l9_12=min(a.x+(2.0*(b.x-0.5)),1.0);
}
float l9_13;
if (b.y<0.5)
{
l9_13=max((a.y+(2.0*b.y))-1.0,0.0);
}
else
{
l9_13=min(a.y+(2.0*(b.y-0.5)),1.0);
}
float l9_14;
if (b.z<0.5)
{
l9_14=max((a.z+(2.0*b.z))-1.0,0.0);
}
else
{
l9_14=min(a.z+(2.0*(b.z-0.5)),1.0);
}
return vec3(l9_12,l9_13,l9_14);
}
#else
{
#if (BLEND_MODE_VIVID_LIGHT)
{
float l9_15;
if (b.x<0.5)
{
float l9_16;
if ((2.0*b.x)==0.0)
{
l9_16=2.0*b.x;
}
else
{
l9_16=max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_15=l9_16;
}
else
{
float l9_17;
if ((2.0*(b.x-0.5))==1.0)
{
l9_17=2.0*(b.x-0.5);
}
else
{
l9_17=min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_15=l9_17;
}
float l9_18;
if (b.y<0.5)
{
float l9_19;
if ((2.0*b.y)==0.0)
{
l9_19=2.0*b.y;
}
else
{
l9_19=max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_18=l9_19;
}
else
{
float l9_20;
if ((2.0*(b.y-0.5))==1.0)
{
l9_20=2.0*(b.y-0.5);
}
else
{
l9_20=min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_18=l9_20;
}
float l9_21;
if (b.z<0.5)
{
float l9_22;
if ((2.0*b.z)==0.0)
{
l9_22=2.0*b.z;
}
else
{
l9_22=max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_21=l9_22;
}
else
{
float l9_23;
if ((2.0*(b.z-0.5))==1.0)
{
l9_23=2.0*(b.z-0.5);
}
else
{
l9_23=min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_21=l9_23;
}
return vec3(l9_15,l9_18,l9_21);
}
#else
{
#if (BLEND_MODE_PIN_LIGHT)
{
float l9_24;
if (b.x<0.5)
{
l9_24=min(a.x,2.0*b.x);
}
else
{
l9_24=max(a.x,2.0*(b.x-0.5));
}
float l9_25;
if (b.y<0.5)
{
l9_25=min(a.y,2.0*b.y);
}
else
{
l9_25=max(a.y,2.0*(b.y-0.5));
}
float l9_26;
if (b.z<0.5)
{
l9_26=min(a.z,2.0*b.z);
}
else
{
l9_26=max(a.z,2.0*(b.z-0.5));
}
return vec3(l9_24,l9_25,l9_26);
}
#else
{
#if (BLEND_MODE_HARD_MIX)
{
float l9_27;
if (b.x<0.5)
{
float l9_28;
if ((2.0*b.x)==0.0)
{
l9_28=2.0*b.x;
}
else
{
l9_28=max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_27=l9_28;
}
else
{
float l9_29;
if ((2.0*(b.x-0.5))==1.0)
{
l9_29=2.0*(b.x-0.5);
}
else
{
l9_29=min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_27=l9_29;
}
bool l9_30=l9_27<0.5;
float l9_31;
if (b.y<0.5)
{
float l9_32;
if ((2.0*b.y)==0.0)
{
l9_32=2.0*b.y;
}
else
{
l9_32=max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_31=l9_32;
}
else
{
float l9_33;
if ((2.0*(b.y-0.5))==1.0)
{
l9_33=2.0*(b.y-0.5);
}
else
{
l9_33=min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_31=l9_33;
}
bool l9_34=l9_31<0.5;
float l9_35;
if (b.z<0.5)
{
float l9_36;
if ((2.0*b.z)==0.0)
{
l9_36=2.0*b.z;
}
else
{
l9_36=max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_35=l9_36;
}
else
{
float l9_37;
if ((2.0*(b.z-0.5))==1.0)
{
l9_37=2.0*(b.z-0.5);
}
else
{
l9_37=min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_35=l9_37;
}
return vec3(l9_30 ? 0.0 : 1.0,l9_34 ? 0.0 : 1.0,(l9_35<0.5) ? 0.0 : 1.0);
}
#else
{
#if (BLEND_MODE_HARD_REFLECT)
{
float l9_38;
if (b.x==1.0)
{
l9_38=b.x;
}
else
{
l9_38=min((a.x*a.x)/(1.0-b.x),1.0);
}
float l9_39;
if (b.y==1.0)
{
l9_39=b.y;
}
else
{
l9_39=min((a.y*a.y)/(1.0-b.y),1.0);
}
float l9_40;
if (b.z==1.0)
{
l9_40=b.z;
}
else
{
l9_40=min((a.z*a.z)/(1.0-b.z),1.0);
}
return vec3(l9_38,l9_39,l9_40);
}
#else
{
#if (BLEND_MODE_HARD_GLOW)
{
float l9_41;
if (a.x==1.0)
{
l9_41=a.x;
}
else
{
l9_41=min((b.x*b.x)/(1.0-a.x),1.0);
}
float l9_42;
if (a.y==1.0)
{
l9_42=a.y;
}
else
{
l9_42=min((b.y*b.y)/(1.0-a.y),1.0);
}
float l9_43;
if (a.z==1.0)
{
l9_43=a.z;
}
else
{
l9_43=min((b.z*b.z)/(1.0-a.z),1.0);
}
return vec3(l9_41,l9_42,l9_43);
}
#else
{
#if (BLEND_MODE_HARD_PHOENIX)
{
return (min(a,b)-max(a,b))+vec3(1.0);
}
#else
{
#if (BLEND_MODE_HUE)
{
vec3 l9_44=a;
vec3 l9_45=b;
vec4 l9_46;
if (l9_44.y<l9_44.z)
{
l9_46=vec4(l9_44.zy,-1.0,0.666667);
}
else
{
l9_46=vec4(l9_44.yz,0.0,-0.333333);
}
vec4 l9_47;
if (l9_44.x<l9_46.x)
{
l9_47=vec4(l9_46.xy,0.0,l9_44.x);
}
else
{
l9_47=vec4(l9_44.x,l9_46.y,0.0,l9_46.x);
}
float l9_48=l9_47.x-min(l9_47.w,l9_47.y);
float l9_49=l9_47.x-(l9_48*0.5);
float l9_50=abs((2.0*l9_49)-1.0);
vec4 l9_51;
if (l9_45.y<l9_45.z)
{
l9_51=vec4(l9_45.zy,-1.0,0.666667);
}
else
{
l9_51=vec4(l9_45.yz,0.0,-0.333333);
}
vec4 l9_52;
if (l9_45.x<l9_51.x)
{
l9_52=vec4(l9_51.xyw,l9_45.x);
}
else
{
l9_52=vec4(l9_45.x,l9_51.yzx);
}
float l9_53=6.0*abs(((l9_52.w-l9_52.y)/((6.0*(l9_52.x-min(l9_52.w,l9_52.y)))+1e-07))+l9_52.z);
return ((clamp(vec3(abs(l9_53-3.0)-1.0,2.0-abs(l9_53-2.0),2.0-abs(l9_53-4.0)),vec3(0.0),vec3(1.0))-vec3(0.5))*((1.0-l9_50)*(l9_48/(1.0-l9_50))))+vec3(l9_49);
}
#else
{
#if (BLEND_MODE_SATURATION)
{
vec3 l9_54=a;
vec3 l9_55=b;
vec4 l9_56;
if (l9_54.y<l9_54.z)
{
l9_56=vec4(l9_54.zy,-1.0,0.666667);
}
else
{
l9_56=vec4(l9_54.yz,0.0,-0.333333);
}
vec4 l9_57;
if (l9_54.x<l9_56.x)
{
l9_57=vec4(l9_56.xyw,l9_54.x);
}
else
{
l9_57=vec4(l9_54.x,l9_56.yzx);
}
float l9_58=l9_57.x-min(l9_57.w,l9_57.y);
float l9_59=l9_57.x-(l9_58*0.5);
vec4 l9_60;
if (l9_55.y<l9_55.z)
{
l9_60=vec4(l9_55.zy,-1.0,0.666667);
}
else
{
l9_60=vec4(l9_55.yz,0.0,-0.333333);
}
vec4 l9_61;
if (l9_55.x<l9_60.x)
{
l9_61=vec4(l9_60.xy,0.0,l9_55.x);
}
else
{
l9_61=vec4(l9_55.x,l9_60.y,0.0,l9_60.x);
}
float l9_62=l9_61.x-min(l9_61.w,l9_61.y);
float l9_63=6.0*abs(((l9_57.w-l9_57.y)/((6.0*l9_58)+1e-07))+l9_57.z);
return ((clamp(vec3(abs(l9_63-3.0)-1.0,2.0-abs(l9_63-2.0),2.0-abs(l9_63-4.0)),vec3(0.0),vec3(1.0))-vec3(0.5))*((1.0-abs((2.0*l9_59)-1.0))*(l9_62/(1.0-abs((2.0*(l9_61.x-(l9_62*0.5)))-1.0)))))+vec3(l9_59);
}
#else
{
#if (BLEND_MODE_COLOR)
{
vec3 l9_64=a;
vec3 l9_65=b;
vec4 l9_66;
if (l9_65.y<l9_65.z)
{
l9_66=vec4(l9_65.zy,-1.0,0.666667);
}
else
{
l9_66=vec4(l9_65.yz,0.0,-0.333333);
}
vec4 l9_67;
if (l9_65.x<l9_66.x)
{
l9_67=vec4(l9_66.xyw,l9_65.x);
}
else
{
l9_67=vec4(l9_65.x,l9_66.yzx);
}
float l9_68=l9_67.x-min(l9_67.w,l9_67.y);
vec4 l9_69;
if (l9_64.y<l9_64.z)
{
l9_69=vec4(l9_64.zy,-1.0,0.666667);
}
else
{
l9_69=vec4(l9_64.yz,0.0,-0.333333);
}
vec4 l9_70;
if (l9_64.x<l9_69.x)
{
l9_70=vec4(l9_69.xy,0.0,l9_64.x);
}
else
{
l9_70=vec4(l9_64.x,l9_69.y,0.0,l9_69.x);
}
float l9_71=l9_70.x-((l9_70.x-min(l9_70.w,l9_70.y))*0.5);
float l9_72=6.0*abs(((l9_67.w-l9_67.y)/((6.0*l9_68)+1e-07))+l9_67.z);
return ((clamp(vec3(abs(l9_72-3.0)-1.0,2.0-abs(l9_72-2.0),2.0-abs(l9_72-4.0)),vec3(0.0),vec3(1.0))-vec3(0.5))*((1.0-abs((2.0*l9_71)-1.0))*(l9_68/(1.0-abs((2.0*(l9_67.x-(l9_68*0.5)))-1.0)))))+vec3(l9_71);
}
#else
{
#if (BLEND_MODE_LUMINOSITY)
{
vec3 l9_73=a;
vec3 l9_74=b;
vec4 l9_75;
if (l9_73.y<l9_73.z)
{
l9_75=vec4(l9_73.zy,-1.0,0.666667);
}
else
{
l9_75=vec4(l9_73.yz,0.0,-0.333333);
}
vec4 l9_76;
if (l9_73.x<l9_75.x)
{
l9_76=vec4(l9_75.xyw,l9_73.x);
}
else
{
l9_76=vec4(l9_73.x,l9_75.yzx);
}
float l9_77=l9_76.x-min(l9_76.w,l9_76.y);
vec4 l9_78;
if (l9_74.y<l9_74.z)
{
l9_78=vec4(l9_74.zy,-1.0,0.666667);
}
else
{
l9_78=vec4(l9_74.yz,0.0,-0.333333);
}
vec4 l9_79;
if (l9_74.x<l9_78.x)
{
l9_79=vec4(l9_78.xy,0.0,l9_74.x);
}
else
{
l9_79=vec4(l9_74.x,l9_78.y,0.0,l9_78.x);
}
float l9_80=l9_79.x-((l9_79.x-min(l9_79.w,l9_79.y))*0.5);
float l9_81=6.0*abs(((l9_76.w-l9_76.y)/((6.0*l9_77)+1e-07))+l9_76.z);
return ((clamp(vec3(abs(l9_81-3.0)-1.0,2.0-abs(l9_81-2.0),2.0-abs(l9_81-4.0)),vec3(0.0),vec3(1.0))-vec3(0.5))*((1.0-abs((2.0*l9_80)-1.0))*(l9_77/(1.0-abs((2.0*(l9_76.x-(l9_77*0.5)))-1.0)))))+vec3(l9_80);
}
#else
{
vec3 l9_82=a;
vec3 l9_83=b;
float l9_84=((0.299*l9_82.x)+(0.587*l9_82.y))+(0.114*l9_82.z);
vec4 l9_85=sc_SampleTextureBiasOrLevel(intensityTextureDims.xy,intensityTextureLayout,intensityTextureGetStereoViewIndex(),vec2(pow(l9_84,1.0/correctedIntensity),0.5),(int(SC_USE_UV_TRANSFORM_intensityTexture)!=0),intensityTextureTransform,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture),(int(SC_USE_UV_MIN_MAX_intensityTexture)!=0),intensityTextureUvMinMax,(int(SC_USE_CLAMP_TO_BORDER_intensityTexture)!=0),intensityTextureBorderColor,0.0,intensityTexture);
float l9_86=(((l9_85.x*256.0)+l9_85.y)+(l9_85.z*0.00390625))*0.0622559;
float l9_87;
#if (BLEND_MODE_FORGRAY)
{
l9_87=max(l9_86,1.0);
}
#else
{
l9_87=l9_86;
}
#endif
float l9_88;
#if (BLEND_MODE_NOTBRIGHT)
{
l9_88=min(l9_87,1.0);
}
#else
{
l9_88=l9_87;
}
#endif
return transformColor(l9_84,l9_82,l9_83,1.0,l9_88);
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
vec4 ngsPixelShader(vec4 result)
{
#if (sc_ProjectiveShadowsCaster)
{
return evaluateShadowCasterColor(result);
}
#else
{
#if (sc_RenderAlphaToColor)
{
return vec4(result.w);
}
#endif
}
#endif
#if (sc_BlendMode_Custom)
{
vec3 l9_0=getFramebufferColor().xyz;
vec3 l9_1=mix(l9_0,definedBlend(l9_0,result.xyz).xyz,vec3(result.w));
vec4 l9_2=vec4(l9_1.x,l9_1.y,l9_1.z,vec4(0.0).w);
l9_2.w=1.0;
result=l9_2;
}
#else
{
#if (sc_BlendMode_MultiplyOriginal)
{
vec3 l9_3=mix(vec3(1.0),result.xyz,vec3(result.w));
result=vec4(l9_3.x,l9_3.y,l9_3.z,result.w);
}
#else
{
#if (sc_BlendMode_Screen)
{
vec3 l9_4=result.xyz*result.w;
result=vec4(l9_4.x,l9_4.y,l9_4.z,result.w);
}
#endif
}
#endif
}
#endif
return result;
}
float getFrontLayerZTestEpsilon()
{
#if (sc_SkinBonesCount>0)
{
return 5e-07;
}
#else
{
return 5e-08;
}
#endif
}
float getDepthOrderingEpsilon()
{
#if (sc_SkinBonesCount>0)
{
return 0.001;
}
#else
{
return 0.0;
}
#endif
}
float viewSpaceDepth()
{
#if (UseViewSpaceDepthVariant&&((sc_OITDepthGatherPass||sc_OITCompositingPass)||sc_OITDepthBoundsPass))
{
return varViewSpaceDepth;
}
#else
{
return sc_ProjectionMatrixArray[sc_GetStereoViewIndex()][3].z/(sc_ProjectionMatrixArray[sc_GetStereoViewIndex()][2].z+((sc_GetGlFragCoord().z*2.0)-1.0));
}
#endif
}
void oitCompositing(vec4 materialColor)
{
#if (sc_OITCompositingPass)
{
vec2 l9_0=getScreenUV();
#if (sc_OITMaxLayers4Plus1)
{
if ((sc_GetGlFragCoord().z-texture2D(sc_OITFrontDepthTexture,l9_0).x)<=getFrontLayerZTestEpsilon())
{
discard;
}
}
#endif
int depths[8];
int alphas[8];
int l9_1=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_1<8)
{
depths[l9_1]=0;
alphas[l9_1]=0;
l9_1++;
continue;
}
else
{
break;
}
}
int l9_2;
#if (sc_OITMaxLayers8)
{
l9_2=2;
}
#else
{
l9_2=1;
}
#endif
vec4 l9_3;
vec4 l9_4;
vec4 l9_5;
l9_5=vec4(0.0);
l9_4=vec4(0.0);
l9_3=vec4(0.0);
vec4 l9_6;
vec4 l9_7;
vec4 l9_8;
int l9_9=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_9<l9_2)
{
vec4 l9_10;
vec4 l9_11;
vec4 l9_12;
if (l9_9==0)
{
l9_12=texture2D(sc_OITAlpha0,l9_0);
l9_11=texture2D(sc_OITDepthLow0,l9_0);
l9_10=texture2D(sc_OITDepthHigh0,l9_0);
}
else
{
l9_12=l9_5;
l9_11=l9_4;
l9_10=l9_3;
}
if (l9_9==1)
{
l9_8=texture2D(sc_OITAlpha1,l9_0);
l9_7=texture2D(sc_OITDepthLow1,l9_0);
l9_6=texture2D(sc_OITDepthHigh1,l9_0);
}
else
{
l9_8=l9_12;
l9_7=l9_11;
l9_6=l9_10;
}
if (any(notEqual(l9_6,vec4(0.0)))||any(notEqual(l9_7,vec4(0.0))))
{
int param[8]=depths;
#if (sc_OITCompositingPass)
{
int l9_13=((l9_9+1)*4)-1;
float l9_14=floor((l9_6.w*255.0)+0.5);
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_13>=(l9_9*4))
{
param[l9_13]=(param[l9_13]*4)+int(floor(mod(l9_14,4.0)));
l9_14=floor(l9_14*0.25);
l9_13--;
continue;
}
else
{
break;
}
}
}
#endif
depths=param;
int param_1[8]=param;
#if (sc_OITCompositingPass)
{
int l9_15=((l9_9+1)*4)-1;
float l9_16=floor((l9_6.z*255.0)+0.5);
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_15>=(l9_9*4))
{
param_1[l9_15]=(param_1[l9_15]*4)+int(floor(mod(l9_16,4.0)));
l9_16=floor(l9_16*0.25);
l9_15--;
continue;
}
else
{
break;
}
}
}
#endif
depths=param_1;
int param_2[8]=param_1;
#if (sc_OITCompositingPass)
{
int l9_17=((l9_9+1)*4)-1;
float l9_18=floor((l9_6.y*255.0)+0.5);
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_17>=(l9_9*4))
{
param_2[l9_17]=(param_2[l9_17]*4)+int(floor(mod(l9_18,4.0)));
l9_18=floor(l9_18*0.25);
l9_17--;
continue;
}
else
{
break;
}
}
}
#endif
depths=param_2;
int param_3[8]=param_2;
#if (sc_OITCompositingPass)
{
int l9_19=((l9_9+1)*4)-1;
float l9_20=floor((l9_6.x*255.0)+0.5);
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_19>=(l9_9*4))
{
param_3[l9_19]=(param_3[l9_19]*4)+int(floor(mod(l9_20,4.0)));
l9_20=floor(l9_20*0.25);
l9_19--;
continue;
}
else
{
break;
}
}
}
#endif
depths=param_3;
int param_4[8]=param_3;
#if (sc_OITCompositingPass)
{
int l9_21=((l9_9+1)*4)-1;
float l9_22=floor((l9_7.w*255.0)+0.5);
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_21>=(l9_9*4))
{
param_4[l9_21]=(param_4[l9_21]*4)+int(floor(mod(l9_22,4.0)));
l9_22=floor(l9_22*0.25);
l9_21--;
continue;
}
else
{
break;
}
}
}
#endif
depths=param_4;
int param_5[8]=param_4;
#if (sc_OITCompositingPass)
{
int l9_23=((l9_9+1)*4)-1;
float l9_24=floor((l9_7.z*255.0)+0.5);
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_23>=(l9_9*4))
{
param_5[l9_23]=(param_5[l9_23]*4)+int(floor(mod(l9_24,4.0)));
l9_24=floor(l9_24*0.25);
l9_23--;
continue;
}
else
{
break;
}
}
}
#endif
depths=param_5;
int param_6[8]=param_5;
#if (sc_OITCompositingPass)
{
int l9_25=((l9_9+1)*4)-1;
float l9_26=floor((l9_7.y*255.0)+0.5);
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_25>=(l9_9*4))
{
param_6[l9_25]=(param_6[l9_25]*4)+int(floor(mod(l9_26,4.0)));
l9_26=floor(l9_26*0.25);
l9_25--;
continue;
}
else
{
break;
}
}
}
#endif
depths=param_6;
int param_7[8]=param_6;
#if (sc_OITCompositingPass)
{
int l9_27=((l9_9+1)*4)-1;
float l9_28=floor((l9_7.x*255.0)+0.5);
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_27>=(l9_9*4))
{
param_7[l9_27]=(param_7[l9_27]*4)+int(floor(mod(l9_28,4.0)));
l9_28=floor(l9_28*0.25);
l9_27--;
continue;
}
else
{
break;
}
}
}
#endif
depths=param_7;
int param_8[8]=alphas;
#if (sc_OITCompositingPass)
{
int l9_29=((l9_9+1)*4)-1;
float l9_30=floor((l9_8.w*255.0)+0.5);
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_29>=(l9_9*4))
{
param_8[l9_29]=(param_8[l9_29]*4)+int(floor(mod(l9_30,4.0)));
l9_30=floor(l9_30*0.25);
l9_29--;
continue;
}
else
{
break;
}
}
}
#endif
alphas=param_8;
int param_9[8]=param_8;
#if (sc_OITCompositingPass)
{
int l9_31=((l9_9+1)*4)-1;
float l9_32=floor((l9_8.z*255.0)+0.5);
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_31>=(l9_9*4))
{
param_9[l9_31]=(param_9[l9_31]*4)+int(floor(mod(l9_32,4.0)));
l9_32=floor(l9_32*0.25);
l9_31--;
continue;
}
else
{
break;
}
}
}
#endif
alphas=param_9;
int param_10[8]=param_9;
#if (sc_OITCompositingPass)
{
int l9_33=((l9_9+1)*4)-1;
float l9_34=floor((l9_8.y*255.0)+0.5);
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_33>=(l9_9*4))
{
param_10[l9_33]=(param_10[l9_33]*4)+int(floor(mod(l9_34,4.0)));
l9_34=floor(l9_34*0.25);
l9_33--;
continue;
}
else
{
break;
}
}
}
#endif
alphas=param_10;
int param_11[8]=param_10;
#if (sc_OITCompositingPass)
{
int l9_35=((l9_9+1)*4)-1;
float l9_36=floor((l9_8.x*255.0)+0.5);
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_35>=(l9_9*4))
{
param_11[l9_35]=(param_11[l9_35]*4)+int(floor(mod(l9_36,4.0)));
l9_36=floor(l9_36*0.25);
l9_35--;
continue;
}
else
{
break;
}
}
}
#endif
alphas=param_11;
}
l9_5=l9_8;
l9_4=l9_7;
l9_3=l9_6;
l9_9++;
continue;
}
else
{
break;
}
}
vec4 l9_37=texture2D(sc_OITFilteredDepthBoundsTexture,l9_0);
int l9_38;
#if (sc_SkinBonesCount>0)
{
float l9_39=(1.0-l9_37.x)*1000.0;
l9_38=int(clamp(((l9_39+getDepthOrderingEpsilon())-l9_39)/((l9_37.y*1000.0)-l9_39),0.0,1.0)*65535.0);
}
#else
{
l9_38=0;
}
#endif
float l9_40=(1.0-l9_37.x)*1000.0;
vec4 l9_41;
l9_41=materialColor*materialColor.w;
vec4 l9_42;
int l9_43=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_43<8)
{
int l9_44=depths[l9_43];
int l9_45=int(clamp((viewSpaceDepth()-l9_40)/((l9_37.y*1000.0)-l9_40),0.0,1.0)*65535.0)-l9_38;
bool l9_46=l9_44<l9_45;
bool l9_47;
if (l9_46)
{
l9_47=depths[l9_43]>0;
}
else
{
l9_47=l9_46;
}
if (l9_47)
{
vec3 l9_48=l9_41.xyz*(1.0-(float(alphas[l9_43])*0.00392157));
l9_42=vec4(l9_48.x,l9_48.y,l9_48.z,l9_41.w);
}
else
{
l9_42=l9_41;
}
l9_41=l9_42;
l9_43++;
continue;
}
else
{
break;
}
}
sc_writeFragData0(l9_41);
#if (sc_OITMaxLayersVisualizeLayerCount)
{
discard;
}
#endif
}
#endif
}
float packValue(inout int value)
{
#if (sc_OITDepthGatherPass)
{
int l9_0=value;
value/=4;
return floor(floor(mod(float(l9_0),4.0))*64.0)*0.00392157;
}
#else
{
return 0.0;
}
#endif
}
void oitDepthGather(vec4 materialColor)
{
#if (sc_OITDepthGatherPass)
{
vec2 l9_0=getScreenUV();
#if (sc_OITMaxLayers4Plus1)
{
if ((sc_GetGlFragCoord().z-texture2D(sc_OITFrontDepthTexture,l9_0).x)<=getFrontLayerZTestEpsilon())
{
discard;
}
}
#endif
vec4 l9_1=texture2D(sc_OITFilteredDepthBoundsTexture,l9_0);
float l9_2=(1.0-l9_1.x)*1000.0;
int param=int(clamp((viewSpaceDepth()-l9_2)/((l9_1.y*1000.0)-l9_2),0.0,1.0)*65535.0);
float l9_3=packValue(param);
vec4 l9_4=vec4(0.0);
l9_4.x=l9_3;
int param_1=param;
float l9_5=packValue(param_1);
vec4 l9_6=l9_4;
l9_6.y=l9_5;
int param_2=param_1;
float l9_7=packValue(param_2);
vec4 l9_8=l9_6;
l9_8.z=l9_7;
int param_3=param_2;
float l9_9=packValue(param_3);
vec4 l9_10=l9_8;
l9_10.w=l9_9;
int param_4=param_3;
float l9_11=packValue(param_4);
vec4 l9_12=vec4(0.0);
l9_12.x=l9_11;
int param_5=param_4;
float l9_13=packValue(param_5);
vec4 l9_14=l9_12;
l9_14.y=l9_13;
int param_6=param_5;
float l9_15=packValue(param_6);
vec4 l9_16=l9_14;
l9_16.z=l9_15;
int param_7=param_6;
float l9_17=packValue(param_7);
vec4 l9_18=l9_16;
l9_18.w=l9_17;
int param_8=int(materialColor.w*255.0);
float l9_19=packValue(param_8);
vec4 l9_20=vec4(0.0);
l9_20.x=l9_19;
int param_9=param_8;
float l9_21=packValue(param_9);
vec4 l9_22=l9_20;
l9_22.y=l9_21;
int param_10=param_9;
float l9_23=packValue(param_10);
vec4 l9_24=l9_22;
l9_24.z=l9_23;
int param_11=param_10;
float l9_25=packValue(param_11);
vec4 l9_26=l9_24;
l9_26.w=l9_25;
sc_writeFragData0(l9_18);
sc_writeFragData1(l9_10);
sc_writeFragData2(l9_26);
#if (sc_OITMaxLayersVisualizeLayerCount)
{
sc_writeFragData2(vec4(0.00392157,0.0,0.0,0.0));
}
#endif
}
#endif
}
void main()
{
sc_DiscardStereoFragment();
if (dot(((sc_SampleTextureLevel(renderTarget0Dims.xy,renderTarget0Layout,renderTarget0GetStereoViewIndex(),vec2(0.5),(int(SC_USE_UV_TRANSFORM_renderTarget0)!=0),renderTarget0Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget0,SC_SOFTWARE_WRAP_MODE_V_renderTarget0),(int(SC_USE_UV_MIN_MAX_renderTarget0)!=0),renderTarget0UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget0)!=0),renderTarget0BorderColor,0.0,renderTarget0)+sc_SampleTextureLevel(renderTarget1Dims.xy,renderTarget1Layout,renderTarget1GetStereoViewIndex(),vec2(0.5),(int(SC_USE_UV_TRANSFORM_renderTarget1)!=0),renderTarget1Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget1,SC_SOFTWARE_WRAP_MODE_V_renderTarget1),(int(SC_USE_UV_MIN_MAX_renderTarget1)!=0),renderTarget1UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget1)!=0),renderTarget1BorderColor,0.0,renderTarget1))+sc_SampleTextureLevel(renderTarget2Dims.xy,renderTarget2Layout,renderTarget2GetStereoViewIndex(),vec2(0.5),(int(SC_USE_UV_TRANSFORM_renderTarget2)!=0),renderTarget2Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget2,SC_SOFTWARE_WRAP_MODE_V_renderTarget2),(int(SC_USE_UV_MIN_MAX_renderTarget2)!=0),renderTarget2UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget2)!=0),renderTarget2BorderColor,0.0,renderTarget2))+sc_SampleTextureLevel(renderTarget3Dims.xy,renderTarget3Layout,renderTarget3GetStereoViewIndex(),vec2(0.5),(int(SC_USE_UV_TRANSFORM_renderTarget3)!=0),renderTarget3Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget3,SC_SOFTWARE_WRAP_MODE_V_renderTarget3),(int(SC_USE_UV_MIN_MAX_renderTarget3)!=0),renderTarget3UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget3)!=0),renderTarget3BorderColor,0.0,renderTarget3),vec4(0.254232))==0.342318)
{
discard;
}
vec2 l9_0;
if (sc_GetGlFrontFacing())
{
l9_0=varPackedTex.xy;
}
else
{
l9_0=vec2(1.0-varPackedTex.x,varPackedTex.y);
}
vec4 l9_1=ngsPixelShader(Interp_Particle_Color*sc_SampleTextureBiasOrLevel(mainTexDims.xy,mainTexLayout,mainTexGetStereoViewIndex(),l9_0,(int(SC_USE_UV_TRANSFORM_mainTex)!=0),mainTexTransform,ivec2(SC_SOFTWARE_WRAP_MODE_U_mainTex,SC_SOFTWARE_WRAP_MODE_V_mainTex),(int(SC_USE_UV_MIN_MAX_mainTex)!=0),mainTexUvMinMax,(int(SC_USE_CLAMP_TO_BORDER_mainTex)!=0),mainTexBorderColor,0.0,mainTex));
vec4 l9_2=getPixelRenderingCost();
vec4 l9_3;
if (l9_2.w>0.0)
{
l9_3=l9_2;
}
else
{
l9_3=l9_1;
}
sc_writeFragData0(l9_3);
vec4 l9_4=clamp(l9_3,vec4(0.0),vec4(1.0));
#if (sc_OITDepthBoundsPass)
{
#if (sc_OITDepthBoundsPass)
{
float l9_5=clamp(viewSpaceDepth()*0.001,0.0,1.0);
sc_writeFragData0(vec4(max(0.0,1.00392-l9_5),min(1.0,l9_5+0.00392157),0.0,0.0));
}
#endif
}
#else
{
#if (sc_OITDepthPrepass)
{
sc_writeFragData0(vec4(1.0));
}
#else
{
#if (sc_OITDepthGatherPass)
{
oitDepthGather(l9_4);
}
#else
{
#if (sc_OITCompositingPass)
{
oitCompositing(l9_4);
}
#else
{
#if (sc_OITFrontLayerPass)
{
#if (sc_OITFrontLayerPass)
{
if (abs(sc_GetGlFragCoord().z-texture2D(sc_OITFrontDepthTexture,getScreenUV()).x)>getFrontLayerZTestEpsilon())
{
discard;
}
sc_writeFragData0(l9_4);
}
#endif
}
#else
{
sc_writeFragData0(l9_3);
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif // #elif defined FRAGMENT_SHADER // #if defined VERTEX_SHADER
