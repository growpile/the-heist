//SG_REFLECTION_BEGIN(100)
//sampler sampler renderTarget0SmpSC 2:14
//sampler sampler renderTarget1SmpSC 2:15
//sampler sampler renderTarget2SmpSC 2:16
//sampler sampler renderTarget3SmpSC 2:17
//texture texture2D renderTarget0 2:1:2:14
//texture texture2D renderTarget1 2:2:2:15
//texture texture2D renderTarget2 2:3:2:16
//texture texture2D renderTarget3 2:4:2:17
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
uniform float Port_Input1_N029;
uniform vec3 Port_Min_N213;
uniform vec3 Port_Max_N213;
uniform float Port_Import_N004;
uniform float Port_Input1_N005;
uniform vec3 Port_Max_N027;
uniform float Port_Import_N214;
uniform vec3 Port_Import_N212;
uniform float Port_Input1_N034;
uniform float Port_Input1_N037;
uniform float burstDuration;
uniform float explosionForce;
uniform vec3 Port_Import_N216;
uniform float Port_Multiplier_N012;
uniform float Port_Import_N285;
uniform vec3 Port_Import_N284;
uniform float Port_Import_N121;
uniform float Port_Input2_N146;
uniform mat4 vfxModelMatrix;
uniform float _sc_allow16TexturesMarker;
uniform float overrideTimeDelta;
uniform vec3 Port_Import_N071;
uniform vec3 Port_Import_N024;
uniform vec3 Port_Import_N318;
uniform float Port_Multiplier_N319;
uniform vec3 Port_Import_N322;
uniform vec2 Port_Input1_N326;
uniform vec2 Port_Scale_N327;
uniform vec2 Port_Input1_N329;
uniform vec2 Port_Scale_N330;
uniform vec2 Port_Input1_N332;
uniform vec2 Port_Scale_N333;
uniform vec3 Port_Input1_N335;
uniform float Port_Import_N075;
uniform float Port_Import_N068;
uniform float Port_Import_N076;
uniform float Port_Input0_N088;
uniform float Port_Input1_N008;
uniform float Port_Input2_N008;
uniform float Port_Import_N077;
uniform float Port_Input0_N099;
uniform float Port_Input1_N112;
uniform float Port_Input2_N112;
uniform float Port_Import_N087;
uniform float Port_Import_N089;
uniform float Port_Import_N116;
uniform float Port_Input2_N136;
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
uniform float Port_Import_N082;
uniform float Port_Import_N083;
uniform float Port_Import_N084;
uniform sampler2D renderTarget0;
uniform sampler2D renderTarget1;
uniform sampler2D renderTarget2;
uniform sampler2D renderTarget3;
flat varying int Interp_Particle_Index;
varying vec2 Interp_Particle_Coord;
varying vec3 Interp_Particle_Force;
varying vec4 Interp_Particle_Color;
varying float Interp_Particle_Size;
varying vec3 Interp_Particle_Position;
varying vec3 Interp_Particle_Velocity;
varying float Interp_Particle_Life;
varying float Interp_Particle_Age;
varying float Interp_Particle_Dead;
varying vec4 varColor;
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
vec4 ssGetParticleRandom(int Dimension,bool UseTime,bool UseNodeID,bool UseParticleID,float NodeID,vec2 ParticleSeed,float ExtraSeed,float Time)
{
vec4 l9_0;
if (UseTime)
{
l9_0=vec4(0.3234,0.6574,0.2258,0.8763)+(floor(vec4(fract(Time*10.0))*10000.0)*0.0001);
}
else
{
l9_0=vec4(1.0);
}
float l9_1;
if (UseNodeID)
{
l9_1=1.0+((NodeID+1.0)*0.01);
}
else
{
l9_1=1.0;
}
vec2 l9_2;
if (UseParticleID)
{
l9_2=ParticleSeed;
}
else
{
l9_2=vec2(1.0);
}
ExtraSeed=(ExtraSeed+1.0)*0.5;
vec4 l9_3;
if (Dimension>=1)
{
vec4 l9_4=vec4(0.0);
l9_4.x=floor(fract(sin(dot((((vec2(0.2353,0.7875)*l9_2)*l9_1)*l9_0.x)*ExtraSeed,vec2(0.98253,0.72662)))*479.371)*10000.0)*0.0001;
l9_3=l9_4;
}
else
{
l9_3=vec4(0.0);
}
vec4 l9_5;
if (Dimension>=2)
{
vec4 l9_6=l9_3;
l9_6.y=floor(fract(sin(dot((((vec2(0.5751,0.6273)*l9_2)*l9_1)*l9_0.y)*ExtraSeed,vec2(0.98253,0.72662)))*479.371)*10000.0)*0.0001;
l9_5=l9_6;
}
else
{
l9_5=l9_3;
}
vec4 l9_7;
if (Dimension>=3)
{
vec4 l9_8=l9_5;
l9_8.z=floor(fract(sin(dot((((vec2(0.6947,0.5217)*l9_2)*l9_1)*l9_0.z)*ExtraSeed,vec2(0.98253,0.72662)))*479.371)*10000.0)*0.0001;
l9_7=l9_8;
}
else
{
l9_7=l9_5;
}
vec4 l9_9;
if (Dimension>=4)
{
vec4 l9_10=l9_7;
l9_10.w=floor(fract(sin(dot((((vec2(0.4789,0.3967)*l9_2)*l9_1)*l9_0.w)*ExtraSeed,vec2(0.98253,0.72662)))*479.371)*10000.0)*0.0001;
l9_9=l9_10;
}
else
{
l9_9=l9_7;
}
return l9_9;
}
void Node33_If_else(float Bool1,float Value1,float Default,out float Result,ssGlobals Globals)
{
Bool1=float(0.0==Port_Input1_N029);
if (Bool1!=0.0)
{
vec4 l9_0=ssGetParticleRandom(3,true,true,true,213.0,gParticle.Seed2000,1.0,Globals.gTimeElapsed);
vec3 l9_1=mix(Port_Min_N213,Port_Max_N213,l9_0.xyz);
float l9_2=1.0-clamp(Port_Import_N004,0.0,1.0);
float l9_3;
if (l9_2<=0.0)
{
l9_3=0.0;
}
else
{
l9_3=pow(l9_2,Port_Input1_N005);
}
vec3 l9_4=vec3(l9_3);
vec4 l9_5=ssGetParticleRandom(3,true,true,true,27.0,gParticle.Seed2000,1.0,Globals.gTimeElapsed);
vec3 l9_6=mix(l9_4,Port_Max_N027,l9_5.xyz);
float l9_7=l9_6.x;
float l9_8;
if (l9_7<=0.0)
{
l9_8=0.0;
}
else
{
l9_8=sqrt(l9_7);
}
float l9_9;
if (l9_8<=0.0)
{
l9_9=0.0;
}
else
{
l9_9=sqrt(l9_8);
}
Value1=abs(((((l9_1/vec3(length(l9_1)))*vec3(l9_9,0.0,0.0))*vec3(Port_Import_N214))*Port_Import_N212).x);
Result=Value1;
}
else
{
vec4 l9_10=ssGetParticleRandom(3,true,true,true,213.0,gParticle.Seed2000,1.0,Globals.gTimeElapsed);
vec3 l9_11=mix(Port_Min_N213,Port_Max_N213,l9_10.xyz);
float l9_12=1.0-clamp(Port_Import_N004,0.0,1.0);
float l9_13;
if (l9_12<=0.0)
{
l9_13=0.0;
}
else
{
l9_13=pow(l9_12,Port_Input1_N005);
}
vec3 l9_14=vec3(l9_13);
vec4 l9_15=ssGetParticleRandom(3,true,true,true,27.0,gParticle.Seed2000,1.0,Globals.gTimeElapsed);
vec3 l9_16=mix(l9_14,Port_Max_N027,l9_15.xyz);
float l9_17=l9_16.x;
float l9_18;
if (l9_17<=0.0)
{
l9_18=0.0;
}
else
{
l9_18=sqrt(l9_17);
}
float l9_19;
if (l9_18<=0.0)
{
l9_19=0.0;
}
else
{
l9_19=sqrt(l9_18);
}
Default=((((l9_11/vec3(length(l9_11)))*vec3(l9_19,0.0,0.0))*vec3(Port_Import_N214))*Port_Import_N212).x;
Result=Default;
}
}
void Node36_If_else(float Bool1,float Value1,float Default,out float Result,ssGlobals Globals)
{
Bool1=float(0.0==Port_Input1_N034);
if (Bool1!=0.0)
{
vec4 l9_0=ssGetParticleRandom(3,true,true,true,213.0,gParticle.Seed2000,1.0,Globals.gTimeElapsed);
vec3 l9_1=mix(Port_Min_N213,Port_Max_N213,l9_0.xyz);
float l9_2=1.0-clamp(Port_Import_N004,0.0,1.0);
float l9_3;
if (l9_2<=0.0)
{
l9_3=0.0;
}
else
{
l9_3=pow(l9_2,Port_Input1_N005);
}
vec3 l9_4=vec3(l9_3);
vec4 l9_5=ssGetParticleRandom(3,true,true,true,27.0,gParticle.Seed2000,1.0,Globals.gTimeElapsed);
vec3 l9_6=mix(l9_4,Port_Max_N027,l9_5.xyz);
float l9_7=l9_6.y;
float l9_8;
if (l9_7<=0.0)
{
l9_8=0.0;
}
else
{
l9_8=sqrt(l9_7);
}
float l9_9;
if (l9_8<=0.0)
{
l9_9=0.0;
}
else
{
l9_9=sqrt(l9_8);
}
Value1=abs(((((l9_1/vec3(length(l9_1)))*vec3(0.0,l9_9,0.0))*vec3(Port_Import_N214))*Port_Import_N212).y);
Result=Value1;
}
else
{
vec4 l9_10=ssGetParticleRandom(3,true,true,true,213.0,gParticle.Seed2000,1.0,Globals.gTimeElapsed);
vec3 l9_11=mix(Port_Min_N213,Port_Max_N213,l9_10.xyz);
float l9_12=1.0-clamp(Port_Import_N004,0.0,1.0);
float l9_13;
if (l9_12<=0.0)
{
l9_13=0.0;
}
else
{
l9_13=pow(l9_12,Port_Input1_N005);
}
vec3 l9_14=vec3(l9_13);
vec4 l9_15=ssGetParticleRandom(3,true,true,true,27.0,gParticle.Seed2000,1.0,Globals.gTimeElapsed);
vec3 l9_16=mix(l9_14,Port_Max_N027,l9_15.xyz);
float l9_17=l9_16.y;
float l9_18;
if (l9_17<=0.0)
{
l9_18=0.0;
}
else
{
l9_18=sqrt(l9_17);
}
float l9_19;
if (l9_18<=0.0)
{
l9_19=0.0;
}
else
{
l9_19=sqrt(l9_18);
}
Default=((((l9_11/vec3(length(l9_11)))*vec3(0.0,l9_19,0.0))*vec3(Port_Import_N214))*Port_Import_N212).y;
Result=Default;
}
}
void Node41_If_else(float Bool1,float Value1,float Default,out float Result,ssGlobals Globals)
{
Bool1=float(0.0==Port_Input1_N037);
if (Bool1!=0.0)
{
vec4 l9_0=ssGetParticleRandom(3,true,true,true,213.0,gParticle.Seed2000,1.0,Globals.gTimeElapsed);
vec3 l9_1=mix(Port_Min_N213,Port_Max_N213,l9_0.xyz);
float l9_2=1.0-clamp(Port_Import_N004,0.0,1.0);
float l9_3;
if (l9_2<=0.0)
{
l9_3=0.0;
}
else
{
l9_3=pow(l9_2,Port_Input1_N005);
}
vec3 l9_4=vec3(l9_3);
vec4 l9_5=ssGetParticleRandom(3,true,true,true,27.0,gParticle.Seed2000,1.0,Globals.gTimeElapsed);
vec3 l9_6=mix(l9_4,Port_Max_N027,l9_5.xyz);
float l9_7=l9_6.z;
float l9_8;
if (l9_7<=0.0)
{
l9_8=0.0;
}
else
{
l9_8=sqrt(l9_7);
}
float l9_9;
if (l9_8<=0.0)
{
l9_9=0.0;
}
else
{
l9_9=sqrt(l9_8);
}
Value1=abs(((((l9_1/vec3(length(l9_1)))*vec3(0.0,0.0,l9_9))*vec3(Port_Import_N214))*Port_Import_N212).z);
Result=Value1;
}
else
{
vec4 l9_10=ssGetParticleRandom(3,true,true,true,213.0,gParticle.Seed2000,1.0,Globals.gTimeElapsed);
vec3 l9_11=mix(Port_Min_N213,Port_Max_N213,l9_10.xyz);
float l9_12=1.0-clamp(Port_Import_N004,0.0,1.0);
float l9_13;
if (l9_12<=0.0)
{
l9_13=0.0;
}
else
{
l9_13=pow(l9_12,Port_Input1_N005);
}
vec3 l9_14=vec3(l9_13);
vec4 l9_15=ssGetParticleRandom(3,true,true,true,27.0,gParticle.Seed2000,1.0,Globals.gTimeElapsed);
vec3 l9_16=mix(l9_14,Port_Max_N027,l9_15.xyz);
float l9_17=l9_16.z;
float l9_18;
if (l9_17<=0.0)
{
l9_18=0.0;
}
else
{
l9_18=sqrt(l9_17);
}
float l9_19;
if (l9_18<=0.0)
{
l9_19=0.0;
}
else
{
l9_19=sqrt(l9_18);
}
Default=((((l9_11/vec3(length(l9_11)))*vec3(0.0,0.0,l9_19))*vec3(Port_Import_N214))*Port_Import_N212).z;
Result=Default;
}
}
void SpawnParticle(ssGlobals Globals)
{
float l9_0;
if (overrideTimeEnabled==1)
{
l9_0=overrideTimeElapsed;
}
else
{
l9_0=sc_Time.x;
}
gParticle=ssParticle(gParticle.Position,gParticle.Velocity,gParticle.Color,gParticle.Size,gParticle.Age,gParticle.Life,gParticle.Mass,gParticle.Matrix,gParticle.Quaternion,gParticle.Dead,gParticle.SpawnOffset,fract(abs(((gParticle.Ratio1D*0.976379)+0.151235)+(floor((l9_0-gParticle.SpawnOffset)+2.0)*4.32723))),(vec2(ivec2(gParticle.Index1D%400,gParticle.Index1D/400))+vec2(1.0))*vec2(0.00250627),gParticle.TimeShift,gParticle.Index1D,gParticle.Coord1D,gParticle.Ratio1D,gParticle.Index2D,gParticle.Coord2D,gParticle.Ratio2D,gParticle.Force,gParticle.Spawned);
gParticle.Position=(vec3((float(gParticle.Index1D-((gParticle.Index1D/13)*13))*0.153846)-1.0,(float(gParticle.Index1D/13)*0.153846)-1.0,0.0)*20.0)+vec3(1.0,1.0,0.0);
gParticle.Velocity=vec3(0.0);
gParticle.Color=vec4(1.0);
gParticle.Dead=0.0;
gParticle.Age=0.0;
gParticle.Life=1.0;
gParticle.Size=1.0;
gParticle.Mass=1.0;
gParticle.Quaternion=vec4(0.0,0.0,0.0,1.0);
gParticle.Matrix=mat3(vec3(1.0,0.0,0.0),vec3(0.0,1.0,0.0),vec3(0.0,0.0,1.0));
float param_3;
Node33_If_else(0.0,0.0,0.0,param_3,Globals);
float param_8;
Node36_If_else(0.0,0.0,0.0,param_8,Globals);
float param_13;
Node41_If_else(0.0,0.0,0.0,param_13,Globals);
vec3 l9_1=vec3(0.0);
l9_1.x=param_3;
vec3 l9_2=l9_1;
l9_2.y=param_8;
vec3 l9_3=l9_2;
l9_3.z=param_13;
gParticle.Position=Port_Import_N216+l9_3;
if (float((Globals.gTimeElapsedShifted*Port_Multiplier_N012)>burstDuration)!=0.0)
{
gParticle.Dead=128.0;
}
vec3 l9_4=gParticle.Position;
float l9_5=dot(l9_4,l9_4);
float l9_6;
if (l9_5>0.0)
{
l9_6=1.0/sqrt(l9_5);
}
else
{
l9_6=0.0;
}
gParticle.Force=(l9_4*l9_6)*vec3(explosionForce);
vec3 l9_7=gParticle.Position;
vec3 l9_8=Port_Import_N284-l9_7;
float l9_9=dot(l9_8,l9_8);
float l9_10;
if (l9_9>0.0)
{
l9_10=1.0/sqrt(l9_9);
}
else
{
l9_10=0.0;
}
gParticle.Force+=(vec3(Port_Import_N285)*(l9_8*l9_10));
gParticle.Force+=vec3(0.0,(Port_Import_N121*gParticle.Mass)*Port_Input2_N146,0.0);
gParticle.Velocity+=((gParticle.Force/vec3(gParticle.Mass))*0.03333);
gParticle.Force=vec3(0.0);
gParticle.Position=(vfxModelMatrix*vec4(gParticle.Position,1.0)).xyz;
mat3 l9_11=mat3(vfxModelMatrix[0].xyz,vfxModelMatrix[1].xyz,vfxModelMatrix[2].xyz);
gParticle.Velocity=l9_11*gParticle.Velocity;
gParticle.Force=l9_11*gParticle.Force;
gParticle.Matrix=l9_11*gParticle.Matrix;
}
float snoise(vec2 v)
{
#if ((SC_DEVICE_CLASS>=2)&&SC_GL_FRAGMENT_PRECISION_HIGH)
{
vec2 l9_0=floor(v+vec2(dot(v,vec2(0.366025))));
vec2 l9_1=(v-l9_0)+vec2(dot(l9_0,vec2(0.211325)));
float l9_2=l9_1.x;
float l9_3=l9_1.y;
bvec2 l9_4=bvec2(l9_2>l9_3);
vec2 l9_5=vec2(l9_4.x ? vec2(1.0,0.0).x : vec2(0.0,1.0).x,l9_4.y ? vec2(1.0,0.0).y : vec2(0.0,1.0).y);
vec2 l9_6=(l9_1+vec2(0.211325))-l9_5;
vec2 l9_7=l9_1+vec2(-0.57735);
vec2 l9_8=l9_0-(floor(l9_0*0.00346021)*289.0);
vec3 l9_9=vec3(l9_8.y)+vec3(0.0,l9_5.y,1.0);
vec3 l9_10=((l9_9*34.0)+vec3(1.0))*l9_9;
vec3 l9_11=((l9_10-(floor(l9_10*0.00346021)*289.0))+vec3(l9_8.x))+vec3(0.0,l9_5.x,1.0);
vec3 l9_12=((l9_11*34.0)+vec3(1.0))*l9_11;
vec3 l9_13=max(vec3(0.5)-vec3(dot(l9_1,l9_1),dot(l9_6,l9_6),dot(l9_7,l9_7)),vec3(0.0));
vec3 l9_14=l9_13*l9_13;
vec3 l9_15=fract((l9_12-(floor(l9_12*0.00346021)*289.0))*vec3(0.0243902))*2.0;
vec3 l9_16=l9_15-vec3(1.0);
vec3 l9_17=abs(l9_16)-vec3(0.5);
vec3 l9_18=l9_16-floor(l9_15+vec3(-0.5));
vec3 l9_19=vec3(0.0);
l9_19.x=(l9_18.x*l9_2)+(l9_17.x*l9_3);
vec2 l9_20=(l9_18.yz*vec2(l9_6.x,l9_7.x))+(l9_17.yz*vec2(l9_6.y,l9_7.y));
return 130.0*dot((l9_14*l9_14)*(vec3(1.79284)-(((l9_18*l9_18)+(l9_17*l9_17))*0.853735)),vec3(l9_19.x,l9_20.x,l9_20.y));
}
#else
{
return 0.0;
}
#endif
}
void main()
{
vec2 l9_0=sc_LoadVertexAttributes().texture0;
vec2 l9_1;
#if (sc_IsEditor)
{
vec2 l9_2=l9_0;
l9_2.x=l9_0.x+_sc_allow16TexturesMarker;
l9_1=l9_2;
}
#else
{
l9_1=l9_0;
}
#endif
ssDecodeParticle(sc_GetLocalInstanceID());
bool l9_3=overrideTimeEnabled==1;
float l9_4;
if (l9_3)
{
l9_4=overrideTimeElapsed;
}
else
{
l9_4=sc_Time.x;
}
float l9_5;
if (l9_3)
{
l9_5=overrideTimeDelta;
}
else
{
l9_5=max(sc_Time.y,0.0);
}
float l9_6=gParticle.TimeShift;
float l9_7=l9_6*l9_5;
float l9_8=l9_4-l9_7;
gParticle.Age=mod(l9_8-gParticle.SpawnOffset,1.0);
float l9_9=gParticle.SpawnOffset;
float l9_10=l9_4-l9_9;
bool l9_11=l9_10<0.0;
bool l9_12;
if (!l9_11)
{
l9_12=gParticle.Age>1.0;
}
else
{
l9_12=l9_11;
}
bool l9_13=l9_12 ? true : false;
bool l9_14=!l9_13;
bool l9_15;
if (l9_14)
{
l9_15=gParticle.Life<=0.0001;
}
else
{
l9_15=l9_14;
}
bool l9_16;
if (!l9_15)
{
l9_16=mod(l9_4-gParticle.SpawnOffset,1.0)<=l9_5;
}
else
{
l9_16=l9_15;
}
if (l9_16)
{
SpawnParticle(ssGlobals(l9_4,l9_5,l9_8));
gParticle.Spawned=true;
}
vec3 l9_17=((gParticle.Position+Port_Import_N024)+(Port_Import_N318*vec3(l9_8*Port_Multiplier_N319)))*(vec3(1.0)/Port_Import_N322);
vec2 l9_18=vec2(l9_17.xy)+Port_Input1_N326;
vec2 l9_19=l9_18;
l9_19.x=floor(l9_18.x*10000.0)*0.0001;
vec2 l9_20=l9_19;
l9_20.y=floor(l9_18.y*10000.0)*0.0001;
vec2 l9_21=vec2(l9_17.yz)+Port_Input1_N329;
vec2 l9_22=l9_21;
l9_22.x=floor(l9_21.x*10000.0)*0.0001;
vec2 l9_23=l9_22;
l9_23.y=floor(l9_21.y*10000.0)*0.0001;
vec2 l9_24=vec2(l9_17.zx)+Port_Input1_N332;
vec2 l9_25=l9_24;
l9_25.x=floor(l9_24.x*10000.0)*0.0001;
vec2 l9_26=l9_25;
l9_26.y=floor(l9_24.y*10000.0)*0.0001;
vec3 l9_27=vec3(0.0);
l9_27.x=floor(((snoise(l9_20*(Port_Scale_N327*0.5))*0.5)+0.5)*10000.0)*0.0001;
vec3 l9_28=l9_27;
l9_28.y=floor(((snoise(l9_23*(Port_Scale_N330*0.5))*0.5)+0.5)*10000.0)*0.0001;
vec3 l9_29=l9_28;
l9_29.z=floor(((snoise(l9_26*(Port_Scale_N333*0.5))*0.5)+0.5)*10000.0)*0.0001;
gParticle.Force+=(Port_Import_N071*((l9_29*Port_Input1_N335)-vec3(1.0)));
float l9_30=clamp(gParticle.Age/gParticle.Life,0.0,1.0);
gParticle.Size=mix(Port_Import_N075,Port_Import_N068,(clamp((l9_30*(Port_Input0_N088/(Port_Import_N076/gParticle.Life)))+0.001,Port_Input1_N008+0.001,Port_Input2_N008+0.001)-0.001)*(clamp(((1.0-l9_30)*(Port_Input0_N099/(Port_Import_N077/gParticle.Life)))+0.001,Port_Input1_N112+0.001,Port_Input2_N112+0.001)-0.001));
vec4 l9_31=vec4(gParticle.Color.x,gParticle.Color.y,gParticle.Color.z,vec4(0.0).w);
l9_31.w=mix(Port_Import_N087,Port_Import_N089,clamp(gParticle.Age/gParticle.Life,0.0,1.0));
gParticle.Color=l9_31;
gParticle.Force+=vec3(0.0,(Port_Import_N116*gParticle.Mass)*Port_Input2_N136,0.0);
float l9_32=clamp(l9_5,0.0001,0.5);
float l9_33;
if (abs(gParticle.Force.x)<0.005)
{
l9_33=0.0;
}
else
{
l9_33=gParticle.Force.x;
}
gParticle.Force.x=l9_33;
float l9_34;
if (abs(gParticle.Force.y)<0.005)
{
l9_34=0.0;
}
else
{
l9_34=gParticle.Force.y;
}
gParticle.Force.y=l9_34;
float l9_35;
if (abs(gParticle.Force.z)<0.005)
{
l9_35=0.0;
}
else
{
l9_35=gParticle.Force.z;
}
gParticle.Force.z=l9_35;
gParticle.Mass=max(0.005,gParticle.Mass);
gParticle.Velocity+=((gParticle.Force/vec3(gParticle.Mass))*l9_32);
float l9_36;
if (abs(gParticle.Velocity.x)<0.005)
{
l9_36=0.0;
}
else
{
l9_36=gParticle.Velocity.x;
}
gParticle.Velocity.x=l9_36;
float l9_37;
if (abs(gParticle.Velocity.y)<0.005)
{
l9_37=0.0;
}
else
{
l9_37=gParticle.Velocity.y;
}
gParticle.Velocity.y=l9_37;
float l9_38;
if (abs(gParticle.Velocity.z)<0.005)
{
l9_38=0.0;
}
else
{
l9_38=gParticle.Velocity.z;
}
gParticle.Velocity.z=l9_38;
gParticle.Position+=(gParticle.Velocity*l9_32);
int l9_39=sc_GetLocalInstanceID();
float l9_40;
if (l9_1.x<0.5)
{
l9_40=0.0;
}
else
{
l9_40=0.00588235;
}
float l9_41;
if (l9_1.y<0.5)
{
l9_41=0.0;
}
else
{
l9_41=1.0;
}
sc_SetClipPosition(vec4((((vec2(ivec2(l9_39%170,l9_39/170))*vec2(0.00588235,1.0))+vec2(l9_40,l9_41))*2.0)-vec2(1.0),1.0,1.0));
Interp_Particle_Index=sc_GetLocalInstanceID();
Interp_Particle_Coord=l9_1;
Interp_Particle_Force=gParticle.Force;
Interp_Particle_Color=gParticle.Color;
Interp_Particle_Size=gParticle.Size;
Interp_Particle_Position=gParticle.Position;
Interp_Particle_Velocity=gParticle.Velocity;
Interp_Particle_Life=gParticle.Life;
Interp_Particle_Age=gParticle.Age;
Interp_Particle_Dead=gParticle.Dead;
if (l9_3&&(overrideTimeDelta==0.0))
{
vec4 l9_42;
if (sc_GetLocalInstanceID()==0)
{
l9_42=vec4((l9_1*2.0)-vec2(1.0),1.0,1.0);
}
else
{
l9_42=vec4(0.0);
}
sc_SetClipPosition(l9_42);
varPackedTex=vec4(l9_1.x,l9_1.y,varPackedTex.z,varPackedTex.w);
}
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
uniform float overrideTimeDelta;
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
uniform float burstDuration;
uniform float explosionForce;
uniform vec3 Port_Import_N216;
uniform float Port_Input1_N029;
uniform vec3 Port_Min_N213;
uniform vec3 Port_Max_N213;
uniform float Port_Import_N004;
uniform float Port_Input1_N005;
uniform vec3 Port_Max_N027;
uniform float Port_Import_N214;
uniform vec3 Port_Import_N212;
uniform float Port_Input1_N034;
uniform float Port_Input1_N037;
uniform float Port_Multiplier_N012;
uniform float Port_Import_N285;
uniform vec3 Port_Import_N284;
uniform float Port_Import_N121;
uniform float Port_Input2_N146;
uniform vec3 Port_Import_N071;
uniform vec3 Port_Import_N024;
uniform vec3 Port_Import_N318;
uniform float Port_Multiplier_N319;
uniform vec3 Port_Import_N322;
uniform vec2 Port_Input1_N326;
uniform vec2 Port_Scale_N327;
uniform vec2 Port_Input1_N329;
uniform vec2 Port_Scale_N330;
uniform vec2 Port_Input1_N332;
uniform vec2 Port_Scale_N333;
uniform vec3 Port_Input1_N335;
uniform float Port_Import_N075;
uniform float Port_Import_N068;
uniform float Port_Import_N082;
uniform float Port_Input0_N088;
uniform float Port_Import_N076;
uniform float Port_Import_N083;
uniform float Port_Input1_N008;
uniform float Port_Input2_N008;
uniform float Port_Input0_N099;
uniform float Port_Import_N077;
uniform float Port_Import_N084;
uniform float Port_Input1_N112;
uniform float Port_Input2_N112;
uniform float Port_Import_N087;
uniform float Port_Import_N089;
uniform float Port_Import_N116;
uniform float Port_Input2_N136;
uniform sampler2D renderTarget0;
uniform sampler2D renderTarget1;
uniform sampler2D renderTarget2;
uniform sampler2D renderTarget3;
varying vec4 Interp_Particle_Color;
varying float Interp_Particle_Size;
varying vec3 Interp_Particle_Position;
varying vec3 Interp_Particle_Velocity;
varying float Interp_Particle_Life;
varying float Interp_Particle_Age;
varying float Interp_Particle_Dead;
varying vec2 Interp_Particle_Coord;
varying vec4 varColor;
flat varying int Interp_Particle_Index;
varying vec3 Interp_Particle_Force;
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
void ssEncodeParticle(vec2 Coord,out vec4 rt0,out vec4 rt1,out vec4 rt2,out vec4 rt3)
{
float l9_0=Coord.x;
int l9_1=int(floor(l9_0*4.0));
float l9_2;
float l9_3;
float l9_4;
float l9_5;
float l9_6;
float l9_7;
float l9_8;
float l9_9;
float l9_10;
float l9_11;
float l9_12;
float l9_13;
float l9_14;
float l9_15;
float l9_16;
float l9_17;
if (l9_1==0)
{
vec4 l9_18=fract(vec4(1.0,255.0,65025.0,1.65814e+07)*(clamp(gParticle.Color.x,0.0,1.0)*0.99999));
vec4 l9_19=l9_18-(l9_18.yzww*vec4(0.00392157,0.00392157,0.00392157,0.0));
vec4 l9_20=fract(vec4(1.0,255.0,65025.0,1.65814e+07)*(clamp(gParticle.Color.y,0.0,1.0)*0.99999));
vec4 l9_21=l9_20-(l9_20.yzww*vec4(0.00392157,0.00392157,0.00392157,0.0));
vec4 l9_22=fract(vec4(1.0,255.0,65025.0,1.65814e+07)*(clamp(gParticle.Color.z,0.0,1.0)*0.99999));
vec4 l9_23=l9_22-(l9_22.yzww*vec4(0.00392157,0.00392157,0.00392157,0.0));
vec4 l9_24=fract(vec4(1.0,255.0,65025.0,1.65814e+07)*(clamp(gParticle.Color.w,0.0,1.0)*0.99999));
vec4 l9_25=l9_24-(l9_24.yzww*vec4(0.00392157,0.00392157,0.00392157,0.0));
l9_17=l9_25.w;
l9_16=l9_25.z;
l9_15=l9_25.y;
l9_14=l9_25.x;
l9_13=l9_23.w;
l9_12=l9_23.z;
l9_11=l9_23.y;
l9_10=l9_23.x;
l9_9=l9_21.w;
l9_8=l9_21.z;
l9_7=l9_21.y;
l9_6=l9_21.x;
l9_5=l9_19.w;
l9_4=l9_19.z;
l9_3=l9_19.y;
l9_2=l9_19.x;
}
else
{
float l9_26;
float l9_27;
float l9_28;
float l9_29;
float l9_30;
float l9_31;
float l9_32;
float l9_33;
float l9_34;
float l9_35;
float l9_36;
float l9_37;
float l9_38;
float l9_39;
float l9_40;
float l9_41;
if (l9_1==1)
{
vec4 l9_42=fract(vec4(1.0,255.0,65025.0,1.65814e+07)*(clamp(gParticle.Size,0.0,100.0)*0.0099999));
vec4 l9_43=l9_42-(l9_42.yzww*vec4(0.00392157,0.00392157,0.00392157,0.0));
vec4 l9_44=fract(vec4(1.0,255.0,65025.0,1.65814e+07)*((clamp(gParticle.Position.x,-1000.0,1000.0)-(-1000.0))*0.000499995));
vec4 l9_45=l9_44-(l9_44.yzww*vec4(0.00392157,0.00392157,0.00392157,0.0));
vec4 l9_46=fract(vec4(1.0,255.0,65025.0,1.65814e+07)*((clamp(gParticle.Position.y,-1000.0,1000.0)-(-1000.0))*0.000499995));
vec4 l9_47=l9_46-(l9_46.yzww*vec4(0.00392157,0.00392157,0.00392157,0.0));
vec4 l9_48=fract(vec4(1.0,255.0,65025.0,1.65814e+07)*((clamp(gParticle.Position.z,-1000.0,1000.0)-(-1000.0))*0.000499995));
vec4 l9_49=l9_48-(l9_48.yzww*vec4(0.00392157,0.00392157,0.00392157,0.0));
l9_41=l9_49.w;
l9_40=l9_49.z;
l9_39=l9_49.y;
l9_38=l9_49.x;
l9_37=l9_47.w;
l9_36=l9_47.z;
l9_35=l9_47.y;
l9_34=l9_47.x;
l9_33=l9_45.w;
l9_32=l9_45.z;
l9_31=l9_45.y;
l9_30=l9_45.x;
l9_29=l9_43.w;
l9_28=l9_43.z;
l9_27=l9_43.y;
l9_26=l9_43.x;
}
else
{
float l9_50;
float l9_51;
float l9_52;
float l9_53;
float l9_54;
float l9_55;
float l9_56;
float l9_57;
float l9_58;
float l9_59;
float l9_60;
float l9_61;
float l9_62;
float l9_63;
float l9_64;
float l9_65;
if (l9_1==2)
{
vec4 l9_66=fract(vec4(1.0,255.0,65025.0,1.65814e+07)*((clamp(gParticle.Velocity.x,-1000.0,1000.0)-(-1000.0))*0.000499995));
vec4 l9_67=l9_66-(l9_66.yzww*vec4(0.00392157,0.00392157,0.00392157,0.0));
vec4 l9_68=fract(vec4(1.0,255.0,65025.0,1.65814e+07)*((clamp(gParticle.Velocity.y,-1000.0,1000.0)-(-1000.0))*0.000499995));
vec4 l9_69=l9_68-(l9_68.yzww*vec4(0.00392157,0.00392157,0.00392157,0.0));
vec4 l9_70=fract(vec4(1.0,255.0,65025.0,1.65814e+07)*((clamp(gParticle.Velocity.z,-1000.0,1000.0)-(-1000.0))*0.000499995));
vec4 l9_71=l9_70-(l9_70.yzww*vec4(0.00392157,0.00392157,0.00392157,0.0));
vec4 l9_72=fract(vec4(1.0,255.0,65025.0,1.65814e+07)*(clamp(gParticle.Life,0.0,1.0)*0.99999));
vec4 l9_73=l9_72-(l9_72.yzww*vec4(0.00392157,0.00392157,0.00392157,0.0));
l9_65=l9_73.w;
l9_64=l9_73.z;
l9_63=l9_73.y;
l9_62=l9_73.x;
l9_61=l9_71.w;
l9_60=l9_71.z;
l9_59=l9_71.y;
l9_58=l9_71.x;
l9_57=l9_69.w;
l9_56=l9_69.z;
l9_55=l9_69.y;
l9_54=l9_69.x;
l9_53=l9_67.w;
l9_52=l9_67.z;
l9_51=l9_67.y;
l9_50=l9_67.x;
}
else
{
float l9_74;
float l9_75;
float l9_76;
float l9_77;
float l9_78;
if (l9_1==3)
{
vec4 l9_79=fract(vec4(1.0,255.0,65025.0,1.65814e+07)*(clamp(gParticle.Age,0.0,1.0)*0.99999));
vec4 l9_80=l9_79-(l9_79.yzww*vec4(0.00392157,0.00392157,0.00392157,0.0));
l9_78=clamp(gParticle.Dead,0.0,255.0)*0.00392157;
l9_77=l9_80.w;
l9_76=l9_80.z;
l9_75=l9_80.y;
l9_74=l9_80.x;
}
else
{
l9_78=0.0;
l9_77=0.0;
l9_76=0.0;
l9_75=0.0;
l9_74=0.0;
}
l9_65=0.0;
l9_64=0.0;
l9_63=0.0;
l9_62=0.0;
l9_61=0.0;
l9_60=0.0;
l9_59=0.0;
l9_58=0.0;
l9_57=0.0;
l9_56=0.0;
l9_55=0.0;
l9_54=l9_78;
l9_53=l9_77;
l9_52=l9_76;
l9_51=l9_75;
l9_50=l9_74;
}
l9_41=l9_65;
l9_40=l9_64;
l9_39=l9_63;
l9_38=l9_62;
l9_37=l9_61;
l9_36=l9_60;
l9_35=l9_59;
l9_34=l9_58;
l9_33=l9_57;
l9_32=l9_56;
l9_31=l9_55;
l9_30=l9_54;
l9_29=l9_53;
l9_28=l9_52;
l9_27=l9_51;
l9_26=l9_50;
}
l9_17=l9_41;
l9_16=l9_40;
l9_15=l9_39;
l9_14=l9_38;
l9_13=l9_37;
l9_12=l9_36;
l9_11=l9_35;
l9_10=l9_34;
l9_9=l9_33;
l9_8=l9_32;
l9_7=l9_31;
l9_6=l9_30;
l9_5=l9_29;
l9_4=l9_28;
l9_3=l9_27;
l9_2=l9_26;
}
rt0=vec4(l9_2,l9_3,l9_4,l9_5);
rt1=vec4(l9_6,l9_7,l9_8,l9_9);
rt2=vec4(l9_10,l9_11,l9_12,l9_13);
rt3=vec4(l9_14,l9_15,l9_16,l9_17);
}
void main()
{
sc_DiscardStereoFragment();
if (dot(((sc_SampleTextureLevel(renderTarget0Dims.xy,renderTarget0Layout,renderTarget0GetStereoViewIndex(),vec2(0.5),(int(SC_USE_UV_TRANSFORM_renderTarget0)!=0),renderTarget0Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget0,SC_SOFTWARE_WRAP_MODE_V_renderTarget0),(int(SC_USE_UV_MIN_MAX_renderTarget0)!=0),renderTarget0UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget0)!=0),renderTarget0BorderColor,0.0,renderTarget0)+sc_SampleTextureLevel(renderTarget1Dims.xy,renderTarget1Layout,renderTarget1GetStereoViewIndex(),vec2(0.5),(int(SC_USE_UV_TRANSFORM_renderTarget1)!=0),renderTarget1Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget1,SC_SOFTWARE_WRAP_MODE_V_renderTarget1),(int(SC_USE_UV_MIN_MAX_renderTarget1)!=0),renderTarget1UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget1)!=0),renderTarget1BorderColor,0.0,renderTarget1))+sc_SampleTextureLevel(renderTarget2Dims.xy,renderTarget2Layout,renderTarget2GetStereoViewIndex(),vec2(0.5),(int(SC_USE_UV_TRANSFORM_renderTarget2)!=0),renderTarget2Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget2,SC_SOFTWARE_WRAP_MODE_V_renderTarget2),(int(SC_USE_UV_MIN_MAX_renderTarget2)!=0),renderTarget2UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget2)!=0),renderTarget2BorderColor,0.0,renderTarget2))+sc_SampleTextureLevel(renderTarget3Dims.xy,renderTarget3Layout,renderTarget3GetStereoViewIndex(),vec2(0.5),(int(SC_USE_UV_TRANSFORM_renderTarget3)!=0),renderTarget3Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget3,SC_SOFTWARE_WRAP_MODE_V_renderTarget3),(int(SC_USE_UV_MIN_MAX_renderTarget3)!=0),renderTarget3UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget3)!=0),renderTarget3BorderColor,0.0,renderTarget3),vec4(0.254232))==0.342318)
{
discard;
}
vec4 l9_0;
vec4 l9_1;
vec4 l9_2;
vec4 l9_3;
if ((overrideTimeEnabled==1)&&(overrideTimeDelta==0.0))
{
l9_3=sc_SampleTextureLevel(renderTarget3Dims.xy,renderTarget3Layout,renderTarget3GetStereoViewIndex(),varPackedTex.xy,(int(SC_USE_UV_TRANSFORM_renderTarget3)!=0),renderTarget3Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget3,SC_SOFTWARE_WRAP_MODE_V_renderTarget3),(int(SC_USE_UV_MIN_MAX_renderTarget3)!=0),renderTarget3UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget3)!=0),renderTarget3BorderColor,0.0,renderTarget3);
l9_2=sc_SampleTextureLevel(renderTarget2Dims.xy,renderTarget2Layout,renderTarget2GetStereoViewIndex(),varPackedTex.xy,(int(SC_USE_UV_TRANSFORM_renderTarget2)!=0),renderTarget2Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget2,SC_SOFTWARE_WRAP_MODE_V_renderTarget2),(int(SC_USE_UV_MIN_MAX_renderTarget2)!=0),renderTarget2UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget2)!=0),renderTarget2BorderColor,0.0,renderTarget2);
l9_1=sc_SampleTextureLevel(renderTarget1Dims.xy,renderTarget1Layout,renderTarget1GetStereoViewIndex(),varPackedTex.xy,(int(SC_USE_UV_TRANSFORM_renderTarget1)!=0),renderTarget1Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget1,SC_SOFTWARE_WRAP_MODE_V_renderTarget1),(int(SC_USE_UV_MIN_MAX_renderTarget1)!=0),renderTarget1UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget1)!=0),renderTarget1BorderColor,0.0,renderTarget1);
l9_0=sc_SampleTextureLevel(renderTarget0Dims.xy,renderTarget0Layout,renderTarget0GetStereoViewIndex(),varPackedTex.xy,(int(SC_USE_UV_TRANSFORM_renderTarget0)!=0),renderTarget0Transform,ivec2(SC_SOFTWARE_WRAP_MODE_U_renderTarget0,SC_SOFTWARE_WRAP_MODE_V_renderTarget0),(int(SC_USE_UV_MIN_MAX_renderTarget0)!=0),renderTarget0UvMinMax,(int(SC_USE_CLAMP_TO_BORDER_renderTarget0)!=0),renderTarget0BorderColor,0.0,renderTarget0);
}
else
{
gParticle.Color=Interp_Particle_Color;
gParticle.Size=Interp_Particle_Size;
gParticle.Position=Interp_Particle_Position;
gParticle.Velocity=Interp_Particle_Velocity;
gParticle.Life=Interp_Particle_Life;
gParticle.Age=Interp_Particle_Age;
gParticle.Dead=Interp_Particle_Dead;
vec4 param_97;
vec4 param_98;
vec4 param_99;
vec4 param_100;
ssEncodeParticle(Interp_Particle_Coord,param_97,param_98,param_99,param_100);
vec4 l9_4=param_97;
vec4 l9_5=param_98;
vec4 l9_6=param_99;
vec4 l9_7=param_100;
vec4 l9_8;
if (dot(((l9_4+l9_5)+l9_6)+l9_7,vec4(0.23454))==0.342318)
{
l9_8=l9_4+vec4(1e-06);
}
else
{
l9_8=l9_4;
}
l9_3=l9_7;
l9_2=l9_6;
l9_1=l9_5;
l9_0=l9_8;
}
sc_writeFragData0(l9_0);
sc_writeFragData1(l9_1);
sc_writeFragData2(l9_2);
sc_writeFragData3(l9_3);
}
#endif // #elif defined FRAGMENT_SHADER // #if defined VERTEX_SHADER
