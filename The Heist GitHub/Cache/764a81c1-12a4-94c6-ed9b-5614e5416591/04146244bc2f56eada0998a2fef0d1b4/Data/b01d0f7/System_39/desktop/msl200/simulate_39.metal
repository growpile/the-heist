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
//ubo int UserUniforms 0:35:7728 {
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
//float3 Port_Import_N143 7408
//float3 Port_Import_N145 7424
//float Port_Multiplier_N012 7440
//float Port_Import_N285 7444
//float3 Port_Import_N284 7456
//float3 Port_Import_N071 7472
//float3 Port_Import_N024 7488
//float3 Port_Import_N318 7504
//float Port_Multiplier_N319 7520
//float3 Port_Import_N322 7536
//float2 Port_Input1_N326 7552
//float2 Port_Scale_N327 7560
//float2 Port_Input1_N329 7568
//float2 Port_Scale_N330 7576
//float2 Port_Input1_N332 7584
//float2 Port_Scale_N333 7592
//float3 Port_Input1_N335 7600
//float Port_Import_N075 7616
//float Port_Min_N002 7620
//float Port_Max_N002 7624
//float Port_Input0_N088 7636
//float Port_Import_N076 7640
//float Port_Input1_N008 7648
//float Port_Input2_N008 7652
//float Port_Input0_N099 7656
//float Port_Import_N077 7660
//float Port_Input1_N112 7668
//float Port_Input2_N112 7672
//float Port_Import_N087 7676
//float Port_Import_N089 7680
//float Port_Import_N116 7684
//float Port_Input2_N136 7688
//float3 Port_Import_N161 7696
//float Port_Min_N159 7712
//float Port_Max_N159 7716
//float Port_Multiplier_N153 7724
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
float3 Port_Import_N143;
float3 Port_Import_N145;
float Port_Multiplier_N012;
float Port_Import_N285;
float3 Port_Import_N284;
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
float Port_Min_N002;
float Port_Max_N002;
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
float3 Port_Import_N161;
float Port_Min_N159;
float Port_Max_N159;
float Port_Import_N163;
float Port_Multiplier_N153;
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
// Implementation of the GLSL radians() function
template<typename T>
T radians(T d)
{
return d*T(0.01745329251);
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
param.CopyId=float(param_1/360);
param.SpawnIndex=-1.0;
param.SpawnIndexRemainder=-1.0;
param.SpawnAmount=0.0;
param.BurstAmount=0.0;
param.BurstPeriod=0.0;
param.NextBurstTime=0.0;
gParticle=param;
int param_2=InstanceID;
ssParticle param_3=gParticle;
int l9_0=param_2/360;
param_3.Spawned=false;
param_3.Dead=false;
param_3.Force=float3(0.0);
param_3.Index1D=param_2;
param_3.Index1DPerCopy=param_2%360;
param_3.Index1DPerCopyF=float(param_3.Index1DPerCopy);
param_3.StateID=(360*((param_2/360)+1))-1;
int l9_1=param_3.Index1D;
int2 l9_2=int2(l9_1%360,l9_1/360);
param_3.Index2D=l9_2;
int l9_3=param_3.Index1D;
float l9_4=(float(l9_3)+0.5)/360.0;
param_3.Coord1D=l9_4;
int2 l9_5=param_3.Index2D;
float2 l9_6=(float2(l9_5)+float2(0.5))/float2(360.0,1.0);
param_3.Coord2D=l9_6;
int l9_7=param_3.Index1D;
float l9_8=float(l9_7)/359.0;
param_3.Ratio1D=l9_8;
int l9_9=param_3.Index1DPerCopy;
float l9_10=float(l9_9)/359.0;
param_3.Ratio1DPerCopy=l9_10;
int2 l9_11=param_3.Index2D;
float2 l9_12=float2(l9_11)/float2(359.0,1.0);
param_3.Ratio2D=l9_12;
param_3.Seed=0.0;
int l9_13=param_3.Index1D;
int l9_14=l9_13;
int l9_15=((l9_14*((l9_14*1471343)+101146501))+1559861749)&2147483647;
int l9_16=l9_15;
float l9_17=float(l9_16)*4.6566129e-10;
float l9_18=l9_17;
param_3.TimeShift=l9_18;
param_3.SpawnOffset=param_3.Ratio1D*4.0;
ssParticle l9_19=param_3;
int l9_20=l9_0;
float l9_21;
if (UserUniforms.overrideTimeEnabled==1)
{
l9_21=UserUniforms.overrideTimeElapsed[l9_20];
}
else
{
l9_21=UserUniforms.sc_Time.x;
}
float l9_22=l9_21;
l9_19.Seed=(l9_19.Ratio1D*0.97637898)+0.151235;
l9_19.Seed+=(floor(((((l9_22-l9_19.SpawnOffset)-0.0)+0.0)+8.0)/4.0)*4.32723);
l9_19.Seed=fract(abs(l9_19.Seed));
int2 l9_23=int2(l9_19.Index1D%400,l9_19.Index1D/400);
l9_19.Seed2000=(float2(l9_23)+float2(1.0))/float2(399.0);
param_3=l9_19;
gParticle=param_3;
int offsetPixelId=(UserUniforms.vfxOffsetInstancesRead+InstanceID)*4;
int param_4=offsetPixelId;
int param_5=UserUniforms.vfxTargetWidth;
int l9_24=param_4-((param_4/param_5)*param_5);
int2 Index2D=int2(l9_24,offsetPixelId/UserUniforms.vfxTargetWidth);
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
float2 l9_25=param_6;
int l9_26;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_27=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_27=0;
}
else
{
l9_27=gl_InstanceIndex%2;
}
int l9_28=l9_27;
l9_26=1-l9_28;
}
else
{
int l9_29=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_29=0;
}
else
{
l9_29=gl_InstanceIndex%2;
}
int l9_30=l9_29;
l9_26=l9_30;
}
int l9_31=l9_26;
float2 l9_32=l9_25;
int l9_33=renderTarget0Layout_tmp;
int l9_34=l9_31;
float2 l9_35=l9_32;
int l9_36=l9_33;
int l9_37=l9_34;
float3 l9_38=float3(0.0);
if (l9_36==0)
{
l9_38=float3(l9_35,0.0);
}
else
{
if (l9_36==1)
{
l9_38=float3(l9_35.x,(l9_35.y*0.5)+(0.5-(float(l9_37)*0.5)),0.0);
}
else
{
l9_38=float3(l9_35,float(l9_37));
}
}
float3 l9_39=l9_38;
float3 l9_40=l9_39;
float4 l9_41=renderTarget0.sample(renderTarget0SmpSC,l9_40.xy,level(0.0));
float4 l9_42=l9_41;
float4 l9_43=l9_42;
float4 renderTarget0Sample=l9_43;
float4 l9_44=renderTarget0Sample;
bool l9_45=dot(abs(l9_44),float4(1.0))<9.9999997e-06;
bool l9_46;
if (!l9_45)
{
int l9_47=gl_InstanceIndex;
l9_46=!(UserUniforms.vfxBatchEnable[l9_47/360]!=0);
}
else
{
l9_46=l9_45;
}
if (l9_46)
{
return false;
}
Scalar0=renderTarget0Sample.x;
Scalar1=renderTarget0Sample.y;
Scalar2=renderTarget0Sample.z;
Scalar3=renderTarget0Sample.w;
float2 param_7=uv;
float2 l9_48=param_7;
int l9_49;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_50=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_50=0;
}
else
{
l9_50=gl_InstanceIndex%2;
}
int l9_51=l9_50;
l9_49=1-l9_51;
}
else
{
int l9_52=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_52=0;
}
else
{
l9_52=gl_InstanceIndex%2;
}
int l9_53=l9_52;
l9_49=l9_53;
}
int l9_54=l9_49;
float2 l9_55=l9_48;
int l9_56=renderTarget1Layout_tmp;
int l9_57=l9_54;
float2 l9_58=l9_55;
int l9_59=l9_56;
int l9_60=l9_57;
float3 l9_61=float3(0.0);
if (l9_59==0)
{
l9_61=float3(l9_58,0.0);
}
else
{
if (l9_59==1)
{
l9_61=float3(l9_58.x,(l9_58.y*0.5)+(0.5-(float(l9_60)*0.5)),0.0);
}
else
{
l9_61=float3(l9_58,float(l9_60));
}
}
float3 l9_62=l9_61;
float3 l9_63=l9_62;
float4 l9_64=renderTarget1.sample(renderTarget1SmpSC,l9_63.xy,level(0.0));
float4 l9_65=l9_64;
float4 l9_66=l9_65;
float4 renderTarget1Sample=l9_66;
Scalar4=renderTarget1Sample.x;
Scalar5=renderTarget1Sample.y;
Scalar6=renderTarget1Sample.z;
Scalar7=renderTarget1Sample.w;
float2 param_8=uv;
float2 l9_67=param_8;
int l9_68;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_69=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_69=0;
}
else
{
l9_69=gl_InstanceIndex%2;
}
int l9_70=l9_69;
l9_68=1-l9_70;
}
else
{
int l9_71=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_71=0;
}
else
{
l9_71=gl_InstanceIndex%2;
}
int l9_72=l9_71;
l9_68=l9_72;
}
int l9_73=l9_68;
float2 l9_74=l9_67;
int l9_75=renderTarget2Layout_tmp;
int l9_76=l9_73;
float2 l9_77=l9_74;
int l9_78=l9_75;
int l9_79=l9_76;
float3 l9_80=float3(0.0);
if (l9_78==0)
{
l9_80=float3(l9_77,0.0);
}
else
{
if (l9_78==1)
{
l9_80=float3(l9_77.x,(l9_77.y*0.5)+(0.5-(float(l9_79)*0.5)),0.0);
}
else
{
l9_80=float3(l9_77,float(l9_79));
}
}
float3 l9_81=l9_80;
float3 l9_82=l9_81;
float4 l9_83=renderTarget2.sample(renderTarget2SmpSC,l9_82.xy,level(0.0));
float4 l9_84=l9_83;
float4 l9_85=l9_84;
float4 renderTarget2Sample=l9_85;
Scalar8=renderTarget2Sample.x;
Scalar9=renderTarget2Sample.y;
Scalar10=renderTarget2Sample.z;
Scalar11=renderTarget2Sample.w;
float2 param_9=uv;
float2 l9_86=param_9;
int l9_87;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_88=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_88=0;
}
else
{
l9_88=gl_InstanceIndex%2;
}
int l9_89=l9_88;
l9_87=1-l9_89;
}
else
{
int l9_90=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_90=0;
}
else
{
l9_90=gl_InstanceIndex%2;
}
int l9_91=l9_90;
l9_87=l9_91;
}
int l9_92=l9_87;
float2 l9_93=l9_86;
int l9_94=renderTarget3Layout_tmp;
int l9_95=l9_92;
float2 l9_96=l9_93;
int l9_97=l9_94;
int l9_98=l9_95;
float3 l9_99=float3(0.0);
if (l9_97==0)
{
l9_99=float3(l9_96,0.0);
}
else
{
if (l9_97==1)
{
l9_99=float3(l9_96.x,(l9_96.y*0.5)+(0.5-(float(l9_98)*0.5)),0.0);
}
else
{
l9_99=float3(l9_96,float(l9_98));
}
}
float3 l9_100=l9_99;
float3 l9_101=l9_100;
float4 l9_102=renderTarget3.sample(renderTarget3SmpSC,l9_101.xy,level(0.0));
float4 l9_103=l9_102;
float4 l9_104=l9_103;
float4 renderTarget3Sample=l9_104;
Scalar12=renderTarget3Sample.x;
Scalar13=renderTarget3Sample.y;
Scalar14=renderTarget3Sample.z;
Scalar15=renderTarget3Sample.w;
float4 param_10=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_11=-1000.0;
float param_12=1000.0;
float4 l9_105=param_10;
float l9_106=param_11;
float l9_107=param_12;
float l9_108=0.99998999;
float4 l9_109=l9_105;
#if (1)
{
l9_109=floor((l9_109*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_110=dot(l9_109,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_111=l9_110;
float l9_112=0.0;
float l9_113=l9_108;
float l9_114=l9_106;
float l9_115=l9_107;
float l9_116=l9_114+(((l9_111-l9_112)*(l9_115-l9_114))/(l9_113-l9_112));
float l9_117=l9_116;
float l9_118=l9_117;
gParticle.Position.x=l9_118;
float4 param_13=float4(Scalar4,Scalar5,Scalar6,Scalar7);
float param_14=-1000.0;
float param_15=1000.0;
float4 l9_119=param_13;
float l9_120=param_14;
float l9_121=param_15;
float l9_122=0.99998999;
float4 l9_123=l9_119;
#if (1)
{
l9_123=floor((l9_123*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_124=dot(l9_123,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_125=l9_124;
float l9_126=0.0;
float l9_127=l9_122;
float l9_128=l9_120;
float l9_129=l9_121;
float l9_130=l9_128+(((l9_125-l9_126)*(l9_129-l9_128))/(l9_127-l9_126));
float l9_131=l9_130;
float l9_132=l9_131;
gParticle.Position.y=l9_132;
float4 param_16=float4(Scalar8,Scalar9,Scalar10,Scalar11);
float param_17=-1000.0;
float param_18=1000.0;
float4 l9_133=param_16;
float l9_134=param_17;
float l9_135=param_18;
float l9_136=0.99998999;
float4 l9_137=l9_133;
#if (1)
{
l9_137=floor((l9_137*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_138=dot(l9_137,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_139=l9_138;
float l9_140=0.0;
float l9_141=l9_136;
float l9_142=l9_134;
float l9_143=l9_135;
float l9_144=l9_142+(((l9_139-l9_140)*(l9_143-l9_142))/(l9_141-l9_140));
float l9_145=l9_144;
float l9_146=l9_145;
gParticle.Position.z=l9_146;
float4 param_19=float4(Scalar12,Scalar13,Scalar14,Scalar15);
float param_20=-1000.0;
float param_21=1000.0;
float4 l9_147=param_19;
float l9_148=param_20;
float l9_149=param_21;
float l9_150=0.99998999;
float4 l9_151=l9_147;
#if (1)
{
l9_151=floor((l9_151*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_152=dot(l9_151,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_153=l9_152;
float l9_154=0.0;
float l9_155=l9_150;
float l9_156=l9_148;
float l9_157=l9_149;
float l9_158=l9_156+(((l9_153-l9_154)*(l9_157-l9_156))/(l9_155-l9_154));
float l9_159=l9_158;
float l9_160=l9_159;
gParticle.Velocity.x=l9_160;
uv=Coord+(Offset*1.0);
float2 param_22=uv;
float2 l9_161=param_22;
int l9_162;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_163=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_163=0;
}
else
{
l9_163=gl_InstanceIndex%2;
}
int l9_164=l9_163;
l9_162=1-l9_164;
}
else
{
int l9_165=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_165=0;
}
else
{
l9_165=gl_InstanceIndex%2;
}
int l9_166=l9_165;
l9_162=l9_166;
}
int l9_167=l9_162;
float2 l9_168=l9_161;
int l9_169=renderTarget0Layout_tmp;
int l9_170=l9_167;
float2 l9_171=l9_168;
int l9_172=l9_169;
int l9_173=l9_170;
float3 l9_174=float3(0.0);
if (l9_172==0)
{
l9_174=float3(l9_171,0.0);
}
else
{
if (l9_172==1)
{
l9_174=float3(l9_171.x,(l9_171.y*0.5)+(0.5-(float(l9_173)*0.5)),0.0);
}
else
{
l9_174=float3(l9_171,float(l9_173));
}
}
float3 l9_175=l9_174;
float3 l9_176=l9_175;
float4 l9_177=renderTarget0.sample(renderTarget0SmpSC,l9_176.xy,level(0.0));
float4 l9_178=l9_177;
float4 l9_179=l9_178;
float4 renderTarget0Sample_1=l9_179;
Scalar0=renderTarget0Sample_1.x;
Scalar1=renderTarget0Sample_1.y;
Scalar2=renderTarget0Sample_1.z;
Scalar3=renderTarget0Sample_1.w;
float2 param_23=uv;
float2 l9_180=param_23;
int l9_181;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_182=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_182=0;
}
else
{
l9_182=gl_InstanceIndex%2;
}
int l9_183=l9_182;
l9_181=1-l9_183;
}
else
{
int l9_184=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_184=0;
}
else
{
l9_184=gl_InstanceIndex%2;
}
int l9_185=l9_184;
l9_181=l9_185;
}
int l9_186=l9_181;
float2 l9_187=l9_180;
int l9_188=renderTarget1Layout_tmp;
int l9_189=l9_186;
float2 l9_190=l9_187;
int l9_191=l9_188;
int l9_192=l9_189;
float3 l9_193=float3(0.0);
if (l9_191==0)
{
l9_193=float3(l9_190,0.0);
}
else
{
if (l9_191==1)
{
l9_193=float3(l9_190.x,(l9_190.y*0.5)+(0.5-(float(l9_192)*0.5)),0.0);
}
else
{
l9_193=float3(l9_190,float(l9_192));
}
}
float3 l9_194=l9_193;
float3 l9_195=l9_194;
float4 l9_196=renderTarget1.sample(renderTarget1SmpSC,l9_195.xy,level(0.0));
float4 l9_197=l9_196;
float4 l9_198=l9_197;
float4 renderTarget1Sample_1=l9_198;
Scalar4=renderTarget1Sample_1.x;
Scalar5=renderTarget1Sample_1.y;
Scalar6=renderTarget1Sample_1.z;
Scalar7=renderTarget1Sample_1.w;
float2 param_24=uv;
float2 l9_199=param_24;
int l9_200;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_201=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_201=0;
}
else
{
l9_201=gl_InstanceIndex%2;
}
int l9_202=l9_201;
l9_200=1-l9_202;
}
else
{
int l9_203=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_203=0;
}
else
{
l9_203=gl_InstanceIndex%2;
}
int l9_204=l9_203;
l9_200=l9_204;
}
int l9_205=l9_200;
float2 l9_206=l9_199;
int l9_207=renderTarget2Layout_tmp;
int l9_208=l9_205;
float2 l9_209=l9_206;
int l9_210=l9_207;
int l9_211=l9_208;
float3 l9_212=float3(0.0);
if (l9_210==0)
{
l9_212=float3(l9_209,0.0);
}
else
{
if (l9_210==1)
{
l9_212=float3(l9_209.x,(l9_209.y*0.5)+(0.5-(float(l9_211)*0.5)),0.0);
}
else
{
l9_212=float3(l9_209,float(l9_211));
}
}
float3 l9_213=l9_212;
float3 l9_214=l9_213;
float4 l9_215=renderTarget2.sample(renderTarget2SmpSC,l9_214.xy,level(0.0));
float4 l9_216=l9_215;
float4 l9_217=l9_216;
float4 renderTarget2Sample_1=l9_217;
Scalar8=renderTarget2Sample_1.x;
Scalar9=renderTarget2Sample_1.y;
Scalar10=renderTarget2Sample_1.z;
Scalar11=renderTarget2Sample_1.w;
float2 param_25=uv;
float2 l9_218=param_25;
int l9_219;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_220=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_220=0;
}
else
{
l9_220=gl_InstanceIndex%2;
}
int l9_221=l9_220;
l9_219=1-l9_221;
}
else
{
int l9_222=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_222=0;
}
else
{
l9_222=gl_InstanceIndex%2;
}
int l9_223=l9_222;
l9_219=l9_223;
}
int l9_224=l9_219;
float2 l9_225=l9_218;
int l9_226=renderTarget3Layout_tmp;
int l9_227=l9_224;
float2 l9_228=l9_225;
int l9_229=l9_226;
int l9_230=l9_227;
float3 l9_231=float3(0.0);
if (l9_229==0)
{
l9_231=float3(l9_228,0.0);
}
else
{
if (l9_229==1)
{
l9_231=float3(l9_228.x,(l9_228.y*0.5)+(0.5-(float(l9_230)*0.5)),0.0);
}
else
{
l9_231=float3(l9_228,float(l9_230));
}
}
float3 l9_232=l9_231;
float3 l9_233=l9_232;
float4 l9_234=renderTarget3.sample(renderTarget3SmpSC,l9_233.xy,level(0.0));
float4 l9_235=l9_234;
float4 l9_236=l9_235;
float4 renderTarget3Sample_1=l9_236;
Scalar12=renderTarget3Sample_1.x;
Scalar13=renderTarget3Sample_1.y;
Scalar14=renderTarget3Sample_1.z;
Scalar15=renderTarget3Sample_1.w;
float4 param_26=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_27=-1000.0;
float param_28=1000.0;
float4 l9_237=param_26;
float l9_238=param_27;
float l9_239=param_28;
float l9_240=0.99998999;
float4 l9_241=l9_237;
#if (1)
{
l9_241=floor((l9_241*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_242=dot(l9_241,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_243=l9_242;
float l9_244=0.0;
float l9_245=l9_240;
float l9_246=l9_238;
float l9_247=l9_239;
float l9_248=l9_246+(((l9_243-l9_244)*(l9_247-l9_246))/(l9_245-l9_244));
float l9_249=l9_248;
float l9_250=l9_249;
gParticle.Velocity.y=l9_250;
float4 param_29=float4(Scalar4,Scalar5,Scalar6,Scalar7);
float param_30=-1000.0;
float param_31=1000.0;
float4 l9_251=param_29;
float l9_252=param_30;
float l9_253=param_31;
float l9_254=0.99998999;
float4 l9_255=l9_251;
#if (1)
{
l9_255=floor((l9_255*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_256=dot(l9_255,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_257=l9_256;
float l9_258=0.0;
float l9_259=l9_254;
float l9_260=l9_252;
float l9_261=l9_253;
float l9_262=l9_260+(((l9_257-l9_258)*(l9_261-l9_260))/(l9_259-l9_258));
float l9_263=l9_262;
float l9_264=l9_263;
gParticle.Velocity.z=l9_264;
float4 param_32=float4(Scalar8,Scalar9,Scalar10,Scalar11);
float param_33=0.0;
float param_34=4.0;
float4 l9_265=param_32;
float l9_266=param_33;
float l9_267=param_34;
float l9_268=0.99998999;
float4 l9_269=l9_265;
#if (1)
{
l9_269=floor((l9_269*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_270=dot(l9_269,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_271=l9_270;
float l9_272=0.0;
float l9_273=l9_268;
float l9_274=l9_266;
float l9_275=l9_267;
float l9_276=l9_274+(((l9_271-l9_272)*(l9_275-l9_274))/(l9_273-l9_272));
float l9_277=l9_276;
float l9_278=l9_277;
gParticle.Life=l9_278;
float4 param_35=float4(Scalar12,Scalar13,Scalar14,Scalar15);
float param_36=0.0;
float param_37=4.0;
float4 l9_279=param_35;
float l9_280=param_36;
float l9_281=param_37;
float l9_282=0.99998999;
float4 l9_283=l9_279;
#if (1)
{
l9_283=floor((l9_283*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_284=dot(l9_283,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_285=l9_284;
float l9_286=0.0;
float l9_287=l9_282;
float l9_288=l9_280;
float l9_289=l9_281;
float l9_290=l9_288+(((l9_285-l9_286)*(l9_289-l9_288))/(l9_287-l9_286));
float l9_291=l9_290;
float l9_292=l9_291;
gParticle.Age=l9_292;
uv=Coord+(Offset*2.0);
float2 param_38=uv;
float2 l9_293=param_38;
int l9_294;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_295=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_295=0;
}
else
{
l9_295=gl_InstanceIndex%2;
}
int l9_296=l9_295;
l9_294=1-l9_296;
}
else
{
int l9_297=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_297=0;
}
else
{
l9_297=gl_InstanceIndex%2;
}
int l9_298=l9_297;
l9_294=l9_298;
}
int l9_299=l9_294;
float2 l9_300=l9_293;
int l9_301=renderTarget0Layout_tmp;
int l9_302=l9_299;
float2 l9_303=l9_300;
int l9_304=l9_301;
int l9_305=l9_302;
float3 l9_306=float3(0.0);
if (l9_304==0)
{
l9_306=float3(l9_303,0.0);
}
else
{
if (l9_304==1)
{
l9_306=float3(l9_303.x,(l9_303.y*0.5)+(0.5-(float(l9_305)*0.5)),0.0);
}
else
{
l9_306=float3(l9_303,float(l9_305));
}
}
float3 l9_307=l9_306;
float3 l9_308=l9_307;
float4 l9_309=renderTarget0.sample(renderTarget0SmpSC,l9_308.xy,level(0.0));
float4 l9_310=l9_309;
float4 l9_311=l9_310;
float4 renderTarget0Sample_2=l9_311;
Scalar0=renderTarget0Sample_2.x;
Scalar1=renderTarget0Sample_2.y;
Scalar2=renderTarget0Sample_2.z;
Scalar3=renderTarget0Sample_2.w;
float2 param_39=uv;
float2 l9_312=param_39;
int l9_313;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_314=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_314=0;
}
else
{
l9_314=gl_InstanceIndex%2;
}
int l9_315=l9_314;
l9_313=1-l9_315;
}
else
{
int l9_316=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_316=0;
}
else
{
l9_316=gl_InstanceIndex%2;
}
int l9_317=l9_316;
l9_313=l9_317;
}
int l9_318=l9_313;
float2 l9_319=l9_312;
int l9_320=renderTarget1Layout_tmp;
int l9_321=l9_318;
float2 l9_322=l9_319;
int l9_323=l9_320;
int l9_324=l9_321;
float3 l9_325=float3(0.0);
if (l9_323==0)
{
l9_325=float3(l9_322,0.0);
}
else
{
if (l9_323==1)
{
l9_325=float3(l9_322.x,(l9_322.y*0.5)+(0.5-(float(l9_324)*0.5)),0.0);
}
else
{
l9_325=float3(l9_322,float(l9_324));
}
}
float3 l9_326=l9_325;
float3 l9_327=l9_326;
float4 l9_328=renderTarget1.sample(renderTarget1SmpSC,l9_327.xy,level(0.0));
float4 l9_329=l9_328;
float4 l9_330=l9_329;
float4 renderTarget1Sample_2=l9_330;
Scalar4=renderTarget1Sample_2.x;
Scalar5=renderTarget1Sample_2.y;
Scalar6=renderTarget1Sample_2.z;
Scalar7=renderTarget1Sample_2.w;
float2 param_40=uv;
float2 l9_331=param_40;
int l9_332;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_333=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_333=0;
}
else
{
l9_333=gl_InstanceIndex%2;
}
int l9_334=l9_333;
l9_332=1-l9_334;
}
else
{
int l9_335=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_335=0;
}
else
{
l9_335=gl_InstanceIndex%2;
}
int l9_336=l9_335;
l9_332=l9_336;
}
int l9_337=l9_332;
float2 l9_338=l9_331;
int l9_339=renderTarget2Layout_tmp;
int l9_340=l9_337;
float2 l9_341=l9_338;
int l9_342=l9_339;
int l9_343=l9_340;
float3 l9_344=float3(0.0);
if (l9_342==0)
{
l9_344=float3(l9_341,0.0);
}
else
{
if (l9_342==1)
{
l9_344=float3(l9_341.x,(l9_341.y*0.5)+(0.5-(float(l9_343)*0.5)),0.0);
}
else
{
l9_344=float3(l9_341,float(l9_343));
}
}
float3 l9_345=l9_344;
float3 l9_346=l9_345;
float4 l9_347=renderTarget2.sample(renderTarget2SmpSC,l9_346.xy,level(0.0));
float4 l9_348=l9_347;
float4 l9_349=l9_348;
float4 renderTarget2Sample_2=l9_349;
Scalar8=renderTarget2Sample_2.x;
Scalar9=renderTarget2Sample_2.y;
Scalar10=renderTarget2Sample_2.z;
Scalar11=renderTarget2Sample_2.w;
float2 param_41=uv;
float2 l9_350=param_41;
int l9_351;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_352=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_352=0;
}
else
{
l9_352=gl_InstanceIndex%2;
}
int l9_353=l9_352;
l9_351=1-l9_353;
}
else
{
int l9_354=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_354=0;
}
else
{
l9_354=gl_InstanceIndex%2;
}
int l9_355=l9_354;
l9_351=l9_355;
}
int l9_356=l9_351;
float2 l9_357=l9_350;
int l9_358=renderTarget3Layout_tmp;
int l9_359=l9_356;
float2 l9_360=l9_357;
int l9_361=l9_358;
int l9_362=l9_359;
float3 l9_363=float3(0.0);
if (l9_361==0)
{
l9_363=float3(l9_360,0.0);
}
else
{
if (l9_361==1)
{
l9_363=float3(l9_360.x,(l9_360.y*0.5)+(0.5-(float(l9_362)*0.5)),0.0);
}
else
{
l9_363=float3(l9_360,float(l9_362));
}
}
float3 l9_364=l9_363;
float3 l9_365=l9_364;
float4 l9_366=renderTarget3.sample(renderTarget3SmpSC,l9_365.xy,level(0.0));
float4 l9_367=l9_366;
float4 l9_368=l9_367;
float4 renderTarget3Sample_2=l9_368;
Scalar12=renderTarget3Sample_2.x;
Scalar13=renderTarget3Sample_2.y;
Scalar14=renderTarget3Sample_2.z;
Scalar15=renderTarget3Sample_2.w;
float4 param_42=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_43=0.0;
float param_44=100.0;
float4 l9_369=param_42;
float l9_370=param_43;
float l9_371=param_44;
float l9_372=0.99998999;
float4 l9_373=l9_369;
#if (1)
{
l9_373=floor((l9_373*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_374=dot(l9_373,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_375=l9_374;
float l9_376=0.0;
float l9_377=l9_372;
float l9_378=l9_370;
float l9_379=l9_371;
float l9_380=l9_378+(((l9_375-l9_376)*(l9_379-l9_378))/(l9_377-l9_376));
float l9_381=l9_380;
float l9_382=l9_381;
gParticle.Size=l9_382;
float4 param_45=float4(Scalar4,Scalar5,Scalar6,Scalar7);
float param_46=0.0;
float param_47=1.00001;
float4 l9_383=param_45;
float l9_384=param_46;
float l9_385=param_47;
float l9_386=0.99998999;
float4 l9_387=l9_383;
#if (1)
{
l9_387=floor((l9_387*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_388=dot(l9_387,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_389=l9_388;
float l9_390=0.0;
float l9_391=l9_386;
float l9_392=l9_384;
float l9_393=l9_385;
float l9_394=l9_392+(((l9_389-l9_390)*(l9_393-l9_392))/(l9_391-l9_390));
float l9_395=l9_394;
float l9_396=l9_395;
gParticle.Color.x=l9_396;
float4 param_48=float4(Scalar8,Scalar9,Scalar10,Scalar11);
float param_49=0.0;
float param_50=1.00001;
float4 l9_397=param_48;
float l9_398=param_49;
float l9_399=param_50;
float l9_400=0.99998999;
float4 l9_401=l9_397;
#if (1)
{
l9_401=floor((l9_401*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_402=dot(l9_401,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_403=l9_402;
float l9_404=0.0;
float l9_405=l9_400;
float l9_406=l9_398;
float l9_407=l9_399;
float l9_408=l9_406+(((l9_403-l9_404)*(l9_407-l9_406))/(l9_405-l9_404));
float l9_409=l9_408;
float l9_410=l9_409;
gParticle.Color.y=l9_410;
float4 param_51=float4(Scalar12,Scalar13,Scalar14,Scalar15);
float param_52=0.0;
float param_53=1.00001;
float4 l9_411=param_51;
float l9_412=param_52;
float l9_413=param_53;
float l9_414=0.99998999;
float4 l9_415=l9_411;
#if (1)
{
l9_415=floor((l9_415*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_416=dot(l9_415,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_417=l9_416;
float l9_418=0.0;
float l9_419=l9_414;
float l9_420=l9_412;
float l9_421=l9_413;
float l9_422=l9_420+(((l9_417-l9_418)*(l9_421-l9_420))/(l9_419-l9_418));
float l9_423=l9_422;
float l9_424=l9_423;
gParticle.Color.z=l9_424;
uv=Coord+(Offset*3.0);
float2 param_54=uv;
float2 l9_425=param_54;
int l9_426;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_427=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_427=0;
}
else
{
l9_427=gl_InstanceIndex%2;
}
int l9_428=l9_427;
l9_426=1-l9_428;
}
else
{
int l9_429=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_429=0;
}
else
{
l9_429=gl_InstanceIndex%2;
}
int l9_430=l9_429;
l9_426=l9_430;
}
int l9_431=l9_426;
float2 l9_432=l9_425;
int l9_433=renderTarget0Layout_tmp;
int l9_434=l9_431;
float2 l9_435=l9_432;
int l9_436=l9_433;
int l9_437=l9_434;
float3 l9_438=float3(0.0);
if (l9_436==0)
{
l9_438=float3(l9_435,0.0);
}
else
{
if (l9_436==1)
{
l9_438=float3(l9_435.x,(l9_435.y*0.5)+(0.5-(float(l9_437)*0.5)),0.0);
}
else
{
l9_438=float3(l9_435,float(l9_437));
}
}
float3 l9_439=l9_438;
float3 l9_440=l9_439;
float4 l9_441=renderTarget0.sample(renderTarget0SmpSC,l9_440.xy,level(0.0));
float4 l9_442=l9_441;
float4 l9_443=l9_442;
float4 renderTarget0Sample_3=l9_443;
Scalar0=renderTarget0Sample_3.x;
Scalar1=renderTarget0Sample_3.y;
Scalar2=renderTarget0Sample_3.z;
Scalar3=renderTarget0Sample_3.w;
float2 param_55=uv;
float2 l9_444=param_55;
int l9_445;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_446=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_446=0;
}
else
{
l9_446=gl_InstanceIndex%2;
}
int l9_447=l9_446;
l9_445=1-l9_447;
}
else
{
int l9_448=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_448=0;
}
else
{
l9_448=gl_InstanceIndex%2;
}
int l9_449=l9_448;
l9_445=l9_449;
}
int l9_450=l9_445;
float2 l9_451=l9_444;
int l9_452=renderTarget1Layout_tmp;
int l9_453=l9_450;
float2 l9_454=l9_451;
int l9_455=l9_452;
int l9_456=l9_453;
float3 l9_457=float3(0.0);
if (l9_455==0)
{
l9_457=float3(l9_454,0.0);
}
else
{
if (l9_455==1)
{
l9_457=float3(l9_454.x,(l9_454.y*0.5)+(0.5-(float(l9_456)*0.5)),0.0);
}
else
{
l9_457=float3(l9_454,float(l9_456));
}
}
float3 l9_458=l9_457;
float3 l9_459=l9_458;
float4 l9_460=renderTarget1.sample(renderTarget1SmpSC,l9_459.xy,level(0.0));
float4 l9_461=l9_460;
float4 l9_462=l9_461;
float4 renderTarget1Sample_3=l9_462;
Scalar4=renderTarget1Sample_3.x;
Scalar5=renderTarget1Sample_3.y;
Scalar6=renderTarget1Sample_3.z;
Scalar7=renderTarget1Sample_3.w;
float2 param_56=uv;
float2 l9_463=param_56;
int l9_464;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_465=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_465=0;
}
else
{
l9_465=gl_InstanceIndex%2;
}
int l9_466=l9_465;
l9_464=1-l9_466;
}
else
{
int l9_467=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_467=0;
}
else
{
l9_467=gl_InstanceIndex%2;
}
int l9_468=l9_467;
l9_464=l9_468;
}
int l9_469=l9_464;
float2 l9_470=l9_463;
int l9_471=renderTarget2Layout_tmp;
int l9_472=l9_469;
float2 l9_473=l9_470;
int l9_474=l9_471;
int l9_475=l9_472;
float3 l9_476=float3(0.0);
if (l9_474==0)
{
l9_476=float3(l9_473,0.0);
}
else
{
if (l9_474==1)
{
l9_476=float3(l9_473.x,(l9_473.y*0.5)+(0.5-(float(l9_475)*0.5)),0.0);
}
else
{
l9_476=float3(l9_473,float(l9_475));
}
}
float3 l9_477=l9_476;
float3 l9_478=l9_477;
float4 l9_479=renderTarget2.sample(renderTarget2SmpSC,l9_478.xy,level(0.0));
float4 l9_480=l9_479;
float4 l9_481=l9_480;
float4 renderTarget2Sample_3=l9_481;
Scalar8=renderTarget2Sample_3.x;
Scalar9=renderTarget2Sample_3.y;
Scalar10=renderTarget2Sample_3.z;
Scalar11=renderTarget2Sample_3.w;
float2 param_57=uv;
float2 l9_482=param_57;
int l9_483;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_484=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_484=0;
}
else
{
l9_484=gl_InstanceIndex%2;
}
int l9_485=l9_484;
l9_483=1-l9_485;
}
else
{
int l9_486=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_486=0;
}
else
{
l9_486=gl_InstanceIndex%2;
}
int l9_487=l9_486;
l9_483=l9_487;
}
int l9_488=l9_483;
float2 l9_489=l9_482;
int l9_490=renderTarget3Layout_tmp;
int l9_491=l9_488;
float2 l9_492=l9_489;
int l9_493=l9_490;
int l9_494=l9_491;
float3 l9_495=float3(0.0);
if (l9_493==0)
{
l9_495=float3(l9_492,0.0);
}
else
{
if (l9_493==1)
{
l9_495=float3(l9_492.x,(l9_492.y*0.5)+(0.5-(float(l9_494)*0.5)),0.0);
}
else
{
l9_495=float3(l9_492,float(l9_494));
}
}
float3 l9_496=l9_495;
float3 l9_497=l9_496;
float4 l9_498=renderTarget3.sample(renderTarget3SmpSC,l9_497.xy,level(0.0));
float4 l9_499=l9_498;
float4 l9_500=l9_499;
float4 renderTarget3Sample_3=l9_500;
Scalar12=renderTarget3Sample_3.x;
Scalar13=renderTarget3Sample_3.y;
Scalar14=renderTarget3Sample_3.z;
Scalar15=renderTarget3Sample_3.w;
float4 param_58=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_59=0.0;
float param_60=1.00001;
float4 l9_501=param_58;
float l9_502=param_59;
float l9_503=param_60;
float l9_504=0.99998999;
float4 l9_505=l9_501;
#if (1)
{
l9_505=floor((l9_505*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_506=dot(l9_505,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_507=l9_506;
float l9_508=0.0;
float l9_509=l9_504;
float l9_510=l9_502;
float l9_511=l9_503;
float l9_512=l9_510+(((l9_507-l9_508)*(l9_511-l9_510))/(l9_509-l9_508));
float l9_513=l9_512;
float l9_514=l9_513;
gParticle.Color.w=l9_514;
float2 param_61=float2(Scalar4,Scalar5);
float param_62=-1.0;
float param_63=1.0;
float2 l9_515=param_61;
float l9_516=param_62;
float l9_517=param_63;
float l9_518=0.99998999;
float2 l9_519=l9_515;
#if (1)
{
l9_519=floor((l9_519*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_520=dot(l9_519,float2(1.0,0.0039215689));
float l9_521=l9_520;
float l9_522=0.0;
float l9_523=l9_518;
float l9_524=l9_516;
float l9_525=l9_517;
float l9_526=l9_524+(((l9_521-l9_522)*(l9_525-l9_524))/(l9_523-l9_522));
float l9_527=l9_526;
float l9_528=l9_527;
gParticle.Quaternion.x=l9_528;
float2 param_64=float2(Scalar6,Scalar7);
float param_65=-1.0;
float param_66=1.0;
float2 l9_529=param_64;
float l9_530=param_65;
float l9_531=param_66;
float l9_532=0.99998999;
float2 l9_533=l9_529;
#if (1)
{
l9_533=floor((l9_533*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_534=dot(l9_533,float2(1.0,0.0039215689));
float l9_535=l9_534;
float l9_536=0.0;
float l9_537=l9_532;
float l9_538=l9_530;
float l9_539=l9_531;
float l9_540=l9_538+(((l9_535-l9_536)*(l9_539-l9_538))/(l9_537-l9_536));
float l9_541=l9_540;
float l9_542=l9_541;
gParticle.Quaternion.y=l9_542;
float2 param_67=float2(Scalar8,Scalar9);
float param_68=-1.0;
float param_69=1.0;
float2 l9_543=param_67;
float l9_544=param_68;
float l9_545=param_69;
float l9_546=0.99998999;
float2 l9_547=l9_543;
#if (1)
{
l9_547=floor((l9_547*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_548=dot(l9_547,float2(1.0,0.0039215689));
float l9_549=l9_548;
float l9_550=0.0;
float l9_551=l9_546;
float l9_552=l9_544;
float l9_553=l9_545;
float l9_554=l9_552+(((l9_549-l9_550)*(l9_553-l9_552))/(l9_551-l9_550));
float l9_555=l9_554;
float l9_556=l9_555;
gParticle.Quaternion.z=l9_556;
float2 param_70=float2(Scalar10,Scalar11);
float param_71=-1.0;
float param_72=1.0;
float2 l9_557=param_70;
float l9_558=param_71;
float l9_559=param_72;
float l9_560=0.99998999;
float2 l9_561=l9_557;
#if (1)
{
l9_561=floor((l9_561*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_562=dot(l9_561,float2(1.0,0.0039215689));
float l9_563=l9_562;
float l9_564=0.0;
float l9_565=l9_560;
float l9_566=l9_558;
float l9_567=l9_559;
float l9_568=l9_566+(((l9_563-l9_564)*(l9_567-l9_566))/(l9_565-l9_564));
float l9_569=l9_568;
float l9_570=l9_569;
gParticle.Quaternion.w=l9_570;
float4 param_73=gParticle.Quaternion;
param_73=normalize(param_73.yzwx);
float l9_571=param_73.x*param_73.x;
float l9_572=param_73.y*param_73.y;
float l9_573=param_73.z*param_73.z;
float l9_574=param_73.x*param_73.z;
float l9_575=param_73.x*param_73.y;
float l9_576=param_73.y*param_73.z;
float l9_577=param_73.w*param_73.x;
float l9_578=param_73.w*param_73.y;
float l9_579=param_73.w*param_73.z;
float3x3 l9_580=float3x3(float3(1.0-(2.0*(l9_572+l9_573)),2.0*(l9_575+l9_579),2.0*(l9_574-l9_578)),float3(2.0*(l9_575-l9_579),1.0-(2.0*(l9_571+l9_573)),2.0*(l9_576+l9_577)),float3(2.0*(l9_574+l9_578),2.0*(l9_576-l9_577),1.0-(2.0*(l9_571+l9_572))));
gParticle.Matrix=l9_580;
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
Globals.gComponentTime=(*sc_set0.UserUniforms).overrideTimeElapsed[l9_4/360];
Globals.gTimeDelta=fast::min((*sc_set0.UserUniforms).overrideTimeDelta,0.5);
Globals.gTimeElapsedShifted=(Globals.gTimeElapsed-(gParticle.TimeShift*Globals.gTimeDelta))-0.0;
float Delay=0.0;
float Warmup=0.0;
gParticle.Age=mod((Globals.gTimeElapsedShifted-gParticle.SpawnOffset)+Warmup,4.0);
float l9_5=Globals.gTimeElapsed;
float l9_6=gParticle.SpawnOffset;
float l9_7=Delay;
float l9_8=Warmup;
bool l9_9=(l9_5-l9_6)<(l9_7-l9_8);
bool l9_10;
if (!l9_9)
{
l9_10=gParticle.Age>4.0;
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
l9_14=mod(((fast::max(Globals.gTimeElapsed,0.1)-gParticle.SpawnOffset)-Delay)+Warmup,4.0)<=Globals.gTimeDelta;
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
l9_15.Seed+=(floor(((((l9_18-l9_15.SpawnOffset)-0.0)+0.0)+8.0)/4.0)*4.32723);
l9_15.Seed=fract(abs(l9_15.Seed));
int2 l9_19=int2(l9_15.Index1D%400,l9_15.Index1D/400);
l9_15.Seed2000=(float2(l9_19)+float2(1.0))/float2(399.0);
gParticle=l9_15;
float l9_20=18.0;
gParticle.Position=(float3(((floor(mod(gParticle.Index1DPerCopyF,floor(l9_20)))/l9_20)*2.0)-1.0,((floor(gParticle.Index1DPerCopyF/floor(l9_20))/l9_20)*2.0)-1.0,0.0)*20.0)+float3(1.0,1.0,0.0);
gParticle.Velocity=float3(0.0);
gParticle.Color=float4(1.0);
gParticle.Age=0.0;
gParticle.Life=4.0;
gParticle.Size=1.0;
gParticle.Mass=1.0;
gParticle.Matrix=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(0.0,0.0,1.0));
gParticle.Quaternion=float4(0.0,0.0,0.0,1.0);
float3 l9_21=float3(0.0);
l9_21=(*sc_set0.UserUniforms).Port_Import_N143;
float3 l9_22=float3(0.0);
l9_22=-l9_21;
float3 l9_23=float3(0.0);
float3 l9_24=l9_22;
float3 l9_25=l9_21;
ssGlobals l9_26=param_1;
int l9_27=3;
bool l9_28=true;
bool l9_29=true;
bool l9_30=true;
float l9_31=169.0;
ssParticle l9_32=gParticle;
float l9_33=0.0;
float l9_34=l9_26.gTimeElapsed;
float4 l9_35=float4(0.0);
float4 l9_36=float4(0.0);
if (l9_28)
{
l9_36.x=floor(fract(l9_34)*1000.0);
}
if (l9_30)
{
l9_36.y=float(l9_32.Index1D^((l9_32.Index1D*15299)+l9_32.Index1D));
}
if (l9_29)
{
l9_36.z=l9_31;
}
l9_36.w=l9_33*1000.0;
int l9_37=int(l9_36.x);
int l9_38=int(l9_36.y);
int l9_39=int(l9_36.z);
int l9_40=int(l9_36.w);
int l9_41=(((l9_37*15299)^(l9_38*30133))^(l9_39*17539))^(l9_40*12113);
int l9_42=l9_41;
if (l9_27==1)
{
int l9_43=l9_42;
int l9_44=l9_43;
int l9_45=((l9_44*((l9_44*1471343)+101146501))+1559861749)&2147483647;
int l9_46=l9_45;
float l9_47=float(l9_46)*4.6566129e-10;
float l9_48=l9_47;
l9_35.x=l9_48;
}
else
{
if (l9_27==2)
{
int l9_49=l9_42;
int l9_50=l9_49;
int l9_51=((l9_50*((l9_50*1471343)+101146501))+1559861749)&2147483647;
int l9_52=l9_51;
int l9_53=l9_49*1399;
int l9_54=((l9_53*((l9_53*1471343)+101146501))+1559861749)&2147483647;
int l9_55=l9_54;
int l9_56=l9_52;
float l9_57=float(l9_56)*4.6566129e-10;
int l9_58=l9_55;
float l9_59=float(l9_58)*4.6566129e-10;
float2 l9_60=float2(l9_57,l9_59);
l9_35=float4(l9_60.x,l9_60.y,l9_35.z,l9_35.w);
}
else
{
if (l9_27==3)
{
int l9_61=l9_42;
int l9_62=l9_61;
int l9_63=((l9_62*((l9_62*1471343)+101146501))+1559861749)&2147483647;
int l9_64=l9_63;
int l9_65=l9_61*1399;
int l9_66=((l9_65*((l9_65*1471343)+101146501))+1559861749)&2147483647;
int l9_67=l9_66;
int l9_68=l9_61*7177;
int l9_69=((l9_68*((l9_68*1471343)+101146501))+1559861749)&2147483647;
int l9_70=l9_69;
int l9_71=l9_64;
float l9_72=float(l9_71)*4.6566129e-10;
int l9_73=l9_67;
float l9_74=float(l9_73)*4.6566129e-10;
int l9_75=l9_70;
float l9_76=float(l9_75)*4.6566129e-10;
float3 l9_77=float3(l9_72,l9_74,l9_76);
l9_35=float4(l9_77.x,l9_77.y,l9_77.z,l9_35.w);
}
else
{
int l9_78=l9_42;
int l9_79=l9_78;
int l9_80=((l9_79*((l9_79*1471343)+101146501))+1559861749)&2147483647;
int l9_81=l9_80;
int l9_82=l9_78*1399;
int l9_83=((l9_82*((l9_82*1471343)+101146501))+1559861749)&2147483647;
int l9_84=l9_83;
int l9_85=l9_78*7177;
int l9_86=((l9_85*((l9_85*1471343)+101146501))+1559861749)&2147483647;
int l9_87=l9_86;
int l9_88=l9_78*18919;
int l9_89=((l9_88*((l9_88*1471343)+101146501))+1559861749)&2147483647;
int l9_90=l9_89;
int l9_91=l9_81;
float l9_92=float(l9_91)*4.6566129e-10;
int l9_93=l9_84;
float l9_94=float(l9_93)*4.6566129e-10;
int l9_95=l9_87;
float l9_96=float(l9_95)*4.6566129e-10;
int l9_97=l9_90;
float l9_98=float(l9_97)*4.6566129e-10;
float4 l9_99=float4(l9_92,l9_94,l9_96,l9_98);
l9_35=l9_99;
}
}
}
float4 l9_100=l9_35;
float4 l9_101=l9_100;
float3 l9_102=mix(l9_24,l9_25,l9_101.xyz);
l9_23=l9_102;
float3 l9_103=float3(0.0);
l9_103=(*sc_set0.UserUniforms).Port_Import_N145;
float3 l9_104=float3(0.0);
l9_104=l9_23+l9_103;
gParticle.Position=l9_104;
float l9_105=0.0;
l9_105=param_1.gTimeElapsedShifted*(*sc_set0.UserUniforms).Port_Multiplier_N012;
float l9_106=0.0;
float l9_107=(*sc_set0.UserUniforms).burstDuration;
l9_106=l9_107;
float l9_108=0.0;
l9_108=float(l9_105>l9_106);
float l9_109=l9_108;
if ((l9_109*1.0)!=0.0)
{
gParticle.Dead=true;
}
float3 l9_110=float3(0.0);
l9_110=gParticle.Position;
float3 l9_111=float3(0.0);
float3 l9_112=l9_110;
float l9_113=dot(l9_112,l9_112);
float l9_114;
if (l9_113>0.0)
{
l9_114=1.0/sqrt(l9_113);
}
else
{
l9_114=0.0;
}
float l9_115=l9_114;
float3 l9_116=l9_112*l9_115;
l9_111=l9_116;
float l9_117=0.0;
float l9_118=(*sc_set0.UserUniforms).explosionForce;
l9_117=l9_118;
float3 l9_119=float3(0.0);
l9_119=l9_111*float3(l9_117);
gParticle.Force=l9_119;
float l9_120=0.0;
l9_120=(*sc_set0.UserUniforms).Port_Import_N285;
float3 l9_121=float3(0.0);
l9_121=(*sc_set0.UserUniforms).Port_Import_N284;
float3 l9_122=float3(0.0);
l9_122=gParticle.Position;
float3 l9_123=float3(0.0);
l9_123=l9_121-l9_122;
float3 l9_124=float3(0.0);
float3 l9_125=l9_123;
float l9_126=dot(l9_125,l9_125);
float l9_127;
if (l9_126>0.0)
{
l9_127=1.0/sqrt(l9_126);
}
else
{
l9_127=0.0;
}
float l9_128=l9_127;
float3 l9_129=l9_125*l9_128;
l9_124=l9_129;
float3 l9_130=float3(0.0);
l9_130=float3(l9_120)*l9_124;
gParticle.Force+=l9_130;
gParticle.Velocity+=((gParticle.Force/float3(gParticle.Mass))*0.033330001);
gParticle.Force=float3(0.0);
int l9_131=gl_InstanceIndex;
gParticle.Position=((*sc_set0.UserUniforms).vfxModelMatrix[l9_131/360]*float4(gParticle.Position,1.0)).xyz;
int l9_132=gl_InstanceIndex;
int l9_133=l9_132/360;
gParticle.Velocity=float3x3((*sc_set0.UserUniforms).vfxModelMatrix[l9_133][0].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_133][1].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_133][2].xyz)*gParticle.Velocity;
int l9_134=gl_InstanceIndex;
int l9_135=l9_134/360;
gParticle.Force=float3x3((*sc_set0.UserUniforms).vfxModelMatrix[l9_135][0].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_135][1].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_135][2].xyz)*gParticle.Force;
int l9_136=gl_InstanceIndex;
int l9_137=gl_InstanceIndex;
int l9_138=gl_InstanceIndex;
gParticle.Size=fast::max(length((*sc_set0.UserUniforms).vfxModelMatrix[l9_136/360][0].xyz),fast::max(length((*sc_set0.UserUniforms).vfxModelMatrix[l9_137/360][1].xyz),length((*sc_set0.UserUniforms).vfxModelMatrix[l9_138/360][2].xyz)))*gParticle.Size;
int l9_139=gl_InstanceIndex;
int l9_140=l9_139/360;
gParticle.Matrix=float3x3((*sc_set0.UserUniforms).vfxModelMatrix[l9_140][0].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_140][1].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_140][2].xyz)*gParticle.Matrix;
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
float4 l9_141=param_2;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_142=dot(l9_141,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_143=l9_142;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_143;
}
}
float4 l9_144=float4(param_2.x,-param_2.y,(param_2.z*0.5)+(param_2.w*0.5),param_2.w);
out.gl_Position=l9_144;
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
float2 l9_146=param_3;
float param_5=(snoise(l9_146)*0.5)+0.5;
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
float2 l9_147=param_6;
float param_8=(snoise(l9_147)*0.5)+0.5;
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
float2 l9_148=param_9;
float param_11=(snoise(l9_148)*0.5)+0.5;
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
float Random_N2=0.0;
float param_12=(*sc_set0.UserUniforms).Port_Min_N002;
float param_13=(*sc_set0.UserUniforms).Port_Max_N002;
ssGlobals param_15=Globals;
int l9_149=1;
bool l9_150=false;
bool l9_151=true;
bool l9_152=true;
float l9_153=2.0;
ssParticle l9_154=gParticle;
float l9_155=0.0;
float l9_156=param_15.gTimeElapsed;
float4 l9_157=float4(0.0);
float4 l9_158=float4(0.0);
if (l9_150)
{
l9_158.x=floor(fract(l9_156)*1000.0);
}
if (l9_152)
{
l9_158.y=float(l9_154.Index1D^((l9_154.Index1D*15299)+l9_154.Index1D));
}
if (l9_151)
{
l9_158.z=l9_153;
}
l9_158.w=l9_155*1000.0;
int l9_159=int(l9_158.x);
int l9_160=int(l9_158.y);
int l9_161=int(l9_158.z);
int l9_162=int(l9_158.w);
int l9_163=(((l9_159*15299)^(l9_160*30133))^(l9_161*17539))^(l9_162*12113);
int l9_164=l9_163;
if (l9_149==1)
{
int l9_165=l9_164;
int l9_166=l9_165;
int l9_167=((l9_166*((l9_166*1471343)+101146501))+1559861749)&2147483647;
int l9_168=l9_167;
float l9_169=float(l9_168)*4.6566129e-10;
float l9_170=l9_169;
l9_157.x=l9_170;
}
else
{
if (l9_149==2)
{
int l9_171=l9_164;
int l9_172=l9_171;
int l9_173=((l9_172*((l9_172*1471343)+101146501))+1559861749)&2147483647;
int l9_174=l9_173;
int l9_175=l9_171*1399;
int l9_176=((l9_175*((l9_175*1471343)+101146501))+1559861749)&2147483647;
int l9_177=l9_176;
int l9_178=l9_174;
float l9_179=float(l9_178)*4.6566129e-10;
int l9_180=l9_177;
float l9_181=float(l9_180)*4.6566129e-10;
float2 l9_182=float2(l9_179,l9_181);
l9_157=float4(l9_182.x,l9_182.y,l9_157.z,l9_157.w);
}
else
{
if (l9_149==3)
{
int l9_183=l9_164;
int l9_184=l9_183;
int l9_185=((l9_184*((l9_184*1471343)+101146501))+1559861749)&2147483647;
int l9_186=l9_185;
int l9_187=l9_183*1399;
int l9_188=((l9_187*((l9_187*1471343)+101146501))+1559861749)&2147483647;
int l9_189=l9_188;
int l9_190=l9_183*7177;
int l9_191=((l9_190*((l9_190*1471343)+101146501))+1559861749)&2147483647;
int l9_192=l9_191;
int l9_193=l9_186;
float l9_194=float(l9_193)*4.6566129e-10;
int l9_195=l9_189;
float l9_196=float(l9_195)*4.6566129e-10;
int l9_197=l9_192;
float l9_198=float(l9_197)*4.6566129e-10;
float3 l9_199=float3(l9_194,l9_196,l9_198);
l9_157=float4(l9_199.x,l9_199.y,l9_199.z,l9_157.w);
}
else
{
int l9_200=l9_164;
int l9_201=l9_200;
int l9_202=((l9_201*((l9_201*1471343)+101146501))+1559861749)&2147483647;
int l9_203=l9_202;
int l9_204=l9_200*1399;
int l9_205=((l9_204*((l9_204*1471343)+101146501))+1559861749)&2147483647;
int l9_206=l9_205;
int l9_207=l9_200*7177;
int l9_208=((l9_207*((l9_207*1471343)+101146501))+1559861749)&2147483647;
int l9_209=l9_208;
int l9_210=l9_200*18919;
int l9_211=((l9_210*((l9_210*1471343)+101146501))+1559861749)&2147483647;
int l9_212=l9_211;
int l9_213=l9_203;
float l9_214=float(l9_213)*4.6566129e-10;
int l9_215=l9_206;
float l9_216=float(l9_215)*4.6566129e-10;
int l9_217=l9_209;
float l9_218=float(l9_217)*4.6566129e-10;
int l9_219=l9_212;
float l9_220=float(l9_219)*4.6566129e-10;
float4 l9_221=float4(l9_214,l9_216,l9_218,l9_220);
l9_157=l9_221;
}
}
}
float4 l9_222=l9_157;
float4 l9_223=l9_222;
float param_14=mix(param_12,param_13,l9_223.x);
Random_N2=param_14;
float Value_N68=0.0;
Value_N68=Random_N2;
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
float3x3 ValueMatrix_N156=float3x3(float3(0.0),float3(0.0),float3(0.0));
ValueMatrix_N156=gParticle.Matrix;
float3 Value_N161=float3(0.0);
Value_N161=(*sc_set0.UserUniforms).Port_Import_N161;
float3 Output_N162=float3(0.0);
float3 param_16=Value_N161;
float l9_224=dot(param_16,param_16);
float l9_225;
if (l9_224>0.0)
{
l9_225=1.0/sqrt(l9_224);
}
else
{
l9_225=0.0;
}
float l9_226=l9_225;
float3 param_17=param_16*l9_226;
Output_N162=param_17;
float Random_N159=0.0;
float param_18=(*sc_set0.UserUniforms).Port_Min_N159;
float param_19=(*sc_set0.UserUniforms).Port_Max_N159;
ssGlobals param_21=Globals;
int l9_227=1;
bool l9_228=false;
bool l9_229=true;
bool l9_230=true;
float l9_231=159.0;
ssParticle l9_232=gParticle;
float l9_233=0.0;
float l9_234=param_21.gTimeElapsed;
float4 l9_235=float4(0.0);
float4 l9_236=float4(0.0);
if (l9_228)
{
l9_236.x=floor(fract(l9_234)*1000.0);
}
if (l9_230)
{
l9_236.y=float(l9_232.Index1D^((l9_232.Index1D*15299)+l9_232.Index1D));
}
if (l9_229)
{
l9_236.z=l9_231;
}
l9_236.w=l9_233*1000.0;
int l9_237=int(l9_236.x);
int l9_238=int(l9_236.y);
int l9_239=int(l9_236.z);
int l9_240=int(l9_236.w);
int l9_241=(((l9_237*15299)^(l9_238*30133))^(l9_239*17539))^(l9_240*12113);
int l9_242=l9_241;
if (l9_227==1)
{
int l9_243=l9_242;
int l9_244=l9_243;
int l9_245=((l9_244*((l9_244*1471343)+101146501))+1559861749)&2147483647;
int l9_246=l9_245;
float l9_247=float(l9_246)*4.6566129e-10;
float l9_248=l9_247;
l9_235.x=l9_248;
}
else
{
if (l9_227==2)
{
int l9_249=l9_242;
int l9_250=l9_249;
int l9_251=((l9_250*((l9_250*1471343)+101146501))+1559861749)&2147483647;
int l9_252=l9_251;
int l9_253=l9_249*1399;
int l9_254=((l9_253*((l9_253*1471343)+101146501))+1559861749)&2147483647;
int l9_255=l9_254;
int l9_256=l9_252;
float l9_257=float(l9_256)*4.6566129e-10;
int l9_258=l9_255;
float l9_259=float(l9_258)*4.6566129e-10;
float2 l9_260=float2(l9_257,l9_259);
l9_235=float4(l9_260.x,l9_260.y,l9_235.z,l9_235.w);
}
else
{
if (l9_227==3)
{
int l9_261=l9_242;
int l9_262=l9_261;
int l9_263=((l9_262*((l9_262*1471343)+101146501))+1559861749)&2147483647;
int l9_264=l9_263;
int l9_265=l9_261*1399;
int l9_266=((l9_265*((l9_265*1471343)+101146501))+1559861749)&2147483647;
int l9_267=l9_266;
int l9_268=l9_261*7177;
int l9_269=((l9_268*((l9_268*1471343)+101146501))+1559861749)&2147483647;
int l9_270=l9_269;
int l9_271=l9_264;
float l9_272=float(l9_271)*4.6566129e-10;
int l9_273=l9_267;
float l9_274=float(l9_273)*4.6566129e-10;
int l9_275=l9_270;
float l9_276=float(l9_275)*4.6566129e-10;
float3 l9_277=float3(l9_272,l9_274,l9_276);
l9_235=float4(l9_277.x,l9_277.y,l9_277.z,l9_235.w);
}
else
{
int l9_278=l9_242;
int l9_279=l9_278;
int l9_280=((l9_279*((l9_279*1471343)+101146501))+1559861749)&2147483647;
int l9_281=l9_280;
int l9_282=l9_278*1399;
int l9_283=((l9_282*((l9_282*1471343)+101146501))+1559861749)&2147483647;
int l9_284=l9_283;
int l9_285=l9_278*7177;
int l9_286=((l9_285*((l9_285*1471343)+101146501))+1559861749)&2147483647;
int l9_287=l9_286;
int l9_288=l9_278*18919;
int l9_289=((l9_288*((l9_288*1471343)+101146501))+1559861749)&2147483647;
int l9_290=l9_289;
int l9_291=l9_281;
float l9_292=float(l9_291)*4.6566129e-10;
int l9_293=l9_284;
float l9_294=float(l9_293)*4.6566129e-10;
int l9_295=l9_287;
float l9_296=float(l9_295)*4.6566129e-10;
int l9_297=l9_290;
float l9_298=float(l9_297)*4.6566129e-10;
float4 l9_299=float4(l9_292,l9_294,l9_296,l9_298);
l9_235=l9_299;
}
}
}
float4 l9_300=l9_235;
float4 l9_301=l9_300;
float param_20=mix(param_18,param_19,l9_301.x);
Random_N159=param_20;
float Value_N163=0.0;
Value_N163=Random_N159;
float Time_N153=0.0;
Time_N153=Globals.gTimeDelta*(*sc_set0.UserUniforms).Port_Multiplier_N153;
float Output_N155=0.0;
Output_N155=Value_N163*Time_N153;
float3x3 Matrix_N157=float3x3(float3(0.0),float3(0.0),float3(0.0));
float3 param_22=Output_N162;
float param_23=Output_N155;
float3 l9_302=normalize(param_22);
float l9_303=sin(radians(param_23));
float l9_304=cos(radians(param_23));
float l9_305=1.0-l9_304;
float3x3 param_24=float3x3(float3(((l9_305*l9_302.x)*l9_302.x)+l9_304,((l9_305*l9_302.x)*l9_302.y)-(l9_302.z*l9_303),((l9_305*l9_302.z)*l9_302.x)+(l9_302.y*l9_303)),float3(((l9_305*l9_302.x)*l9_302.y)+(l9_302.z*l9_303),((l9_305*l9_302.y)*l9_302.y)+l9_304,((l9_305*l9_302.y)*l9_302.z)-(l9_302.x*l9_303)),float3(((l9_305*l9_302.z)*l9_302.x)-(l9_302.y*l9_303),((l9_305*l9_302.y)*l9_302.z)+(l9_302.x*l9_303),((l9_305*l9_302.z)*l9_302.z)+l9_304));
Matrix_N157=param_24;
float3x3 Output_N165=float3x3(float3(0.0),float3(0.0),float3(0.0));
Output_N165=ValueMatrix_N156*Matrix_N157;
gParticle.Matrix=Output_N165;
float3x3 param_25=gParticle.Matrix;
gParticle.Quaternion=matrixToQuaternion(param_25);
float Drift=0.0049999999;
if (gParticle.Dead)
{
float4 param_26=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_26.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_306=param_26;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_307=dot(l9_306,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_308=l9_307;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_308;
}
}
float4 l9_309=float4(param_26.x,-param_26.y,(param_26.z*0.5)+(param_26.w*0.5),param_26.w);
out.gl_Position=l9_309;
return out;
}
float l9_310;
if (abs(gParticle.Force.x)<Drift)
{
l9_310=0.0;
}
else
{
l9_310=gParticle.Force.x;
}
gParticle.Force.x=l9_310;
float l9_311;
if (abs(gParticle.Force.y)<Drift)
{
l9_311=0.0;
}
else
{
l9_311=gParticle.Force.y;
}
gParticle.Force.y=l9_311;
float l9_312;
if (abs(gParticle.Force.z)<Drift)
{
l9_312=0.0;
}
else
{
l9_312=gParticle.Force.z;
}
gParticle.Force.z=l9_312;
gParticle.Mass=fast::max(Drift,gParticle.Mass);
if (Globals.gTimeDelta!=0.0)
{
gParticle.Velocity+=((gParticle.Force/float3(gParticle.Mass))*Globals.gTimeDelta);
}
float l9_313;
if (abs(gParticle.Velocity.x)<Drift)
{
l9_313=0.0;
}
else
{
l9_313=gParticle.Velocity.x;
}
gParticle.Velocity.x=l9_313;
float l9_314;
if (abs(gParticle.Velocity.y)<Drift)
{
l9_314=0.0;
}
else
{
l9_314=gParticle.Velocity.y;
}
gParticle.Velocity.y=l9_314;
float l9_315;
if (abs(gParticle.Velocity.z)<Drift)
{
l9_315=0.0;
}
else
{
l9_315=gParticle.Velocity.z;
}
gParticle.Velocity.z=l9_315;
gParticle.Position+=(gParticle.Velocity*Globals.gTimeDelta);
float2 QuadSize=float2(4.0,1.0)/float2(2048.0,(*sc_set0.UserUniforms).vfxTargetSizeWrite.y);
float2 Offset=float2(0.0);
int offsetID=(*sc_set0.UserUniforms).vfxOffsetInstancesWrite+ssInstanceID;
int particleRow=512;
Offset.x=float(offsetID%particleRow);
Offset.y=float(offsetID/particleRow);
Offset*=QuadSize;
float2 Vertex=float2(0.0);
float l9_316;
if (v.texture0.x<0.5)
{
l9_316=0.0;
}
else
{
l9_316=QuadSize.x;
}
Vertex.x=l9_316;
float l9_317;
if (v.texture0.y<0.5)
{
l9_317=0.0;
}
else
{
l9_317=QuadSize.y;
}
Vertex.y=l9_317;
Vertex+=Offset;
float4 param_27=float4((Vertex*2.0)-float2(1.0),1.0,1.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_27.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_318=param_27;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_319=dot(l9_318,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_320=l9_319;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_320;
}
}
float4 l9_321=float4(param_27.x,-param_27.y,(param_27.z*0.5)+(param_27.w*0.5),param_27.w);
out.gl_Position=l9_321;
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
float4 param_28=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_28.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_322=param_28;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_323=dot(l9_322,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_324=l9_323;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_324;
}
}
float4 l9_325=float4(param_28.x,-param_28.y,(param_28.z*0.5)+(param_28.w*0.5),param_28.w);
out.gl_Position=l9_325;
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
float3 Port_Import_N143;
float3 Port_Import_N145;
float Port_Multiplier_N012;
float Port_Import_N285;
float3 Port_Import_N284;
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
float Port_Min_N002;
float Port_Max_N002;
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
float3 Port_Import_N161;
float Port_Min_N159;
float Port_Max_N159;
float Port_Import_N163;
float Port_Multiplier_N153;
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
float l9_128=4.0;
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
float l9_146=4.0;
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
