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
//ubo int UserUniforms 0:35:7568 {
//float4 sc_Time 1376
//float4 sc_UniformConstants 1392
//float4 sc_StereoClipPlanes 3664:[2]:16
//int overrideTimeEnabled 4108
//float overrideTimeElapsed 4112:[32]:4
//float overrideTimeDelta 4240
//bool vfxBatchEnable 4248:[32]:4
//bool vfxEmitParticle 4376:[32]:4
//float4x4 vfxModelMatrix 4512:[32]:64
//float3 vfxLocalAabbMin 6848
//float3 vfxLocalAabbMax 6864
//int vfxOffsetInstancesRead 7348
//int vfxOffsetInstancesWrite 7352
//float2 vfxTargetSizeRead 7360
//float2 vfxTargetSizeWrite 7368
//int vfxTargetWidth 7376
//float spawnAmount 7392
//float3 Port_Min_N005 7408
//float3 Port_Max_N005 7424
//float Port_Value_N031 7440
//float Port_Import_N011 7444
//float3 Port_Import_N037 7456
//float3 Port_Import_N038 7472
//float Port_Import_N041 7488
//float Port_Import_N017 7492
//float Port_Import_N023 7496
//float Port_Import_N132 7500
//float Port_Import_N133 7504
//float Port_Import_N053 7508
//float3 Port_Import_N054 7520
//float Port_Import_N126 7536
//float Port_Import_N127 7540
//float Port_Import_N128 7544
//float Port_Input4_N137 7548
//float Port_Multiplier_N272 7552
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
float spawnAmount;
float3 Port_Min_N005;
float3 Port_Max_N005;
float Port_Value_N031;
float Port_Import_N011;
float3 Port_Import_N037;
float3 Port_Import_N038;
float Port_Import_N041;
float Port_Import_N017;
float Port_Import_N023;
float Port_Import_N132;
float Port_Import_N133;
float Port_Import_N053;
float3 Port_Import_N054;
float Port_Import_N126;
float Port_Import_N127;
float Port_Import_N128;
float Port_Input4_N137;
float Port_Multiplier_N272;
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
float Interp_Particle_Mass [[user(locn22)]];
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
param.CopyId=float(param_1/201);
param.SpawnIndex=-1.0;
param.SpawnIndexRemainder=-1.0;
param.SpawnAmount=0.0;
param.BurstAmount=0.0;
param.BurstPeriod=0.0;
param.NextBurstTime=0.0;
gParticle=param;
int param_2=InstanceID;
ssParticle param_3=gParticle;
int l9_0=param_2/201;
param_3.Spawned=false;
param_3.Dead=false;
param_3.Force=float3(0.0);
param_3.Index1D=param_2;
param_3.Index1DPerCopy=param_2%201;
param_3.Index1DPerCopyF=float(param_3.Index1DPerCopy);
param_3.StateID=(201*((param_2/201)+1))-1;
int l9_1=param_3.Index1D;
int2 l9_2=int2(l9_1%201,l9_1/201);
param_3.Index2D=l9_2;
int l9_3=param_3.Index1D;
float l9_4=(float(l9_3)+0.5)/201.0;
param_3.Coord1D=l9_4;
int2 l9_5=param_3.Index2D;
float2 l9_6=(float2(l9_5)+float2(0.5))/float2(201.0,1.0);
param_3.Coord2D=l9_6;
int l9_7=param_3.Index1D;
float l9_8=float(l9_7)/200.0;
param_3.Ratio1D=l9_8;
int l9_9=param_3.Index1DPerCopy;
float l9_10=float(l9_9)/200.0;
param_3.Ratio1DPerCopy=l9_10;
int2 l9_11=param_3.Index2D;
float2 l9_12=float2(l9_11)/float2(200.0,1.0);
param_3.Ratio2D=l9_12;
param_3.Seed=0.0;
int l9_13=param_3.Index1D;
int l9_14=l9_13;
int l9_15=((l9_14*((l9_14*1471343)+101146501))+1559861749)&2147483647;
int l9_16=l9_15;
float l9_17=float(l9_16)*4.6566129e-10;
float l9_18=l9_17;
param_3.TimeShift=l9_18;
param_3.TimeShift=0.0;
param_3.SpawnOffset=floor(param_3.Index1DPerCopyF/400.0)*1.0;
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
l9_19.Seed+=(floor(((((l9_22-l9_19.SpawnOffset)-0.0)+0.0)+7200.0)/3600.0)*4.32723);
l9_19.Seed=fract(abs(l9_19.Seed));
int2 l9_23=int2(l9_19.Index1D%400,l9_19.Index1D/400);
l9_19.Seed2000=(float2(l9_23)+float2(1.0))/float2(399.0);
param_3=l9_19;
gParticle=param_3;
int offsetPixelId=(UserUniforms.vfxOffsetInstancesRead+InstanceID)*3;
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
l9_46=!(UserUniforms.vfxBatchEnable[l9_47/201]!=0);
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
float param_34=3600.0;
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
float param_37=3600.0;
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
float2 param_42=float2(Scalar0,Scalar1);
float param_43=0.0;
float param_44=100.0;
float2 l9_369=param_42;
float l9_370=param_43;
float l9_371=param_44;
float l9_372=0.99998999;
float2 l9_373=l9_369;
#if (1)
{
l9_373=floor((l9_373*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_374=dot(l9_373,float2(1.0,0.0039215689));
float l9_375=l9_374;
float l9_376=0.0;
float l9_377=l9_372;
float l9_378=l9_370;
float l9_379=l9_371;
float l9_380=l9_378+(((l9_375-l9_376)*(l9_379-l9_378))/(l9_377-l9_376));
float l9_381=l9_380;
float l9_382=l9_381;
gParticle.Size=l9_382;
float2 param_45=float2(Scalar2,Scalar3);
float param_46=-1.0;
float param_47=1.0;
float2 l9_383=param_45;
float l9_384=param_46;
float l9_385=param_47;
float l9_386=0.99998999;
float2 l9_387=l9_383;
#if (1)
{
l9_387=floor((l9_387*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_388=dot(l9_387,float2(1.0,0.0039215689));
float l9_389=l9_388;
float l9_390=0.0;
float l9_391=l9_386;
float l9_392=l9_384;
float l9_393=l9_385;
float l9_394=l9_392+(((l9_389-l9_390)*(l9_393-l9_392))/(l9_391-l9_390));
float l9_395=l9_394;
float l9_396=l9_395;
gParticle.Quaternion.x=l9_396;
float2 param_48=float2(Scalar4,Scalar5);
float param_49=-1.0;
float param_50=1.0;
float2 l9_397=param_48;
float l9_398=param_49;
float l9_399=param_50;
float l9_400=0.99998999;
float2 l9_401=l9_397;
#if (1)
{
l9_401=floor((l9_401*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_402=dot(l9_401,float2(1.0,0.0039215689));
float l9_403=l9_402;
float l9_404=0.0;
float l9_405=l9_400;
float l9_406=l9_398;
float l9_407=l9_399;
float l9_408=l9_406+(((l9_403-l9_404)*(l9_407-l9_406))/(l9_405-l9_404));
float l9_409=l9_408;
float l9_410=l9_409;
gParticle.Quaternion.y=l9_410;
float2 param_51=float2(Scalar6,Scalar7);
float param_52=-1.0;
float param_53=1.0;
float2 l9_411=param_51;
float l9_412=param_52;
float l9_413=param_53;
float l9_414=0.99998999;
float2 l9_415=l9_411;
#if (1)
{
l9_415=floor((l9_415*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_416=dot(l9_415,float2(1.0,0.0039215689));
float l9_417=l9_416;
float l9_418=0.0;
float l9_419=l9_414;
float l9_420=l9_412;
float l9_421=l9_413;
float l9_422=l9_420+(((l9_417-l9_418)*(l9_421-l9_420))/(l9_419-l9_418));
float l9_423=l9_422;
float l9_424=l9_423;
gParticle.Quaternion.z=l9_424;
float2 param_54=float2(Scalar8,Scalar9);
float param_55=-1.0;
float param_56=1.0;
float2 l9_425=param_54;
float l9_426=param_55;
float l9_427=param_56;
float l9_428=0.99998999;
float2 l9_429=l9_425;
#if (1)
{
l9_429=floor((l9_429*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_430=dot(l9_429,float2(1.0,0.0039215689));
float l9_431=l9_430;
float l9_432=0.0;
float l9_433=l9_428;
float l9_434=l9_426;
float l9_435=l9_427;
float l9_436=l9_434+(((l9_431-l9_432)*(l9_435-l9_434))/(l9_433-l9_432));
float l9_437=l9_436;
float l9_438=l9_437;
gParticle.Quaternion.w=l9_438;
float2 param_57=float2(Scalar10,Scalar11);
float param_58=0.0;
float param_59=100.0;
float2 l9_439=param_57;
float l9_440=param_58;
float l9_441=param_59;
float l9_442=0.99998999;
float2 l9_443=l9_439;
#if (1)
{
l9_443=floor((l9_443*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_444=dot(l9_443,float2(1.0,0.0039215689));
float l9_445=l9_444;
float l9_446=0.0;
float l9_447=l9_442;
float l9_448=l9_440;
float l9_449=l9_441;
float l9_450=l9_448+(((l9_445-l9_446)*(l9_449-l9_448))/(l9_447-l9_446));
float l9_451=l9_450;
float l9_452=l9_451;
gParticle.Mass=l9_452;
float param_60=Scalar12;
float param_61=0.0;
float param_62=1.00001;
float l9_453=param_60;
float l9_454=param_61;
float l9_455=param_62;
float l9_456=1.0;
float l9_457=l9_453;
#if (1)
{
l9_457=floor((l9_457*255.0)+0.5)/255.0;
}
#endif
float l9_458=l9_457;
float l9_459=l9_458;
float l9_460=0.0;
float l9_461=l9_456;
float l9_462=l9_454;
float l9_463=l9_455;
float l9_464=l9_462+(((l9_459-l9_460)*(l9_463-l9_462))/(l9_461-l9_460));
float l9_465=l9_464;
float l9_466=l9_465;
gParticle.Color.x=l9_466;
float param_63=Scalar13;
float param_64=0.0;
float param_65=1.00001;
float l9_467=param_63;
float l9_468=param_64;
float l9_469=param_65;
float l9_470=1.0;
float l9_471=l9_467;
#if (1)
{
l9_471=floor((l9_471*255.0)+0.5)/255.0;
}
#endif
float l9_472=l9_471;
float l9_473=l9_472;
float l9_474=0.0;
float l9_475=l9_470;
float l9_476=l9_468;
float l9_477=l9_469;
float l9_478=l9_476+(((l9_473-l9_474)*(l9_477-l9_476))/(l9_475-l9_474));
float l9_479=l9_478;
float l9_480=l9_479;
gParticle.Color.y=l9_480;
float param_66=Scalar14;
float param_67=0.0;
float param_68=1.00001;
float l9_481=param_66;
float l9_482=param_67;
float l9_483=param_68;
float l9_484=1.0;
float l9_485=l9_481;
#if (1)
{
l9_485=floor((l9_485*255.0)+0.5)/255.0;
}
#endif
float l9_486=l9_485;
float l9_487=l9_486;
float l9_488=0.0;
float l9_489=l9_484;
float l9_490=l9_482;
float l9_491=l9_483;
float l9_492=l9_490+(((l9_487-l9_488)*(l9_491-l9_490))/(l9_489-l9_488));
float l9_493=l9_492;
float l9_494=l9_493;
gParticle.Color.z=l9_494;
float param_69=Scalar15;
float param_70=0.0;
float param_71=1.00001;
float l9_495=param_69;
float l9_496=param_70;
float l9_497=param_71;
float l9_498=1.0;
float l9_499=l9_495;
#if (1)
{
l9_499=floor((l9_499*255.0)+0.5)/255.0;
}
#endif
float l9_500=l9_499;
float l9_501=l9_500;
float l9_502=0.0;
float l9_503=l9_498;
float l9_504=l9_496;
float l9_505=l9_497;
float l9_506=l9_504+(((l9_501-l9_502)*(l9_505-l9_504))/(l9_503-l9_502));
float l9_507=l9_506;
float l9_508=l9_507;
gParticle.Color.w=l9_508;
float4 param_72=gParticle.Quaternion;
param_72=normalize(param_72.yzwx);
float l9_509=param_72.x*param_72.x;
float l9_510=param_72.y*param_72.y;
float l9_511=param_72.z*param_72.z;
float l9_512=param_72.x*param_72.z;
float l9_513=param_72.x*param_72.y;
float l9_514=param_72.y*param_72.z;
float l9_515=param_72.w*param_72.x;
float l9_516=param_72.w*param_72.y;
float l9_517=param_72.w*param_72.z;
float3x3 l9_518=float3x3(float3(1.0-(2.0*(l9_510+l9_511)),2.0*(l9_513+l9_517),2.0*(l9_512-l9_516)),float3(2.0*(l9_513-l9_517),1.0-(2.0*(l9_509+l9_511)),2.0*(l9_514+l9_515)),float3(2.0*(l9_512+l9_516),2.0*(l9_514-l9_515),1.0-(2.0*(l9_509+l9_510))));
gParticle.Matrix=l9_518;
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
int N42_SphereType=0;
float N42_Radius=0.0;
float3 N42_Scale=float3(0.0);
float3 N42_Center=float3(0.0);
float N42_VolumeFill=0.0;
int N24_SizeMode=0;
float N24_InputStart=0.0;
float N24_InputEnd=0.0;
float N24_OutputStart=0.0;
float N24_OutputEnd=0.0;
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
int l9_4=((*sc_set0.UserUniforms).vfxOffsetInstancesRead+gParticle.StateID)*3;
int l9_5=l9_4;
int l9_6=(*sc_set0.UserUniforms).vfxTargetWidth;
int l9_7=l9_5-((l9_5/l9_6)*l9_6);
int2 l9_8=int2(l9_7,l9_4/(*sc_set0.UserUniforms).vfxTargetWidth);
float2 l9_9=(float2(l9_8)+float2(0.5))/float2(2048.0,(*sc_set0.UserUniforms).vfxTargetSizeRead.y);
float2 l9_10=float2(0.00048828125,0.0);
float2 l9_11=l9_9+l9_10;
float2 l9_12=l9_11;
float2 l9_13=l9_12;
int l9_14;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_15=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_15=0;
}
else
{
l9_15=gl_InstanceIndex%2;
}
int l9_16=l9_15;
l9_14=1-l9_16;
}
else
{
int l9_17=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_17=0;
}
else
{
l9_17=gl_InstanceIndex%2;
}
int l9_18=l9_17;
l9_14=l9_18;
}
int l9_19=l9_14;
float2 l9_20=l9_13;
int l9_21=renderTarget0Layout_tmp;
int l9_22=l9_19;
float2 l9_23=l9_20;
int l9_24=l9_21;
int l9_25=l9_22;
float3 l9_26=float3(0.0);
if (l9_24==0)
{
l9_26=float3(l9_23,0.0);
}
else
{
if (l9_24==1)
{
l9_26=float3(l9_23.x,(l9_23.y*0.5)+(0.5-(float(l9_25)*0.5)),0.0);
}
else
{
l9_26=float3(l9_23,float(l9_25));
}
}
float3 l9_27=l9_26;
float3 l9_28=l9_27;
float4 l9_29=sc_set0.renderTarget0.sample(sc_set0.renderTarget0SmpSC,l9_28.xy,level(0.0));
float4 l9_30=l9_29;
float4 l9_31=l9_30;
float4 l9_32=l9_31;
float2 l9_33=l9_11;
float2 l9_34=l9_33;
int l9_35;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_36=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_36=0;
}
else
{
l9_36=gl_InstanceIndex%2;
}
int l9_37=l9_36;
l9_35=1-l9_37;
}
else
{
int l9_38=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_38=0;
}
else
{
l9_38=gl_InstanceIndex%2;
}
int l9_39=l9_38;
l9_35=l9_39;
}
int l9_40=l9_35;
float2 l9_41=l9_34;
int l9_42=renderTarget1Layout_tmp;
int l9_43=l9_40;
float2 l9_44=l9_41;
int l9_45=l9_42;
int l9_46=l9_43;
float3 l9_47=float3(0.0);
if (l9_45==0)
{
l9_47=float3(l9_44,0.0);
}
else
{
if (l9_45==1)
{
l9_47=float3(l9_44.x,(l9_44.y*0.5)+(0.5-(float(l9_46)*0.5)),0.0);
}
else
{
l9_47=float3(l9_44,float(l9_46));
}
}
float3 l9_48=l9_47;
float3 l9_49=l9_48;
float4 l9_50=sc_set0.renderTarget1.sample(sc_set0.renderTarget1SmpSC,l9_49.xy,level(0.0));
float4 l9_51=l9_50;
float4 l9_52=l9_51;
float4 l9_53=l9_52;
float4 l9_54=l9_32;
float l9_55=-1.0;
float l9_56=500000.0;
float4 l9_57=l9_54;
float l9_58=l9_55;
float l9_59=l9_56;
float l9_60=0.99998999;
float4 l9_61=l9_57;
#if (1)
{
l9_61=floor((l9_61*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_62=dot(l9_61,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_63=l9_62;
float l9_64=0.0;
float l9_65=l9_60;
float l9_66=l9_58;
float l9_67=l9_59;
float l9_68=l9_66+(((l9_63-l9_64)*(l9_67-l9_66))/(l9_65-l9_64));
float l9_69=l9_68;
float l9_70=l9_69;
gParticle.SpawnIndex=l9_70;
float2 l9_71=l9_53.xy;
float l9_72=0.0;
float l9_73=300.0;
float2 l9_74=l9_71;
float l9_75=l9_72;
float l9_76=l9_73;
float l9_77=0.99998999;
float2 l9_78=l9_74;
#if (1)
{
l9_78=floor((l9_78*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_79=dot(l9_78,float2(1.0,0.0039215689));
float l9_80=l9_79;
float l9_81=0.0;
float l9_82=l9_77;
float l9_83=l9_75;
float l9_84=l9_76;
float l9_85=l9_83+(((l9_80-l9_81)*(l9_84-l9_83))/(l9_82-l9_81));
float l9_86=l9_85;
float l9_87=l9_86;
gParticle.NextBurstTime=l9_87;
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
int l9_88=gl_InstanceIndex;
Globals.gComponentTime=(*sc_set0.UserUniforms).overrideTimeElapsed[l9_88/201];
Globals.gTimeDelta=fast::min((*sc_set0.UserUniforms).overrideTimeDelta,0.5);
Globals.gTimeElapsedShifted=(Globals.gTimeElapsed-(gParticle.TimeShift*Globals.gTimeDelta))-0.0;
int l9_89=gl_InstanceIndex;
if ((*sc_set0.UserUniforms).vfxEmitParticle[l9_89/201]!=0)
{
ssGlobals param_1=Globals;
float l9_90=0.0;
float l9_91=(*sc_set0.UserUniforms).spawnAmount;
l9_90=l9_91;
gParticle.SpawnAmount+=fast::max(l9_90,0.0);
if (param_1.gTimeElapsed>=gParticle.NextBurstTime)
{
gParticle.NextBurstTime+=gParticle.BurstPeriod;
gParticle.SpawnAmount+=gParticle.BurstAmount;
}
gParticle.SpawnIndex+=gParticle.SpawnAmount;
gParticle.SpawnIndex=floor((gParticle.SpawnIndex*2000.0)+0.5)*0.00050000002;
if (gParticle.SpawnIndex>=200.0)
{
gParticle.SpawnIndexRemainder=mod(gParticle.SpawnIndex,200.0);
}
}
float l9_92=gParticle.Age;
bool l9_93=l9_92<=9.9999997e-05;
bool l9_94;
if (!l9_93)
{
l9_94=gParticle.Age>=(gParticle.Life-Globals.gTimeDelta);
}
else
{
l9_94=l9_93;
}
bool isSpawnCandidate=l9_94;
bool spawnWindowMin=gParticle.Index1DPerCopyF<=gParticle.SpawnIndex;
bool spawnWindowMax=gParticle.Index1DPerCopyF>=(gParticle.SpawnIndex-gParticle.SpawnAmount);
bool spawnRemainder=gParticle.Index1DPerCopyF<=gParticle.SpawnIndexRemainder;
bool l9_95=isSpawnCandidate;
bool l9_96;
if (l9_95)
{
l9_96=(spawnWindowMin&&spawnWindowMax)||spawnRemainder;
}
else
{
l9_96=l9_95;
}
if (l9_96)
{
ssGlobals param_2=Globals;
float l9_97=0.0;
l9_97=0.0;
float l9_98=0.0;
l9_98=(*sc_set0.UserUniforms).Port_Import_N011;
float3 l9_99=float3(0.0);
l9_99=(*sc_set0.UserUniforms).Port_Import_N037;
float3 l9_100=float3(0.0);
l9_100=(*sc_set0.UserUniforms).Port_Import_N038;
float l9_101=0.0;
l9_101=fast::clamp((*sc_set0.UserUniforms).Port_Import_N041,0.0,1.0);
float l9_102=l9_97;
float l9_103=l9_98;
float3 l9_104=l9_99;
float3 l9_105=l9_100;
float l9_106=l9_101;
ssGlobals l9_107=param_2;
ssParticle l9_108=gParticle;
int l9_109=int(gParticle.CopyId);
float l9_110;
if ((*sc_set0.UserUniforms).overrideTimeEnabled==1)
{
l9_110=(*sc_set0.UserUniforms).overrideTimeElapsed[l9_109];
}
else
{
l9_110=(*sc_set0.UserUniforms).sc_Time.x;
}
float l9_111=l9_110;
l9_108.Seed=(l9_108.Ratio1D*0.97637898)+0.151235;
l9_108.Seed+=(floor(((((l9_111-l9_108.SpawnOffset)-0.0)+0.0)+7200.0)/3600.0)*4.32723);
l9_108.Seed=fract(abs(l9_108.Seed));
int2 l9_112=int2(l9_108.Index1D%400,l9_108.Index1D/400);
l9_108.Seed2000=(float2(l9_112)+float2(1.0))/float2(399.0);
gParticle=l9_108;
float l9_113=14.0;
gParticle.Position=(float3(((floor(mod(gParticle.Index1DPerCopyF,floor(l9_113)))/l9_113)*2.0)-1.0,((floor(gParticle.Index1DPerCopyF/floor(l9_113))/l9_113)*2.0)-1.0,0.0)*20.0)+float3(1.0,1.0,0.0);
gParticle.Velocity=float3(0.0);
gParticle.Color=float4(1.0);
gParticle.Age=0.0;
gParticle.Life=16.0;
gParticle.Size=1.0;
gParticle.Mass=1.0;
gParticle.Matrix=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(0.0,0.0,1.0));
gParticle.Quaternion=float4(0.0,0.0,0.0,1.0);
float3 l9_114=float3(0.0);
float3 l9_115=(*sc_set0.UserUniforms).Port_Min_N005;
float3 l9_116=(*sc_set0.UserUniforms).Port_Max_N005;
ssGlobals l9_117=l9_107;
int l9_118=3;
bool l9_119=true;
bool l9_120=true;
bool l9_121=true;
float l9_122=5.0;
ssParticle l9_123=gParticle;
float l9_124=0.0;
float l9_125=l9_117.gTimeElapsed;
float4 l9_126=float4(0.0);
float4 l9_127=float4(0.0);
if (l9_119)
{
l9_127.x=floor(fract(l9_125)*1000.0);
}
if (l9_121)
{
l9_127.y=float(l9_123.Index1D^((l9_123.Index1D*15299)+l9_123.Index1D));
}
if (l9_120)
{
l9_127.z=l9_122;
}
l9_127.w=l9_124*1000.0;
int l9_128=int(l9_127.x);
int l9_129=int(l9_127.y);
int l9_130=int(l9_127.z);
int l9_131=int(l9_127.w);
int l9_132=(((l9_128*15299)^(l9_129*30133))^(l9_130*17539))^(l9_131*12113);
int l9_133=l9_132;
if (l9_118==1)
{
int l9_134=l9_133;
int l9_135=l9_134;
int l9_136=((l9_135*((l9_135*1471343)+101146501))+1559861749)&2147483647;
int l9_137=l9_136;
float l9_138=float(l9_137)*4.6566129e-10;
float l9_139=l9_138;
l9_126.x=l9_139;
}
else
{
if (l9_118==2)
{
int l9_140=l9_133;
int l9_141=l9_140;
int l9_142=((l9_141*((l9_141*1471343)+101146501))+1559861749)&2147483647;
int l9_143=l9_142;
int l9_144=l9_140*1399;
int l9_145=((l9_144*((l9_144*1471343)+101146501))+1559861749)&2147483647;
int l9_146=l9_145;
int l9_147=l9_143;
float l9_148=float(l9_147)*4.6566129e-10;
int l9_149=l9_146;
float l9_150=float(l9_149)*4.6566129e-10;
float2 l9_151=float2(l9_148,l9_150);
l9_126=float4(l9_151.x,l9_151.y,l9_126.z,l9_126.w);
}
else
{
if (l9_118==3)
{
int l9_152=l9_133;
int l9_153=l9_152;
int l9_154=((l9_153*((l9_153*1471343)+101146501))+1559861749)&2147483647;
int l9_155=l9_154;
int l9_156=l9_152*1399;
int l9_157=((l9_156*((l9_156*1471343)+101146501))+1559861749)&2147483647;
int l9_158=l9_157;
int l9_159=l9_152*7177;
int l9_160=((l9_159*((l9_159*1471343)+101146501))+1559861749)&2147483647;
int l9_161=l9_160;
int l9_162=l9_155;
float l9_163=float(l9_162)*4.6566129e-10;
int l9_164=l9_158;
float l9_165=float(l9_164)*4.6566129e-10;
int l9_166=l9_161;
float l9_167=float(l9_166)*4.6566129e-10;
float3 l9_168=float3(l9_163,l9_165,l9_167);
l9_126=float4(l9_168.x,l9_168.y,l9_168.z,l9_126.w);
}
else
{
int l9_169=l9_133;
int l9_170=l9_169;
int l9_171=((l9_170*((l9_170*1471343)+101146501))+1559861749)&2147483647;
int l9_172=l9_171;
int l9_173=l9_169*1399;
int l9_174=((l9_173*((l9_173*1471343)+101146501))+1559861749)&2147483647;
int l9_175=l9_174;
int l9_176=l9_169*7177;
int l9_177=((l9_176*((l9_176*1471343)+101146501))+1559861749)&2147483647;
int l9_178=l9_177;
int l9_179=l9_169*18919;
int l9_180=((l9_179*((l9_179*1471343)+101146501))+1559861749)&2147483647;
int l9_181=l9_180;
int l9_182=l9_172;
float l9_183=float(l9_182)*4.6566129e-10;
int l9_184=l9_175;
float l9_185=float(l9_184)*4.6566129e-10;
int l9_186=l9_178;
float l9_187=float(l9_186)*4.6566129e-10;
int l9_188=l9_181;
float l9_189=float(l9_188)*4.6566129e-10;
float4 l9_190=float4(l9_183,l9_185,l9_187,l9_189);
l9_126=l9_190;
}
}
}
float4 l9_191=l9_126;
float4 l9_192=l9_191;
float3 l9_193=mix(l9_115,l9_116,l9_192.xyz);
l9_114=l9_193;
gParticle.Color=float4(l9_114,0.0);
float l9_194=(*sc_set0.UserUniforms).Port_Value_N031;
gParticle.Life=l9_194;
gParticle.Life=fast::clamp(gParticle.Life,0.1,3600.0);
ssGlobals tempGlobals=l9_107;
N42_SphereType=int(l9_102);
N42_Radius=l9_103;
N42_Scale=l9_104;
N42_Center=l9_105;
N42_VolumeFill=l9_106;
bool l9_195=true;
bool l9_196=true;
bool l9_197=true;
float l9_198=0.0;
float3 l9_199=float3(0.0);
int l9_200=3;
bool l9_201=l9_197;
bool l9_202=l9_196;
bool l9_203=l9_195;
float l9_204=42.0;
ssParticle l9_205=gParticle;
float l9_206=l9_198;
float l9_207=tempGlobals.gTimeElapsed;
float4 l9_208=float4(0.0);
float4 l9_209=float4(0.0);
if (l9_201)
{
l9_209.x=floor(fract(l9_207)*1000.0);
}
if (l9_203)
{
l9_209.y=float(l9_205.Index1D^((l9_205.Index1D*15299)+l9_205.Index1D));
}
if (l9_202)
{
l9_209.z=l9_204;
}
l9_209.w=l9_206*1000.0;
int l9_210=int(l9_209.x);
int l9_211=int(l9_209.y);
int l9_212=int(l9_209.z);
int l9_213=int(l9_209.w);
int l9_214=(((l9_210*15299)^(l9_211*30133))^(l9_212*17539))^(l9_213*12113);
int l9_215=l9_214;
if (l9_200==1)
{
int l9_216=l9_215;
int l9_217=l9_216;
int l9_218=((l9_217*((l9_217*1471343)+101146501))+1559861749)&2147483647;
int l9_219=l9_218;
float l9_220=float(l9_219)*4.6566129e-10;
float l9_221=l9_220;
l9_208.x=l9_221;
}
else
{
if (l9_200==2)
{
int l9_222=l9_215;
int l9_223=l9_222;
int l9_224=((l9_223*((l9_223*1471343)+101146501))+1559861749)&2147483647;
int l9_225=l9_224;
int l9_226=l9_222*1399;
int l9_227=((l9_226*((l9_226*1471343)+101146501))+1559861749)&2147483647;
int l9_228=l9_227;
int l9_229=l9_225;
float l9_230=float(l9_229)*4.6566129e-10;
int l9_231=l9_228;
float l9_232=float(l9_231)*4.6566129e-10;
float2 l9_233=float2(l9_230,l9_232);
l9_208=float4(l9_233.x,l9_233.y,l9_208.z,l9_208.w);
}
else
{
if (l9_200==3)
{
int l9_234=l9_215;
int l9_235=l9_234;
int l9_236=((l9_235*((l9_235*1471343)+101146501))+1559861749)&2147483647;
int l9_237=l9_236;
int l9_238=l9_234*1399;
int l9_239=((l9_238*((l9_238*1471343)+101146501))+1559861749)&2147483647;
int l9_240=l9_239;
int l9_241=l9_234*7177;
int l9_242=((l9_241*((l9_241*1471343)+101146501))+1559861749)&2147483647;
int l9_243=l9_242;
int l9_244=l9_237;
float l9_245=float(l9_244)*4.6566129e-10;
int l9_246=l9_240;
float l9_247=float(l9_246)*4.6566129e-10;
int l9_248=l9_243;
float l9_249=float(l9_248)*4.6566129e-10;
float3 l9_250=float3(l9_245,l9_247,l9_249);
l9_208=float4(l9_250.x,l9_250.y,l9_250.z,l9_208.w);
}
else
{
int l9_251=l9_215;
int l9_252=l9_251;
int l9_253=((l9_252*((l9_252*1471343)+101146501))+1559861749)&2147483647;
int l9_254=l9_253;
int l9_255=l9_251*1399;
int l9_256=((l9_255*((l9_255*1471343)+101146501))+1559861749)&2147483647;
int l9_257=l9_256;
int l9_258=l9_251*7177;
int l9_259=((l9_258*((l9_258*1471343)+101146501))+1559861749)&2147483647;
int l9_260=l9_259;
int l9_261=l9_251*18919;
int l9_262=((l9_261*((l9_261*1471343)+101146501))+1559861749)&2147483647;
int l9_263=l9_262;
int l9_264=l9_254;
float l9_265=float(l9_264)*4.6566129e-10;
int l9_266=l9_257;
float l9_267=float(l9_266)*4.6566129e-10;
int l9_268=l9_260;
float l9_269=float(l9_268)*4.6566129e-10;
int l9_270=l9_263;
float l9_271=float(l9_270)*4.6566129e-10;
float4 l9_272=float4(l9_265,l9_267,l9_269,l9_271);
l9_208=l9_272;
}
}
}
float4 l9_273=l9_208;
l9_199=l9_273.xyz;
float3 l9_274=l9_199;
float3 l9_275=l9_274;
bool l9_276=true;
bool l9_277=true;
bool l9_278=true;
float l9_279=150.0;
float3 l9_280=float3(0.0);
int l9_281=3;
bool l9_282=l9_278;
bool l9_283=l9_277;
bool l9_284=l9_276;
float l9_285=42.0;
ssParticle l9_286=gParticle;
float l9_287=l9_279;
float l9_288=tempGlobals.gTimeElapsed;
float4 l9_289=float4(0.0);
float4 l9_290=float4(0.0);
if (l9_282)
{
l9_290.x=floor(fract(l9_288)*1000.0);
}
if (l9_284)
{
l9_290.y=float(l9_286.Index1D^((l9_286.Index1D*15299)+l9_286.Index1D));
}
if (l9_283)
{
l9_290.z=l9_285;
}
l9_290.w=l9_287*1000.0;
int l9_291=int(l9_290.x);
int l9_292=int(l9_290.y);
int l9_293=int(l9_290.z);
int l9_294=int(l9_290.w);
int l9_295=(((l9_291*15299)^(l9_292*30133))^(l9_293*17539))^(l9_294*12113);
int l9_296=l9_295;
if (l9_281==1)
{
int l9_297=l9_296;
int l9_298=l9_297;
int l9_299=((l9_298*((l9_298*1471343)+101146501))+1559861749)&2147483647;
int l9_300=l9_299;
float l9_301=float(l9_300)*4.6566129e-10;
float l9_302=l9_301;
l9_289.x=l9_302;
}
else
{
if (l9_281==2)
{
int l9_303=l9_296;
int l9_304=l9_303;
int l9_305=((l9_304*((l9_304*1471343)+101146501))+1559861749)&2147483647;
int l9_306=l9_305;
int l9_307=l9_303*1399;
int l9_308=((l9_307*((l9_307*1471343)+101146501))+1559861749)&2147483647;
int l9_309=l9_308;
int l9_310=l9_306;
float l9_311=float(l9_310)*4.6566129e-10;
int l9_312=l9_309;
float l9_313=float(l9_312)*4.6566129e-10;
float2 l9_314=float2(l9_311,l9_313);
l9_289=float4(l9_314.x,l9_314.y,l9_289.z,l9_289.w);
}
else
{
if (l9_281==3)
{
int l9_315=l9_296;
int l9_316=l9_315;
int l9_317=((l9_316*((l9_316*1471343)+101146501))+1559861749)&2147483647;
int l9_318=l9_317;
int l9_319=l9_315*1399;
int l9_320=((l9_319*((l9_319*1471343)+101146501))+1559861749)&2147483647;
int l9_321=l9_320;
int l9_322=l9_315*7177;
int l9_323=((l9_322*((l9_322*1471343)+101146501))+1559861749)&2147483647;
int l9_324=l9_323;
int l9_325=l9_318;
float l9_326=float(l9_325)*4.6566129e-10;
int l9_327=l9_321;
float l9_328=float(l9_327)*4.6566129e-10;
int l9_329=l9_324;
float l9_330=float(l9_329)*4.6566129e-10;
float3 l9_331=float3(l9_326,l9_328,l9_330);
l9_289=float4(l9_331.x,l9_331.y,l9_331.z,l9_289.w);
}
else
{
int l9_332=l9_296;
int l9_333=l9_332;
int l9_334=((l9_333*((l9_333*1471343)+101146501))+1559861749)&2147483647;
int l9_335=l9_334;
int l9_336=l9_332*1399;
int l9_337=((l9_336*((l9_336*1471343)+101146501))+1559861749)&2147483647;
int l9_338=l9_337;
int l9_339=l9_332*7177;
int l9_340=((l9_339*((l9_339*1471343)+101146501))+1559861749)&2147483647;
int l9_341=l9_340;
int l9_342=l9_332*18919;
int l9_343=((l9_342*((l9_342*1471343)+101146501))+1559861749)&2147483647;
int l9_344=l9_343;
int l9_345=l9_335;
float l9_346=float(l9_345)*4.6566129e-10;
int l9_347=l9_338;
float l9_348=float(l9_347)*4.6566129e-10;
int l9_349=l9_341;
float l9_350=float(l9_349)*4.6566129e-10;
int l9_351=l9_344;
float l9_352=float(l9_351)*4.6566129e-10;
float4 l9_353=float4(l9_346,l9_348,l9_350,l9_352);
l9_289=l9_353;
}
}
}
float4 l9_354=l9_289;
l9_280=l9_354.xyz;
float3 l9_355=l9_280;
float3 l9_356=l9_355;
float l9_357=1.0-N42_VolumeFill;
float l9_358=3.0;
float l9_359;
if (l9_357<=0.0)
{
l9_359=0.0;
}
else
{
l9_359=pow(l9_357,l9_358);
}
float l9_360=l9_359;
float l9_361=l9_360;
l9_275=mix(float3(l9_361),float3(1.0),l9_275);
float3 l9_362=l9_275;
float l9_363;
if (l9_362.x<=0.0)
{
l9_363=0.0;
}
else
{
l9_363=sqrt(l9_362.x);
}
float l9_364=l9_363;
float l9_365;
if (l9_362.y<=0.0)
{
l9_365=0.0;
}
else
{
l9_365=sqrt(l9_362.y);
}
float l9_366=l9_365;
float l9_367;
if (l9_362.z<=0.0)
{
l9_367=0.0;
}
else
{
l9_367=sqrt(l9_362.z);
}
float3 l9_368=float3(l9_364,l9_366,l9_367);
l9_275=l9_368;
l9_356=mix(float3(-1.0),float3(1.0),l9_356);
l9_356/=float3(length(l9_356+float3(9.9999997e-05)));
float3 l9_369=((l9_275*l9_356)*N42_Scale)*N42_Radius;
if (N42_SphereType==1)
{
l9_369.x=abs(l9_369.x);
}
else
{
if (N42_SphereType==2)
{
l9_369.y=abs(l9_369.y);
}
else
{
if (N42_SphereType==3)
{
l9_369.z=abs(l9_369.z);
}
}
}
l9_369+=N42_Center;
float3 l9_370=l9_369;
gParticle.Position=l9_370;
float l9_371=0.0;
l9_371=0.0;
float l9_372=0.0;
l9_372=(*sc_set0.UserUniforms).Port_Import_N017;
float l9_373=0.0;
l9_373=(*sc_set0.UserUniforms).Port_Import_N023;
float l9_374=0.0;
float l9_375=0.0;
float l9_376=l9_371;
float l9_377=l9_372;
float l9_378=l9_373;
ssGlobals l9_379=param_2;
tempGlobals=l9_379;
float l9_380=0.0;
float l9_381=0.0;
N24_SizeMode=int(l9_376);
N24_InputStart=l9_377;
N24_InputEnd=l9_378;
N24_OutputStart=N24_InputStart;
N24_OutputEnd=N24_InputEnd;
if (N24_SizeMode!=0)
{
float3 l9_382=(*sc_set0.UserUniforms).vfxLocalAabbMax;
float3 l9_383=(*sc_set0.UserUniforms).vfxLocalAabbMin;
float l9_384=length(l9_382-l9_383);
N24_OutputStart/=l9_384;
N24_OutputEnd/=l9_384;
}
l9_380=N24_OutputStart;
l9_381=N24_OutputEnd;
l9_374=l9_380;
l9_375=l9_381;
float l9_385=0.0;
float l9_386=l9_374;
float l9_387=l9_375;
ssGlobals l9_388=param_2;
int l9_389=1;
bool l9_390=false;
bool l9_391=true;
bool l9_392=true;
float l9_393=26.0;
ssParticle l9_394=gParticle;
float l9_395=0.0;
float l9_396=l9_388.gTimeElapsed;
float4 l9_397=float4(0.0);
float4 l9_398=float4(0.0);
if (l9_390)
{
l9_398.x=floor(fract(l9_396)*1000.0);
}
if (l9_392)
{
l9_398.y=float(l9_394.Index1D^((l9_394.Index1D*15299)+l9_394.Index1D));
}
if (l9_391)
{
l9_398.z=l9_393;
}
l9_398.w=l9_395*1000.0;
int l9_399=int(l9_398.x);
int l9_400=int(l9_398.y);
int l9_401=int(l9_398.z);
int l9_402=int(l9_398.w);
int l9_403=(((l9_399*15299)^(l9_400*30133))^(l9_401*17539))^(l9_402*12113);
int l9_404=l9_403;
if (l9_389==1)
{
int l9_405=l9_404;
int l9_406=l9_405;
int l9_407=((l9_406*((l9_406*1471343)+101146501))+1559861749)&2147483647;
int l9_408=l9_407;
float l9_409=float(l9_408)*4.6566129e-10;
float l9_410=l9_409;
l9_397.x=l9_410;
}
else
{
if (l9_389==2)
{
int l9_411=l9_404;
int l9_412=l9_411;
int l9_413=((l9_412*((l9_412*1471343)+101146501))+1559861749)&2147483647;
int l9_414=l9_413;
int l9_415=l9_411*1399;
int l9_416=((l9_415*((l9_415*1471343)+101146501))+1559861749)&2147483647;
int l9_417=l9_416;
int l9_418=l9_414;
float l9_419=float(l9_418)*4.6566129e-10;
int l9_420=l9_417;
float l9_421=float(l9_420)*4.6566129e-10;
float2 l9_422=float2(l9_419,l9_421);
l9_397=float4(l9_422.x,l9_422.y,l9_397.z,l9_397.w);
}
else
{
if (l9_389==3)
{
int l9_423=l9_404;
int l9_424=l9_423;
int l9_425=((l9_424*((l9_424*1471343)+101146501))+1559861749)&2147483647;
int l9_426=l9_425;
int l9_427=l9_423*1399;
int l9_428=((l9_427*((l9_427*1471343)+101146501))+1559861749)&2147483647;
int l9_429=l9_428;
int l9_430=l9_423*7177;
int l9_431=((l9_430*((l9_430*1471343)+101146501))+1559861749)&2147483647;
int l9_432=l9_431;
int l9_433=l9_426;
float l9_434=float(l9_433)*4.6566129e-10;
int l9_435=l9_429;
float l9_436=float(l9_435)*4.6566129e-10;
int l9_437=l9_432;
float l9_438=float(l9_437)*4.6566129e-10;
float3 l9_439=float3(l9_434,l9_436,l9_438);
l9_397=float4(l9_439.x,l9_439.y,l9_439.z,l9_397.w);
}
else
{
int l9_440=l9_404;
int l9_441=l9_440;
int l9_442=((l9_441*((l9_441*1471343)+101146501))+1559861749)&2147483647;
int l9_443=l9_442;
int l9_444=l9_440*1399;
int l9_445=((l9_444*((l9_444*1471343)+101146501))+1559861749)&2147483647;
int l9_446=l9_445;
int l9_447=l9_440*7177;
int l9_448=((l9_447*((l9_447*1471343)+101146501))+1559861749)&2147483647;
int l9_449=l9_448;
int l9_450=l9_440*18919;
int l9_451=((l9_450*((l9_450*1471343)+101146501))+1559861749)&2147483647;
int l9_452=l9_451;
int l9_453=l9_443;
float l9_454=float(l9_453)*4.6566129e-10;
int l9_455=l9_446;
float l9_456=float(l9_455)*4.6566129e-10;
int l9_457=l9_449;
float l9_458=float(l9_457)*4.6566129e-10;
int l9_459=l9_452;
float l9_460=float(l9_459)*4.6566129e-10;
float4 l9_461=float4(l9_454,l9_456,l9_458,l9_460);
l9_397=l9_461;
}
}
}
float4 l9_462=l9_397;
float4 l9_463=l9_462;
float l9_464=mix(l9_386,l9_387,l9_463.x);
l9_385=l9_464;
gParticle.Size=l9_385;
float l9_465=0.0;
l9_465=(*sc_set0.UserUniforms).Port_Import_N132;
float l9_466=0.0;
l9_466=(*sc_set0.UserUniforms).Port_Import_N133;
float l9_467=0.0;
float l9_468=l9_465;
float l9_469=l9_466;
ssGlobals l9_470=param_2;
int l9_471=1;
bool l9_472=true;
bool l9_473=true;
bool l9_474=true;
float l9_475=134.0;
ssParticle l9_476=gParticle;
float l9_477=0.0;
float l9_478=l9_470.gTimeElapsed;
float4 l9_479=float4(0.0);
float4 l9_480=float4(0.0);
if (l9_472)
{
l9_480.x=floor(fract(l9_478)*1000.0);
}
if (l9_474)
{
l9_480.y=float(l9_476.Index1D^((l9_476.Index1D*15299)+l9_476.Index1D));
}
if (l9_473)
{
l9_480.z=l9_475;
}
l9_480.w=l9_477*1000.0;
int l9_481=int(l9_480.x);
int l9_482=int(l9_480.y);
int l9_483=int(l9_480.z);
int l9_484=int(l9_480.w);
int l9_485=(((l9_481*15299)^(l9_482*30133))^(l9_483*17539))^(l9_484*12113);
int l9_486=l9_485;
if (l9_471==1)
{
int l9_487=l9_486;
int l9_488=l9_487;
int l9_489=((l9_488*((l9_488*1471343)+101146501))+1559861749)&2147483647;
int l9_490=l9_489;
float l9_491=float(l9_490)*4.6566129e-10;
float l9_492=l9_491;
l9_479.x=l9_492;
}
else
{
if (l9_471==2)
{
int l9_493=l9_486;
int l9_494=l9_493;
int l9_495=((l9_494*((l9_494*1471343)+101146501))+1559861749)&2147483647;
int l9_496=l9_495;
int l9_497=l9_493*1399;
int l9_498=((l9_497*((l9_497*1471343)+101146501))+1559861749)&2147483647;
int l9_499=l9_498;
int l9_500=l9_496;
float l9_501=float(l9_500)*4.6566129e-10;
int l9_502=l9_499;
float l9_503=float(l9_502)*4.6566129e-10;
float2 l9_504=float2(l9_501,l9_503);
l9_479=float4(l9_504.x,l9_504.y,l9_479.z,l9_479.w);
}
else
{
if (l9_471==3)
{
int l9_505=l9_486;
int l9_506=l9_505;
int l9_507=((l9_506*((l9_506*1471343)+101146501))+1559861749)&2147483647;
int l9_508=l9_507;
int l9_509=l9_505*1399;
int l9_510=((l9_509*((l9_509*1471343)+101146501))+1559861749)&2147483647;
int l9_511=l9_510;
int l9_512=l9_505*7177;
int l9_513=((l9_512*((l9_512*1471343)+101146501))+1559861749)&2147483647;
int l9_514=l9_513;
int l9_515=l9_508;
float l9_516=float(l9_515)*4.6566129e-10;
int l9_517=l9_511;
float l9_518=float(l9_517)*4.6566129e-10;
int l9_519=l9_514;
float l9_520=float(l9_519)*4.6566129e-10;
float3 l9_521=float3(l9_516,l9_518,l9_520);
l9_479=float4(l9_521.x,l9_521.y,l9_521.z,l9_479.w);
}
else
{
int l9_522=l9_486;
int l9_523=l9_522;
int l9_524=((l9_523*((l9_523*1471343)+101146501))+1559861749)&2147483647;
int l9_525=l9_524;
int l9_526=l9_522*1399;
int l9_527=((l9_526*((l9_526*1471343)+101146501))+1559861749)&2147483647;
int l9_528=l9_527;
int l9_529=l9_522*7177;
int l9_530=((l9_529*((l9_529*1471343)+101146501))+1559861749)&2147483647;
int l9_531=l9_530;
int l9_532=l9_522*18919;
int l9_533=((l9_532*((l9_532*1471343)+101146501))+1559861749)&2147483647;
int l9_534=l9_533;
int l9_535=l9_525;
float l9_536=float(l9_535)*4.6566129e-10;
int l9_537=l9_528;
float l9_538=float(l9_537)*4.6566129e-10;
int l9_539=l9_531;
float l9_540=float(l9_539)*4.6566129e-10;
int l9_541=l9_534;
float l9_542=float(l9_541)*4.6566129e-10;
float4 l9_543=float4(l9_536,l9_538,l9_540,l9_542);
l9_479=l9_543;
}
}
}
float4 l9_544=l9_479;
float4 l9_545=l9_544;
float l9_546=mix(l9_468,l9_469,l9_545.x);
l9_467=l9_546;
float l9_547=l9_467;
gParticle.Mass=l9_547;
gParticle.Mass=fast::max(9.9999997e-06,gParticle.Mass);
float l9_548=0.0;
l9_548=(*sc_set0.UserUniforms).Port_Import_N053;
float3 l9_549=float3(0.0);
l9_549=(*sc_set0.UserUniforms).Port_Import_N054;
float3 l9_550=float3(0.0);
l9_550=gParticle.Position;
float3 l9_551=float3(0.0);
l9_551=l9_549-l9_550;
float3 l9_552=float3(0.0);
float3 l9_553=l9_551;
float l9_554=dot(l9_553,l9_553);
float l9_555;
if (l9_554>0.0)
{
l9_555=1.0/sqrt(l9_554);
}
else
{
l9_555=0.0;
}
float l9_556=l9_555;
float3 l9_557=l9_553*l9_556;
l9_552=l9_557;
float3 l9_558=float3(0.0);
l9_558=float3(l9_548)*l9_552;
gParticle.Force+=l9_558;
gParticle.Velocity+=((gParticle.Force/float3(gParticle.Mass))*0.033330001);
gParticle.Force=float3(0.0);
int l9_559=gl_InstanceIndex;
gParticle.Position=((*sc_set0.UserUniforms).vfxModelMatrix[l9_559/201]*float4(gParticle.Position,1.0)).xyz;
int l9_560=gl_InstanceIndex;
int l9_561=l9_560/201;
gParticle.Velocity=float3x3((*sc_set0.UserUniforms).vfxModelMatrix[l9_561][0].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_561][1].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_561][2].xyz)*gParticle.Velocity;
int l9_562=gl_InstanceIndex;
int l9_563=l9_562/201;
gParticle.Force=float3x3((*sc_set0.UserUniforms).vfxModelMatrix[l9_563][0].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_563][1].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_563][2].xyz)*gParticle.Force;
int l9_564=gl_InstanceIndex;
int l9_565=gl_InstanceIndex;
int l9_566=gl_InstanceIndex;
gParticle.Size=fast::max(length((*sc_set0.UserUniforms).vfxModelMatrix[l9_564/201][0].xyz),fast::max(length((*sc_set0.UserUniforms).vfxModelMatrix[l9_565/201][1].xyz),length((*sc_set0.UserUniforms).vfxModelMatrix[l9_566/201][2].xyz)))*gParticle.Size;
int l9_567=gl_InstanceIndex;
int l9_568=l9_567/201;
gParticle.Matrix=float3x3((*sc_set0.UserUniforms).vfxModelMatrix[l9_568][0].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_568][1].xyz,(*sc_set0.UserUniforms).vfxModelMatrix[l9_568][2].xyz)*gParticle.Matrix;
gParticle.Spawned=true;
}
if (gParticle.SpawnIndexRemainder>(-1.0))
{
gParticle.SpawnIndex=gParticle.SpawnIndexRemainder;
}
if (gParticle.Index1D==gParticle.StateID)
{
gParticle.Dead=false;
}
if (gParticle.Dead)
{
float4 param_3=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_3.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_569=param_3;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_570=dot(l9_569,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_571=l9_570;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_571;
}
}
float4 l9_572=float4(param_3.x,-param_3.y,(param_3.z*0.5)+(param_3.w*0.5),param_3.w);
out.gl_Position=l9_572;
return out;
}
float Value_N126=0.0;
Value_N126=(*sc_set0.UserUniforms).Port_Import_N126;
float Value_N127=0.0;
Value_N127=(*sc_set0.UserUniforms).Port_Import_N127;
float Value_N128=0.0;
Value_N128=(*sc_set0.UserUniforms).Port_Import_N128;
float3 Value_N129=float3(0.0);
Value_N129=gParticle.Velocity;
float3 Output_N264=float3(0.0);
Output_N264=-Value_N129;
float Output_N265=0.0;
Output_N265=length(Value_N129);
float3 Output_N130=float3(0.0);
Output_N130=Output_N264*float3(Output_N265);
float3 Output_N137=float3(0.0);
Output_N137=(((float3(Value_N126)*float3(Value_N127))*float3(Value_N128))*Output_N130)*float3((*sc_set0.UserUniforms).Port_Input4_N137);
float3 Value_N138=float3(0.0);
Value_N138=gParticle.Velocity;
float Value_N139=0.0;
Value_N139=gParticle.Mass;
float3 Output_N140=float3(0.0);
Output_N140=Value_N138*float3(Value_N139);
float3 Output_N141=float3(0.0);
Output_N141=abs(Output_N140);
float Time_N272=0.0;
Time_N272=Globals.gTimeDelta*(*sc_set0.UserUniforms).Port_Multiplier_N272;
float3 Output_N273=float3(0.0);
Output_N273=Output_N141/(float3(Time_N272)+float3(1.234e-06));
float3 Output_N274=float3(0.0);
Output_N274=-Output_N273;
float3 Output_N275=float3(0.0);
Output_N275=fast::clamp(Output_N137,Output_N274,Output_N273);
gParticle.Force+=Output_N275;
float3x3 param_4=gParticle.Matrix;
gParticle.Quaternion=matrixToQuaternion(param_4);
float Drift=0.0049999999;
gParticle.Age+=Globals.gTimeDelta;
if (gParticle.Age>=gParticle.Life)
{
gParticle.Dead=true;
}
if (gParticle.Index1D==gParticle.StateID)
{
gParticle.Dead=false;
}
if (gParticle.Dead)
{
float4 param_5=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_5.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_574=param_5;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_575=dot(l9_574,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_576=l9_575;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_576;
}
}
float4 l9_577=float4(param_5.x,-param_5.y,(param_5.z*0.5)+(param_5.w*0.5),param_5.w);
out.gl_Position=l9_577;
return out;
}
float l9_578;
if (abs(gParticle.Force.x)<Drift)
{
l9_578=0.0;
}
else
{
l9_578=gParticle.Force.x;
}
gParticle.Force.x=l9_578;
float l9_579;
if (abs(gParticle.Force.y)<Drift)
{
l9_579=0.0;
}
else
{
l9_579=gParticle.Force.y;
}
gParticle.Force.y=l9_579;
float l9_580;
if (abs(gParticle.Force.z)<Drift)
{
l9_580=0.0;
}
else
{
l9_580=gParticle.Force.z;
}
gParticle.Force.z=l9_580;
gParticle.Mass=fast::max(Drift,gParticle.Mass);
if (Globals.gTimeDelta!=0.0)
{
gParticle.Velocity+=((gParticle.Force/float3(gParticle.Mass))*Globals.gTimeDelta);
}
float l9_581;
if (abs(gParticle.Velocity.x)<Drift)
{
l9_581=0.0;
}
else
{
l9_581=gParticle.Velocity.x;
}
gParticle.Velocity.x=l9_581;
float l9_582;
if (abs(gParticle.Velocity.y)<Drift)
{
l9_582=0.0;
}
else
{
l9_582=gParticle.Velocity.y;
}
gParticle.Velocity.y=l9_582;
float l9_583;
if (abs(gParticle.Velocity.z)<Drift)
{
l9_583=0.0;
}
else
{
l9_583=gParticle.Velocity.z;
}
gParticle.Velocity.z=l9_583;
gParticle.Position+=(gParticle.Velocity*Globals.gTimeDelta);
float2 QuadSize=float2(3.0,1.0)/float2(2048.0,(*sc_set0.UserUniforms).vfxTargetSizeWrite.y);
float2 Offset=float2(0.0);
int offsetID=(*sc_set0.UserUniforms).vfxOffsetInstancesWrite+ssInstanceID;
int particleRow=682;
Offset.x=float(offsetID%particleRow);
Offset.y=float(offsetID/particleRow);
Offset*=QuadSize;
float2 Vertex=float2(0.0);
float l9_584;
if (v.texture0.x<0.5)
{
l9_584=0.0;
}
else
{
l9_584=QuadSize.x;
}
Vertex.x=l9_584;
float l9_585;
if (v.texture0.y<0.5)
{
l9_585=0.0;
}
else
{
l9_585=QuadSize.y;
}
Vertex.y=l9_585;
Vertex+=Offset;
float4 param_6=float4((Vertex*2.0)-float2(1.0),1.0,1.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_6.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_586=param_6;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_587=dot(l9_586,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_588=l9_587;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_588;
}
}
float4 l9_589=float4(param_6.x,-param_6.y,(param_6.z*0.5)+(param_6.w*0.5),param_6.w);
out.gl_Position=l9_589;
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
out.Interp_Particle_Mass=gParticle.Mass;
if (gParticle.Index1D==gParticle.StateID)
{
gParticle.Dead=false;
}
if (gParticle.Dead)
{
float4 param_7=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_7.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_590=param_7;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_591=dot(l9_590,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_592=l9_591;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_592;
}
}
float4 l9_593=float4(param_7.x,-param_7.y,(param_7.z*0.5)+(param_7.w*0.5),param_7.w);
out.gl_Position=l9_593;
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
float spawnAmount;
float3 Port_Min_N005;
float3 Port_Max_N005;
float Port_Value_N031;
float Port_Import_N011;
float3 Port_Import_N037;
float3 Port_Import_N038;
float Port_Import_N041;
float Port_Import_N017;
float Port_Import_N023;
float Port_Import_N132;
float Port_Import_N133;
float Port_Import_N053;
float3 Port_Import_N054;
float Port_Import_N126;
float Port_Import_N127;
float Port_Import_N128;
float Port_Input4_N137;
float Port_Multiplier_N272;
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
float Interp_Particle_Mass [[user(locn22)]];
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
gParticle.Mass=in.Interp_Particle_Mass;
gParticle.SpawnIndex=in.Interp_Particle_SpawnIndex;
gParticle.NextBurstTime=in.Interp_Particle_NextBurstTime;
float2 param=in.Interp_Particle_Coord;
int l9_0=int(floor(param.x*3.0));
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
float l9_128=3600.0;
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
float l9_146=3600.0;
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
float2 l9_177=l9_176.xy;
float2 l9_178=l9_177;
float2 l9_179=l9_178;
l9_1=float4(l9_179.x,l9_179.y,l9_1.z,l9_1.w);
l9_2=l9_1.x;
l9_3=l9_1.y;
float l9_180=gParticle.Quaternion.x;
float l9_181=-1.0;
float l9_182=1.0;
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
float2 l9_195=l9_194.xy;
float2 l9_196=l9_195;
float2 l9_197=l9_196;
l9_1=float4(l9_197.x,l9_197.y,l9_1.z,l9_1.w);
l9_4=l9_1.x;
l9_5=l9_1.y;
float l9_198=gParticle.Quaternion.y;
float l9_199=-1.0;
float l9_200=1.0;
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
float2 l9_213=l9_212.xy;
float2 l9_214=l9_213;
float2 l9_215=l9_214;
l9_1=float4(l9_215.x,l9_215.y,l9_1.z,l9_1.w);
l9_6=l9_1.x;
l9_7=l9_1.y;
float l9_216=gParticle.Quaternion.z;
float l9_217=-1.0;
float l9_218=1.0;
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
float2 l9_231=l9_230.xy;
float2 l9_232=l9_231;
float2 l9_233=l9_232;
l9_1=float4(l9_233.x,l9_233.y,l9_1.z,l9_1.w);
l9_8=l9_1.x;
l9_9=l9_1.y;
float l9_234=gParticle.Quaternion.w;
float l9_235=-1.0;
float l9_236=1.0;
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
float2 l9_249=l9_248.xy;
float2 l9_250=l9_249;
float2 l9_251=l9_250;
l9_1=float4(l9_251.x,l9_251.y,l9_1.z,l9_1.w);
l9_10=l9_1.x;
l9_11=l9_1.y;
float l9_252=gParticle.Mass;
float l9_253=0.0;
float l9_254=100.0;
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
l9_12=l9_1.x;
l9_13=l9_1.y;
float l9_270=gParticle.Color.x;
float l9_271=0.0;
float l9_272=1.00001;
float l9_273=fast::clamp(l9_270,l9_271,l9_272);
float l9_274=l9_271;
float l9_275=l9_272;
float l9_276=0.0;
float l9_277=1.0;
float l9_278=l9_276+(((l9_273-l9_274)*(l9_277-l9_276))/(l9_275-l9_274));
float l9_279=l9_278;
l9_1.x=l9_279;
l9_14=l9_1.x;
float l9_280=gParticle.Color.y;
float l9_281=0.0;
float l9_282=1.00001;
float l9_283=fast::clamp(l9_280,l9_281,l9_282);
float l9_284=l9_281;
float l9_285=l9_282;
float l9_286=0.0;
float l9_287=1.0;
float l9_288=l9_286+(((l9_283-l9_284)*(l9_287-l9_286))/(l9_285-l9_284));
float l9_289=l9_288;
l9_1.x=l9_289;
l9_15=l9_1.x;
float l9_290=gParticle.Color.z;
float l9_291=0.0;
float l9_292=1.00001;
float l9_293=fast::clamp(l9_290,l9_291,l9_292);
float l9_294=l9_291;
float l9_295=l9_292;
float l9_296=0.0;
float l9_297=1.0;
float l9_298=l9_296+(((l9_293-l9_294)*(l9_297-l9_296))/(l9_295-l9_294));
float l9_299=l9_298;
l9_1.x=l9_299;
l9_16=l9_1.x;
float l9_300=gParticle.Color.w;
float l9_301=0.0;
float l9_302=1.00001;
float l9_303=fast::clamp(l9_300,l9_301,l9_302);
float l9_304=l9_301;
float l9_305=l9_302;
float l9_306=0.0;
float l9_307=1.0;
float l9_308=l9_306+(((l9_303-l9_304)*(l9_307-l9_306))/(l9_305-l9_304));
float l9_309=l9_308;
l9_1.x=l9_309;
l9_17=l9_1.x;
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
float4 param_5=Data0;
float4 param_6=Data1;
int l9_310=(201*((in.Interp_Particle_Index/201)+1))-1;
if (in.Interp_Particle_Index==l9_310)
{
float l9_311=gParticle.SpawnIndex;
float l9_312=-1.0;
float l9_313=500000.0;
float l9_314=l9_311;
float l9_315=l9_312;
float l9_316=l9_313;
float l9_317=0.99998999;
float l9_318=fast::clamp(l9_314,l9_315,l9_316);
float l9_319=l9_315;
float l9_320=l9_316;
float l9_321=0.0;
float l9_322=l9_317;
float l9_323=l9_321+(((l9_318-l9_319)*(l9_322-l9_321))/(l9_320-l9_319));
float l9_324=l9_323;
float4 l9_325=float4(1.0,255.0,65025.0,16581375.0)*l9_324;
l9_325=fract(l9_325);
l9_325-=(l9_325.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_326=l9_325;
float4 l9_327=l9_326;
float4 l9_328=l9_327;
param_5=l9_328;
float l9_329=gParticle.NextBurstTime;
float l9_330=0.0;
float l9_331=300.0;
float l9_332=l9_329;
float l9_333=l9_330;
float l9_334=l9_331;
float l9_335=0.99998999;
float l9_336=fast::clamp(l9_332,l9_333,l9_334);
float l9_337=l9_333;
float l9_338=l9_334;
float l9_339=0.0;
float l9_340=l9_335;
float l9_341=l9_339+(((l9_336-l9_337)*(l9_340-l9_339))/(l9_338-l9_337));
float l9_342=l9_341;
float4 l9_343=float4(1.0,255.0,65025.0,16581375.0)*l9_342;
l9_343=fract(l9_343);
l9_343-=(l9_343.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float2 l9_344=l9_343.xy;
float2 l9_345=l9_344;
float2 l9_346=l9_345;
param_6=float4(l9_346.x,l9_346.y,param_6.z,param_6.w);
}
Data0=param_5;
Data1=param_6;
if (dot(((Data0+Data1)+Data2)+Data3,float4(0.23454))==0.34231836)
{
Data0+=float4(1e-06);
}
float4 param_7=Data0;
if (sc_ShaderCacheConstant_tmp!=0)
{
param_7.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=param_7;
float4 param_8=Data1;
out.sc_FragData1=param_8;
float4 param_9=Data2;
out.sc_FragData2=param_9;
float4 param_10=Data3;
out.sc_FragData3=param_10;
return out;
}
} // FRAGMENT SHADER
