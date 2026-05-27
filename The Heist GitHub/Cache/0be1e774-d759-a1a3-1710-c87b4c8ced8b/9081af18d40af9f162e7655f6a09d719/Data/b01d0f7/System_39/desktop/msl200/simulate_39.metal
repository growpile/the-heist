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
//ubo int UserUniforms 0:35:7760 {
//float4 sc_Time 1376
//float4 sc_UniformConstants 1392
//float4 sc_StereoClipPlanes 3664:[2]:16
//int overrideTimeEnabled 4108
//float overrideTimeElapsed 4112:[32]:4
//float overrideTimeDelta 4240
//bool vfxBatchEnable 4248:[32]:4
//int vfxOffsetInstancesRead 7348
//int vfxOffsetInstancesWrite 7352
//float2 vfxTargetSizeRead 7360
//float2 vfxTargetSizeWrite 7368
//int vfxTargetWidth 7376
//float burstDuration 7392
//float explosionForce 7396
//float4 Tweak_N79 7408
//float4 Tweak_N80 7424
//float Port_Multiplier_N052 7440
//float3 Port_Import_N166 7456
//float3 Port_Import_N174 7472
//float Port_Import_N003 7488
//float Port_Import_N005 7492
//float Port_Min_N008 7496
//float Port_Max_N008 7500
//float Port_Import_N268 7508
//float3 Port_Value_N001 7520
//float Port_Import_N285 7536
//float3 Port_Import_N284 7552
//float3 Port_Import_N013 7568
//float3 Port_Import_N016 7584
//float Port_Min_N043 7632
//float Port_Max_N043 7636
//float Port_Import_N041 7640
//float Port_Import_N059 7644
//float Port_Input0_N063 7652
//float Port_Import_N185 7656
//float Port_Input1_N227 7664
//float Port_Input2_N227 7668
//float Port_Input0_N066 7672
//float Port_Import_N188 7676
//float Port_Input1_N236 7684
//float Port_Input2_N236 7688
//float Port_Min_N038 7692
//float Port_Max_N038 7696
//float Port_Min_N023 7704
//float Port_Max_N023 7708
//float Port_Min_N125 7716
//float Port_Max_N125 7720
//float Port_Import_N163 7744
//}
//spec_const bool renderTarget0HasSwappedViews 0 0
//spec_const bool renderTarget1HasSwappedViews 1 0
//spec_const bool renderTarget2HasSwappedViews 2 0
//spec_const bool renderTarget3HasSwappedViews 3 0
//spec_const int renderTarget0Layout 4 0
//spec_const int renderTarget1Layout 5 0
//spec_const int renderTarget2Layout 6 0
//spec_const int renderTarget3Layout 7 0
//spec_const int sc_ShaderCacheConstant 8 0
//spec_const int sc_StereoRenderingMode 9 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 10 0
//SG_REFLECTION_END
constant bool renderTarget0HasSwappedViews [[function_constant(0)]];
constant bool renderTarget0HasSwappedViews_tmp = is_function_constant_defined(renderTarget0HasSwappedViews) ? renderTarget0HasSwappedViews : false;
constant bool renderTarget1HasSwappedViews [[function_constant(1)]];
constant bool renderTarget1HasSwappedViews_tmp = is_function_constant_defined(renderTarget1HasSwappedViews) ? renderTarget1HasSwappedViews : false;
constant bool renderTarget2HasSwappedViews [[function_constant(2)]];
constant bool renderTarget2HasSwappedViews_tmp = is_function_constant_defined(renderTarget2HasSwappedViews) ? renderTarget2HasSwappedViews : false;
constant bool renderTarget3HasSwappedViews [[function_constant(3)]];
constant bool renderTarget3HasSwappedViews_tmp = is_function_constant_defined(renderTarget3HasSwappedViews) ? renderTarget3HasSwappedViews : false;
constant int renderTarget0Layout [[function_constant(4)]];
constant int renderTarget0Layout_tmp = is_function_constant_defined(renderTarget0Layout) ? renderTarget0Layout : 0;
constant int renderTarget1Layout [[function_constant(5)]];
constant int renderTarget1Layout_tmp = is_function_constant_defined(renderTarget1Layout) ? renderTarget1Layout : 0;
constant int renderTarget2Layout [[function_constant(6)]];
constant int renderTarget2Layout_tmp = is_function_constant_defined(renderTarget2Layout) ? renderTarget2Layout : 0;
constant int renderTarget3Layout [[function_constant(7)]];
constant int renderTarget3Layout_tmp = is_function_constant_defined(renderTarget3Layout) ? renderTarget3Layout : 0;
constant int sc_ShaderCacheConstant [[function_constant(8)]];
constant int sc_ShaderCacheConstant_tmp = is_function_constant_defined(sc_ShaderCacheConstant) ? sc_ShaderCacheConstant : 0;
constant int sc_StereoRenderingMode [[function_constant(9)]];
constant int sc_StereoRenderingMode_tmp = is_function_constant_defined(sc_StereoRenderingMode) ? sc_StereoRenderingMode : 0;
constant int sc_StereoRendering_IsClipDistanceEnabled [[function_constant(10)]];
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
float4 Tweak_N79;
float4 Tweak_N80;
float Port_Multiplier_N052;
float3 Port_Import_N166;
float3 Port_Import_N174;
float Port_Import_N003;
float Port_Import_N005;
float Port_Min_N008;
float Port_Max_N008;
float Port_Import_N267;
float Port_Import_N268;
float3 Port_Value_N001;
float Port_Import_N285;
float3 Port_Import_N284;
float3 Port_Import_N013;
float3 Port_Import_N016;
float4 Port_Import_N037;
float4 Port_Import_N042;
float Port_Min_N043;
float Port_Max_N043;
float Port_Import_N041;
float Port_Import_N059;
float Port_Import_N191;
float Port_Input0_N063;
float Port_Import_N185;
float Port_Import_N062;
float Port_Input1_N227;
float Port_Input2_N227;
float Port_Input0_N066;
float Port_Import_N188;
float Port_Import_N065;
float Port_Input1_N236;
float Port_Input2_N236;
float Port_Min_N038;
float Port_Max_N038;
float Port_Import_N251;
float Port_Min_N023;
float Port_Max_N023;
float Port_Import_N252;
float Port_Min_N125;
float Port_Max_N125;
float3 Port_Import_N161;
float Port_Import_N163;
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
param.CopyId=float(param_1/750);
param.SpawnIndex=-1.0;
param.SpawnIndexRemainder=-1.0;
param.SpawnAmount=0.0;
param.BurstAmount=0.0;
param.BurstPeriod=0.0;
param.NextBurstTime=0.0;
gParticle=param;
int param_2=InstanceID;
ssParticle param_3=gParticle;
int l9_0=param_2/750;
param_3.Spawned=false;
param_3.Dead=false;
param_3.Force=float3(0.0);
param_3.Index1D=param_2;
param_3.Index1DPerCopy=param_2%750;
param_3.Index1DPerCopyF=float(param_3.Index1DPerCopy);
param_3.StateID=(750*((param_2/750)+1))-1;
int l9_1=param_3.Index1D;
int2 l9_2=int2(l9_1%512,l9_1/512);
param_3.Index2D=l9_2;
int l9_3=param_3.Index1D;
float l9_4=(float(l9_3)+0.5)/750.0;
param_3.Coord1D=l9_4;
int2 l9_5=param_3.Index2D;
float2 l9_6=(float2(l9_5)+float2(0.5))/float2(512.0,2.0);
param_3.Coord2D=l9_6;
int l9_7=param_3.Index1D;
float l9_8=float(l9_7)/749.0;
param_3.Ratio1D=l9_8;
int l9_9=param_3.Index1DPerCopy;
float l9_10=float(l9_9)/749.0;
param_3.Ratio1DPerCopy=l9_10;
int2 l9_11=param_3.Index2D;
float2 l9_12=float2(l9_11)/float2(511.0,1.0);
param_3.Ratio2D=l9_12;
param_3.Seed=0.0;
int l9_13=param_3.Index1D;
int l9_14=l9_13;
int l9_15=((l9_14*((l9_14*1471343)+101146501))+1559861749)&2147483647;
int l9_16=l9_15;
float l9_17=float(l9_16)*4.6566129e-10;
float l9_18=l9_17;
param_3.TimeShift=l9_18;
param_3.SpawnOffset=param_3.Ratio1D*3.0;
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
l9_19.Seed+=(floor(((((l9_22-l9_19.SpawnOffset)-0.0)+0.0)+6.0)/3.0)*4.32723);
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
l9_46=!(UserUniforms.vfxBatchEnable[l9_47/750]!=0);
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
float param_34=3.0;
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
float param_37=3.0;
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
Globals.gComponentTime=(*sc_set0.UserUniforms).overrideTimeElapsed[l9_4/750];
Globals.gTimeDelta=fast::min((*sc_set0.UserUniforms).overrideTimeDelta,0.5);
Globals.gTimeElapsedShifted=(Globals.gTimeElapsed-(gParticle.TimeShift*Globals.gTimeDelta))-0.0;
float Delay=0.0;
float Warmup=0.0;
gParticle.Age=mod((Globals.gTimeElapsedShifted-gParticle.SpawnOffset)+Warmup,3.0);
float l9_5=Globals.gTimeElapsed;
float l9_6=gParticle.SpawnOffset;
float l9_7=Delay;
float l9_8=Warmup;
bool l9_9=(l9_5-l9_6)<(l9_7-l9_8);
bool l9_10;
if (!l9_9)
{
l9_10=gParticle.Age>3.0;
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
l9_14=mod(((fast::max(Globals.gTimeElapsed,0.1)-gParticle.SpawnOffset)-Delay)+Warmup,3.0)<=Globals.gTimeDelta;
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
l9_15.Seed+=(floor(((((l9_18-l9_15.SpawnOffset)-0.0)+0.0)+6.0)/3.0)*4.32723);
l9_15.Seed=fract(abs(l9_15.Seed));
int2 l9_19=int2(l9_15.Index1D%400,l9_15.Index1D/400);
l9_15.Seed2000=(float2(l9_19)+float2(1.0))/float2(399.0);
gParticle=l9_15;
float l9_20=27.0;
gParticle.Position=(float3(((floor(mod(gParticle.Index1DPerCopyF,floor(l9_20)))/l9_20)*2.0)-1.0,((floor(gParticle.Index1DPerCopyF/floor(l9_20))/l9_20)*2.0)-1.0,0.0)*20.0)+float3(1.0,1.0,0.0);
gParticle.Velocity=float3(0.0);
gParticle.Color=float4(1.0);
gParticle.Age=0.0;
gParticle.Life=3.0;
gParticle.Size=1.0;
gParticle.Mass=1.0;
gParticle.Matrix=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(0.0,0.0,1.0));
gParticle.Quaternion=float4(0.0,0.0,0.0,1.0);
float l9_21=0.0;
l9_21=param_1.gTimeElapsedShifted*(*sc_set0.UserUniforms).Port_Multiplier_N052;
float l9_22=0.0;
float l9_23=(*sc_set0.UserUniforms).burstDuration;
l9_22=l9_23;
float l9_24=0.0;
l9_24=float(l9_21>l9_22);
float l9_25=l9_24;
if ((l9_25*1.0)!=0.0)
{
gParticle.Dead=true;
}
float3 l9_26=float3(0.0);
l9_26=(*sc_set0.UserUniforms).Port_Import_N166;
float3 l9_27=float3(0.0);
l9_27=-l9_26;
float3 l9_28=float3(0.0);
float3 l9_29=l9_27;
float3 l9_30=l9_26;
ssGlobals l9_31=param_1;
int l9_32=3;
bool l9_33=true;
bool l9_34=true;
bool l9_35=true;
float l9_36=33.0;
ssParticle l9_37=gParticle;
float l9_38=0.0;
float l9_39=l9_31.gTimeElapsed;
float4 l9_40=float4(0.0);
float4 l9_41=float4(0.0);
if (l9_33)
{
l9_41.x=floor(fract(l9_39)*1000.0);
}
if (l9_35)
{
l9_41.y=float(l9_37.Index1D^((l9_37.Index1D*15299)+l9_37.Index1D));
}
if (l9_34)
{
l9_41.z=l9_36;
}
l9_41.w=l9_38*1000.0;
int l9_42=int(l9_41.x);
int l9_43=int(l9_41.y);
int l9_44=int(l9_41.z);
int l9_45=int(l9_41.w);
int l9_46=(((l9_42*15299)^(l9_43*30133))^(l9_44*17539))^(l9_45*12113);
int l9_47=l9_46;
if (l9_32==1)
{
int l9_48=l9_47;
int l9_49=l9_48;
int l9_50=((l9_49*((l9_49*1471343)+101146501))+1559861749)&2147483647;
int l9_51=l9_50;
float l9_52=float(l9_51)*4.6566129e-10;
float l9_53=l9_52;
l9_40.x=l9_53;
}
else
{
if (l9_32==2)
{
int l9_54=l9_47;
int l9_55=l9_54;
int l9_56=((l9_55*((l9_55*1471343)+101146501))+1559861749)&2147483647;
int l9_57=l9_56;
int l9_58=l9_54*1399;
int l9_59=((l9_58*((l9_58*1471343)+101146501))+1559861749)&2147483647;
int l9_60=l9_59;
int l9_61=l9_57;
float l9_62=float(l9_61)*4.6566129e-10;
int l9_63=l9_60;
float l9_64=float(l9_63)*4.6566129e-10;
float2 l9_65=float2(l9_62,l9_64);
l9_40=float4(l9_65.x,l9_65.y,l9_40.z,l9_40.w);
}
else
{
if (l9_32==3)
{
int l9_66=l9_47;
int l9_67=l9_66;
int l9_68=((l9_67*((l9_67*1471343)+101146501))+1559861749)&2147483647;
int l9_69=l9_68;
int l9_70=l9_66*1399;
int l9_71=((l9_70*((l9_70*1471343)+101146501))+1559861749)&2147483647;
int l9_72=l9_71;
int l9_73=l9_66*7177;
int l9_74=((l9_73*((l9_73*1471343)+101146501))+1559861749)&2147483647;
int l9_75=l9_74;
int l9_76=l9_69;
float l9_77=float(l9_76)*4.6566129e-10;
int l9_78=l9_72;
float l9_79=float(l9_78)*4.6566129e-10;
int l9_80=l9_75;
float l9_81=float(l9_80)*4.6566129e-10;
float3 l9_82=float3(l9_77,l9_79,l9_81);
l9_40=float4(l9_82.x,l9_82.y,l9_82.z,l9_40.w);
}
else
{
int l9_83=l9_47;
int l9_84=l9_83;
int l9_85=((l9_84*((l9_84*1471343)+101146501))+1559861749)&2147483647;
int l9_86=l9_85;
int l9_87=l9_83*1399;
int l9_88=((l9_87*((l9_87*1471343)+101146501))+1559861749)&2147483647;
int l9_89=l9_88;
int l9_90=l9_83*7177;
int l9_91=((l9_90*((l9_90*1471343)+101146501))+1559861749)&2147483647;
int l9_92=l9_91;
int l9_93=l9_83*18919;
int l9_94=((l9_93*((l9_93*1471343)+101146501))+1559861749)&2147483647;
int l9_95=l9_94;
int l9_96=l9_86;
float l9_97=float(l9_96)*4.6566129e-10;
int l9_98=l9_89;
float l9_99=float(l9_98)*4.6566129e-10;
int l9_100=l9_92;
float l9_101=float(l9_100)*4.6566129e-10;
int l9_102=l9_95;
float l9_103=float(l9_102)*4.6566129e-10;
float4 l9_104=float4(l9_97,l9_99,l9_101,l9_103);
l9_40=l9_104;
}
}
}
float4 l9_105=l9_40;
float4 l9_106=l9_105;
float3 l9_107=mix(l9_29,l9_30,l9_106.xyz);
l9_28=l9_107;
float3 l9_108=float3(0.0);
l9_108=(*sc_set0.UserUniforms).Port_Import_N174;
float3 l9_109=float3(0.0);
l9_109=l9_28+l9_108;
gParticle.Position=l9_109;
float l9_110=0.0;
l9_110=(*sc_set0.UserUniforms).Port_Import_N003;
float l9_111=0.0;
l9_111=(*sc_set0.UserUniforms).Port_Import_N005;
float l9_112=0.0;
float l9_113=l9_110;
float l9_114=l9_111;
ssGlobals l9_115=param_1;
int l9_116=1;
bool l9_117=true;
bool l9_118=true;
bool l9_119=true;
float l9_120=9.0;
ssParticle l9_121=gParticle;
float l9_122=0.0;
float l9_123=l9_115.gTimeElapsed;
float4 l9_124=float4(0.0);
float4 l9_125=float4(0.0);
if (l9_117)
{
l9_125.x=floor(fract(l9_123)*1000.0);
}
if (l9_119)
{
l9_125.y=float(l9_121.Index1D^((l9_121.Index1D*15299)+l9_121.Index1D));
}
if (l9_118)
{
l9_125.z=l9_120;
}
l9_125.w=l9_122*1000.0;
int l9_126=int(l9_125.x);
int l9_127=int(l9_125.y);
int l9_128=int(l9_125.z);
int l9_129=int(l9_125.w);
int l9_130=(((l9_126*15299)^(l9_127*30133))^(l9_128*17539))^(l9_129*12113);
int l9_131=l9_130;
if (l9_116==1)
{
int l9_132=l9_131;
int l9_133=l9_132;
int l9_134=((l9_133*((l9_133*1471343)+101146501))+1559861749)&2147483647;
int l9_135=l9_134;
float l9_136=float(l9_135)*4.6566129e-10;
float l9_137=l9_136;
l9_124.x=l9_137;
}
else
{
if (l9_116==2)
{
int l9_138=l9_131;
int l9_139=l9_138;
int l9_140=((l9_139*((l9_139*1471343)+101146501))+1559861749)&2147483647;
int l9_141=l9_140;
int l9_142=l9_138*1399;
int l9_143=((l9_142*((l9_142*1471343)+101146501))+1559861749)&2147483647;
int l9_144=l9_143;
int l9_145=l9_141;
float l9_146=float(l9_145)*4.6566129e-10;
int l9_147=l9_144;
float l9_148=float(l9_147)*4.6566129e-10;
float2 l9_149=float2(l9_146,l9_148);
l9_124=float4(l9_149.x,l9_149.y,l9_124.z,l9_124.w);
}
else
{
if (l9_116==3)
{
int l9_150=l9_131;
int l9_151=l9_150;
int l9_152=((l9_151*((l9_151*1471343)+101146501))+1559861749)&2147483647;
int l9_153=l9_152;
int l9_154=l9_150*1399;
int l9_155=((l9_154*((l9_154*1471343)+101146501))+1559861749)&2147483647;
int l9_156=l9_155;
int l9_157=l9_150*7177;
int l9_158=((l9_157*((l9_157*1471343)+101146501))+1559861749)&2147483647;
int l9_159=l9_158;
int l9_160=l9_153;
float l9_161=float(l9_160)*4.6566129e-10;
int l9_162=l9_156;
float l9_163=float(l9_162)*4.6566129e-10;
int l9_164=l9_159;
float l9_165=float(l9_164)*4.6566129e-10;
float3 l9_166=float3(l9_161,l9_163,l9_165);
l9_124=float4(l9_166.x,l9_166.y,l9_166.z,l9_124.w);
}
else
{
int l9_167=l9_131;
int l9_168=l9_167;
int l9_169=((l9_168*((l9_168*1471343)+101146501))+1559861749)&2147483647;
int l9_170=l9_169;
int l9_171=l9_167*1399;
int l9_172=((l9_171*((l9_171*1471343)+101146501))+1559861749)&2147483647;
int l9_173=l9_172;
int l9_174=l9_167*7177;
int l9_175=((l9_174*((l9_174*1471343)+101146501))+1559861749)&2147483647;
int l9_176=l9_175;
int l9_177=l9_167*18919;
int l9_178=((l9_177*((l9_177*1471343)+101146501))+1559861749)&2147483647;
int l9_179=l9_178;
int l9_180=l9_170;
float l9_181=float(l9_180)*4.6566129e-10;
int l9_182=l9_173;
float l9_183=float(l9_182)*4.6566129e-10;
int l9_184=l9_176;
float l9_185=float(l9_184)*4.6566129e-10;
int l9_186=l9_179;
float l9_187=float(l9_186)*4.6566129e-10;
float4 l9_188=float4(l9_181,l9_183,l9_185,l9_187);
l9_124=l9_188;
}
}
}
float4 l9_189=l9_124;
float4 l9_190=l9_189;
float l9_191=mix(l9_113,l9_114,l9_190.x);
l9_112=l9_191;
float l9_192=l9_112;
gParticle.Life=l9_192;
gParticle.Life=fast::clamp(gParticle.Life,0.1,3.0);
float l9_193=0.0;
float l9_194=(*sc_set0.UserUniforms).Port_Min_N008;
float l9_195=(*sc_set0.UserUniforms).Port_Max_N008;
ssGlobals l9_196=param_1;
int l9_197=1;
bool l9_198=true;
bool l9_199=true;
bool l9_200=true;
float l9_201=8.0;
ssParticle l9_202=gParticle;
float l9_203=0.0;
float l9_204=l9_196.gTimeElapsed;
float4 l9_205=float4(0.0);
float4 l9_206=float4(0.0);
if (l9_198)
{
l9_206.x=floor(fract(l9_204)*1000.0);
}
if (l9_200)
{
l9_206.y=float(l9_202.Index1D^((l9_202.Index1D*15299)+l9_202.Index1D));
}
if (l9_199)
{
l9_206.z=l9_201;
}
l9_206.w=l9_203*1000.0;
int l9_207=int(l9_206.x);
int l9_208=int(l9_206.y);
int l9_209=int(l9_206.z);
int l9_210=int(l9_206.w);
int l9_211=(((l9_207*15299)^(l9_208*30133))^(l9_209*17539))^(l9_210*12113);
int l9_212=l9_211;
if (l9_197==1)
{
int l9_213=l9_212;
int l9_214=l9_213;
int l9_215=((l9_214*((l9_214*1471343)+101146501))+1559861749)&2147483647;
int l9_216=l9_215;
float l9_217=float(l9_216)*4.6566129e-10;
float l9_218=l9_217;
l9_205.x=l9_218;
}
else
{
if (l9_197==2)
{
int l9_219=l9_212;
int l9_220=l9_219;
int l9_221=((l9_220*((l9_220*1471343)+101146501))+1559861749)&2147483647;
int l9_222=l9_221;
int l9_223=l9_219*1399;
int l9_224=((l9_223*((l9_223*1471343)+101146501))+1559861749)&2147483647;
int l9_225=l9_224;
int l9_226=l9_222;
float l9_227=float(l9_226)*4.6566129e-10;
int l9_228=l9_225;
float l9_229=float(l9_228)*4.6566129e-10;
float2 l9_230=float2(l9_227,l9_229);
l9_205=float4(l9_230.x,l9_230.y,l9_205.z,l9_205.w);
}
else
{
if (l9_197==3)
{
int l9_231=l9_212;
int l9_232=l9_231;
int l9_233=((l9_232*((l9_232*1471343)+101146501))+1559861749)&2147483647;
int l9_234=l9_233;
int l9_235=l9_231*1399;
int l9_236=((l9_235*((l9_235*1471343)+101146501))+1559861749)&2147483647;
int l9_237=l9_236;
int l9_238=l9_231*7177;
int l9_239=((l9_238*((l9_238*1471343)+101146501))+1559861749)&2147483647;
int l9_240=l9_239;
int l9_241=l9_234;
float l9_242=float(l9_241)*4.6566129e-10;
int l9_243=l9_237;
float l9_244=float(l9_243)*4.6566129e-10;
int l9_245=l9_240;
float l9_246=float(l9_245)*4.6566129e-10;
float3 l9_247=float3(l9_242,l9_244,l9_246);
l9_205=float4(l9_247.x,l9_247.y,l9_247.z,l9_205.w);
}
else
{
int l9_248=l9_212;
int l9_249=l9_248;
int l9_250=((l9_249*((l9_249*1471343)+101146501))+1559861749)&2147483647;
int l9_251=l9_250;
int l9_252=l9_248*1399;
int l9_253=((l9_252*((l9_252*1471343)+101146501))+1559861749)&2147483647;
int l9_254=l9_253;
int l9_255=l9_248*7177;
int l9_256=((l9_255*((l9_255*1471343)+101146501))+1559861749)&2147483647;
int l9_257=l9_256;
int l9_258=l9_248*18919;
int l9_259=((l9_258*((l9_258*1471343)+101146501))+1559861749)&2147483647;
int l9_260=l9_259;
int l9_261=l9_251;
float l9_262=float(l9_261)*4.6566129e-10;
int l9_263=l9_254;
float l9_264=float(l9_263)*4.6566129e-10;
int l9_265=l9_257;
float l9_266=float(l9_265)*4.6566129e-10;
int l9_267=l9_260;
float l9_268=float(l9_267)*4.6566129e-10;
float4 l9_269=float4(l9_262,l9_264,l9_266,l9_268);
l9_205=l9_269;
}
}
}
float4 l9_270=l9_205;
float4 l9_271=l9_270;
float l9_272=mix(l9_194,l9_195,l9_271.x);
l9_193=l9_272;
float l9_273=0.0;
l9_273=l9_193;
float l9_274=0.0;
l9_274=(*sc_set0.UserUniforms).Port_Import_N268;
float l9_275=0.0;
float l9_276=l9_273;
float l9_277=l9_274;
ssGlobals l9_278=param_1;
int l9_279=1;
bool l9_280=true;
bool l9_281=true;
bool l9_282=true;
float l9_283=269.0;
ssParticle l9_284=gParticle;
float l9_285=0.0;
float l9_286=l9_278.gTimeElapsed;
float4 l9_287=float4(0.0);
float4 l9_288=float4(0.0);
if (l9_280)
{
l9_288.x=floor(fract(l9_286)*1000.0);
}
if (l9_282)
{
l9_288.y=float(l9_284.Index1D^((l9_284.Index1D*15299)+l9_284.Index1D));
}
if (l9_281)
{
l9_288.z=l9_283;
}
l9_288.w=l9_285*1000.0;
int l9_289=int(l9_288.x);
int l9_290=int(l9_288.y);
int l9_291=int(l9_288.z);
int l9_292=int(l9_288.w);
int l9_293=(((l9_289*15299)^(l9_290*30133))^(l9_291*17539))^(l9_292*12113);
int l9_294=l9_293;
if (l9_279==1)
{
int l9_295=l9_294;
int l9_296=l9_295;
int l9_297=((l9_296*((l9_296*1471343)+101146501))+1559861749)&2147483647;
int l9_298=l9_297;
float l9_299=float(l9_298)*4.6566129e-10;
float l9_300=l9_299;
l9_287.x=l9_300;
}
else
{
if (l9_279==2)
{
int l9_301=l9_294;
int l9_302=l9_301;
int l9_303=((l9_302*((l9_302*1471343)+101146501))+1559861749)&2147483647;
int l9_304=l9_303;
int l9_305=l9_301*1399;
int l9_306=((l9_305*((l9_305*1471343)+101146501))+1559861749)&2147483647;
int l9_307=l9_306;
int l9_308=l9_304;
float l9_309=float(l9_308)*4.6566129e-10;
int l9_310=l9_307;
float l9_311=float(l9_310)*4.6566129e-10;
float2 l9_312=float2(l9_309,l9_311);
l9_287=float4(l9_312.x,l9_312.y,l9_287.z,l9_287.w);
}
else
{
if (l9_279==3)
{
int l9_313=l9_294;
int l9_314=l9_313;
int l9_315=((l9_314*((l9_314*1471343)+101146501))+1559861749)&2147483647;
int l9_316=l9_315;
int l9_317=l9_313*1399;
int l9_318=((l9_317*((l9_317*1471343)+101146501))+1559861749)&2147483647;
int l9_319=l9_318;
int l9_320=l9_313*7177;
int l9_321=((l9_320*((l9_320*1471343)+101146501))+1559861749)&2147483647;
int l9_322=l9_321;
int l9_323=l9_316;
float l9_324=float(l9_323)*4.6566129e-10;
int l9_325=l9_319;
float l9_326=float(l9_325)*4.6566129e-10;
int l9_327=l9_322;
float l9_328=float(l9_327)*4.6566129e-10;
float3 l9_329=float3(l9_324,l9_326,l9_328);
l9_287=float4(l9_329.x,l9_329.y,l9_329.z,l9_287.w);
}
else
{
int l9_330=l9_294;
int l9_331=l9_330;
int l9_332=((l9_331*((l9_331*1471343)+101146501))+1559861749)&2147483647;
int l9_333=l9_332;
int l9_334=l9_330*1399;
int l9_335=((l9_334*((l9_334*1471343)+101146501))+1559861749)&2147483647;
int l9_336=l9_335;
int l9_337=l9_330*7177;
int l9_338=((l9_337*((l9_337*1471343)+101146501))+1559861749)&2147483647;
int l9_339=l9_338;
int l9_340=l9_330*18919;
int l9_341=((l9_340*((l9_340*1471343)+101146501))+1559861749)&2147483647;
int l9_342=l9_341;
int l9_343=l9_333;
float l9_344=float(l9_343)*4.6566129e-10;
int l9_345=l9_336;
float l9_346=float(l9_345)*4.6566129e-10;
int l9_347=l9_339;
float l9_348=float(l9_347)*4.6566129e-10;
int l9_349=l9_342;
float l9_350=float(l9_349)*4.6566129e-10;
float4 l9_351=float4(l9_344,l9_346,l9_348,l9_350);
l9_287=l9_351;
}
}
}
float4 l9_352=l9_287;
float4 l9_353=l9_352;
float l9_354=mix(l9_276,l9_277,l9_353.x);
l9_275=l9_354;
gParticle.Size=l9_275;
gParticle.Velocity=(*sc_set0.UserUniforms).Port_Value_N001;
float l9_355=0.0;
l9_355=(*sc_set0.UserUniforms).Port_Import_N285;
float3 l9_356=float3(0.0);
l9_356=(*sc_set0.UserUniforms).Port_Import_N284;
float3 l9_357=float3(0.0);
l9_357=gParticle.Position;
float3 l9_358=float3(0.0);
l9_358=l9_356-l9_357;
float3 l9_359=float3(0.0);
float3 l9_360=l9_358;
float l9_361=dot(l9_360,l9_360);
float l9_362;
if (l9_361>0.0)
{
l9_362=1.0/sqrt(l9_361);
}
else
{
l9_362=0.0;
}
float l9_363=l9_362;
float3 l9_364=l9_360*l9_363;
l9_359=l9_364;
float3 l9_365=float3(0.0);
l9_365=float3(l9_355)*l9_359;
gParticle.Force+=l9_365;
float3 l9_366=float3(0.0);
l9_366=gParticle.Position;
float3 l9_367=float3(0.0);
float3 l9_368=l9_366;
float l9_369=dot(l9_368,l9_368);
float l9_370;
if (l9_369>0.0)
{
l9_370=1.0/sqrt(l9_369);
}
else
{
l9_370=0.0;
}
float l9_371=l9_370;
float3 l9_372=l9_368*l9_371;
l9_367=l9_372;
float l9_373=0.0;
float l9_374=(*sc_set0.UserUniforms).explosionForce;
l9_373=l9_374;
float3 l9_375=float3(0.0);
l9_375=l9_367*float3(l9_373);
gParticle.Force=l9_375;
float3 l9_376=float3(0.0);
l9_376=(*sc_set0.UserUniforms).Port_Import_N013;
float3 l9_377=float3(0.0);
l9_377=(*sc_set0.UserUniforms).Port_Import_N016;
float3 l9_378=float3(0.0);
float3 l9_379=l9_376;
float3 l9_380=l9_377;
ssGlobals l9_381=param_1;
int l9_382=3;
bool l9_383=true;
bool l9_384=true;
bool l9_385=true;
float l9_386=17.0;
ssParticle l9_387=gParticle;
float l9_388=0.0;
float l9_389=l9_381.gTimeElapsed;
float4 l9_390=float4(0.0);
float4 l9_391=float4(0.0);
if (l9_383)
{
l9_391.x=floor(fract(l9_389)*1000.0);
}
if (l9_385)
{
l9_391.y=float(l9_387.Index1D^((l9_387.Index1D*15299)+l9_387.Index1D));
}
if (l9_384)
{
l9_391.z=l9_386;
}
l9_391.w=l9_388*1000.0;
int l9_392=int(l9_391.x);
int l9_393=int(l9_391.y);
int l9_394=int(l9_391.z);
int l9_395=int(l9_391.w);
int l9_396=(((l9_392*15299)^(l9_393*30133))^(l9_394*17539))^(l9_395*12113);
int l9_397=l9_396;
if (l9_382==1)
{
int l9_398=l9_397;
int l9_399=l9_398;
int l9_400=((l9_399*((l9_399*1471343)+101146501))+1559861749)&2147483647;
int l9_401=l9_400;
float l9_402=float(l9_401)*4.6566129e-10;
float l9_403=l9_402;
l9_390.x=l9_403;
}
else
{
if (l9_382==2)
{
int l9_404=l9_397;
int l9_405=l9_404;
int l9_406=((l9_405*((l9_405*1471343)+101146501))+1559861749)&2147483647;
int l9_407=l9_406;
int l9_408=l9_404*1399;
int l9_409=((l9_408*((l9_408*1471343)+101146501))+1559861749)&2147483647;
int l9_410=l9_409;
int l9_411=l9_407;
float l9_412=float(l9_411)*4.6566129e-10;
int l9_413=l9_410;
float l9_414=float(l9_413)*4.6566129e-10;
float2 l9_415=float2(l9_412,l9_414);
l9_390=float4(l9_415.x,l9_415.y,l9_390.z,l9_390.w);
}
else
{
if (l9_382==3)
{
int l9_416=l9_397;
int l9_417=l9_416;
int l9_418=((l9_417*((l9_417*1471343)+101146501))+1559861749)&2147483647;
int l9_419=l9_418;
int l9_420=l9_416*1399;
int l9_421=((l9_420*((l9_420*1471343)+101146501))+1559861749)&2147483647;
int l9_422=l9_421;
int l9_423=l9_416*7177;
int l9_424=((l9_423*((l9_423*1471343)+101146501))+1559861749)&2147483647;
int l9_425=l9_424;
int l9_426=l9_419;
float l9_427=float(l9_426)*4.6566129e-10;
int l9_428=l9_422;
float l9_429=float(l9_428)*4.6566129e-10;
int l9_430=l9_425;
float l9_431=float(l9_430)*4.6566129e-10;
float3 l9_432=float3(l9_427,l9_429,l9_431);
l9_390=float4(l9_432.x,l9_432.y,l9_432.z,l9_390.w);
}
else
{
int l9_433=l9_397;
int l9_434=l9_433;
int l9_435=((l9_434*((l9_434*1471343)+101146501))+1559861749)&2147483647;
int l9_436=l9_435;
int l9_437=l9_433*1399;
int l9_438=((l9_437*((l9_437*1471343)+101146501))+1559861749)&2147483647;
int l9_439=l9_438;
int l9_440=l9_433*7177;
int l9_441=((l9_440*((l9_440*1471343)+101146501))+1559861749)&2147483647;
int l9_442=l9_441;
int l9_443=l9_433*18919;
int l9_444=((l9_443*((l9_443*1471343)+101146501))+1559861749)&2147483647;
int l9_445=l9_444;
int l9_446=l9_436;
float l9_447=float(l9_446)*4.6566129e-10;
int l9_448=l9_439;
float l9_449=float(l9_448)*4.6566129e-10;
int l9_450=l9_442;
float l9_451=float(l9_450)*4.6566129e-10;
int l9_452=l9_445;
float l9_453=float(l9_452)*4.6566129e-10;
float4 l9_454=float4(l9_447,l9_449,l9_451,l9_453);
l9_390=l9_454;
}
}
}
float4 l9_455=l9_390;
float4 l9_456=l9_455;
float3 l9_457=mix(l9_379,l9_380,l9_456.xyz);
l9_378=l9_457;
float3x3 l9_458=float3x3(float3(0.0),float3(0.0),float3(0.0));
float3 l9_459=l9_378;
float l9_460=cos(radians(l9_459.x));
float l9_461=sin(radians(l9_459.x));
float l9_462=cos(radians(l9_459.y));
float l9_463=sin(radians(l9_459.y));
float l9_464=cos(radians(l9_459.z));
float l9_465=sin(radians(l9_459.z));
float3x3 l9_466=float3x3(float3(l9_462*l9_464,(l9_460*l9_465)+((l9_461*l9_463)*l9_464),(l9_461*l9_465)-((l9_460*l9_463)*l9_464)),float3((-l9_462)*l9_465,(l9_460*l9_464)-((l9_461*l9_463)*l9_465),(l9_461*l9_464)+((l9_460*l9_463)*l9_465)),float3(l9_463,(-l9_461)*l9_462,l9_460*l9_462));
l9_458=l9_466;
gParticle.Matrix=l9_458;
float4 l9_467=float4(0.0);
float4 l9_468=(*sc_set0.UserUniforms).Tweak_N79;
l9_467=l9_468;
float4 l9_469=float4(0.0);
l9_469=l9_467;
float4 l9_470=float4(0.0);
float4 l9_471=(*sc_set0.UserUniforms).Tweak_N80;
l9_470=l9_471;
float4 l9_472=float4(0.0);
l9_472=l9_470;
float l9_473=0.0;
float l9_474=(*sc_set0.UserUniforms).Port_Min_N043;
float l9_475=(*sc_set0.UserUniforms).Port_Max_N043;
ssGlobals l9_476=param_1;
int l9_477=1;
bool l9_478=true;
bool l9_479=true;
bool l9_480=true;
float l9_481=43.0;
ssParticle l9_482=gParticle;
float l9_483=0.0;
float l9_484=l9_476.gTimeElapsed;
float4 l9_485=float4(0.0);
float4 l9_486=float4(0.0);
if (l9_478)
{
l9_486.x=floor(fract(l9_484)*1000.0);
}
if (l9_480)
{
l9_486.y=float(l9_482.Index1D^((l9_482.Index1D*15299)+l9_482.Index1D));
}
if (l9_479)
{
l9_486.z=l9_481;
}
l9_486.w=l9_483*1000.0;
int l9_487=int(l9_486.x);
int l9_488=int(l9_486.y);
int l9_489=int(l9_486.z);
int l9_490=int(l9_486.w);
int l9_491=(((l9_487*15299)^(l9_488*30133))^(l9_489*17539))^(l9_490*12113);
int l9_492=l9_491;
if (l9_477==1)
{
int l9_493=l9_492;
int l9_494=l9_493;
int l9_495=((l9_494*((l9_494*1471343)+101146501))+1559861749)&2147483647;
int l9_496=l9_495;
float l9_497=float(l9_496)*4.6566129e-10;
float l9_498=l9_497;
l9_485.x=l9_498;
}
else
{
if (l9_477==2)
{
int l9_499=l9_492;
int l9_500=l9_499;
int l9_501=((l9_500*((l9_500*1471343)+101146501))+1559861749)&2147483647;
int l9_502=l9_501;
int l9_503=l9_499*1399;
int l9_504=((l9_503*((l9_503*1471343)+101146501))+1559861749)&2147483647;
int l9_505=l9_504;
int l9_506=l9_502;
float l9_507=float(l9_506)*4.6566129e-10;
int l9_508=l9_505;
float l9_509=float(l9_508)*4.6566129e-10;
float2 l9_510=float2(l9_507,l9_509);
l9_485=float4(l9_510.x,l9_510.y,l9_485.z,l9_485.w);
}
else
{
if (l9_477==3)
{
int l9_511=l9_492;
int l9_512=l9_511;
int l9_513=((l9_512*((l9_512*1471343)+101146501))+1559861749)&2147483647;
int l9_514=l9_513;
int l9_515=l9_511*1399;
int l9_516=((l9_515*((l9_515*1471343)+101146501))+1559861749)&2147483647;
int l9_517=l9_516;
int l9_518=l9_511*7177;
int l9_519=((l9_518*((l9_518*1471343)+101146501))+1559861749)&2147483647;
int l9_520=l9_519;
int l9_521=l9_514;
float l9_522=float(l9_521)*4.6566129e-10;
int l9_523=l9_517;
float l9_524=float(l9_523)*4.6566129e-10;
int l9_525=l9_520;
float l9_526=float(l9_525)*4.6566129e-10;
float3 l9_527=float3(l9_522,l9_524,l9_526);
l9_485=float4(l9_527.x,l9_527.y,l9_527.z,l9_485.w);
}
else
{
int l9_528=l9_492;
int l9_529=l9_528;
int l9_530=((l9_529*((l9_529*1471343)+101146501))+1559861749)&2147483647;
int l9_531=l9_530;
int l9_532=l9_528*1399;
int l9_533=((l9_532*((l9_532*1471343)+101146501))+1559861749)&2147483647;
int l9_534=l9_533;
int l9_535=l9_528*7177;
int l9_536=((l9_535*((l9_535*1471343)+101146501))+1559861749)&2147483647;
int l9_537=l9_536;
int l9_538=l9_528*18919;
int l9_539=((l9_538*((l9_538*1471343)+101146501))+1559861749)&2147483647;
int l9_540=l9_539;
int l9_541=l9_531;
float l9_542=float(l9_541)*4.6566129e-10;
int l9_543=l9_534;
float l9_544=float(l9_543)*4.6566129e-10;
int l9_545=l9_537;
float l9_546=float(l9_545)*4.6566129e-10;
int l9_547=l9_540;
float l9_548=float(l9_547)*4.6566129e-10;
float4 l9_549=float4(l9_542,l9_544,l9_546,l9_548);
l9_485=l9_549;
}
}
}
float4 l9_550=l9_485;
float4 l9_551=l9_550;
float l9_552=mix(l9_474,l9_475,l9_551.x);
l9_473=l9_552;
float4 l9_553=float4(0.0);
l9_553=mix(l9_469,l9_472,float4(l9_473));
gParticle.Color=l9_553;
gParticle.Velocity+=((gParticle.Force/float3(gParticle.Mass))*0.033330001);
gParticle.Force=float3(0.0);
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
float4 l9_554=param_2;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_555=dot(l9_554,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_556=l9_555;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_556;
}
}
float4 l9_557=float4(param_2.x,-param_2.y,(param_2.z*0.5)+(param_2.w*0.5),param_2.w);
out.gl_Position=l9_557;
return out;
}
float4 Value_N28=float4(0.0);
Value_N28=gParticle.Color;
float Value_N41=0.0;
Value_N41=(*sc_set0.UserUniforms).Port_Import_N041;
float Value_N59=0.0;
Value_N59=(*sc_set0.UserUniforms).Port_Import_N059;
float Value_N183=0.0;
Value_N183=fast::clamp(gParticle.Age/gParticle.Life,0.0,1.0);
float Value_N191=0.0;
Value_N191=Value_N183;
float Value_N185=0.0;
Value_N185=(*sc_set0.UserUniforms).Port_Import_N185;
float Value_N186=0.0;
Value_N186=gParticle.Life;
float Output_N187=0.0;
Output_N187=Value_N185/(Value_N186+1.234e-06);
float Value_N62=0.0;
Value_N62=Output_N187;
float Output_N63=0.0;
Output_N63=(*sc_set0.UserUniforms).Port_Input0_N063/(Value_N62+1.234e-06);
float Output_N64=0.0;
Output_N64=Value_N191*Output_N63;
float Output_N227=0.0;
Output_N227=fast::clamp(Output_N64+0.001,(*sc_set0.UserUniforms).Port_Input1_N227+0.001,(*sc_set0.UserUniforms).Port_Input2_N227+0.001)-0.001;
float Output_N232=0.0;
Output_N232=1.0-Value_N191;
float Value_N188=0.0;
Value_N188=(*sc_set0.UserUniforms).Port_Import_N188;
float Output_N189=0.0;
Output_N189=Value_N188/(Value_N186+1.234e-06);
float Value_N65=0.0;
Value_N65=Output_N189;
float Output_N66=0.0;
Output_N66=(*sc_set0.UserUniforms).Port_Input0_N066/(Value_N65+1.234e-06);
float Output_N73=0.0;
Output_N73=Output_N232*Output_N66;
float Output_N236=0.0;
Output_N236=fast::clamp(Output_N73+0.001,(*sc_set0.UserUniforms).Port_Input1_N236+0.001,(*sc_set0.UserUniforms).Port_Input2_N236+0.001)-0.001;
float Output_N74=0.0;
Output_N74=Output_N227*Output_N236;
float Export_N78=0.0;
Export_N78=Output_N74;
float Output_N239=0.0;
Output_N239=mix(Value_N41,Value_N59,Export_N78);
float4 Value_N242=float4(0.0);
Value_N242=float4(Value_N28.xyz.x,Value_N28.xyz.y,Value_N28.xyz.z,Value_N242.w);
Value_N242.w=Output_N239;
gParticle.Color=Value_N242;
float Random_N38=0.0;
float param_3=(*sc_set0.UserUniforms).Port_Min_N038;
float param_4=(*sc_set0.UserUniforms).Port_Max_N038;
ssGlobals param_6=Globals;
int l9_559=1;
bool l9_560=false;
bool l9_561=true;
bool l9_562=true;
float l9_563=38.0;
ssParticle l9_564=gParticle;
float l9_565=0.0;
float l9_566=param_6.gTimeElapsed;
float4 l9_567=float4(0.0);
float4 l9_568=float4(0.0);
if (l9_560)
{
l9_568.x=floor(fract(l9_566)*1000.0);
}
if (l9_562)
{
l9_568.y=float(l9_564.Index1D^((l9_564.Index1D*15299)+l9_564.Index1D));
}
if (l9_561)
{
l9_568.z=l9_563;
}
l9_568.w=l9_565*1000.0;
int l9_569=int(l9_568.x);
int l9_570=int(l9_568.y);
int l9_571=int(l9_568.z);
int l9_572=int(l9_568.w);
int l9_573=(((l9_569*15299)^(l9_570*30133))^(l9_571*17539))^(l9_572*12113);
int l9_574=l9_573;
if (l9_559==1)
{
int l9_575=l9_574;
int l9_576=l9_575;
int l9_577=((l9_576*((l9_576*1471343)+101146501))+1559861749)&2147483647;
int l9_578=l9_577;
float l9_579=float(l9_578)*4.6566129e-10;
float l9_580=l9_579;
l9_567.x=l9_580;
}
else
{
if (l9_559==2)
{
int l9_581=l9_574;
int l9_582=l9_581;
int l9_583=((l9_582*((l9_582*1471343)+101146501))+1559861749)&2147483647;
int l9_584=l9_583;
int l9_585=l9_581*1399;
int l9_586=((l9_585*((l9_585*1471343)+101146501))+1559861749)&2147483647;
int l9_587=l9_586;
int l9_588=l9_584;
float l9_589=float(l9_588)*4.6566129e-10;
int l9_590=l9_587;
float l9_591=float(l9_590)*4.6566129e-10;
float2 l9_592=float2(l9_589,l9_591);
l9_567=float4(l9_592.x,l9_592.y,l9_567.z,l9_567.w);
}
else
{
if (l9_559==3)
{
int l9_593=l9_574;
int l9_594=l9_593;
int l9_595=((l9_594*((l9_594*1471343)+101146501))+1559861749)&2147483647;
int l9_596=l9_595;
int l9_597=l9_593*1399;
int l9_598=((l9_597*((l9_597*1471343)+101146501))+1559861749)&2147483647;
int l9_599=l9_598;
int l9_600=l9_593*7177;
int l9_601=((l9_600*((l9_600*1471343)+101146501))+1559861749)&2147483647;
int l9_602=l9_601;
int l9_603=l9_596;
float l9_604=float(l9_603)*4.6566129e-10;
int l9_605=l9_599;
float l9_606=float(l9_605)*4.6566129e-10;
int l9_607=l9_602;
float l9_608=float(l9_607)*4.6566129e-10;
float3 l9_609=float3(l9_604,l9_606,l9_608);
l9_567=float4(l9_609.x,l9_609.y,l9_609.z,l9_567.w);
}
else
{
int l9_610=l9_574;
int l9_611=l9_610;
int l9_612=((l9_611*((l9_611*1471343)+101146501))+1559861749)&2147483647;
int l9_613=l9_612;
int l9_614=l9_610*1399;
int l9_615=((l9_614*((l9_614*1471343)+101146501))+1559861749)&2147483647;
int l9_616=l9_615;
int l9_617=l9_610*7177;
int l9_618=((l9_617*((l9_617*1471343)+101146501))+1559861749)&2147483647;
int l9_619=l9_618;
int l9_620=l9_610*18919;
int l9_621=((l9_620*((l9_620*1471343)+101146501))+1559861749)&2147483647;
int l9_622=l9_621;
int l9_623=l9_613;
float l9_624=float(l9_623)*4.6566129e-10;
int l9_625=l9_616;
float l9_626=float(l9_625)*4.6566129e-10;
int l9_627=l9_619;
float l9_628=float(l9_627)*4.6566129e-10;
int l9_629=l9_622;
float l9_630=float(l9_629)*4.6566129e-10;
float4 l9_631=float4(l9_624,l9_626,l9_628,l9_630);
l9_567=l9_631;
}
}
}
float4 l9_632=l9_567;
float4 l9_633=l9_632;
float param_5=mix(param_3,param_4,l9_633.x);
Random_N38=param_5;
float Value_N251=0.0;
Value_N251=Random_N38;
float Random_N23=0.0;
float param_7=(*sc_set0.UserUniforms).Port_Min_N023;
float param_8=(*sc_set0.UserUniforms).Port_Max_N023;
ssGlobals param_10=Globals;
int l9_634=1;
bool l9_635=false;
bool l9_636=true;
bool l9_637=true;
float l9_638=23.0;
ssParticle l9_639=gParticle;
float l9_640=0.0;
float l9_641=param_10.gTimeElapsed;
float4 l9_642=float4(0.0);
float4 l9_643=float4(0.0);
if (l9_635)
{
l9_643.x=floor(fract(l9_641)*1000.0);
}
if (l9_637)
{
l9_643.y=float(l9_639.Index1D^((l9_639.Index1D*15299)+l9_639.Index1D));
}
if (l9_636)
{
l9_643.z=l9_638;
}
l9_643.w=l9_640*1000.0;
int l9_644=int(l9_643.x);
int l9_645=int(l9_643.y);
int l9_646=int(l9_643.z);
int l9_647=int(l9_643.w);
int l9_648=(((l9_644*15299)^(l9_645*30133))^(l9_646*17539))^(l9_647*12113);
int l9_649=l9_648;
if (l9_634==1)
{
int l9_650=l9_649;
int l9_651=l9_650;
int l9_652=((l9_651*((l9_651*1471343)+101146501))+1559861749)&2147483647;
int l9_653=l9_652;
float l9_654=float(l9_653)*4.6566129e-10;
float l9_655=l9_654;
l9_642.x=l9_655;
}
else
{
if (l9_634==2)
{
int l9_656=l9_649;
int l9_657=l9_656;
int l9_658=((l9_657*((l9_657*1471343)+101146501))+1559861749)&2147483647;
int l9_659=l9_658;
int l9_660=l9_656*1399;
int l9_661=((l9_660*((l9_660*1471343)+101146501))+1559861749)&2147483647;
int l9_662=l9_661;
int l9_663=l9_659;
float l9_664=float(l9_663)*4.6566129e-10;
int l9_665=l9_662;
float l9_666=float(l9_665)*4.6566129e-10;
float2 l9_667=float2(l9_664,l9_666);
l9_642=float4(l9_667.x,l9_667.y,l9_642.z,l9_642.w);
}
else
{
if (l9_634==3)
{
int l9_668=l9_649;
int l9_669=l9_668;
int l9_670=((l9_669*((l9_669*1471343)+101146501))+1559861749)&2147483647;
int l9_671=l9_670;
int l9_672=l9_668*1399;
int l9_673=((l9_672*((l9_672*1471343)+101146501))+1559861749)&2147483647;
int l9_674=l9_673;
int l9_675=l9_668*7177;
int l9_676=((l9_675*((l9_675*1471343)+101146501))+1559861749)&2147483647;
int l9_677=l9_676;
int l9_678=l9_671;
float l9_679=float(l9_678)*4.6566129e-10;
int l9_680=l9_674;
float l9_681=float(l9_680)*4.6566129e-10;
int l9_682=l9_677;
float l9_683=float(l9_682)*4.6566129e-10;
float3 l9_684=float3(l9_679,l9_681,l9_683);
l9_642=float4(l9_684.x,l9_684.y,l9_684.z,l9_642.w);
}
else
{
int l9_685=l9_649;
int l9_686=l9_685;
int l9_687=((l9_686*((l9_686*1471343)+101146501))+1559861749)&2147483647;
int l9_688=l9_687;
int l9_689=l9_685*1399;
int l9_690=((l9_689*((l9_689*1471343)+101146501))+1559861749)&2147483647;
int l9_691=l9_690;
int l9_692=l9_685*7177;
int l9_693=((l9_692*((l9_692*1471343)+101146501))+1559861749)&2147483647;
int l9_694=l9_693;
int l9_695=l9_685*18919;
int l9_696=((l9_695*((l9_695*1471343)+101146501))+1559861749)&2147483647;
int l9_697=l9_696;
int l9_698=l9_688;
float l9_699=float(l9_698)*4.6566129e-10;
int l9_700=l9_691;
float l9_701=float(l9_700)*4.6566129e-10;
int l9_702=l9_694;
float l9_703=float(l9_702)*4.6566129e-10;
int l9_704=l9_697;
float l9_705=float(l9_704)*4.6566129e-10;
float4 l9_706=float4(l9_699,l9_701,l9_703,l9_705);
l9_642=l9_706;
}
}
}
float4 l9_707=l9_642;
float4 l9_708=l9_707;
float param_9=mix(param_7,param_8,l9_708.x);
Random_N23=param_9;
float Value_N252=0.0;
Value_N252=Random_N23;
float Value_N47=0.0;
Value_N47=fast::clamp(gParticle.Age/gParticle.Life,0.0,1.0);
float Output_N48=0.0;
Output_N48=mix(Value_N251,Value_N252,Value_N47);
gParticle.Size=Output_N48;
float3x3 ValueMatrix_N156=float3x3(float3(0.0),float3(0.0),float3(0.0));
ValueMatrix_N156=gParticle.Matrix;
float Random_N125=0.0;
float param_11=(*sc_set0.UserUniforms).Port_Min_N125;
float param_12=(*sc_set0.UserUniforms).Port_Max_N125;
ssGlobals param_14=Globals;
int l9_709=1;
bool l9_710=false;
bool l9_711=true;
bool l9_712=true;
float l9_713=125.0;
ssParticle l9_714=gParticle;
float l9_715=0.0;
float l9_716=param_14.gTimeElapsed;
float4 l9_717=float4(0.0);
float4 l9_718=float4(0.0);
if (l9_710)
{
l9_718.x=floor(fract(l9_716)*1000.0);
}
if (l9_712)
{
l9_718.y=float(l9_714.Index1D^((l9_714.Index1D*15299)+l9_714.Index1D));
}
if (l9_711)
{
l9_718.z=l9_713;
}
l9_718.w=l9_715*1000.0;
int l9_719=int(l9_718.x);
int l9_720=int(l9_718.y);
int l9_721=int(l9_718.z);
int l9_722=int(l9_718.w);
int l9_723=(((l9_719*15299)^(l9_720*30133))^(l9_721*17539))^(l9_722*12113);
int l9_724=l9_723;
if (l9_709==1)
{
int l9_725=l9_724;
int l9_726=l9_725;
int l9_727=((l9_726*((l9_726*1471343)+101146501))+1559861749)&2147483647;
int l9_728=l9_727;
float l9_729=float(l9_728)*4.6566129e-10;
float l9_730=l9_729;
l9_717.x=l9_730;
}
else
{
if (l9_709==2)
{
int l9_731=l9_724;
int l9_732=l9_731;
int l9_733=((l9_732*((l9_732*1471343)+101146501))+1559861749)&2147483647;
int l9_734=l9_733;
int l9_735=l9_731*1399;
int l9_736=((l9_735*((l9_735*1471343)+101146501))+1559861749)&2147483647;
int l9_737=l9_736;
int l9_738=l9_734;
float l9_739=float(l9_738)*4.6566129e-10;
int l9_740=l9_737;
float l9_741=float(l9_740)*4.6566129e-10;
float2 l9_742=float2(l9_739,l9_741);
l9_717=float4(l9_742.x,l9_742.y,l9_717.z,l9_717.w);
}
else
{
if (l9_709==3)
{
int l9_743=l9_724;
int l9_744=l9_743;
int l9_745=((l9_744*((l9_744*1471343)+101146501))+1559861749)&2147483647;
int l9_746=l9_745;
int l9_747=l9_743*1399;
int l9_748=((l9_747*((l9_747*1471343)+101146501))+1559861749)&2147483647;
int l9_749=l9_748;
int l9_750=l9_743*7177;
int l9_751=((l9_750*((l9_750*1471343)+101146501))+1559861749)&2147483647;
int l9_752=l9_751;
int l9_753=l9_746;
float l9_754=float(l9_753)*4.6566129e-10;
int l9_755=l9_749;
float l9_756=float(l9_755)*4.6566129e-10;
int l9_757=l9_752;
float l9_758=float(l9_757)*4.6566129e-10;
float3 l9_759=float3(l9_754,l9_756,l9_758);
l9_717=float4(l9_759.x,l9_759.y,l9_759.z,l9_717.w);
}
else
{
int l9_760=l9_724;
int l9_761=l9_760;
int l9_762=((l9_761*((l9_761*1471343)+101146501))+1559861749)&2147483647;
int l9_763=l9_762;
int l9_764=l9_760*1399;
int l9_765=((l9_764*((l9_764*1471343)+101146501))+1559861749)&2147483647;
int l9_766=l9_765;
int l9_767=l9_760*7177;
int l9_768=((l9_767*((l9_767*1471343)+101146501))+1559861749)&2147483647;
int l9_769=l9_768;
int l9_770=l9_760*18919;
int l9_771=((l9_770*((l9_770*1471343)+101146501))+1559861749)&2147483647;
int l9_772=l9_771;
int l9_773=l9_763;
float l9_774=float(l9_773)*4.6566129e-10;
int l9_775=l9_766;
float l9_776=float(l9_775)*4.6566129e-10;
int l9_777=l9_769;
float l9_778=float(l9_777)*4.6566129e-10;
int l9_779=l9_772;
float l9_780=float(l9_779)*4.6566129e-10;
float4 l9_781=float4(l9_774,l9_776,l9_778,l9_780);
l9_717=l9_781;
}
}
}
float4 l9_782=l9_717;
float4 l9_783=l9_782;
float param_13=mix(param_11,param_12,l9_783.x);
Random_N125=param_13;
float3 Output_N4=float3(0.0);
Output_N4=float3(0.0,0.0,Random_N125);
float3 Value_N161=float3(0.0);
Value_N161=Output_N4;
float3 Output_N162=float3(0.0);
float3 param_15=Value_N161;
float l9_784=dot(param_15,param_15);
float l9_785;
if (l9_784>0.0)
{
l9_785=1.0/sqrt(l9_784);
}
else
{
l9_785=0.0;
}
float l9_786=l9_785;
float3 param_16=param_15*l9_786;
Output_N162=param_16;
float Value_N163=0.0;
Value_N163=(*sc_set0.UserUniforms).Port_Import_N163;
float3x3 Matrix_N164=float3x3(float3(0.0),float3(0.0),float3(0.0));
float3 param_17=Output_N162;
float param_18=Value_N163;
float3 l9_787=normalize(param_17);
float l9_788=sin(radians(param_18));
float l9_789=cos(radians(param_18));
float l9_790=1.0-l9_789;
float3x3 param_19=float3x3(float3(((l9_790*l9_787.x)*l9_787.x)+l9_789,((l9_790*l9_787.x)*l9_787.y)-(l9_787.z*l9_788),((l9_790*l9_787.z)*l9_787.x)+(l9_787.y*l9_788)),float3(((l9_790*l9_787.x)*l9_787.y)+(l9_787.z*l9_788),((l9_790*l9_787.y)*l9_787.y)+l9_789,((l9_790*l9_787.y)*l9_787.z)-(l9_787.x*l9_788)),float3(((l9_790*l9_787.z)*l9_787.x)-(l9_787.y*l9_788),((l9_790*l9_787.y)*l9_787.z)+(l9_787.x*l9_788),((l9_790*l9_787.z)*l9_787.z)+l9_789));
Matrix_N164=param_19;
float3x3 Output_N165=float3x3(float3(0.0),float3(0.0),float3(0.0));
Output_N165=ValueMatrix_N156*Matrix_N164;
gParticle.Matrix=Output_N165;
float3x3 param_20=gParticle.Matrix;
gParticle.Quaternion=matrixToQuaternion(param_20);
float Drift=0.0049999999;
if (gParticle.Dead)
{
float4 param_21=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_21.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_791=param_21;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_792=dot(l9_791,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_793=l9_792;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_793;
}
}
float4 l9_794=float4(param_21.x,-param_21.y,(param_21.z*0.5)+(param_21.w*0.5),param_21.w);
out.gl_Position=l9_794;
return out;
}
float l9_795;
if (abs(gParticle.Force.x)<Drift)
{
l9_795=0.0;
}
else
{
l9_795=gParticle.Force.x;
}
gParticle.Force.x=l9_795;
float l9_796;
if (abs(gParticle.Force.y)<Drift)
{
l9_796=0.0;
}
else
{
l9_796=gParticle.Force.y;
}
gParticle.Force.y=l9_796;
float l9_797;
if (abs(gParticle.Force.z)<Drift)
{
l9_797=0.0;
}
else
{
l9_797=gParticle.Force.z;
}
gParticle.Force.z=l9_797;
gParticle.Mass=fast::max(Drift,gParticle.Mass);
if (Globals.gTimeDelta!=0.0)
{
gParticle.Velocity+=((gParticle.Force/float3(gParticle.Mass))*Globals.gTimeDelta);
}
float l9_798;
if (abs(gParticle.Velocity.x)<Drift)
{
l9_798=0.0;
}
else
{
l9_798=gParticle.Velocity.x;
}
gParticle.Velocity.x=l9_798;
float l9_799;
if (abs(gParticle.Velocity.y)<Drift)
{
l9_799=0.0;
}
else
{
l9_799=gParticle.Velocity.y;
}
gParticle.Velocity.y=l9_799;
float l9_800;
if (abs(gParticle.Velocity.z)<Drift)
{
l9_800=0.0;
}
else
{
l9_800=gParticle.Velocity.z;
}
gParticle.Velocity.z=l9_800;
gParticle.Position+=(gParticle.Velocity*Globals.gTimeDelta);
float2 QuadSize=float2(4.0,1.0)/float2(2048.0,(*sc_set0.UserUniforms).vfxTargetSizeWrite.y);
float2 Offset=float2(0.0);
int offsetID=(*sc_set0.UserUniforms).vfxOffsetInstancesWrite+ssInstanceID;
int particleRow=512;
Offset.x=float(offsetID%particleRow);
Offset.y=float(offsetID/particleRow);
Offset*=QuadSize;
float2 Vertex=float2(0.0);
float l9_801;
if (v.texture0.x<0.5)
{
l9_801=0.0;
}
else
{
l9_801=QuadSize.x;
}
Vertex.x=l9_801;
float l9_802;
if (v.texture0.y<0.5)
{
l9_802=0.0;
}
else
{
l9_802=QuadSize.y;
}
Vertex.y=l9_802;
Vertex+=Offset;
float4 param_22=float4((Vertex*2.0)-float2(1.0),1.0,1.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_22.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_803=param_22;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_804=dot(l9_803,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_805=l9_804;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_805;
}
}
float4 l9_806=float4(param_22.x,-param_22.y,(param_22.z*0.5)+(param_22.w*0.5),param_22.w);
out.gl_Position=l9_806;
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
float4 param_23=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_23.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_807=param_23;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_808=dot(l9_807,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_809=l9_808;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_809;
}
}
float4 l9_810=float4(param_23.x,-param_23.y,(param_23.z*0.5)+(param_23.w*0.5),param_23.w);
out.gl_Position=l9_810;
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
float4 Tweak_N79;
float4 Tweak_N80;
float Port_Multiplier_N052;
float3 Port_Import_N166;
float3 Port_Import_N174;
float Port_Import_N003;
float Port_Import_N005;
float Port_Min_N008;
float Port_Max_N008;
float Port_Import_N267;
float Port_Import_N268;
float3 Port_Value_N001;
float Port_Import_N285;
float3 Port_Import_N284;
float3 Port_Import_N013;
float3 Port_Import_N016;
float4 Port_Import_N037;
float4 Port_Import_N042;
float Port_Min_N043;
float Port_Max_N043;
float Port_Import_N041;
float Port_Import_N059;
float Port_Import_N191;
float Port_Input0_N063;
float Port_Import_N185;
float Port_Import_N062;
float Port_Input1_N227;
float Port_Input2_N227;
float Port_Input0_N066;
float Port_Import_N188;
float Port_Import_N065;
float Port_Input1_N236;
float Port_Input2_N236;
float Port_Min_N038;
float Port_Max_N038;
float Port_Import_N251;
float Port_Min_N023;
float Port_Max_N023;
float Port_Import_N252;
float Port_Min_N125;
float Port_Max_N125;
float3 Port_Import_N161;
float Port_Import_N163;
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
float l9_128=3.0;
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
float l9_146=3.0;
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
