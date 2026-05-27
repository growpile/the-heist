#pragma clang diagnostic ignored "-Wmissing-prototypes"
#include <metal_stdlib>
#include <simd/simd.h>
using namespace metal;
#define SC_ENABLE_INSTANCED_RENDERING
namespace SNAP_VS {
int sc_GetStereoViewIndex()
{
return 0;
}
}
#ifndef sc_TextureRenderingLayout_Regular
#define sc_TextureRenderingLayout_Regular 0
#define sc_TextureRenderingLayout_StereoInstancedClipped 1
#define sc_TextureRenderingLayout_StereoMultiview 2
#endif
//SG_REFLECTION_BEGIN(200)
//attribute vec4 position 0
//attribute vec2 texture0 3
//attribute vec2 texture1 4
//attribute vec3 normal 1
//attribute vec4 tangent 2
//output vec4 sc_FragData0 0
//output vec4 sc_FragData1 1
//output vec4 sc_FragData2 2
//output vec4 sc_FragData3 3
//sampler sampler renderTarget0SmpSC 0:22
//sampler sampler renderTarget1SmpSC 0:23
//sampler sampler renderTarget2SmpSC 0:24
//sampler sampler renderTarget3SmpSC 0:25
//texture texture2D renderTarget0 0:1:0:22
//texture texture2D renderTarget1 0:2:0:23
//texture texture2D renderTarget2 0:3:0:24
//texture texture2D renderTarget3 0:4:0:25
//ubo int UserUniforms 0:35:7824 {
//float4 sc_Time 1376
//float4 sc_UniformConstants 1392
//float4 sc_StereoClipPlanes 3664:[2]:16
//int overrideTimeEnabled 4108
//float overrideTimeElapsed 4112:[32]:4
//float overrideTimeDelta 4240
//bool vfxBatchEnable 4248:[32]:4
//float4x4 vfxModelMatrix 4512:[32]:64
//int vfxOffsetInstancesRead 7348
//int vfxOffsetInstancesWrite 7352
//float2 vfxTargetSizeRead 7360
//float2 vfxTargetSizeWrite 7368
//int vfxTargetWidth 7376
//float burstDuration 7392
//float explosionForce 7396
//float3 Port_Import_N216 7408
//float Port_Input1_N029 7424
//float3 Port_Min_N213 7440
//float3 Port_Max_N213 7456
//float Port_Import_N004 7472
//float Port_Input1_N005 7476
//float3 Port_Max_N027 7488
//float Port_Import_N214 7504
//float3 Port_Import_N212 7520
//float Port_Input1_N034 7536
//float Port_Input1_N037 7540
//float Port_Multiplier_N012 7544
//float Port_Import_N285 7552
//float3 Port_Import_N284 7568
//float Port_Import_N121 7584
//float Port_Input2_N146 7588
//float3 Port_Import_N071 7600
//float3 Port_Import_N024 7616
//float3 Port_Import_N318 7632
//float Port_Multiplier_N319 7648
//float3 Port_Import_N322 7664
//float2 Port_Input1_N326 7680
//float2 Port_Scale_N327 7688
//float2 Port_Input1_N329 7696
//float2 Port_Scale_N330 7704
//float2 Port_Input1_N332 7712
//float2 Port_Scale_N333 7720
//float3 Port_Input1_N335 7728
//float Port_Import_N075 7744
//float Port_Import_N068 7748
//float Port_Input0_N088 7756
//float Port_Import_N076 7760
//float Port_Input1_N008 7768
//float Port_Input2_N008 7772
//float Port_Input0_N099 7776
//float Port_Import_N077 7780
//float Port_Input1_N112 7788
//float Port_Input2_N112 7792
//float Port_Import_N087 7796
//float Port_Import_N089 7800
//float Port_Import_N116 7804
//float Port_Input2_N136 7808
//}
//spec_const bool renderTarget0HasSwappedViews 0 0
//spec_const bool renderTarget1HasSwappedViews 1 0
//spec_const bool renderTarget2HasSwappedViews 2 0
//spec_const bool renderTarget3HasSwappedViews 3 0
//spec_const int SC_DEVICE_CLASS 4 -1
//spec_const int renderTarget0Layout 5 0
//spec_const int renderTarget1Layout 6 0
//spec_const int renderTarget2Layout 7 0
//spec_const int renderTarget3Layout 8 0
//spec_const int sc_ShaderCacheConstant 9 0
//spec_const int sc_StereoRenderingMode 10 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 11 0
//SG_REFLECTION_END
constant bool renderTarget0HasSwappedViews [[function_constant(0)]];
constant bool renderTarget0HasSwappedViews_tmp = is_function_constant_defined(renderTarget0HasSwappedViews) ? renderTarget0HasSwappedViews : false;
constant bool renderTarget1HasSwappedViews [[function_constant(1)]];
constant bool renderTarget1HasSwappedViews_tmp = is_function_constant_defined(renderTarget1HasSwappedViews) ? renderTarget1HasSwappedViews : false;
constant bool renderTarget2HasSwappedViews [[function_constant(2)]];
constant bool renderTarget2HasSwappedViews_tmp = is_function_constant_defined(renderTarget2HasSwappedViews) ? renderTarget2HasSwappedViews : false;
constant bool renderTarget3HasSwappedViews [[function_constant(3)]];
constant bool renderTarget3HasSwappedViews_tmp = is_function_constant_defined(renderTarget3HasSwappedViews) ? renderTarget3HasSwappedViews : false;
constant int SC_DEVICE_CLASS [[function_constant(4)]];
constant int SC_DEVICE_CLASS_tmp = is_function_constant_defined(SC_DEVICE_CLASS) ? SC_DEVICE_CLASS : -1;
constant int renderTarget0Layout [[function_constant(5)]];
constant int renderTarget0Layout_tmp = is_function_constant_defined(renderTarget0Layout) ? renderTarget0Layout : 0;
constant int renderTarget1Layout [[function_constant(6)]];
constant int renderTarget1Layout_tmp = is_function_constant_defined(renderTarget1Layout) ? renderTarget1Layout : 0;
constant int renderTarget2Layout [[function_constant(7)]];
constant int renderTarget2Layout_tmp = is_function_constant_defined(renderTarget2Layout) ? renderTarget2Layout : 0;
constant int renderTarget3Layout [[function_constant(8)]];
constant int renderTarget3Layout_tmp = is_function_constant_defined(renderTarget3Layout) ? renderTarget3Layout : 0;
constant int sc_ShaderCacheConstant [[function_constant(9)]];
constant int sc_ShaderCacheConstant_tmp = is_function_constant_defined(sc_ShaderCacheConstant) ? sc_ShaderCacheConstant : 0;
constant int sc_StereoRenderingMode [[function_constant(10)]];
constant int sc_StereoRenderingMode_tmp = is_function_constant_defined(sc_StereoRenderingMode) ? sc_StereoRenderingMode : 0;
constant int sc_StereoRendering_IsClipDistanceEnabled [[function_constant(11)]];
constant int sc_StereoRendering_IsClipDistanceEnabled_tmp = is_function_constant_defined(sc_StereoRendering_IsClipDistanceEnabled) ? sc_StereoRendering_IsClipDistanceEnabled : 0;

namespace SNAP_VS {
struct sc_Vertex_t
{
float4 position;
float3 normal;
float3 tangent;
float2 texture0;
float2 texture1;
};
struct ssParticle
{
float3 Position;
float3 Velocity;
float4 Color;
float Size;
float Age;
float Life;
float Mass;
float3x3 Matrix;
bool Dead;
float4 Quaternion;
float SpawnIndex;
float SpawnIndexRemainder;
float NextBurstTime;
float SpawnOffset;
float Seed;
float2 Seed2000;
float TimeShift;
int Index1D;
int Index1DPerCopy;
float Index1DPerCopyF;
int StateID;
float Coord1D;
float Ratio1D;
float Ratio1DPerCopy;
int2 Index2D;
float2 Coord2D;
float2 Ratio2D;
float3 Force;
bool Spawned;
float CopyId;
float SpawnAmount;
float BurstAmount;
float BurstPeriod;
};
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float gComponentTime;
};
struct sc_PointLight_t
{
int falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
float3 direction;
float3 position;
float4 color;
};
struct sc_DirectionalLight_t
{
float3 direction;
float4 color;
};
struct sc_AmbientLight_t
{
float3 color;
float intensity;
};
struct sc_SphericalGaussianLight_t
{
float3 color;
float sharpness;
float3 axis;
};
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
float3 ambientLight;
};
struct sc_Camera_t
{
float3 position;
float aspect;
float2 clipPlanes;
};
struct userUniformsObj
{
sc_PointLight_t sc_PointLights[3];
sc_DirectionalLight_t sc_DirectionalLights[5];
sc_AmbientLight_t sc_AmbientLights[3];
sc_LightEstimationData_t sc_LightEstimationData;
float4 sc_EnvmapDiffuseSize;
float4 sc_EnvmapDiffuseDims;
float4 sc_EnvmapDiffuseView;
float4 sc_EnvmapSpecularSize;
float4 sc_EnvmapSpecularDims;
float4 sc_EnvmapSpecularView;
float3 sc_EnvmapRotation;
float sc_EnvmapExposure;
float3 sc_Sh[9];
float sc_ShIntensity;
float4 sc_Time;
float4 sc_UniformConstants;
float4 sc_GeometryInfo;
float4x4 sc_ModelViewProjectionMatrixArray[2];
float4x4 sc_ModelViewProjectionMatrixInverseArray[2];
float4x4 sc_ViewProjectionMatrixArray[2];
float4x4 sc_ViewProjectionMatrixInverseArray[2];
float4x4 sc_ModelViewMatrixArray[2];
float4x4 sc_ModelViewMatrixInverseArray[2];
float3x3 sc_ViewNormalMatrixArray[2];
float3x3 sc_ViewNormalMatrixInverseArray[2];
float4x4 sc_ProjectionMatrixArray[2];
float4x4 sc_ProjectionMatrixInverseArray[2];
float4x4 sc_ViewMatrixArray[2];
float4x4 sc_ViewMatrixInverseArray[2];
float4x4 sc_PrevFrameViewProjectionMatrixArray[2];
float4x4 sc_ModelMatrix;
float4x4 sc_ModelMatrixInverse;
float3x3 sc_NormalMatrix;
float3x3 sc_NormalMatrixInverse;
float4x4 sc_PrevFrameModelMatrix;
float4x4 sc_PrevFrameModelMatrixInverse;
float3 sc_LocalAabbMin;
float3 sc_LocalAabbMax;
float3 sc_WorldAabbMin;
float3 sc_WorldAabbMax;
float4 sc_WindowToViewportTransform;
float4 sc_CurrentRenderTargetDims;
sc_Camera_t sc_Camera;
float sc_ShadowDensity;
float4 sc_ShadowColor;
float4x4 sc_ProjectorMatrix;
float shaderComplexityValue;
float4 weights0;
float4 weights1;
float4 weights2;
float4 sc_StereoClipPlanes[2];
int sc_FallbackInstanceID;
float2 sc_TAAJitterOffset;
float strandWidth;
float strandTaper;
float4 sc_StrandDataMapTextureSize;
float clumpInstanceCount;
float clumpRadius;
float clumpTipScale;
float hairstyleInstanceCount;
float hairstyleNoise;
float4 sc_ScreenTextureSize;
float4 sc_ScreenTextureDims;
float4 sc_ScreenTextureView;
float4 voxelization_params_0;
float4 voxelization_params_frustum_lrbt;
float4 voxelization_params_frustum_nf;
float3 voxelization_params_camera_pos;
float4x4 sc_ModelMatrixVoxelization;
float correctedIntensity;
float4 intensityTextureSize;
float4 intensityTextureDims;
float4 intensityTextureView;
float3x3 intensityTextureTransform;
float4 intensityTextureUvMinMax;
float4 intensityTextureBorderColor;
float reflBlurWidth;
float reflBlurMinRough;
float reflBlurMaxRough;
int overrideTimeEnabled;
float overrideTimeElapsed[32];
float overrideTimeDelta;
int vfxNumCopies;
int vfxBatchEnable[32];
int vfxEmitParticle[32];
float4x4 vfxModelMatrix[32];
float4 renderTarget0Size;
float4 renderTarget0Dims;
float4 renderTarget0View;
float4 renderTarget1Size;
float4 renderTarget1Dims;
float4 renderTarget1View;
float4 renderTarget2Size;
float4 renderTarget2Dims;
float4 renderTarget2View;
float4 renderTarget3Size;
float4 renderTarget3Dims;
float4 renderTarget3View;
float4 sortRenderTarget0Size;
float4 sortRenderTarget0Dims;
float4 sortRenderTarget0View;
float4 sortRenderTarget1Size;
float4 sortRenderTarget1Dims;
float4 sortRenderTarget1View;
float3 vfxLocalAabbMin;
float3 vfxLocalAabbMax;
float vfxCameraAspect;
float vfxCameraNear;
float vfxCameraFar;
float4x4 vfxProjectionMatrix;
float4x4 vfxProjectionMatrixInverse;
float4x4 vfxViewMatrix;
float4x4 vfxViewMatrixInverse;
float4x4 vfxViewProjectionMatrix;
float4x4 vfxViewProjectionMatrixInverse;
float3 vfxCameraPosition;
float3 vfxCameraUp;
float3 vfxCameraForward;
float3 vfxCameraRight;
int vfxFrame;
int vfxOffsetInstancesRead;
int vfxOffsetInstancesWrite;
float2 vfxTargetSizeRead;
float2 vfxTargetSizeWrite;
int vfxTargetWidth;
float2 ssSORT_RENDER_TARGET_SIZE;
float burstDuration;
float explosionForce;
float3 Port_Import_N216;
float Port_Input1_N029;
float3 Port_Min_N213;
float3 Port_Max_N213;
float Port_Import_N004;
float Port_Input1_N005;
float3 Port_Max_N027;
float Port_Import_N214;
float3 Port_Import_N212;
float Port_Input1_N034;
float Port_Input1_N037;
float Port_Multiplier_N012;
float Port_Enabled_N086;
float Port_Import_N285;
float3 Port_Import_N284;
float Port_Import_N121;
float Port_Input2_N146;
float3 Port_Import_N071;
float3 Port_Import_N024;
float3 Port_Import_N318;
float Port_Multiplier_N319;
float3 Port_Import_N322;
float2 Port_Input1_N326;
float2 Port_Scale_N327;
float2 Port_Input1_N329;
float2 Port_Scale_N330;
float2 Port_Input1_N332;
float2 Port_Scale_N333;
float3 Port_Input1_N335;
float Port_Import_N075;
float Port_Import_N068;
float Port_Import_N082;
float Port_Input0_N088;
float Port_Import_N076;
float Port_Import_N083;
float Port_Input1_N008;
float Port_Input2_N008;
float Port_Input0_N099;
float Port_Import_N077;
float Port_Import_N084;
float Port_Input1_N112;
float Port_Input2_N112;
float Port_Import_N087;
float Port_Import_N089;
float Port_Import_N116;
float Port_Input2_N136;
};
struct sc_Set0
{
texture2d<float> renderTarget0 [[id(1)]];
texture2d<float> renderTarget1 [[id(2)]];
texture2d<float> renderTarget2 [[id(3)]];
texture2d<float> renderTarget3 [[id(4)]];
sampler renderTarget0SmpSC [[id(22)]];
sampler renderTarget1SmpSC [[id(23)]];
sampler renderTarget2SmpSC [[id(24)]];
sampler renderTarget3SmpSC [[id(25)]];
constant userUniformsObj* UserUniforms [[id(35)]];
};
struct main_vert_out
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float2 varShadowTex [[user(locn6)]];
int varStereoViewID [[user(locn7)]];
float varClipDistance [[user(locn8)]];
float4 varColor [[user(locn9)]];
int Interp_Particle_Index [[user(locn10)]];
float3 Interp_Particle_Force [[user(locn11)]];
float2 Interp_Particle_Coord [[user(locn12)]];
float Interp_Particle_SpawnIndex [[user(locn13)]];
float Interp_Particle_NextBurstTime [[user(locn14)]];
float3 Interp_Particle_Position [[user(locn15)]];
float3 Interp_Particle_Velocity [[user(locn16)]];
float Interp_Particle_Life [[user(locn17)]];
float Interp_Particle_Age [[user(locn18)]];
float Interp_Particle_Size [[user(locn19)]];
float4 Interp_Particle_Color [[user(locn20)]];
float4 Interp_Particle_Quaternion [[user(locn21)]];
float4 gl_Position [[position]];
};
struct main_vert_in
{
float4 position [[attribute(0)]];
float3 normal [[attribute(1)]];
float4 tangent [[attribute(2)]];
float2 texture0 [[attribute(3)]];
float2 texture1 [[attribute(4)]];
};
// Implementation of the GLSL mod() function,which is slightly different than Metal fmod()
template<typename Tx,typename Ty>
Tx mod(Tx x,Ty y)
{
return x-y*floor(x/y);
}
bool ssDecodeParticle(thread const int& InstanceID,thread uint& gl_InstanceIndex,constant userUniformsObj& UserUniforms,thread texture2d<float> renderTarget0,thread sampler renderTarget0SmpSC,thread texture2d<float> renderTarget1,thread sampler renderTarget1SmpSC,thread texture2d<float> renderTarget2,thread sampler renderTarget2SmpSC,thread texture2d<float> renderTarget3,thread sampler renderTarget3SmpSC,thread ssParticle& gParticle)
{
ssParticle param=gParticle;
int param_1=InstanceID;
param.Position=float3(0.0);
param.Velocity=float3(0.0);
param.Color=float4(0.0);
param.Size=0.0;
param.Age=0.0;
param.Life=0.0;
param.Mass=1.0;
param.Matrix=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(0.0,0.0,1.0));
param.Quaternion=float4(0.0,0.0,0.0,1.0);
param.CopyId=float(param_1/170);
param.SpawnIndex=-1.0;
param.SpawnIndexRemainder=-1.0;
param.SpawnAmount=0.0;
param.BurstAmount=0.0;
param.BurstPeriod=0.0;
param.NextBurstTime=0.0;
gParticle=param;
int param_2=InstanceID;
ssParticle param_3=gParticle;
int l9_0=param_2/170;
param_3.Spawned=false;
param_3.Dead=false;
param_3.Force=float3(0.0);
param_3.Index1D=param_2;
param_3.Index1DPerCopy=param_2%170;
param_3.Index1DPerCopyF=float(param_3.Index1DPerCopy);
param_3.StateID=(170*((param_2/170)+1))-1;
int l9_1=param_3.Index1D;
int2 l9_2=int2(l9_1%170,l9_1/170);
param_3.Index2D=l9_2;
int l9_3=param_3.Index1D;
float l9_4=(float(l9_3)+0.5)/170.0;
param_3.Coord1D=l9_4;
int2 l9_5=param_3.Index2D;
float2 l9_6=(float2(l9_5)+float2(0.5))/float2(170.0,1.0);
param_3.Coord2D=l9_6;
int l9_7=param_3.Index1D;
float l9_8=float(l9_7)/169.0;
param_3.Ratio1D=l9_8;
int l9_9=param_3.Index1DPerCopy;
float l9_10=float(l9_9)/169.0;
param_3.Ratio1DPerCopy=l9_10;
int2 l9_11=param_3.Index2D;
float2 l9_12=float2(l9_11)/float2(169.0,1.0);
param_3.Ratio2D=l9_12;
param_3.Seed=0.0;
float2 l9_13=float2(param_3.Ratio1D)*float2(0.3452,0.52253997);
float l9_14=dot(l9_13,float2(0.98253,0.72662002));
l9_14=sin(l9_14)*479.371;
l9_14=fract(l9_14);
l9_14=floor(l9_14*10000.0)*9.9999997e-05;
float l9_15=l9_14;
param_3.TimeShift=l9_15;
param_3.SpawnOffset=param_3.Ratio1D*1.0;
ssParticle l9_16=param_3;
int l9_17=l9_0;
float l9_18;
if (UserUniforms.overrideTimeEnabled==1)
{
l9_18=UserUniforms.overrideTimeElapsed[l9_17];
}
else
{
l9_18=UserUniforms.sc_Time.x;
}
float l9_19=l9_18;
l9_16.Seed=(l9_16.Ratio1D*0.97637898)+0.151235;
l9_16.Seed+=(floor(((((l9_19-l9_16.SpawnOffset)-0.0)+0.0)+2.0)/1.0)*4.32723);
l9_16.Seed=fract(abs(l9_16.Seed));
int2 l9_20=int2(l9_16.Index1D%400,l9_16.Index1D/400);
l9_16.Seed2000=(float2(l9_20)+float2(1.0))/float2(399.0);
param_3=l9_16;
gParticle=param_3;
int offsetPixelId=(UserUniforms.vfxOffsetInstancesRead+InstanceID)*4;
int param_4=offsetPixelId;
int param_5=UserUniforms.vfxTargetWidth;
int l9_21=param_4-((param_4/param_5)*param_5);
int2 Index2D=int2(l9_21,offsetPixelId/UserUniforms.vfxTargetWidth);
float2 Coord=(float2(Index2D)+float2(0.5))/float2(2048.0,UserUniforms.vfxTargetSizeRead.y);
float2 Offset=float2(0.00048828125,0.0);
float2 uv=float2(0.0);
float Scalar0=0.0;
float Scalar1=0.0;
float Scalar2=0.0;
float Scalar3=0.0;
float Scalar4=0.0;
float Scalar5=0.0;
float Scalar6=0.0;
float Scalar7=0.0;
float Scalar8=0.0;
float Scalar9=0.0;
float Scalar10=0.0;
float Scalar11=0.0;
float Scalar12=0.0;
float Scalar13=0.0;
float Scalar14=0.0;
float Scalar15=0.0;
uv=Coord+(Offset*0.0);
float2 param_6=uv;
float2 l9_22=param_6;
int l9_23;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_24=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_24=0;
}
else
{
l9_24=gl_InstanceIndex%2;
}
int l9_25=l9_24;
l9_23=1-l9_25;
}
else
{
int l9_26=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_26=0;
}
else
{
l9_26=gl_InstanceIndex%2;
}
int l9_27=l9_26;
l9_23=l9_27;
}
int l9_28=l9_23;
float2 l9_29=l9_22;
int l9_30=renderTarget0Layout_tmp;
int l9_31=l9_28;
float2 l9_32=l9_29;
int l9_33=l9_30;
int l9_34=l9_31;
float3 l9_35=float3(0.0);
if (l9_33==0)
{
l9_35=float3(l9_32,0.0);
}
else
{
if (l9_33==1)
{
l9_35=float3(l9_32.x,(l9_32.y*0.5)+(0.5-(float(l9_34)*0.5)),0.0);
}
else
{
l9_35=float3(l9_32,float(l9_34));
}
}
float3 l9_36=l9_35;
float3 l9_37=l9_36;
float4 l9_38=renderTarget0.sample(renderTarget0SmpSC,l9_37.xy,level(0.0));
float4 l9_39=l9_38;
float4 l9_40=l9_39;
float4 renderTarget0Sample=l9_40;
float4 l9_41=renderTarget0Sample;
bool l9_42=dot(abs(l9_41),float4(1.0))<9.9999997e-06;
bool l9_43;
if (!l9_42)
{
int l9_44=gl_InstanceIndex;
l9_43=!(UserUniforms.vfxBatchEnable[l9_44/170]!=0);
}
else
{
l9_43=l9_42;
}
if (l9_43)
{
return false;
}
Scalar0=renderTarget0Sample.x;
Scalar1=renderTarget0Sample.y;
Scalar2=renderTarget0Sample.z;
Scalar3=renderTarget0Sample.w;
float2 param_7=uv;
float2 l9_45=param_7;
int l9_46;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_47=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_47=0;
}
else
{
l9_47=gl_InstanceIndex%2;
}
int l9_48=l9_47;
l9_46=1-l9_48;
}
else
{
int l9_49=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_49=0;
}
else
{
l9_49=gl_InstanceIndex%2;
}
int l9_50=l9_49;
l9_46=l9_50;
}
int l9_51=l9_46;
float2 l9_52=l9_45;
int l9_53=renderTarget1Layout_tmp;
int l9_54=l9_51;
float2 l9_55=l9_52;
int l9_56=l9_53;
int l9_57=l9_54;
float3 l9_58=float3(0.0);
if (l9_56==0)
{
l9_58=float3(l9_55,0.0);
}
else
{
if (l9_56==1)
{
l9_58=float3(l9_55.x,(l9_55.y*0.5)+(0.5-(float(l9_57)*0.5)),0.0);
}
else
{
l9_58=float3(l9_55,float(l9_57));
}
}
float3 l9_59=l9_58;
float3 l9_60=l9_59;
float4 l9_61=renderTarget1.sample(renderTarget1SmpSC,l9_60.xy,level(0.0));
float4 l9_62=l9_61;
float4 l9_63=l9_62;
float4 renderTarget1Sample=l9_63;
Scalar4=renderTarget1Sample.x;
Scalar5=renderTarget1Sample.y;
Scalar6=renderTarget1Sample.z;
Scalar7=renderTarget1Sample.w;
float2 param_8=uv;
float2 l9_64=param_8;
int l9_65;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_66=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_66=0;
}
else
{
l9_66=gl_InstanceIndex%2;
}
int l9_67=l9_66;
l9_65=1-l9_67;
}
else
{
int l9_68=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_68=0;
}
else
{
l9_68=gl_InstanceIndex%2;
}
int l9_69=l9_68;
l9_65=l9_69;
}
int l9_70=l9_65;
float2 l9_71=l9_64;
int l9_72=renderTarget2Layout_tmp;
int l9_73=l9_70;
float2 l9_74=l9_71;
int l9_75=l9_72;
int l9_76=l9_73;
float3 l9_77=float3(0.0);
if (l9_75==0)
{
l9_77=float3(l9_74,0.0);
}
else
{
if (l9_75==1)
{
l9_77=float3(l9_74.x,(l9_74.y*0.5)+(0.5-(float(l9_76)*0.5)),0.0);
}
else
{
l9_77=float3(l9_74,float(l9_76));
}
}
float3 l9_78=l9_77;
float3 l9_79=l9_78;
float4 l9_80=renderTarget2.sample(renderTarget2SmpSC,l9_79.xy,level(0.0));
float4 l9_81=l9_80;
float4 l9_82=l9_81;
float4 renderTarget2Sample=l9_82;
Scalar8=renderTarget2Sample.x;
Scalar9=renderTarget2Sample.y;
Scalar10=renderTarget2Sample.z;
Scalar11=renderTarget2Sample.w;
float2 param_9=uv;
float2 l9_83=param_9;
int l9_84;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_85=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_85=0;
}
else
{
l9_85=gl_InstanceIndex%2;
}
int l9_86=l9_85;
l9_84=1-l9_86;
}
else
{
int l9_87=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_87=0;
}
else
{
l9_87=gl_InstanceIndex%2;
}
int l9_88=l9_87;
l9_84=l9_88;
}
int l9_89=l9_84;
float2 l9_90=l9_83;
int l9_91=renderTarget3Layout_tmp;
int l9_92=l9_89;
float2 l9_93=l9_90;
int l9_94=l9_91;
int l9_95=l9_92;
float3 l9_96=float3(0.0);
if (l9_94==0)
{
l9_96=float3(l9_93,0.0);
}
else
{
if (l9_94==1)
{
l9_96=float3(l9_93.x,(l9_93.y*0.5)+(0.5-(float(l9_95)*0.5)),0.0);
}
else
{
l9_96=float3(l9_93,float(l9_95));
}
}
float3 l9_97=l9_96;
float3 l9_98=l9_97;
float4 l9_99=renderTarget3.sample(renderTarget3SmpSC,l9_98.xy,level(0.0));
float4 l9_100=l9_99;
float4 l9_101=l9_100;
float4 renderTarget3Sample=l9_101;
Scalar12=renderTarget3Sample.x;
Scalar13=renderTarget3Sample.y;
Scalar14=renderTarget3Sample.z;
Scalar15=renderTarget3Sample.w;
float4 param_10=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_11=-1000.0;
float param_12=1000.0;
float4 l9_102=param_10;
float l9_103=param_11;
float l9_104=param_12;
float l9_105=0.99998999;
float4 l9_106=l9_102;
#if (1)
{
l9_106=floor((l9_106*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_107=dot(l9_106,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_108=l9_107;
float l9_109=0.0;
float l9_110=l9_105;
float l9_111=l9_103;
float l9_112=l9_104;
float l9_113=l9_111+(((l9_108-l9_109)*(l9_112-l9_111))/(l9_110-l9_109));
float l9_114=l9_113;
float l9_115=l9_114;
gParticle.Position.x=l9_115;
float4 param_13=float4(Scalar4,Scalar5,Scalar6,Scalar7);
float param_14=-1000.0;
float param_15=1000.0;
float4 l9_116=param_13;
float l9_117=param_14;
float l9_118=param_15;
float l9_119=0.99998999;
float4 l9_120=l9_116;
#if (1)
{
l9_120=floor((l9_120*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_121=dot(l9_120,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_122=l9_121;
float l9_123=0.0;
float l9_124=l9_119;
float l9_125=l9_117;
float l9_126=l9_118;
float l9_127=l9_125+(((l9_122-l9_123)*(l9_126-l9_125))/(l9_124-l9_123));
float l9_128=l9_127;
float l9_129=l9_128;
gParticle.Position.y=l9_129;
float4 param_16=float4(Scalar8,Scalar9,Scalar10,Scalar11);
float param_17=-1000.0;
float param_18=1000.0;
float4 l9_130=param_16;
float l9_131=param_17;
float l9_132=param_18;
float l9_133=0.99998999;
float4 l9_134=l9_130;
#if (1)
{
l9_134=floor((l9_134*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_135=dot(l9_134,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_136=l9_135;
float l9_137=0.0;
float l9_138=l9_133;
float l9_139=l9_131;
float l9_140=l9_132;
float l9_141=l9_139+(((l9_136-l9_137)*(l9_140-l9_139))/(l9_138-l9_137));
float l9_142=l9_141;
float l9_143=l9_142;
gParticle.Position.z=l9_143;
float4 param_19=float4(Scalar12,Scalar13,Scalar14,Scalar15);
float param_20=-1000.0;
float param_21=1000.0;
float4 l9_144=param_19;
float l9_145=param_20;
float l9_146=param_21;
float l9_147=0.99998999;
float4 l9_148=l9_144;
#if (1)
{
l9_148=floor((l9_148*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_149=dot(l9_148,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_150=l9_149;
float l9_151=0.0;
float l9_152=l9_147;
float l9_153=l9_145;
float l9_154=l9_146;
float l9_155=l9_153+(((l9_150-l9_151)*(l9_154-l9_153))/(l9_152-l9_151));
float l9_156=l9_155;
float l9_157=l9_156;
gParticle.Velocity.x=l9_157;
uv=Coord+(Offset*1.0);
float2 param_22=uv;
float2 l9_158=param_22;
int l9_159;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_160=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_160=0;
}
else
{
l9_160=gl_InstanceIndex%2;
}
int l9_161=l9_160;
l9_159=1-l9_161;
}
else
{
int l9_162=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_162=0;
}
else
{
l9_162=gl_InstanceIndex%2;
}
int l9_163=l9_162;
l9_159=l9_163;
}
int l9_164=l9_159;
float2 l9_165=l9_158;
int l9_166=renderTarget0Layout_tmp;
int l9_167=l9_164;
float2 l9_168=l9_165;
int l9_169=l9_166;
int l9_170=l9_167;
float3 l9_171=float3(0.0);
if (l9_169==0)
{
l9_171=float3(l9_168,0.0);
}
else
{
if (l9_169==1)
{
l9_171=float3(l9_168.x,(l9_168.y*0.5)+(0.5-(float(l9_170)*0.5)),0.0);
}
else
{
l9_171=float3(l9_168,float(l9_170));
}
}
float3 l9_172=l9_171;
float3 l9_173=l9_172;
float4 l9_174=renderTarget0.sample(renderTarget0SmpSC,l9_173.xy,level(0.0));
float4 l9_175=l9_174;
float4 l9_176=l9_175;
float4 renderTarget0Sample_1=l9_176;
Scalar0=renderTarget0Sample_1.x;
Scalar1=renderTarget0Sample_1.y;
Scalar2=renderTarget0Sample_1.z;
Scalar3=renderTarget0Sample_1.w;
float2 param_23=uv;
float2 l9_177=param_23;
int l9_178;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_179=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_179=0;
}
else
{
l9_179=gl_InstanceIndex%2;
}
int l9_180=l9_179;
l9_178=1-l9_180;
}
else
{
int l9_181=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_181=0;
}
else
{
l9_181=gl_InstanceIndex%2;
}
int l9_182=l9_181;
l9_178=l9_182;
}
int l9_183=l9_178;
float2 l9_184=l9_177;
int l9_185=renderTarget1Layout_tmp;
int l9_186=l9_183;
float2 l9_187=l9_184;
int l9_188=l9_185;
int l9_189=l9_186;
float3 l9_190=float3(0.0);
if (l9_188==0)
{
l9_190=float3(l9_187,0.0);
}
else
{
if (l9_188==1)
{
l9_190=float3(l9_187.x,(l9_187.y*0.5)+(0.5-(float(l9_189)*0.5)),0.0);
}
else
{
l9_190=float3(l9_187,float(l9_189));
}
}
float3 l9_191=l9_190;
float3 l9_192=l9_191;
float4 l9_193=renderTarget1.sample(renderTarget1SmpSC,l9_192.xy,level(0.0));
float4 l9_194=l9_193;
float4 l9_195=l9_194;
float4 renderTarget1Sample_1=l9_195;
Scalar4=renderTarget1Sample_1.x;
Scalar5=renderTarget1Sample_1.y;
Scalar6=renderTarget1Sample_1.z;
Scalar7=renderTarget1Sample_1.w;
float2 param_24=uv;
float2 l9_196=param_24;
int l9_197;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_198=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_198=0;
}
else
{
l9_198=gl_InstanceIndex%2;
}
int l9_199=l9_198;
l9_197=1-l9_199;
}
else
{
int l9_200=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_200=0;
}
else
{
l9_200=gl_InstanceIndex%2;
}
int l9_201=l9_200;
l9_197=l9_201;
}
int l9_202=l9_197;
float2 l9_203=l9_196;
int l9_204=renderTarget2Layout_tmp;
int l9_205=l9_202;
float2 l9_206=l9_203;
int l9_207=l9_204;
int l9_208=l9_205;
float3 l9_209=float3(0.0);
if (l9_207==0)
{
l9_209=float3(l9_206,0.0);
}
else
{
if (l9_207==1)
{
l9_209=float3(l9_206.x,(l9_206.y*0.5)+(0.5-(float(l9_208)*0.5)),0.0);
}
else
{
l9_209=float3(l9_206,float(l9_208));
}
}
float3 l9_210=l9_209;
float3 l9_211=l9_210;
float4 l9_212=renderTarget2.sample(renderTarget2SmpSC,l9_211.xy,level(0.0));
float4 l9_213=l9_212;
float4 l9_214=l9_213;
float4 renderTarget2Sample_1=l9_214;
Scalar8=renderTarget2Sample_1.x;
Scalar9=renderTarget2Sample_1.y;
Scalar10=renderTarget2Sample_1.z;
Scalar11=renderTarget2Sample_1.w;
float2 param_25=uv;
float2 l9_215=param_25;
int l9_216;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_217=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_217=0;
}
else
{
l9_217=gl_InstanceIndex%2;
}
int l9_218=l9_217;
l9_216=1-l9_218;
}
else
{
int l9_219=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_219=0;
}
else
{
l9_219=gl_InstanceIndex%2;
}
int l9_220=l9_219;
l9_216=l9_220;
}
int l9_221=l9_216;
float2 l9_222=l9_215;
int l9_223=renderTarget3Layout_tmp;
int l9_224=l9_221;
float2 l9_225=l9_222;
int l9_226=l9_223;
int l9_227=l9_224;
float3 l9_228=float3(0.0);
if (l9_226==0)
{
l9_228=float3(l9_225,0.0);
}
else
{
if (l9_226==1)
{
l9_228=float3(l9_225.x,(l9_225.y*0.5)+(0.5-(float(l9_227)*0.5)),0.0);
}
else
{
l9_228=float3(l9_225,float(l9_227));
}
}
float3 l9_229=l9_228;
float3 l9_230=l9_229;
float4 l9_231=renderTarget3.sample(renderTarget3SmpSC,l9_230.xy,level(0.0));
float4 l9_232=l9_231;
float4 l9_233=l9_232;
float4 renderTarget3Sample_1=l9_233;
Scalar12=renderTarget3Sample_1.x;
Scalar13=renderTarget3Sample_1.y;
Scalar14=renderTarget3Sample_1.z;
Scalar15=renderTarget3Sample_1.w;
float4 param_26=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_27=-1000.0;
float param_28=1000.0;
float4 l9_234=param_26;
float l9_235=param_27;
float l9_236=param_28;
float l9_237=0.99998999;
float4 l9_238=l9_234;
#if (1)
{
l9_238=floor((l9_238*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_239=dot(l9_238,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_240=l9_239;
float l9_241=0.0;
float l9_242=l9_237;
float l9_243=l9_235;
float l9_244=l9_236;
float l9_245=l9_243+(((l9_240-l9_241)*(l9_244-l9_243))/(l9_242-l9_241));
float l9_246=l9_245;
float l9_247=l9_246;
gParticle.Velocity.y=l9_247;
float4 param_29=float4(Scalar4,Scalar5,Scalar6,Scalar7);
float param_30=-1000.0;
float param_31=1000.0;
float4 l9_248=param_29;
float l9_249=param_30;
float l9_250=param_31;
float l9_251=0.99998999;
float4 l9_252=l9_248;
#if (1)
{
l9_252=floor((l9_252*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_253=dot(l9_252,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_254=l9_253;
float l9_255=0.0;
float l9_256=l9_251;
float l9_257=l9_249;
float l9_258=l9_250;
float l9_259=l9_257+(((l9_254-l9_255)*(l9_258-l9_257))/(l9_256-l9_255));
float l9_260=l9_259;
float l9_261=l9_260;
gParticle.Velocity.z=l9_261;
float4 param_32=float4(Scalar8,Scalar9,Scalar10,Scalar11);
float param_33=0.0;
float param_34=1.0;
float4 l9_262=param_32;
float l9_263=param_33;
float l9_264=param_34;
float l9_265=0.99998999;
float4 l9_266=l9_262;
#if (1)
{
l9_266=floor((l9_266*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_267=dot(l9_266,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_268=l9_267;
float l9_269=0.0;
float l9_270=l9_265;
float l9_271=l9_263;
float l9_272=l9_264;
float l9_273=l9_271+(((l9_268-l9_269)*(l9_272-l9_271))/(l9_270-l9_269));
float l9_274=l9_273;
float l9_275=l9_274;
gParticle.Life=l9_275;
float4 param_35=float4(Scalar12,Scalar13,Scalar14,Scalar15);
float param_36=0.0;
float param_37=1.0;
float4 l9_276=param_35;
float l9_277=param_36;
float l9_278=param_37;
float l9_279=0.99998999;
float4 l9_280=l9_276;
#if (1)
{
l9_280=floor((l9_280*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_281=dot(l9_280,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_282=l9_281;
float l9_283=0.0;
float l9_284=l9_279;
float l9_285=l9_277;
float l9_286=l9_278;
float l9_287=l9_285+(((l9_282-l9_283)*(l9_286-l9_285))/(l9_284-l9_283));
float l9_288=l9_287;
float l9_289=l9_288;
gParticle.Age=l9_289;
uv=Coord+(Offset*2.0);
float2 param_38=uv;
float2 l9_290=param_38;
int l9_291;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_292=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_292=0;
}
else
{
l9_292=gl_InstanceIndex%2;
}
int l9_293=l9_292;
l9_291=1-l9_293;
}
else
{
int l9_294=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_294=0;
}
else
{
l9_294=gl_InstanceIndex%2;
}
int l9_295=l9_294;
l9_291=l9_295;
}
int l9_296=l9_291;
float2 l9_297=l9_290;
int l9_298=renderTarget0Layout_tmp;
int l9_299=l9_296;
float2 l9_300=l9_297;
int l9_301=l9_298;
int l9_302=l9_299;
float3 l9_303=float3(0.0);
if (l9_301==0)
{
l9_303=float3(l9_300,0.0);
}
else
{
if (l9_301==1)
{
l9_303=float3(l9_300.x,(l9_300.y*0.5)+(0.5-(float(l9_302)*0.5)),0.0);
}
else
{
l9_303=float3(l9_300,float(l9_302));
}
}
float3 l9_304=l9_303;
float3 l9_305=l9_304;
float4 l9_306=renderTarget0.sample(renderTarget0SmpSC,l9_305.xy,level(0.0));
float4 l9_307=l9_306;
float4 l9_308=l9_307;
float4 renderTarget0Sample_2=l9_308;
Scalar0=renderTarget0Sample_2.x;
Scalar1=renderTarget0Sample_2.y;
Scalar2=renderTarget0Sample_2.z;
Scalar3=renderTarget0Sample_2.w;
float2 param_39=uv;
float2 l9_309=param_39;
int l9_310;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_311=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_311=0;
}
else
{
l9_311=gl_InstanceIndex%2;
}
int l9_312=l9_311;
l9_310=1-l9_312;
}
else
{
int l9_313=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_313=0;
}
else
{
l9_313=gl_InstanceIndex%2;
}
int l9_314=l9_313;
l9_310=l9_314;
}
int l9_315=l9_310;
float2 l9_316=l9_309;
int l9_317=renderTarget1Layout_tmp;
int l9_318=l9_315;
float2 l9_319=l9_316;
int l9_320=l9_317;
int l9_321=l9_318;
float3 l9_322=float3(0.0);
if (l9_320==0)
{
l9_322=float3(l9_319,0.0);
}
else
{
if (l9_320==1)
{
l9_322=float3(l9_319.x,(l9_319.y*0.5)+(0.5-(float(l9_321)*0.5)),0.0);
}
else
{
l9_322=float3(l9_319,float(l9_321));
}
}
float3 l9_323=l9_322;
float3 l9_324=l9_323;
float4 l9_325=renderTarget1.sample(renderTarget1SmpSC,l9_324.xy,level(0.0));
float4 l9_326=l9_325;
float4 l9_327=l9_326;
float4 renderTarget1Sample_2=l9_327;
Scalar4=renderTarget1Sample_2.x;
Scalar5=renderTarget1Sample_2.y;
Scalar6=renderTarget1Sample_2.z;
Scalar7=renderTarget1Sample_2.w;
float2 param_40=uv;
float2 l9_328=param_40;
int l9_329;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_330=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_330=0;
}
else
{
l9_330=gl_InstanceIndex%2;
}
int l9_331=l9_330;
l9_329=1-l9_331;
}
else
{
int l9_332=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_332=0;
}
else
{
l9_332=gl_InstanceIndex%2;
}
int l9_333=l9_332;
l9_329=l9_333;
}
int l9_334=l9_329;
float2 l9_335=l9_328;
int l9_336=renderTarget2Layout_tmp;
int l9_337=l9_334;
float2 l9_338=l9_335;
int l9_339=l9_336;
int l9_340=l9_337;
float3 l9_341=float3(0.0);
if (l9_339==0)
{
l9_341=float3(l9_338,0.0);
}
else
{
if (l9_339==1)
{
l9_341=float3(l9_338.x,(l9_338.y*0.5)+(0.5-(float(l9_340)*0.5)),0.0);
}
else
{
l9_341=float3(l9_338,float(l9_340));
}
}
float3 l9_342=l9_341;
float3 l9_343=l9_342;
float4 l9_344=renderTarget2.sample(renderTarget2SmpSC,l9_343.xy,level(0.0));
float4 l9_345=l9_344;
float4 l9_346=l9_345;
float4 renderTarget2Sample_2=l9_346;
Scalar8=renderTarget2Sample_2.x;
Scalar9=renderTarget2Sample_2.y;
Scalar10=renderTarget2Sample_2.z;
Scalar11=renderTarget2Sample_2.w;
float2 param_41=uv;
float2 l9_347=param_41;
int l9_348;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_349=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_349=0;
}
else
{
l9_349=gl_InstanceIndex%2;
}
int l9_350=l9_349;
l9_348=1-l9_350;
}
else
{
int l9_351=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_351=0;
}
else
{
l9_351=gl_InstanceIndex%2;
}
int l9_352=l9_351;
l9_348=l9_352;
}
int l9_353=l9_348;
float2 l9_354=l9_347;
int l9_355=renderTarget3Layout_tmp;
int l9_356=l9_353;
float2 l9_357=l9_354;
int l9_358=l9_355;
int l9_359=l9_356;
float3 l9_360=float3(0.0);
if (l9_358==0)
{
l9_360=float3(l9_357,0.0);
}
else
{
if (l9_358==1)
{
l9_360=float3(l9_357.x,(l9_357.y*0.5)+(0.5-(float(l9_359)*0.5)),0.0);
}
else
{
l9_360=float3(l9_357,float(l9_359));
}
}
float3 l9_361=l9_360;
float3 l9_362=l9_361;
float4 l9_363=renderTarget3.sample(renderTarget3SmpSC,l9_362.xy,level(0.0));
float4 l9_364=l9_363;
float4 l9_365=l9_364;
float4 renderTarget3Sample_2=l9_365;
Scalar12=renderTarget3Sample_2.x;
Scalar13=renderTarget3Sample_2.y;
Scalar14=renderTarget3Sample_2.z;
Scalar15=renderTarget3Sample_2.w;
float4 param_42=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_43=0.0;
float param_44=100.0;
float4 l9_366=param_42;
float l9_367=param_43;
float l9_368=param_44;
float l9_369=0.99998999;
float4 l9_370=l9_366;
#if (1)
{
l9_370=floor((l9_370*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_371=dot(l9_370,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_372=l9_371;
float l9_373=0.0;
float l9_374=l9_369;
float l9_375=l9_367;
float l9_376=l9_368;
float l9_377=l9_375+(((l9_372-l9_373)*(l9_376-l9_375))/(l9_374-l9_373));
float l9_378=l9_377;
float l9_379=l9_378;
gParticle.Size=l9_379;
float4 param_45=float4(Scalar4,Scalar5,Scalar6,Scalar7);
float param_46=0.0;
float param_47=1.00001;
float4 l9_380=param_45;
float l9_381=param_46;
float l9_382=param_47;
float l9_383=0.99998999;
float4 l9_384=l9_380;
#if (1)
{
l9_384=floor((l9_384*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_385=dot(l9_384,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_386=l9_385;
float l9_387=0.0;
float l9_388=l9_383;
float l9_389=l9_381;
float l9_390=l9_382;
float l9_391=l9_389+(((l9_386-l9_387)*(l9_390-l9_389))/(l9_388-l9_387));
float l9_392=l9_391;
float l9_393=l9_392;
gParticle.Color.x=l9_393;
float4 param_48=float4(Scalar8,Scalar9,Scalar10,Scalar11);
float param_49=0.0;
float param_50=1.00001;
float4 l9_394=param_48;
float l9_395=param_49;
float l9_396=param_50;
float l9_397=0.99998999;
float4 l9_398=l9_394;
#if (1)
{
l9_398=floor((l9_398*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_399=dot(l9_398,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_400=l9_399;
float l9_401=0.0;
float l9_402=l9_397;
float l9_403=l9_395;
float l9_404=l9_396;
float l9_405=l9_403+(((l9_400-l9_401)*(l9_404-l9_403))/(l9_402-l9_401));
float l9_406=l9_405;
float l9_407=l9_406;
gParticle.Color.y=l9_407;
float4 param_51=float4(Scalar12,Scalar13,Scalar14,Scalar15);
float param_52=0.0;
float param_53=1.00001;
float4 l9_408=param_51;
float l9_409=param_52;
float l9_410=param_53;
float l9_411=0.99998999;
float4 l9_412=l9_408;
#if (1)
{
l9_412=floor((l9_412*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_413=dot(l9_412,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_414=l9_413;
float l9_415=0.0;
float l9_416=l9_411;
float l9_417=l9_409;
float l9_418=l9_410;
float l9_419=l9_417+(((l9_414-l9_415)*(l9_418-l9_417))/(l9_416-l9_415));
float l9_420=l9_419;
float l9_421=l9_420;
gParticle.Color.z=l9_421;
uv=Coord+(Offset*3.0);
float2 param_54=uv;
float2 l9_422=param_54;
int l9_423;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_424=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_424=0;
}
else
{
l9_424=gl_InstanceIndex%2;
}
int l9_425=l9_424;
l9_423=1-l9_425;
}
else
{
int l9_426=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_426=0;
}
else
{
l9_426=gl_InstanceIndex%2;
}
int l9_427=l9_426;
l9_423=l9_427;
}
int l9_428=l9_423;
float2 l9_429=l9_422;
int l9_430=renderTarget0Layout_tmp;
int l9_431=l9_428;
float2 l9_432=l9_429;
int l9_433=l9_430;
int l9_434=l9_431;
float3 l9_435=float3(0.0);
if (l9_433==0)
{
l9_435=float3(l9_432,0.0);
}
else
{
if (l9_433==1)
{
l9_435=float3(l9_432.x,(l9_432.y*0.5)+(0.5-(float(l9_434)*0.5)),0.0);
}
else
{
l9_435=float3(l9_432,float(l9_434));
}
}
float3 l9_436=l9_435;
float3 l9_437=l9_436;
float4 l9_438=renderTarget0.sample(renderTarget0SmpSC,l9_437.xy,level(0.0));
float4 l9_439=l9_438;
float4 l9_440=l9_439;
float4 renderTarget0Sample_3=l9_440;
Scalar0=renderTarget0Sample_3.x;
Scalar1=renderTarget0Sample_3.y;
Scalar2=renderTarget0Sample_3.z;
Scalar3=renderTarget0Sample_3.w;
float2 param_55=uv;
float2 l9_441=param_55;
int l9_442;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_443=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_443=0;
}
else
{
l9_443=gl_InstanceIndex%2;
}
int l9_444=l9_443;
l9_442=1-l9_444;
}
else
{
int l9_445=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_445=0;
}
else
{
l9_445=gl_InstanceIndex%2;
}
int l9_446=l9_445;
l9_442=l9_446;
}
int l9_447=l9_442;
float2 l9_448=l9_441;
int l9_449=renderTarget1Layout_tmp;
int l9_450=l9_447;
float2 l9_451=l9_448;
int l9_452=l9_449;
int l9_453=l9_450;
float3 l9_454=float3(0.0);
if (l9_452==0)
{
l9_454=float3(l9_451,0.0);
}
else
{
if (l9_452==1)
{
l9_454=float3(l9_451.x,(l9_451.y*0.5)+(0.5-(float(l9_453)*0.5)),0.0);
}
else
{
l9_454=float3(l9_451,float(l9_453));
}
}
float3 l9_455=l9_454;
float3 l9_456=l9_455;
float4 l9_457=renderTarget1.sample(renderTarget1SmpSC,l9_456.xy,level(0.0));
float4 l9_458=l9_457;
float4 l9_459=l9_458;
float4 renderTarget1Sample_3=l9_459;
Scalar4=renderTarget1Sample_3.x;
Scalar5=renderTarget1Sample_3.y;
Scalar6=renderTarget1Sample_3.z;
Scalar7=renderTarget1Sample_3.w;
float2 param_56=uv;
float2 l9_460=param_56;
int l9_461;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_462=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_462=0;
}
else
{
l9_462=gl_InstanceIndex%2;
}
int l9_463=l9_462;
l9_461=1-l9_463;
}
else
{
int l9_464=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_464=0;
}
else
{
l9_464=gl_InstanceIndex%2;
}
int l9_465=l9_464;
l9_461=l9_465;
}
int l9_466=l9_461;
float2 l9_467=l9_460;
int l9_468=renderTarget2Layout_tmp;
int l9_469=l9_466;
float2 l9_470=l9_467;
int l9_471=l9_468;
int l9_472=l9_469;
float3 l9_473=float3(0.0);
if (l9_471==0)
{
l9_473=float3(l9_470,0.0);
}
else
{
if (l9_471==1)
{
l9_473=float3(l9_470.x,(l9_470.y*0.5)+(0.5-(float(l9_472)*0.5)),0.0);
}
else
{
l9_473=float3(l9_470,float(l9_472));
}
}
float3 l9_474=l9_473;
float3 l9_475=l9_474;
float4 l9_476=renderTarget2.sample(renderTarget2SmpSC,l9_475.xy,level(0.0));
float4 l9_477=l9_476;
float4 l9_478=l9_477;
float4 renderTarget2Sample_3=l9_478;
Scalar8=renderTarget2Sample_3.x;
Scalar9=renderTarget2Sample_3.y;
Scalar10=renderTarget2Sample_3.z;
Scalar11=renderTarget2Sample_3.w;
float2 param_57=uv;
float2 l9_479=param_57;
int l9_480;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_481=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_481=0;
}
else
{
l9_481=gl_InstanceIndex%2;
}
int l9_482=l9_481;
l9_480=1-l9_482;
}
else
{
int l9_483=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_483=0;
}
else
{
l9_483=gl_InstanceIndex%2;
}
int l9_484=l9_483;
l9_480=l9_484;
}
int l9_485=l9_480;
float2 l9_486=l9_479;
int l9_487=renderTarget3Layout_tmp;
int l9_488=l9_485;
float2 l9_489=l9_486;
int l9_490=l9_487;
int l9_491=l9_488;
float3 l9_492=float3(0.0);
if (l9_490==0)
{
l9_492=float3(l9_489,0.0);
}
else
{
if (l9_490==1)
{
l9_492=float3(l9_489.x,(l9_489.y*0.5)+(0.5-(float(l9_491)*0.5)),0.0);
}
else
{
l9_492=float3(l9_489,float(l9_491));
}
}
float3 l9_493=l9_492;
float3 l9_494=l9_493;
float4 l9_495=renderTarget3.sample(renderTarget3SmpSC,l9_494.xy,level(0.0));
float4 l9_496=l9_495;
float4 l9_497=l9_496;
float4 renderTarget3Sample_3=l9_497;
Scalar12=renderTarget3Sample_3.x;
Scalar13=renderTarget3Sample_3.y;
Scalar14=renderTarget3Sample_3.z;
Scalar15=renderTarget3Sample_3.w;
float4 param_58=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_59=0.0;
float param_60=1.00001;
float4 l9_498=param_58;
float l9_499=param_59;
float l9_500=param_60;
float l9_501=0.99998999;
float4 l9_502=l9_498;
#if (1)
{
l9_502=floor((l9_502*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_503=dot(l9_502,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_504=l9_503;
float l9_505=0.0;
float l9_506=l9_501;
float l9_507=l9_499;
float l9_508=l9_500;
float l9_509=l9_507+(((l9_504-l9_505)*(l9_508-l9_507))/(l9_506-l9_505));
float l9_510=l9_509;
float l9_511=l9_510;
gParticle.Color.w=l9_511;
float2 param_61=float2(Scalar4,Scalar5);
float param_62=-1.0;
float param_63=1.0;
float2 l9_512=param_61;
float l9_513=param_62;
float l9_514=param_63;
float l9_515=0.99998999;
float2 l9_516=l9_512;
#if (1)
{
l9_516=floor((l9_516*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_517=dot(l9_516,float2(1.0,0.0039215689));
float l9_518=l9_517;
float l9_519=0.0;
float l9_520=l9_515;
float l9_521=l9_513;
float l9_522=l9_514;
float l9_523=l9_521+(((l9_518-l9_519)*(l9_522-l9_521))/(l9_520-l9_519));
float l9_524=l9_523;
float l9_525=l9_524;
gParticle.Quaternion.x=l9_525;
float2 param_64=float2(Scalar6,Scalar7);
float param_65=-1.0;
float param_66=1.0;
float2 l9_526=param_64;
float l9_527=param_65;
float l9_528=param_66;
float l9_529=0.99998999;
float2 l9_530=l9_526;
#if (1)
{
l9_530=floor((l9_530*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_531=dot(l9_530,float2(1.0,0.0039215689));
float l9_532=l9_531;
float l9_533=0.0;
float l9_534=l9_529;
float l9_535=l9_527;
float l9_536=l9_528;
float l9_537=l9_535+(((l9_532-l9_533)*(l9_536-l9_535))/(l9_534-l9_533));
float l9_538=l9_537;
float l9_539=l9_538;
gParticle.Quaternion.y=l9_539;
float2 param_67=float2(Scalar8,Scalar9);
float param_68=-1.0;
float param_69=1.0;
float2 l9_540=param_67;
float l9_541=param_68;
float l9_542=param_69;
float l9_543=0.99998999;
float2 l9_544=l9_540;
#if (1)
{
l9_544=floor((l9_544*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_545=dot(l9_544,float2(1.0,0.0039215689));
float l9_546=l9_545;
float l9_547=0.0;
float l9_548=l9_543;
float l9_549=l9_541;
float l9_550=l9_542;
float l9_551=l9_549+(((l9_546-l9_547)*(l9_550-l9_549))/(l9_548-l9_547));
float l9_552=l9_551;
float l9_553=l9_552;
gParticle.Quaternion.z=l9_553;
float2 param_70=float2(Scalar10,Scalar11);
float param_71=-1.0;
float param_72=1.0;
float2 l9_554=param_70;
float l9_555=param_71;
float l9_556=param_72;
float l9_557=0.99998999;
float2 l9_558=l9_554;
#if (1)
{
l9_558=floor((l9_558*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_559=dot(l9_558,float2(1.0,0.0039215689));
float l9_560=l9_559;
float l9_561=0.0;
float l9_562=l9_557;
float l9_563=l9_555;
float l9_564=l9_556;
float l9_565=l9_563+(((l9_560-l9_561)*(l9_564-l9_563))/(l9_562-l9_561));
float l9_566=l9_565;
float l9_567=l9_566;
gParticle.Quaternion.w=l9_567;
float4 param_73=gParticle.Quaternion;
param_73=normalize(param_73.yzwx);
float l9_568=param_73.x*param_73.x;
float l9_569=param_73.y*param_73.y;
float l9_570=param_73.z*param_73.z;
float l9_571=param_73.x*param_73.z;
float l9_572=param_73.x*param_73.y;
float l9_573=param_73.y*param_73.z;
float l9_574=param_73.w*param_73.x;
float l9_575=param_73.w*param_73.y;
float l9_576=param_73.w*param_73.z;
float3x3 l9_577=float3x3(float3(1.0-(2.0*(l9_569+l9_570)),2.0*(l9_572+l9_576),2.0*(l9_571-l9_575)),float3(2.0*(l9_572-l9_576),1.0-(2.0*(l9_568+l9_570)),2.0*(l9_573+l9_574)),float3(2.0*(l9_571+l9_575),2.0*(l9_573-l9_574),1.0-(2.0*(l9_568+l9_569))));
gParticle.Matrix=l9_577;
gParticle.Velocity=floor((gParticle.Velocity*2000.0)+float3(0.5))*0.00050000002;
gParticle.Position=floor((gParticle.Position*2000.0)+float3(0.5))*0.00050000002;
gParticle.Color=floor((gParticle.Color*2000.0)+float4(0.5))*0.00050000002;
gParticle.Size=floor((gParticle.Size*2000.0)+0.5)*0.00050000002;
gParticle.Mass=floor((gParticle.Mass*2000.0)+0.5)*0.00050000002;
gParticle.Life=floor((gParticle.Life*2000.0)+0.5)*0.00050000002;
return true;
}
float snoise(thread const float2& v)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
float2 i=floor(v+float2(dot(v,float2(0.36602542))));
float2 x0=(v-i)+float2(dot(i,float2(0.21132487)));
float2 i1=float2(0.0);
bool2 l9_0=bool2(x0.x>x0.y);
i1=float2(l9_0.x ? float2(1.0,0.0).x : float2(0.0,1.0).x,l9_0.y ? float2(1.0,0.0).y : float2(0.0,1.0).y);
float2 x1=(x0+float2(0.21132487))-i1;
float2 x2=x0+float2(-0.57735026);
float2 param=i;
float2 l9_1=param-(floor(param*0.0034602077)*289.0);
i=l9_1;
float3 param_1=float3(i.y)+float3(0.0,i1.y,1.0);
float3 l9_2=((param_1*34.0)+float3(1.0))*param_1;
float3 l9_3=l9_2-(floor(l9_2*0.0034602077)*289.0);
float3 l9_4=l9_3;
float3 param_2=(l9_4+float3(i.x))+float3(0.0,i1.x,1.0);
float3 l9_5=((param_2*34.0)+float3(1.0))*param_2;
float3 l9_6=l9_5-(floor(l9_5*0.0034602077)*289.0);
float3 l9_7=l9_6;
float3 p=l9_7;
float3 m=fast::max(float3(0.5)-float3(dot(x0,x0),dot(x1,x1),dot(x2,x2)),float3(0.0));
m*=m;
m*=m;
float3 x=(fract(p*float3(0.024390243))*2.0)-float3(1.0);
float3 h=abs(x)-float3(0.5);
float3 ox=floor(x+float3(0.5));
float3 a0=x-ox;
m*=(float3(1.7928429)-(((a0*a0)+(h*h))*0.85373473));
float3 g=float3(0.0);
g.x=(a0.x*x0.x)+(h.x*x0.y);
float2 l9_8=(a0.yz*float2(x1.x,x2.x))+(h.yz*float2(x1.y,x2.y));
g=float3(g.x,l9_8.x,l9_8.y);
return 130.0*dot(m,g);
}
else
{
return 0.0;
}
}
float4 matrixToQuaternion(thread const float3x3& m)
{
float fourXSquaredMinus1=(m[0].x-m[1].y)-m[2].z;
float fourYSquaredMinus1=(m[1].y-m[0].x)-m[2].z;
float fourZSquaredMinus1=(m[2].z-m[0].x)-m[1].y;
float fourWSquaredMinus1=(m[0].x+m[1].y)+m[2].z;
int biggestIndex=0;
float fourBiggestSquaredMinus1=fourWSquaredMinus1;
if (fourXSquaredMinus1>fourBiggestSquaredMinus1)
{
fourBiggestSquaredMinus1=fourXSquaredMinus1;
biggestIndex=1;
}
if (fourYSquaredMinus1>fourBiggestSquaredMinus1)
{
fourBiggestSquaredMinus1=fourYSquaredMinus1;
biggestIndex=2;
}
if (fourZSquaredMinus1>fourBiggestSquaredMinus1)
{
fourBiggestSquaredMinus1=fourZSquaredMinus1;
biggestIndex=3;
}
float biggestVal=sqrt(fourBiggestSquaredMinus1+1.0)*0.5;
float mult=0.25/biggestVal;
if (biggestIndex==0)
{
return float4(biggestVal,(m[1].z-m[2].y)*mult,(m[2].x-m[0].z)*mult,(m[0].y-m[1].x)*mult);
}
else
{
if (biggestIndex==1)
{
return float4((m[1].z-m[2].y)*mult,biggestVal,(m[0].y+m[1].x)*mult,(m[2].x+m[0].z)*mult);
}
else
{
if (biggestIndex==2)
{
return float4((m[2].x-m[0].z)*mult,(m[0].y+m[1].x)*mult,biggestVal,(m[1].z+m[2].y)*mult);
}
else
{
if (biggestIndex==3)
{
return float4((m[0].y-m[1].x)*mult,(m[2].x+m[0].z)*mult,(m[1].z+m[2].y)*mult,biggestVal);
}
else
{
return float4(1.0,0.0,0.0,0.0);
}
}
}
}
}
vertex main_vert_out main_vert(main_vert_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],uint gl_InstanceIndex [[instance_id]])
{
main_vert_out out={};
int ssInstanceID=0;
sc_Vertex_t l9_0;
l9_0.position=in.position;
l9_0.texture0=in.texture0;
l9_0.texture1=in.texture1;
sc_Vertex_t l9_1=l9_0;
sc_Vertex_t v=l9_1;
int l9_2=gl_InstanceIndex;
ssInstanceID=l9_2;
int param=ssInstanceID;
ssParticle gParticle;
bool l9_3=ssDecodeParticle(param,gl_InstanceIndex,(*sc_set0.UserUniforms),sc_set0.renderTarget0,sc_set0.renderTarget0SmpSC,sc_set0.renderTarget1,sc_set0.renderTarget1SmpSC,sc_set0.renderTarget2,sc_set0.renderTarget2SmpSC,sc_set0.renderTarget3,sc_set0.renderTarget3SmpSC,gParticle);
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
int l9_4=gl_InstanceIndex;
Globals.gComponentTime=(*sc_set0.UserUniforms).overrideTimeElapsed[l9_4/170];
Globals.gTimeDelta=fast::min((*sc_set0.UserUniforms).overrideTimeDelta,0.5);
Globals.gTimeElapsedShifted=(Globals.gTimeElapsed-(gParticle.TimeShift*Globals.gTimeDelta))-0.0;
float Delay=0.0;
float Warmup=0.0;
gParticle.Age=mod((Globals.gTimeElapsedShifted-gParticle.SpawnOffset)+Warmup,1.0);
float l9_5=Globals.gTimeElapsed;
float l9_6=gParticle.SpawnOffset;
float l9_7=Delay;
float l9_8=Warmup;
bool l9_9=(l9_5-l9_6)<(l9_7-l9_8);
bool l9_10;
if (!l9_9)
{
l9_10=gParticle.Age>1.0;
}
else
{
l9_10=l9_9;
}
bool Dead=l9_10 ? true : false;
bool l9_11=Dead;
bool l9_12=!l9_11;
bool l9_13;
if (l9_12)
{
l9_13=gParticle.Life<=9.9999997e-05;
}
else
{
l9_13=l9_12;
}
bool l9_14;
if (!l9_13)
{
l9_14=mod(((fast::max(Globals.gTimeElapsed,0.1)-gParticle.SpawnOffset)-Delay)+Warmup,1.0)<=Globals.gTimeDelta;
}
else
{
l9_14=l9_13;
}
if (l9_14)
{
if (Globals.gTimeDelta!=0.0)
{
ssGlobals param_1=Globals;
ssParticle l9_15=gParticle;
int l9_16=int(gParticle.CopyId);
float l9_17;
if ((*sc_set0.UserUniforms).overrideTimeEnabled==1)
{
l9_17=(*sc_set0.UserUniforms).overrideTimeElapsed[l9_16];
}
else
{
l9_17=(*sc_set0.UserUniforms).sc_Time.x;
}
float l9_18=l9_17;
l9_15.Seed=(l9_15.Ratio1D*0.97637898)+0.151235;
l9_15.Seed+=(floor(((((l9_18-l9_15.SpawnOffset)-0.0)+0.0)+2.0)/1.0)*4.32723);
l9_15.Seed=fract(abs(l9_15.Seed));
int2 l9_19=int2(l9_15.Index1D%400,l9_15.Index1D/400);
l9_15.Seed2000=(float2(l9_19)+float2(1.0))/float2(399.0);
gParticle=l9_15;
float l9_20=13.0;
gParticle.Position=(float3(((floor(mod(gParticle.Index1DPerCopyF,floor(l9_20)))/l9_20)*2.0)-1.0,((floor(gParticle.Index1DPerCopyF/floor(l9_20))/l9_20)*2.0)-1.0,0.0)*20.0)+float3(1.0,1.0,0.0);
gParticle.Velocity=float3(0.0);
gParticle.Color=float4(1.0);
gParticle.Age=0.0;
gParticle.Life=1.0;
gParticle.Size=1.0;
gParticle.Mass=1.0;
gParticle.Matrix=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(0.0,0.0,1.0));
gParticle.Quaternion=float4(0.0,0.0,0.0,1.0);
float3 l9_21=float3(0.0);
l9_21=(*sc_set0.UserUniforms).Port_Import_N216;
float l9_22=0.0;
float l9_23=0.0;
float l9_24=0.0;
float l9_25=0.0;
ssGlobals l9_26=param_1;
float l9_27=0.0;
l9_27=0.0;
float l9_28=0.0;
l9_28=float(l9_27==(*sc_set0.UserUniforms).Port_Input1_N029);
l9_23=l9_28;
float l9_29;
if ((l9_23*1.0)!=0.0)
{
float3 l9_30=float3(0.0);
float3 l9_31=(*sc_set0.UserUniforms).Port_Min_N213;
float3 l9_32=(*sc_set0.UserUniforms).Port_Max_N213;
ssGlobals l9_33=l9_26;
int l9_34=3;
bool l9_35=true;
bool l9_36=true;
bool l9_37=true;
float l9_38=213.0;
ssParticle l9_39=gParticle;
float l9_40=1.0;
float l9_41=l9_33.gTimeElapsed;
float4 l9_42=float4(0.0);
float4 l9_43=float4(1.0);
float l9_44=1.0;
float2 l9_45=float2(1.0);
if (l9_35)
{
l9_43=float4(fract(l9_41*10.0));
l9_43=floor(l9_43*10000.0)*9.9999997e-05;
l9_43=float4(0.32339999,0.65740001,0.22579999,0.87629998)+l9_43;
}
if (l9_36)
{
l9_44=1.0+((l9_38+1.0)*0.0099999998);
}
if (l9_37)
{
l9_45=l9_39.Seed2000;
}
l9_40=(l9_40+1.0)*0.5;
if (l9_34>=1)
{
float2 l9_46=(((float2(0.2353,0.78750002)*l9_45)*l9_44)*l9_43.x)*l9_40;
float l9_47=dot(l9_46,float2(0.98253,0.72662002));
l9_47=sin(l9_47)*479.371;
l9_47=fract(l9_47);
l9_47=floor(l9_47*10000.0)*9.9999997e-05;
float l9_48=l9_47;
l9_42.x=l9_48;
}
if (l9_34>=2)
{
float2 l9_49=(((float2(0.5751,0.62730002)*l9_45)*l9_44)*l9_43.y)*l9_40;
float l9_50=dot(l9_49,float2(0.98253,0.72662002));
l9_50=sin(l9_50)*479.371;
l9_50=fract(l9_50);
l9_50=floor(l9_50*10000.0)*9.9999997e-05;
float l9_51=l9_50;
l9_42.y=l9_51;
}
if (l9_34>=3)
{
float2 l9_52=(((float2(0.6947,0.52170002)*l9_45)*l9_44)*l9_43.z)*l9_40;
float l9_53=dot(l9_52,float2(0.98253,0.72662002));
l9_53=sin(l9_53)*479.371;
l9_53=fract(l9_53);
l9_53=floor(l9_53*10000.0)*9.9999997e-05;
float l9_54=l9_53;
l9_42.z=l9_54;
}
if (l9_34>=4)
{
float2 l9_55=(((float2(0.47889999,0.39669999)*l9_45)*l9_44)*l9_43.w)*l9_40;
float l9_56=dot(l9_55,float2(0.98253,0.72662002));
l9_56=sin(l9_56)*479.371;
l9_56=fract(l9_56);
l9_56=floor(l9_56*10000.0)*9.9999997e-05;
float l9_57=l9_56;
l9_42.w=l9_57;
}
float4 l9_58=l9_42;
float4 l9_59=l9_58;
float3 l9_60=mix(l9_31,l9_32,l9_59.xyz);
l9_30=l9_60;
float l9_61=0.0;
l9_61=length(l9_30);
float3 l9_62=float3(0.0);
l9_62=l9_30/float3(l9_61);
float l9_63=0.0;
l9_63=fast::clamp((*sc_set0.UserUniforms).Port_Import_N004,0.0,1.0);
float l9_64=0.0;
l9_64=1.0-l9_63;
float l9_65=0.0;
float l9_66;
if (l9_64<=0.0)
{
l9_66=0.0;
}
else
{
l9_66=pow(l9_64,(*sc_set0.UserUniforms).Port_Input1_N005);
}
l9_65=l9_66;
float3 l9_67=float3(0.0);
float3 l9_68=float3(l9_65);
float3 l9_69=(*sc_set0.UserUniforms).Port_Max_N027;
ssGlobals l9_70=l9_26;
int l9_71=3;
bool l9_72=true;
bool l9_73=true;
bool l9_74=true;
float l9_75=27.0;
ssParticle l9_76=gParticle;
float l9_77=1.0;
float l9_78=l9_70.gTimeElapsed;
float4 l9_79=float4(0.0);
float4 l9_80=float4(1.0);
float l9_81=1.0;
float2 l9_82=float2(1.0);
if (l9_72)
{
l9_80=float4(fract(l9_78*10.0));
l9_80=floor(l9_80*10000.0)*9.9999997e-05;
l9_80=float4(0.32339999,0.65740001,0.22579999,0.87629998)+l9_80;
}
if (l9_73)
{
l9_81=1.0+((l9_75+1.0)*0.0099999998);
}
if (l9_74)
{
l9_82=l9_76.Seed2000;
}
l9_77=(l9_77+1.0)*0.5;
if (l9_71>=1)
{
float2 l9_83=(((float2(0.2353,0.78750002)*l9_82)*l9_81)*l9_80.x)*l9_77;
float l9_84=dot(l9_83,float2(0.98253,0.72662002));
l9_84=sin(l9_84)*479.371;
l9_84=fract(l9_84);
l9_84=floor(l9_84*10000.0)*9.9999997e-05;
float l9_85=l9_84;
l9_79.x=l9_85;
}
if (l9_71>=2)
{
float2 l9_86=(((float2(0.5751,0.62730002)*l9_82)*l9_81)*l9_80.y)*l9_77;
float l9_87=dot(l9_86,float2(0.98253,0.72662002));
l9_87=sin(l9_87)*479.371;
l9_87=fract(l9_87);
l9_87=floor(l9_87*10000.0)*9.9999997e-05;
float l9_88=l9_87;
l9_79.y=l9_88;
}
if (l9_71>=3)
{
float2 l9_89=(((float2(0.6947,0.52170002)*l9_82)*l9_81)*l9_80.z)*l9_77;
float l9_90=dot(l9_89,float2(0.98253,0.72662002));
l9_90=sin(l9_90)*479.371;
l9_90=fract(l9_90);
l9_90=floor(l9_90*10000.0)*9.9999997e-05;
float l9_91=l9_90;
l9_79.z=l9_91;
}
if (l9_71>=4)
{
float2 l9_92=(((float2(0.47889999,0.39669999)*l9_82)*l9_81)*l9_80.w)*l9_77;
float l9_93=dot(l9_92,float2(0.98253,0.72662002));
l9_93=sin(l9_93)*479.371;
l9_93=fract(l9_93);
l9_93=floor(l9_93*10000.0)*9.9999997e-05;
float l9_94=l9_93;
l9_79.w=l9_94;
}
float4 l9_95=l9_79;
float4 l9_96=l9_95;
float3 l9_97=mix(l9_68,l9_69,l9_96.xyz);
l9_67=l9_97;
float3 l9_98=float3(0.0);
float l9_99;
if (l9_67.x<=0.0)
{
l9_99=0.0;
}
else
{
l9_99=sqrt(l9_67.x);
}
float l9_100=l9_99;
float l9_101;
if (l9_67.y<=0.0)
{
l9_101=0.0;
}
else
{
l9_101=sqrt(l9_67.y);
}
float l9_102=l9_101;
float l9_103;
if (l9_67.z<=0.0)
{
l9_103=0.0;
}
else
{
l9_103=sqrt(l9_67.z);
}
l9_98=float3(l9_100,l9_102,l9_103);
float3 l9_104=float3(0.0);
float l9_105;
if (l9_98.x<=0.0)
{
l9_105=0.0;
}
else
{
l9_105=sqrt(l9_98.x);
}
float l9_106=l9_105;
float l9_107;
if (l9_98.y<=0.0)
{
l9_107=0.0;
}
else
{
l9_107=sqrt(l9_98.y);
}
float l9_108=l9_107;
float l9_109;
if (l9_98.z<=0.0)
{
l9_109=0.0;
}
else
{
l9_109=sqrt(l9_98.z);
}
l9_104=float3(l9_106,l9_108,l9_109);
float l9_110=0.0;
l9_110=(*sc_set0.UserUniforms).Port_Import_N214;
float3 l9_111=float3(0.0);
l9_111=(*sc_set0.UserUniforms).Port_Import_N212;
float3 l9_112=float3(0.0);
l9_112=((l9_62*l9_104)*float3(l9_110))*l9_111;
float l9_113=0.0;
float3 l9_114=l9_112;
float l9_115=l9_114.x;
l9_113=l9_115;
float l9_116=0.0;
l9_116=abs(l9_113);
l9_24=l9_116;
l9_29=l9_24;
}
else
{
float3 l9_117=float3(0.0);
float3 l9_118=(*sc_set0.UserUniforms).Port_Min_N213;
float3 l9_119=(*sc_set0.UserUniforms).Port_Max_N213;
ssGlobals l9_120=l9_26;
int l9_121=3;
bool l9_122=true;
bool l9_123=true;
bool l9_124=true;
float l9_125=213.0;
ssParticle l9_126=gParticle;
float l9_127=1.0;
float l9_128=l9_120.gTimeElapsed;
float4 l9_129=float4(0.0);
float4 l9_130=float4(1.0);
float l9_131=1.0;
float2 l9_132=float2(1.0);
if (l9_122)
{
l9_130=float4(fract(l9_128*10.0));
l9_130=floor(l9_130*10000.0)*9.9999997e-05;
l9_130=float4(0.32339999,0.65740001,0.22579999,0.87629998)+l9_130;
}
if (l9_123)
{
l9_131=1.0+((l9_125+1.0)*0.0099999998);
}
if (l9_124)
{
l9_132=l9_126.Seed2000;
}
l9_127=(l9_127+1.0)*0.5;
if (l9_121>=1)
{
float2 l9_133=(((float2(0.2353,0.78750002)*l9_132)*l9_131)*l9_130.x)*l9_127;
float l9_134=dot(l9_133,float2(0.98253,0.72662002));
l9_134=sin(l9_134)*479.371;
l9_134=fract(l9_134);
l9_134=floor(l9_134*10000.0)*9.9999997e-05;
float l9_135=l9_134;
l9_129.x=l9_135;
}
if (l9_121>=2)
{
float2 l9_136=(((float2(0.5751,0.62730002)*l9_132)*l9_131)*l9_130.y)*l9_127;
float l9_137=dot(l9_136,float2(0.98253,0.72662002));
l9_137=sin(l9_137)*479.371;
l9_137=fract(l9_137);
l9_137=floor(l9_137*10000.0)*9.9999997e-05;
float l9_138=l9_137;
l9_129.y=l9_138;
}
if (l9_121>=3)
{
float2 l9_139=(((float2(0.6947,0.52170002)*l9_132)*l9_131)*l9_130.z)*l9_127;
float l9_140=dot(l9_139,float2(0.98253,0.72662002));
l9_140=sin(l9_140)*479.371;
l9_140=fract(l9_140);
l9_140=floor(l9_140*10000.0)*9.9999997e-05;
float l9_141=l9_140;
l9_129.z=l9_141;
}
if (l9_121>=4)
{
float2 l9_142=(((float2(0.47889999,0.39669999)*l9_132)*l9_131)*l9_130.w)*l9_127;
float l9_143=dot(l9_142,float2(0.98253,0.72662002));
l9_143=sin(l9_143)*479.371;
l9_143=fract(l9_143);
l9_143=floor(l9_143*10000.0)*9.9999997e-05;
float l9_144=l9_143;
l9_129.w=l9_144;
}
float4 l9_145=l9_129;
float4 l9_146=l9_145;
float3 l9_147=mix(l9_118,l9_119,l9_146.xyz);
l9_117=l9_147;
float l9_148=0.0;
l9_148=length(l9_117);
float3 l9_149=float3(0.0);
l9_149=l9_117/float3(l9_148);
float l9_150=0.0;
l9_150=fast::clamp((*sc_set0.UserUniforms).Port_Import_N004,0.0,1.0);
float l9_151=0.0;
l9_151=1.0-l9_150;
float l9_152=0.0;
float l9_153;
if (l9_151<=0.0)
{
l9_153=0.0;
}
else
{
l9_153=pow(l9_151,(*sc_set0.UserUniforms).Port_Input1_N005);
}
l9_152=l9_153;
float3 l9_154=float3(0.0);
float3 l9_155=float3(l9_152);
float3 l9_156=(*sc_set0.UserUniforms).Port_Max_N027;
ssGlobals l9_157=l9_26;
int l9_158=3;
bool l9_159=true;
bool l9_160=true;
bool l9_161=true;
float l9_162=27.0;
ssParticle l9_163=gParticle;
float l9_164=1.0;
float l9_165=l9_157.gTimeElapsed;
float4 l9_166=float4(0.0);
float4 l9_167=float4(1.0);
float l9_168=1.0;
float2 l9_169=float2(1.0);
if (l9_159)
{
l9_167=float4(fract(l9_165*10.0));
l9_167=floor(l9_167*10000.0)*9.9999997e-05;
l9_167=float4(0.32339999,0.65740001,0.22579999,0.87629998)+l9_167;
}
if (l9_160)
{
l9_168=1.0+((l9_162+1.0)*0.0099999998);
}
if (l9_161)
{
l9_169=l9_163.Seed2000;
}
l9_164=(l9_164+1.0)*0.5;
if (l9_158>=1)
{
float2 l9_170=(((float2(0.2353,0.78750002)*l9_169)*l9_168)*l9_167.x)*l9_164;
float l9_171=dot(l9_170,float2(0.98253,0.72662002));
l9_171=sin(l9_171)*479.371;
l9_171=fract(l9_171);
l9_171=floor(l9_171*10000.0)*9.9999997e-05;
float l9_172=l9_171;
l9_166.x=l9_172;
}
if (l9_158>=2)
{
float2 l9_173=(((float2(0.5751,0.62730002)*l9_169)*l9_168)*l9_167.y)*l9_164;
float l9_174=dot(l9_173,float2(0.98253,0.72662002));
l9_174=sin(l9_174)*479.371;
l9_174=fract(l9_174);
l9_174=floor(l9_174*10000.0)*9.9999997e-05;
float l9_175=l9_174;
l9_166.y=l9_175;
}
if (l9_158>=3)
{
float2 l9_176=(((float2(0.6947,0.52170002)*l9_169)*l9_168)*l9_167.z)*l9_164;
float l9_177=dot(l9_176,float2(0.98253,0.72662002));
l9_177=sin(l9_177)*479.371;
l9_177=fract(l9_177);
l9_177=floor(l9_177*10000.0)*9.9999997e-05;
float l9_178=l9_177;
l9_166.z=l9_178;
}
if (l9_158>=4)
{
float2 l9_179=(((float2(0.47889999,0.39669999)*l9_169)*l9_168)*l9_167.w)*l9_164;
float l9_180=dot(l9_179,float2(0.98253,0.72662002));
l9_180=sin(l9_180)*479.371;
l9_180=fract(l9_180);
l9_180=floor(l9_180*10000.0)*9.9999997e-05;
float l9_181=l9_180;
l9_166.w=l9_181;
}
float4 l9_182=l9_166;
float4 l9_183=l9_182;
float3 l9_184=mix(l9_155,l9_156,l9_183.xyz);
l9_154=l9_184;
float3 l9_185=float3(0.0);
float l9_186;
if (l9_154.x<=0.0)
{
l9_186=0.0;
}
else
{
l9_186=sqrt(l9_154.x);
}
float l9_187=l9_186;
float l9_188;
if (l9_154.y<=0.0)
{
l9_188=0.0;
}
else
{
l9_188=sqrt(l9_154.y);
}
float l9_189=l9_188;
float l9_190;
if (l9_154.z<=0.0)
{
l9_190=0.0;
}
else
{
l9_190=sqrt(l9_154.z);
}
l9_185=float3(l9_187,l9_189,l9_190);
float3 l9_191=float3(0.0);
float l9_192;
if (l9_185.x<=0.0)
{
l9_192=0.0;
}
else
{
l9_192=sqrt(l9_185.x);
}
float l9_193=l9_192;
float l9_194;
if (l9_185.y<=0.0)
{
l9_194=0.0;
}
else
{
l9_194=sqrt(l9_185.y);
}
float l9_195=l9_194;
float l9_196;
if (l9_185.z<=0.0)
{
l9_196=0.0;
}
else
{
l9_196=sqrt(l9_185.z);
}
l9_191=float3(l9_193,l9_195,l9_196);
float l9_197=0.0;
l9_197=(*sc_set0.UserUniforms).Port_Import_N214;
float3 l9_198=float3(0.0);
l9_198=(*sc_set0.UserUniforms).Port_Import_N212;
float3 l9_199=float3(0.0);
l9_199=((l9_149*l9_191)*float3(l9_197))*l9_198;
float l9_200=0.0;
float3 l9_201=l9_199;
float l9_202=l9_201.x;
l9_200=l9_202;
l9_25=l9_200;
l9_29=l9_25;
}
l9_22=l9_29;
float l9_203=0.0;
float l9_204=0.0;
float l9_205=0.0;
float l9_206=0.0;
ssGlobals l9_207=param_1;
float l9_208=0.0;
l9_208=0.0;
float l9_209=0.0;
l9_209=float(l9_208==(*sc_set0.UserUniforms).Port_Input1_N034);
l9_204=l9_209;
float l9_210;
if ((l9_204*1.0)!=0.0)
{
float3 l9_211=float3(0.0);
float3 l9_212=(*sc_set0.UserUniforms).Port_Min_N213;
float3 l9_213=(*sc_set0.UserUniforms).Port_Max_N213;
ssGlobals l9_214=l9_207;
int l9_215=3;
bool l9_216=true;
bool l9_217=true;
bool l9_218=true;
float l9_219=213.0;
ssParticle l9_220=gParticle;
float l9_221=1.0;
float l9_222=l9_214.gTimeElapsed;
float4 l9_223=float4(0.0);
float4 l9_224=float4(1.0);
float l9_225=1.0;
float2 l9_226=float2(1.0);
if (l9_216)
{
l9_224=float4(fract(l9_222*10.0));
l9_224=floor(l9_224*10000.0)*9.9999997e-05;
l9_224=float4(0.32339999,0.65740001,0.22579999,0.87629998)+l9_224;
}
if (l9_217)
{
l9_225=1.0+((l9_219+1.0)*0.0099999998);
}
if (l9_218)
{
l9_226=l9_220.Seed2000;
}
l9_221=(l9_221+1.0)*0.5;
if (l9_215>=1)
{
float2 l9_227=(((float2(0.2353,0.78750002)*l9_226)*l9_225)*l9_224.x)*l9_221;
float l9_228=dot(l9_227,float2(0.98253,0.72662002));
l9_228=sin(l9_228)*479.371;
l9_228=fract(l9_228);
l9_228=floor(l9_228*10000.0)*9.9999997e-05;
float l9_229=l9_228;
l9_223.x=l9_229;
}
if (l9_215>=2)
{
float2 l9_230=(((float2(0.5751,0.62730002)*l9_226)*l9_225)*l9_224.y)*l9_221;
float l9_231=dot(l9_230,float2(0.98253,0.72662002));
l9_231=sin(l9_231)*479.371;
l9_231=fract(l9_231);
l9_231=floor(l9_231*10000.0)*9.9999997e-05;
float l9_232=l9_231;
l9_223.y=l9_232;
}
if (l9_215>=3)
{
float2 l9_233=(((float2(0.6947,0.52170002)*l9_226)*l9_225)*l9_224.z)*l9_221;
float l9_234=dot(l9_233,float2(0.98253,0.72662002));
l9_234=sin(l9_234)*479.371;
l9_234=fract(l9_234);
l9_234=floor(l9_234*10000.0)*9.9999997e-05;
float l9_235=l9_234;
l9_223.z=l9_235;
}
if (l9_215>=4)
{
float2 l9_236=(((float2(0.47889999,0.39669999)*l9_226)*l9_225)*l9_224.w)*l9_221;
float l9_237=dot(l9_236,float2(0.98253,0.72662002));
l9_237=sin(l9_237)*479.371;
l9_237=fract(l9_237);
l9_237=floor(l9_237*10000.0)*9.9999997e-05;
float l9_238=l9_237;
l9_223.w=l9_238;
}
float4 l9_239=l9_223;
float4 l9_240=l9_239;
float3 l9_241=mix(l9_212,l9_213,l9_240.xyz);
l9_211=l9_241;
float l9_242=0.0;
l9_242=length(l9_211);
float3 l9_243=float3(0.0);
l9_243=l9_211/float3(l9_242);
float l9_244=0.0;
l9_244=fast::clamp((*sc_set0.UserUniforms).Port_Import_N004,0.0,1.0);
float l9_245=0.0;
l9_245=1.0-l9_244;
float l9_246=0.0;
float l9_247;
if (l9_245<=0.0)
{
l9_247=0.0;
}
else
{
l9_247=pow(l9_245,(*sc_set0.UserUniforms).Port_Input1_N005);
}
l9_246=l9_247;
float3 l9_248=float3(0.0);
float3 l9_249=float3(l9_246);
float3 l9_250=(*sc_set0.UserUniforms).Port_Max_N027;
ssGlobals l9_251=l9_207;
int l9_252=3;
bool l9_253=true;
bool l9_254=true;
bool l9_255=true;
float l9_256=27.0;
ssParticle l9_257=gParticle;
float l9_258=1.0;
float l9_259=l9_251.gTimeElapsed;
float4 l9_260=float4(0.0);
float4 l9_261=float4(1.0);
float l9_262=1.0;
float2 l9_263=float2(1.0);
if (l9_253)
{
l9_261=float4(fract(l9_259*10.0));
l9_261=floor(l9_261*10000.0)*9.9999997e-05;
l9_261=float4(0.32339999,0.65740001,0.22579999,0.87629998)+l9_261;
}
if (l9_254)
{
l9_262=1.0+((l9_256+1.0)*0.0099999998);
}
if (l9_255)
{
l9_263=l9_257.Seed2000;
}
l9_258=(l9_258+1.0)*0.5;
if (l9_252>=1)
{
float2 l9_264=(((float2(0.2353,0.78750002)*l9_263)*l9_262)*l9_261.x)*l9_258;
float l9_265=dot(l9_264,float2(0.98253,0.72662002));
l9_265=sin(l9_265)*479.371;
l9_265=fract(l9_265);
l9_265=floor(l9_265*10000.0)*9.9999997e-05;
float l9_266=l9_265;
l9_260.x=l9_266;
}
if (l9_252>=2)
{
float2 l9_267=(((float2(0.5751,0.62730002)*l9_263)*l9_262)*l9_261.y)*l9_258;
float l9_268=dot(l9_267,float2(0.98253,0.72662002));
l9_268=sin(l9_268)*479.371;
l9_268=fract(l9_268);
l9_268=floor(l9_268*10000.0)*9.9999997e-05;
float l9_269=l9_268;
l9_260.y=l9_269;
}
if (l9_252>=3)
{
float2 l9_270=(((float2(0.6947,0.52170002)*l9_263)*l9_262)*l9_261.z)*l9_258;
float l9_271=dot(l9_270,float2(0.98253,0.72662002));
l9_271=sin(l9_271)*479.371;
l9_271=fract(l9_271);
l9_271=floor(l9_271*10000.0)*9.9999997e-05;
float l9_272=l9_271;
l9_260.z=l9_272;
}
if (l9_252>=4)
{
float2 l9_273=(((float2(0.47889999,0.39669999)*l9_263)*l9_262)*l9_261.w)*l9_258;
float l9_274=dot(l9_273,float2(0.98253,0.72662002));
l9_274=sin(l9_274)*479.371;
l9_274=fract(l9_274);
l9_274=floor(l9_274*10000.0)*9.9999997e-05;
float l9_275=l9_274;
l9_260.w=l9_275;
}
float4 l9_276=l9_260;
float4 l9_277=l9_276;
float3 l9_278=mix(l9_249,l9_250,l9_277.xyz);
l9_248=l9_278;
float3 l9_279=float3(0.0);
float l9_280;
if (l9_248.x<=0.0)
{
l9_280=0.0;
}
else
{
l9_280=sqrt(l9_248.x);
}
float l9_281=l9_280;
float l9_282;
if (l9_248.y<=0.0)
{
l9_282=0.0;
}
else
{
l9_282=sqrt(l9_248.y);
}
float l9_283=l9_282;
float l9_284;
if (l9_248.z<=0.0)
{
l9_284=0.0;
}
else
{
l9_284=sqrt(l9_248.z);
}
l9_279=float3(l9_281,l9_283,l9_284);
float3 l9_285=float3(0.0);
float l9_286;
if (l9_279.x<=0.0)
{
l9_286=0.0;
}
else
{
l9_286=sqrt(l9_279.x);
}
float l9_287=l9_286;
float l9_288;
if (l9_279.y<=0.0)
{
l9_288=0.0;
}
else
{
l9_288=sqrt(l9_279.y);
}
float l9_289=l9_288;
float l9_290;
if (l9_279.z<=0.0)
{
l9_290=0.0;
}
else
{
l9_290=sqrt(l9_279.z);
}
l9_285=float3(l9_287,l9_289,l9_290);
float l9_291=0.0;
l9_291=(*sc_set0.UserUniforms).Port_Import_N214;
float3 l9_292=float3(0.0);
l9_292=(*sc_set0.UserUniforms).Port_Import_N212;
float3 l9_293=float3(0.0);
l9_293=((l9_243*l9_285)*float3(l9_291))*l9_292;
float l9_294=0.0;
float3 l9_295=l9_293;
float l9_296=l9_295.y;
l9_294=l9_296;
float l9_297=0.0;
l9_297=abs(l9_294);
l9_205=l9_297;
l9_210=l9_205;
}
else
{
float3 l9_298=float3(0.0);
float3 l9_299=(*sc_set0.UserUniforms).Port_Min_N213;
float3 l9_300=(*sc_set0.UserUniforms).Port_Max_N213;
ssGlobals l9_301=l9_207;
int l9_302=3;
bool l9_303=true;
bool l9_304=true;
bool l9_305=true;
float l9_306=213.0;
ssParticle l9_307=gParticle;
float l9_308=1.0;
float l9_309=l9_301.gTimeElapsed;
float4 l9_310=float4(0.0);
float4 l9_311=float4(1.0);
float l9_312=1.0;
float2 l9_313=float2(1.0);
if (l9_303)
{
l9_311=float4(fract(l9_309*10.0));
l9_311=floor(l9_311*10000.0)*9.9999997e-05;
l9_311=float4(0.32339999,0.65740001,0.22579999,0.87629998)+l9_311;
}
if (l9_304)
{
l9_312=1.0+((l9_306+1.0)*0.0099999998);
}
if (l9_305)
{
l9_313=l9_307.Seed2000;
}
l9_308=(l9_308+1.0)*0.5;
if (l9_302>=1)
{
float2 l9_314=(((float2(0.2353,0.78750002)*l9_313)*l9_312)*l9_311.x)*l9_308;
float l9_315=dot(l9_314,float2(0.98253,0.72662002));
l9_315=sin(l9_315)*479.371;
l9_315=fract(l9_315);
l9_315=floor(l9_315*10000.0)*9.9999997e-05;
float l9_316=l9_315;
l9_310.x=l9_316;
}
if (l9_302>=2)
{
float2 l9_317=(((float2(0.5751,0.62730002)*l9_313)*l9_312)*l9_311.y)*l9_308;
float l9_318=dot(l9_317,float2(0.98253,0.72662002));
l9_318=sin(l9_318)*479.371;
l9_318=fract(l9_318);
l9_318=floor(l9_318*10000.0)*9.9999997e-05;
float l9_319=l9_318;
l9_310.y=l9_319;
}
if (l9_302>=3)
{
float2 l9_320=(((float2(0.6947,0.52170002)*l9_313)*l9_312)*l9_311.z)*l9_308;
float l9_321=dot(l9_320,float2(0.98253,0.72662002));
l9_321=sin(l9_321)*479.371;
l9_321=fract(l9_321);
l9_321=floor(l9_321*10000.0)*9.9999997e-05;
float l9_322=l9_321;
l9_310.z=l9_322;
}
if (l9_302>=4)
{
float2 l9_323=(((float2(0.47889999,0.39669999)*l9_313)*l9_312)*l9_311.w)*l9_308;
float l9_324=dot(l9_323,float2(0.98253,0.72662002));
l9_324=sin(l9_324)*479.371;
l9_324=fract(l9_324);
l9_324=floor(l9_324*10000.0)*9.9999997e-05;
float l9_325=l9_324;
l9_310.w=l9_325;
}
float4 l9_326=l9_310;
float4 l9_327=l9_326;
float3 l9_328=mix(l9_299,l9_300,l9_327.xyz);
l9_298=l9_328;
float l9_329=0.0;
l9_329=length(l9_298);
float3 l9_330=float3(0.0);
l9_330=l9_298/float3(l9_329);
float l9_331=0.0;
l9_331=fast::clamp((*sc_set0.UserUniforms).Port_Import_N004,0.0,1.0);
float l9_332=0.0;
l9_332=1.0-l9_331;
float l9_333=0.0;
float l9_334;
if (l9_332<=0.0)
{
l9_334=0.0;
}
else
{
l9_334=pow(l9_332,(*sc_set0.UserUniforms).Port_Input1_N005);
}
l9_333=l9_334;
float3 l9_335=float3(0.0);
float3 l9_336=float3(l9_333);
float3 l9_337=(*sc_set0.UserUniforms).Port_Max_N027;
ssGlobals l9_338=l9_207;
int l9_339=3;
bool l9_340=true;
bool l9_341=true;
bool l9_342=true;
float l9_343=27.0;
ssParticle l9_344=gParticle;
float l9_345=1.0;
float l9_346=l9_338.gTimeElapsed;
float4 l9_347=float4(0.0);
float4 l9_348=float4(1.0);
float l9_349=1.0;
float2 l9_350=float2(1.0);
if (l9_340)
{
l9_348=float4(fract(l9_346*10.0));
l9_348=floor(l9_348*10000.0)*9.9999997e-05;
l9_348=float4(0.32339999,0.65740001,0.22579999,0.87629998)+l9_348;
}
if (l9_341)
{
l9_349=1.0+((l9_343+1.0)*0.0099999998);
}
if (l9_342)
{
l9_350=l9_344.Seed2000;
}
l9_345=(l9_345+1.0)*0.5;
if (l9_339>=1)
{
float2 l9_351=(((float2(0.2353,0.78750002)*l9_350)*l9_349)*l9_348.x)*l9_345;
float l9_352=dot(l9_351,float2(0.98253,0.72662002));
l9_352=sin(l9_352)*479.371;
l9_352=fract(l9_352);
l9_352=floor(l9_352*10000.0)*9.9999997e-05;
float l9_353=l9_352;
l9_347.x=l9_353;
}
if (l9_339>=2)
{
float2 l9_354=(((float2(0.5751,0.62730002)*l9_350)*l9_349)*l9_348.y)*l9_345;
float l9_355=dot(l9_354,float2(0.98253,0.72662002));
l9_355=sin(l9_355)*479.371;
l9_355=fract(l9_355);
l9_355=floor(l9_355*10000.0)*9.9999997e-05;
float l9_356=l9_355;
l9_347.y=l9_356;
}
if (l9_339>=3)
{
float2 l9_357=(((float2(0.6947,0.52170002)*l9_350)*l9_349)*l9_348.z)*l9_345;
float l9_358=dot(l9_357,float2(0.98253,0.72662002));
l9_358=sin(l9_358)*479.371;
l9_358=fract(l9_358);
l9_358=floor(l9_358*10000.0)*9.9999997e-05;
float l9_359=l9_358;
l9_347.z=l9_359;
}
if (l9_339>=4)
{
float2 l9_360=(((float2(0.47889999,0.39669999)*l9_350)*l9_349)*l9_348.w)*l9_345;
float l9_361=dot(l9_360,float2(0.98253,0.72662002));
l9_361=sin(l9_361)*479.371;
l9_361=fract(l9_361);
l9_361=floor(l9_361*10000.0)*9.9999997e-05;
float l9_362=l9_361;
l9_347.w=l9_362;
}
float4 l9_363=l9_347;
float4 l9_364=l9_363;
float3 l9_365=mix(l9_336,l9_337,l9_364.xyz);
l9_335=l9_365;
float3 l9_366=float3(0.0);
float l9_367;
if (l9_335.x<=0.0)
{
l9_367=0.0;
}
else
{
l9_367=sqrt(l9_335.x);
}
float l9_368=l9_367;
float l9_369;
if (l9_335.y<=0.0)
{
l9_369=0.0;
}
else
{
l9_369=sqrt(l9_335.y);
}
float l9_370=l9_369;
float l9_371;
if (l9_335.z<=0.0)
{
l9_371=0.0;
}
else
{
l9_371=sqrt(l9_335.z);
}
l9_366=float3(l9_368,l9_370,l9_371);
float3 l9_372=float3(0.0);
float l9_373;
if (l9_366.x<=0.0)
{
l9_373=0.0;
}
else
{
l9_373=sqrt(l9_366.x);
}
float l9_374=l9_373;
float l9_375;
if (l9_366.y<=0.0)
{
l9_375=0.0;
}
else
{
l9_375=sqrt(l9_366.y);
}
float l9_376=l9_375;
float l9_377;
if (l9_366.z<=0.0)
{
l9_377=0.0;
}
else
{
l9_377=sqrt(l9_366.z);
}
l9_372=float3(l9_374,l9_376,l9_377);
float l9_378=0.0;
l9_378=(*sc_set0.UserUniforms).Port_Import_N214;
float3 l9_379=float3(0.0);
l9_379=(*sc_set0.UserUniforms).Port_Import_N212;
float3 l9_380=float3(0.0);
l9_380=((l9_330*l9_372)*float3(l9_378))*l9_379;
float l9_381=0.0;
float3 l9_382=l9_380;
float l9_383=l9_382.y;
l9_381=l9_383;
l9_206=l9_381;
l9_210=l9_206;
}
l9_203=l9_210;
float l9_384=0.0;
float l9_385=0.0;
float l9_386=0.0;
float l9_387=0.0;
ssGlobals l9_388=param_1;
float l9_389=0.0;
l9_389=0.0;
float l9_390=0.0;
l9_390=float(l9_389==(*sc_set0.UserUniforms).Port_Input1_N037);
l9_385=l9_390;
float l9_391;
if ((l9_385*1.0)!=0.0)
{
float3 l9_392=float3(0.0);
float3 l9_393=(*sc_set0.UserUniforms).Port_Min_N213;
float3 l9_394=(*sc_set0.UserUniforms).Port_Max_N213;
ssGlobals l9_395=l9_388;
int l9_396=3;
bool l9_397=true;
bool l9_398=true;
bool l9_399=true;
float l9_400=213.0;
ssParticle l9_401=gParticle;
float l9_402=1.0;
float l9_403=l9_395.gTimeElapsed;
float4 l9_404=float4(0.0);
float4 l9_405=float4(1.0);
float l9_406=1.0;
float2 l9_407=float2(1.0);
if (l9_397)
{
l9_405=float4(fract(l9_403*10.0));
l9_405=floor(l9_405*10000.0)*9.9999997e-05;
l9_405=float4(0.32339999,0.65740001,0.22579999,0.87629998)+l9_405;
}
if (l9_398)
{
l9_406=1.0+((l9_400+1.0)*0.0099999998);
}
if (l9_399)
{
l9_407=l9_401.Seed2000;
}
l9_402=(l9_402+1.0)*0.5;
if (l9_396>=1)
{
float2 l9_408=(((float2(0.2353,0.78750002)*l9_407)*l9_406)*l9_405.x)*l9_402;
float l9_409=dot(l9_408,float2(0.98253,0.72662002));
l9_409=sin(l9_409)*479.371;
l9_409=fract(l9_409);
l9_409=floor(l9_409*10000.0)*9.9999997e-05;
float l9_410=l9_409;
l9_404.x=l9_410;
}
if (l9_396>=2)
{
float2 l9_411=(((float2(0.5751,0.62730002)*l9_407)*l9_406)*l9_405.y)*l9_402;
float l9_412=dot(l9_411,float2(0.98253,0.72662002));
l9_412=sin(l9_412)*479.371;
l9_412=fract(l9_412);
l9_412=floor(l9_412*10000.0)*9.9999997e-05;
float l9_413=l9_412;
l9_404.y=l9_413;
}
if (l9_396>=3)
{
float2 l9_414=(((float2(0.6947,0.52170002)*l9_407)*l9_406)*l9_405.z)*l9_402;
float l9_415=dot(l9_414,float2(0.98253,0.72662002));
l9_415=sin(l9_415)*479.371;
l9_415=fract(l9_415);
l9_415=floor(l9_415*10000.0)*9.9999997e-05;
float l9_416=l9_415;
l9_404.z=l9_416;
}
if (l9_396>=4)
{
float2 l9_417=(((float2(0.47889999,0.39669999)*l9_407)*l9_406)*l9_405.w)*l9_402;
float l9_418=dot(l9_417,float2(0.98253,0.72662002));
l9_418=sin(l9_418)*479.371;
l9_418=fract(l9_418);
l9_418=floor(l9_418*10000.0)*9.9999997e-05;
float l9_419=l9_418;
l9_404.w=l9_419;
}
float4 l9_420=l9_404;
float4 l9_421=l9_420;
float3 l9_422=mix(l9_393,l9_394,l9_421.xyz);
l9_392=l9_422;
float l9_423=0.0;
l9_423=length(l9_392);
float3 l9_424=float3(0.0);
l9_424=l9_392/float3(l9_423);
float l9_425=0.0;
l9_425=fast::clamp((*sc_set0.UserUniforms).Port_Import_N004,0.0,1.0);
float l9_426=0.0;
l9_426=1.0-l9_425;
float l9_427=0.0;
float l9_428;
if (l9_426<=0.0)
{
l9_428=0.0;
}
else
{
l9_428=pow(l9_426,(*sc_set0.UserUniforms).Port_Input1_N005);
}
l9_427=l9_428;
float3 l9_429=float3(0.0);
float3 l9_430=float3(l9_427);
float3 l9_431=(*sc_set0.UserUniforms).Port_Max_N027;
ssGlobals l9_432=l9_388;
int l9_433=3;
bool l9_434=true;
bool l9_435=true;
bool l9_436=true;
float l9_437=27.0;
ssParticle l9_438=gParticle;
float l9_439=1.0;
float l9_440=l9_432.gTimeElapsed;
float4 l9_441=float4(0.0);
float4 l9_442=float4(1.0);
float l9_443=1.0;
float2 l9_444=float2(1.0);
if (l9_434)
{
l9_442=float4(fract(l9_440*10.0));
l9_442=floor(l9_442*10000.0)*9.9999997e-05;
l9_442=float4(0.32339999,0.65740001,0.22579999,0.87629998)+l9_442;
}
if (l9_435)
{
l9_443=1.0+((l9_437+1.0)*0.0099999998);
}
if (l9_436)
{
l9_444=l9_438.Seed2000;
}
l9_439=(l9_439+1.0)*0.5;
if (l9_433>=1)
{
float2 l9_445=(((float2(0.2353,0.78750002)*l9_444)*l9_443)*l9_442.x)*l9_439;
float l9_446=dot(l9_445,float2(0.98253,0.72662002));
l9_446=sin(l9_446)*479.371;
l9_446=fract(l9_446);
l9_446=floor(l9_446*10000.0)*9.9999997e-05;
float l9_447=l9_446;
l9_441.x=l9_447;
}
if (l9_433>=2)
{
float2 l9_448=(((float2(0.5751,0.62730002)*l9_444)*l9_443)*l9_442.y)*l9_439;
float l9_449=dot(l9_448,float2(0.98253,0.72662002));
l9_449=sin(l9_449)*479.371;
l9_449=fract(l9_449);
l9_449=floor(l9_449*10000.0)*9.9999997e-05;
float l9_450=l9_449;
l9_441.y=l9_450;
}
if (l9_433>=3)
{
float2 l9_451=(((float2(0.6947,0.52170002)*l9_444)*l9_443)*l9_442.z)*l9_439;
float l9_452=dot(l9_451,float2(0.98253,0.72662002));
l9_452=sin(l9_452)*479.371;
l9_452=fract(l9_452);
l9_452=floor(l9_452*10000.0)*9.9999997e-05;
float l9_453=l9_452;
l9_441.z=l9_453;
}
if (l9_433>=4)
{
float2 l9_454=(((float2(0.47889999,0.39669999)*l9_444)*l9_443)*l9_442.w)*l9_439;
float l9_455=dot(l9_454,float2(0.98253,0.72662002));
l9_455=sin(l9_455)*479.371;
l9_455=fract(l9_455);
l9_455=floor(l9_455*10000.0)*9.9999997e-05;
float l9_456=l9_455;
l9_441.w=l9_456;
}
float4 l9_457=l9_441;
float4 l9_458=l9_457;
float3 l9_459=mix(l9_430,l9_431,l9_458.xyz);
l9_429=l9_459;
float3 l9_460=float3(0.0);
float l9_461;
if (l9_429.x<=0.0)
{
l9_461=0.0;
}
else
{
l9_461=sqrt(l9_429.x);
}
float l9_462=l9_461;
float l9_463;
if (l9_429.y<=0.0)
{
l9_463=0.0;
}
else
{
l9_463=sqrt(l9_429.y);
}
float l9_464=l9_463;
float l9_465;
if (l9_429.z<=0.0)
{
l9_465=0.0;
}
else
{
l9_465=sqrt(l9_429.z);
}
l9_460=float3(l9_462,l9_464,l9_465);
float3 l9_466=float3(0.0);
float l9_467;
if (l9_460.x<=0.0)
{
l9_467=0.0;
}
else
{
l9_467=sqrt(l9_460.x);
}
float l9_468=l9_467;
float l9_469;
if (l9_460.y<=0.0)
{
l9_469=0.0;
}
else
{
l9_469=sqrt(l9_460.y);
}
float l9_470=l9_469;
float l9_471;
if (l9_460.z<=0.0)
{
l9_471=0.0;
}
else
{
l9_471=sqrt(l9_460.z);
}
l9_466=float3(l9_468,l9_470,l9_471);
float l9_472=0.0;
l9_472=(*sc_set0.UserUniforms).Port_Import_N214;
float3 l9_473=float3(0.0);
l9_473=(*sc_set0.UserUniforms).Port_Import_N212;
float3 l9_474=float3(0.0);
l9_474=((l9_424*l9_466)*float3(l9_472))*l9_473;
float l9_475=0.0;
float3 l9_476=l9_474;
float l9_477=l9_476.z;
l9_475=l9_477;
float l9_478=0.0;
l9_478=abs(l9_475);
l9_386=l9_478;
l9_391=l9_386;
}
else
{
float3 l9_479=float3(0.0);
float3 l9_480=(*sc_set0.UserUniforms).Port_Min_N213;
float3 l9_481=(*sc_set0.UserUniforms).Port_Max_N213;
ssGlobals l9_482=l9_388;
int l9_483=3;
bool l9_484=true;
bool l9_485=true;
bool l9_486=true;
float l9_487=213.0;
ssParticle l9_488=gParticle;
float l9_489=1.0;
float l9_490=l9_482.gTimeElapsed;
float4 l9_491=float4(0.0);
float4 l9_492=float4(1.0);
float l9_493=1.0;
float2 l9_494=float2(1.0);
if (l9_484)
{
l9_492=float4(fract(l9_490*10.0));
l9_492=floor(l9_492*10000.0)*9.9999997e-05;
l9_492=float4(0.32339999,0.65740001,0.22579999,0.87629998)+l9_492;
}
if (l9_485)
{
l9_493=1.0+((l9_487+1.0)*0.0099999998);
}
if (l9_486)
{
l9_494=l9_488.Seed2000;
}
l9_489=(l9_489+1.0)*0.5;
if (l9_483>=1)
{
float2 l9_495=(((float2(0.2353,0.78750002)*l9_494)*l9_493)*l9_492.x)*l9_489;
float l9_496=dot(l9_495,float2(0.98253,0.72662002));
l9_496=sin(l9_496)*479.371;
l9_496=fract(l9_496);
l9_496=floor(l9_496*10000.0)*9.9999997e-05;
float l9_497=l9_496;
l9_491.x=l9_497;
}
if (l9_483>=2)
{
float2 l9_498=(((float2(0.5751,0.62730002)*l9_494)*l9_493)*l9_492.y)*l9_489;
float l9_499=dot(l9_498,float2(0.98253,0.72662002));
l9_499=sin(l9_499)*479.371;
l9_499=fract(l9_499);
l9_499=floor(l9_499*10000.0)*9.9999997e-05;
float l9_500=l9_499;
l9_491.y=l9_500;
}
if (l9_483>=3)
{
float2 l9_501=(((float2(0.6947,0.52170002)*l9_494)*l9_493)*l9_492.z)*l9_489;
float l9_502=dot(l9_501,float2(0.98253,0.72662002));
l9_502=sin(l9_502)*479.371;
l9_502=fract(l9_502);
l9_502=floor(l9_502*10000.0)*9.9999997e-05;
float l9_503=l9_502;
l9_491.z=l9_503;
}
if (l9_483>=4)
{
float2 l9_504=(((float2(0.47889999,0.39669999)*l9_494)*l9_493)*l9_492.w)*l9_489;
float l9_505=dot(l9_504,float2(0.98253,0.72662002));
l9_505=sin(l9_505)*479.371;
l9_505=fract(l9_505);
l9_505=floor(l9_505*10000.0)*9.9999997e-05;
float l9_506=l9_505;
l9_491.w=l9_506;
}
float4 l9_507=l9_491;
float4 l9_508=l9_507;
float3 l9_509=mix(l9_480,l9_481,l9_508.xyz);
l9_479=l9_509;
float l9_510=0.0;
l9_510=length(l9_479);
float3 l9_511=float3(0.0);
l9_511=l9_479/float3(l9_510);
float l9_512=0.0;
l9_512=fast::clamp((*sc_set0.UserUniforms).Port_Import_N004,0.0,1.0);
float l9_513=0.0;
l9_513=1.0-l9_512;
float l9_514=0.0;
float l9_515;
if (l9_513<=0.0)
{
l9_515=0.0;
}
else
{
l9_515=pow(l9_513,(*sc_set0.UserUniforms).Port_Input1_N005);
}
l9_514=l9_515;
float3 l9_516=float3(0.0);
float3 l9_517=float3(l9_514);
float3 l9_518=(*sc_set0.UserUniforms).Port_Max_N027;
ssGlobals l9_519=l9_388;
int l9_520=3;
bool l9_521=true;
bool l9_522=true;
bool l9_523=true;
float l9_524=27.0;
ssParticle l9_525=gParticle;
float l9_526=1.0;
float l9_527=l9_519.gTimeElapsed;
float4 l9_528=float4(0.0);
float4 l9_529=float4(1.0);
float l9_530=1.0;
float2 l9_531=float2(1.0);
if (l9_521)
{
l9_529=float4(fract(l9_527*10.0));
l9_529=floor(l9_529*10000.0)*9.9999997e-05;
l9_529=float4(0.32339999,0.65740001,0.22579999,0.87629998)+l9_529;
}
if (l9_522)
{
l9_530=1.0+((l9_524+1.0)*0.0099999998);
}
if (l9_523)
{
l9_531=l9_525.Seed2000;
}
l9_526=(l9_526+1.0)*0.5;
if (l9_520>=1)
{
float2 l9_532=(((float2(0.2353,0.78750002)*l9_531)*l9_530)*l9_529.x)*l9_526;
float l9_533=dot(l9_532,float2(0.98253,0.72662002));
l9_533=sin(l9_533)*479.371;
l9_533=fract(l9_533);
l9_533=floor(l9_533*10000.0)*9.9999997e-05;
float l9_534=l9_533;
l9_528.x=l9_534;
}
if (l9_520>=2)
{
float2 l9_535=(((float2(0.5751,0.62730002)*l9_531)*l9_530)*l9_529.y)*l9_526;
float l9_536=dot(l9_535,float2(0.98253,0.72662002));
l9_536=sin(l9_536)*479.371;
l9_536=fract(l9_536);
l9_536=floor(l9_536*10000.0)*9.9999997e-05;
float l9_537=l9_536;
l9_528.y=l9_537;
}
if (l9_520>=3)
{
float2 l9_538=(((float2(0.6947,0.52170002)*l9_531)*l9_530)*l9_529.z)*l9_526;
float l9_539=dot(l9_538,float2(0.98253,0.72662002));
l9_539=sin(l9_539)*479.371;
l9_539=fract(l9_539);
l9_539=floor(l9_539*10000.0)*9.9999997e-05;
float l9_540=l9_539;
l9_528.z=l9_540;
}
if (l9_520>=4)
{
float2 l9_541=(((float2(0.47889999,0.39669999)*l9_531)*l9_530)*l9_529.w)*l9_526;
float l9_542=dot(l9_541,float2(0.98253,0.72662002));
l9_542=sin(l9_542)*479.371;
l9_542=fract(l9_542);
l9_542=floor(l9_542*10000.0)*9.9999997e-05;
float l9_543=l9_542;
l9_528.w=l9_543;
}
float4 l9_544=l9_528;
float4 l9_545=l9_544;
float3 l9_546=mix(l9_517,l9_518,l9_545.xyz);
l9_516=l9_546;
float3 l9_547=float3(0.0);
float l9_548;
if (l9_516.x<=0.0)
{
l9_548=0.0;
}
else
{
l9_548=sqrt(l9_516.x);
}
float l9_549=l9_548;
float l9_550;
if (l9_516.y<=0.0)
{
l9_550=0.0;
}
else
{
l9_550=sqrt(l9_516.y);
}
float l9_551=l9_550;
float l9_552;
if (l9_516.z<=0.0)
{
l9_552=0.0;
}
else
{
l9_552=sqrt(l9_516.z);
}
l9_547=float3(l9_549,l9_551,l9_552);
float3 l9_553=float3(0.0);
float l9_554;
if (l9_547.x<=0.0)
{
l9_554=0.0;
}
else
{
l9_554=sqrt(l9_547.x);
}
float l9_555=l9_554;
float l9_556;
if (l9_547.y<=0.0)
{
l9_556=0.0;
}
else
{
l9_556=sqrt(l9_547.y);
}
float l9_557=l9_556;
float l9_558;
if (l9_547.z<=0.0)
{
l9_558=0.0;
}
else
{
l9_558=sqrt(l9_547.z);
}
l9_553=float3(l9_555,l9_557,l9_558);
float l9_559=0.0;
l9_559=(*sc_set0.UserUniforms).Port_Import_N214;
float3 l9_560=float3(0.0);
l9_560=(*sc_set0.UserUniforms).Port_Import_N212;
float3 l9_561=float3(0.0);
l9_561=((l9_511*l9_553)*float3(l9_559))*l9_560;
float l9_562=0.0;
float3 l9_563=l9_561;
float l9_564=l9_563.z;
l9_562=l9_564;
l9_387=l9_562;
l9_391=l9_387;
}
l9_384=l9_391;
float3 l9_565=float3(0.0);
l9_565.x=l9_22;
l9_565.y=l9_203;
l9_565.z=l9_384;
float3 l9_566=float3(0.0);
l9_566=l9_21+l9_565;
gParticle.Position=l9_566;
float l9_567=0.0;
l9_567=param_1.gTimeElapsedShifted*(*sc_set0.UserUniforms).Port_Multiplier_N012;
float l9_568=0.0;
float l9_569=(*sc_set0.UserUniforms).burstDuration;
l9_568=l9_569;
float l9_570=0.0;
l9_570=float(l9_567>l9_568);
float l9_571=l9_570;
if ((l9_571*1.0)!=0.0)
{
gParticle.Dead=true;
}
float3 l9_572=float3(0.0);
l9_572=gParticle.Position;
float3 l9_573=float3(0.0);
float3 l9_574=l9_572;
float l9_575=dot(l9_574,l9_574);
float l9_576;
if (l9_575>0.0)
{
l9_576=1.0/sqrt(l9_575);
}
else
{
l9_576=0.0;
}
float l9_577=l9_576;
float3 l9_578=l9_574*l9_577;
l9_573=l9_578;
float l9_579=0.0;
float l9_580=(*sc_set0.UserUniforms).explosionForce;
l9_579=l9_580;
float3 l9_581=float3(0.0);
l9_581=l9_573*float3(l9_579);
gParticle.Force=l9_581;
float l9_582=0.0;
l9_582=(*sc_set0.UserUniforms).Port_Import_N285;
float3 l9_583=float3(0.0);
l9_583=(*sc_set0.UserUniforms).Port_Import_N284;
float3 l9_584=float3(0.0);
l9_584=gParticle.Position;
float3 l9_585=float3(0.0);
l9_585=l9_583-l9_584;
float3 l9_586=float3(0.0);
float3 l9_587=l9_585;
float l9_588=dot(l9_587,l9_587);
float l9_589;
if (l9_588>0.0)
{
l9_589=1.0/sqrt(l9_588);
}
else
{
l9_589=0.0;
}
float l9_590=l9_589;
float3 l9_591=l9_587*l9_590;
l9_586=l9_591;
float3 l9_592=float3(0.0);
l9_592=float3(l9_582)*l9_586;
gParticle.Force+=l9_592;
float l9_593=0.0;
l9_593=(*sc_set0.UserUniforms).Port_Import_N121;
float l9_594=0.0;
l9_594=gParticle.Mass;
float l9_595=0.0;
l9_595=(l9_593*l9_594)*(*sc_set0.UserUniforms).Port_Input2_N146;
float3 l9_596=float3(0.0);
l9_596=float3(0.0,l9_595,0.0);
gParticle.Force+=l9_596;
gParticle.Velocity+=((gParticle.Force/float3(gParticle.Mass))*0.033330001);
gParticle.Force=float3(0.0);
int l9_597=gl_InstanceIndex;
gParticle.Position=((*sc_set0.UserUniforms).vfxModelMatrix[l9_597/170]*float4(gParticle.Position,1.0)).xyz;
int l9_598=gl_InstanceIndex;
int l9_599=l9_598/170;
gParticle.Velocity=float3x3((*sc_set0.UserUniforms).vfxModelMatrix[l9_599][0].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_599][1].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_599][2].xyz)*gParticle.Velocity;
int l9_600=gl_InstanceIndex;
int l9_601=l9_600/170;
gParticle.Force=float3x3((*sc_set0.UserUniforms).vfxModelMatrix[l9_601][0].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_601][1].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_601][2].xyz)*gParticle.Force;
int l9_602=gl_InstanceIndex;
int l9_603=gl_InstanceIndex;
int l9_604=gl_InstanceIndex;
gParticle.Size=fast::max(length((*sc_set0.UserUniforms).vfxModelMatrix[l9_602/170][0].xyz),fast::max(length((*sc_set0.UserUniforms).vfxModelMatrix[l9_603/170][1].xyz),length((*sc_set0.UserUniforms).vfxModelMatrix[l9_604/170][2].xyz)))*gParticle.Size;
int l9_605=gl_InstanceIndex;
int l9_606=l9_605/170;
gParticle.Matrix=float3x3((*sc_set0.UserUniforms).vfxModelMatrix[l9_606][0].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_606][1].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_606][2].xyz)*gParticle.Matrix;
gParticle.Spawned=true;
}
}
if (gParticle.Dead)
{
float4 param_2=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_2.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_607=param_2;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_608=dot(l9_607,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_609=l9_608;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_609;
}
}
float4 l9_610=float4(param_2.x,-param_2.y,(param_2.z*0.5)+(param_2.w*0.5),param_2.w);
out.gl_Position=l9_610;
return out;
}
float3 Value_N71=float3(0.0);
Value_N71=(*sc_set0.UserUniforms).Port_Import_N071;
float3 Value_N23=float3(0.0);
Value_N23=gParticle.Position;
float3 Value_N24=float3(0.0);
Value_N24=(*sc_set0.UserUniforms).Port_Import_N024;
float3 Value_N318=float3(0.0);
Value_N318=(*sc_set0.UserUniforms).Port_Import_N318;
float Time_N319=0.0;
Time_N319=Globals.gTimeElapsedShifted*(*sc_set0.UserUniforms).Port_Multiplier_N319;
float3 Output_N320=float3(0.0);
Output_N320=Value_N318*float3(Time_N319);
float3 Output_N321=float3(0.0);
Output_N321=(Value_N23+Value_N24)+Output_N320;
float3 Value_N322=float3(0.0);
Value_N322=(*sc_set0.UserUniforms).Port_Import_N322;
float3 Output_N323=float3(0.0);
Output_N323=float3(1.0)/Value_N322;
float3 Output_N324=float3(0.0);
Output_N324=Output_N321*Output_N323;
float2 Output_N325=float2(0.0);
Output_N325=float2(Output_N324.x,Output_N324.y);
float2 Output_N326=float2(0.0);
Output_N326=Output_N325+(*sc_set0.UserUniforms).Port_Input1_N326;
float Noise_N327=0.0;
float2 param_3=Output_N326;
float2 param_4=(*sc_set0.UserUniforms).Port_Scale_N327;
param_3.x=floor(param_3.x*10000.0)*9.9999997e-05;
param_3.y=floor(param_3.y*10000.0)*9.9999997e-05;
param_3*=(param_4*0.5);
float2 l9_612=param_3;
float param_5=(snoise(l9_612)*0.5)+0.5;
param_5=floor(param_5*10000.0)*9.9999997e-05;
Noise_N327=param_5;
float2 Output_N328=float2(0.0);
Output_N328=float2(Output_N324.y,Output_N324.z);
float2 Output_N329=float2(0.0);
Output_N329=Output_N328+(*sc_set0.UserUniforms).Port_Input1_N329;
float Noise_N330=0.0;
float2 param_6=Output_N329;
float2 param_7=(*sc_set0.UserUniforms).Port_Scale_N330;
param_6.x=floor(param_6.x*10000.0)*9.9999997e-05;
param_6.y=floor(param_6.y*10000.0)*9.9999997e-05;
param_6*=(param_7*0.5);
float2 l9_613=param_6;
float param_8=(snoise(l9_613)*0.5)+0.5;
param_8=floor(param_8*10000.0)*9.9999997e-05;
Noise_N330=param_8;
float2 Output_N331=float2(0.0);
Output_N331=float2(Output_N324.z,Output_N324.x);
float2 Output_N332=float2(0.0);
Output_N332=Output_N331+(*sc_set0.UserUniforms).Port_Input1_N332;
float Noise_N333=0.0;
float2 param_9=Output_N332;
float2 param_10=(*sc_set0.UserUniforms).Port_Scale_N333;
param_9.x=floor(param_9.x*10000.0)*9.9999997e-05;
param_9.y=floor(param_9.y*10000.0)*9.9999997e-05;
param_9*=(param_10*0.5);
float2 l9_614=param_9;
float param_11=(snoise(l9_614)*0.5)+0.5;
param_11=floor(param_11*10000.0)*9.9999997e-05;
Noise_N333=param_11;
float3 Value_N334=float3(0.0);
Value_N334.x=Noise_N327;
Value_N334.y=Noise_N330;
Value_N334.z=Noise_N333;
float3 Output_N335=float3(0.0);
Output_N335=Value_N334*(*sc_set0.UserUniforms).Port_Input1_N335;
float3 Output_N336=float3(0.0);
Output_N336=Output_N335-float3(1.0);
float3 Output_N337=float3(0.0);
Output_N337=Value_N71*Output_N336;
gParticle.Force+=Output_N337;
float Value_N75=0.0;
Value_N75=(*sc_set0.UserUniforms).Port_Import_N075;
float Value_N68=0.0;
Value_N68=(*sc_set0.UserUniforms).Port_Import_N068;
float Value_N179=0.0;
Value_N179=fast::clamp(gParticle.Age/gParticle.Life,0.0,1.0);
float Value_N82=0.0;
Value_N82=Value_N179;
float Value_N76=0.0;
Value_N76=(*sc_set0.UserUniforms).Port_Import_N076;
float Value_N6=0.0;
Value_N6=gParticle.Life;
float Output_N114=0.0;
Output_N114=Value_N76/Value_N6;
float Value_N83=0.0;
Value_N83=Output_N114;
float Output_N88=0.0;
Output_N88=(*sc_set0.UserUniforms).Port_Input0_N088/Value_N83;
float Output_N111=0.0;
Output_N111=Value_N82*Output_N88;
float Output_N8=0.0;
Output_N8=fast::clamp(Output_N111+0.001,(*sc_set0.UserUniforms).Port_Input1_N008+0.001,(*sc_set0.UserUniforms).Port_Input2_N008+0.001)-0.001;
float Output_N184=0.0;
Output_N184=1.0-Value_N82;
float Value_N77=0.0;
Value_N77=(*sc_set0.UserUniforms).Port_Import_N077;
float Output_N147=0.0;
Output_N147=Value_N77/Value_N6;
float Value_N84=0.0;
Value_N84=Output_N147;
float Output_N99=0.0;
Output_N99=(*sc_set0.UserUniforms).Port_Input0_N099/Value_N84;
float Output_N113=0.0;
Output_N113=Output_N184*Output_N99;
float Output_N112=0.0;
Output_N112=fast::clamp(Output_N113+0.001,(*sc_set0.UserUniforms).Port_Input1_N112+0.001,(*sc_set0.UserUniforms).Port_Input2_N112+0.001)-0.001;
float Output_N177=0.0;
Output_N177=Output_N8*Output_N112;
float Export_N178=0.0;
Export_N178=Output_N177;
float Output_N9=0.0;
Output_N9=mix(Value_N75,Value_N68,Export_N178);
gParticle.Size=Output_N9;
float4 Value_N67=float4(0.0);
Value_N67=gParticle.Color;
float Value_N87=0.0;
Value_N87=(*sc_set0.UserUniforms).Port_Import_N087;
float Value_N89=0.0;
Value_N89=(*sc_set0.UserUniforms).Port_Import_N089;
float Value_N91=0.0;
Value_N91=fast::clamp(gParticle.Age/gParticle.Life,0.0,1.0);
float Output_N98=0.0;
Output_N98=mix(Value_N87,Value_N89,Value_N91);
float4 Value_N176=float4(0.0);
Value_N176=float4(Value_N67.xyz.x,Value_N67.xyz.y,Value_N67.xyz.z,Value_N176.w);
Value_N176.w=Output_N98;
gParticle.Color=Value_N176;
float Value_N116=0.0;
Value_N116=(*sc_set0.UserUniforms).Port_Import_N116;
float Value_N117=0.0;
Value_N117=gParticle.Mass;
float Output_N136=0.0;
Output_N136=(Value_N116*Value_N117)*(*sc_set0.UserUniforms).Port_Input2_N136;
float3 Output_N137=float3(0.0);
Output_N137=float3(0.0,Output_N136,0.0);
gParticle.Force+=Output_N137;
float3x3 param_12=gParticle.Matrix;
gParticle.Quaternion=matrixToQuaternion(param_12);
float Drift=0.0049999999;
if (gParticle.Dead)
{
float4 param_13=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_13.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_615=param_13;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_616=dot(l9_615,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_617=l9_616;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_617;
}
}
float4 l9_618=float4(param_13.x,-param_13.y,(param_13.z*0.5)+(param_13.w*0.5),param_13.w);
out.gl_Position=l9_618;
return out;
}
float l9_619;
if (abs(gParticle.Force.x)<Drift)
{
l9_619=0.0;
}
else
{
l9_619=gParticle.Force.x;
}
gParticle.Force.x=l9_619;
float l9_620;
if (abs(gParticle.Force.y)<Drift)
{
l9_620=0.0;
}
else
{
l9_620=gParticle.Force.y;
}
gParticle.Force.y=l9_620;
float l9_621;
if (abs(gParticle.Force.z)<Drift)
{
l9_621=0.0;
}
else
{
l9_621=gParticle.Force.z;
}
gParticle.Force.z=l9_621;
gParticle.Mass=fast::max(Drift,gParticle.Mass);
if (Globals.gTimeDelta!=0.0)
{
gParticle.Velocity+=((gParticle.Force/float3(gParticle.Mass))*Globals.gTimeDelta);
}
float l9_622;
if (abs(gParticle.Velocity.x)<Drift)
{
l9_622=0.0;
}
else
{
l9_622=gParticle.Velocity.x;
}
gParticle.Velocity.x=l9_622;
float l9_623;
if (abs(gParticle.Velocity.y)<Drift)
{
l9_623=0.0;
}
else
{
l9_623=gParticle.Velocity.y;
}
gParticle.Velocity.y=l9_623;
float l9_624;
if (abs(gParticle.Velocity.z)<Drift)
{
l9_624=0.0;
}
else
{
l9_624=gParticle.Velocity.z;
}
gParticle.Velocity.z=l9_624;
gParticle.Position+=(gParticle.Velocity*Globals.gTimeDelta);
float2 QuadSize=float2(4.0,1.0)/float2(2048.0,(*sc_set0.UserUniforms).vfxTargetSizeWrite.y);
float2 Offset=float2(0.0);
int offsetID=(*sc_set0.UserUniforms).vfxOffsetInstancesWrite+ssInstanceID;
int particleRow=512;
Offset.x=float(offsetID%particleRow);
Offset.y=float(offsetID/particleRow);
Offset*=QuadSize;
float2 Vertex=float2(0.0);
float l9_625;
if (v.texture0.x<0.5)
{
l9_625=0.0;
}
else
{
l9_625=QuadSize.x;
}
Vertex.x=l9_625;
float l9_626;
if (v.texture0.y<0.5)
{
l9_626=0.0;
}
else
{
l9_626=QuadSize.y;
}
Vertex.y=l9_626;
Vertex+=Offset;
float4 param_14=float4((Vertex*2.0)-float2(1.0),1.0,1.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_14.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_627=param_14;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_628=dot(l9_627,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_629=l9_628;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_629;
}
}
float4 l9_630=float4(param_14.x,-param_14.y,(param_14.z*0.5)+(param_14.w*0.5),param_14.w);
out.gl_Position=l9_630;
out.Interp_Particle_Index=ssInstanceID;
out.Interp_Particle_Coord=v.texture0;
out.Interp_Particle_Force=gParticle.Force;
out.Interp_Particle_SpawnIndex=gParticle.SpawnIndex;
out.Interp_Particle_NextBurstTime=gParticle.NextBurstTime;
out.Interp_Particle_Position=gParticle.Position;
out.Interp_Particle_Velocity=gParticle.Velocity;
out.Interp_Particle_Life=gParticle.Life;
out.Interp_Particle_Age=gParticle.Age;
out.Interp_Particle_Size=gParticle.Size;
out.Interp_Particle_Color=gParticle.Color;
out.Interp_Particle_Quaternion=gParticle.Quaternion;
if (gParticle.Dead)
{
float4 param_15=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_15.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_631=param_15;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_632=dot(l9_631,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_633=l9_632;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_633;
}
}
float4 l9_634=float4(param_15.x,-param_15.y,(param_15.z*0.5)+(param_15.w*0.5),param_15.w);
out.gl_Position=l9_634;
return out;
}
return out;
}
} // VERTEX SHADER


namespace SNAP_FS {
struct sc_PointLight_t
{
int falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
float3 direction;
float3 position;
float4 color;
};
struct sc_DirectionalLight_t
{
float3 direction;
float4 color;
};
struct sc_AmbientLight_t
{
float3 color;
float intensity;
};
struct sc_SphericalGaussianLight_t
{
float3 color;
float sharpness;
float3 axis;
};
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
float3 ambientLight;
};
struct sc_Camera_t
{
float3 position;
float aspect;
float2 clipPlanes;
};
struct userUniformsObj
{
sc_PointLight_t sc_PointLights[3];
sc_DirectionalLight_t sc_DirectionalLights[5];
sc_AmbientLight_t sc_AmbientLights[3];
sc_LightEstimationData_t sc_LightEstimationData;
float4 sc_EnvmapDiffuseSize;
float4 sc_EnvmapDiffuseDims;
float4 sc_EnvmapDiffuseView;
float4 sc_EnvmapSpecularSize;
float4 sc_EnvmapSpecularDims;
float4 sc_EnvmapSpecularView;
float3 sc_EnvmapRotation;
float sc_EnvmapExposure;
float3 sc_Sh[9];
float sc_ShIntensity;
float4 sc_Time;
float4 sc_UniformConstants;
float4 sc_GeometryInfo;
float4x4 sc_ModelViewProjectionMatrixArray[2];
float4x4 sc_ModelViewProjectionMatrixInverseArray[2];
float4x4 sc_ViewProjectionMatrixArray[2];
float4x4 sc_ViewProjectionMatrixInverseArray[2];
float4x4 sc_ModelViewMatrixArray[2];
float4x4 sc_ModelViewMatrixInverseArray[2];
float3x3 sc_ViewNormalMatrixArray[2];
float3x3 sc_ViewNormalMatrixInverseArray[2];
float4x4 sc_ProjectionMatrixArray[2];
float4x4 sc_ProjectionMatrixInverseArray[2];
float4x4 sc_ViewMatrixArray[2];
float4x4 sc_ViewMatrixInverseArray[2];
float4x4 sc_PrevFrameViewProjectionMatrixArray[2];
float4x4 sc_ModelMatrix;
float4x4 sc_ModelMatrixInverse;
float3x3 sc_NormalMatrix;
float3x3 sc_NormalMatrixInverse;
float4x4 sc_PrevFrameModelMatrix;
float4x4 sc_PrevFrameModelMatrixInverse;
float3 sc_LocalAabbMin;
float3 sc_LocalAabbMax;
float3 sc_WorldAabbMin;
float3 sc_WorldAabbMax;
float4 sc_WindowToViewportTransform;
float4 sc_CurrentRenderTargetDims;
sc_Camera_t sc_Camera;
float sc_ShadowDensity;
float4 sc_ShadowColor;
float4x4 sc_ProjectorMatrix;
float shaderComplexityValue;
float4 weights0;
float4 weights1;
float4 weights2;
float4 sc_StereoClipPlanes[2];
int sc_FallbackInstanceID;
float2 sc_TAAJitterOffset;
float strandWidth;
float strandTaper;
float4 sc_StrandDataMapTextureSize;
float clumpInstanceCount;
float clumpRadius;
float clumpTipScale;
float hairstyleInstanceCount;
float hairstyleNoise;
float4 sc_ScreenTextureSize;
float4 sc_ScreenTextureDims;
float4 sc_ScreenTextureView;
float4 voxelization_params_0;
float4 voxelization_params_frustum_lrbt;
float4 voxelization_params_frustum_nf;
float3 voxelization_params_camera_pos;
float4x4 sc_ModelMatrixVoxelization;
float correctedIntensity;
float4 intensityTextureSize;
float4 intensityTextureDims;
float4 intensityTextureView;
float3x3 intensityTextureTransform;
float4 intensityTextureUvMinMax;
float4 intensityTextureBorderColor;
float reflBlurWidth;
float reflBlurMinRough;
float reflBlurMaxRough;
int overrideTimeEnabled;
float overrideTimeElapsed[32];
float overrideTimeDelta;
int vfxNumCopies;
int vfxBatchEnable[32];
int vfxEmitParticle[32];
float4x4 vfxModelMatrix[32];
float4 renderTarget0Size;
float4 renderTarget0Dims;
float4 renderTarget0View;
float4 renderTarget1Size;
float4 renderTarget1Dims;
float4 renderTarget1View;
float4 renderTarget2Size;
float4 renderTarget2Dims;
float4 renderTarget2View;
float4 renderTarget3Size;
float4 renderTarget3Dims;
float4 renderTarget3View;
float4 sortRenderTarget0Size;
float4 sortRenderTarget0Dims;
float4 sortRenderTarget0View;
float4 sortRenderTarget1Size;
float4 sortRenderTarget1Dims;
float4 sortRenderTarget1View;
float3 vfxLocalAabbMin;
float3 vfxLocalAabbMax;
float vfxCameraAspect;
float vfxCameraNear;
float vfxCameraFar;
float4x4 vfxProjectionMatrix;
float4x4 vfxProjectionMatrixInverse;
float4x4 vfxViewMatrix;
float4x4 vfxViewMatrixInverse;
float4x4 vfxViewProjectionMatrix;
float4x4 vfxViewProjectionMatrixInverse;
float3 vfxCameraPosition;
float3 vfxCameraUp;
float3 vfxCameraForward;
float3 vfxCameraRight;
int vfxFrame;
int vfxOffsetInstancesRead;
int vfxOffsetInstancesWrite;
float2 vfxTargetSizeRead;
float2 vfxTargetSizeWrite;
int vfxTargetWidth;
float2 ssSORT_RENDER_TARGET_SIZE;
float burstDuration;
float explosionForce;
float3 Port_Import_N216;
float Port_Input1_N029;
float3 Port_Min_N213;
float3 Port_Max_N213;
float Port_Import_N004;
float Port_Input1_N005;
float3 Port_Max_N027;
float Port_Import_N214;
float3 Port_Import_N212;
float Port_Input1_N034;
float Port_Input1_N037;
float Port_Multiplier_N012;
float Port_Enabled_N086;
float Port_Import_N285;
float3 Port_Import_N284;
float Port_Import_N121;
float Port_Input2_N146;
float3 Port_Import_N071;
float3 Port_Import_N024;
float3 Port_Import_N318;
float Port_Multiplier_N319;
float3 Port_Import_N322;
float2 Port_Input1_N326;
float2 Port_Scale_N327;
float2 Port_Input1_N329;
float2 Port_Scale_N330;
float2 Port_Input1_N332;
float2 Port_Scale_N333;
float3 Port_Input1_N335;
float Port_Import_N075;
float Port_Import_N068;
float Port_Import_N082;
float Port_Input0_N088;
float Port_Import_N076;
float Port_Import_N083;
float Port_Input1_N008;
float Port_Input2_N008;
float Port_Input0_N099;
float Port_Import_N077;
float Port_Import_N084;
float Port_Input1_N112;
float Port_Input2_N112;
float Port_Import_N087;
float Port_Import_N089;
float Port_Import_N116;
float Port_Input2_N136;
};
struct ssParticle
{
float3 Position;
float3 Velocity;
float4 Color;
float Size;
float Age;
float Life;
float Mass;
float3x3 Matrix;
bool Dead;
float4 Quaternion;
float SpawnIndex;
float SpawnIndexRemainder;
float NextBurstTime;
float SpawnOffset;
float Seed;
float2 Seed2000;
float TimeShift;
int Index1D;
int Index1DPerCopy;
float Index1DPerCopyF;
int StateID;
float Coord1D;
float Ratio1D;
float Ratio1DPerCopy;
int2 Index2D;
float2 Coord2D;
float2 Ratio2D;
float3 Force;
bool Spawned;
float CopyId;
float SpawnAmount;
float BurstAmount;
float BurstPeriod;
};
struct sc_Set0
{
texture2d<float> renderTarget0 [[id(1)]];
texture2d<float> renderTarget1 [[id(2)]];
texture2d<float> renderTarget2 [[id(3)]];
texture2d<float> renderTarget3 [[id(4)]];
sampler renderTarget0SmpSC [[id(22)]];
sampler renderTarget1SmpSC [[id(23)]];
sampler renderTarget2SmpSC [[id(24)]];
sampler renderTarget3SmpSC [[id(25)]];
constant userUniformsObj* UserUniforms [[id(35)]];
};
struct main_frag_out
{
float4 sc_FragData0 [[color(0)]];
float4 sc_FragData1 [[color(1)]];
float4 sc_FragData2 [[color(2)]];
float4 sc_FragData3 [[color(3)]];
};
struct main_frag_in
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float2 varShadowTex [[user(locn6)]];
int varStereoViewID [[user(locn7)]];
float varClipDistance [[user(locn8)]];
float4 varColor [[user(locn9)]];
int Interp_Particle_Index [[user(locn10)]];
float3 Interp_Particle_Force [[user(locn11)]];
float2 Interp_Particle_Coord [[user(locn12)]];
float Interp_Particle_SpawnIndex [[user(locn13)]];
float Interp_Particle_NextBurstTime [[user(locn14)]];
float3 Interp_Particle_Position [[user(locn15)]];
float3 Interp_Particle_Velocity [[user(locn16)]];
float Interp_Particle_Life [[user(locn17)]];
float Interp_Particle_Age [[user(locn18)]];
float Interp_Particle_Size [[user(locn19)]];
float4 Interp_Particle_Color [[user(locn20)]];
float4 Interp_Particle_Quaternion [[user(locn21)]];
};
fragment main_frag_out main_frag(main_frag_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]])
{
main_frag_out out={};
if ((sc_StereoRenderingMode_tmp==1)&&(sc_StereoRendering_IsClipDistanceEnabled_tmp==0))
{
if (in.varClipDistance<0.0)
{
discard_fragment();
}
}
float4 Data0=float4(0.0);
float4 Data1=float4(0.0);
float4 Data2=float4(0.0);
float4 Data3=float4(0.0);
ssParticle gParticle;
gParticle.Position=in.Interp_Particle_Position;
gParticle.Velocity=in.Interp_Particle_Velocity;
gParticle.Life=in.Interp_Particle_Life;
gParticle.Age=in.Interp_Particle_Age;
gParticle.Size=in.Interp_Particle_Size;
gParticle.Color=in.Interp_Particle_Color;
gParticle.Quaternion=in.Interp_Particle_Quaternion;
gParticle.SpawnIndex=in.Interp_Particle_SpawnIndex;
gParticle.NextBurstTime=in.Interp_Particle_NextBurstTime;
float2 param=in.Interp_Particle_Coord;
int l9_0=int(floor(param.x*4.0));
float4 l9_1=float4(0.0);
float l9_2=0.0;
float l9_3=0.0;
float l9_4=0.0;
float l9_5=0.0;
float l9_6=0.0;
float l9_7=0.0;
float l9_8=0.0;
float l9_9=0.0;
float l9_10=0.0;
float l9_11=0.0;
float l9_12=0.0;
float l9_13=0.0;
float l9_14=0.0;
float l9_15=0.0;
float l9_16=0.0;
float l9_17=0.0;
if (l9_0==0)
{
float l9_18=gParticle.Position.x;
float l9_19=-1000.0;
float l9_20=1000.0;
float l9_21=l9_18;
float l9_22=l9_19;
float l9_23=l9_20;
float l9_24=0.99998999;
float l9_25=fast::clamp(l9_21,l9_22,l9_23);
float l9_26=l9_22;
float l9_27=l9_23;
float l9_28=0.0;
float l9_29=l9_24;
float l9_30=l9_28+(((l9_25-l9_26)*(l9_29-l9_28))/(l9_27-l9_26));
float l9_31=l9_30;
float4 l9_32=float4(1.0,255.0,65025.0,16581375.0)*l9_31;
l9_32=fract(l9_32);
l9_32-=(l9_32.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_33=l9_32;
float4 l9_34=l9_33;
float4 l9_35=l9_34;
l9_1=l9_35;
l9_2=l9_1.x;
l9_3=l9_1.y;
l9_4=l9_1.z;
l9_5=l9_1.w;
float l9_36=gParticle.Position.y;
float l9_37=-1000.0;
float l9_38=1000.0;
float l9_39=l9_36;
float l9_40=l9_37;
float l9_41=l9_38;
float l9_42=0.99998999;
float l9_43=fast::clamp(l9_39,l9_40,l9_41);
float l9_44=l9_40;
float l9_45=l9_41;
float l9_46=0.0;
float l9_47=l9_42;
float l9_48=l9_46+(((l9_43-l9_44)*(l9_47-l9_46))/(l9_45-l9_44));
float l9_49=l9_48;
float4 l9_50=float4(1.0,255.0,65025.0,16581375.0)*l9_49;
l9_50=fract(l9_50);
l9_50-=(l9_50.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_51=l9_50;
float4 l9_52=l9_51;
float4 l9_53=l9_52;
l9_1=l9_53;
l9_6=l9_1.x;
l9_7=l9_1.y;
l9_8=l9_1.z;
l9_9=l9_1.w;
float l9_54=gParticle.Position.z;
float l9_55=-1000.0;
float l9_56=1000.0;
float l9_57=l9_54;
float l9_58=l9_55;
float l9_59=l9_56;
float l9_60=0.99998999;
float l9_61=fast::clamp(l9_57,l9_58,l9_59);
float l9_62=l9_58;
float l9_63=l9_59;
float l9_64=0.0;
float l9_65=l9_60;
float l9_66=l9_64+(((l9_61-l9_62)*(l9_65-l9_64))/(l9_63-l9_62));
float l9_67=l9_66;
float4 l9_68=float4(1.0,255.0,65025.0,16581375.0)*l9_67;
l9_68=fract(l9_68);
l9_68-=(l9_68.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_69=l9_68;
float4 l9_70=l9_69;
float4 l9_71=l9_70;
l9_1=l9_71;
l9_10=l9_1.x;
l9_11=l9_1.y;
l9_12=l9_1.z;
l9_13=l9_1.w;
float l9_72=gParticle.Velocity.x;
float l9_73=-1000.0;
float l9_74=1000.0;
float l9_75=l9_72;
float l9_76=l9_73;
float l9_77=l9_74;
float l9_78=0.99998999;
float l9_79=fast::clamp(l9_75,l9_76,l9_77);
float l9_80=l9_76;
float l9_81=l9_77;
float l9_82=0.0;
float l9_83=l9_78;
float l9_84=l9_82+(((l9_79-l9_80)*(l9_83-l9_82))/(l9_81-l9_80));
float l9_85=l9_84;
float4 l9_86=float4(1.0,255.0,65025.0,16581375.0)*l9_85;
l9_86=fract(l9_86);
l9_86-=(l9_86.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_87=l9_86;
float4 l9_88=l9_87;
float4 l9_89=l9_88;
l9_1=l9_89;
l9_14=l9_1.x;
l9_15=l9_1.y;
l9_16=l9_1.z;
l9_17=l9_1.w;
}
else
{
if (l9_0==1)
{
float l9_90=gParticle.Velocity.y;
float l9_91=-1000.0;
float l9_92=1000.0;
float l9_93=l9_90;
float l9_94=l9_91;
float l9_95=l9_92;
float l9_96=0.99998999;
float l9_97=fast::clamp(l9_93,l9_94,l9_95);
float l9_98=l9_94;
float l9_99=l9_95;
float l9_100=0.0;
float l9_101=l9_96;
float l9_102=l9_100+(((l9_97-l9_98)*(l9_101-l9_100))/(l9_99-l9_98));
float l9_103=l9_102;
float4 l9_104=float4(1.0,255.0,65025.0,16581375.0)*l9_103;
l9_104=fract(l9_104);
l9_104-=(l9_104.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_105=l9_104;
float4 l9_106=l9_105;
float4 l9_107=l9_106;
l9_1=l9_107;
l9_2=l9_1.x;
l9_3=l9_1.y;
l9_4=l9_1.z;
l9_5=l9_1.w;
float l9_108=gParticle.Velocity.z;
float l9_109=-1000.0;
float l9_110=1000.0;
float l9_111=l9_108;
float l9_112=l9_109;
float l9_113=l9_110;
float l9_114=0.99998999;
float l9_115=fast::clamp(l9_111,l9_112,l9_113);
float l9_116=l9_112;
float l9_117=l9_113;
float l9_118=0.0;
float l9_119=l9_114;
float l9_120=l9_118+(((l9_115-l9_116)*(l9_119-l9_118))/(l9_117-l9_116));
float l9_121=l9_120;
float4 l9_122=float4(1.0,255.0,65025.0,16581375.0)*l9_121;
l9_122=fract(l9_122);
l9_122-=(l9_122.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_123=l9_122;
float4 l9_124=l9_123;
float4 l9_125=l9_124;
l9_1=l9_125;
l9_6=l9_1.x;
l9_7=l9_1.y;
l9_8=l9_1.z;
l9_9=l9_1.w;
float l9_126=gParticle.Life;
float l9_127=0.0;
float l9_128=1.0;
float l9_129=l9_126;
float l9_130=l9_127;
float l9_131=l9_128;
float l9_132=0.99998999;
float l9_133=fast::clamp(l9_129,l9_130,l9_131);
float l9_134=l9_130;
float l9_135=l9_131;
float l9_136=0.0;
float l9_137=l9_132;
float l9_138=l9_136+(((l9_133-l9_134)*(l9_137-l9_136))/(l9_135-l9_134));
float l9_139=l9_138;
float4 l9_140=float4(1.0,255.0,65025.0,16581375.0)*l9_139;
l9_140=fract(l9_140);
l9_140-=(l9_140.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_141=l9_140;
float4 l9_142=l9_141;
float4 l9_143=l9_142;
l9_1=l9_143;
l9_10=l9_1.x;
l9_11=l9_1.y;
l9_12=l9_1.z;
l9_13=l9_1.w;
float l9_144=gParticle.Age;
float l9_145=0.0;
float l9_146=1.0;
float l9_147=l9_144;
float l9_148=l9_145;
float l9_149=l9_146;
float l9_150=0.99998999;
float l9_151=fast::clamp(l9_147,l9_148,l9_149);
float l9_152=l9_148;
float l9_153=l9_149;
float l9_154=0.0;
float l9_155=l9_150;
float l9_156=l9_154+(((l9_151-l9_152)*(l9_155-l9_154))/(l9_153-l9_152));
float l9_157=l9_156;
float4 l9_158=float4(1.0,255.0,65025.0,16581375.0)*l9_157;
l9_158=fract(l9_158);
l9_158-=(l9_158.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_159=l9_158;
float4 l9_160=l9_159;
float4 l9_161=l9_160;
l9_1=l9_161;
l9_14=l9_1.x;
l9_15=l9_1.y;
l9_16=l9_1.z;
l9_17=l9_1.w;
}
else
{
if (l9_0==2)
{
float l9_162=gParticle.Size;
float l9_163=0.0;
float l9_164=100.0;
float l9_165=l9_162;
float l9_166=l9_163;
float l9_167=l9_164;
float l9_168=0.99998999;
float l9_169=fast::clamp(l9_165,l9_166,l9_167);
float l9_170=l9_166;
float l9_171=l9_167;
float l9_172=0.0;
float l9_173=l9_168;
float l9_174=l9_172+(((l9_169-l9_170)*(l9_173-l9_172))/(l9_171-l9_170));
float l9_175=l9_174;
float4 l9_176=float4(1.0,255.0,65025.0,16581375.0)*l9_175;
l9_176=fract(l9_176);
l9_176-=(l9_176.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_177=l9_176;
float4 l9_178=l9_177;
float4 l9_179=l9_178;
l9_1=l9_179;
l9_2=l9_1.x;
l9_3=l9_1.y;
l9_4=l9_1.z;
l9_5=l9_1.w;
float l9_180=gParticle.Color.x;
float l9_181=0.0;
float l9_182=1.00001;
float l9_183=l9_180;
float l9_184=l9_181;
float l9_185=l9_182;
float l9_186=0.99998999;
float l9_187=fast::clamp(l9_183,l9_184,l9_185);
float l9_188=l9_184;
float l9_189=l9_185;
float l9_190=0.0;
float l9_191=l9_186;
float l9_192=l9_190+(((l9_187-l9_188)*(l9_191-l9_190))/(l9_189-l9_188));
float l9_193=l9_192;
float4 l9_194=float4(1.0,255.0,65025.0,16581375.0)*l9_193;
l9_194=fract(l9_194);
l9_194-=(l9_194.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_195=l9_194;
float4 l9_196=l9_195;
float4 l9_197=l9_196;
l9_1=l9_197;
l9_6=l9_1.x;
l9_7=l9_1.y;
l9_8=l9_1.z;
l9_9=l9_1.w;
float l9_198=gParticle.Color.y;
float l9_199=0.0;
float l9_200=1.00001;
float l9_201=l9_198;
float l9_202=l9_199;
float l9_203=l9_200;
float l9_204=0.99998999;
float l9_205=fast::clamp(l9_201,l9_202,l9_203);
float l9_206=l9_202;
float l9_207=l9_203;
float l9_208=0.0;
float l9_209=l9_204;
float l9_210=l9_208+(((l9_205-l9_206)*(l9_209-l9_208))/(l9_207-l9_206));
float l9_211=l9_210;
float4 l9_212=float4(1.0,255.0,65025.0,16581375.0)*l9_211;
l9_212=fract(l9_212);
l9_212-=(l9_212.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_213=l9_212;
float4 l9_214=l9_213;
float4 l9_215=l9_214;
l9_1=l9_215;
l9_10=l9_1.x;
l9_11=l9_1.y;
l9_12=l9_1.z;
l9_13=l9_1.w;
float l9_216=gParticle.Color.z;
float l9_217=0.0;
float l9_218=1.00001;
float l9_219=l9_216;
float l9_220=l9_217;
float l9_221=l9_218;
float l9_222=0.99998999;
float l9_223=fast::clamp(l9_219,l9_220,l9_221);
float l9_224=l9_220;
float l9_225=l9_221;
float l9_226=0.0;
float l9_227=l9_222;
float l9_228=l9_226+(((l9_223-l9_224)*(l9_227-l9_226))/(l9_225-l9_224));
float l9_229=l9_228;
float4 l9_230=float4(1.0,255.0,65025.0,16581375.0)*l9_229;
l9_230=fract(l9_230);
l9_230-=(l9_230.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_231=l9_230;
float4 l9_232=l9_231;
float4 l9_233=l9_232;
l9_1=l9_233;
l9_14=l9_1.x;
l9_15=l9_1.y;
l9_16=l9_1.z;
l9_17=l9_1.w;
}
else
{
if (l9_0==3)
{
float l9_234=gParticle.Color.w;
float l9_235=0.0;
float l9_236=1.00001;
float l9_237=l9_234;
float l9_238=l9_235;
float l9_239=l9_236;
float l9_240=0.99998999;
float l9_241=fast::clamp(l9_237,l9_238,l9_239);
float l9_242=l9_238;
float l9_243=l9_239;
float l9_244=0.0;
float l9_245=l9_240;
float l9_246=l9_244+(((l9_241-l9_242)*(l9_245-l9_244))/(l9_243-l9_242));
float l9_247=l9_246;
float4 l9_248=float4(1.0,255.0,65025.0,16581375.0)*l9_247;
l9_248=fract(l9_248);
l9_248-=(l9_248.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_249=l9_248;
float4 l9_250=l9_249;
float4 l9_251=l9_250;
l9_1=l9_251;
l9_2=l9_1.x;
l9_3=l9_1.y;
l9_4=l9_1.z;
l9_5=l9_1.w;
float l9_252=gParticle.Quaternion.x;
float l9_253=-1.0;
float l9_254=1.0;
float l9_255=l9_252;
float l9_256=l9_253;
float l9_257=l9_254;
float l9_258=0.99998999;
float l9_259=fast::clamp(l9_255,l9_256,l9_257);
float l9_260=l9_256;
float l9_261=l9_257;
float l9_262=0.0;
float l9_263=l9_258;
float l9_264=l9_262+(((l9_259-l9_260)*(l9_263-l9_262))/(l9_261-l9_260));
float l9_265=l9_264;
float4 l9_266=float4(1.0,255.0,65025.0,16581375.0)*l9_265;
l9_266=fract(l9_266);
l9_266-=(l9_266.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float2 l9_267=l9_266.xy;
float2 l9_268=l9_267;
float2 l9_269=l9_268;
l9_1=float4(l9_269.x,l9_269.y,l9_1.z,l9_1.w);
l9_6=l9_1.x;
l9_7=l9_1.y;
float l9_270=gParticle.Quaternion.y;
float l9_271=-1.0;
float l9_272=1.0;
float l9_273=l9_270;
float l9_274=l9_271;
float l9_275=l9_272;
float l9_276=0.99998999;
float l9_277=fast::clamp(l9_273,l9_274,l9_275);
float l9_278=l9_274;
float l9_279=l9_275;
float l9_280=0.0;
float l9_281=l9_276;
float l9_282=l9_280+(((l9_277-l9_278)*(l9_281-l9_280))/(l9_279-l9_278));
float l9_283=l9_282;
float4 l9_284=float4(1.0,255.0,65025.0,16581375.0)*l9_283;
l9_284=fract(l9_284);
l9_284-=(l9_284.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float2 l9_285=l9_284.xy;
float2 l9_286=l9_285;
float2 l9_287=l9_286;
l9_1=float4(l9_287.x,l9_287.y,l9_1.z,l9_1.w);
l9_8=l9_1.x;
l9_9=l9_1.y;
float l9_288=gParticle.Quaternion.z;
float l9_289=-1.0;
float l9_290=1.0;
float l9_291=l9_288;
float l9_292=l9_289;
float l9_293=l9_290;
float l9_294=0.99998999;
float l9_295=fast::clamp(l9_291,l9_292,l9_293);
float l9_296=l9_292;
float l9_297=l9_293;
float l9_298=0.0;
float l9_299=l9_294;
float l9_300=l9_298+(((l9_295-l9_296)*(l9_299-l9_298))/(l9_297-l9_296));
float l9_301=l9_300;
float4 l9_302=float4(1.0,255.0,65025.0,16581375.0)*l9_301;
l9_302=fract(l9_302);
l9_302-=(l9_302.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float2 l9_303=l9_302.xy;
float2 l9_304=l9_303;
float2 l9_305=l9_304;
l9_1=float4(l9_305.x,l9_305.y,l9_1.z,l9_1.w);
l9_10=l9_1.x;
l9_11=l9_1.y;
float l9_306=gParticle.Quaternion.w;
float l9_307=-1.0;
float l9_308=1.0;
float l9_309=l9_306;
float l9_310=l9_307;
float l9_311=l9_308;
float l9_312=0.99998999;
float l9_313=fast::clamp(l9_309,l9_310,l9_311);
float l9_314=l9_310;
float l9_315=l9_311;
float l9_316=0.0;
float l9_317=l9_312;
float l9_318=l9_316+(((l9_313-l9_314)*(l9_317-l9_316))/(l9_315-l9_314));
float l9_319=l9_318;
float4 l9_320=float4(1.0,255.0,65025.0,16581375.0)*l9_319;
l9_320=fract(l9_320);
l9_320-=(l9_320.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float2 l9_321=l9_320.xy;
float2 l9_322=l9_321;
float2 l9_323=l9_322;
l9_1=float4(l9_323.x,l9_323.y,l9_1.z,l9_1.w);
l9_12=l9_1.x;
l9_13=l9_1.y;
}
}
}
}
float4 param_1=float4(l9_2,l9_3,l9_4,l9_5);
float4 param_2=float4(l9_6,l9_7,l9_8,l9_9);
float4 param_3=float4(l9_10,l9_11,l9_12,l9_13);
float4 param_4=float4(l9_14,l9_15,l9_16,l9_17);
Data0=param_1;
Data1=param_2;
Data2=param_3;
Data3=param_4;
if (dot(((Data0+Data1)+Data2)+Data3,float4(0.23454))==0.34231836)
{
Data0+=float4(1e-06);
}
float4 param_5=Data0;
if (sc_ShaderCacheConstant_tmp!=0)
{
param_5.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=param_5;
float4 param_6=Data1;
out.sc_FragData1=param_6;
float4 param_7=Data2;
out.sc_FragData2=param_7;
float4 param_8=Data3;
out.sc_FragData3=param_8;
return out;
}
} // FRAGMENT SHADER
