#include <metal_stdlib>
#include <simd/simd.h>
using namespace metal;
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
// SCC_BACKEND_SHADER_FLAGS_BEGIN__
// NGS_FLAG_IS_NORMAL_MAP normalTex
// SCC_BACKEND_SHADER_FLAGS_END__
//SG_REFLECTION_BEGIN(200)
//attribute vec4 boneData 5
//attribute vec3 blendShape0Pos 6
//attribute vec3 blendShape0Normal 12
//attribute vec3 blendShape1Pos 7
//attribute vec3 blendShape1Normal 13
//attribute vec3 blendShape2Pos 8
//attribute vec3 blendShape2Normal 14
//attribute vec3 blendShape3Pos 9
//attribute vec3 blendShape4Pos 10
//attribute vec3 blendShape5Pos 11
//attribute vec4 position 0
//attribute vec3 normal 1
//attribute vec4 tangent 2
//attribute vec2 texture0 3
//attribute vec2 texture1 4
//attribute vec4 color 18
//attribute vec3 positionNext 15
//attribute vec3 positionPrevious 16
//attribute vec4 strandProperties 17
//output vec4 sc_FragData0 0
//output uvec4 sc_RayTracingPositionAndMask 0
//output uvec4 sc_RayTracingNormalAndMore 1
//sampler sampler albedoSecondarySmpSC 0:28
//sampler sampler albedoTexSmpSC 0:29
//sampler sampler aoTexSmpSC 0:30
//sampler sampler intensityTextureSmpSC 0:31
//sampler sampler normalTexSmpSC 0:32
//sampler sampler sc_EnvmapDiffuseSmpSC 0:33
//sampler sampler sc_EnvmapSpecularSmpSC 0:34
//sampler sampler sc_RayTracingGlobalIlluminationSmpSC 0:36
//sampler sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC 0:37
//sampler sampler sc_RayTracingRayDirectionSmpSC 0:38
//sampler sampler sc_RayTracingReflectionsSmpSC 0:39
//sampler sampler sc_RayTracingShadowsSmpSC 0:40
//sampler sampler sc_SSAOTextureSmpSC 0:41
//sampler sampler sc_ScreenTextureSmpSC 0:42
//sampler sampler sc_ShadowTextureSmpSC 0:43
//texture texture2D albedoSecondary 0:4:0:28
//texture texture2D albedoTex 0:5:0:29
//texture texture2D aoTex 0:6:0:30
//texture texture2D intensityTexture 0:7:0:31
//texture texture2D normalTex 0:8:0:32
//texture texture2D sc_EnvmapDiffuse 0:9:0:33
//texture texture2D sc_EnvmapSpecular 0:10:0:34
//texture texture2D sc_RayTracingGlobalIllumination 0:19:0:36
//texture utexture2D sc_RayTracingHitCasterIdAndBarycentric 0:20:0:37
//texture texture2D sc_RayTracingRayDirection 0:21:0:38
//texture texture2D sc_RayTracingReflections 0:22:0:39
//texture texture2D sc_RayTracingShadows 0:23:0:40
//texture texture2D sc_SSAOTexture 0:24:0:41
//texture texture2D sc_ScreenTexture 0:25:0:42
//texture texture2D sc_ShadowTexture 0:26:0:43
//ubo float sc_BonesUBO 0:3:96 {
//sc_Bone_t sc_Bones 0:[1]:96
//float4 sc_Bones.boneMatrix 0:[3]:16
//float4 sc_Bones.normalMatrix 48:[3]:16
//}
//ubo int UserUniforms 0:45:5344 {
//sc_PointLight_t sc_PointLights 0:[3]:80
//bool sc_PointLights.falloffEnabled 0
//float sc_PointLights.falloffEndDistance 4
//float sc_PointLights.negRcpFalloffEndDistance4 8
//float sc_PointLights.angleScale 12
//float sc_PointLights.angleOffset 16
//float3 sc_PointLights.direction 32
//float3 sc_PointLights.position 48
//float4 sc_PointLights.color 64
//sc_DirectionalLight_t sc_DirectionalLights 240:[5]:32
//float3 sc_DirectionalLights.direction 0
//float4 sc_DirectionalLights.color 16
//sc_AmbientLight_t sc_AmbientLights 400:[3]:32
//float3 sc_AmbientLights.color 0
//float sc_AmbientLights.intensity 16
//sc_LightEstimationData_t sc_LightEstimationData 496
//sc_SphericalGaussianLight_t sc_LightEstimationData.sg 0:[12]:48
//float3 sc_LightEstimationData.sg.color 0
//float sc_LightEstimationData.sg.sharpness 16
//float3 sc_LightEstimationData.sg.axis 32
//float3 sc_LightEstimationData.ambientLight 576
//float4 sc_EnvmapDiffuseSize 1088
//float4 sc_EnvmapSpecularSize 1136
//float3 sc_EnvmapRotation 1184
//float sc_EnvmapExposure 1200
//float3 sc_Sh 1216:[9]:16
//float sc_ShIntensity 1360
//float4 sc_Time 1376
//float4 sc_UniformConstants 1392
//float4x4 sc_ViewProjectionMatrixArray 1680:[2]:64
//float4x4 sc_ModelViewMatrixArray 1936:[2]:64
//float4x4 sc_ProjectionMatrixArray 2384:[2]:64
//float4x4 sc_ProjectionMatrixInverseArray 2512:[2]:64
//float4x4 sc_ViewMatrixArray 2640:[2]:64
//float4x4 sc_PrevFrameViewProjectionMatrixArray 2896:[2]:64
//float4x4 sc_ModelMatrix 3024
//float4x4 sc_ModelMatrixInverse 3088
//float3x3 sc_NormalMatrix 3152
//float4x4 sc_PrevFrameModelMatrix 3248
//float4 sc_CurrentRenderTargetDims 3456
//sc_Camera_t sc_Camera 3472
//float3 sc_Camera.position 0
//float sc_Camera.aspect 16
//float2 sc_Camera.clipPlanes 24
//float sc_ShadowDensity 3504
//float4 sc_ShadowColor 3520
//float4x4 sc_ProjectorMatrix 3536
//float4 weights0 3616
//float4 weights1 3632
//float4 sc_StereoClipPlanes 3664:[2]:16
//float2 sc_TAAJitterOffset 3704
//int sc_RayTracingReceiverEffectsMask 3824
//float3 sc_RayTracingOriginScale 3984
//uint sc_RayTracingReceiverMask 4000
//float3 sc_RayTracingOriginOffset 4032
//uint sc_RayTracingReceiverId 4048
//uint4 sc_RayTracingCasterConfiguration 4064
//uint4 sc_RayTracingCasterOffsetPNTC 4080
//uint4 sc_RayTracingCasterOffsetTexture 4096
//uint4 sc_RayTracingCasterFormatPNTC 4112
//uint4 sc_RayTracingCasterFormatTexture 4128
//float4 voxelization_params_0 4192
//float4 voxelization_params_frustum_lrbt 4208
//float4 voxelization_params_frustum_nf 4224
//float3 voxelization_params_camera_pos 4240
//float4x4 sc_ModelMatrixVoxelization 4256
//float correctedIntensity 4320
//float3x3 intensityTextureTransform 4384
//float4 intensityTextureUvMinMax 4432
//float4 intensityTextureBorderColor 4448
//int PreviewEnabled 4612
//float alphaTestThreshold 4620
//float rimExponent 4624
//float rimIntensity 4628
//float4 rimColor 4640
//float4 baseColor 4656
//float3x3 albedoTexTransform 4720
//float4 albedoTexUvMinMax 4768
//float4 albedoTexBorderColor 4784
//float uvScale 4800
//float3x3 albedoSecondaryTransform 4864
//float4 albedoSecondaryUvMinMax 4912
//float4 albedoSecondaryBorderColor 4928
//float progress 4944
//float3x3 aoTexTransform 5008
//float4 aoTexUvMinMax 5056
//float4 aoTexBorderColor 5072
//float aoScale 5088
//float3x3 normalTexTransform 5152
//float4 normalTexUvMinMax 5200
//float4 normalTexBorderColor 5216
//float metallic 5232
//float roughness 5236
//float2 Port_Center_N031 5240
//float Port_Opacity_N000 5248
//float4 Port_Input2_N019 5264
//float3 Port_Emissive_N000 5280
//float3 Port_AO_N000 5296
//float3 Port_SpecularAO_N000 5312
//float depthRef 5328
//}
//ssbo int sc_RayTracingCasterIndexBuffer 0:0:4 {
//uint sc_RayTracingCasterTriangles 0:[1]:4
//}
//ssbo float sc_RayTracingCasterNonAnimatedVertexBuffer 0:2:4 {
//float sc_RayTracingCasterNonAnimatedVertices 0:[1]:4
//}
//ssbo float sc_RayTracingCasterVertexBuffer 0:1:4 {
//float sc_RayTracingCasterVertices 0:[1]:4
//}
//spec_const bool BLEND_MODE_AVERAGE 0 0
//spec_const bool BLEND_MODE_BRIGHT 1 0
//spec_const bool BLEND_MODE_COLOR_BURN 2 0
//spec_const bool BLEND_MODE_COLOR_DODGE 3 0
//spec_const bool BLEND_MODE_COLOR 4 0
//spec_const bool BLEND_MODE_DARKEN 5 0
//spec_const bool BLEND_MODE_DIFFERENCE 6 0
//spec_const bool BLEND_MODE_DIVIDE 7 0
//spec_const bool BLEND_MODE_DIVISION 8 0
//spec_const bool BLEND_MODE_EXCLUSION 9 0
//spec_const bool BLEND_MODE_FORGRAY 10 0
//spec_const bool BLEND_MODE_HARD_GLOW 11 0
//spec_const bool BLEND_MODE_HARD_LIGHT 12 0
//spec_const bool BLEND_MODE_HARD_MIX 13 0
//spec_const bool BLEND_MODE_HARD_PHOENIX 14 0
//spec_const bool BLEND_MODE_HARD_REFLECT 15 0
//spec_const bool BLEND_MODE_HUE 16 0
//spec_const bool BLEND_MODE_INTENSE 17 0
//spec_const bool BLEND_MODE_LIGHTEN 18 0
//spec_const bool BLEND_MODE_LINEAR_LIGHT 19 0
//spec_const bool BLEND_MODE_LUMINOSITY 20 0
//spec_const bool BLEND_MODE_NEGATION 21 0
//spec_const bool BLEND_MODE_NOTBRIGHT 22 0
//spec_const bool BLEND_MODE_OVERLAY 23 0
//spec_const bool BLEND_MODE_PIN_LIGHT 24 0
//spec_const bool BLEND_MODE_REALISTIC 25 0
//spec_const bool BLEND_MODE_SATURATION 26 0
//spec_const bool BLEND_MODE_SOFT_LIGHT 27 0
//spec_const bool BLEND_MODE_SUBTRACT 28 0
//spec_const bool BLEND_MODE_VIVID_LIGHT 29 0
//spec_const bool ENABLE_STIPPLE_PATTERN_TEST 30 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_albedoSecondary 31 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_albedoTex 32 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_aoTex 33 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_intensityTexture 34 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_normalTex 35 0
//spec_const bool SC_USE_UV_MIN_MAX_albedoSecondary 36 0
//spec_const bool SC_USE_UV_MIN_MAX_albedoTex 37 0
//spec_const bool SC_USE_UV_MIN_MAX_aoTex 38 0
//spec_const bool SC_USE_UV_MIN_MAX_intensityTexture 39 0
//spec_const bool SC_USE_UV_MIN_MAX_normalTex 40 0
//spec_const bool SC_USE_UV_TRANSFORM_albedoSecondary 41 0
//spec_const bool SC_USE_UV_TRANSFORM_albedoTex 42 0
//spec_const bool SC_USE_UV_TRANSFORM_aoTex 43 0
//spec_const bool SC_USE_UV_TRANSFORM_intensityTexture 44 0
//spec_const bool SC_USE_UV_TRANSFORM_normalTex 45 0
//spec_const bool UseViewSpaceDepthVariant 46 1
//spec_const bool albedoSecondaryHasSwappedViews 47 0
//spec_const bool albedoTexHasSwappedViews 48 0
//spec_const bool aoTexHasSwappedViews 49 0
//spec_const bool enableAO 50 0
//spec_const bool enableAlbedo 51 0
//spec_const bool enableNormals 52 0
//spec_const bool enableRim 53 0
//spec_const bool intensityTextureHasSwappedViews 54 0
//spec_const bool normalTexHasSwappedViews 55 0
//spec_const bool sc_BlendMode_AddWithAlphaFactor 56 0
//spec_const bool sc_BlendMode_Add 57 0
//spec_const bool sc_BlendMode_AlphaTest 58 0
//spec_const bool sc_BlendMode_AlphaToCoverage 59 0
//spec_const bool sc_BlendMode_ColoredGlass 60 0
//spec_const bool sc_BlendMode_Custom 61 0
//spec_const bool sc_BlendMode_Max 62 0
//spec_const bool sc_BlendMode_Min 63 0
//spec_const bool sc_BlendMode_MultiplyOriginal 64 0
//spec_const bool sc_BlendMode_Multiply 65 0
//spec_const bool sc_BlendMode_Normal 66 0
//spec_const bool sc_BlendMode_PremultipliedAlphaAuto 67 0
//spec_const bool sc_BlendMode_PremultipliedAlphaHardware 68 0
//spec_const bool sc_BlendMode_PremultipliedAlpha 69 0
//spec_const bool sc_BlendMode_Screen 70 0
//spec_const bool sc_DepthOnly 71 0
//spec_const bool sc_EnvmapDiffuseHasSwappedViews 72 0
//spec_const bool sc_EnvmapSpecularHasSwappedViews 73 0
//spec_const bool sc_FramebufferFetch 74 0
//spec_const bool sc_HasDiffuseEnvmap 75 0
//spec_const bool sc_IsEditor 76 0
//spec_const bool sc_LightEstimation 77 0
//spec_const bool sc_MotionVectorsPass 78 0
//spec_const bool sc_OITCompositingPass 79 0
//spec_const bool sc_OITDepthBoundsPass 80 0
//spec_const bool sc_OITDepthGatherPass 81 0
//spec_const bool sc_OutputBounds 82 0
//spec_const bool sc_ProjectiveShadowsCaster 83 0
//spec_const bool sc_ProjectiveShadowsReceiver 84 0
//spec_const bool sc_RayTracingCasterForceOpaque 85 0
//spec_const bool sc_RayTracingGlobalIlluminationHasSwappedViews 86 0
//spec_const bool sc_RayTracingReflectionsHasSwappedViews 87 0
//spec_const bool sc_RayTracingShadowsHasSwappedViews 88 0
//spec_const bool sc_RenderAlphaToColor 89 0
//spec_const bool sc_SSAOEnabled 90 0
//spec_const bool sc_ScreenTextureHasSwappedViews 91 0
//spec_const bool sc_TAAEnabled 92 0
//spec_const bool sc_VertexBlendingUseNormals 93 0
//spec_const bool sc_VertexBlending 94 0
//spec_const bool sc_Voxelization 95 0
//spec_const int SC_DEVICE_CLASS 96 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_albedoSecondary 97 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_albedoTex 98 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_aoTex 99 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_intensityTexture 100 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_normalTex 101 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_albedoSecondary 102 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_albedoTex 103 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_aoTex 104 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_intensityTexture 105 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_normalTex 106 -1
//spec_const int albedoSecondaryLayout 107 0
//spec_const int albedoTexLayout 108 0
//spec_const int aoTexLayout 109 0
//spec_const int intensityTextureLayout 110 0
//spec_const int normalTexLayout 111 0
//spec_const int sc_AmbientLightMode0 112 0
//spec_const int sc_AmbientLightMode1 113 0
//spec_const int sc_AmbientLightMode2 114 0
//spec_const int sc_AmbientLightMode_Constant 115 0
//spec_const int sc_AmbientLightMode_EnvironmentMap 116 0
//spec_const int sc_AmbientLightMode_FromCamera 117 0
//spec_const int sc_AmbientLightMode_SphericalHarmonics 118 0
//spec_const int sc_AmbientLightsCount 119 0
//spec_const int sc_DepthBufferMode 120 0
//spec_const int sc_DirectionalLightsCount 121 0
//spec_const int sc_EnvLightMode 122 0
//spec_const int sc_EnvmapDiffuseLayout 123 0
//spec_const int sc_EnvmapSpecularLayout 124 0
//spec_const int sc_LightEstimationSGCount 125 0
//spec_const int sc_PointLightsCount 126 0
//spec_const int sc_RayTracingGlobalIlluminationLayout 127 0
//spec_const int sc_RayTracingReflectionsLayout 128 0
//spec_const int sc_RayTracingShadowsLayout 129 0
//spec_const int sc_RenderingSpace 130 -1
//spec_const int sc_ScreenTextureLayout 131 0
//spec_const int sc_ShaderCacheConstant 132 0
//spec_const int sc_SkinBonesCount 133 0
//spec_const int sc_StereoRenderingMode 134 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 135 0
//SG_REFLECTION_END
constant bool BLEND_MODE_AVERAGE [[function_constant(0)]];
constant bool BLEND_MODE_AVERAGE_tmp = is_function_constant_defined(BLEND_MODE_AVERAGE) ? BLEND_MODE_AVERAGE : false;
constant bool BLEND_MODE_BRIGHT [[function_constant(1)]];
constant bool BLEND_MODE_BRIGHT_tmp = is_function_constant_defined(BLEND_MODE_BRIGHT) ? BLEND_MODE_BRIGHT : false;
constant bool BLEND_MODE_COLOR_BURN [[function_constant(2)]];
constant bool BLEND_MODE_COLOR_BURN_tmp = is_function_constant_defined(BLEND_MODE_COLOR_BURN) ? BLEND_MODE_COLOR_BURN : false;
constant bool BLEND_MODE_COLOR_DODGE [[function_constant(3)]];
constant bool BLEND_MODE_COLOR_DODGE_tmp = is_function_constant_defined(BLEND_MODE_COLOR_DODGE) ? BLEND_MODE_COLOR_DODGE : false;
constant bool BLEND_MODE_COLOR [[function_constant(4)]];
constant bool BLEND_MODE_COLOR_tmp = is_function_constant_defined(BLEND_MODE_COLOR) ? BLEND_MODE_COLOR : false;
constant bool BLEND_MODE_DARKEN [[function_constant(5)]];
constant bool BLEND_MODE_DARKEN_tmp = is_function_constant_defined(BLEND_MODE_DARKEN) ? BLEND_MODE_DARKEN : false;
constant bool BLEND_MODE_DIFFERENCE [[function_constant(6)]];
constant bool BLEND_MODE_DIFFERENCE_tmp = is_function_constant_defined(BLEND_MODE_DIFFERENCE) ? BLEND_MODE_DIFFERENCE : false;
constant bool BLEND_MODE_DIVIDE [[function_constant(7)]];
constant bool BLEND_MODE_DIVIDE_tmp = is_function_constant_defined(BLEND_MODE_DIVIDE) ? BLEND_MODE_DIVIDE : false;
constant bool BLEND_MODE_DIVISION [[function_constant(8)]];
constant bool BLEND_MODE_DIVISION_tmp = is_function_constant_defined(BLEND_MODE_DIVISION) ? BLEND_MODE_DIVISION : false;
constant bool BLEND_MODE_EXCLUSION [[function_constant(9)]];
constant bool BLEND_MODE_EXCLUSION_tmp = is_function_constant_defined(BLEND_MODE_EXCLUSION) ? BLEND_MODE_EXCLUSION : false;
constant bool BLEND_MODE_FORGRAY [[function_constant(10)]];
constant bool BLEND_MODE_FORGRAY_tmp = is_function_constant_defined(BLEND_MODE_FORGRAY) ? BLEND_MODE_FORGRAY : false;
constant bool BLEND_MODE_HARD_GLOW [[function_constant(11)]];
constant bool BLEND_MODE_HARD_GLOW_tmp = is_function_constant_defined(BLEND_MODE_HARD_GLOW) ? BLEND_MODE_HARD_GLOW : false;
constant bool BLEND_MODE_HARD_LIGHT [[function_constant(12)]];
constant bool BLEND_MODE_HARD_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_HARD_LIGHT) ? BLEND_MODE_HARD_LIGHT : false;
constant bool BLEND_MODE_HARD_MIX [[function_constant(13)]];
constant bool BLEND_MODE_HARD_MIX_tmp = is_function_constant_defined(BLEND_MODE_HARD_MIX) ? BLEND_MODE_HARD_MIX : false;
constant bool BLEND_MODE_HARD_PHOENIX [[function_constant(14)]];
constant bool BLEND_MODE_HARD_PHOENIX_tmp = is_function_constant_defined(BLEND_MODE_HARD_PHOENIX) ? BLEND_MODE_HARD_PHOENIX : false;
constant bool BLEND_MODE_HARD_REFLECT [[function_constant(15)]];
constant bool BLEND_MODE_HARD_REFLECT_tmp = is_function_constant_defined(BLEND_MODE_HARD_REFLECT) ? BLEND_MODE_HARD_REFLECT : false;
constant bool BLEND_MODE_HUE [[function_constant(16)]];
constant bool BLEND_MODE_HUE_tmp = is_function_constant_defined(BLEND_MODE_HUE) ? BLEND_MODE_HUE : false;
constant bool BLEND_MODE_INTENSE [[function_constant(17)]];
constant bool BLEND_MODE_INTENSE_tmp = is_function_constant_defined(BLEND_MODE_INTENSE) ? BLEND_MODE_INTENSE : false;
constant bool BLEND_MODE_LIGHTEN [[function_constant(18)]];
constant bool BLEND_MODE_LIGHTEN_tmp = is_function_constant_defined(BLEND_MODE_LIGHTEN) ? BLEND_MODE_LIGHTEN : false;
constant bool BLEND_MODE_LINEAR_LIGHT [[function_constant(19)]];
constant bool BLEND_MODE_LINEAR_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_LINEAR_LIGHT) ? BLEND_MODE_LINEAR_LIGHT : false;
constant bool BLEND_MODE_LUMINOSITY [[function_constant(20)]];
constant bool BLEND_MODE_LUMINOSITY_tmp = is_function_constant_defined(BLEND_MODE_LUMINOSITY) ? BLEND_MODE_LUMINOSITY : false;
constant bool BLEND_MODE_NEGATION [[function_constant(21)]];
constant bool BLEND_MODE_NEGATION_tmp = is_function_constant_defined(BLEND_MODE_NEGATION) ? BLEND_MODE_NEGATION : false;
constant bool BLEND_MODE_NOTBRIGHT [[function_constant(22)]];
constant bool BLEND_MODE_NOTBRIGHT_tmp = is_function_constant_defined(BLEND_MODE_NOTBRIGHT) ? BLEND_MODE_NOTBRIGHT : false;
constant bool BLEND_MODE_OVERLAY [[function_constant(23)]];
constant bool BLEND_MODE_OVERLAY_tmp = is_function_constant_defined(BLEND_MODE_OVERLAY) ? BLEND_MODE_OVERLAY : false;
constant bool BLEND_MODE_PIN_LIGHT [[function_constant(24)]];
constant bool BLEND_MODE_PIN_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_PIN_LIGHT) ? BLEND_MODE_PIN_LIGHT : false;
constant bool BLEND_MODE_REALISTIC [[function_constant(25)]];
constant bool BLEND_MODE_REALISTIC_tmp = is_function_constant_defined(BLEND_MODE_REALISTIC) ? BLEND_MODE_REALISTIC : false;
constant bool BLEND_MODE_SATURATION [[function_constant(26)]];
constant bool BLEND_MODE_SATURATION_tmp = is_function_constant_defined(BLEND_MODE_SATURATION) ? BLEND_MODE_SATURATION : false;
constant bool BLEND_MODE_SOFT_LIGHT [[function_constant(27)]];
constant bool BLEND_MODE_SOFT_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_SOFT_LIGHT) ? BLEND_MODE_SOFT_LIGHT : false;
constant bool BLEND_MODE_SUBTRACT [[function_constant(28)]];
constant bool BLEND_MODE_SUBTRACT_tmp = is_function_constant_defined(BLEND_MODE_SUBTRACT) ? BLEND_MODE_SUBTRACT : false;
constant bool BLEND_MODE_VIVID_LIGHT [[function_constant(29)]];
constant bool BLEND_MODE_VIVID_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_VIVID_LIGHT) ? BLEND_MODE_VIVID_LIGHT : false;
constant bool ENABLE_STIPPLE_PATTERN_TEST [[function_constant(30)]];
constant bool ENABLE_STIPPLE_PATTERN_TEST_tmp = is_function_constant_defined(ENABLE_STIPPLE_PATTERN_TEST) ? ENABLE_STIPPLE_PATTERN_TEST : false;
constant bool SC_USE_CLAMP_TO_BORDER_albedoSecondary [[function_constant(31)]];
constant bool SC_USE_CLAMP_TO_BORDER_albedoSecondary_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_albedoSecondary) ? SC_USE_CLAMP_TO_BORDER_albedoSecondary : false;
constant bool SC_USE_CLAMP_TO_BORDER_albedoTex [[function_constant(32)]];
constant bool SC_USE_CLAMP_TO_BORDER_albedoTex_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_albedoTex) ? SC_USE_CLAMP_TO_BORDER_albedoTex : false;
constant bool SC_USE_CLAMP_TO_BORDER_aoTex [[function_constant(33)]];
constant bool SC_USE_CLAMP_TO_BORDER_aoTex_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_aoTex) ? SC_USE_CLAMP_TO_BORDER_aoTex : false;
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture [[function_constant(34)]];
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_intensityTexture) ? SC_USE_CLAMP_TO_BORDER_intensityTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_normalTex [[function_constant(35)]];
constant bool SC_USE_CLAMP_TO_BORDER_normalTex_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_normalTex) ? SC_USE_CLAMP_TO_BORDER_normalTex : false;
constant bool SC_USE_UV_MIN_MAX_albedoSecondary [[function_constant(36)]];
constant bool SC_USE_UV_MIN_MAX_albedoSecondary_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_albedoSecondary) ? SC_USE_UV_MIN_MAX_albedoSecondary : false;
constant bool SC_USE_UV_MIN_MAX_albedoTex [[function_constant(37)]];
constant bool SC_USE_UV_MIN_MAX_albedoTex_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_albedoTex) ? SC_USE_UV_MIN_MAX_albedoTex : false;
constant bool SC_USE_UV_MIN_MAX_aoTex [[function_constant(38)]];
constant bool SC_USE_UV_MIN_MAX_aoTex_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_aoTex) ? SC_USE_UV_MIN_MAX_aoTex : false;
constant bool SC_USE_UV_MIN_MAX_intensityTexture [[function_constant(39)]];
constant bool SC_USE_UV_MIN_MAX_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_intensityTexture) ? SC_USE_UV_MIN_MAX_intensityTexture : false;
constant bool SC_USE_UV_MIN_MAX_normalTex [[function_constant(40)]];
constant bool SC_USE_UV_MIN_MAX_normalTex_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_normalTex) ? SC_USE_UV_MIN_MAX_normalTex : false;
constant bool SC_USE_UV_TRANSFORM_albedoSecondary [[function_constant(41)]];
constant bool SC_USE_UV_TRANSFORM_albedoSecondary_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_albedoSecondary) ? SC_USE_UV_TRANSFORM_albedoSecondary : false;
constant bool SC_USE_UV_TRANSFORM_albedoTex [[function_constant(42)]];
constant bool SC_USE_UV_TRANSFORM_albedoTex_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_albedoTex) ? SC_USE_UV_TRANSFORM_albedoTex : false;
constant bool SC_USE_UV_TRANSFORM_aoTex [[function_constant(43)]];
constant bool SC_USE_UV_TRANSFORM_aoTex_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_aoTex) ? SC_USE_UV_TRANSFORM_aoTex : false;
constant bool SC_USE_UV_TRANSFORM_intensityTexture [[function_constant(44)]];
constant bool SC_USE_UV_TRANSFORM_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_intensityTexture) ? SC_USE_UV_TRANSFORM_intensityTexture : false;
constant bool SC_USE_UV_TRANSFORM_normalTex [[function_constant(45)]];
constant bool SC_USE_UV_TRANSFORM_normalTex_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_normalTex) ? SC_USE_UV_TRANSFORM_normalTex : false;
constant bool UseViewSpaceDepthVariant [[function_constant(46)]];
constant bool UseViewSpaceDepthVariant_tmp = is_function_constant_defined(UseViewSpaceDepthVariant) ? UseViewSpaceDepthVariant : true;
constant bool albedoSecondaryHasSwappedViews [[function_constant(47)]];
constant bool albedoSecondaryHasSwappedViews_tmp = is_function_constant_defined(albedoSecondaryHasSwappedViews) ? albedoSecondaryHasSwappedViews : false;
constant bool albedoTexHasSwappedViews [[function_constant(48)]];
constant bool albedoTexHasSwappedViews_tmp = is_function_constant_defined(albedoTexHasSwappedViews) ? albedoTexHasSwappedViews : false;
constant bool aoTexHasSwappedViews [[function_constant(49)]];
constant bool aoTexHasSwappedViews_tmp = is_function_constant_defined(aoTexHasSwappedViews) ? aoTexHasSwappedViews : false;
constant bool enableAO [[function_constant(50)]];
constant bool enableAO_tmp = is_function_constant_defined(enableAO) ? enableAO : false;
constant bool enableAlbedo [[function_constant(51)]];
constant bool enableAlbedo_tmp = is_function_constant_defined(enableAlbedo) ? enableAlbedo : false;
constant bool enableNormals [[function_constant(52)]];
constant bool enableNormals_tmp = is_function_constant_defined(enableNormals) ? enableNormals : false;
constant bool enableRim [[function_constant(53)]];
constant bool enableRim_tmp = is_function_constant_defined(enableRim) ? enableRim : false;
constant bool intensityTextureHasSwappedViews [[function_constant(54)]];
constant bool intensityTextureHasSwappedViews_tmp = is_function_constant_defined(intensityTextureHasSwappedViews) ? intensityTextureHasSwappedViews : false;
constant bool normalTexHasSwappedViews [[function_constant(55)]];
constant bool normalTexHasSwappedViews_tmp = is_function_constant_defined(normalTexHasSwappedViews) ? normalTexHasSwappedViews : false;
constant bool sc_BlendMode_AddWithAlphaFactor [[function_constant(56)]];
constant bool sc_BlendMode_AddWithAlphaFactor_tmp = is_function_constant_defined(sc_BlendMode_AddWithAlphaFactor) ? sc_BlendMode_AddWithAlphaFactor : false;
constant bool sc_BlendMode_Add [[function_constant(57)]];
constant bool sc_BlendMode_Add_tmp = is_function_constant_defined(sc_BlendMode_Add) ? sc_BlendMode_Add : false;
constant bool sc_BlendMode_AlphaTest [[function_constant(58)]];
constant bool sc_BlendMode_AlphaTest_tmp = is_function_constant_defined(sc_BlendMode_AlphaTest) ? sc_BlendMode_AlphaTest : false;
constant bool sc_BlendMode_AlphaToCoverage [[function_constant(59)]];
constant bool sc_BlendMode_AlphaToCoverage_tmp = is_function_constant_defined(sc_BlendMode_AlphaToCoverage) ? sc_BlendMode_AlphaToCoverage : false;
constant bool sc_BlendMode_ColoredGlass [[function_constant(60)]];
constant bool sc_BlendMode_ColoredGlass_tmp = is_function_constant_defined(sc_BlendMode_ColoredGlass) ? sc_BlendMode_ColoredGlass : false;
constant bool sc_BlendMode_Custom [[function_constant(61)]];
constant bool sc_BlendMode_Custom_tmp = is_function_constant_defined(sc_BlendMode_Custom) ? sc_BlendMode_Custom : false;
constant bool sc_BlendMode_Max [[function_constant(62)]];
constant bool sc_BlendMode_Max_tmp = is_function_constant_defined(sc_BlendMode_Max) ? sc_BlendMode_Max : false;
constant bool sc_BlendMode_Min [[function_constant(63)]];
constant bool sc_BlendMode_Min_tmp = is_function_constant_defined(sc_BlendMode_Min) ? sc_BlendMode_Min : false;
constant bool sc_BlendMode_MultiplyOriginal [[function_constant(64)]];
constant bool sc_BlendMode_MultiplyOriginal_tmp = is_function_constant_defined(sc_BlendMode_MultiplyOriginal) ? sc_BlendMode_MultiplyOriginal : false;
constant bool sc_BlendMode_Multiply [[function_constant(65)]];
constant bool sc_BlendMode_Multiply_tmp = is_function_constant_defined(sc_BlendMode_Multiply) ? sc_BlendMode_Multiply : false;
constant bool sc_BlendMode_Normal [[function_constant(66)]];
constant bool sc_BlendMode_Normal_tmp = is_function_constant_defined(sc_BlendMode_Normal) ? sc_BlendMode_Normal : false;
constant bool sc_BlendMode_PremultipliedAlphaAuto [[function_constant(67)]];
constant bool sc_BlendMode_PremultipliedAlphaAuto_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaAuto) ? sc_BlendMode_PremultipliedAlphaAuto : false;
constant bool sc_BlendMode_PremultipliedAlphaHardware [[function_constant(68)]];
constant bool sc_BlendMode_PremultipliedAlphaHardware_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaHardware) ? sc_BlendMode_PremultipliedAlphaHardware : false;
constant bool sc_BlendMode_PremultipliedAlpha [[function_constant(69)]];
constant bool sc_BlendMode_PremultipliedAlpha_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlpha) ? sc_BlendMode_PremultipliedAlpha : false;
constant bool sc_BlendMode_Screen [[function_constant(70)]];
constant bool sc_BlendMode_Screen_tmp = is_function_constant_defined(sc_BlendMode_Screen) ? sc_BlendMode_Screen : false;
constant bool sc_DepthOnly [[function_constant(71)]];
constant bool sc_DepthOnly_tmp = is_function_constant_defined(sc_DepthOnly) ? sc_DepthOnly : false;
constant bool sc_EnvmapDiffuseHasSwappedViews [[function_constant(72)]];
constant bool sc_EnvmapDiffuseHasSwappedViews_tmp = is_function_constant_defined(sc_EnvmapDiffuseHasSwappedViews) ? sc_EnvmapDiffuseHasSwappedViews : false;
constant bool sc_EnvmapSpecularHasSwappedViews [[function_constant(73)]];
constant bool sc_EnvmapSpecularHasSwappedViews_tmp = is_function_constant_defined(sc_EnvmapSpecularHasSwappedViews) ? sc_EnvmapSpecularHasSwappedViews : false;
constant bool sc_FramebufferFetch [[function_constant(74)]];
constant bool sc_FramebufferFetch_tmp = is_function_constant_defined(sc_FramebufferFetch) ? sc_FramebufferFetch : false;
constant bool sc_HasDiffuseEnvmap [[function_constant(75)]];
constant bool sc_HasDiffuseEnvmap_tmp = is_function_constant_defined(sc_HasDiffuseEnvmap) ? sc_HasDiffuseEnvmap : false;
constant bool sc_IsEditor [[function_constant(76)]];
constant bool sc_IsEditor_tmp = is_function_constant_defined(sc_IsEditor) ? sc_IsEditor : false;
constant bool sc_LightEstimation [[function_constant(77)]];
constant bool sc_LightEstimation_tmp = is_function_constant_defined(sc_LightEstimation) ? sc_LightEstimation : false;
constant bool sc_MotionVectorsPass [[function_constant(78)]];
constant bool sc_MotionVectorsPass_tmp = is_function_constant_defined(sc_MotionVectorsPass) ? sc_MotionVectorsPass : false;
constant bool sc_OITCompositingPass [[function_constant(79)]];
constant bool sc_OITCompositingPass_tmp = is_function_constant_defined(sc_OITCompositingPass) ? sc_OITCompositingPass : false;
constant bool sc_OITDepthBoundsPass [[function_constant(80)]];
constant bool sc_OITDepthBoundsPass_tmp = is_function_constant_defined(sc_OITDepthBoundsPass) ? sc_OITDepthBoundsPass : false;
constant bool sc_OITDepthGatherPass [[function_constant(81)]];
constant bool sc_OITDepthGatherPass_tmp = is_function_constant_defined(sc_OITDepthGatherPass) ? sc_OITDepthGatherPass : false;
constant bool sc_OutputBounds [[function_constant(82)]];
constant bool sc_OutputBounds_tmp = is_function_constant_defined(sc_OutputBounds) ? sc_OutputBounds : false;
constant bool sc_ProjectiveShadowsCaster [[function_constant(83)]];
constant bool sc_ProjectiveShadowsCaster_tmp = is_function_constant_defined(sc_ProjectiveShadowsCaster) ? sc_ProjectiveShadowsCaster : false;
constant bool sc_ProjectiveShadowsReceiver [[function_constant(84)]];
constant bool sc_ProjectiveShadowsReceiver_tmp = is_function_constant_defined(sc_ProjectiveShadowsReceiver) ? sc_ProjectiveShadowsReceiver : false;
constant bool sc_RayTracingCasterForceOpaque [[function_constant(85)]];
constant bool sc_RayTracingCasterForceOpaque_tmp = is_function_constant_defined(sc_RayTracingCasterForceOpaque) ? sc_RayTracingCasterForceOpaque : false;
constant bool sc_RayTracingGlobalIlluminationHasSwappedViews [[function_constant(86)]];
constant bool sc_RayTracingGlobalIlluminationHasSwappedViews_tmp = is_function_constant_defined(sc_RayTracingGlobalIlluminationHasSwappedViews) ? sc_RayTracingGlobalIlluminationHasSwappedViews : false;
constant bool sc_RayTracingReflectionsHasSwappedViews [[function_constant(87)]];
constant bool sc_RayTracingReflectionsHasSwappedViews_tmp = is_function_constant_defined(sc_RayTracingReflectionsHasSwappedViews) ? sc_RayTracingReflectionsHasSwappedViews : false;
constant bool sc_RayTracingShadowsHasSwappedViews [[function_constant(88)]];
constant bool sc_RayTracingShadowsHasSwappedViews_tmp = is_function_constant_defined(sc_RayTracingShadowsHasSwappedViews) ? sc_RayTracingShadowsHasSwappedViews : false;
constant bool sc_RenderAlphaToColor [[function_constant(89)]];
constant bool sc_RenderAlphaToColor_tmp = is_function_constant_defined(sc_RenderAlphaToColor) ? sc_RenderAlphaToColor : false;
constant bool sc_SSAOEnabled [[function_constant(90)]];
constant bool sc_SSAOEnabled_tmp = is_function_constant_defined(sc_SSAOEnabled) ? sc_SSAOEnabled : false;
constant bool sc_ScreenTextureHasSwappedViews [[function_constant(91)]];
constant bool sc_ScreenTextureHasSwappedViews_tmp = is_function_constant_defined(sc_ScreenTextureHasSwappedViews) ? sc_ScreenTextureHasSwappedViews : false;
constant bool sc_TAAEnabled [[function_constant(92)]];
constant bool sc_TAAEnabled_tmp = is_function_constant_defined(sc_TAAEnabled) ? sc_TAAEnabled : false;
constant bool sc_VertexBlendingUseNormals [[function_constant(93)]];
constant bool sc_VertexBlendingUseNormals_tmp = is_function_constant_defined(sc_VertexBlendingUseNormals) ? sc_VertexBlendingUseNormals : false;
constant bool sc_VertexBlending [[function_constant(94)]];
constant bool sc_VertexBlending_tmp = is_function_constant_defined(sc_VertexBlending) ? sc_VertexBlending : false;
constant bool sc_Voxelization [[function_constant(95)]];
constant bool sc_Voxelization_tmp = is_function_constant_defined(sc_Voxelization) ? sc_Voxelization : false;
constant int SC_DEVICE_CLASS [[function_constant(96)]];
constant int SC_DEVICE_CLASS_tmp = is_function_constant_defined(SC_DEVICE_CLASS) ? SC_DEVICE_CLASS : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_albedoSecondary [[function_constant(97)]];
constant int SC_SOFTWARE_WRAP_MODE_U_albedoSecondary_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_albedoSecondary) ? SC_SOFTWARE_WRAP_MODE_U_albedoSecondary : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_albedoTex [[function_constant(98)]];
constant int SC_SOFTWARE_WRAP_MODE_U_albedoTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_albedoTex) ? SC_SOFTWARE_WRAP_MODE_U_albedoTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_aoTex [[function_constant(99)]];
constant int SC_SOFTWARE_WRAP_MODE_U_aoTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_aoTex) ? SC_SOFTWARE_WRAP_MODE_U_aoTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture [[function_constant(100)]];
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_U_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_normalTex [[function_constant(101)]];
constant int SC_SOFTWARE_WRAP_MODE_U_normalTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_normalTex) ? SC_SOFTWARE_WRAP_MODE_U_normalTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_albedoSecondary [[function_constant(102)]];
constant int SC_SOFTWARE_WRAP_MODE_V_albedoSecondary_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_albedoSecondary) ? SC_SOFTWARE_WRAP_MODE_V_albedoSecondary : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_albedoTex [[function_constant(103)]];
constant int SC_SOFTWARE_WRAP_MODE_V_albedoTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_albedoTex) ? SC_SOFTWARE_WRAP_MODE_V_albedoTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_aoTex [[function_constant(104)]];
constant int SC_SOFTWARE_WRAP_MODE_V_aoTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_aoTex) ? SC_SOFTWARE_WRAP_MODE_V_aoTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture [[function_constant(105)]];
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_V_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_normalTex [[function_constant(106)]];
constant int SC_SOFTWARE_WRAP_MODE_V_normalTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_normalTex) ? SC_SOFTWARE_WRAP_MODE_V_normalTex : -1;
constant int albedoSecondaryLayout [[function_constant(107)]];
constant int albedoSecondaryLayout_tmp = is_function_constant_defined(albedoSecondaryLayout) ? albedoSecondaryLayout : 0;
constant int albedoTexLayout [[function_constant(108)]];
constant int albedoTexLayout_tmp = is_function_constant_defined(albedoTexLayout) ? albedoTexLayout : 0;
constant int aoTexLayout [[function_constant(109)]];
constant int aoTexLayout_tmp = is_function_constant_defined(aoTexLayout) ? aoTexLayout : 0;
constant int intensityTextureLayout [[function_constant(110)]];
constant int intensityTextureLayout_tmp = is_function_constant_defined(intensityTextureLayout) ? intensityTextureLayout : 0;
constant int normalTexLayout [[function_constant(111)]];
constant int normalTexLayout_tmp = is_function_constant_defined(normalTexLayout) ? normalTexLayout : 0;
constant int sc_AmbientLightMode0 [[function_constant(112)]];
constant int sc_AmbientLightMode0_tmp = is_function_constant_defined(sc_AmbientLightMode0) ? sc_AmbientLightMode0 : 0;
constant int sc_AmbientLightMode1 [[function_constant(113)]];
constant int sc_AmbientLightMode1_tmp = is_function_constant_defined(sc_AmbientLightMode1) ? sc_AmbientLightMode1 : 0;
constant int sc_AmbientLightMode2 [[function_constant(114)]];
constant int sc_AmbientLightMode2_tmp = is_function_constant_defined(sc_AmbientLightMode2) ? sc_AmbientLightMode2 : 0;
constant int sc_AmbientLightMode_Constant [[function_constant(115)]];
constant int sc_AmbientLightMode_Constant_tmp = is_function_constant_defined(sc_AmbientLightMode_Constant) ? sc_AmbientLightMode_Constant : 0;
constant int sc_AmbientLightMode_EnvironmentMap [[function_constant(116)]];
constant int sc_AmbientLightMode_EnvironmentMap_tmp = is_function_constant_defined(sc_AmbientLightMode_EnvironmentMap) ? sc_AmbientLightMode_EnvironmentMap : 0;
constant int sc_AmbientLightMode_FromCamera [[function_constant(117)]];
constant int sc_AmbientLightMode_FromCamera_tmp = is_function_constant_defined(sc_AmbientLightMode_FromCamera) ? sc_AmbientLightMode_FromCamera : 0;
constant int sc_AmbientLightMode_SphericalHarmonics [[function_constant(118)]];
constant int sc_AmbientLightMode_SphericalHarmonics_tmp = is_function_constant_defined(sc_AmbientLightMode_SphericalHarmonics) ? sc_AmbientLightMode_SphericalHarmonics : 0;
constant int sc_AmbientLightsCount [[function_constant(119)]];
constant int sc_AmbientLightsCount_tmp = is_function_constant_defined(sc_AmbientLightsCount) ? sc_AmbientLightsCount : 0;
constant int sc_DepthBufferMode [[function_constant(120)]];
constant int sc_DepthBufferMode_tmp = is_function_constant_defined(sc_DepthBufferMode) ? sc_DepthBufferMode : 0;
constant int sc_DirectionalLightsCount [[function_constant(121)]];
constant int sc_DirectionalLightsCount_tmp = is_function_constant_defined(sc_DirectionalLightsCount) ? sc_DirectionalLightsCount : 0;
constant int sc_EnvLightMode [[function_constant(122)]];
constant int sc_EnvLightMode_tmp = is_function_constant_defined(sc_EnvLightMode) ? sc_EnvLightMode : 0;
constant int sc_EnvmapDiffuseLayout [[function_constant(123)]];
constant int sc_EnvmapDiffuseLayout_tmp = is_function_constant_defined(sc_EnvmapDiffuseLayout) ? sc_EnvmapDiffuseLayout : 0;
constant int sc_EnvmapSpecularLayout [[function_constant(124)]];
constant int sc_EnvmapSpecularLayout_tmp = is_function_constant_defined(sc_EnvmapSpecularLayout) ? sc_EnvmapSpecularLayout : 0;
constant int sc_LightEstimationSGCount [[function_constant(125)]];
constant int sc_LightEstimationSGCount_tmp = is_function_constant_defined(sc_LightEstimationSGCount) ? sc_LightEstimationSGCount : 0;
constant int sc_PointLightsCount [[function_constant(126)]];
constant int sc_PointLightsCount_tmp = is_function_constant_defined(sc_PointLightsCount) ? sc_PointLightsCount : 0;
constant int sc_RayTracingGlobalIlluminationLayout [[function_constant(127)]];
constant int sc_RayTracingGlobalIlluminationLayout_tmp = is_function_constant_defined(sc_RayTracingGlobalIlluminationLayout) ? sc_RayTracingGlobalIlluminationLayout : 0;
constant int sc_RayTracingReflectionsLayout [[function_constant(128)]];
constant int sc_RayTracingReflectionsLayout_tmp = is_function_constant_defined(sc_RayTracingReflectionsLayout) ? sc_RayTracingReflectionsLayout : 0;
constant int sc_RayTracingShadowsLayout [[function_constant(129)]];
constant int sc_RayTracingShadowsLayout_tmp = is_function_constant_defined(sc_RayTracingShadowsLayout) ? sc_RayTracingShadowsLayout : 0;
constant int sc_RenderingSpace [[function_constant(130)]];
constant int sc_RenderingSpace_tmp = is_function_constant_defined(sc_RenderingSpace) ? sc_RenderingSpace : -1;
constant int sc_ScreenTextureLayout [[function_constant(131)]];
constant int sc_ScreenTextureLayout_tmp = is_function_constant_defined(sc_ScreenTextureLayout) ? sc_ScreenTextureLayout : 0;
constant int sc_ShaderCacheConstant [[function_constant(132)]];
constant int sc_ShaderCacheConstant_tmp = is_function_constant_defined(sc_ShaderCacheConstant) ? sc_ShaderCacheConstant : 0;
constant int sc_SkinBonesCount [[function_constant(133)]];
constant int sc_SkinBonesCount_tmp = is_function_constant_defined(sc_SkinBonesCount) ? sc_SkinBonesCount : 0;
constant int sc_StereoRenderingMode [[function_constant(134)]];
constant int sc_StereoRenderingMode_tmp = is_function_constant_defined(sc_StereoRenderingMode) ? sc_StereoRenderingMode : 0;
constant int sc_StereoRendering_IsClipDistanceEnabled [[function_constant(135)]];
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
int sc_RayTracingReceiverEffectsMask;
float4 sc_RayTracingReflectionsSize;
float4 sc_RayTracingReflectionsDims;
float4 sc_RayTracingReflectionsView;
float4 sc_RayTracingGlobalIlluminationSize;
float4 sc_RayTracingGlobalIlluminationDims;
float4 sc_RayTracingGlobalIlluminationView;
float4 sc_RayTracingShadowsSize;
float4 sc_RayTracingShadowsDims;
float4 sc_RayTracingShadowsView;
float3 sc_RayTracingOriginScale;
uint sc_RayTracingReceiverMask;
float3 sc_RayTracingOriginScaleInv;
float3 sc_RayTracingOriginOffset;
uint sc_RayTracingReceiverId;
uint4 sc_RayTracingCasterConfiguration;
uint4 sc_RayTracingCasterOffsetPNTC;
uint4 sc_RayTracingCasterOffsetTexture;
uint4 sc_RayTracingCasterFormatPNTC;
uint4 sc_RayTracingCasterFormatTexture;
float4 sc_RayTracingRayDirectionSize;
float4 sc_RayTracingRayDirectionDims;
float4 sc_RayTracingRayDirectionView;
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
int PreviewEnabled;
int PreviewNodeID;
float alphaTestThreshold;
float rimExponent;
float rimIntensity;
float4 rimColor;
float4 baseColor;
float4 albedoTexSize;
float4 albedoTexDims;
float4 albedoTexView;
float3x3 albedoTexTransform;
float4 albedoTexUvMinMax;
float4 albedoTexBorderColor;
float uvScale;
float4 albedoSecondarySize;
float4 albedoSecondaryDims;
float4 albedoSecondaryView;
float3x3 albedoSecondaryTransform;
float4 albedoSecondaryUvMinMax;
float4 albedoSecondaryBorderColor;
float progress;
float4 aoTexSize;
float4 aoTexDims;
float4 aoTexView;
float3x3 aoTexTransform;
float4 aoTexUvMinMax;
float4 aoTexBorderColor;
float aoScale;
float4 normalTexSize;
float4 normalTexDims;
float4 normalTexView;
float3x3 normalTexTransform;
float4 normalTexUvMinMax;
float4 normalTexBorderColor;
float metallic;
float roughness;
float2 Port_Center_N031;
float Port_Opacity_N000;
float4 Port_Input2_N019;
float3 Port_Emissive_N000;
float3 Port_AO_N000;
float3 Port_SpecularAO_N000;
float depthRef;
};
struct sc_Bone_t
{
float4 boneMatrix[3];
float4 normalMatrix[3];
};
struct sc_Bones_obj
{
sc_Bone_t sc_Bones[1];
};
struct ssPreviewInfo
{
float4 Color;
bool Saved;
};
struct sc_RayTracingCasterIndexBuffer_obj
{
uint sc_RayTracingCasterTriangles[1];
};
struct sc_RayTracingCasterVertexBuffer_obj
{
float sc_RayTracingCasterVertices[1];
};
struct sc_RayTracingCasterNonAnimatedVertexBuffer_obj
{
float sc_RayTracingCasterNonAnimatedVertices[1];
};
struct sc_Set0
{
const device sc_RayTracingCasterIndexBuffer_obj* sc_RayTracingCasterIndexBuffer [[id(0)]];
const device sc_RayTracingCasterVertexBuffer_obj* sc_RayTracingCasterVertexBuffer [[id(1)]];
const device sc_RayTracingCasterNonAnimatedVertexBuffer_obj* sc_RayTracingCasterNonAnimatedVertexBuffer [[id(2)]];
constant sc_Bones_obj* sc_BonesUBO [[id(3)]];
texture2d<float> albedoSecondary [[id(4)]];
texture2d<float> albedoTex [[id(5)]];
texture2d<float> aoTex [[id(6)]];
texture2d<float> intensityTexture [[id(7)]];
texture2d<float> normalTex [[id(8)]];
texture2d<float> sc_EnvmapDiffuse [[id(9)]];
texture2d<float> sc_EnvmapSpecular [[id(10)]];
texture2d<float> sc_RayTracingGlobalIllumination [[id(19)]];
texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric [[id(20)]];
texture2d<float> sc_RayTracingRayDirection [[id(21)]];
texture2d<float> sc_RayTracingReflections [[id(22)]];
texture2d<float> sc_RayTracingShadows [[id(23)]];
texture2d<float> sc_SSAOTexture [[id(24)]];
texture2d<float> sc_ScreenTexture [[id(25)]];
texture2d<float> sc_ShadowTexture [[id(26)]];
sampler albedoSecondarySmpSC [[id(28)]];
sampler albedoTexSmpSC [[id(29)]];
sampler aoTexSmpSC [[id(30)]];
sampler intensityTextureSmpSC [[id(31)]];
sampler normalTexSmpSC [[id(32)]];
sampler sc_EnvmapDiffuseSmpSC [[id(33)]];
sampler sc_EnvmapSpecularSmpSC [[id(34)]];
sampler sc_RayTracingGlobalIlluminationSmpSC [[id(36)]];
sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC [[id(37)]];
sampler sc_RayTracingRayDirectionSmpSC [[id(38)]];
sampler sc_RayTracingReflectionsSmpSC [[id(39)]];
sampler sc_RayTracingShadowsSmpSC [[id(40)]];
sampler sc_SSAOTextureSmpSC [[id(41)]];
sampler sc_ScreenTextureSmpSC [[id(42)]];
sampler sc_ShadowTextureSmpSC [[id(43)]];
constant userUniformsObj* UserUniforms [[id(45)]];
};
struct main_vert_out
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float varViewSpaceDepth [[user(locn6)]];
float2 varShadowTex [[user(locn7)]];
int varStereoViewID [[user(locn8)]];
float varClipDistance [[user(locn9)]];
float4 varColor [[user(locn10)]];
float4 PreviewVertexColor [[user(locn11)]];
float PreviewVertexSaved [[user(locn12)]];
float4 gl_Position [[position]];
};
struct main_vert_in
{
float4 position [[attribute(0)]];
float3 normal [[attribute(1)]];
float4 tangent [[attribute(2)]];
float2 texture0 [[attribute(3)]];
float2 texture1 [[attribute(4)]];
float4 boneData [[attribute(5)]];
float3 blendShape0Pos [[attribute(6)]];
float3 blendShape1Pos [[attribute(7)]];
float3 blendShape2Pos [[attribute(8)]];
float3 blendShape3Pos [[attribute(9)]];
float3 blendShape4Pos [[attribute(10)]];
float3 blendShape5Pos [[attribute(11)]];
float3 blendShape0Normal [[attribute(12)]];
float3 blendShape1Normal [[attribute(13)]];
float3 blendShape2Normal [[attribute(14)]];
float3 positionNext [[attribute(15)]];
float3 positionPrevious [[attribute(16)]];
float4 strandProperties [[attribute(17)]];
float4 color [[attribute(18)]];
};
vertex main_vert_out main_vert(main_vert_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],uint gl_InstanceIndex [[instance_id]])
{
main_vert_out out={};
if ((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.x!=0u)
{
float4 param=float4(in.position.xy,(*sc_set0.UserUniforms).depthRef+(1e-10*in.position.z),1.0+(1e-10*in.position.w));
if (sc_ShaderCacheConstant_tmp!=0)
{
param.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_0=param;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_1=dot(l9_0,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_2=l9_1;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_2;
}
}
float4 l9_3=float4(param.x,-param.y,(param.z*0.5)+(param.w*0.5),param.w);
out.gl_Position=l9_3;
return out;
}
out.PreviewVertexColor=float4(0.5);
ssPreviewInfo PreviewInfo;
PreviewInfo.Color=float4(0.5);
PreviewInfo.Saved=false;
out.PreviewVertexSaved=0.0;
sc_Vertex_t l9_5;
l9_5.position=in.position;
l9_5.normal=in.normal;
l9_5.tangent=in.tangent.xyz;
l9_5.texture0=in.texture0;
l9_5.texture1=in.texture1;
sc_Vertex_t l9_6=l9_5;
sc_Vertex_t param_1=l9_6;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_7=param_1;
param_1=l9_7;
}
sc_Vertex_t l9_8=param_1;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_9=l9_8;
float3 l9_10=in.blendShape0Pos;
float3 l9_11=in.blendShape0Normal;
float l9_12=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_13=l9_9;
float3 l9_14=l9_10;
float l9_15=l9_12;
float3 l9_16=l9_13.position.xyz+(l9_14*l9_15);
l9_13.position=float4(l9_16.x,l9_16.y,l9_16.z,l9_13.position.w);
l9_9=l9_13;
l9_9.normal+=(l9_11*l9_12);
l9_8=l9_9;
sc_Vertex_t l9_17=l9_8;
float3 l9_18=in.blendShape1Pos;
float3 l9_19=in.blendShape1Normal;
float l9_20=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_21=l9_17;
float3 l9_22=l9_18;
float l9_23=l9_20;
float3 l9_24=l9_21.position.xyz+(l9_22*l9_23);
l9_21.position=float4(l9_24.x,l9_24.y,l9_24.z,l9_21.position.w);
l9_17=l9_21;
l9_17.normal+=(l9_19*l9_20);
l9_8=l9_17;
sc_Vertex_t l9_25=l9_8;
float3 l9_26=in.blendShape2Pos;
float3 l9_27=in.blendShape2Normal;
float l9_28=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_29=l9_25;
float3 l9_30=l9_26;
float l9_31=l9_28;
float3 l9_32=l9_29.position.xyz+(l9_30*l9_31);
l9_29.position=float4(l9_32.x,l9_32.y,l9_32.z,l9_29.position.w);
l9_25=l9_29;
l9_25.normal+=(l9_27*l9_28);
l9_8=l9_25;
}
else
{
sc_Vertex_t l9_33=l9_8;
float3 l9_34=in.blendShape0Pos;
float l9_35=(*sc_set0.UserUniforms).weights0.x;
float3 l9_36=l9_33.position.xyz+(l9_34*l9_35);
l9_33.position=float4(l9_36.x,l9_36.y,l9_36.z,l9_33.position.w);
l9_8=l9_33;
sc_Vertex_t l9_37=l9_8;
float3 l9_38=in.blendShape1Pos;
float l9_39=(*sc_set0.UserUniforms).weights0.y;
float3 l9_40=l9_37.position.xyz+(l9_38*l9_39);
l9_37.position=float4(l9_40.x,l9_40.y,l9_40.z,l9_37.position.w);
l9_8=l9_37;
sc_Vertex_t l9_41=l9_8;
float3 l9_42=in.blendShape2Pos;
float l9_43=(*sc_set0.UserUniforms).weights0.z;
float3 l9_44=l9_41.position.xyz+(l9_42*l9_43);
l9_41.position=float4(l9_44.x,l9_44.y,l9_44.z,l9_41.position.w);
l9_8=l9_41;
sc_Vertex_t l9_45=l9_8;
float3 l9_46=in.blendShape3Pos;
float l9_47=(*sc_set0.UserUniforms).weights0.w;
float3 l9_48=l9_45.position.xyz+(l9_46*l9_47);
l9_45.position=float4(l9_48.x,l9_48.y,l9_48.z,l9_45.position.w);
l9_8=l9_45;
sc_Vertex_t l9_49=l9_8;
float3 l9_50=in.blendShape4Pos;
float l9_51=(*sc_set0.UserUniforms).weights1.x;
float3 l9_52=l9_49.position.xyz+(l9_50*l9_51);
l9_49.position=float4(l9_52.x,l9_52.y,l9_52.z,l9_49.position.w);
l9_8=l9_49;
sc_Vertex_t l9_53=l9_8;
float3 l9_54=in.blendShape5Pos;
float l9_55=(*sc_set0.UserUniforms).weights1.y;
float3 l9_56=l9_53.position.xyz+(l9_54*l9_55);
l9_53.position=float4(l9_56.x,l9_56.y,l9_56.z,l9_53.position.w);
l9_8=l9_53;
}
}
param_1=l9_8;
sc_Vertex_t l9_57=param_1;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_58=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_58=float4(1.0,fract(in.boneData.yzw));
l9_58.x-=dot(l9_58.yzw,float3(1.0));
}
float4 l9_59=l9_58;
float4 l9_60=l9_59;
int l9_61=int(in.boneData.x);
int l9_62=int(in.boneData.y);
int l9_63=int(in.boneData.z);
int l9_64=int(in.boneData.w);
int l9_65=l9_61;
float4 l9_66=l9_57.position;
float3 l9_67=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_68=l9_65;
float4 l9_69=(*sc_set0.sc_BonesUBO).sc_Bones[l9_68].boneMatrix[0];
float4 l9_70=(*sc_set0.sc_BonesUBO).sc_Bones[l9_68].boneMatrix[1];
float4 l9_71=(*sc_set0.sc_BonesUBO).sc_Bones[l9_68].boneMatrix[2];
float4 l9_72[3];
l9_72[0]=l9_69;
l9_72[1]=l9_70;
l9_72[2]=l9_71;
l9_67=float3(dot(l9_66,l9_72[0]),dot(l9_66,l9_72[1]),dot(l9_66,l9_72[2]));
}
else
{
l9_67=l9_66.xyz;
}
float3 l9_73=l9_67;
float3 l9_74=l9_73;
float l9_75=l9_60.x;
int l9_76=l9_62;
float4 l9_77=l9_57.position;
float3 l9_78=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_79=l9_76;
float4 l9_80=(*sc_set0.sc_BonesUBO).sc_Bones[l9_79].boneMatrix[0];
float4 l9_81=(*sc_set0.sc_BonesUBO).sc_Bones[l9_79].boneMatrix[1];
float4 l9_82=(*sc_set0.sc_BonesUBO).sc_Bones[l9_79].boneMatrix[2];
float4 l9_83[3];
l9_83[0]=l9_80;
l9_83[1]=l9_81;
l9_83[2]=l9_82;
l9_78=float3(dot(l9_77,l9_83[0]),dot(l9_77,l9_83[1]),dot(l9_77,l9_83[2]));
}
else
{
l9_78=l9_77.xyz;
}
float3 l9_84=l9_78;
float3 l9_85=l9_84;
float l9_86=l9_60.y;
int l9_87=l9_63;
float4 l9_88=l9_57.position;
float3 l9_89=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_90=l9_87;
float4 l9_91=(*sc_set0.sc_BonesUBO).sc_Bones[l9_90].boneMatrix[0];
float4 l9_92=(*sc_set0.sc_BonesUBO).sc_Bones[l9_90].boneMatrix[1];
float4 l9_93=(*sc_set0.sc_BonesUBO).sc_Bones[l9_90].boneMatrix[2];
float4 l9_94[3];
l9_94[0]=l9_91;
l9_94[1]=l9_92;
l9_94[2]=l9_93;
l9_89=float3(dot(l9_88,l9_94[0]),dot(l9_88,l9_94[1]),dot(l9_88,l9_94[2]));
}
else
{
l9_89=l9_88.xyz;
}
float3 l9_95=l9_89;
float3 l9_96=l9_95;
float l9_97=l9_60.z;
int l9_98=l9_64;
float4 l9_99=l9_57.position;
float3 l9_100=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_101=l9_98;
float4 l9_102=(*sc_set0.sc_BonesUBO).sc_Bones[l9_101].boneMatrix[0];
float4 l9_103=(*sc_set0.sc_BonesUBO).sc_Bones[l9_101].boneMatrix[1];
float4 l9_104=(*sc_set0.sc_BonesUBO).sc_Bones[l9_101].boneMatrix[2];
float4 l9_105[3];
l9_105[0]=l9_102;
l9_105[1]=l9_103;
l9_105[2]=l9_104;
l9_100=float3(dot(l9_99,l9_105[0]),dot(l9_99,l9_105[1]),dot(l9_99,l9_105[2]));
}
else
{
l9_100=l9_99.xyz;
}
float3 l9_106=l9_100;
float3 l9_107=(((l9_74*l9_75)+(l9_85*l9_86))+(l9_96*l9_97))+(l9_106*l9_60.w);
l9_57.position=float4(l9_107.x,l9_107.y,l9_107.z,l9_57.position.w);
int l9_108=l9_61;
float3x3 l9_109=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_108].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_108].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_108].normalMatrix[2].xyz));
float3x3 l9_110=l9_109;
float3x3 l9_111=l9_110;
int l9_112=l9_62;
float3x3 l9_113=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_112].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_112].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_112].normalMatrix[2].xyz));
float3x3 l9_114=l9_113;
float3x3 l9_115=l9_114;
int l9_116=l9_63;
float3x3 l9_117=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_116].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_116].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_116].normalMatrix[2].xyz));
float3x3 l9_118=l9_117;
float3x3 l9_119=l9_118;
int l9_120=l9_64;
float3x3 l9_121=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_120].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_120].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_120].normalMatrix[2].xyz));
float3x3 l9_122=l9_121;
float3x3 l9_123=l9_122;
l9_57.normal=((((l9_111*l9_57.normal)*l9_60.x)+((l9_115*l9_57.normal)*l9_60.y))+((l9_119*l9_57.normal)*l9_60.z))+((l9_123*l9_57.normal)*l9_60.w);
l9_57.tangent=((((l9_111*l9_57.tangent)*l9_60.x)+((l9_115*l9_57.tangent)*l9_60.y))+((l9_119*l9_57.tangent)*l9_60.z))+((l9_123*l9_57.tangent)*l9_60.w);
}
param_1=l9_57;
if (sc_RenderingSpace_tmp==3)
{
out.varPosAndMotion=float4(float3(0.0).x,float3(0.0).y,float3(0.0).z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param_1.normal.x,param_1.normal.y,param_1.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param_1.tangent.x,param_1.tangent.y,param_1.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==4)
{
out.varPosAndMotion=float4(float3(0.0).x,float3(0.0).y,float3(0.0).z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param_1.normal.x,param_1.normal.y,param_1.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param_1.tangent.x,param_1.tangent.y,param_1.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
out.varPosAndMotion=float4(param_1.position.xyz.x,param_1.position.xyz.y,param_1.position.xyz.z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param_1.normal.x,param_1.normal.y,param_1.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param_1.tangent.x,param_1.tangent.y,param_1.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
float3 l9_124=((*sc_set0.UserUniforms).sc_ModelMatrix*param_1.position).xyz;
out.varPosAndMotion=float4(l9_124.x,l9_124.y,l9_124.z,out.varPosAndMotion.w);
float3 l9_125=(*sc_set0.UserUniforms).sc_NormalMatrix*param_1.normal;
out.varNormalAndMotion=float4(l9_125.x,l9_125.y,l9_125.z,out.varNormalAndMotion.w);
float3 l9_126=(*sc_set0.UserUniforms).sc_NormalMatrix*param_1.tangent;
out.varTangent=float4(l9_126.x,l9_126.y,l9_126.z,out.varTangent.w);
}
}
}
}
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
param_1.texture0.x=1.0-param_1.texture0.x;
}
out.varColor=in.color;
sc_Vertex_t v=param_1;
float3 WorldPosition=out.varPosAndMotion.xyz;
float3 WorldNormal=out.varNormalAndMotion.xyz;
float3 WorldTangent=out.varTangent.xyz;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
WorldPosition=out.varPosAndMotion.xyz;
WorldNormal=out.varNormalAndMotion.xyz;
WorldTangent=out.varTangent.xyz;
}
sc_Vertex_t param_2=v;
float3 param_3=WorldPosition;
float3 param_4=WorldNormal;
float3 param_5=WorldTangent;
float4 param_6=v.position;
out.varPosAndMotion=float4(param_3.x,param_3.y,param_3.z,out.varPosAndMotion.w);
float3 l9_127=normalize(param_4);
out.varNormalAndMotion=float4(l9_127.x,l9_127.y,l9_127.z,out.varNormalAndMotion.w);
float3 l9_128=normalize(param_5);
out.varTangent=float4(l9_128.x,l9_128.y,l9_128.z,out.varTangent.w);
out.varTangent.w=in.tangent.w;
if ((int(UseViewSpaceDepthVariant_tmp)!=0)&&(((int(sc_OITDepthGatherPass_tmp)!=0)||(int(sc_OITCompositingPass_tmp)!=0))||(int(sc_OITDepthBoundsPass_tmp)!=0)))
{
float4 l9_129=param_2.position;
float4 l9_130=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
int l9_131=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_131=0;
}
else
{
l9_131=gl_InstanceIndex%2;
}
int l9_132=l9_131;
l9_130=(*sc_set0.UserUniforms).sc_ProjectionMatrixInverseArray[l9_132]*l9_129;
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_133=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_133=0;
}
else
{
l9_133=gl_InstanceIndex%2;
}
int l9_134=l9_133;
l9_130=(*sc_set0.UserUniforms).sc_ViewMatrixArray[l9_134]*l9_129;
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_135=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_135=0;
}
else
{
l9_135=gl_InstanceIndex%2;
}
int l9_136=l9_135;
l9_130=(*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_136]*l9_129;
}
else
{
l9_130=l9_129;
}
}
}
float4 l9_137=l9_130;
out.varViewSpaceDepth=-l9_137.z;
}
float4 l9_138=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
l9_138=param_6;
}
else
{
if (sc_RenderingSpace_tmp==4)
{
int l9_139=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_139=0;
}
else
{
l9_139=gl_InstanceIndex%2;
}
int l9_140=l9_139;
l9_138=((*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_140]*param_2.position)*float4(1.0/(*sc_set0.UserUniforms).sc_Camera.aspect,1.0,1.0,1.0);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_141=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_141=0;
}
else
{
l9_141=gl_InstanceIndex%2;
}
int l9_142=l9_141;
l9_138=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_142]*float4(out.varPosAndMotion.xyz,1.0);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_143=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_143=0;
}
else
{
l9_143=gl_InstanceIndex%2;
}
int l9_144=l9_143;
l9_138=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_144]*float4(out.varPosAndMotion.xyz,1.0);
}
}
}
}
out.varTex01=float4(param_2.texture0,param_2.texture1);
if ((int(sc_ProjectiveShadowsReceiver_tmp)!=0))
{
float4 l9_145=param_2.position;
float4 l9_146=l9_145;
if (sc_RenderingSpace_tmp==1)
{
l9_146=(*sc_set0.UserUniforms).sc_ModelMatrix*l9_145;
}
float4 l9_147=(*sc_set0.UserUniforms).sc_ProjectorMatrix*l9_146;
float2 l9_148=((l9_147.xy/float2(l9_147.w))*0.5)+float2(0.5);
out.varShadowTex=l9_148;
}
float4 l9_149=l9_138;
if (sc_DepthBufferMode_tmp==1)
{
int l9_150=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_150=0;
}
else
{
l9_150=gl_InstanceIndex%2;
}
int l9_151=l9_150;
if ((*sc_set0.UserUniforms).sc_ProjectionMatrixArray[l9_151][2].w!=0.0)
{
float l9_152=2.0/log2((*sc_set0.UserUniforms).sc_Camera.clipPlanes.y+1.0);
l9_149.z=((log2(fast::max((*sc_set0.UserUniforms).sc_Camera.clipPlanes.x,1.0+l9_149.w))*l9_152)-1.0)*l9_149.w;
}
}
float4 l9_153=l9_149;
l9_138=l9_153;
float4 l9_154=l9_138;
if ((int(sc_TAAEnabled_tmp)!=0))
{
float2 l9_155=l9_154.xy+((*sc_set0.UserUniforms).sc_TAAJitterOffset*l9_154.w);
l9_154=float4(l9_155.x,l9_155.y,l9_154.z,l9_154.w);
}
float4 l9_156=l9_154;
l9_138=l9_156;
float4 l9_157=l9_138;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_157.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_158=l9_157;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_159=dot(l9_158,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_160=l9_159;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_160;
}
}
float4 l9_161=float4(l9_157.x,-l9_157.y,(l9_157.z*0.5)+(l9_157.w*0.5),l9_157.w);
out.gl_Position=l9_161;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_162=param_2;
sc_Vertex_t l9_163=l9_162;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_164=l9_163;
float3 l9_165=in.blendShape0Pos;
float3 l9_166=in.blendShape0Normal;
float l9_167=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_168=l9_164;
float3 l9_169=l9_165;
float l9_170=l9_167;
float3 l9_171=l9_168.position.xyz+(l9_169*l9_170);
l9_168.position=float4(l9_171.x,l9_171.y,l9_171.z,l9_168.position.w);
l9_164=l9_168;
l9_164.normal+=(l9_166*l9_167);
l9_163=l9_164;
sc_Vertex_t l9_172=l9_163;
float3 l9_173=in.blendShape1Pos;
float3 l9_174=in.blendShape1Normal;
float l9_175=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_176=l9_172;
float3 l9_177=l9_173;
float l9_178=l9_175;
float3 l9_179=l9_176.position.xyz+(l9_177*l9_178);
l9_176.position=float4(l9_179.x,l9_179.y,l9_179.z,l9_176.position.w);
l9_172=l9_176;
l9_172.normal+=(l9_174*l9_175);
l9_163=l9_172;
sc_Vertex_t l9_180=l9_163;
float3 l9_181=in.blendShape2Pos;
float3 l9_182=in.blendShape2Normal;
float l9_183=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_184=l9_180;
float3 l9_185=l9_181;
float l9_186=l9_183;
float3 l9_187=l9_184.position.xyz+(l9_185*l9_186);
l9_184.position=float4(l9_187.x,l9_187.y,l9_187.z,l9_184.position.w);
l9_180=l9_184;
l9_180.normal+=(l9_182*l9_183);
l9_163=l9_180;
}
else
{
sc_Vertex_t l9_188=l9_163;
float3 l9_189=in.blendShape0Pos;
float l9_190=(*sc_set0.UserUniforms).weights0.x;
float3 l9_191=l9_188.position.xyz+(l9_189*l9_190);
l9_188.position=float4(l9_191.x,l9_191.y,l9_191.z,l9_188.position.w);
l9_163=l9_188;
sc_Vertex_t l9_192=l9_163;
float3 l9_193=in.blendShape1Pos;
float l9_194=(*sc_set0.UserUniforms).weights0.y;
float3 l9_195=l9_192.position.xyz+(l9_193*l9_194);
l9_192.position=float4(l9_195.x,l9_195.y,l9_195.z,l9_192.position.w);
l9_163=l9_192;
sc_Vertex_t l9_196=l9_163;
float3 l9_197=in.blendShape2Pos;
float l9_198=(*sc_set0.UserUniforms).weights0.z;
float3 l9_199=l9_196.position.xyz+(l9_197*l9_198);
l9_196.position=float4(l9_199.x,l9_199.y,l9_199.z,l9_196.position.w);
l9_163=l9_196;
sc_Vertex_t l9_200=l9_163;
float3 l9_201=in.blendShape3Pos;
float l9_202=(*sc_set0.UserUniforms).weights0.w;
float3 l9_203=l9_200.position.xyz+(l9_201*l9_202);
l9_200.position=float4(l9_203.x,l9_203.y,l9_203.z,l9_200.position.w);
l9_163=l9_200;
sc_Vertex_t l9_204=l9_163;
float3 l9_205=in.blendShape4Pos;
float l9_206=(*sc_set0.UserUniforms).weights1.x;
float3 l9_207=l9_204.position.xyz+(l9_205*l9_206);
l9_204.position=float4(l9_207.x,l9_207.y,l9_207.z,l9_204.position.w);
l9_163=l9_204;
sc_Vertex_t l9_208=l9_163;
float3 l9_209=in.blendShape5Pos;
float l9_210=(*sc_set0.UserUniforms).weights1.y;
float3 l9_211=l9_208.position.xyz+(l9_209*l9_210);
l9_208.position=float4(l9_211.x,l9_211.y,l9_211.z,l9_208.position.w);
l9_163=l9_208;
}
}
l9_162=l9_163;
sc_Vertex_t l9_212=l9_162;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_213=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_213=float4(1.0,fract(in.boneData.yzw));
l9_213.x-=dot(l9_213.yzw,float3(1.0));
}
float4 l9_214=l9_213;
float4 l9_215=l9_214;
int l9_216=int(in.boneData.x);
int l9_217=int(in.boneData.y);
int l9_218=int(in.boneData.z);
int l9_219=int(in.boneData.w);
int l9_220=l9_216;
float4 l9_221=l9_212.position;
float3 l9_222=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_223=l9_220;
float4 l9_224=(*sc_set0.sc_BonesUBO).sc_Bones[l9_223].boneMatrix[0];
float4 l9_225=(*sc_set0.sc_BonesUBO).sc_Bones[l9_223].boneMatrix[1];
float4 l9_226=(*sc_set0.sc_BonesUBO).sc_Bones[l9_223].boneMatrix[2];
float4 l9_227[3];
l9_227[0]=l9_224;
l9_227[1]=l9_225;
l9_227[2]=l9_226;
l9_222=float3(dot(l9_221,l9_227[0]),dot(l9_221,l9_227[1]),dot(l9_221,l9_227[2]));
}
else
{
l9_222=l9_221.xyz;
}
float3 l9_228=l9_222;
float3 l9_229=l9_228;
float l9_230=l9_215.x;
int l9_231=l9_217;
float4 l9_232=l9_212.position;
float3 l9_233=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_234=l9_231;
float4 l9_235=(*sc_set0.sc_BonesUBO).sc_Bones[l9_234].boneMatrix[0];
float4 l9_236=(*sc_set0.sc_BonesUBO).sc_Bones[l9_234].boneMatrix[1];
float4 l9_237=(*sc_set0.sc_BonesUBO).sc_Bones[l9_234].boneMatrix[2];
float4 l9_238[3];
l9_238[0]=l9_235;
l9_238[1]=l9_236;
l9_238[2]=l9_237;
l9_233=float3(dot(l9_232,l9_238[0]),dot(l9_232,l9_238[1]),dot(l9_232,l9_238[2]));
}
else
{
l9_233=l9_232.xyz;
}
float3 l9_239=l9_233;
float3 l9_240=l9_239;
float l9_241=l9_215.y;
int l9_242=l9_218;
float4 l9_243=l9_212.position;
float3 l9_244=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_245=l9_242;
float4 l9_246=(*sc_set0.sc_BonesUBO).sc_Bones[l9_245].boneMatrix[0];
float4 l9_247=(*sc_set0.sc_BonesUBO).sc_Bones[l9_245].boneMatrix[1];
float4 l9_248=(*sc_set0.sc_BonesUBO).sc_Bones[l9_245].boneMatrix[2];
float4 l9_249[3];
l9_249[0]=l9_246;
l9_249[1]=l9_247;
l9_249[2]=l9_248;
l9_244=float3(dot(l9_243,l9_249[0]),dot(l9_243,l9_249[1]),dot(l9_243,l9_249[2]));
}
else
{
l9_244=l9_243.xyz;
}
float3 l9_250=l9_244;
float3 l9_251=l9_250;
float l9_252=l9_215.z;
int l9_253=l9_219;
float4 l9_254=l9_212.position;
float3 l9_255=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_256=l9_253;
float4 l9_257=(*sc_set0.sc_BonesUBO).sc_Bones[l9_256].boneMatrix[0];
float4 l9_258=(*sc_set0.sc_BonesUBO).sc_Bones[l9_256].boneMatrix[1];
float4 l9_259=(*sc_set0.sc_BonesUBO).sc_Bones[l9_256].boneMatrix[2];
float4 l9_260[3];
l9_260[0]=l9_257;
l9_260[1]=l9_258;
l9_260[2]=l9_259;
l9_255=float3(dot(l9_254,l9_260[0]),dot(l9_254,l9_260[1]),dot(l9_254,l9_260[2]));
}
else
{
l9_255=l9_254.xyz;
}
float3 l9_261=l9_255;
float3 l9_262=(((l9_229*l9_230)+(l9_240*l9_241))+(l9_251*l9_252))+(l9_261*l9_215.w);
l9_212.position=float4(l9_262.x,l9_262.y,l9_262.z,l9_212.position.w);
int l9_263=l9_216;
float3x3 l9_264=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[2].xyz));
float3x3 l9_265=l9_264;
float3x3 l9_266=l9_265;
int l9_267=l9_217;
float3x3 l9_268=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[2].xyz));
float3x3 l9_269=l9_268;
float3x3 l9_270=l9_269;
int l9_271=l9_218;
float3x3 l9_272=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[2].xyz));
float3x3 l9_273=l9_272;
float3x3 l9_274=l9_273;
int l9_275=l9_219;
float3x3 l9_276=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_275].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_275].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_275].normalMatrix[2].xyz));
float3x3 l9_277=l9_276;
float3x3 l9_278=l9_277;
l9_212.normal=((((l9_266*l9_212.normal)*l9_215.x)+((l9_270*l9_212.normal)*l9_215.y))+((l9_274*l9_212.normal)*l9_215.z))+((l9_278*l9_212.normal)*l9_215.w);
l9_212.tangent=((((l9_266*l9_212.tangent)*l9_215.x)+((l9_270*l9_212.tangent)*l9_215.y))+((l9_274*l9_212.tangent)*l9_215.z))+((l9_278*l9_212.tangent)*l9_215.w);
}
l9_162=l9_212;
float l9_279=(*sc_set0.UserUniforms).voxelization_params_0.y;
float l9_280=(*sc_set0.UserUniforms).voxelization_params_0.z;
float l9_281=(*sc_set0.UserUniforms).voxelization_params_0.w;
float l9_282=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_283=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_284=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_285=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_286=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_287=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float3 l9_288=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float l9_289=l9_279/l9_280;
int l9_290=gl_InstanceIndex;
int l9_291=l9_290;
l9_162.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_162.position;
float3 l9_292=l9_162.position.xyz;
float3 l9_293=float3(float(l9_291%int(l9_281))*l9_279,float(l9_291/int(l9_281))*l9_279,(float(l9_291)*l9_289)+l9_286);
float3 l9_294=l9_292+l9_293;
float4 l9_295=float4(l9_294-l9_288,1.0);
float l9_296=l9_282;
float l9_297=l9_283;
float l9_298=l9_284;
float l9_299=l9_285;
float l9_300=l9_286;
float l9_301=l9_287;
float4x4 l9_302=float4x4(float4(2.0/(l9_297-l9_296),0.0,0.0,(-(l9_297+l9_296))/(l9_297-l9_296)),float4(0.0,2.0/(l9_299-l9_298),0.0,(-(l9_299+l9_298))/(l9_299-l9_298)),float4(0.0,0.0,(-2.0)/(l9_301-l9_300),(-(l9_301+l9_300))/(l9_301-l9_300)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_303=l9_302;
float4 l9_304=l9_303*l9_295;
l9_304.w=1.0;
out.varScreenPos=l9_304;
float4 l9_305=l9_304*1.0;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_305.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_306=l9_305;
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
float4 l9_309=float4(l9_305.x,-l9_305.y,(l9_305.z*0.5)+(l9_305.w*0.5),l9_305.w);
out.gl_Position=l9_309;
param_2=l9_162;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
sc_Vertex_t l9_310=param_2;
sc_Vertex_t l9_311=l9_310;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_312=l9_311;
float3 l9_313=in.blendShape0Pos;
float3 l9_314=in.blendShape0Normal;
float l9_315=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_316=l9_312;
float3 l9_317=l9_313;
float l9_318=l9_315;
float3 l9_319=l9_316.position.xyz+(l9_317*l9_318);
l9_316.position=float4(l9_319.x,l9_319.y,l9_319.z,l9_316.position.w);
l9_312=l9_316;
l9_312.normal+=(l9_314*l9_315);
l9_311=l9_312;
sc_Vertex_t l9_320=l9_311;
float3 l9_321=in.blendShape1Pos;
float3 l9_322=in.blendShape1Normal;
float l9_323=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_324=l9_320;
float3 l9_325=l9_321;
float l9_326=l9_323;
float3 l9_327=l9_324.position.xyz+(l9_325*l9_326);
l9_324.position=float4(l9_327.x,l9_327.y,l9_327.z,l9_324.position.w);
l9_320=l9_324;
l9_320.normal+=(l9_322*l9_323);
l9_311=l9_320;
sc_Vertex_t l9_328=l9_311;
float3 l9_329=in.blendShape2Pos;
float3 l9_330=in.blendShape2Normal;
float l9_331=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_332=l9_328;
float3 l9_333=l9_329;
float l9_334=l9_331;
float3 l9_335=l9_332.position.xyz+(l9_333*l9_334);
l9_332.position=float4(l9_335.x,l9_335.y,l9_335.z,l9_332.position.w);
l9_328=l9_332;
l9_328.normal+=(l9_330*l9_331);
l9_311=l9_328;
}
else
{
sc_Vertex_t l9_336=l9_311;
float3 l9_337=in.blendShape0Pos;
float l9_338=(*sc_set0.UserUniforms).weights0.x;
float3 l9_339=l9_336.position.xyz+(l9_337*l9_338);
l9_336.position=float4(l9_339.x,l9_339.y,l9_339.z,l9_336.position.w);
l9_311=l9_336;
sc_Vertex_t l9_340=l9_311;
float3 l9_341=in.blendShape1Pos;
float l9_342=(*sc_set0.UserUniforms).weights0.y;
float3 l9_343=l9_340.position.xyz+(l9_341*l9_342);
l9_340.position=float4(l9_343.x,l9_343.y,l9_343.z,l9_340.position.w);
l9_311=l9_340;
sc_Vertex_t l9_344=l9_311;
float3 l9_345=in.blendShape2Pos;
float l9_346=(*sc_set0.UserUniforms).weights0.z;
float3 l9_347=l9_344.position.xyz+(l9_345*l9_346);
l9_344.position=float4(l9_347.x,l9_347.y,l9_347.z,l9_344.position.w);
l9_311=l9_344;
sc_Vertex_t l9_348=l9_311;
float3 l9_349=in.blendShape3Pos;
float l9_350=(*sc_set0.UserUniforms).weights0.w;
float3 l9_351=l9_348.position.xyz+(l9_349*l9_350);
l9_348.position=float4(l9_351.x,l9_351.y,l9_351.z,l9_348.position.w);
l9_311=l9_348;
sc_Vertex_t l9_352=l9_311;
float3 l9_353=in.blendShape4Pos;
float l9_354=(*sc_set0.UserUniforms).weights1.x;
float3 l9_355=l9_352.position.xyz+(l9_353*l9_354);
l9_352.position=float4(l9_355.x,l9_355.y,l9_355.z,l9_352.position.w);
l9_311=l9_352;
sc_Vertex_t l9_356=l9_311;
float3 l9_357=in.blendShape5Pos;
float l9_358=(*sc_set0.UserUniforms).weights1.y;
float3 l9_359=l9_356.position.xyz+(l9_357*l9_358);
l9_356.position=float4(l9_359.x,l9_359.y,l9_359.z,l9_356.position.w);
l9_311=l9_356;
}
}
l9_310=l9_311;
sc_Vertex_t l9_360=l9_310;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_361=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_361=float4(1.0,fract(in.boneData.yzw));
l9_361.x-=dot(l9_361.yzw,float3(1.0));
}
float4 l9_362=l9_361;
float4 l9_363=l9_362;
int l9_364=int(in.boneData.x);
int l9_365=int(in.boneData.y);
int l9_366=int(in.boneData.z);
int l9_367=int(in.boneData.w);
int l9_368=l9_364;
float4 l9_369=l9_360.position;
float3 l9_370=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_371=l9_368;
float4 l9_372=(*sc_set0.sc_BonesUBO).sc_Bones[l9_371].boneMatrix[0];
float4 l9_373=(*sc_set0.sc_BonesUBO).sc_Bones[l9_371].boneMatrix[1];
float4 l9_374=(*sc_set0.sc_BonesUBO).sc_Bones[l9_371].boneMatrix[2];
float4 l9_375[3];
l9_375[0]=l9_372;
l9_375[1]=l9_373;
l9_375[2]=l9_374;
l9_370=float3(dot(l9_369,l9_375[0]),dot(l9_369,l9_375[1]),dot(l9_369,l9_375[2]));
}
else
{
l9_370=l9_369.xyz;
}
float3 l9_376=l9_370;
float3 l9_377=l9_376;
float l9_378=l9_363.x;
int l9_379=l9_365;
float4 l9_380=l9_360.position;
float3 l9_381=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_382=l9_379;
float4 l9_383=(*sc_set0.sc_BonesUBO).sc_Bones[l9_382].boneMatrix[0];
float4 l9_384=(*sc_set0.sc_BonesUBO).sc_Bones[l9_382].boneMatrix[1];
float4 l9_385=(*sc_set0.sc_BonesUBO).sc_Bones[l9_382].boneMatrix[2];
float4 l9_386[3];
l9_386[0]=l9_383;
l9_386[1]=l9_384;
l9_386[2]=l9_385;
l9_381=float3(dot(l9_380,l9_386[0]),dot(l9_380,l9_386[1]),dot(l9_380,l9_386[2]));
}
else
{
l9_381=l9_380.xyz;
}
float3 l9_387=l9_381;
float3 l9_388=l9_387;
float l9_389=l9_363.y;
int l9_390=l9_366;
float4 l9_391=l9_360.position;
float3 l9_392=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_393=l9_390;
float4 l9_394=(*sc_set0.sc_BonesUBO).sc_Bones[l9_393].boneMatrix[0];
float4 l9_395=(*sc_set0.sc_BonesUBO).sc_Bones[l9_393].boneMatrix[1];
float4 l9_396=(*sc_set0.sc_BonesUBO).sc_Bones[l9_393].boneMatrix[2];
float4 l9_397[3];
l9_397[0]=l9_394;
l9_397[1]=l9_395;
l9_397[2]=l9_396;
l9_392=float3(dot(l9_391,l9_397[0]),dot(l9_391,l9_397[1]),dot(l9_391,l9_397[2]));
}
else
{
l9_392=l9_391.xyz;
}
float3 l9_398=l9_392;
float3 l9_399=l9_398;
float l9_400=l9_363.z;
int l9_401=l9_367;
float4 l9_402=l9_360.position;
float3 l9_403=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_404=l9_401;
float4 l9_405=(*sc_set0.sc_BonesUBO).sc_Bones[l9_404].boneMatrix[0];
float4 l9_406=(*sc_set0.sc_BonesUBO).sc_Bones[l9_404].boneMatrix[1];
float4 l9_407=(*sc_set0.sc_BonesUBO).sc_Bones[l9_404].boneMatrix[2];
float4 l9_408[3];
l9_408[0]=l9_405;
l9_408[1]=l9_406;
l9_408[2]=l9_407;
l9_403=float3(dot(l9_402,l9_408[0]),dot(l9_402,l9_408[1]),dot(l9_402,l9_408[2]));
}
else
{
l9_403=l9_402.xyz;
}
float3 l9_409=l9_403;
float3 l9_410=(((l9_377*l9_378)+(l9_388*l9_389))+(l9_399*l9_400))+(l9_409*l9_363.w);
l9_360.position=float4(l9_410.x,l9_410.y,l9_410.z,l9_360.position.w);
int l9_411=l9_364;
float3x3 l9_412=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[2].xyz));
float3x3 l9_413=l9_412;
float3x3 l9_414=l9_413;
int l9_415=l9_365;
float3x3 l9_416=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[2].xyz));
float3x3 l9_417=l9_416;
float3x3 l9_418=l9_417;
int l9_419=l9_366;
float3x3 l9_420=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[2].xyz));
float3x3 l9_421=l9_420;
float3x3 l9_422=l9_421;
int l9_423=l9_367;
float3x3 l9_424=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_423].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_423].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_423].normalMatrix[2].xyz));
float3x3 l9_425=l9_424;
float3x3 l9_426=l9_425;
l9_360.normal=((((l9_414*l9_360.normal)*l9_363.x)+((l9_418*l9_360.normal)*l9_363.y))+((l9_422*l9_360.normal)*l9_363.z))+((l9_426*l9_360.normal)*l9_363.w);
l9_360.tangent=((((l9_414*l9_360.tangent)*l9_363.x)+((l9_418*l9_360.tangent)*l9_363.y))+((l9_422*l9_360.tangent)*l9_363.z))+((l9_426*l9_360.tangent)*l9_363.w);
}
l9_310=l9_360;
float3 l9_427=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float2 l9_428=((l9_310.position.xy/float2(l9_310.position.w))*0.5)+float2(0.5);
out.varTex01=float4(l9_428.x,l9_428.y,out.varTex01.z,out.varTex01.w);
l9_310.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_310.position;
float3 l9_429=l9_310.position.xyz-l9_427;
l9_310.position=float4(l9_429.x,l9_429.y,l9_429.z,l9_310.position.w);
out.varPosAndMotion=float4(l9_310.position.xyz.x,l9_310.position.xyz.y,l9_310.position.xyz.z,out.varPosAndMotion.w);
float3 l9_430=normalize(l9_310.normal);
out.varNormalAndMotion=float4(l9_430.x,l9_430.y,l9_430.z,out.varNormalAndMotion.w);
float l9_431=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_432=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_433=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_434=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_435=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_436=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float l9_437=l9_431;
float l9_438=l9_432;
float l9_439=l9_433;
float l9_440=l9_434;
float l9_441=l9_435;
float l9_442=l9_436;
float4x4 l9_443=float4x4(float4(2.0/(l9_438-l9_437),0.0,0.0,(-(l9_438+l9_437))/(l9_438-l9_437)),float4(0.0,2.0/(l9_440-l9_439),0.0,(-(l9_440+l9_439))/(l9_440-l9_439)),float4(0.0,0.0,(-2.0)/(l9_442-l9_441),(-(l9_442+l9_441))/(l9_442-l9_441)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_444=l9_443;
float4 l9_445=float4(0.0);
float3 l9_446=(l9_444*l9_310.position).xyz;
l9_445=float4(l9_446.x,l9_446.y,l9_446.z,l9_445.w);
l9_445.w=1.0;
out.varScreenPos=l9_445;
float4 l9_447=l9_445*1.0;
float4 l9_448=l9_447;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_448.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_449=l9_448;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_450=dot(l9_449,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_451=l9_450;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_451;
}
}
float4 l9_452=float4(l9_448.x,-l9_448.y,(l9_448.z*0.5)+(l9_448.w*0.5),l9_448.w);
out.gl_Position=l9_452;
param_2=l9_310;
}
}
v=param_2;
float3 param_7=out.varPosAndMotion.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
float4 l9_453=((*sc_set0.UserUniforms).sc_PrevFrameModelMatrix*(*sc_set0.UserUniforms).sc_ModelMatrixInverse)*float4(param_7,1.0);
float3 l9_454=param_7;
float3 l9_455=l9_453.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
int l9_456=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_456=0;
}
else
{
l9_456=gl_InstanceIndex%2;
}
int l9_457=l9_456;
float4 l9_458=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_457]*float4(l9_454,1.0);
float2 l9_459=l9_458.xy/float2(l9_458.w);
l9_458=float4(l9_459.x,l9_459.y,l9_458.z,l9_458.w);
int l9_460=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_460=0;
}
else
{
l9_460=gl_InstanceIndex%2;
}
int l9_461=l9_460;
float4 l9_462=(*sc_set0.UserUniforms).sc_PrevFrameViewProjectionMatrixArray[l9_461]*float4(l9_455,1.0);
float2 l9_463=l9_462.xy/float2(l9_462.w);
l9_462=float4(l9_463.x,l9_463.y,l9_462.z,l9_462.w);
float2 l9_464=(l9_458.xy-l9_462.xy)*0.5;
out.varPosAndMotion.w=l9_464.x;
out.varNormalAndMotion.w=l9_464.y;
}
}
if (PreviewInfo.Saved)
{
out.PreviewVertexColor=float4(PreviewInfo.Color.xyz,1.0);
out.PreviewVertexSaved=1.0;
}
return out;
}
} // VERTEX SHADER


namespace SNAP_FS {
struct sc_RayTracingHitPayload
{
float3 viewDirWS;
float3 positionWS;
float3 normalWS;
float4 tangentWS;
float4 color;
float2 uv0;
float2 uv1;
float2 uv2;
float2 uv3;
uint2 id;
};
struct SurfaceProperties
{
float3 albedo;
float opacity;
float3 normal;
float3 positionWS;
float3 viewDirWS;
float metallic;
float roughness;
float3 emissive;
float3 ao;
float3 specularAo;
float3 bakedShadows;
float3 specColor;
};
struct LightingComponents
{
float3 directDiffuse;
float3 directSpecular;
float3 indirectDiffuse;
float3 indirectSpecular;
float3 emitted;
float3 transmitted;
};
struct LightProperties
{
float3 direction;
float3 color;
float attenuation;
};
struct sc_SphericalGaussianLight_t
{
float3 color;
float sharpness;
float3 axis;
};
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float3 BumpedNormal;
float3 ViewDirWS;
float3 PositionWS;
float3 VertexTangent_WorldSpace;
float3 VertexNormal_WorldSpace;
float3 VertexBinormal_WorldSpace;
float3 SurfacePosition_WorldSpace;
float2 Surface_UVCoord0;
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
int sc_RayTracingReceiverEffectsMask;
float4 sc_RayTracingReflectionsSize;
float4 sc_RayTracingReflectionsDims;
float4 sc_RayTracingReflectionsView;
float4 sc_RayTracingGlobalIlluminationSize;
float4 sc_RayTracingGlobalIlluminationDims;
float4 sc_RayTracingGlobalIlluminationView;
float4 sc_RayTracingShadowsSize;
float4 sc_RayTracingShadowsDims;
float4 sc_RayTracingShadowsView;
float3 sc_RayTracingOriginScale;
uint sc_RayTracingReceiverMask;
float3 sc_RayTracingOriginScaleInv;
float3 sc_RayTracingOriginOffset;
uint sc_RayTracingReceiverId;
uint4 sc_RayTracingCasterConfiguration;
uint4 sc_RayTracingCasterOffsetPNTC;
uint4 sc_RayTracingCasterOffsetTexture;
uint4 sc_RayTracingCasterFormatPNTC;
uint4 sc_RayTracingCasterFormatTexture;
float4 sc_RayTracingRayDirectionSize;
float4 sc_RayTracingRayDirectionDims;
float4 sc_RayTracingRayDirectionView;
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
int PreviewEnabled;
int PreviewNodeID;
float alphaTestThreshold;
float rimExponent;
float rimIntensity;
float4 rimColor;
float4 baseColor;
float4 albedoTexSize;
float4 albedoTexDims;
float4 albedoTexView;
float3x3 albedoTexTransform;
float4 albedoTexUvMinMax;
float4 albedoTexBorderColor;
float uvScale;
float4 albedoSecondarySize;
float4 albedoSecondaryDims;
float4 albedoSecondaryView;
float3x3 albedoSecondaryTransform;
float4 albedoSecondaryUvMinMax;
float4 albedoSecondaryBorderColor;
float progress;
float4 aoTexSize;
float4 aoTexDims;
float4 aoTexView;
float3x3 aoTexTransform;
float4 aoTexUvMinMax;
float4 aoTexBorderColor;
float aoScale;
float4 normalTexSize;
float4 normalTexDims;
float4 normalTexView;
float3x3 normalTexTransform;
float4 normalTexUvMinMax;
float4 normalTexBorderColor;
float metallic;
float roughness;
float2 Port_Center_N031;
float Port_Opacity_N000;
float4 Port_Input2_N019;
float3 Port_Emissive_N000;
float3 Port_AO_N000;
float3 Port_SpecularAO_N000;
float depthRef;
};
struct sc_RayTracingCasterVertexBuffer_obj
{
float sc_RayTracingCasterVertices[1];
};
struct sc_RayTracingCasterNonAnimatedVertexBuffer_obj
{
float sc_RayTracingCasterNonAnimatedVertices[1];
};
struct sc_RayTracingCasterIndexBuffer_obj
{
uint sc_RayTracingCasterTriangles[1];
};
struct sc_PointLight_t_1
{
bool falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
float3 direction;
float3 position;
float4 color;
};
struct ssPreviewInfo
{
float4 Color;
bool Saved;
};
struct sc_Bone_t
{
float4 boneMatrix[3];
float4 normalMatrix[3];
};
struct sc_Bones_obj
{
sc_Bone_t sc_Bones[1];
};
struct sc_Set0
{
const device sc_RayTracingCasterIndexBuffer_obj* sc_RayTracingCasterIndexBuffer [[id(0)]];
const device sc_RayTracingCasterVertexBuffer_obj* sc_RayTracingCasterVertexBuffer [[id(1)]];
const device sc_RayTracingCasterNonAnimatedVertexBuffer_obj* sc_RayTracingCasterNonAnimatedVertexBuffer [[id(2)]];
constant sc_Bones_obj* sc_BonesUBO [[id(3)]];
texture2d<float> albedoSecondary [[id(4)]];
texture2d<float> albedoTex [[id(5)]];
texture2d<float> aoTex [[id(6)]];
texture2d<float> intensityTexture [[id(7)]];
texture2d<float> normalTex [[id(8)]];
texture2d<float> sc_EnvmapDiffuse [[id(9)]];
texture2d<float> sc_EnvmapSpecular [[id(10)]];
texture2d<float> sc_RayTracingGlobalIllumination [[id(19)]];
texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric [[id(20)]];
texture2d<float> sc_RayTracingRayDirection [[id(21)]];
texture2d<float> sc_RayTracingReflections [[id(22)]];
texture2d<float> sc_RayTracingShadows [[id(23)]];
texture2d<float> sc_SSAOTexture [[id(24)]];
texture2d<float> sc_ScreenTexture [[id(25)]];
texture2d<float> sc_ShadowTexture [[id(26)]];
sampler albedoSecondarySmpSC [[id(28)]];
sampler albedoTexSmpSC [[id(29)]];
sampler aoTexSmpSC [[id(30)]];
sampler intensityTextureSmpSC [[id(31)]];
sampler normalTexSmpSC [[id(32)]];
sampler sc_EnvmapDiffuseSmpSC [[id(33)]];
sampler sc_EnvmapSpecularSmpSC [[id(34)]];
sampler sc_RayTracingGlobalIlluminationSmpSC [[id(36)]];
sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC [[id(37)]];
sampler sc_RayTracingRayDirectionSmpSC [[id(38)]];
sampler sc_RayTracingReflectionsSmpSC [[id(39)]];
sampler sc_RayTracingShadowsSmpSC [[id(40)]];
sampler sc_SSAOTextureSmpSC [[id(41)]];
sampler sc_ScreenTextureSmpSC [[id(42)]];
sampler sc_ShadowTextureSmpSC [[id(43)]];
constant userUniformsObj* UserUniforms [[id(45)]];
};
struct main_frag_out
{
float4 sc_FragData0 [[color(0)]];
};
struct main_frag_in
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float varViewSpaceDepth [[user(locn6)]];
float2 varShadowTex [[user(locn7)]];
int varStereoViewID [[user(locn8)]];
float varClipDistance [[user(locn9)]];
float4 varColor [[user(locn10)]];
float4 PreviewVertexColor [[user(locn11)]];
float PreviewVertexSaved [[user(locn12)]];
};
// Implementation of the GLSL mod() function,which is slightly different than Metal fmod()
template<typename Tx,typename Ty>
Tx mod(Tx x,Ty y)
{
return x-y*floor(x/y);
}
sc_RayTracingHitPayload sc_RayTracingEvaluateHitPayload(thread const int2& screenPos,constant userUniformsObj& UserUniforms,const device sc_RayTracingCasterVertexBuffer_obj& sc_RayTracingCasterVertexBuffer,const device sc_RayTracingCasterNonAnimatedVertexBuffer_obj& sc_RayTracingCasterNonAnimatedVertexBuffer,const device sc_RayTracingCasterIndexBuffer_obj& sc_RayTracingCasterIndexBuffer,thread texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric,thread sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC,thread texture2d<float> sc_RayTracingRayDirection,thread sampler sc_RayTracingRayDirectionSmpSC)
{
uint4 idAndBarycentric=sc_RayTracingHitCasterIdAndBarycentric.read(uint2(screenPos),0);
sc_RayTracingHitPayload rhp;
rhp.id=idAndBarycentric.xy;
if (rhp.id.x!=(UserUniforms.sc_RayTracingCasterConfiguration.y&65535u))
{
return rhp;
}
float2 brcVW=float2(as_type<half2>(idAndBarycentric.z|(idAndBarycentric.w<<uint(16))));
float3 brc=float3((1.0-brcVW.x)-brcVW.y,brcVW);
float2 param=sc_RayTracingRayDirection.read(uint2(screenPos),0).xy;
float3 l9_0=float3(param.x,param.y,(1.0-abs(param.x))-abs(param.y));
float l9_1=fast::clamp(-l9_0.z,0.0,1.0);
float l9_2;
if (l9_0.x>=0.0)
{
l9_2=-l9_1;
}
else
{
l9_2=l9_1;
}
float l9_3=l9_2;
float l9_4;
if (l9_0.y>=0.0)
{
l9_4=-l9_1;
}
else
{
l9_4=l9_1;
}
float2 l9_5=l9_0.xy+float2(l9_3,l9_4);
l9_0=float3(l9_5.x,l9_5.y,l9_0.z);
float3 l9_6=normalize(l9_0);
float3 rayDir=l9_6;
rhp.viewDirWS=-rayDir;
uint param_1=rhp.id.y;
uint l9_7=min(param_1,UserUniforms.sc_RayTracingCasterConfiguration.z);
uint l9_8=l9_7*6u;
uint l9_9=l9_8&4294967292u;
uint4 l9_10=(uint4(uint2(sc_RayTracingCasterIndexBuffer.sc_RayTracingCasterTriangles[l9_9/4u]),uint2(sc_RayTracingCasterIndexBuffer.sc_RayTracingCasterTriangles[(l9_9/4u)+1u]))&uint4(65535u,4294967295u,65535u,4294967295u))>>uint4(0u,16u,0u,16u);
uint3 l9_11;
if (l9_8==l9_9)
{
l9_11=l9_10.xyz;
}
else
{
l9_11=l9_10.yzw;
}
uint3 l9_12=l9_11;
uint3 i=l9_12;
if (UserUniforms.sc_RayTracingCasterConfiguration.x==2u)
{
float3 param_2=brc;
uint3 param_3=i;
uint param_4=0u;
uint3 l9_13=uint3((param_3*uint3(6u))+uint3(param_4));
uint l9_14=l9_13.x;
float3 l9_15=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_14],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_14+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_14+2u]);
uint l9_16=l9_13.y;
float3 l9_17=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_16],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_16+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_16+2u]);
uint l9_18=l9_13.z;
float3 l9_19=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_18],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_18+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_18+2u]);
float3 l9_20=((l9_15*param_2.x)+(l9_17*param_2.y))+(l9_19*param_2.z);
rhp.positionWS=l9_20;
}
else
{
float3 param_5=brc;
uint3 param_6=i;
uint3 l9_21=uint3((param_6.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.x,(param_6.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.x,(param_6.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.x);
float3 l9_22=float3(0.0);
if (UserUniforms.sc_RayTracingCasterFormatPNTC.x==5u)
{
uint l9_23=l9_21.x;
float3 l9_24=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_23],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_23+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_23+2u]);
uint l9_25=l9_21.y;
float3 l9_26=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_25],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_25+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_25+2u]);
uint l9_27=l9_21.z;
float3 l9_28=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_27],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_27+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_27+2u]);
l9_22=((l9_24*param_5.x)+(l9_26*param_5.y))+(l9_28*param_5.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.x==6u)
{
uint l9_29=l9_21.x;
float3 l9_30=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_29]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_29+1u]))).x);
uint l9_31=l9_21.y;
float3 l9_32=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_31]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_31+1u]))).x);
uint l9_33=l9_21.z;
float3 l9_34=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_33]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_33+1u]))).x);
l9_22=((l9_30*param_5.x)+(l9_32*param_5.y))+(l9_34*param_5.z);
}
else
{
l9_22=float3(1.0,0.0,0.0);
}
}
float3 l9_35=l9_22;
float3 positionOS=l9_35;
rhp.positionWS=(UserUniforms.sc_ModelMatrix*float4(positionOS,1.0)).xyz;
}
if (UserUniforms.sc_RayTracingCasterOffsetPNTC.y>0u)
{
if (UserUniforms.sc_RayTracingCasterConfiguration.x==2u)
{
float3 param_7=brc;
uint3 param_8=i;
uint param_9=3u;
uint3 l9_36=uint3((param_8*uint3(6u))+uint3(param_9));
uint l9_37=l9_36.x;
float3 l9_38=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_37],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_37+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_37+2u]);
uint l9_39=l9_36.y;
float3 l9_40=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_39],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_39+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_39+2u]);
uint l9_41=l9_36.z;
float3 l9_42=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_41],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_41+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_41+2u]);
float3 l9_43=((l9_38*param_7.x)+(l9_40*param_7.y))+(l9_42*param_7.z);
rhp.normalWS=l9_43;
}
else
{
float3 param_10=brc;
uint3 param_11=i;
uint3 l9_44=uint3((param_11.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.y,(param_11.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.y,(param_11.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.y);
float3 l9_45=float3(0.0);
if (UserUniforms.sc_RayTracingCasterFormatPNTC.y==5u)
{
uint l9_46=l9_44.x;
float3 l9_47=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_46],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_46+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_46+2u]);
uint l9_48=l9_44.y;
float3 l9_49=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_48],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_48+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_48+2u]);
uint l9_50=l9_44.z;
float3 l9_51=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_50],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_50+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_50+2u]);
l9_45=((l9_47*param_10.x)+(l9_49*param_10.y))+(l9_51*param_10.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.y==6u)
{
uint l9_52=l9_44.x;
float3 l9_53=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_52]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_52+1u]))).x);
uint l9_54=l9_44.y;
float3 l9_55=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_54]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_54+1u]))).x);
uint l9_56=l9_44.z;
float3 l9_57=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_56]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_56+1u]))).x);
l9_45=((l9_53*param_10.x)+(l9_55*param_10.y))+(l9_57*param_10.z);
}
else
{
l9_45=float3(1.0,0.0,0.0);
}
}
float3 l9_58=l9_45;
float3 normalOS=l9_58;
rhp.normalWS=normalize(UserUniforms.sc_NormalMatrix*normalOS);
}
}
else
{
rhp.normalWS=float3(1.0,0.0,0.0);
}
bool l9_59=!(UserUniforms.sc_RayTracingCasterConfiguration.x==2u);
bool l9_60;
if (l9_59)
{
l9_60=UserUniforms.sc_RayTracingCasterOffsetPNTC.z>0u;
}
else
{
l9_60=l9_59;
}
if (l9_60)
{
float3 param_12=brc;
uint3 param_13=i;
uint3 l9_61=uint3((param_13.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.z,(param_13.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.z,(param_13.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.z);
float4 l9_62=float4(0.0);
if (UserUniforms.sc_RayTracingCasterFormatPNTC.z==5u)
{
uint l9_63=l9_61.x;
float4 l9_64=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_63],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_63+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_63+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_63+3u]);
uint l9_65=l9_61.y;
float4 l9_66=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_65],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_65+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_65+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_65+3u]);
uint l9_67=l9_61.z;
float4 l9_68=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_67],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_67+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_67+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_67+3u]);
l9_62=((l9_64*param_12.x)+(l9_66*param_12.y))+(l9_68*param_12.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.z==6u)
{
uint l9_69=l9_61.x;
float4 l9_70=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_69]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_69+1u]))));
uint l9_71=l9_61.y;
float4 l9_72=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_71]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_71+1u]))));
uint l9_73=l9_61.z;
float4 l9_74=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_73]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_73+1u]))));
l9_62=((l9_70*param_12.x)+(l9_72*param_12.y))+(l9_74*param_12.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.z==2u)
{
uint l9_75=l9_61.x;
uint l9_76=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_75]);
uint l9_77=l9_76&255u;
uint l9_78=(l9_76>>uint(8))&255u;
uint l9_79=(l9_76>>uint(16))&255u;
uint l9_80=(l9_76>>uint(24))&255u;
float4 l9_81=float4(float(l9_77),float(l9_78),float(l9_79),float(l9_80))/float4(255.0);
uint l9_82=l9_61.y;
uint l9_83=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_82]);
uint l9_84=l9_83&255u;
uint l9_85=(l9_83>>uint(8))&255u;
uint l9_86=(l9_83>>uint(16))&255u;
uint l9_87=(l9_83>>uint(24))&255u;
float4 l9_88=float4(float(l9_84),float(l9_85),float(l9_86),float(l9_87))/float4(255.0);
uint l9_89=l9_61.z;
uint l9_90=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_89]);
uint l9_91=l9_90&255u;
uint l9_92=(l9_90>>uint(8))&255u;
uint l9_93=(l9_90>>uint(16))&255u;
uint l9_94=(l9_90>>uint(24))&255u;
float4 l9_95=float4(float(l9_91),float(l9_92),float(l9_93),float(l9_94))/float4(255.0);
l9_62=((l9_81*param_12.x)+(l9_88*param_12.y))+(l9_95*param_12.z);
}
else
{
l9_62=float4(1.0,0.0,0.0,0.0);
}
}
}
float4 l9_96=l9_62;
float4 tangentOS=l9_96;
float3 tangentWS=normalize(UserUniforms.sc_NormalMatrix*tangentOS.xyz);
rhp.tangentWS=float4(tangentWS,tangentOS.w);
}
else
{
rhp.tangentWS=float4(1.0,0.0,0.0,1.0);
}
if (UserUniforms.sc_RayTracingCasterFormatPNTC.w>0u)
{
float3 param_14=brc;
uint3 param_15=i;
uint3 l9_97=uint3((param_15.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.w,(param_15.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.w,(param_15.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.w);
float4 l9_98=float4(0.0);
if (UserUniforms.sc_RayTracingCasterFormatPNTC.w==5u)
{
uint l9_99=l9_97.x;
float4 l9_100=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_99],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_99+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_99+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_99+3u]);
uint l9_101=l9_97.y;
float4 l9_102=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_101],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_101+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_101+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_101+3u]);
uint l9_103=l9_97.z;
float4 l9_104=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_103],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_103+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_103+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_103+3u]);
l9_98=((l9_100*param_14.x)+(l9_102*param_14.y))+(l9_104*param_14.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.w==6u)
{
uint l9_105=l9_97.x;
float4 l9_106=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_105]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_105+1u]))));
uint l9_107=l9_97.y;
float4 l9_108=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_107]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_107+1u]))));
uint l9_109=l9_97.z;
float4 l9_110=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_109]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_109+1u]))));
l9_98=((l9_106*param_14.x)+(l9_108*param_14.y))+(l9_110*param_14.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.w==2u)
{
uint l9_111=l9_97.x;
uint l9_112=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_111]);
uint l9_113=l9_112&255u;
uint l9_114=(l9_112>>uint(8))&255u;
uint l9_115=(l9_112>>uint(16))&255u;
uint l9_116=(l9_112>>uint(24))&255u;
float4 l9_117=float4(float(l9_113),float(l9_114),float(l9_115),float(l9_116))/float4(255.0);
uint l9_118=l9_97.y;
uint l9_119=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_118]);
uint l9_120=l9_119&255u;
uint l9_121=(l9_119>>uint(8))&255u;
uint l9_122=(l9_119>>uint(16))&255u;
uint l9_123=(l9_119>>uint(24))&255u;
float4 l9_124=float4(float(l9_120),float(l9_121),float(l9_122),float(l9_123))/float4(255.0);
uint l9_125=l9_97.z;
uint l9_126=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_125]);
uint l9_127=l9_126&255u;
uint l9_128=(l9_126>>uint(8))&255u;
uint l9_129=(l9_126>>uint(16))&255u;
uint l9_130=(l9_126>>uint(24))&255u;
float4 l9_131=float4(float(l9_127),float(l9_128),float(l9_129),float(l9_130))/float4(255.0);
l9_98=((l9_117*param_14.x)+(l9_124*param_14.y))+(l9_131*param_14.z);
}
else
{
l9_98=float4(1.0,0.0,0.0,0.0);
}
}
}
float4 l9_132=l9_98;
rhp.color=l9_132;
}
float2 dummyRedBlack=float2(dot(brc,float3(uint3(1u)-(i%uint3(2u)))),0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.x>0u)
{
float3 param_16=brc;
uint3 param_17=i;
uint3 l9_133=uint3((param_17.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.x,(param_17.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.x,(param_17.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.x);
float2 l9_134=float2(0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.x==5u)
{
uint l9_135=l9_133.x;
float2 l9_136=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_135],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_135+1u]);
uint l9_137=l9_133.y;
float2 l9_138=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_137],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_137+1u]);
uint l9_139=l9_133.z;
float2 l9_140=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_139],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_139+1u]);
l9_134=((l9_136*param_16.x)+(l9_138*param_16.y))+(l9_140*param_16.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatTexture.x==6u)
{
uint l9_141=l9_133.x;
float2 l9_142=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_141])));
uint l9_143=l9_133.y;
float2 l9_144=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_143])));
uint l9_145=l9_133.z;
float2 l9_146=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_145])));
l9_134=((l9_142*param_16.x)+(l9_144*param_16.y))+(l9_146*param_16.z);
}
else
{
l9_134=float2(1.0,0.0);
}
}
float2 l9_147=l9_134;
rhp.uv0=l9_147;
}
else
{
rhp.uv0=dummyRedBlack;
}
if (UserUniforms.sc_RayTracingCasterFormatTexture.y>0u)
{
float3 param_18=brc;
uint3 param_19=i;
uint3 l9_148=uint3((param_19.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.y,(param_19.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.y,(param_19.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.y);
float2 l9_149=float2(0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.y==5u)
{
uint l9_150=l9_148.x;
float2 l9_151=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_150],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_150+1u]);
uint l9_152=l9_148.y;
float2 l9_153=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_152],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_152+1u]);
uint l9_154=l9_148.z;
float2 l9_155=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_154],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_154+1u]);
l9_149=((l9_151*param_18.x)+(l9_153*param_18.y))+(l9_155*param_18.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatTexture.y==6u)
{
uint l9_156=l9_148.x;
float2 l9_157=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_156])));
uint l9_158=l9_148.y;
float2 l9_159=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_158])));
uint l9_160=l9_148.z;
float2 l9_161=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_160])));
l9_149=((l9_157*param_18.x)+(l9_159*param_18.y))+(l9_161*param_18.z);
}
else
{
l9_149=float2(1.0,0.0);
}
}
float2 l9_162=l9_149;
rhp.uv1=l9_162;
}
else
{
rhp.uv1=dummyRedBlack;
}
if (UserUniforms.sc_RayTracingCasterFormatTexture.z>0u)
{
float3 param_20=brc;
uint3 param_21=i;
uint3 l9_163=uint3((param_21.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.z,(param_21.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.z,(param_21.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.z);
float2 l9_164=float2(0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.z==5u)
{
uint l9_165=l9_163.x;
float2 l9_166=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_165],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_165+1u]);
uint l9_167=l9_163.y;
float2 l9_168=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_167],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_167+1u]);
uint l9_169=l9_163.z;
float2 l9_170=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_169],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_169+1u]);
l9_164=((l9_166*param_20.x)+(l9_168*param_20.y))+(l9_170*param_20.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatTexture.z==6u)
{
uint l9_171=l9_163.x;
float2 l9_172=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_171])));
uint l9_173=l9_163.y;
float2 l9_174=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_173])));
uint l9_175=l9_163.z;
float2 l9_176=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_175])));
l9_164=((l9_172*param_20.x)+(l9_174*param_20.y))+(l9_176*param_20.z);
}
else
{
l9_164=float2(1.0,0.0);
}
}
float2 l9_177=l9_164;
rhp.uv2=l9_177;
}
else
{
rhp.uv2=dummyRedBlack;
}
if (UserUniforms.sc_RayTracingCasterFormatTexture.w>0u)
{
float3 param_22=brc;
uint3 param_23=i;
uint3 l9_178=uint3((param_23.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.w,(param_23.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.w,(param_23.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.w);
float2 l9_179=float2(0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.w==5u)
{
uint l9_180=l9_178.x;
float2 l9_181=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_180],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_180+1u]);
uint l9_182=l9_178.y;
float2 l9_183=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_182],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_182+1u]);
uint l9_184=l9_178.z;
float2 l9_185=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_184],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_184+1u]);
l9_179=((l9_181*param_22.x)+(l9_183*param_22.y))+(l9_185*param_22.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatTexture.w==6u)
{
uint l9_186=l9_178.x;
float2 l9_187=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_186])));
uint l9_188=l9_178.y;
float2 l9_189=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_188])));
uint l9_190=l9_178.z;
float2 l9_191=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_190])));
l9_179=((l9_187*param_22.x)+(l9_189*param_22.y))+(l9_191*param_22.z);
}
else
{
l9_179=float2(1.0,0.0);
}
}
float2 l9_192=l9_179;
rhp.uv3=l9_192;
}
else
{
rhp.uv3=dummyRedBlack;
}
return rhp;
}
float3 evaluateSSAO(thread const float3& positionWS,thread int& varStereoViewID,constant userUniformsObj& UserUniforms,thread texture2d<float> sc_SSAOTexture,thread sampler sc_SSAOTextureSmpSC)
{
if ((int(sc_SSAOEnabled_tmp)!=0))
{
int l9_0=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_0=0;
}
else
{
l9_0=varStereoViewID;
}
int l9_1=l9_0;
float4 clipSpaceCoord=UserUniforms.sc_ViewProjectionMatrixArray[l9_1]*float4(positionWS,1.0);
float3 l9_2=clipSpaceCoord.xyz/float3(clipSpaceCoord.w);
clipSpaceCoord=float4(l9_2.x,l9_2.y,l9_2.z,clipSpaceCoord.w);
float4 shadowSample=sc_SSAOTexture.sample(sc_SSAOTextureSmpSC,((clipSpaceCoord.xy*0.5)+float2(0.5)));
return float3(shadowSample.x);
}
else
{
return float3(1.0);
}
}
float3 calculateDirectSpecular(thread const SurfaceProperties& surfaceProperties,thread const float3& L,thread const float3& V,constant userUniformsObj& UserUniforms)
{
float r=fast::max(surfaceProperties.roughness,0.029999999);
float3 F0=surfaceProperties.specColor;
float3 N=surfaceProperties.normal;
float3 H=normalize(L+V);
float param=dot(N,L);
float l9_0=fast::clamp(param,0.0,1.0);
float NdotL=l9_0;
float param_1=dot(N,V);
float l9_1=fast::clamp(param_1,0.0,1.0);
float NdotV=l9_1;
float param_2=dot(N,H);
float l9_2=fast::clamp(param_2,0.0,1.0);
float NdotH=l9_2;
float param_3=dot(V,H);
float l9_3=fast::clamp(param_3,0.0,1.0);
float VdotH=l9_3;
if (SC_DEVICE_CLASS_tmp>=2)
{
float param_4=NdotH;
float param_5=r;
float l9_4=param_5*param_5;
float l9_5=l9_4*l9_4;
float l9_6=param_4*param_4;
float l9_7=(l9_6*(l9_5-1.0))+1.0;
float l9_8=l9_7*l9_7;
float l9_9=9.9999999e-09;
if (UserUniforms.sc_RayTracingCasterConfiguration.x!=0u)
{
l9_9=1e-07;
}
float l9_10=l9_5/(l9_8+l9_9);
float param_6=NdotL;
float param_7=NdotV;
float param_8=r;
float l9_11=param_6;
float l9_12=param_8;
float l9_13=l9_12+1.0;
l9_13=(l9_13*l9_13)*0.125;
float l9_14=(l9_11*(1.0-l9_13))+l9_13;
float l9_15=param_7;
float l9_16=param_8;
float l9_17=l9_16+1.0;
l9_17=(l9_17*l9_17)*0.125;
float l9_18=(l9_15*(1.0-l9_17))+l9_17;
float l9_19=1.0/(l9_14*l9_18);
float param_9=VdotH;
float3 param_10=F0;
float l9_20=param_9;
float3 l9_21=param_10;
float3 l9_22=float3(1.0);
float l9_23=1.0-l9_20;
float l9_24=l9_23*l9_23;
float l9_25=(l9_24*l9_24)*l9_23;
float3 l9_26=l9_21+((l9_22-l9_21)*l9_25);
float3 l9_27=l9_26;
return l9_27*(((l9_10*l9_19)*0.25)*NdotL);
}
else
{
float specPower=exp2(11.0-(10.0*r));
float param_11=VdotH;
float3 param_12=F0;
float l9_28=param_11;
float3 l9_29=param_12;
float3 l9_30=float3(1.0);
float l9_31=1.0-l9_28;
float l9_32=l9_31*l9_31;
float l9_33=(l9_32*l9_32)*l9_31;
float3 l9_34=l9_29+((l9_30-l9_29)*l9_33);
float3 l9_35=l9_34;
return ((l9_35*((specPower*0.125)+0.25))*pow(NdotH,specPower))*NdotL;
}
}
float computeDistanceAttenuation(thread const float& distanceToLight,thread const float& falloffEndDistance)
{
float distanceToLightSquared=distanceToLight*distanceToLight;
if (falloffEndDistance==0.0)
{
return 1.0/distanceToLightSquared;
}
float distanceToLightToTheFourth=distanceToLightSquared*distanceToLightSquared;
float falloffEndDistanceToTheFourth=pow(falloffEndDistance,4.0);
return fast::max(fast::min(1.0-(distanceToLightToTheFourth/falloffEndDistanceToTheFourth),1.0),0.0)/distanceToLightSquared;
}
float2 calcSeamlessPanoramicUvsForSampling(thread const float2& uv,thread const float2& topMipRes,thread const float& lod)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
float2 thisMipRes=fast::max(float2(1.0),topMipRes/float2(exp2(lod)));
return ((uv*(thisMipRes-float2(1.0)))/thisMipRes)+(float2(0.5)/thisMipRes);
}
else
{
return uv;
}
}
float3 getSpecularDominantDir(thread const float3& N,thread const float3& R,thread const float& roughness)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
float lerpFactor=(roughness*roughness)*roughness;
return normalize(mix(R,N,float3(lerpFactor)));
}
else
{
return R;
}
}
float3 envBRDFApprox(thread const SurfaceProperties& surfaceProperties,thread const float& NdotV)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
float param=surfaceProperties.roughness;
float param_1=NdotV;
float4 l9_0=(float4(-1.0,-0.0275,-0.57200003,0.022)*param)+float4(1.0,0.0425,1.04,-0.039999999);
float l9_1=(fast::min(l9_0.x*l9_0.x,exp2((-9.2799997)*param_1))*l9_0.x)+l9_0.y;
float2 l9_2=(float2(-1.04,1.04)*l9_1)+l9_0.zw;
float2 l9_3=l9_2;
float2 AB=l9_3;
return fast::max((surfaceProperties.specColor*AB.x)+float3(AB.y),float3(0.0));
}
else
{
float3 fresnelMax=fast::max(float3(1.0-surfaceProperties.roughness),surfaceProperties.specColor);
float param_2=NdotV;
float3 param_3=surfaceProperties.specColor;
float3 param_4=fresnelMax;
float l9_4=1.0-param_2;
float l9_5=l9_4*l9_4;
float l9_6=(l9_5*l9_5)*l9_4;
float3 l9_7=param_3+((param_4-param_3)*l9_6);
return l9_7;
}
}
float srgbToLinear(thread const float& x)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
return pow(x,2.2);
}
else
{
return x*x;
}
}
float linearToSrgb(thread const float& x)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
return pow(x,0.45454547);
}
else
{
return sqrt(x);
}
}
float4 ngsCalculateLighting(thread const float3& albedo,thread const float& opacity,thread const float3& normal,thread const float3& position,thread const float3& viewDir,thread const float3& emissive,thread const float& metallic,thread const float& roughness,thread const float3& ao,thread const float3& specularAO,thread int& varStereoViewID,thread texture2d<float> sc_EnvmapDiffuse,thread sampler sc_EnvmapDiffuseSmpSC,thread texture2d<float> sc_EnvmapSpecular,thread sampler sc_EnvmapSpecularSmpSC,thread texture2d<float> sc_ScreenTexture,thread sampler sc_ScreenTextureSmpSC,thread texture2d<float> sc_RayTracingReflections,thread sampler sc_RayTracingReflectionsSmpSC,thread texture2d<float> sc_RayTracingGlobalIllumination,thread sampler sc_RayTracingGlobalIlluminationSmpSC,thread texture2d<float> sc_RayTracingShadows,thread sampler sc_RayTracingShadowsSmpSC,thread float4& gl_FragCoord,constant userUniformsObj& UserUniforms,thread float2& varShadowTex,thread texture2d<float> sc_ShadowTexture,thread sampler sc_ShadowTextureSmpSC,thread float4& sc_FragData0,thread texture2d<float> sc_SSAOTexture,thread sampler sc_SSAOTextureSmpSC)
{
SurfaceProperties l9_0;
l9_0.albedo=float3(0.0);
l9_0.opacity=1.0;
l9_0.normal=float3(0.0);
l9_0.positionWS=float3(0.0);
l9_0.viewDirWS=float3(0.0);
l9_0.metallic=0.0;
l9_0.roughness=0.0;
l9_0.emissive=float3(0.0);
l9_0.ao=float3(1.0);
l9_0.specularAo=float3(1.0);
l9_0.bakedShadows=float3(1.0);
SurfaceProperties l9_1=l9_0;
SurfaceProperties surfaceProperties=l9_1;
surfaceProperties.opacity=opacity;
float3 param=albedo;
float3 l9_2;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_2=float3(pow(param.x,2.2),pow(param.y,2.2),pow(param.z,2.2));
}
else
{
l9_2=param*param;
}
float3 l9_3=l9_2;
surfaceProperties.albedo=l9_3;
surfaceProperties.normal=normalize(normal);
surfaceProperties.positionWS=position;
surfaceProperties.viewDirWS=viewDir;
float3 param_1=emissive;
float3 l9_4;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_4=float3(pow(param_1.x,2.2),pow(param_1.y,2.2),pow(param_1.z,2.2));
}
else
{
l9_4=param_1*param_1;
}
float3 l9_5=l9_4;
surfaceProperties.emissive=l9_5;
surfaceProperties.metallic=metallic;
surfaceProperties.roughness=roughness;
surfaceProperties.ao=ao;
surfaceProperties.specularAo=specularAO;
if ((int(sc_SSAOEnabled_tmp)!=0))
{
float3 param_2=surfaceProperties.positionWS;
surfaceProperties.ao=evaluateSSAO(param_2,varStereoViewID,UserUniforms,sc_SSAOTexture,sc_SSAOTextureSmpSC);
}
SurfaceProperties param_3=surfaceProperties;
SurfaceProperties l9_6=param_3;
float3 l9_7=mix(float3(0.039999999),l9_6.albedo*l9_6.metallic,float3(l9_6.metallic));
float3 l9_8=mix(l9_6.albedo*(1.0-l9_6.metallic),float3(0.0),float3(l9_6.metallic));
param_3.albedo=l9_8;
param_3.specColor=l9_7;
SurfaceProperties l9_9=param_3;
surfaceProperties=l9_9;
SurfaceProperties param_4=surfaceProperties;
LightingComponents l9_10;
l9_10.directDiffuse=float3(0.0);
l9_10.directSpecular=float3(0.0);
l9_10.indirectDiffuse=float3(1.0);
l9_10.indirectSpecular=float3(0.0);
l9_10.emitted=float3(0.0);
l9_10.transmitted=float3(0.0);
LightingComponents l9_11=l9_10;
LightingComponents l9_12=l9_11;
float3 l9_13=param_4.viewDirWS;
int l9_14=0;
float4 l9_15=float4(param_4.bakedShadows,1.0);
if (sc_DirectionalLightsCount_tmp>0)
{
sc_DirectionalLight_t l9_16;
LightProperties l9_17;
int l9_18=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_18<sc_DirectionalLightsCount_tmp)
{
l9_16.direction=UserUniforms.sc_DirectionalLights[l9_18].direction;
l9_16.color=UserUniforms.sc_DirectionalLights[l9_18].color;
l9_17.direction=l9_16.direction;
l9_17.color=l9_16.color.xyz;
l9_17.attenuation=l9_16.color.w;
l9_17.attenuation*=l9_15[(l9_14<3) ? l9_14 : 3];
l9_14++;
LightingComponents l9_19=l9_12;
LightProperties l9_20=l9_17;
SurfaceProperties l9_21=param_4;
float3 l9_22=l9_13;
SurfaceProperties l9_23=l9_21;
float3 l9_24=l9_20.direction;
float l9_25=dot(l9_23.normal,l9_24);
float l9_26=fast::clamp(l9_25,0.0,1.0);
float3 l9_27=float3(l9_26);
l9_19.directDiffuse+=((l9_27*l9_20.color)*l9_20.attenuation);
SurfaceProperties l9_28=l9_21;
float3 l9_29=l9_20.direction;
float3 l9_30=l9_22;
l9_19.directSpecular+=((calculateDirectSpecular(l9_28,l9_29,l9_30,UserUniforms)*l9_20.color)*l9_20.attenuation);
LightingComponents l9_31=l9_19;
l9_12=l9_31;
l9_18++;
continue;
}
else
{
break;
}
}
}
if (sc_PointLightsCount_tmp>0)
{
sc_PointLight_t_1 l9_32;
LightProperties l9_33;
int l9_34=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_34<sc_PointLightsCount_tmp)
{
l9_32.falloffEnabled=UserUniforms.sc_PointLights[l9_34].falloffEnabled!=0;
l9_32.falloffEndDistance=UserUniforms.sc_PointLights[l9_34].falloffEndDistance;
l9_32.negRcpFalloffEndDistance4=UserUniforms.sc_PointLights[l9_34].negRcpFalloffEndDistance4;
l9_32.angleScale=UserUniforms.sc_PointLights[l9_34].angleScale;
l9_32.angleOffset=UserUniforms.sc_PointLights[l9_34].angleOffset;
l9_32.direction=UserUniforms.sc_PointLights[l9_34].direction;
l9_32.position=UserUniforms.sc_PointLights[l9_34].position;
l9_32.color=UserUniforms.sc_PointLights[l9_34].color;
float3 l9_35=l9_32.position-param_4.positionWS;
l9_33.direction=normalize(l9_35);
l9_33.color=l9_32.color.xyz;
l9_33.attenuation=l9_32.color.w;
l9_33.attenuation*=l9_15[(l9_14<3) ? l9_14 : 3];
float3 l9_36=l9_33.direction;
float3 l9_37=l9_32.direction;
float l9_38=l9_32.angleScale;
float l9_39=l9_32.angleOffset;
float l9_40=dot(l9_36,l9_37);
float l9_41=fast::clamp((l9_40*l9_38)+l9_39,0.0,1.0);
float l9_42=l9_41*l9_41;
l9_33.attenuation*=l9_42;
if (l9_32.falloffEnabled)
{
float l9_43=length(l9_35);
float l9_44=l9_32.falloffEndDistance;
l9_33.attenuation*=computeDistanceAttenuation(l9_43,l9_44);
}
l9_14++;
LightingComponents l9_45=l9_12;
LightProperties l9_46=l9_33;
SurfaceProperties l9_47=param_4;
float3 l9_48=l9_13;
SurfaceProperties l9_49=l9_47;
float3 l9_50=l9_46.direction;
float l9_51=dot(l9_49.normal,l9_50);
float l9_52=fast::clamp(l9_51,0.0,1.0);
float3 l9_53=float3(l9_52);
l9_45.directDiffuse+=((l9_53*l9_46.color)*l9_46.attenuation);
SurfaceProperties l9_54=l9_47;
float3 l9_55=l9_46.direction;
float3 l9_56=l9_48;
l9_45.directSpecular+=((calculateDirectSpecular(l9_54,l9_55,l9_56,UserUniforms)*l9_46.color)*l9_46.attenuation);
LightingComponents l9_57=l9_45;
l9_12=l9_57;
l9_34++;
continue;
}
else
{
break;
}
}
}
if ((int(sc_ProjectiveShadowsReceiver_tmp)!=0))
{
float3 l9_58=float3(0.0);
if ((int(sc_ProjectiveShadowsReceiver_tmp)!=0))
{
float2 l9_59=abs(varShadowTex-float2(0.5));
float l9_60=fast::max(l9_59.x,l9_59.y);
float l9_61=step(l9_60,0.5);
float4 l9_62=sc_ShadowTexture.sample(sc_ShadowTextureSmpSC,varShadowTex)*l9_61;
float3 l9_63=mix(UserUniforms.sc_ShadowColor.xyz,UserUniforms.sc_ShadowColor.xyz*l9_62.xyz,float3(UserUniforms.sc_ShadowColor.w));
float l9_64=l9_62.w*UserUniforms.sc_ShadowDensity;
l9_58=mix(float3(1.0),l9_63,float3(l9_64));
}
else
{
l9_58=float3(1.0);
}
float3 l9_65=l9_58;
float3 l9_66=l9_65;
l9_12.directDiffuse*=l9_66;
l9_12.directSpecular*=l9_66;
}
if ((UserUniforms.sc_RayTracingReceiverEffectsMask&4)!=0)
{
float4 l9_67=gl_FragCoord;
float2 l9_68=l9_67.xy*UserUniforms.sc_CurrentRenderTargetDims.zw;
float2 l9_69=l9_68;
float2 l9_70=l9_69;
float l9_71=0.0;
int l9_72;
if ((int(sc_RayTracingShadowsHasSwappedViews_tmp)!=0))
{
int l9_73=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_73=0;
}
else
{
l9_73=varStereoViewID;
}
int l9_74=l9_73;
l9_72=1-l9_74;
}
else
{
int l9_75=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_75=0;
}
else
{
l9_75=varStereoViewID;
}
int l9_76=l9_75;
l9_72=l9_76;
}
int l9_77=l9_72;
float2 l9_78=l9_70;
int l9_79=sc_RayTracingShadowsLayout_tmp;
int l9_80=l9_77;
float l9_81=l9_71;
float2 l9_82=l9_78;
int l9_83=l9_79;
int l9_84=l9_80;
float3 l9_85=float3(0.0);
if (l9_83==0)
{
l9_85=float3(l9_82,0.0);
}
else
{
if (l9_83==1)
{
l9_85=float3(l9_82.x,(l9_82.y*0.5)+(0.5-(float(l9_84)*0.5)),0.0);
}
else
{
l9_85=float3(l9_82,float(l9_84));
}
}
float3 l9_86=l9_85;
float3 l9_87=l9_86;
float4 l9_88=sc_RayTracingShadows.sample(sc_RayTracingShadowsSmpSC,l9_87.xy,bias(l9_81));
float4 l9_89=l9_88;
float4 l9_90=l9_89;
float l9_91=l9_90.x;
float l9_92=1.0-l9_91;
l9_12.directDiffuse*=l9_92;
l9_12.directSpecular*=l9_92;
}
SurfaceProperties l9_93=param_4;
float3 l9_94=l9_93.normal;
float3 l9_95=float3(0.0);
if ((sc_EnvLightMode_tmp==sc_AmbientLightMode_EnvironmentMap_tmp)||(sc_EnvLightMode_tmp==sc_AmbientLightMode_FromCamera_tmp))
{
float3 l9_96=l9_94;
float3 l9_97=l9_96;
float l9_98=UserUniforms.sc_EnvmapRotation.y;
float2 l9_99=float2(0.0);
float l9_100=l9_97.x;
float l9_101=-l9_97.z;
float l9_102=(l9_100<0.0) ? (-1.0) : 1.0;
float l9_103=l9_102*acos(fast::clamp(l9_101/length(float2(l9_100,l9_101)),-1.0,1.0));
l9_99.x=l9_103-1.5707964;
l9_99.y=acos(l9_97.y);
l9_99/=float2(6.2831855,3.1415927);
l9_99.y=1.0-l9_99.y;
l9_99.x+=(l9_98/360.0);
l9_99.x=fract((l9_99.x+floor(l9_99.x))+1.0);
float2 l9_104=l9_99;
float2 l9_105=l9_104;
float4 l9_106=float4(0.0);
if (sc_EnvLightMode_tmp==sc_AmbientLightMode_FromCamera_tmp)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
float2 l9_107=l9_105;
float2 l9_108=UserUniforms.sc_EnvmapSpecularSize.xy;
float l9_109=5.0;
l9_105=calcSeamlessPanoramicUvsForSampling(l9_107,l9_108,l9_109);
}
float2 l9_110=l9_105;
float l9_111=13.0;
int l9_112;
if ((int(sc_EnvmapSpecularHasSwappedViews_tmp)!=0))
{
int l9_113=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_113=0;
}
else
{
l9_113=varStereoViewID;
}
int l9_114=l9_113;
l9_112=1-l9_114;
}
else
{
int l9_115=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_115=0;
}
else
{
l9_115=varStereoViewID;
}
int l9_116=l9_115;
l9_112=l9_116;
}
int l9_117=l9_112;
float2 l9_118=l9_110;
int l9_119=sc_EnvmapSpecularLayout_tmp;
int l9_120=l9_117;
float l9_121=l9_111;
float2 l9_122=l9_118;
int l9_123=l9_119;
int l9_124=l9_120;
float3 l9_125=float3(0.0);
if (l9_123==0)
{
l9_125=float3(l9_122,0.0);
}
else
{
if (l9_123==1)
{
l9_125=float3(l9_122.x,(l9_122.y*0.5)+(0.5-(float(l9_124)*0.5)),0.0);
}
else
{
l9_125=float3(l9_122,float(l9_124));
}
}
float3 l9_126=l9_125;
float3 l9_127=l9_126;
float4 l9_128=sc_EnvmapSpecular.sample(sc_EnvmapSpecularSmpSC,l9_127.xy,bias(l9_121));
float4 l9_129=l9_128;
l9_106=l9_129;
}
else
{
if ((int(sc_HasDiffuseEnvmap_tmp)!=0))
{
float2 l9_130=l9_105;
float2 l9_131=UserUniforms.sc_EnvmapDiffuseSize.xy;
float l9_132=0.0;
l9_105=calcSeamlessPanoramicUvsForSampling(l9_130,l9_131,l9_132);
if (UserUniforms.sc_RayTracingCasterConfiguration.x!=0u)
{
float2 l9_133=l9_105;
float l9_134=0.0;
int l9_135;
if ((int(sc_EnvmapDiffuseHasSwappedViews_tmp)!=0))
{
int l9_136=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_136=0;
}
else
{
l9_136=varStereoViewID;
}
int l9_137=l9_136;
l9_135=1-l9_137;
}
else
{
int l9_138=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_138=0;
}
else
{
l9_138=varStereoViewID;
}
int l9_139=l9_138;
l9_135=l9_139;
}
int l9_140=l9_135;
float2 l9_141=l9_133;
int l9_142=sc_EnvmapDiffuseLayout_tmp;
int l9_143=l9_140;
float l9_144=l9_134;
float2 l9_145=l9_141;
int l9_146=l9_142;
int l9_147=l9_143;
float3 l9_148=float3(0.0);
if (l9_146==0)
{
l9_148=float3(l9_145,0.0);
}
else
{
if (l9_146==1)
{
l9_148=float3(l9_145.x,(l9_145.y*0.5)+(0.5-(float(l9_147)*0.5)),0.0);
}
else
{
l9_148=float3(l9_145,float(l9_147));
}
}
float3 l9_149=l9_148;
float3 l9_150=l9_149;
float4 l9_151=sc_EnvmapDiffuse.sample(sc_EnvmapDiffuseSmpSC,l9_150.xy,level(l9_144));
float4 l9_152=l9_151;
l9_106=l9_152;
}
else
{
float2 l9_153=l9_105;
float l9_154=-13.0;
int l9_155;
if ((int(sc_EnvmapDiffuseHasSwappedViews_tmp)!=0))
{
int l9_156=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_156=0;
}
else
{
l9_156=varStereoViewID;
}
int l9_157=l9_156;
l9_155=1-l9_157;
}
else
{
int l9_158=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_158=0;
}
else
{
l9_158=varStereoViewID;
}
int l9_159=l9_158;
l9_155=l9_159;
}
int l9_160=l9_155;
float2 l9_161=l9_153;
int l9_162=sc_EnvmapDiffuseLayout_tmp;
int l9_163=l9_160;
float l9_164=l9_154;
float2 l9_165=l9_161;
int l9_166=l9_162;
int l9_167=l9_163;
float3 l9_168=float3(0.0);
if (l9_166==0)
{
l9_168=float3(l9_165,0.0);
}
else
{
if (l9_166==1)
{
l9_168=float3(l9_165.x,(l9_165.y*0.5)+(0.5-(float(l9_167)*0.5)),0.0);
}
else
{
l9_168=float3(l9_165,float(l9_167));
}
}
float3 l9_169=l9_168;
float3 l9_170=l9_169;
float4 l9_171=sc_EnvmapDiffuse.sample(sc_EnvmapDiffuseSmpSC,l9_170.xy,bias(l9_164));
float4 l9_172=l9_171;
l9_106=l9_172;
}
}
else
{
float2 l9_173=l9_105;
float l9_174=13.0;
int l9_175;
if ((int(sc_EnvmapSpecularHasSwappedViews_tmp)!=0))
{
int l9_176=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_176=0;
}
else
{
l9_176=varStereoViewID;
}
int l9_177=l9_176;
l9_175=1-l9_177;
}
else
{
int l9_178=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_178=0;
}
else
{
l9_178=varStereoViewID;
}
int l9_179=l9_178;
l9_175=l9_179;
}
int l9_180=l9_175;
float2 l9_181=l9_173;
int l9_182=sc_EnvmapSpecularLayout_tmp;
int l9_183=l9_180;
float l9_184=l9_174;
float2 l9_185=l9_181;
int l9_186=l9_182;
int l9_187=l9_183;
float3 l9_188=float3(0.0);
if (l9_186==0)
{
l9_188=float3(l9_185,0.0);
}
else
{
if (l9_186==1)
{
l9_188=float3(l9_185.x,(l9_185.y*0.5)+(0.5-(float(l9_187)*0.5)),0.0);
}
else
{
l9_188=float3(l9_185,float(l9_187));
}
}
float3 l9_189=l9_188;
float3 l9_190=l9_189;
float4 l9_191=sc_EnvmapSpecular.sample(sc_EnvmapSpecularSmpSC,l9_190.xy,bias(l9_184));
float4 l9_192=l9_191;
l9_106=l9_192;
}
}
float4 l9_193=l9_106;
float3 l9_194=l9_193.xyz*(1.0/l9_193.w);
float3 l9_195=l9_194*UserUniforms.sc_EnvmapExposure;
l9_95=l9_195;
}
else
{
if (sc_EnvLightMode_tmp==sc_AmbientLightMode_SphericalHarmonics_tmp)
{
float3 l9_196=UserUniforms.sc_Sh[0];
float3 l9_197=UserUniforms.sc_Sh[1];
float3 l9_198=UserUniforms.sc_Sh[2];
float3 l9_199=UserUniforms.sc_Sh[3];
float3 l9_200=UserUniforms.sc_Sh[4];
float3 l9_201=UserUniforms.sc_Sh[5];
float3 l9_202=UserUniforms.sc_Sh[6];
float3 l9_203=UserUniforms.sc_Sh[7];
float3 l9_204=UserUniforms.sc_Sh[8];
float3 l9_205=-l9_94;
float l9_206=0.0;
l9_206=l9_205.x;
float l9_207=l9_205.y;
float l9_208=l9_205.z;
float l9_209=l9_206*l9_206;
float l9_210=l9_207*l9_207;
float l9_211=l9_208*l9_208;
float l9_212=l9_206*l9_207;
float l9_213=l9_207*l9_208;
float l9_214=l9_206*l9_208;
float3 l9_215=((((((l9_204*0.42904299)*(l9_209-l9_210))+((l9_202*0.74312502)*l9_211))+(l9_196*0.88622701))-(l9_202*0.24770799))+((((l9_200*l9_212)+(l9_203*l9_214))+(l9_201*l9_213))*0.85808599))+((((l9_199*l9_206)+(l9_197*l9_207))+(l9_198*l9_208))*1.0233279);
l9_95=l9_215*UserUniforms.sc_ShIntensity;
}
}
if ((UserUniforms.sc_RayTracingReceiverEffectsMask&2)!=0)
{
float4 l9_216=gl_FragCoord;
float2 l9_217=l9_216.xy*UserUniforms.sc_CurrentRenderTargetDims.zw;
float2 l9_218=l9_217;
float2 l9_219=l9_218;
float l9_220=0.0;
int l9_221;
if ((int(sc_RayTracingGlobalIlluminationHasSwappedViews_tmp)!=0))
{
int l9_222=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_222=0;
}
else
{
l9_222=varStereoViewID;
}
int l9_223=l9_222;
l9_221=1-l9_223;
}
else
{
int l9_224=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_224=0;
}
else
{
l9_224=varStereoViewID;
}
int l9_225=l9_224;
l9_221=l9_225;
}
int l9_226=l9_221;
float2 l9_227=l9_219;
int l9_228=sc_RayTracingGlobalIlluminationLayout_tmp;
int l9_229=l9_226;
float l9_230=l9_220;
float2 l9_231=l9_227;
int l9_232=l9_228;
int l9_233=l9_229;
float3 l9_234=float3(0.0);
if (l9_232==0)
{
l9_234=float3(l9_231,0.0);
}
else
{
if (l9_232==1)
{
l9_234=float3(l9_231.x,(l9_231.y*0.5)+(0.5-(float(l9_233)*0.5)),0.0);
}
else
{
l9_234=float3(l9_231,float(l9_233));
}
}
float3 l9_235=l9_234;
float3 l9_236=l9_235;
float4 l9_237=sc_RayTracingGlobalIllumination.sample(sc_RayTracingGlobalIlluminationSmpSC,l9_236.xy,bias(l9_230));
float4 l9_238=l9_237;
float4 l9_239=l9_238;
float4 l9_240=l9_239;
l9_95=mix(l9_95,l9_240.xyz,float3(l9_240.w));
}
if (sc_AmbientLightsCount_tmp>0)
{
if (sc_AmbientLightMode0_tmp==sc_AmbientLightMode_Constant_tmp)
{
l9_95+=(UserUniforms.sc_AmbientLights[0].color*UserUniforms.sc_AmbientLights[0].intensity);
}
else
{
l9_95.x+=(1e-06*UserUniforms.sc_AmbientLights[0].color.x);
}
}
if (sc_AmbientLightsCount_tmp>1)
{
if (sc_AmbientLightMode1_tmp==sc_AmbientLightMode_Constant_tmp)
{
l9_95+=(UserUniforms.sc_AmbientLights[1].color*UserUniforms.sc_AmbientLights[1].intensity);
}
else
{
l9_95.x+=(1e-06*UserUniforms.sc_AmbientLights[1].color.x);
}
}
if (sc_AmbientLightsCount_tmp>2)
{
if (sc_AmbientLightMode2_tmp==sc_AmbientLightMode_Constant_tmp)
{
l9_95+=(UserUniforms.sc_AmbientLights[2].color*UserUniforms.sc_AmbientLights[2].intensity);
}
else
{
l9_95.x+=(1e-06*UserUniforms.sc_AmbientLights[2].color.x);
}
}
if ((int(sc_LightEstimation_tmp)!=0))
{
float3 l9_241=l9_94;
float3 l9_242=UserUniforms.sc_LightEstimationData.ambientLight;
sc_SphericalGaussianLight_t l9_243;
float l9_244;
int l9_245=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_245<sc_LightEstimationSGCount_tmp)
{
l9_243.color=UserUniforms.sc_LightEstimationData.sg[l9_245].color;
l9_243.sharpness=UserUniforms.sc_LightEstimationData.sg[l9_245].sharpness;
l9_243.axis=UserUniforms.sc_LightEstimationData.sg[l9_245].axis;
float3 l9_246=l9_241;
float l9_247=dot(l9_243.axis,l9_246);
float l9_248=l9_243.sharpness;
float l9_249=0.36000001;
float l9_250=1.0/(4.0*l9_249);
float l9_251=exp(-l9_248);
float l9_252=l9_251*l9_251;
float l9_253=1.0/l9_248;
float l9_254=(1.0+(2.0*l9_252))-l9_253;
float l9_255=((l9_251-l9_252)*l9_253)-l9_252;
float l9_256=sqrt(1.0-l9_254);
float l9_257=l9_249*l9_247;
float l9_258=l9_250*l9_256;
float l9_259=l9_257+l9_258;
float l9_260=l9_247;
float l9_261=fast::clamp(l9_260,0.0,1.0);
float l9_262=l9_261;
if (step(abs(l9_257),l9_258)>0.5)
{
l9_244=(l9_259*l9_259)/l9_256;
}
else
{
l9_244=l9_262;
}
l9_262=l9_244;
float l9_263=(l9_254*l9_262)+l9_255;
sc_SphericalGaussianLight_t l9_264=l9_243;
float3 l9_265=(l9_264.color/float3(l9_264.sharpness))*6.2831855;
float3 l9_266=(l9_265*l9_263)/float3(3.1415927);
l9_242+=l9_266;
l9_245++;
continue;
}
else
{
break;
}
}
float3 l9_267=l9_242;
l9_95+=l9_267;
}
float3 l9_268=l9_95;
float3 l9_269=l9_268;
l9_12.indirectDiffuse=l9_269;
SurfaceProperties l9_270=param_4;
float3 l9_271=l9_13;
float3 l9_272=float3(0.0);
if ((sc_EnvLightMode_tmp==sc_AmbientLightMode_EnvironmentMap_tmp)||(sc_EnvLightMode_tmp==sc_AmbientLightMode_FromCamera_tmp))
{
SurfaceProperties l9_273=l9_270;
float3 l9_274=l9_271;
float3 l9_275=l9_273.normal;
float3 l9_276=reflect(-l9_274,l9_275);
float3 l9_277=l9_275;
float3 l9_278=l9_276;
float l9_279=l9_273.roughness;
l9_276=getSpecularDominantDir(l9_277,l9_278,l9_279);
float l9_280=l9_273.roughness;
float l9_281=pow(l9_280,0.66666669);
float l9_282=fast::clamp(l9_281,0.0,1.0);
float l9_283=l9_282*5.0;
float l9_284=l9_283;
float l9_285=l9_284;
float3 l9_286=l9_276;
float l9_287=l9_285;
float3 l9_288=l9_286;
float l9_289=l9_287;
float4 l9_290=float4(0.0);
float3 l9_291=l9_288;
float l9_292=UserUniforms.sc_EnvmapRotation.y;
float2 l9_293=float2(0.0);
float l9_294=l9_291.x;
float l9_295=-l9_291.z;
float l9_296=(l9_294<0.0) ? (-1.0) : 1.0;
float l9_297=l9_296*acos(fast::clamp(l9_295/length(float2(l9_294,l9_295)),-1.0,1.0));
l9_293.x=l9_297-1.5707964;
l9_293.y=acos(l9_291.y);
l9_293/=float2(6.2831855,3.1415927);
l9_293.y=1.0-l9_293.y;
l9_293.x+=(l9_292/360.0);
l9_293.x=fract((l9_293.x+floor(l9_293.x))+1.0);
float2 l9_298=l9_293;
float2 l9_299=l9_298;
if (SC_DEVICE_CLASS_tmp>=2)
{
float l9_300=floor(l9_289);
float l9_301=ceil(l9_289);
float l9_302=l9_289-l9_300;
float2 l9_303=l9_299;
float2 l9_304=UserUniforms.sc_EnvmapSpecularSize.xy;
float l9_305=l9_300;
float2 l9_306=calcSeamlessPanoramicUvsForSampling(l9_303,l9_304,l9_305);
float2 l9_307=l9_306;
float l9_308=l9_300;
float2 l9_309=l9_307;
float l9_310=l9_308;
int l9_311;
if ((int(sc_EnvmapSpecularHasSwappedViews_tmp)!=0))
{
int l9_312=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_312=0;
}
else
{
l9_312=varStereoViewID;
}
int l9_313=l9_312;
l9_311=1-l9_313;
}
else
{
int l9_314=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_314=0;
}
else
{
l9_314=varStereoViewID;
}
int l9_315=l9_314;
l9_311=l9_315;
}
int l9_316=l9_311;
float2 l9_317=l9_309;
int l9_318=sc_EnvmapSpecularLayout_tmp;
int l9_319=l9_316;
float l9_320=l9_310;
float2 l9_321=l9_317;
int l9_322=l9_318;
int l9_323=l9_319;
float3 l9_324=float3(0.0);
if (l9_322==0)
{
l9_324=float3(l9_321,0.0);
}
else
{
if (l9_322==1)
{
l9_324=float3(l9_321.x,(l9_321.y*0.5)+(0.5-(float(l9_323)*0.5)),0.0);
}
else
{
l9_324=float3(l9_321,float(l9_323));
}
}
float3 l9_325=l9_324;
float3 l9_326=l9_325;
float4 l9_327=sc_EnvmapSpecular.sample(sc_EnvmapSpecularSmpSC,l9_326.xy,level(l9_320));
float4 l9_328=l9_327;
float4 l9_329=l9_328;
float4 l9_330=l9_329;
float2 l9_331=l9_299;
float2 l9_332=UserUniforms.sc_EnvmapSpecularSize.xy;
float l9_333=l9_301;
float2 l9_334=calcSeamlessPanoramicUvsForSampling(l9_331,l9_332,l9_333);
float2 l9_335=l9_334;
float l9_336=l9_301;
float2 l9_337=l9_335;
float l9_338=l9_336;
int l9_339;
if ((int(sc_EnvmapSpecularHasSwappedViews_tmp)!=0))
{
int l9_340=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_340=0;
}
else
{
l9_340=varStereoViewID;
}
int l9_341=l9_340;
l9_339=1-l9_341;
}
else
{
int l9_342=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_342=0;
}
else
{
l9_342=varStereoViewID;
}
int l9_343=l9_342;
l9_339=l9_343;
}
int l9_344=l9_339;
float2 l9_345=l9_337;
int l9_346=sc_EnvmapSpecularLayout_tmp;
int l9_347=l9_344;
float l9_348=l9_338;
float2 l9_349=l9_345;
int l9_350=l9_346;
int l9_351=l9_347;
float3 l9_352=float3(0.0);
if (l9_350==0)
{
l9_352=float3(l9_349,0.0);
}
else
{
if (l9_350==1)
{
l9_352=float3(l9_349.x,(l9_349.y*0.5)+(0.5-(float(l9_351)*0.5)),0.0);
}
else
{
l9_352=float3(l9_349,float(l9_351));
}
}
float3 l9_353=l9_352;
float3 l9_354=l9_353;
float4 l9_355=sc_EnvmapSpecular.sample(sc_EnvmapSpecularSmpSC,l9_354.xy,level(l9_348));
float4 l9_356=l9_355;
float4 l9_357=l9_356;
float4 l9_358=l9_357;
l9_290=mix(l9_330,l9_358,float4(l9_302));
}
else
{
float2 l9_359=l9_299;
float l9_360=l9_289;
float2 l9_361=l9_359;
float l9_362=l9_360;
int l9_363;
if ((int(sc_EnvmapSpecularHasSwappedViews_tmp)!=0))
{
int l9_364=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_364=0;
}
else
{
l9_364=varStereoViewID;
}
int l9_365=l9_364;
l9_363=1-l9_365;
}
else
{
int l9_366=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_366=0;
}
else
{
l9_366=varStereoViewID;
}
int l9_367=l9_366;
l9_363=l9_367;
}
int l9_368=l9_363;
float2 l9_369=l9_361;
int l9_370=sc_EnvmapSpecularLayout_tmp;
int l9_371=l9_368;
float l9_372=l9_362;
float2 l9_373=l9_369;
int l9_374=l9_370;
int l9_375=l9_371;
float3 l9_376=float3(0.0);
if (l9_374==0)
{
l9_376=float3(l9_373,0.0);
}
else
{
if (l9_374==1)
{
l9_376=float3(l9_373.x,(l9_373.y*0.5)+(0.5-(float(l9_375)*0.5)),0.0);
}
else
{
l9_376=float3(l9_373,float(l9_375));
}
}
float3 l9_377=l9_376;
float3 l9_378=l9_377;
float4 l9_379=sc_EnvmapSpecular.sample(sc_EnvmapSpecularSmpSC,l9_378.xy,level(l9_372));
float4 l9_380=l9_379;
float4 l9_381=l9_380;
l9_290=l9_381;
}
float4 l9_382=l9_290;
float3 l9_383=l9_382.xyz*(1.0/l9_382.w);
float3 l9_384=l9_383;
float3 l9_385=l9_384*UserUniforms.sc_EnvmapExposure;
l9_385+=float3(1e-06);
float3 l9_386=l9_385;
float3 l9_387=l9_386;
if ((UserUniforms.sc_RayTracingReceiverEffectsMask&1)!=0)
{
float4 l9_388=gl_FragCoord;
float2 l9_389=l9_388.xy*UserUniforms.sc_CurrentRenderTargetDims.zw;
float2 l9_390=l9_389;
float2 l9_391=l9_390;
float l9_392=0.0;
int l9_393;
if ((int(sc_RayTracingReflectionsHasSwappedViews_tmp)!=0))
{
int l9_394=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_394=0;
}
else
{
l9_394=varStereoViewID;
}
int l9_395=l9_394;
l9_393=1-l9_395;
}
else
{
int l9_396=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_396=0;
}
else
{
l9_396=varStereoViewID;
}
int l9_397=l9_396;
l9_393=l9_397;
}
int l9_398=l9_393;
float2 l9_399=l9_391;
int l9_400=sc_RayTracingReflectionsLayout_tmp;
int l9_401=l9_398;
float l9_402=l9_392;
float2 l9_403=l9_399;
int l9_404=l9_400;
int l9_405=l9_401;
float3 l9_406=float3(0.0);
if (l9_404==0)
{
l9_406=float3(l9_403,0.0);
}
else
{
if (l9_404==1)
{
l9_406=float3(l9_403.x,(l9_403.y*0.5)+(0.5-(float(l9_405)*0.5)),0.0);
}
else
{
l9_406=float3(l9_403,float(l9_405));
}
}
float3 l9_407=l9_406;
float3 l9_408=l9_407;
float4 l9_409=sc_RayTracingReflections.sample(sc_RayTracingReflectionsSmpSC,l9_408.xy,bias(l9_402));
float4 l9_410=l9_409;
float4 l9_411=l9_410;
float4 l9_412=l9_411;
l9_387=mix(l9_387,l9_412.xyz,float3(l9_412.w));
}
float l9_413=abs(dot(l9_275,l9_274));
SurfaceProperties l9_414=l9_273;
float l9_415=l9_413;
float3 l9_416=l9_387*envBRDFApprox(l9_414,l9_415);
l9_272+=l9_416;
}
if ((int(sc_LightEstimation_tmp)!=0))
{
SurfaceProperties l9_417=l9_270;
float3 l9_418=l9_271;
float l9_419=fast::clamp(l9_417.roughness*l9_417.roughness,0.0099999998,1.0);
float3 l9_420=UserUniforms.sc_LightEstimationData.ambientLight*l9_417.specColor;
sc_SphericalGaussianLight_t l9_421;
sc_SphericalGaussianLight_t l9_422;
sc_SphericalGaussianLight_t l9_423;
int l9_424=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_424<sc_LightEstimationSGCount_tmp)
{
l9_421.color=UserUniforms.sc_LightEstimationData.sg[l9_424].color;
l9_421.sharpness=UserUniforms.sc_LightEstimationData.sg[l9_424].sharpness;
l9_421.axis=UserUniforms.sc_LightEstimationData.sg[l9_424].axis;
float3 l9_425=l9_417.normal;
float l9_426=l9_419;
float3 l9_427=l9_418;
float3 l9_428=l9_417.specColor;
float3 l9_429=l9_425;
float l9_430=l9_426;
l9_422.axis=l9_429;
float l9_431=l9_430*l9_430;
l9_422.sharpness=2.0/l9_431;
l9_422.color=float3(1.0/(3.1415927*l9_431));
sc_SphericalGaussianLight_t l9_432=l9_422;
sc_SphericalGaussianLight_t l9_433=l9_432;
sc_SphericalGaussianLight_t l9_434=l9_433;
float3 l9_435=l9_427;
l9_423.axis=reflect(-l9_435,l9_434.axis);
l9_423.color=l9_434.color;
l9_423.sharpness=l9_434.sharpness;
l9_423.sharpness/=(4.0*fast::max(dot(l9_434.axis,l9_435),9.9999997e-05));
sc_SphericalGaussianLight_t l9_436=l9_423;
sc_SphericalGaussianLight_t l9_437=l9_436;
sc_SphericalGaussianLight_t l9_438=l9_437;
sc_SphericalGaussianLight_t l9_439=l9_421;
float l9_440=length((l9_438.axis*l9_438.sharpness)+(l9_439.axis*l9_439.sharpness));
float3 l9_441=(l9_438.color*exp((l9_440-l9_438.sharpness)-l9_439.sharpness))*l9_439.color;
float l9_442=1.0-exp((-2.0)*l9_440);
float3 l9_443=((l9_441*6.2831855)*l9_442)/float3(l9_440);
float3 l9_444=l9_443;
float3 l9_445=l9_437.axis;
float l9_446=l9_426*l9_426;
float l9_447=dot(l9_425,l9_445);
float l9_448=fast::clamp(l9_447,0.0,1.0);
float l9_449=l9_448;
float l9_450=dot(l9_425,l9_427);
float l9_451=fast::clamp(l9_450,0.0,1.0);
float l9_452=l9_451;
float3 l9_453=normalize(l9_437.axis+l9_427);
float l9_454=l9_446;
float l9_455=l9_449;
float l9_456=1.0/(l9_455+sqrt(l9_454+(((1.0-l9_454)*l9_455)*l9_455)));
float l9_457=l9_446;
float l9_458=l9_452;
float l9_459=1.0/(l9_458+sqrt(l9_457+(((1.0-l9_457)*l9_458)*l9_458)));
l9_444*=(l9_456*l9_459);
float l9_460=dot(l9_445,l9_453);
float l9_461=fast::clamp(l9_460,0.0,1.0);
float l9_462=pow(1.0-l9_461,5.0);
l9_444*=(l9_428+((float3(1.0)-l9_428)*l9_462));
l9_444*=l9_449;
float3 l9_463=l9_444;
l9_420+=l9_463;
l9_424++;
continue;
}
else
{
break;
}
}
float3 l9_464=l9_420;
l9_272+=l9_464;
}
float3 l9_465=l9_272;
l9_12.indirectSpecular=l9_465;
LightingComponents l9_466=l9_12;
LightingComponents lighting=l9_466;
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
lighting.directDiffuse=float3(0.0);
lighting.indirectDiffuse=float3(0.0);
float4 l9_467=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_468=sc_FragData0;
l9_467=l9_468;
}
else
{
float4 l9_469=gl_FragCoord;
float2 l9_470=l9_469.xy*UserUniforms.sc_CurrentRenderTargetDims.zw;
float2 l9_471=l9_470;
float2 l9_472=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_473=1;
int l9_474=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_474=0;
}
else
{
l9_474=varStereoViewID;
}
int l9_475=l9_474;
int l9_476=l9_475;
float3 l9_477=float3(l9_471,0.0);
int l9_478=l9_473;
int l9_479=l9_476;
if (l9_478==1)
{
l9_477.y=((2.0*l9_477.y)+float(l9_479))-1.0;
}
float2 l9_480=l9_477.xy;
l9_472=l9_480;
}
else
{
l9_472=l9_471;
}
float2 l9_481=l9_472;
float2 l9_482=l9_481;
float2 l9_483=l9_482;
float2 l9_484=l9_483;
float l9_485=0.0;
int l9_486;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_487=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_487=0;
}
else
{
l9_487=varStereoViewID;
}
int l9_488=l9_487;
l9_486=1-l9_488;
}
else
{
int l9_489=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_489=0;
}
else
{
l9_489=varStereoViewID;
}
int l9_490=l9_489;
l9_486=l9_490;
}
int l9_491=l9_486;
float2 l9_492=l9_484;
int l9_493=sc_ScreenTextureLayout_tmp;
int l9_494=l9_491;
float l9_495=l9_485;
float2 l9_496=l9_492;
int l9_497=l9_493;
int l9_498=l9_494;
float3 l9_499=float3(0.0);
if (l9_497==0)
{
l9_499=float3(l9_496,0.0);
}
else
{
if (l9_497==1)
{
l9_499=float3(l9_496.x,(l9_496.y*0.5)+(0.5-(float(l9_498)*0.5)),0.0);
}
else
{
l9_499=float3(l9_496,float(l9_498));
}
}
float3 l9_500=l9_499;
float3 l9_501=l9_500;
float4 l9_502=sc_ScreenTexture.sample(sc_ScreenTextureSmpSC,l9_501.xy,bias(l9_495));
float4 l9_503=l9_502;
float4 l9_504=l9_503;
l9_467=l9_504;
}
float4 l9_505=l9_467;
float3 param_5=l9_505.xyz;
float3 l9_506;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_506=float3(pow(param_5.x,2.2),pow(param_5.y,2.2),pow(param_5.z,2.2));
}
else
{
l9_506=param_5*param_5;
}
float3 l9_507=l9_506;
float3 framebuffer=l9_507;
lighting.transmitted=framebuffer*mix(float3(1.0),surfaceProperties.albedo,float3(surfaceProperties.opacity));
surfaceProperties.opacity=1.0;
}
bool enablePremultipliedAlpha=false;
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
enablePremultipliedAlpha=true;
}
SurfaceProperties param_6=surfaceProperties;
LightingComponents param_7=lighting;
bool param_8=enablePremultipliedAlpha;
float3 l9_508=param_6.albedo*(param_7.directDiffuse+(param_7.indirectDiffuse*param_6.ao));
float3 l9_509=param_7.directSpecular+(param_7.indirectSpecular*param_6.specularAo);
float3 l9_510=param_6.emissive;
float3 l9_511=param_7.transmitted;
if (param_8)
{
float l9_512=param_6.opacity;
l9_508*=srgbToLinear(l9_512);
}
float3 l9_513=((l9_508+l9_509)+l9_510)+l9_511;
float3 l9_514=l9_513;
float4 Output=float4(l9_514,surfaceProperties.opacity);
if ((int(sc_IsEditor_tmp)!=0))
{
Output.x+=((surfaceProperties.ao.x*surfaceProperties.specularAo.x)*9.9999997e-06);
}
if (UserUniforms.sc_RayTracingCasterConfiguration.x!=0u)
{
return Output;
}
if (!(int(sc_BlendMode_Multiply_tmp)!=0))
{
float3 param_9=Output.xyz;
float l9_515=1.8;
float l9_516=1.4;
float l9_517=0.5;
float l9_518=1.5;
float3 l9_519=(param_9*((param_9*l9_515)+float3(l9_516)))/((param_9*((param_9*l9_515)+float3(l9_517)))+float3(l9_518));
Output=float4(l9_519.x,l9_519.y,l9_519.z,Output.w);
}
float3 param_10=Output.xyz;
float l9_520=param_10.x;
float l9_521=param_10.y;
float l9_522=param_10.z;
float3 l9_523=float3(linearToSrgb(l9_520),linearToSrgb(l9_521),linearToSrgb(l9_522));
Output=float4(l9_523.x,l9_523.y,l9_523.z,Output.w);
return Output;
}
float transformSingleColor(thread const float& original,thread const float& intMap,thread const float& target)
{
if (((int(BLEND_MODE_REALISTIC_tmp)!=0)||(int(BLEND_MODE_FORGRAY_tmp)!=0))||(int(BLEND_MODE_NOTBRIGHT_tmp)!=0))
{
return original/pow(1.0-target,intMap);
}
else
{
if ((int(BLEND_MODE_DIVISION_tmp)!=0))
{
return original/(1.0-target);
}
else
{
if ((int(BLEND_MODE_BRIGHT_tmp)!=0))
{
return original/pow(1.0-target,2.0-(2.0*original));
}
}
}
return 0.0;
}
float3 transformColor(thread const float& yValue,thread const float3& original,thread const float3& target,thread const float& weight,thread const float& intMap)
{
if ((int(BLEND_MODE_INTENSE_tmp)!=0))
{
float3 param=original;
float3 l9_0=param;
float4 l9_1;
if (l9_0.y<l9_0.z)
{
l9_1=float4(l9_0.zy,-1.0,0.66666669);
}
else
{
l9_1=float4(l9_0.yz,0.0,-0.33333334);
}
float4 l9_2=l9_1;
float4 l9_3;
if (l9_0.x<l9_2.x)
{
l9_3=float4(l9_2.xyw,l9_0.x);
}
else
{
l9_3=float4(l9_0.x,l9_2.yzx);
}
float4 l9_4=l9_3;
float l9_5=l9_4.x-fast::min(l9_4.w,l9_4.y);
float l9_6=abs(((l9_4.w-l9_4.y)/((6.0*l9_5)+1e-07))+l9_4.z);
float l9_7=l9_4.x;
float3 l9_8=float3(l9_6,l9_5,l9_7);
float3 l9_9=l9_8;
float l9_10=l9_9.z-(l9_9.y*0.5);
float l9_11=l9_9.y/((1.0-abs((2.0*l9_10)-1.0))+1e-07);
float3 l9_12=float3(l9_9.x,l9_11,l9_10);
float3 hslOrig=l9_12;
float3 res=float3(0.0);
res.x=target.x;
res.y=target.y;
res.z=hslOrig.z;
float3 param_1=res;
float l9_13=param_1.x;
float l9_14=abs((6.0*l9_13)-3.0)-1.0;
float l9_15=2.0-abs((6.0*l9_13)-2.0);
float l9_16=2.0-abs((6.0*l9_13)-4.0);
float3 l9_17=fast::clamp(float3(l9_14,l9_15,l9_16),float3(0.0),float3(1.0));
float3 l9_18=l9_17;
float l9_19=(1.0-abs((2.0*param_1.z)-1.0))*param_1.y;
l9_18=((l9_18-float3(0.5))*l9_19)+float3(param_1.z);
float3 l9_20=l9_18;
res=l9_20;
float3 resColor=mix(original,res,float3(weight));
return resColor;
}
else
{
float3 tmpColor=float3(0.0);
float param_2=yValue;
float param_3=intMap;
float param_4=target.x;
tmpColor.x=transformSingleColor(param_2,param_3,param_4);
float param_5=yValue;
float param_6=intMap;
float param_7=target.y;
tmpColor.y=transformSingleColor(param_5,param_6,param_7);
float param_8=yValue;
float param_9=intMap;
float param_10=target.z;
tmpColor.z=transformSingleColor(param_8,param_9,param_10);
tmpColor=fast::clamp(tmpColor,float3(0.0),float3(1.0));
float3 resColor_1=mix(original,tmpColor,float3(weight));
return resColor_1;
}
}
float3 definedBlend(thread const float3& a,thread const float3& b,thread int& varStereoViewID,constant userUniformsObj& UserUniforms,thread texture2d<float> intensityTexture,thread sampler intensityTextureSmpSC)
{
if ((int(BLEND_MODE_LIGHTEN_tmp)!=0))
{
return fast::max(a,b);
}
else
{
if ((int(BLEND_MODE_DARKEN_tmp)!=0))
{
return fast::min(a,b);
}
else
{
if ((int(BLEND_MODE_DIVIDE_tmp)!=0))
{
return b/a;
}
else
{
if ((int(BLEND_MODE_AVERAGE_tmp)!=0))
{
return (a+b)*0.5;
}
else
{
if ((int(BLEND_MODE_SUBTRACT_tmp)!=0))
{
return fast::max((a+b)-float3(1.0),float3(0.0));
}
else
{
if ((int(BLEND_MODE_DIFFERENCE_tmp)!=0))
{
return abs(a-b);
}
else
{
if ((int(BLEND_MODE_NEGATION_tmp)!=0))
{
return float3(1.0)-abs((float3(1.0)-a)-b);
}
else
{
if ((int(BLEND_MODE_EXCLUSION_tmp)!=0))
{
return (a+b)-((a*2.0)*b);
}
else
{
if ((int(BLEND_MODE_OVERLAY_tmp)!=0))
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
float l9_1=l9_0;
float l9_2;
if (a.y<0.5)
{
l9_2=(2.0*a.y)*b.y;
}
else
{
l9_2=1.0-((2.0*(1.0-a.y))*(1.0-b.y));
}
float l9_3=l9_2;
float l9_4;
if (a.z<0.5)
{
l9_4=(2.0*a.z)*b.z;
}
else
{
l9_4=1.0-((2.0*(1.0-a.z))*(1.0-b.z));
}
return float3(l9_1,l9_3,l9_4);
}
else
{
if ((int(BLEND_MODE_SOFT_LIGHT_tmp)!=0))
{
return (((float3(1.0)-(b*2.0))*a)*a)+((a*2.0)*b);
}
else
{
if ((int(BLEND_MODE_HARD_LIGHT_tmp)!=0))
{
float l9_5;
if (b.x<0.5)
{
l9_5=(2.0*b.x)*a.x;
}
else
{
l9_5=1.0-((2.0*(1.0-b.x))*(1.0-a.x));
}
float l9_6=l9_5;
float l9_7;
if (b.y<0.5)
{
l9_7=(2.0*b.y)*a.y;
}
else
{
l9_7=1.0-((2.0*(1.0-b.y))*(1.0-a.y));
}
float l9_8=l9_7;
float l9_9;
if (b.z<0.5)
{
l9_9=(2.0*b.z)*a.z;
}
else
{
l9_9=1.0-((2.0*(1.0-b.z))*(1.0-a.z));
}
return float3(l9_6,l9_8,l9_9);
}
else
{
if ((int(BLEND_MODE_COLOR_DODGE_tmp)!=0))
{
float l9_10;
if (b.x==1.0)
{
l9_10=b.x;
}
else
{
l9_10=fast::min(a.x/(1.0-b.x),1.0);
}
float l9_11=l9_10;
float l9_12;
if (b.y==1.0)
{
l9_12=b.y;
}
else
{
l9_12=fast::min(a.y/(1.0-b.y),1.0);
}
float l9_13=l9_12;
float l9_14;
if (b.z==1.0)
{
l9_14=b.z;
}
else
{
l9_14=fast::min(a.z/(1.0-b.z),1.0);
}
return float3(l9_11,l9_13,l9_14);
}
else
{
if ((int(BLEND_MODE_COLOR_BURN_tmp)!=0))
{
float l9_15;
if (b.x==0.0)
{
l9_15=b.x;
}
else
{
l9_15=fast::max(1.0-((1.0-a.x)/b.x),0.0);
}
float l9_16=l9_15;
float l9_17;
if (b.y==0.0)
{
l9_17=b.y;
}
else
{
l9_17=fast::max(1.0-((1.0-a.y)/b.y),0.0);
}
float l9_18=l9_17;
float l9_19;
if (b.z==0.0)
{
l9_19=b.z;
}
else
{
l9_19=fast::max(1.0-((1.0-a.z)/b.z),0.0);
}
return float3(l9_16,l9_18,l9_19);
}
else
{
if ((int(BLEND_MODE_LINEAR_LIGHT_tmp)!=0))
{
float l9_20;
if (b.x<0.5)
{
l9_20=fast::max((a.x+(2.0*b.x))-1.0,0.0);
}
else
{
l9_20=fast::min(a.x+(2.0*(b.x-0.5)),1.0);
}
float l9_21=l9_20;
float l9_22;
if (b.y<0.5)
{
l9_22=fast::max((a.y+(2.0*b.y))-1.0,0.0);
}
else
{
l9_22=fast::min(a.y+(2.0*(b.y-0.5)),1.0);
}
float l9_23=l9_22;
float l9_24;
if (b.z<0.5)
{
l9_24=fast::max((a.z+(2.0*b.z))-1.0,0.0);
}
else
{
l9_24=fast::min(a.z+(2.0*(b.z-0.5)),1.0);
}
return float3(l9_21,l9_23,l9_24);
}
else
{
if ((int(BLEND_MODE_VIVID_LIGHT_tmp)!=0))
{
float l9_25;
if (b.x<0.5)
{
float l9_26;
if ((2.0*b.x)==0.0)
{
l9_26=2.0*b.x;
}
else
{
l9_26=fast::max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_25=l9_26;
}
else
{
float l9_27;
if ((2.0*(b.x-0.5))==1.0)
{
l9_27=2.0*(b.x-0.5);
}
else
{
l9_27=fast::min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_25=l9_27;
}
float l9_28=l9_25;
float l9_29;
if (b.y<0.5)
{
float l9_30;
if ((2.0*b.y)==0.0)
{
l9_30=2.0*b.y;
}
else
{
l9_30=fast::max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_29=l9_30;
}
else
{
float l9_31;
if ((2.0*(b.y-0.5))==1.0)
{
l9_31=2.0*(b.y-0.5);
}
else
{
l9_31=fast::min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_29=l9_31;
}
float l9_32=l9_29;
float l9_33;
if (b.z<0.5)
{
float l9_34;
if ((2.0*b.z)==0.0)
{
l9_34=2.0*b.z;
}
else
{
l9_34=fast::max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_33=l9_34;
}
else
{
float l9_35;
if ((2.0*(b.z-0.5))==1.0)
{
l9_35=2.0*(b.z-0.5);
}
else
{
l9_35=fast::min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_33=l9_35;
}
return float3(l9_28,l9_32,l9_33);
}
else
{
if ((int(BLEND_MODE_PIN_LIGHT_tmp)!=0))
{
float l9_36;
if (b.x<0.5)
{
l9_36=fast::min(a.x,2.0*b.x);
}
else
{
l9_36=fast::max(a.x,2.0*(b.x-0.5));
}
float l9_37=l9_36;
float l9_38;
if (b.y<0.5)
{
l9_38=fast::min(a.y,2.0*b.y);
}
else
{
l9_38=fast::max(a.y,2.0*(b.y-0.5));
}
float l9_39=l9_38;
float l9_40;
if (b.z<0.5)
{
l9_40=fast::min(a.z,2.0*b.z);
}
else
{
l9_40=fast::max(a.z,2.0*(b.z-0.5));
}
return float3(l9_37,l9_39,l9_40);
}
else
{
if ((int(BLEND_MODE_HARD_MIX_tmp)!=0))
{
float l9_41;
if (b.x<0.5)
{
float l9_42;
if ((2.0*b.x)==0.0)
{
l9_42=2.0*b.x;
}
else
{
l9_42=fast::max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_41=l9_42;
}
else
{
float l9_43;
if ((2.0*(b.x-0.5))==1.0)
{
l9_43=2.0*(b.x-0.5);
}
else
{
l9_43=fast::min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_41=l9_43;
}
float l9_44=l9_41;
float l9_45;
if (b.y<0.5)
{
float l9_46;
if ((2.0*b.y)==0.0)
{
l9_46=2.0*b.y;
}
else
{
l9_46=fast::max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_45=l9_46;
}
else
{
float l9_47;
if ((2.0*(b.y-0.5))==1.0)
{
l9_47=2.0*(b.y-0.5);
}
else
{
l9_47=fast::min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_45=l9_47;
}
float l9_48=l9_45;
float l9_49;
if (b.z<0.5)
{
float l9_50;
if ((2.0*b.z)==0.0)
{
l9_50=2.0*b.z;
}
else
{
l9_50=fast::max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_49=l9_50;
}
else
{
float l9_51;
if ((2.0*(b.z-0.5))==1.0)
{
l9_51=2.0*(b.z-0.5);
}
else
{
l9_51=fast::min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_49=l9_51;
}
return float3((l9_44<0.5) ? 0.0 : 1.0,(l9_48<0.5) ? 0.0 : 1.0,(l9_49<0.5) ? 0.0 : 1.0);
}
else
{
if ((int(BLEND_MODE_HARD_REFLECT_tmp)!=0))
{
float l9_52;
if (b.x==1.0)
{
l9_52=b.x;
}
else
{
l9_52=fast::min((a.x*a.x)/(1.0-b.x),1.0);
}
float l9_53=l9_52;
float l9_54;
if (b.y==1.0)
{
l9_54=b.y;
}
else
{
l9_54=fast::min((a.y*a.y)/(1.0-b.y),1.0);
}
float l9_55=l9_54;
float l9_56;
if (b.z==1.0)
{
l9_56=b.z;
}
else
{
l9_56=fast::min((a.z*a.z)/(1.0-b.z),1.0);
}
return float3(l9_53,l9_55,l9_56);
}
else
{
if ((int(BLEND_MODE_HARD_GLOW_tmp)!=0))
{
float l9_57;
if (a.x==1.0)
{
l9_57=a.x;
}
else
{
l9_57=fast::min((b.x*b.x)/(1.0-a.x),1.0);
}
float l9_58=l9_57;
float l9_59;
if (a.y==1.0)
{
l9_59=a.y;
}
else
{
l9_59=fast::min((b.y*b.y)/(1.0-a.y),1.0);
}
float l9_60=l9_59;
float l9_61;
if (a.z==1.0)
{
l9_61=a.z;
}
else
{
l9_61=fast::min((b.z*b.z)/(1.0-a.z),1.0);
}
return float3(l9_58,l9_60,l9_61);
}
else
{
if ((int(BLEND_MODE_HARD_PHOENIX_tmp)!=0))
{
return (fast::min(a,b)-fast::max(a,b))+float3(1.0);
}
else
{
if ((int(BLEND_MODE_HUE_tmp)!=0))
{
float3 param=a;
float3 param_1=b;
float3 l9_62=param;
float3 l9_63=l9_62;
float4 l9_64;
if (l9_63.y<l9_63.z)
{
l9_64=float4(l9_63.zy,-1.0,0.66666669);
}
else
{
l9_64=float4(l9_63.yz,0.0,-0.33333334);
}
float4 l9_65=l9_64;
float4 l9_66;
if (l9_63.x<l9_65.x)
{
l9_66=float4(l9_65.xyw,l9_63.x);
}
else
{
l9_66=float4(l9_63.x,l9_65.yzx);
}
float4 l9_67=l9_66;
float l9_68=l9_67.x-fast::min(l9_67.w,l9_67.y);
float l9_69=abs(((l9_67.w-l9_67.y)/((6.0*l9_68)+1e-07))+l9_67.z);
float l9_70=l9_67.x;
float3 l9_71=float3(l9_69,l9_68,l9_70);
float3 l9_72=l9_71;
float l9_73=l9_72.z-(l9_72.y*0.5);
float l9_74=l9_72.y/((1.0-abs((2.0*l9_73)-1.0))+1e-07);
float3 l9_75=float3(l9_72.x,l9_74,l9_73);
float3 l9_76=l9_75;
float3 l9_77=param_1;
float3 l9_78=l9_77;
float4 l9_79;
if (l9_78.y<l9_78.z)
{
l9_79=float4(l9_78.zy,-1.0,0.66666669);
}
else
{
l9_79=float4(l9_78.yz,0.0,-0.33333334);
}
float4 l9_80=l9_79;
float4 l9_81;
if (l9_78.x<l9_80.x)
{
l9_81=float4(l9_80.xyw,l9_78.x);
}
else
{
l9_81=float4(l9_78.x,l9_80.yzx);
}
float4 l9_82=l9_81;
float l9_83=l9_82.x-fast::min(l9_82.w,l9_82.y);
float l9_84=abs(((l9_82.w-l9_82.y)/((6.0*l9_83)+1e-07))+l9_82.z);
float l9_85=l9_82.x;
float3 l9_86=float3(l9_84,l9_83,l9_85);
float3 l9_87=l9_86;
float l9_88=l9_87.z-(l9_87.y*0.5);
float l9_89=l9_87.y/((1.0-abs((2.0*l9_88)-1.0))+1e-07);
float3 l9_90=float3(l9_87.x,l9_89,l9_88);
float3 l9_91=float3(l9_90.x,l9_76.y,l9_76.z);
float l9_92=l9_91.x;
float l9_93=abs((6.0*l9_92)-3.0)-1.0;
float l9_94=2.0-abs((6.0*l9_92)-2.0);
float l9_95=2.0-abs((6.0*l9_92)-4.0);
float3 l9_96=fast::clamp(float3(l9_93,l9_94,l9_95),float3(0.0),float3(1.0));
float3 l9_97=l9_96;
float l9_98=(1.0-abs((2.0*l9_91.z)-1.0))*l9_91.y;
l9_97=((l9_97-float3(0.5))*l9_98)+float3(l9_91.z);
float3 l9_99=l9_97;
float3 l9_100=l9_99;
return l9_100;
}
else
{
if ((int(BLEND_MODE_SATURATION_tmp)!=0))
{
float3 param_2=a;
float3 param_3=b;
float3 l9_101=param_2;
float3 l9_102=l9_101;
float4 l9_103;
if (l9_102.y<l9_102.z)
{
l9_103=float4(l9_102.zy,-1.0,0.66666669);
}
else
{
l9_103=float4(l9_102.yz,0.0,-0.33333334);
}
float4 l9_104=l9_103;
float4 l9_105;
if (l9_102.x<l9_104.x)
{
l9_105=float4(l9_104.xyw,l9_102.x);
}
else
{
l9_105=float4(l9_102.x,l9_104.yzx);
}
float4 l9_106=l9_105;
float l9_107=l9_106.x-fast::min(l9_106.w,l9_106.y);
float l9_108=abs(((l9_106.w-l9_106.y)/((6.0*l9_107)+1e-07))+l9_106.z);
float l9_109=l9_106.x;
float3 l9_110=float3(l9_108,l9_107,l9_109);
float3 l9_111=l9_110;
float l9_112=l9_111.z-(l9_111.y*0.5);
float l9_113=l9_111.y/((1.0-abs((2.0*l9_112)-1.0))+1e-07);
float3 l9_114=float3(l9_111.x,l9_113,l9_112);
float3 l9_115=l9_114;
float l9_116=l9_115.x;
float3 l9_117=param_3;
float3 l9_118=l9_117;
float4 l9_119;
if (l9_118.y<l9_118.z)
{
l9_119=float4(l9_118.zy,-1.0,0.66666669);
}
else
{
l9_119=float4(l9_118.yz,0.0,-0.33333334);
}
float4 l9_120=l9_119;
float4 l9_121;
if (l9_118.x<l9_120.x)
{
l9_121=float4(l9_120.xyw,l9_118.x);
}
else
{
l9_121=float4(l9_118.x,l9_120.yzx);
}
float4 l9_122=l9_121;
float l9_123=l9_122.x-fast::min(l9_122.w,l9_122.y);
float l9_124=abs(((l9_122.w-l9_122.y)/((6.0*l9_123)+1e-07))+l9_122.z);
float l9_125=l9_122.x;
float3 l9_126=float3(l9_124,l9_123,l9_125);
float3 l9_127=l9_126;
float l9_128=l9_127.z-(l9_127.y*0.5);
float l9_129=l9_127.y/((1.0-abs((2.0*l9_128)-1.0))+1e-07);
float3 l9_130=float3(l9_127.x,l9_129,l9_128);
float3 l9_131=float3(l9_116,l9_130.y,l9_115.z);
float l9_132=l9_131.x;
float l9_133=abs((6.0*l9_132)-3.0)-1.0;
float l9_134=2.0-abs((6.0*l9_132)-2.0);
float l9_135=2.0-abs((6.0*l9_132)-4.0);
float3 l9_136=fast::clamp(float3(l9_133,l9_134,l9_135),float3(0.0),float3(1.0));
float3 l9_137=l9_136;
float l9_138=(1.0-abs((2.0*l9_131.z)-1.0))*l9_131.y;
l9_137=((l9_137-float3(0.5))*l9_138)+float3(l9_131.z);
float3 l9_139=l9_137;
float3 l9_140=l9_139;
return l9_140;
}
else
{
if ((int(BLEND_MODE_COLOR_tmp)!=0))
{
float3 param_4=a;
float3 param_5=b;
float3 l9_141=param_5;
float3 l9_142=l9_141;
float4 l9_143;
if (l9_142.y<l9_142.z)
{
l9_143=float4(l9_142.zy,-1.0,0.66666669);
}
else
{
l9_143=float4(l9_142.yz,0.0,-0.33333334);
}
float4 l9_144=l9_143;
float4 l9_145;
if (l9_142.x<l9_144.x)
{
l9_145=float4(l9_144.xyw,l9_142.x);
}
else
{
l9_145=float4(l9_142.x,l9_144.yzx);
}
float4 l9_146=l9_145;
float l9_147=l9_146.x-fast::min(l9_146.w,l9_146.y);
float l9_148=abs(((l9_146.w-l9_146.y)/((6.0*l9_147)+1e-07))+l9_146.z);
float l9_149=l9_146.x;
float3 l9_150=float3(l9_148,l9_147,l9_149);
float3 l9_151=l9_150;
float l9_152=l9_151.z-(l9_151.y*0.5);
float l9_153=l9_151.y/((1.0-abs((2.0*l9_152)-1.0))+1e-07);
float3 l9_154=float3(l9_151.x,l9_153,l9_152);
float3 l9_155=l9_154;
float l9_156=l9_155.x;
float l9_157=l9_155.y;
float3 l9_158=param_4;
float3 l9_159=l9_158;
float4 l9_160;
if (l9_159.y<l9_159.z)
{
l9_160=float4(l9_159.zy,-1.0,0.66666669);
}
else
{
l9_160=float4(l9_159.yz,0.0,-0.33333334);
}
float4 l9_161=l9_160;
float4 l9_162;
if (l9_159.x<l9_161.x)
{
l9_162=float4(l9_161.xyw,l9_159.x);
}
else
{
l9_162=float4(l9_159.x,l9_161.yzx);
}
float4 l9_163=l9_162;
float l9_164=l9_163.x-fast::min(l9_163.w,l9_163.y);
float l9_165=abs(((l9_163.w-l9_163.y)/((6.0*l9_164)+1e-07))+l9_163.z);
float l9_166=l9_163.x;
float3 l9_167=float3(l9_165,l9_164,l9_166);
float3 l9_168=l9_167;
float l9_169=l9_168.z-(l9_168.y*0.5);
float l9_170=l9_168.y/((1.0-abs((2.0*l9_169)-1.0))+1e-07);
float3 l9_171=float3(l9_168.x,l9_170,l9_169);
float3 l9_172=float3(l9_156,l9_157,l9_171.z);
float l9_173=l9_172.x;
float l9_174=abs((6.0*l9_173)-3.0)-1.0;
float l9_175=2.0-abs((6.0*l9_173)-2.0);
float l9_176=2.0-abs((6.0*l9_173)-4.0);
float3 l9_177=fast::clamp(float3(l9_174,l9_175,l9_176),float3(0.0),float3(1.0));
float3 l9_178=l9_177;
float l9_179=(1.0-abs((2.0*l9_172.z)-1.0))*l9_172.y;
l9_178=((l9_178-float3(0.5))*l9_179)+float3(l9_172.z);
float3 l9_180=l9_178;
float3 l9_181=l9_180;
return l9_181;
}
else
{
if ((int(BLEND_MODE_LUMINOSITY_tmp)!=0))
{
float3 param_6=a;
float3 param_7=b;
float3 l9_182=param_6;
float3 l9_183=l9_182;
float4 l9_184;
if (l9_183.y<l9_183.z)
{
l9_184=float4(l9_183.zy,-1.0,0.66666669);
}
else
{
l9_184=float4(l9_183.yz,0.0,-0.33333334);
}
float4 l9_185=l9_184;
float4 l9_186;
if (l9_183.x<l9_185.x)
{
l9_186=float4(l9_185.xyw,l9_183.x);
}
else
{
l9_186=float4(l9_183.x,l9_185.yzx);
}
float4 l9_187=l9_186;
float l9_188=l9_187.x-fast::min(l9_187.w,l9_187.y);
float l9_189=abs(((l9_187.w-l9_187.y)/((6.0*l9_188)+1e-07))+l9_187.z);
float l9_190=l9_187.x;
float3 l9_191=float3(l9_189,l9_188,l9_190);
float3 l9_192=l9_191;
float l9_193=l9_192.z-(l9_192.y*0.5);
float l9_194=l9_192.y/((1.0-abs((2.0*l9_193)-1.0))+1e-07);
float3 l9_195=float3(l9_192.x,l9_194,l9_193);
float3 l9_196=l9_195;
float l9_197=l9_196.x;
float l9_198=l9_196.y;
float3 l9_199=param_7;
float3 l9_200=l9_199;
float4 l9_201;
if (l9_200.y<l9_200.z)
{
l9_201=float4(l9_200.zy,-1.0,0.66666669);
}
else
{
l9_201=float4(l9_200.yz,0.0,-0.33333334);
}
float4 l9_202=l9_201;
float4 l9_203;
if (l9_200.x<l9_202.x)
{
l9_203=float4(l9_202.xyw,l9_200.x);
}
else
{
l9_203=float4(l9_200.x,l9_202.yzx);
}
float4 l9_204=l9_203;
float l9_205=l9_204.x-fast::min(l9_204.w,l9_204.y);
float l9_206=abs(((l9_204.w-l9_204.y)/((6.0*l9_205)+1e-07))+l9_204.z);
float l9_207=l9_204.x;
float3 l9_208=float3(l9_206,l9_205,l9_207);
float3 l9_209=l9_208;
float l9_210=l9_209.z-(l9_209.y*0.5);
float l9_211=l9_209.y/((1.0-abs((2.0*l9_210)-1.0))+1e-07);
float3 l9_212=float3(l9_209.x,l9_211,l9_210);
float3 l9_213=float3(l9_197,l9_198,l9_212.z);
float l9_214=l9_213.x;
float l9_215=abs((6.0*l9_214)-3.0)-1.0;
float l9_216=2.0-abs((6.0*l9_214)-2.0);
float l9_217=2.0-abs((6.0*l9_214)-4.0);
float3 l9_218=fast::clamp(float3(l9_215,l9_216,l9_217),float3(0.0),float3(1.0));
float3 l9_219=l9_218;
float l9_220=(1.0-abs((2.0*l9_213.z)-1.0))*l9_213.y;
l9_219=((l9_219-float3(0.5))*l9_220)+float3(l9_213.z);
float3 l9_221=l9_219;
float3 l9_222=l9_221;
return l9_222;
}
else
{
float3 param_8=a;
float3 param_9=b;
float3 l9_223=param_8;
float l9_224=((0.29899999*l9_223.x)+(0.58700001*l9_223.y))+(0.114*l9_223.z);
float l9_225=l9_224;
float l9_226=1.0;
float l9_227=pow(l9_225,1.0/UserUniforms.correctedIntensity);
int l9_228;
if ((int(intensityTextureHasSwappedViews_tmp)!=0))
{
int l9_229=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_229=0;
}
else
{
l9_229=varStereoViewID;
}
int l9_230=l9_229;
l9_228=1-l9_230;
}
else
{
int l9_231=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_231=0;
}
else
{
l9_231=varStereoViewID;
}
int l9_232=l9_231;
l9_228=l9_232;
}
int l9_233=l9_228;
int l9_234=intensityTextureLayout_tmp;
int l9_235=l9_233;
float2 l9_236=float2(l9_227,0.5);
bool l9_237=(int(SC_USE_UV_TRANSFORM_intensityTexture_tmp)!=0);
float3x3 l9_238=UserUniforms.intensityTextureTransform;
int2 l9_239=int2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp);
bool l9_240=(int(SC_USE_UV_MIN_MAX_intensityTexture_tmp)!=0);
float4 l9_241=UserUniforms.intensityTextureUvMinMax;
bool l9_242=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp)!=0);
float4 l9_243=UserUniforms.intensityTextureBorderColor;
float l9_244=0.0;
bool l9_245=l9_242&&(!l9_240);
float l9_246=1.0;
float l9_247=l9_236.x;
int l9_248=l9_239.x;
if (l9_248==1)
{
l9_247=fract(l9_247);
}
else
{
if (l9_248==2)
{
float l9_249=fract(l9_247);
float l9_250=l9_247-l9_249;
float l9_251=step(0.25,fract(l9_250*0.5));
l9_247=mix(l9_249,1.0-l9_249,fast::clamp(l9_251,0.0,1.0));
}
}
l9_236.x=l9_247;
float l9_252=l9_236.y;
int l9_253=l9_239.y;
if (l9_253==1)
{
l9_252=fract(l9_252);
}
else
{
if (l9_253==2)
{
float l9_254=fract(l9_252);
float l9_255=l9_252-l9_254;
float l9_256=step(0.25,fract(l9_255*0.5));
l9_252=mix(l9_254,1.0-l9_254,fast::clamp(l9_256,0.0,1.0));
}
}
l9_236.y=l9_252;
if (l9_240)
{
bool l9_257=l9_242;
bool l9_258;
if (l9_257)
{
l9_258=l9_239.x==3;
}
else
{
l9_258=l9_257;
}
float l9_259=l9_236.x;
float l9_260=l9_241.x;
float l9_261=l9_241.z;
bool l9_262=l9_258;
float l9_263=l9_246;
float l9_264=fast::clamp(l9_259,l9_260,l9_261);
float l9_265=step(abs(l9_259-l9_264),9.9999997e-06);
l9_263*=(l9_265+((1.0-float(l9_262))*(1.0-l9_265)));
l9_259=l9_264;
l9_236.x=l9_259;
l9_246=l9_263;
bool l9_266=l9_242;
bool l9_267;
if (l9_266)
{
l9_267=l9_239.y==3;
}
else
{
l9_267=l9_266;
}
float l9_268=l9_236.y;
float l9_269=l9_241.y;
float l9_270=l9_241.w;
bool l9_271=l9_267;
float l9_272=l9_246;
float l9_273=fast::clamp(l9_268,l9_269,l9_270);
float l9_274=step(abs(l9_268-l9_273),9.9999997e-06);
l9_272*=(l9_274+((1.0-float(l9_271))*(1.0-l9_274)));
l9_268=l9_273;
l9_236.y=l9_268;
l9_246=l9_272;
}
float2 l9_275=l9_236;
bool l9_276=l9_237;
float3x3 l9_277=l9_238;
if (l9_276)
{
l9_275=float2((l9_277*float3(l9_275,1.0)).xy);
}
float2 l9_278=l9_275;
l9_236=l9_278;
float l9_279=l9_236.x;
int l9_280=l9_239.x;
bool l9_281=l9_245;
float l9_282=l9_246;
if ((l9_280==0)||(l9_280==3))
{
float l9_283=l9_279;
float l9_284=0.0;
float l9_285=1.0;
bool l9_286=l9_281;
float l9_287=l9_282;
float l9_288=fast::clamp(l9_283,l9_284,l9_285);
float l9_289=step(abs(l9_283-l9_288),9.9999997e-06);
l9_287*=(l9_289+((1.0-float(l9_286))*(1.0-l9_289)));
l9_283=l9_288;
l9_279=l9_283;
l9_282=l9_287;
}
l9_236.x=l9_279;
l9_246=l9_282;
float l9_290=l9_236.y;
int l9_291=l9_239.y;
bool l9_292=l9_245;
float l9_293=l9_246;
if ((l9_291==0)||(l9_291==3))
{
float l9_294=l9_290;
float l9_295=0.0;
float l9_296=1.0;
bool l9_297=l9_292;
float l9_298=l9_293;
float l9_299=fast::clamp(l9_294,l9_295,l9_296);
float l9_300=step(abs(l9_294-l9_299),9.9999997e-06);
l9_298*=(l9_300+((1.0-float(l9_297))*(1.0-l9_300)));
l9_294=l9_299;
l9_290=l9_294;
l9_293=l9_298;
}
l9_236.y=l9_290;
l9_246=l9_293;
float2 l9_301=l9_236;
int l9_302=l9_234;
int l9_303=l9_235;
float l9_304=l9_244;
float2 l9_305=l9_301;
int l9_306=l9_302;
int l9_307=l9_303;
float3 l9_308=float3(0.0);
if (l9_306==0)
{
l9_308=float3(l9_305,0.0);
}
else
{
if (l9_306==1)
{
l9_308=float3(l9_305.x,(l9_305.y*0.5)+(0.5-(float(l9_307)*0.5)),0.0);
}
else
{
l9_308=float3(l9_305,float(l9_307));
}
}
float3 l9_309=l9_308;
float3 l9_310=l9_309;
float4 l9_311=intensityTexture.sample(intensityTextureSmpSC,l9_310.xy,bias(l9_304));
float4 l9_312=l9_311;
if (l9_242)
{
l9_312=mix(l9_243,l9_312,float4(l9_246));
}
float4 l9_313=l9_312;
float3 l9_314=l9_313.xyz;
float3 l9_315=l9_314;
float l9_316=16.0;
float l9_317=((((l9_315.x*256.0)+l9_315.y)+(l9_315.z/256.0))/257.00391)*l9_316;
float l9_318=l9_317;
if ((int(BLEND_MODE_FORGRAY_tmp)!=0))
{
l9_318=fast::max(l9_318,1.0);
}
if ((int(BLEND_MODE_NOTBRIGHT_tmp)!=0))
{
l9_318=fast::min(l9_318,1.0);
}
float l9_319=l9_225;
float3 l9_320=param_8;
float3 l9_321=param_9;
float l9_322=l9_226;
float l9_323=l9_318;
float3 l9_324=transformColor(l9_319,l9_320,l9_321,l9_322,l9_323);
return l9_324;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
float4 sc_OutputMotionVectorIfNeeded(thread const float4& finalColor,thread float4& varPosAndMotion,thread float4& varNormalAndMotion)
{
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
float2 param=float2(varPosAndMotion.w,varNormalAndMotion.w);
float l9_0=(param.x*5.0)+0.5;
float l9_1=floor(l9_0*65535.0);
float l9_2=floor(l9_1*0.00390625);
float2 l9_3=float2(l9_2/255.0,(l9_1-(l9_2*256.0))/255.0);
float l9_4=(param.y*5.0)+0.5;
float l9_5=floor(l9_4*65535.0);
float l9_6=floor(l9_5*0.00390625);
float2 l9_7=float2(l9_6/255.0,(l9_5-(l9_6*256.0))/255.0);
float4 l9_8=float4(l9_3,l9_7);
return l9_8;
}
else
{
return finalColor;
}
}
fragment main_frag_out main_frag(main_frag_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],float4 gl_FragCoord [[position]])
{
main_frag_out out={};
if ((int(sc_DepthOnly_tmp)!=0))
{
return out;
}
if ((sc_StereoRenderingMode_tmp==1)&&(sc_StereoRendering_IsClipDistanceEnabled_tmp==0))
{
if (in.varClipDistance<0.0)
{
discard_fragment();
}
}
ssPreviewInfo PreviewInfo;
PreviewInfo.Color=in.PreviewVertexColor;
PreviewInfo.Saved=((in.PreviewVertexSaved*1.0)!=0.0) ? true : false;
float4 FinalColor=float4(1.0);
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
Globals.gTimeDelta=(*sc_set0.UserUniforms).sc_Time.y;
if ((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.x!=0u)
{
float4 l9_0=gl_FragCoord;
int2 param=int2(l9_0.xy);
sc_RayTracingHitPayload rhp=sc_RayTracingEvaluateHitPayload(param,(*sc_set0.UserUniforms),(*sc_set0.sc_RayTracingCasterVertexBuffer),(*sc_set0.sc_RayTracingCasterNonAnimatedVertexBuffer),(*sc_set0.sc_RayTracingCasterIndexBuffer),sc_set0.sc_RayTracingHitCasterIdAndBarycentric,sc_set0.sc_RayTracingHitCasterIdAndBarycentricSmpSC,sc_set0.sc_RayTracingRayDirection,sc_set0.sc_RayTracingRayDirectionSmpSC);
if (rhp.id.x!=((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.y&65535u))
{
return out;
}
Globals.BumpedNormal=float3(0.0);
Globals.ViewDirWS=rhp.viewDirWS;
Globals.PositionWS=rhp.positionWS;
Globals.VertexTangent_WorldSpace=rhp.tangentWS.xyz;
Globals.VertexNormal_WorldSpace=rhp.normalWS;
Globals.VertexBinormal_WorldSpace=cross(Globals.VertexNormal_WorldSpace,Globals.VertexTangent_WorldSpace)*rhp.tangentWS.w;
Globals.SurfacePosition_WorldSpace=rhp.positionWS;
Globals.Surface_UVCoord0=rhp.uv0;
}
else
{
Globals.BumpedNormal=float3(0.0);
Globals.ViewDirWS=normalize((*sc_set0.UserUniforms).sc_Camera.position-in.varPosAndMotion.xyz);
Globals.PositionWS=in.varPosAndMotion.xyz;
Globals.VertexTangent_WorldSpace=normalize(in.varTangent.xyz);
Globals.VertexNormal_WorldSpace=normalize(in.varNormalAndMotion.xyz);
Globals.VertexBinormal_WorldSpace=cross(Globals.VertexNormal_WorldSpace,Globals.VertexTangent_WorldSpace)*in.varTangent.w;
Globals.SurfacePosition_WorldSpace=in.varPosAndMotion.xyz;
Globals.ViewDirWS=normalize((*sc_set0.UserUniforms).sc_Camera.position-Globals.SurfacePosition_WorldSpace);
Globals.Surface_UVCoord0=in.varTex01.xy;
}
float4 Output_N8=float4(0.0);
float4 param_1=float4(1.0);
float4 param_2=float4(0.0);
ssGlobals param_4=Globals;
float4 param_3;
if ((int(enableRim_tmp)!=0))
{
float l9_1=0.0;
float l9_2=(*sc_set0.UserUniforms).rimExponent;
l9_1=l9_2;
float l9_3=0.0;
float l9_4=(*sc_set0.UserUniforms).rimIntensity;
l9_3=l9_4;
float l9_5=0.0;
float l9_6=l9_1;
float l9_7=l9_3;
ssGlobals l9_8=param_4;
float l9_9=abs(dot(-l9_8.ViewDirWS,l9_8.VertexNormal_WorldSpace));
float l9_10=pow(1.0-l9_9,l9_6);
l9_10=fast::max(l9_10,0.0);
l9_10*=l9_7;
l9_5=l9_10;
float4 l9_11=float4(0.0);
float4 l9_12=(*sc_set0.UserUniforms).rimColor;
l9_11=l9_12;
float4 l9_13=float4(0.0);
l9_13=float4(l9_5)*l9_11;
float4 l9_14=float4(0.0);
float4 l9_15=float4(1.0);
float4 l9_16=float4(0.0);
ssGlobals l9_17=param_4;
float4 l9_18;
if ((int(enableAO_tmp)!=0))
{
float4 l9_19=float4(0.0);
float4 l9_20=float4(1.0);
float4 l9_21=float4(0.0);
ssGlobals l9_22=l9_17;
float4 l9_23;
if ((int(enableAlbedo_tmp)!=0))
{
float4 l9_24=float4(0.0);
float4 l9_25=(*sc_set0.UserUniforms).baseColor;
l9_24=l9_25;
float2 l9_26=float2(0.0);
l9_26=l9_22.Surface_UVCoord0;
float l9_27=0.0;
float l9_28=(*sc_set0.UserUniforms).uvScale;
l9_27=l9_28;
float2 l9_29=float2(0.0);
l9_29=((l9_26-(*sc_set0.UserUniforms).Port_Center_N031)*float2(l9_27))+(*sc_set0.UserUniforms).Port_Center_N031;
float4 l9_30=float4(0.0);
int l9_31;
if ((int(albedoTexHasSwappedViews_tmp)!=0))
{
int l9_32=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_32=0;
}
else
{
l9_32=in.varStereoViewID;
}
int l9_33=l9_32;
l9_31=1-l9_33;
}
else
{
int l9_34=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_34=0;
}
else
{
l9_34=in.varStereoViewID;
}
int l9_35=l9_34;
l9_31=l9_35;
}
int l9_36=l9_31;
int l9_37=albedoTexLayout_tmp;
int l9_38=l9_36;
float2 l9_39=l9_29;
bool l9_40=(int(SC_USE_UV_TRANSFORM_albedoTex_tmp)!=0);
float3x3 l9_41=(*sc_set0.UserUniforms).albedoTexTransform;
int2 l9_42=int2(SC_SOFTWARE_WRAP_MODE_U_albedoTex_tmp,SC_SOFTWARE_WRAP_MODE_V_albedoTex_tmp);
bool l9_43=(int(SC_USE_UV_MIN_MAX_albedoTex_tmp)!=0);
float4 l9_44=(*sc_set0.UserUniforms).albedoTexUvMinMax;
bool l9_45=(int(SC_USE_CLAMP_TO_BORDER_albedoTex_tmp)!=0);
float4 l9_46=(*sc_set0.UserUniforms).albedoTexBorderColor;
float l9_47=0.0;
bool l9_48=l9_45&&(!l9_43);
float l9_49=1.0;
float l9_50=l9_39.x;
int l9_51=l9_42.x;
if (l9_51==1)
{
l9_50=fract(l9_50);
}
else
{
if (l9_51==2)
{
float l9_52=fract(l9_50);
float l9_53=l9_50-l9_52;
float l9_54=step(0.25,fract(l9_53*0.5));
l9_50=mix(l9_52,1.0-l9_52,fast::clamp(l9_54,0.0,1.0));
}
}
l9_39.x=l9_50;
float l9_55=l9_39.y;
int l9_56=l9_42.y;
if (l9_56==1)
{
l9_55=fract(l9_55);
}
else
{
if (l9_56==2)
{
float l9_57=fract(l9_55);
float l9_58=l9_55-l9_57;
float l9_59=step(0.25,fract(l9_58*0.5));
l9_55=mix(l9_57,1.0-l9_57,fast::clamp(l9_59,0.0,1.0));
}
}
l9_39.y=l9_55;
if (l9_43)
{
bool l9_60=l9_45;
bool l9_61;
if (l9_60)
{
l9_61=l9_42.x==3;
}
else
{
l9_61=l9_60;
}
float l9_62=l9_39.x;
float l9_63=l9_44.x;
float l9_64=l9_44.z;
bool l9_65=l9_61;
float l9_66=l9_49;
float l9_67=fast::clamp(l9_62,l9_63,l9_64);
float l9_68=step(abs(l9_62-l9_67),9.9999997e-06);
l9_66*=(l9_68+((1.0-float(l9_65))*(1.0-l9_68)));
l9_62=l9_67;
l9_39.x=l9_62;
l9_49=l9_66;
bool l9_69=l9_45;
bool l9_70;
if (l9_69)
{
l9_70=l9_42.y==3;
}
else
{
l9_70=l9_69;
}
float l9_71=l9_39.y;
float l9_72=l9_44.y;
float l9_73=l9_44.w;
bool l9_74=l9_70;
float l9_75=l9_49;
float l9_76=fast::clamp(l9_71,l9_72,l9_73);
float l9_77=step(abs(l9_71-l9_76),9.9999997e-06);
l9_75*=(l9_77+((1.0-float(l9_74))*(1.0-l9_77)));
l9_71=l9_76;
l9_39.y=l9_71;
l9_49=l9_75;
}
float2 l9_78=l9_39;
bool l9_79=l9_40;
float3x3 l9_80=l9_41;
if (l9_79)
{
l9_78=float2((l9_80*float3(l9_78,1.0)).xy);
}
float2 l9_81=l9_78;
l9_39=l9_81;
float l9_82=l9_39.x;
int l9_83=l9_42.x;
bool l9_84=l9_48;
float l9_85=l9_49;
if ((l9_83==0)||(l9_83==3))
{
float l9_86=l9_82;
float l9_87=0.0;
float l9_88=1.0;
bool l9_89=l9_84;
float l9_90=l9_85;
float l9_91=fast::clamp(l9_86,l9_87,l9_88);
float l9_92=step(abs(l9_86-l9_91),9.9999997e-06);
l9_90*=(l9_92+((1.0-float(l9_89))*(1.0-l9_92)));
l9_86=l9_91;
l9_82=l9_86;
l9_85=l9_90;
}
l9_39.x=l9_82;
l9_49=l9_85;
float l9_93=l9_39.y;
int l9_94=l9_42.y;
bool l9_95=l9_48;
float l9_96=l9_49;
if ((l9_94==0)||(l9_94==3))
{
float l9_97=l9_93;
float l9_98=0.0;
float l9_99=1.0;
bool l9_100=l9_95;
float l9_101=l9_96;
float l9_102=fast::clamp(l9_97,l9_98,l9_99);
float l9_103=step(abs(l9_97-l9_102),9.9999997e-06);
l9_101*=(l9_103+((1.0-float(l9_100))*(1.0-l9_103)));
l9_97=l9_102;
l9_93=l9_97;
l9_96=l9_101;
}
l9_39.y=l9_93;
l9_49=l9_96;
float2 l9_104=l9_39;
int l9_105=l9_37;
int l9_106=l9_38;
float l9_107=l9_47;
float2 l9_108=l9_104;
int l9_109=l9_105;
int l9_110=l9_106;
float3 l9_111=float3(0.0);
if (l9_109==0)
{
l9_111=float3(l9_108,0.0);
}
else
{
if (l9_109==1)
{
l9_111=float3(l9_108.x,(l9_108.y*0.5)+(0.5-(float(l9_110)*0.5)),0.0);
}
else
{
l9_111=float3(l9_108,float(l9_110));
}
}
float3 l9_112=l9_111;
float3 l9_113=l9_112;
float4 l9_114=sc_set0.albedoTex.sample(sc_set0.albedoTexSmpSC,l9_113.xy,bias(l9_107));
float4 l9_115=l9_114;
if (l9_45)
{
l9_115=mix(l9_46,l9_115,float4(l9_49));
}
float4 l9_116=l9_115;
l9_30=l9_116;
float4 l9_117=float4(0.0);
int l9_118;
if ((int(albedoSecondaryHasSwappedViews_tmp)!=0))
{
int l9_119=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_119=0;
}
else
{
l9_119=in.varStereoViewID;
}
int l9_120=l9_119;
l9_118=1-l9_120;
}
else
{
int l9_121=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_121=0;
}
else
{
l9_121=in.varStereoViewID;
}
int l9_122=l9_121;
l9_118=l9_122;
}
int l9_123=l9_118;
int l9_124=albedoSecondaryLayout_tmp;
int l9_125=l9_123;
float2 l9_126=l9_29;
bool l9_127=(int(SC_USE_UV_TRANSFORM_albedoSecondary_tmp)!=0);
float3x3 l9_128=(*sc_set0.UserUniforms).albedoSecondaryTransform;
int2 l9_129=int2(SC_SOFTWARE_WRAP_MODE_U_albedoSecondary_tmp,SC_SOFTWARE_WRAP_MODE_V_albedoSecondary_tmp);
bool l9_130=(int(SC_USE_UV_MIN_MAX_albedoSecondary_tmp)!=0);
float4 l9_131=(*sc_set0.UserUniforms).albedoSecondaryUvMinMax;
bool l9_132=(int(SC_USE_CLAMP_TO_BORDER_albedoSecondary_tmp)!=0);
float4 l9_133=(*sc_set0.UserUniforms).albedoSecondaryBorderColor;
float l9_134=0.0;
bool l9_135=l9_132&&(!l9_130);
float l9_136=1.0;
float l9_137=l9_126.x;
int l9_138=l9_129.x;
if (l9_138==1)
{
l9_137=fract(l9_137);
}
else
{
if (l9_138==2)
{
float l9_139=fract(l9_137);
float l9_140=l9_137-l9_139;
float l9_141=step(0.25,fract(l9_140*0.5));
l9_137=mix(l9_139,1.0-l9_139,fast::clamp(l9_141,0.0,1.0));
}
}
l9_126.x=l9_137;
float l9_142=l9_126.y;
int l9_143=l9_129.y;
if (l9_143==1)
{
l9_142=fract(l9_142);
}
else
{
if (l9_143==2)
{
float l9_144=fract(l9_142);
float l9_145=l9_142-l9_144;
float l9_146=step(0.25,fract(l9_145*0.5));
l9_142=mix(l9_144,1.0-l9_144,fast::clamp(l9_146,0.0,1.0));
}
}
l9_126.y=l9_142;
if (l9_130)
{
bool l9_147=l9_132;
bool l9_148;
if (l9_147)
{
l9_148=l9_129.x==3;
}
else
{
l9_148=l9_147;
}
float l9_149=l9_126.x;
float l9_150=l9_131.x;
float l9_151=l9_131.z;
bool l9_152=l9_148;
float l9_153=l9_136;
float l9_154=fast::clamp(l9_149,l9_150,l9_151);
float l9_155=step(abs(l9_149-l9_154),9.9999997e-06);
l9_153*=(l9_155+((1.0-float(l9_152))*(1.0-l9_155)));
l9_149=l9_154;
l9_126.x=l9_149;
l9_136=l9_153;
bool l9_156=l9_132;
bool l9_157;
if (l9_156)
{
l9_157=l9_129.y==3;
}
else
{
l9_157=l9_156;
}
float l9_158=l9_126.y;
float l9_159=l9_131.y;
float l9_160=l9_131.w;
bool l9_161=l9_157;
float l9_162=l9_136;
float l9_163=fast::clamp(l9_158,l9_159,l9_160);
float l9_164=step(abs(l9_158-l9_163),9.9999997e-06);
l9_162*=(l9_164+((1.0-float(l9_161))*(1.0-l9_164)));
l9_158=l9_163;
l9_126.y=l9_158;
l9_136=l9_162;
}
float2 l9_165=l9_126;
bool l9_166=l9_127;
float3x3 l9_167=l9_128;
if (l9_166)
{
l9_165=float2((l9_167*float3(l9_165,1.0)).xy);
}
float2 l9_168=l9_165;
l9_126=l9_168;
float l9_169=l9_126.x;
int l9_170=l9_129.x;
bool l9_171=l9_135;
float l9_172=l9_136;
if ((l9_170==0)||(l9_170==3))
{
float l9_173=l9_169;
float l9_174=0.0;
float l9_175=1.0;
bool l9_176=l9_171;
float l9_177=l9_172;
float l9_178=fast::clamp(l9_173,l9_174,l9_175);
float l9_179=step(abs(l9_173-l9_178),9.9999997e-06);
l9_177*=(l9_179+((1.0-float(l9_176))*(1.0-l9_179)));
l9_173=l9_178;
l9_169=l9_173;
l9_172=l9_177;
}
l9_126.x=l9_169;
l9_136=l9_172;
float l9_180=l9_126.y;
int l9_181=l9_129.y;
bool l9_182=l9_135;
float l9_183=l9_136;
if ((l9_181==0)||(l9_181==3))
{
float l9_184=l9_180;
float l9_185=0.0;
float l9_186=1.0;
bool l9_187=l9_182;
float l9_188=l9_183;
float l9_189=fast::clamp(l9_184,l9_185,l9_186);
float l9_190=step(abs(l9_184-l9_189),9.9999997e-06);
l9_188*=(l9_190+((1.0-float(l9_187))*(1.0-l9_190)));
l9_184=l9_189;
l9_180=l9_184;
l9_183=l9_188;
}
l9_126.y=l9_180;
l9_136=l9_183;
float2 l9_191=l9_126;
int l9_192=l9_124;
int l9_193=l9_125;
float l9_194=l9_134;
float2 l9_195=l9_191;
int l9_196=l9_192;
int l9_197=l9_193;
float3 l9_198=float3(0.0);
if (l9_196==0)
{
l9_198=float3(l9_195,0.0);
}
else
{
if (l9_196==1)
{
l9_198=float3(l9_195.x,(l9_195.y*0.5)+(0.5-(float(l9_197)*0.5)),0.0);
}
else
{
l9_198=float3(l9_195,float(l9_197));
}
}
float3 l9_199=l9_198;
float3 l9_200=l9_199;
float4 l9_201=sc_set0.albedoSecondary.sample(sc_set0.albedoSecondarySmpSC,l9_200.xy,bias(l9_194));
float4 l9_202=l9_201;
if (l9_132)
{
l9_202=mix(l9_133,l9_202,float4(l9_136));
}
float4 l9_203=l9_202;
l9_117=l9_203;
float l9_204=0.0;
float l9_205=(*sc_set0.UserUniforms).progress;
l9_204=l9_205;
float4 l9_206=float4(0.0);
l9_206=mix(l9_30,l9_117,float4(l9_204));
float4 l9_207=float4(0.0);
l9_207=l9_24*l9_206;
l9_20=l9_207;
l9_23=l9_20;
}
else
{
float4 l9_208=float4(0.0);
float4 l9_209=(*sc_set0.UserUniforms).baseColor;
l9_208=l9_209;
l9_21=l9_208;
l9_23=l9_21;
}
l9_19=l9_23;
float2 l9_210=float2(0.0);
l9_210=l9_17.Surface_UVCoord0;
float4 l9_211=float4(0.0);
int l9_212;
if ((int(aoTexHasSwappedViews_tmp)!=0))
{
int l9_213=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_213=0;
}
else
{
l9_213=in.varStereoViewID;
}
int l9_214=l9_213;
l9_212=1-l9_214;
}
else
{
int l9_215=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_215=0;
}
else
{
l9_215=in.varStereoViewID;
}
int l9_216=l9_215;
l9_212=l9_216;
}
int l9_217=l9_212;
int l9_218=aoTexLayout_tmp;
int l9_219=l9_217;
float2 l9_220=l9_210;
bool l9_221=(int(SC_USE_UV_TRANSFORM_aoTex_tmp)!=0);
float3x3 l9_222=(*sc_set0.UserUniforms).aoTexTransform;
int2 l9_223=int2(SC_SOFTWARE_WRAP_MODE_U_aoTex_tmp,SC_SOFTWARE_WRAP_MODE_V_aoTex_tmp);
bool l9_224=(int(SC_USE_UV_MIN_MAX_aoTex_tmp)!=0);
float4 l9_225=(*sc_set0.UserUniforms).aoTexUvMinMax;
bool l9_226=(int(SC_USE_CLAMP_TO_BORDER_aoTex_tmp)!=0);
float4 l9_227=(*sc_set0.UserUniforms).aoTexBorderColor;
float l9_228=0.0;
bool l9_229=l9_226&&(!l9_224);
float l9_230=1.0;
float l9_231=l9_220.x;
int l9_232=l9_223.x;
if (l9_232==1)
{
l9_231=fract(l9_231);
}
else
{
if (l9_232==2)
{
float l9_233=fract(l9_231);
float l9_234=l9_231-l9_233;
float l9_235=step(0.25,fract(l9_234*0.5));
l9_231=mix(l9_233,1.0-l9_233,fast::clamp(l9_235,0.0,1.0));
}
}
l9_220.x=l9_231;
float l9_236=l9_220.y;
int l9_237=l9_223.y;
if (l9_237==1)
{
l9_236=fract(l9_236);
}
else
{
if (l9_237==2)
{
float l9_238=fract(l9_236);
float l9_239=l9_236-l9_238;
float l9_240=step(0.25,fract(l9_239*0.5));
l9_236=mix(l9_238,1.0-l9_238,fast::clamp(l9_240,0.0,1.0));
}
}
l9_220.y=l9_236;
if (l9_224)
{
bool l9_241=l9_226;
bool l9_242;
if (l9_241)
{
l9_242=l9_223.x==3;
}
else
{
l9_242=l9_241;
}
float l9_243=l9_220.x;
float l9_244=l9_225.x;
float l9_245=l9_225.z;
bool l9_246=l9_242;
float l9_247=l9_230;
float l9_248=fast::clamp(l9_243,l9_244,l9_245);
float l9_249=step(abs(l9_243-l9_248),9.9999997e-06);
l9_247*=(l9_249+((1.0-float(l9_246))*(1.0-l9_249)));
l9_243=l9_248;
l9_220.x=l9_243;
l9_230=l9_247;
bool l9_250=l9_226;
bool l9_251;
if (l9_250)
{
l9_251=l9_223.y==3;
}
else
{
l9_251=l9_250;
}
float l9_252=l9_220.y;
float l9_253=l9_225.y;
float l9_254=l9_225.w;
bool l9_255=l9_251;
float l9_256=l9_230;
float l9_257=fast::clamp(l9_252,l9_253,l9_254);
float l9_258=step(abs(l9_252-l9_257),9.9999997e-06);
l9_256*=(l9_258+((1.0-float(l9_255))*(1.0-l9_258)));
l9_252=l9_257;
l9_220.y=l9_252;
l9_230=l9_256;
}
float2 l9_259=l9_220;
bool l9_260=l9_221;
float3x3 l9_261=l9_222;
if (l9_260)
{
l9_259=float2((l9_261*float3(l9_259,1.0)).xy);
}
float2 l9_262=l9_259;
l9_220=l9_262;
float l9_263=l9_220.x;
int l9_264=l9_223.x;
bool l9_265=l9_229;
float l9_266=l9_230;
if ((l9_264==0)||(l9_264==3))
{
float l9_267=l9_263;
float l9_268=0.0;
float l9_269=1.0;
bool l9_270=l9_265;
float l9_271=l9_266;
float l9_272=fast::clamp(l9_267,l9_268,l9_269);
float l9_273=step(abs(l9_267-l9_272),9.9999997e-06);
l9_271*=(l9_273+((1.0-float(l9_270))*(1.0-l9_273)));
l9_267=l9_272;
l9_263=l9_267;
l9_266=l9_271;
}
l9_220.x=l9_263;
l9_230=l9_266;
float l9_274=l9_220.y;
int l9_275=l9_223.y;
bool l9_276=l9_229;
float l9_277=l9_230;
if ((l9_275==0)||(l9_275==3))
{
float l9_278=l9_274;
float l9_279=0.0;
float l9_280=1.0;
bool l9_281=l9_276;
float l9_282=l9_277;
float l9_283=fast::clamp(l9_278,l9_279,l9_280);
float l9_284=step(abs(l9_278-l9_283),9.9999997e-06);
l9_282*=(l9_284+((1.0-float(l9_281))*(1.0-l9_284)));
l9_278=l9_283;
l9_274=l9_278;
l9_277=l9_282;
}
l9_220.y=l9_274;
l9_230=l9_277;
float2 l9_285=l9_220;
int l9_286=l9_218;
int l9_287=l9_219;
float l9_288=l9_228;
float2 l9_289=l9_285;
int l9_290=l9_286;
int l9_291=l9_287;
float3 l9_292=float3(0.0);
if (l9_290==0)
{
l9_292=float3(l9_289,0.0);
}
else
{
if (l9_290==1)
{
l9_292=float3(l9_289.x,(l9_289.y*0.5)+(0.5-(float(l9_291)*0.5)),0.0);
}
else
{
l9_292=float3(l9_289,float(l9_291));
}
}
float3 l9_293=l9_292;
float3 l9_294=l9_293;
float4 l9_295=sc_set0.aoTex.sample(sc_set0.aoTexSmpSC,l9_294.xy,bias(l9_288));
float4 l9_296=l9_295;
if (l9_226)
{
l9_296=mix(l9_227,l9_296,float4(l9_230));
}
float4 l9_297=l9_296;
l9_211=l9_297;
float l9_298=0.0;
float l9_299=(*sc_set0.UserUniforms).aoScale;
l9_298=l9_299;
float4 l9_300=float4(0.0);
l9_300=l9_211+float4(l9_298);
float4 l9_301=float4(0.0);
l9_301=l9_19*l9_300;
l9_15=l9_301;
l9_18=l9_15;
}
else
{
float4 l9_302=float4(0.0);
float4 l9_303=float4(1.0);
float4 l9_304=float4(0.0);
ssGlobals l9_305=l9_17;
float4 l9_306;
if ((int(enableAlbedo_tmp)!=0))
{
float4 l9_307=float4(0.0);
float4 l9_308=(*sc_set0.UserUniforms).baseColor;
l9_307=l9_308;
float2 l9_309=float2(0.0);
l9_309=l9_305.Surface_UVCoord0;
float l9_310=0.0;
float l9_311=(*sc_set0.UserUniforms).uvScale;
l9_310=l9_311;
float2 l9_312=float2(0.0);
l9_312=((l9_309-(*sc_set0.UserUniforms).Port_Center_N031)*float2(l9_310))+(*sc_set0.UserUniforms).Port_Center_N031;
float4 l9_313=float4(0.0);
int l9_314;
if ((int(albedoTexHasSwappedViews_tmp)!=0))
{
int l9_315=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_315=0;
}
else
{
l9_315=in.varStereoViewID;
}
int l9_316=l9_315;
l9_314=1-l9_316;
}
else
{
int l9_317=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_317=0;
}
else
{
l9_317=in.varStereoViewID;
}
int l9_318=l9_317;
l9_314=l9_318;
}
int l9_319=l9_314;
int l9_320=albedoTexLayout_tmp;
int l9_321=l9_319;
float2 l9_322=l9_312;
bool l9_323=(int(SC_USE_UV_TRANSFORM_albedoTex_tmp)!=0);
float3x3 l9_324=(*sc_set0.UserUniforms).albedoTexTransform;
int2 l9_325=int2(SC_SOFTWARE_WRAP_MODE_U_albedoTex_tmp,SC_SOFTWARE_WRAP_MODE_V_albedoTex_tmp);
bool l9_326=(int(SC_USE_UV_MIN_MAX_albedoTex_tmp)!=0);
float4 l9_327=(*sc_set0.UserUniforms).albedoTexUvMinMax;
bool l9_328=(int(SC_USE_CLAMP_TO_BORDER_albedoTex_tmp)!=0);
float4 l9_329=(*sc_set0.UserUniforms).albedoTexBorderColor;
float l9_330=0.0;
bool l9_331=l9_328&&(!l9_326);
float l9_332=1.0;
float l9_333=l9_322.x;
int l9_334=l9_325.x;
if (l9_334==1)
{
l9_333=fract(l9_333);
}
else
{
if (l9_334==2)
{
float l9_335=fract(l9_333);
float l9_336=l9_333-l9_335;
float l9_337=step(0.25,fract(l9_336*0.5));
l9_333=mix(l9_335,1.0-l9_335,fast::clamp(l9_337,0.0,1.0));
}
}
l9_322.x=l9_333;
float l9_338=l9_322.y;
int l9_339=l9_325.y;
if (l9_339==1)
{
l9_338=fract(l9_338);
}
else
{
if (l9_339==2)
{
float l9_340=fract(l9_338);
float l9_341=l9_338-l9_340;
float l9_342=step(0.25,fract(l9_341*0.5));
l9_338=mix(l9_340,1.0-l9_340,fast::clamp(l9_342,0.0,1.0));
}
}
l9_322.y=l9_338;
if (l9_326)
{
bool l9_343=l9_328;
bool l9_344;
if (l9_343)
{
l9_344=l9_325.x==3;
}
else
{
l9_344=l9_343;
}
float l9_345=l9_322.x;
float l9_346=l9_327.x;
float l9_347=l9_327.z;
bool l9_348=l9_344;
float l9_349=l9_332;
float l9_350=fast::clamp(l9_345,l9_346,l9_347);
float l9_351=step(abs(l9_345-l9_350),9.9999997e-06);
l9_349*=(l9_351+((1.0-float(l9_348))*(1.0-l9_351)));
l9_345=l9_350;
l9_322.x=l9_345;
l9_332=l9_349;
bool l9_352=l9_328;
bool l9_353;
if (l9_352)
{
l9_353=l9_325.y==3;
}
else
{
l9_353=l9_352;
}
float l9_354=l9_322.y;
float l9_355=l9_327.y;
float l9_356=l9_327.w;
bool l9_357=l9_353;
float l9_358=l9_332;
float l9_359=fast::clamp(l9_354,l9_355,l9_356);
float l9_360=step(abs(l9_354-l9_359),9.9999997e-06);
l9_358*=(l9_360+((1.0-float(l9_357))*(1.0-l9_360)));
l9_354=l9_359;
l9_322.y=l9_354;
l9_332=l9_358;
}
float2 l9_361=l9_322;
bool l9_362=l9_323;
float3x3 l9_363=l9_324;
if (l9_362)
{
l9_361=float2((l9_363*float3(l9_361,1.0)).xy);
}
float2 l9_364=l9_361;
l9_322=l9_364;
float l9_365=l9_322.x;
int l9_366=l9_325.x;
bool l9_367=l9_331;
float l9_368=l9_332;
if ((l9_366==0)||(l9_366==3))
{
float l9_369=l9_365;
float l9_370=0.0;
float l9_371=1.0;
bool l9_372=l9_367;
float l9_373=l9_368;
float l9_374=fast::clamp(l9_369,l9_370,l9_371);
float l9_375=step(abs(l9_369-l9_374),9.9999997e-06);
l9_373*=(l9_375+((1.0-float(l9_372))*(1.0-l9_375)));
l9_369=l9_374;
l9_365=l9_369;
l9_368=l9_373;
}
l9_322.x=l9_365;
l9_332=l9_368;
float l9_376=l9_322.y;
int l9_377=l9_325.y;
bool l9_378=l9_331;
float l9_379=l9_332;
if ((l9_377==0)||(l9_377==3))
{
float l9_380=l9_376;
float l9_381=0.0;
float l9_382=1.0;
bool l9_383=l9_378;
float l9_384=l9_379;
float l9_385=fast::clamp(l9_380,l9_381,l9_382);
float l9_386=step(abs(l9_380-l9_385),9.9999997e-06);
l9_384*=(l9_386+((1.0-float(l9_383))*(1.0-l9_386)));
l9_380=l9_385;
l9_376=l9_380;
l9_379=l9_384;
}
l9_322.y=l9_376;
l9_332=l9_379;
float2 l9_387=l9_322;
int l9_388=l9_320;
int l9_389=l9_321;
float l9_390=l9_330;
float2 l9_391=l9_387;
int l9_392=l9_388;
int l9_393=l9_389;
float3 l9_394=float3(0.0);
if (l9_392==0)
{
l9_394=float3(l9_391,0.0);
}
else
{
if (l9_392==1)
{
l9_394=float3(l9_391.x,(l9_391.y*0.5)+(0.5-(float(l9_393)*0.5)),0.0);
}
else
{
l9_394=float3(l9_391,float(l9_393));
}
}
float3 l9_395=l9_394;
float3 l9_396=l9_395;
float4 l9_397=sc_set0.albedoTex.sample(sc_set0.albedoTexSmpSC,l9_396.xy,bias(l9_390));
float4 l9_398=l9_397;
if (l9_328)
{
l9_398=mix(l9_329,l9_398,float4(l9_332));
}
float4 l9_399=l9_398;
l9_313=l9_399;
float4 l9_400=float4(0.0);
int l9_401;
if ((int(albedoSecondaryHasSwappedViews_tmp)!=0))
{
int l9_402=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_402=0;
}
else
{
l9_402=in.varStereoViewID;
}
int l9_403=l9_402;
l9_401=1-l9_403;
}
else
{
int l9_404=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_404=0;
}
else
{
l9_404=in.varStereoViewID;
}
int l9_405=l9_404;
l9_401=l9_405;
}
int l9_406=l9_401;
int l9_407=albedoSecondaryLayout_tmp;
int l9_408=l9_406;
float2 l9_409=l9_312;
bool l9_410=(int(SC_USE_UV_TRANSFORM_albedoSecondary_tmp)!=0);
float3x3 l9_411=(*sc_set0.UserUniforms).albedoSecondaryTransform;
int2 l9_412=int2(SC_SOFTWARE_WRAP_MODE_U_albedoSecondary_tmp,SC_SOFTWARE_WRAP_MODE_V_albedoSecondary_tmp);
bool l9_413=(int(SC_USE_UV_MIN_MAX_albedoSecondary_tmp)!=0);
float4 l9_414=(*sc_set0.UserUniforms).albedoSecondaryUvMinMax;
bool l9_415=(int(SC_USE_CLAMP_TO_BORDER_albedoSecondary_tmp)!=0);
float4 l9_416=(*sc_set0.UserUniforms).albedoSecondaryBorderColor;
float l9_417=0.0;
bool l9_418=l9_415&&(!l9_413);
float l9_419=1.0;
float l9_420=l9_409.x;
int l9_421=l9_412.x;
if (l9_421==1)
{
l9_420=fract(l9_420);
}
else
{
if (l9_421==2)
{
float l9_422=fract(l9_420);
float l9_423=l9_420-l9_422;
float l9_424=step(0.25,fract(l9_423*0.5));
l9_420=mix(l9_422,1.0-l9_422,fast::clamp(l9_424,0.0,1.0));
}
}
l9_409.x=l9_420;
float l9_425=l9_409.y;
int l9_426=l9_412.y;
if (l9_426==1)
{
l9_425=fract(l9_425);
}
else
{
if (l9_426==2)
{
float l9_427=fract(l9_425);
float l9_428=l9_425-l9_427;
float l9_429=step(0.25,fract(l9_428*0.5));
l9_425=mix(l9_427,1.0-l9_427,fast::clamp(l9_429,0.0,1.0));
}
}
l9_409.y=l9_425;
if (l9_413)
{
bool l9_430=l9_415;
bool l9_431;
if (l9_430)
{
l9_431=l9_412.x==3;
}
else
{
l9_431=l9_430;
}
float l9_432=l9_409.x;
float l9_433=l9_414.x;
float l9_434=l9_414.z;
bool l9_435=l9_431;
float l9_436=l9_419;
float l9_437=fast::clamp(l9_432,l9_433,l9_434);
float l9_438=step(abs(l9_432-l9_437),9.9999997e-06);
l9_436*=(l9_438+((1.0-float(l9_435))*(1.0-l9_438)));
l9_432=l9_437;
l9_409.x=l9_432;
l9_419=l9_436;
bool l9_439=l9_415;
bool l9_440;
if (l9_439)
{
l9_440=l9_412.y==3;
}
else
{
l9_440=l9_439;
}
float l9_441=l9_409.y;
float l9_442=l9_414.y;
float l9_443=l9_414.w;
bool l9_444=l9_440;
float l9_445=l9_419;
float l9_446=fast::clamp(l9_441,l9_442,l9_443);
float l9_447=step(abs(l9_441-l9_446),9.9999997e-06);
l9_445*=(l9_447+((1.0-float(l9_444))*(1.0-l9_447)));
l9_441=l9_446;
l9_409.y=l9_441;
l9_419=l9_445;
}
float2 l9_448=l9_409;
bool l9_449=l9_410;
float3x3 l9_450=l9_411;
if (l9_449)
{
l9_448=float2((l9_450*float3(l9_448,1.0)).xy);
}
float2 l9_451=l9_448;
l9_409=l9_451;
float l9_452=l9_409.x;
int l9_453=l9_412.x;
bool l9_454=l9_418;
float l9_455=l9_419;
if ((l9_453==0)||(l9_453==3))
{
float l9_456=l9_452;
float l9_457=0.0;
float l9_458=1.0;
bool l9_459=l9_454;
float l9_460=l9_455;
float l9_461=fast::clamp(l9_456,l9_457,l9_458);
float l9_462=step(abs(l9_456-l9_461),9.9999997e-06);
l9_460*=(l9_462+((1.0-float(l9_459))*(1.0-l9_462)));
l9_456=l9_461;
l9_452=l9_456;
l9_455=l9_460;
}
l9_409.x=l9_452;
l9_419=l9_455;
float l9_463=l9_409.y;
int l9_464=l9_412.y;
bool l9_465=l9_418;
float l9_466=l9_419;
if ((l9_464==0)||(l9_464==3))
{
float l9_467=l9_463;
float l9_468=0.0;
float l9_469=1.0;
bool l9_470=l9_465;
float l9_471=l9_466;
float l9_472=fast::clamp(l9_467,l9_468,l9_469);
float l9_473=step(abs(l9_467-l9_472),9.9999997e-06);
l9_471*=(l9_473+((1.0-float(l9_470))*(1.0-l9_473)));
l9_467=l9_472;
l9_463=l9_467;
l9_466=l9_471;
}
l9_409.y=l9_463;
l9_419=l9_466;
float2 l9_474=l9_409;
int l9_475=l9_407;
int l9_476=l9_408;
float l9_477=l9_417;
float2 l9_478=l9_474;
int l9_479=l9_475;
int l9_480=l9_476;
float3 l9_481=float3(0.0);
if (l9_479==0)
{
l9_481=float3(l9_478,0.0);
}
else
{
if (l9_479==1)
{
l9_481=float3(l9_478.x,(l9_478.y*0.5)+(0.5-(float(l9_480)*0.5)),0.0);
}
else
{
l9_481=float3(l9_478,float(l9_480));
}
}
float3 l9_482=l9_481;
float3 l9_483=l9_482;
float4 l9_484=sc_set0.albedoSecondary.sample(sc_set0.albedoSecondarySmpSC,l9_483.xy,bias(l9_477));
float4 l9_485=l9_484;
if (l9_415)
{
l9_485=mix(l9_416,l9_485,float4(l9_419));
}
float4 l9_486=l9_485;
l9_400=l9_486;
float l9_487=0.0;
float l9_488=(*sc_set0.UserUniforms).progress;
l9_487=l9_488;
float4 l9_489=float4(0.0);
l9_489=mix(l9_313,l9_400,float4(l9_487));
float4 l9_490=float4(0.0);
l9_490=l9_307*l9_489;
l9_303=l9_490;
l9_306=l9_303;
}
else
{
float4 l9_491=float4(0.0);
float4 l9_492=(*sc_set0.UserUniforms).baseColor;
l9_491=l9_492;
l9_304=l9_491;
l9_306=l9_304;
}
l9_302=l9_306;
l9_16=l9_302;
l9_18=l9_16;
}
l9_14=l9_18;
float4 l9_493=float4(0.0);
l9_493=l9_13+l9_14;
param_1=l9_493;
param_3=param_1;
}
else
{
float4 l9_494=float4(0.0);
float4 l9_495=float4(1.0);
float4 l9_496=float4(0.0);
ssGlobals l9_497=param_4;
float4 l9_498;
if ((int(enableAO_tmp)!=0))
{
float4 l9_499=float4(0.0);
float4 l9_500=float4(1.0);
float4 l9_501=float4(0.0);
ssGlobals l9_502=l9_497;
float4 l9_503;
if ((int(enableAlbedo_tmp)!=0))
{
float4 l9_504=float4(0.0);
float4 l9_505=(*sc_set0.UserUniforms).baseColor;
l9_504=l9_505;
float2 l9_506=float2(0.0);
l9_506=l9_502.Surface_UVCoord0;
float l9_507=0.0;
float l9_508=(*sc_set0.UserUniforms).uvScale;
l9_507=l9_508;
float2 l9_509=float2(0.0);
l9_509=((l9_506-(*sc_set0.UserUniforms).Port_Center_N031)*float2(l9_507))+(*sc_set0.UserUniforms).Port_Center_N031;
float4 l9_510=float4(0.0);
int l9_511;
if ((int(albedoTexHasSwappedViews_tmp)!=0))
{
int l9_512=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_512=0;
}
else
{
l9_512=in.varStereoViewID;
}
int l9_513=l9_512;
l9_511=1-l9_513;
}
else
{
int l9_514=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_514=0;
}
else
{
l9_514=in.varStereoViewID;
}
int l9_515=l9_514;
l9_511=l9_515;
}
int l9_516=l9_511;
int l9_517=albedoTexLayout_tmp;
int l9_518=l9_516;
float2 l9_519=l9_509;
bool l9_520=(int(SC_USE_UV_TRANSFORM_albedoTex_tmp)!=0);
float3x3 l9_521=(*sc_set0.UserUniforms).albedoTexTransform;
int2 l9_522=int2(SC_SOFTWARE_WRAP_MODE_U_albedoTex_tmp,SC_SOFTWARE_WRAP_MODE_V_albedoTex_tmp);
bool l9_523=(int(SC_USE_UV_MIN_MAX_albedoTex_tmp)!=0);
float4 l9_524=(*sc_set0.UserUniforms).albedoTexUvMinMax;
bool l9_525=(int(SC_USE_CLAMP_TO_BORDER_albedoTex_tmp)!=0);
float4 l9_526=(*sc_set0.UserUniforms).albedoTexBorderColor;
float l9_527=0.0;
bool l9_528=l9_525&&(!l9_523);
float l9_529=1.0;
float l9_530=l9_519.x;
int l9_531=l9_522.x;
if (l9_531==1)
{
l9_530=fract(l9_530);
}
else
{
if (l9_531==2)
{
float l9_532=fract(l9_530);
float l9_533=l9_530-l9_532;
float l9_534=step(0.25,fract(l9_533*0.5));
l9_530=mix(l9_532,1.0-l9_532,fast::clamp(l9_534,0.0,1.0));
}
}
l9_519.x=l9_530;
float l9_535=l9_519.y;
int l9_536=l9_522.y;
if (l9_536==1)
{
l9_535=fract(l9_535);
}
else
{
if (l9_536==2)
{
float l9_537=fract(l9_535);
float l9_538=l9_535-l9_537;
float l9_539=step(0.25,fract(l9_538*0.5));
l9_535=mix(l9_537,1.0-l9_537,fast::clamp(l9_539,0.0,1.0));
}
}
l9_519.y=l9_535;
if (l9_523)
{
bool l9_540=l9_525;
bool l9_541;
if (l9_540)
{
l9_541=l9_522.x==3;
}
else
{
l9_541=l9_540;
}
float l9_542=l9_519.x;
float l9_543=l9_524.x;
float l9_544=l9_524.z;
bool l9_545=l9_541;
float l9_546=l9_529;
float l9_547=fast::clamp(l9_542,l9_543,l9_544);
float l9_548=step(abs(l9_542-l9_547),9.9999997e-06);
l9_546*=(l9_548+((1.0-float(l9_545))*(1.0-l9_548)));
l9_542=l9_547;
l9_519.x=l9_542;
l9_529=l9_546;
bool l9_549=l9_525;
bool l9_550;
if (l9_549)
{
l9_550=l9_522.y==3;
}
else
{
l9_550=l9_549;
}
float l9_551=l9_519.y;
float l9_552=l9_524.y;
float l9_553=l9_524.w;
bool l9_554=l9_550;
float l9_555=l9_529;
float l9_556=fast::clamp(l9_551,l9_552,l9_553);
float l9_557=step(abs(l9_551-l9_556),9.9999997e-06);
l9_555*=(l9_557+((1.0-float(l9_554))*(1.0-l9_557)));
l9_551=l9_556;
l9_519.y=l9_551;
l9_529=l9_555;
}
float2 l9_558=l9_519;
bool l9_559=l9_520;
float3x3 l9_560=l9_521;
if (l9_559)
{
l9_558=float2((l9_560*float3(l9_558,1.0)).xy);
}
float2 l9_561=l9_558;
l9_519=l9_561;
float l9_562=l9_519.x;
int l9_563=l9_522.x;
bool l9_564=l9_528;
float l9_565=l9_529;
if ((l9_563==0)||(l9_563==3))
{
float l9_566=l9_562;
float l9_567=0.0;
float l9_568=1.0;
bool l9_569=l9_564;
float l9_570=l9_565;
float l9_571=fast::clamp(l9_566,l9_567,l9_568);
float l9_572=step(abs(l9_566-l9_571),9.9999997e-06);
l9_570*=(l9_572+((1.0-float(l9_569))*(1.0-l9_572)));
l9_566=l9_571;
l9_562=l9_566;
l9_565=l9_570;
}
l9_519.x=l9_562;
l9_529=l9_565;
float l9_573=l9_519.y;
int l9_574=l9_522.y;
bool l9_575=l9_528;
float l9_576=l9_529;
if ((l9_574==0)||(l9_574==3))
{
float l9_577=l9_573;
float l9_578=0.0;
float l9_579=1.0;
bool l9_580=l9_575;
float l9_581=l9_576;
float l9_582=fast::clamp(l9_577,l9_578,l9_579);
float l9_583=step(abs(l9_577-l9_582),9.9999997e-06);
l9_581*=(l9_583+((1.0-float(l9_580))*(1.0-l9_583)));
l9_577=l9_582;
l9_573=l9_577;
l9_576=l9_581;
}
l9_519.y=l9_573;
l9_529=l9_576;
float2 l9_584=l9_519;
int l9_585=l9_517;
int l9_586=l9_518;
float l9_587=l9_527;
float2 l9_588=l9_584;
int l9_589=l9_585;
int l9_590=l9_586;
float3 l9_591=float3(0.0);
if (l9_589==0)
{
l9_591=float3(l9_588,0.0);
}
else
{
if (l9_589==1)
{
l9_591=float3(l9_588.x,(l9_588.y*0.5)+(0.5-(float(l9_590)*0.5)),0.0);
}
else
{
l9_591=float3(l9_588,float(l9_590));
}
}
float3 l9_592=l9_591;
float3 l9_593=l9_592;
float4 l9_594=sc_set0.albedoTex.sample(sc_set0.albedoTexSmpSC,l9_593.xy,bias(l9_587));
float4 l9_595=l9_594;
if (l9_525)
{
l9_595=mix(l9_526,l9_595,float4(l9_529));
}
float4 l9_596=l9_595;
l9_510=l9_596;
float4 l9_597=float4(0.0);
int l9_598;
if ((int(albedoSecondaryHasSwappedViews_tmp)!=0))
{
int l9_599=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_599=0;
}
else
{
l9_599=in.varStereoViewID;
}
int l9_600=l9_599;
l9_598=1-l9_600;
}
else
{
int l9_601=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_601=0;
}
else
{
l9_601=in.varStereoViewID;
}
int l9_602=l9_601;
l9_598=l9_602;
}
int l9_603=l9_598;
int l9_604=albedoSecondaryLayout_tmp;
int l9_605=l9_603;
float2 l9_606=l9_509;
bool l9_607=(int(SC_USE_UV_TRANSFORM_albedoSecondary_tmp)!=0);
float3x3 l9_608=(*sc_set0.UserUniforms).albedoSecondaryTransform;
int2 l9_609=int2(SC_SOFTWARE_WRAP_MODE_U_albedoSecondary_tmp,SC_SOFTWARE_WRAP_MODE_V_albedoSecondary_tmp);
bool l9_610=(int(SC_USE_UV_MIN_MAX_albedoSecondary_tmp)!=0);
float4 l9_611=(*sc_set0.UserUniforms).albedoSecondaryUvMinMax;
bool l9_612=(int(SC_USE_CLAMP_TO_BORDER_albedoSecondary_tmp)!=0);
float4 l9_613=(*sc_set0.UserUniforms).albedoSecondaryBorderColor;
float l9_614=0.0;
bool l9_615=l9_612&&(!l9_610);
float l9_616=1.0;
float l9_617=l9_606.x;
int l9_618=l9_609.x;
if (l9_618==1)
{
l9_617=fract(l9_617);
}
else
{
if (l9_618==2)
{
float l9_619=fract(l9_617);
float l9_620=l9_617-l9_619;
float l9_621=step(0.25,fract(l9_620*0.5));
l9_617=mix(l9_619,1.0-l9_619,fast::clamp(l9_621,0.0,1.0));
}
}
l9_606.x=l9_617;
float l9_622=l9_606.y;
int l9_623=l9_609.y;
if (l9_623==1)
{
l9_622=fract(l9_622);
}
else
{
if (l9_623==2)
{
float l9_624=fract(l9_622);
float l9_625=l9_622-l9_624;
float l9_626=step(0.25,fract(l9_625*0.5));
l9_622=mix(l9_624,1.0-l9_624,fast::clamp(l9_626,0.0,1.0));
}
}
l9_606.y=l9_622;
if (l9_610)
{
bool l9_627=l9_612;
bool l9_628;
if (l9_627)
{
l9_628=l9_609.x==3;
}
else
{
l9_628=l9_627;
}
float l9_629=l9_606.x;
float l9_630=l9_611.x;
float l9_631=l9_611.z;
bool l9_632=l9_628;
float l9_633=l9_616;
float l9_634=fast::clamp(l9_629,l9_630,l9_631);
float l9_635=step(abs(l9_629-l9_634),9.9999997e-06);
l9_633*=(l9_635+((1.0-float(l9_632))*(1.0-l9_635)));
l9_629=l9_634;
l9_606.x=l9_629;
l9_616=l9_633;
bool l9_636=l9_612;
bool l9_637;
if (l9_636)
{
l9_637=l9_609.y==3;
}
else
{
l9_637=l9_636;
}
float l9_638=l9_606.y;
float l9_639=l9_611.y;
float l9_640=l9_611.w;
bool l9_641=l9_637;
float l9_642=l9_616;
float l9_643=fast::clamp(l9_638,l9_639,l9_640);
float l9_644=step(abs(l9_638-l9_643),9.9999997e-06);
l9_642*=(l9_644+((1.0-float(l9_641))*(1.0-l9_644)));
l9_638=l9_643;
l9_606.y=l9_638;
l9_616=l9_642;
}
float2 l9_645=l9_606;
bool l9_646=l9_607;
float3x3 l9_647=l9_608;
if (l9_646)
{
l9_645=float2((l9_647*float3(l9_645,1.0)).xy);
}
float2 l9_648=l9_645;
l9_606=l9_648;
float l9_649=l9_606.x;
int l9_650=l9_609.x;
bool l9_651=l9_615;
float l9_652=l9_616;
if ((l9_650==0)||(l9_650==3))
{
float l9_653=l9_649;
float l9_654=0.0;
float l9_655=1.0;
bool l9_656=l9_651;
float l9_657=l9_652;
float l9_658=fast::clamp(l9_653,l9_654,l9_655);
float l9_659=step(abs(l9_653-l9_658),9.9999997e-06);
l9_657*=(l9_659+((1.0-float(l9_656))*(1.0-l9_659)));
l9_653=l9_658;
l9_649=l9_653;
l9_652=l9_657;
}
l9_606.x=l9_649;
l9_616=l9_652;
float l9_660=l9_606.y;
int l9_661=l9_609.y;
bool l9_662=l9_615;
float l9_663=l9_616;
if ((l9_661==0)||(l9_661==3))
{
float l9_664=l9_660;
float l9_665=0.0;
float l9_666=1.0;
bool l9_667=l9_662;
float l9_668=l9_663;
float l9_669=fast::clamp(l9_664,l9_665,l9_666);
float l9_670=step(abs(l9_664-l9_669),9.9999997e-06);
l9_668*=(l9_670+((1.0-float(l9_667))*(1.0-l9_670)));
l9_664=l9_669;
l9_660=l9_664;
l9_663=l9_668;
}
l9_606.y=l9_660;
l9_616=l9_663;
float2 l9_671=l9_606;
int l9_672=l9_604;
int l9_673=l9_605;
float l9_674=l9_614;
float2 l9_675=l9_671;
int l9_676=l9_672;
int l9_677=l9_673;
float3 l9_678=float3(0.0);
if (l9_676==0)
{
l9_678=float3(l9_675,0.0);
}
else
{
if (l9_676==1)
{
l9_678=float3(l9_675.x,(l9_675.y*0.5)+(0.5-(float(l9_677)*0.5)),0.0);
}
else
{
l9_678=float3(l9_675,float(l9_677));
}
}
float3 l9_679=l9_678;
float3 l9_680=l9_679;
float4 l9_681=sc_set0.albedoSecondary.sample(sc_set0.albedoSecondarySmpSC,l9_680.xy,bias(l9_674));
float4 l9_682=l9_681;
if (l9_612)
{
l9_682=mix(l9_613,l9_682,float4(l9_616));
}
float4 l9_683=l9_682;
l9_597=l9_683;
float l9_684=0.0;
float l9_685=(*sc_set0.UserUniforms).progress;
l9_684=l9_685;
float4 l9_686=float4(0.0);
l9_686=mix(l9_510,l9_597,float4(l9_684));
float4 l9_687=float4(0.0);
l9_687=l9_504*l9_686;
l9_500=l9_687;
l9_503=l9_500;
}
else
{
float4 l9_688=float4(0.0);
float4 l9_689=(*sc_set0.UserUniforms).baseColor;
l9_688=l9_689;
l9_501=l9_688;
l9_503=l9_501;
}
l9_499=l9_503;
float2 l9_690=float2(0.0);
l9_690=l9_497.Surface_UVCoord0;
float4 l9_691=float4(0.0);
int l9_692;
if ((int(aoTexHasSwappedViews_tmp)!=0))
{
int l9_693=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_693=0;
}
else
{
l9_693=in.varStereoViewID;
}
int l9_694=l9_693;
l9_692=1-l9_694;
}
else
{
int l9_695=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_695=0;
}
else
{
l9_695=in.varStereoViewID;
}
int l9_696=l9_695;
l9_692=l9_696;
}
int l9_697=l9_692;
int l9_698=aoTexLayout_tmp;
int l9_699=l9_697;
float2 l9_700=l9_690;
bool l9_701=(int(SC_USE_UV_TRANSFORM_aoTex_tmp)!=0);
float3x3 l9_702=(*sc_set0.UserUniforms).aoTexTransform;
int2 l9_703=int2(SC_SOFTWARE_WRAP_MODE_U_aoTex_tmp,SC_SOFTWARE_WRAP_MODE_V_aoTex_tmp);
bool l9_704=(int(SC_USE_UV_MIN_MAX_aoTex_tmp)!=0);
float4 l9_705=(*sc_set0.UserUniforms).aoTexUvMinMax;
bool l9_706=(int(SC_USE_CLAMP_TO_BORDER_aoTex_tmp)!=0);
float4 l9_707=(*sc_set0.UserUniforms).aoTexBorderColor;
float l9_708=0.0;
bool l9_709=l9_706&&(!l9_704);
float l9_710=1.0;
float l9_711=l9_700.x;
int l9_712=l9_703.x;
if (l9_712==1)
{
l9_711=fract(l9_711);
}
else
{
if (l9_712==2)
{
float l9_713=fract(l9_711);
float l9_714=l9_711-l9_713;
float l9_715=step(0.25,fract(l9_714*0.5));
l9_711=mix(l9_713,1.0-l9_713,fast::clamp(l9_715,0.0,1.0));
}
}
l9_700.x=l9_711;
float l9_716=l9_700.y;
int l9_717=l9_703.y;
if (l9_717==1)
{
l9_716=fract(l9_716);
}
else
{
if (l9_717==2)
{
float l9_718=fract(l9_716);
float l9_719=l9_716-l9_718;
float l9_720=step(0.25,fract(l9_719*0.5));
l9_716=mix(l9_718,1.0-l9_718,fast::clamp(l9_720,0.0,1.0));
}
}
l9_700.y=l9_716;
if (l9_704)
{
bool l9_721=l9_706;
bool l9_722;
if (l9_721)
{
l9_722=l9_703.x==3;
}
else
{
l9_722=l9_721;
}
float l9_723=l9_700.x;
float l9_724=l9_705.x;
float l9_725=l9_705.z;
bool l9_726=l9_722;
float l9_727=l9_710;
float l9_728=fast::clamp(l9_723,l9_724,l9_725);
float l9_729=step(abs(l9_723-l9_728),9.9999997e-06);
l9_727*=(l9_729+((1.0-float(l9_726))*(1.0-l9_729)));
l9_723=l9_728;
l9_700.x=l9_723;
l9_710=l9_727;
bool l9_730=l9_706;
bool l9_731;
if (l9_730)
{
l9_731=l9_703.y==3;
}
else
{
l9_731=l9_730;
}
float l9_732=l9_700.y;
float l9_733=l9_705.y;
float l9_734=l9_705.w;
bool l9_735=l9_731;
float l9_736=l9_710;
float l9_737=fast::clamp(l9_732,l9_733,l9_734);
float l9_738=step(abs(l9_732-l9_737),9.9999997e-06);
l9_736*=(l9_738+((1.0-float(l9_735))*(1.0-l9_738)));
l9_732=l9_737;
l9_700.y=l9_732;
l9_710=l9_736;
}
float2 l9_739=l9_700;
bool l9_740=l9_701;
float3x3 l9_741=l9_702;
if (l9_740)
{
l9_739=float2((l9_741*float3(l9_739,1.0)).xy);
}
float2 l9_742=l9_739;
l9_700=l9_742;
float l9_743=l9_700.x;
int l9_744=l9_703.x;
bool l9_745=l9_709;
float l9_746=l9_710;
if ((l9_744==0)||(l9_744==3))
{
float l9_747=l9_743;
float l9_748=0.0;
float l9_749=1.0;
bool l9_750=l9_745;
float l9_751=l9_746;
float l9_752=fast::clamp(l9_747,l9_748,l9_749);
float l9_753=step(abs(l9_747-l9_752),9.9999997e-06);
l9_751*=(l9_753+((1.0-float(l9_750))*(1.0-l9_753)));
l9_747=l9_752;
l9_743=l9_747;
l9_746=l9_751;
}
l9_700.x=l9_743;
l9_710=l9_746;
float l9_754=l9_700.y;
int l9_755=l9_703.y;
bool l9_756=l9_709;
float l9_757=l9_710;
if ((l9_755==0)||(l9_755==3))
{
float l9_758=l9_754;
float l9_759=0.0;
float l9_760=1.0;
bool l9_761=l9_756;
float l9_762=l9_757;
float l9_763=fast::clamp(l9_758,l9_759,l9_760);
float l9_764=step(abs(l9_758-l9_763),9.9999997e-06);
l9_762*=(l9_764+((1.0-float(l9_761))*(1.0-l9_764)));
l9_758=l9_763;
l9_754=l9_758;
l9_757=l9_762;
}
l9_700.y=l9_754;
l9_710=l9_757;
float2 l9_765=l9_700;
int l9_766=l9_698;
int l9_767=l9_699;
float l9_768=l9_708;
float2 l9_769=l9_765;
int l9_770=l9_766;
int l9_771=l9_767;
float3 l9_772=float3(0.0);
if (l9_770==0)
{
l9_772=float3(l9_769,0.0);
}
else
{
if (l9_770==1)
{
l9_772=float3(l9_769.x,(l9_769.y*0.5)+(0.5-(float(l9_771)*0.5)),0.0);
}
else
{
l9_772=float3(l9_769,float(l9_771));
}
}
float3 l9_773=l9_772;
float3 l9_774=l9_773;
float4 l9_775=sc_set0.aoTex.sample(sc_set0.aoTexSmpSC,l9_774.xy,bias(l9_768));
float4 l9_776=l9_775;
if (l9_706)
{
l9_776=mix(l9_707,l9_776,float4(l9_710));
}
float4 l9_777=l9_776;
l9_691=l9_777;
float l9_778=0.0;
float l9_779=(*sc_set0.UserUniforms).aoScale;
l9_778=l9_779;
float4 l9_780=float4(0.0);
l9_780=l9_691+float4(l9_778);
float4 l9_781=float4(0.0);
l9_781=l9_499*l9_780;
l9_495=l9_781;
l9_498=l9_495;
}
else
{
float4 l9_782=float4(0.0);
float4 l9_783=float4(1.0);
float4 l9_784=float4(0.0);
ssGlobals l9_785=l9_497;
float4 l9_786;
if ((int(enableAlbedo_tmp)!=0))
{
float4 l9_787=float4(0.0);
float4 l9_788=(*sc_set0.UserUniforms).baseColor;
l9_787=l9_788;
float2 l9_789=float2(0.0);
l9_789=l9_785.Surface_UVCoord0;
float l9_790=0.0;
float l9_791=(*sc_set0.UserUniforms).uvScale;
l9_790=l9_791;
float2 l9_792=float2(0.0);
l9_792=((l9_789-(*sc_set0.UserUniforms).Port_Center_N031)*float2(l9_790))+(*sc_set0.UserUniforms).Port_Center_N031;
float4 l9_793=float4(0.0);
int l9_794;
if ((int(albedoTexHasSwappedViews_tmp)!=0))
{
int l9_795=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_795=0;
}
else
{
l9_795=in.varStereoViewID;
}
int l9_796=l9_795;
l9_794=1-l9_796;
}
else
{
int l9_797=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_797=0;
}
else
{
l9_797=in.varStereoViewID;
}
int l9_798=l9_797;
l9_794=l9_798;
}
int l9_799=l9_794;
int l9_800=albedoTexLayout_tmp;
int l9_801=l9_799;
float2 l9_802=l9_792;
bool l9_803=(int(SC_USE_UV_TRANSFORM_albedoTex_tmp)!=0);
float3x3 l9_804=(*sc_set0.UserUniforms).albedoTexTransform;
int2 l9_805=int2(SC_SOFTWARE_WRAP_MODE_U_albedoTex_tmp,SC_SOFTWARE_WRAP_MODE_V_albedoTex_tmp);
bool l9_806=(int(SC_USE_UV_MIN_MAX_albedoTex_tmp)!=0);
float4 l9_807=(*sc_set0.UserUniforms).albedoTexUvMinMax;
bool l9_808=(int(SC_USE_CLAMP_TO_BORDER_albedoTex_tmp)!=0);
float4 l9_809=(*sc_set0.UserUniforms).albedoTexBorderColor;
float l9_810=0.0;
bool l9_811=l9_808&&(!l9_806);
float l9_812=1.0;
float l9_813=l9_802.x;
int l9_814=l9_805.x;
if (l9_814==1)
{
l9_813=fract(l9_813);
}
else
{
if (l9_814==2)
{
float l9_815=fract(l9_813);
float l9_816=l9_813-l9_815;
float l9_817=step(0.25,fract(l9_816*0.5));
l9_813=mix(l9_815,1.0-l9_815,fast::clamp(l9_817,0.0,1.0));
}
}
l9_802.x=l9_813;
float l9_818=l9_802.y;
int l9_819=l9_805.y;
if (l9_819==1)
{
l9_818=fract(l9_818);
}
else
{
if (l9_819==2)
{
float l9_820=fract(l9_818);
float l9_821=l9_818-l9_820;
float l9_822=step(0.25,fract(l9_821*0.5));
l9_818=mix(l9_820,1.0-l9_820,fast::clamp(l9_822,0.0,1.0));
}
}
l9_802.y=l9_818;
if (l9_806)
{
bool l9_823=l9_808;
bool l9_824;
if (l9_823)
{
l9_824=l9_805.x==3;
}
else
{
l9_824=l9_823;
}
float l9_825=l9_802.x;
float l9_826=l9_807.x;
float l9_827=l9_807.z;
bool l9_828=l9_824;
float l9_829=l9_812;
float l9_830=fast::clamp(l9_825,l9_826,l9_827);
float l9_831=step(abs(l9_825-l9_830),9.9999997e-06);
l9_829*=(l9_831+((1.0-float(l9_828))*(1.0-l9_831)));
l9_825=l9_830;
l9_802.x=l9_825;
l9_812=l9_829;
bool l9_832=l9_808;
bool l9_833;
if (l9_832)
{
l9_833=l9_805.y==3;
}
else
{
l9_833=l9_832;
}
float l9_834=l9_802.y;
float l9_835=l9_807.y;
float l9_836=l9_807.w;
bool l9_837=l9_833;
float l9_838=l9_812;
float l9_839=fast::clamp(l9_834,l9_835,l9_836);
float l9_840=step(abs(l9_834-l9_839),9.9999997e-06);
l9_838*=(l9_840+((1.0-float(l9_837))*(1.0-l9_840)));
l9_834=l9_839;
l9_802.y=l9_834;
l9_812=l9_838;
}
float2 l9_841=l9_802;
bool l9_842=l9_803;
float3x3 l9_843=l9_804;
if (l9_842)
{
l9_841=float2((l9_843*float3(l9_841,1.0)).xy);
}
float2 l9_844=l9_841;
l9_802=l9_844;
float l9_845=l9_802.x;
int l9_846=l9_805.x;
bool l9_847=l9_811;
float l9_848=l9_812;
if ((l9_846==0)||(l9_846==3))
{
float l9_849=l9_845;
float l9_850=0.0;
float l9_851=1.0;
bool l9_852=l9_847;
float l9_853=l9_848;
float l9_854=fast::clamp(l9_849,l9_850,l9_851);
float l9_855=step(abs(l9_849-l9_854),9.9999997e-06);
l9_853*=(l9_855+((1.0-float(l9_852))*(1.0-l9_855)));
l9_849=l9_854;
l9_845=l9_849;
l9_848=l9_853;
}
l9_802.x=l9_845;
l9_812=l9_848;
float l9_856=l9_802.y;
int l9_857=l9_805.y;
bool l9_858=l9_811;
float l9_859=l9_812;
if ((l9_857==0)||(l9_857==3))
{
float l9_860=l9_856;
float l9_861=0.0;
float l9_862=1.0;
bool l9_863=l9_858;
float l9_864=l9_859;
float l9_865=fast::clamp(l9_860,l9_861,l9_862);
float l9_866=step(abs(l9_860-l9_865),9.9999997e-06);
l9_864*=(l9_866+((1.0-float(l9_863))*(1.0-l9_866)));
l9_860=l9_865;
l9_856=l9_860;
l9_859=l9_864;
}
l9_802.y=l9_856;
l9_812=l9_859;
float2 l9_867=l9_802;
int l9_868=l9_800;
int l9_869=l9_801;
float l9_870=l9_810;
float2 l9_871=l9_867;
int l9_872=l9_868;
int l9_873=l9_869;
float3 l9_874=float3(0.0);
if (l9_872==0)
{
l9_874=float3(l9_871,0.0);
}
else
{
if (l9_872==1)
{
l9_874=float3(l9_871.x,(l9_871.y*0.5)+(0.5-(float(l9_873)*0.5)),0.0);
}
else
{
l9_874=float3(l9_871,float(l9_873));
}
}
float3 l9_875=l9_874;
float3 l9_876=l9_875;
float4 l9_877=sc_set0.albedoTex.sample(sc_set0.albedoTexSmpSC,l9_876.xy,bias(l9_870));
float4 l9_878=l9_877;
if (l9_808)
{
l9_878=mix(l9_809,l9_878,float4(l9_812));
}
float4 l9_879=l9_878;
l9_793=l9_879;
float4 l9_880=float4(0.0);
int l9_881;
if ((int(albedoSecondaryHasSwappedViews_tmp)!=0))
{
int l9_882=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_882=0;
}
else
{
l9_882=in.varStereoViewID;
}
int l9_883=l9_882;
l9_881=1-l9_883;
}
else
{
int l9_884=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_884=0;
}
else
{
l9_884=in.varStereoViewID;
}
int l9_885=l9_884;
l9_881=l9_885;
}
int l9_886=l9_881;
int l9_887=albedoSecondaryLayout_tmp;
int l9_888=l9_886;
float2 l9_889=l9_792;
bool l9_890=(int(SC_USE_UV_TRANSFORM_albedoSecondary_tmp)!=0);
float3x3 l9_891=(*sc_set0.UserUniforms).albedoSecondaryTransform;
int2 l9_892=int2(SC_SOFTWARE_WRAP_MODE_U_albedoSecondary_tmp,SC_SOFTWARE_WRAP_MODE_V_albedoSecondary_tmp);
bool l9_893=(int(SC_USE_UV_MIN_MAX_albedoSecondary_tmp)!=0);
float4 l9_894=(*sc_set0.UserUniforms).albedoSecondaryUvMinMax;
bool l9_895=(int(SC_USE_CLAMP_TO_BORDER_albedoSecondary_tmp)!=0);
float4 l9_896=(*sc_set0.UserUniforms).albedoSecondaryBorderColor;
float l9_897=0.0;
bool l9_898=l9_895&&(!l9_893);
float l9_899=1.0;
float l9_900=l9_889.x;
int l9_901=l9_892.x;
if (l9_901==1)
{
l9_900=fract(l9_900);
}
else
{
if (l9_901==2)
{
float l9_902=fract(l9_900);
float l9_903=l9_900-l9_902;
float l9_904=step(0.25,fract(l9_903*0.5));
l9_900=mix(l9_902,1.0-l9_902,fast::clamp(l9_904,0.0,1.0));
}
}
l9_889.x=l9_900;
float l9_905=l9_889.y;
int l9_906=l9_892.y;
if (l9_906==1)
{
l9_905=fract(l9_905);
}
else
{
if (l9_906==2)
{
float l9_907=fract(l9_905);
float l9_908=l9_905-l9_907;
float l9_909=step(0.25,fract(l9_908*0.5));
l9_905=mix(l9_907,1.0-l9_907,fast::clamp(l9_909,0.0,1.0));
}
}
l9_889.y=l9_905;
if (l9_893)
{
bool l9_910=l9_895;
bool l9_911;
if (l9_910)
{
l9_911=l9_892.x==3;
}
else
{
l9_911=l9_910;
}
float l9_912=l9_889.x;
float l9_913=l9_894.x;
float l9_914=l9_894.z;
bool l9_915=l9_911;
float l9_916=l9_899;
float l9_917=fast::clamp(l9_912,l9_913,l9_914);
float l9_918=step(abs(l9_912-l9_917),9.9999997e-06);
l9_916*=(l9_918+((1.0-float(l9_915))*(1.0-l9_918)));
l9_912=l9_917;
l9_889.x=l9_912;
l9_899=l9_916;
bool l9_919=l9_895;
bool l9_920;
if (l9_919)
{
l9_920=l9_892.y==3;
}
else
{
l9_920=l9_919;
}
float l9_921=l9_889.y;
float l9_922=l9_894.y;
float l9_923=l9_894.w;
bool l9_924=l9_920;
float l9_925=l9_899;
float l9_926=fast::clamp(l9_921,l9_922,l9_923);
float l9_927=step(abs(l9_921-l9_926),9.9999997e-06);
l9_925*=(l9_927+((1.0-float(l9_924))*(1.0-l9_927)));
l9_921=l9_926;
l9_889.y=l9_921;
l9_899=l9_925;
}
float2 l9_928=l9_889;
bool l9_929=l9_890;
float3x3 l9_930=l9_891;
if (l9_929)
{
l9_928=float2((l9_930*float3(l9_928,1.0)).xy);
}
float2 l9_931=l9_928;
l9_889=l9_931;
float l9_932=l9_889.x;
int l9_933=l9_892.x;
bool l9_934=l9_898;
float l9_935=l9_899;
if ((l9_933==0)||(l9_933==3))
{
float l9_936=l9_932;
float l9_937=0.0;
float l9_938=1.0;
bool l9_939=l9_934;
float l9_940=l9_935;
float l9_941=fast::clamp(l9_936,l9_937,l9_938);
float l9_942=step(abs(l9_936-l9_941),9.9999997e-06);
l9_940*=(l9_942+((1.0-float(l9_939))*(1.0-l9_942)));
l9_936=l9_941;
l9_932=l9_936;
l9_935=l9_940;
}
l9_889.x=l9_932;
l9_899=l9_935;
float l9_943=l9_889.y;
int l9_944=l9_892.y;
bool l9_945=l9_898;
float l9_946=l9_899;
if ((l9_944==0)||(l9_944==3))
{
float l9_947=l9_943;
float l9_948=0.0;
float l9_949=1.0;
bool l9_950=l9_945;
float l9_951=l9_946;
float l9_952=fast::clamp(l9_947,l9_948,l9_949);
float l9_953=step(abs(l9_947-l9_952),9.9999997e-06);
l9_951*=(l9_953+((1.0-float(l9_950))*(1.0-l9_953)));
l9_947=l9_952;
l9_943=l9_947;
l9_946=l9_951;
}
l9_889.y=l9_943;
l9_899=l9_946;
float2 l9_954=l9_889;
int l9_955=l9_887;
int l9_956=l9_888;
float l9_957=l9_897;
float2 l9_958=l9_954;
int l9_959=l9_955;
int l9_960=l9_956;
float3 l9_961=float3(0.0);
if (l9_959==0)
{
l9_961=float3(l9_958,0.0);
}
else
{
if (l9_959==1)
{
l9_961=float3(l9_958.x,(l9_958.y*0.5)+(0.5-(float(l9_960)*0.5)),0.0);
}
else
{
l9_961=float3(l9_958,float(l9_960));
}
}
float3 l9_962=l9_961;
float3 l9_963=l9_962;
float4 l9_964=sc_set0.albedoSecondary.sample(sc_set0.albedoSecondarySmpSC,l9_963.xy,bias(l9_957));
float4 l9_965=l9_964;
if (l9_895)
{
l9_965=mix(l9_896,l9_965,float4(l9_899));
}
float4 l9_966=l9_965;
l9_880=l9_966;
float l9_967=0.0;
float l9_968=(*sc_set0.UserUniforms).progress;
l9_967=l9_968;
float4 l9_969=float4(0.0);
l9_969=mix(l9_793,l9_880,float4(l9_967));
float4 l9_970=float4(0.0);
l9_970=l9_787*l9_969;
l9_783=l9_970;
l9_786=l9_783;
}
else
{
float4 l9_971=float4(0.0);
float4 l9_972=(*sc_set0.UserUniforms).baseColor;
l9_971=l9_972;
l9_784=l9_971;
l9_786=l9_784;
}
l9_782=l9_786;
l9_496=l9_782;
l9_498=l9_496;
}
l9_494=l9_498;
param_2=l9_494;
param_3=param_2;
}
Output_N8=param_3;
float4 Output_N19=float4(0.0);
float4 param_5=float4(1.0);
float4 param_6=(*sc_set0.UserUniforms).Port_Input2_N019;
ssGlobals param_8=Globals;
float4 param_7;
if ((int(enableNormals_tmp)!=0))
{
float2 l9_973=float2(0.0);
l9_973=param_8.Surface_UVCoord0;
float l9_974=0.0;
float l9_975=(*sc_set0.UserUniforms).uvScale;
l9_974=l9_975;
float2 l9_976=float2(0.0);
l9_976=((l9_973-(*sc_set0.UserUniforms).Port_Center_N031)*float2(l9_974))+(*sc_set0.UserUniforms).Port_Center_N031;
float4 l9_977=float4(0.0);
float2 l9_978=l9_976;
int l9_979;
if ((int(normalTexHasSwappedViews_tmp)!=0))
{
int l9_980=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_980=0;
}
else
{
l9_980=in.varStereoViewID;
}
int l9_981=l9_980;
l9_979=1-l9_981;
}
else
{
int l9_982=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_982=0;
}
else
{
l9_982=in.varStereoViewID;
}
int l9_983=l9_982;
l9_979=l9_983;
}
int l9_984=l9_979;
int l9_985=normalTexLayout_tmp;
int l9_986=l9_984;
float2 l9_987=l9_978;
bool l9_988=(int(SC_USE_UV_TRANSFORM_normalTex_tmp)!=0);
float3x3 l9_989=(*sc_set0.UserUniforms).normalTexTransform;
int2 l9_990=int2(SC_SOFTWARE_WRAP_MODE_U_normalTex_tmp,SC_SOFTWARE_WRAP_MODE_V_normalTex_tmp);
bool l9_991=(int(SC_USE_UV_MIN_MAX_normalTex_tmp)!=0);
float4 l9_992=(*sc_set0.UserUniforms).normalTexUvMinMax;
bool l9_993=(int(SC_USE_CLAMP_TO_BORDER_normalTex_tmp)!=0);
float4 l9_994=(*sc_set0.UserUniforms).normalTexBorderColor;
float l9_995=0.0;
bool l9_996=l9_993&&(!l9_991);
float l9_997=1.0;
float l9_998=l9_987.x;
int l9_999=l9_990.x;
if (l9_999==1)
{
l9_998=fract(l9_998);
}
else
{
if (l9_999==2)
{
float l9_1000=fract(l9_998);
float l9_1001=l9_998-l9_1000;
float l9_1002=step(0.25,fract(l9_1001*0.5));
l9_998=mix(l9_1000,1.0-l9_1000,fast::clamp(l9_1002,0.0,1.0));
}
}
l9_987.x=l9_998;
float l9_1003=l9_987.y;
int l9_1004=l9_990.y;
if (l9_1004==1)
{
l9_1003=fract(l9_1003);
}
else
{
if (l9_1004==2)
{
float l9_1005=fract(l9_1003);
float l9_1006=l9_1003-l9_1005;
float l9_1007=step(0.25,fract(l9_1006*0.5));
l9_1003=mix(l9_1005,1.0-l9_1005,fast::clamp(l9_1007,0.0,1.0));
}
}
l9_987.y=l9_1003;
if (l9_991)
{
bool l9_1008=l9_993;
bool l9_1009;
if (l9_1008)
{
l9_1009=l9_990.x==3;
}
else
{
l9_1009=l9_1008;
}
float l9_1010=l9_987.x;
float l9_1011=l9_992.x;
float l9_1012=l9_992.z;
bool l9_1013=l9_1009;
float l9_1014=l9_997;
float l9_1015=fast::clamp(l9_1010,l9_1011,l9_1012);
float l9_1016=step(abs(l9_1010-l9_1015),9.9999997e-06);
l9_1014*=(l9_1016+((1.0-float(l9_1013))*(1.0-l9_1016)));
l9_1010=l9_1015;
l9_987.x=l9_1010;
l9_997=l9_1014;
bool l9_1017=l9_993;
bool l9_1018;
if (l9_1017)
{
l9_1018=l9_990.y==3;
}
else
{
l9_1018=l9_1017;
}
float l9_1019=l9_987.y;
float l9_1020=l9_992.y;
float l9_1021=l9_992.w;
bool l9_1022=l9_1018;
float l9_1023=l9_997;
float l9_1024=fast::clamp(l9_1019,l9_1020,l9_1021);
float l9_1025=step(abs(l9_1019-l9_1024),9.9999997e-06);
l9_1023*=(l9_1025+((1.0-float(l9_1022))*(1.0-l9_1025)));
l9_1019=l9_1024;
l9_987.y=l9_1019;
l9_997=l9_1023;
}
float2 l9_1026=l9_987;
bool l9_1027=l9_988;
float3x3 l9_1028=l9_989;
if (l9_1027)
{
l9_1026=float2((l9_1028*float3(l9_1026,1.0)).xy);
}
float2 l9_1029=l9_1026;
l9_987=l9_1029;
float l9_1030=l9_987.x;
int l9_1031=l9_990.x;
bool l9_1032=l9_996;
float l9_1033=l9_997;
if ((l9_1031==0)||(l9_1031==3))
{
float l9_1034=l9_1030;
float l9_1035=0.0;
float l9_1036=1.0;
bool l9_1037=l9_1032;
float l9_1038=l9_1033;
float l9_1039=fast::clamp(l9_1034,l9_1035,l9_1036);
float l9_1040=step(abs(l9_1034-l9_1039),9.9999997e-06);
l9_1038*=(l9_1040+((1.0-float(l9_1037))*(1.0-l9_1040)));
l9_1034=l9_1039;
l9_1030=l9_1034;
l9_1033=l9_1038;
}
l9_987.x=l9_1030;
l9_997=l9_1033;
float l9_1041=l9_987.y;
int l9_1042=l9_990.y;
bool l9_1043=l9_996;
float l9_1044=l9_997;
if ((l9_1042==0)||(l9_1042==3))
{
float l9_1045=l9_1041;
float l9_1046=0.0;
float l9_1047=1.0;
bool l9_1048=l9_1043;
float l9_1049=l9_1044;
float l9_1050=fast::clamp(l9_1045,l9_1046,l9_1047);
float l9_1051=step(abs(l9_1045-l9_1050),9.9999997e-06);
l9_1049*=(l9_1051+((1.0-float(l9_1048))*(1.0-l9_1051)));
l9_1045=l9_1050;
l9_1041=l9_1045;
l9_1044=l9_1049;
}
l9_987.y=l9_1041;
l9_997=l9_1044;
float2 l9_1052=l9_987;
int l9_1053=l9_985;
int l9_1054=l9_986;
float l9_1055=l9_995;
float2 l9_1056=l9_1052;
int l9_1057=l9_1053;
int l9_1058=l9_1054;
float3 l9_1059=float3(0.0);
if (l9_1057==0)
{
l9_1059=float3(l9_1056,0.0);
}
else
{
if (l9_1057==1)
{
l9_1059=float3(l9_1056.x,(l9_1056.y*0.5)+(0.5-(float(l9_1058)*0.5)),0.0);
}
else
{
l9_1059=float3(l9_1056,float(l9_1058));
}
}
float3 l9_1060=l9_1059;
float3 l9_1061=l9_1060;
float4 l9_1062=sc_set0.normalTex.sample(sc_set0.normalTexSmpSC,l9_1061.xy,bias(l9_1055));
float4 l9_1063=l9_1062;
if (l9_993)
{
l9_1063=mix(l9_994,l9_1063,float4(l9_997));
}
float4 l9_1064=l9_1063;
float4 l9_1065=l9_1064;
float3 l9_1066=(l9_1065.xyz*1.9921875)-float3(1.0);
l9_1065=float4(l9_1066.x,l9_1066.y,l9_1066.z,l9_1065.w);
l9_977=l9_1065;
param_5=l9_977;
param_7=param_5;
}
else
{
param_7=param_6;
}
Output_N19=param_7;
float Output_N11=0.0;
float param_9=(*sc_set0.UserUniforms).metallic;
Output_N11=param_9;
float Output_N12=0.0;
float param_10=(*sc_set0.UserUniforms).roughness;
Output_N12=param_10;
float4 Output_N0=float4(0.0);
float3 param_11=Output_N8.xyz;
float param_12=(*sc_set0.UserUniforms).Port_Opacity_N000;
float3 param_13=Output_N19.xyz;
float3 param_14=(*sc_set0.UserUniforms).Port_Emissive_N000;
float param_15=Output_N11;
float param_16=Output_N12;
float3 param_17=(*sc_set0.UserUniforms).Port_AO_N000;
float3 param_18=(*sc_set0.UserUniforms).Port_SpecularAO_N000;
ssGlobals param_20=Globals;
if (!(int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
param_20.BumpedNormal=float3x3(float3(param_20.VertexTangent_WorldSpace),float3(param_20.VertexBinormal_WorldSpace),float3(param_20.VertexNormal_WorldSpace))*param_13;
}
float l9_1067=param_12;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (l9_1067<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_1068=gl_FragCoord;
float2 l9_1069=floor(mod(l9_1068.xy,float2(4.0)));
float l9_1070=(mod(dot(l9_1069,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (l9_1067<l9_1070)
{
discard_fragment();
}
}
param_11=fast::max(param_11,float3(0.0));
float4 param_19;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
param_19=float4(param_11,param_12);
}
else
{
param_15=fast::clamp(param_15,0.0,1.0);
param_16=fast::clamp(param_16,0.0,1.0);
float3 l9_1071=param_11;
float l9_1072=param_12;
float3 l9_1073=param_20.BumpedNormal;
float3 l9_1074=param_20.PositionWS;
float3 l9_1075=param_20.ViewDirWS;
float3 l9_1076=param_14;
float l9_1077=param_15;
float l9_1078=param_16;
float3 l9_1079=param_17;
float3 l9_1080=param_18;
param_19=ngsCalculateLighting(l9_1071,l9_1072,l9_1073,l9_1074,l9_1075,l9_1076,l9_1077,l9_1078,l9_1079,l9_1080,in.varStereoViewID,sc_set0.sc_EnvmapDiffuse,sc_set0.sc_EnvmapDiffuseSmpSC,sc_set0.sc_EnvmapSpecular,sc_set0.sc_EnvmapSpecularSmpSC,sc_set0.sc_ScreenTexture,sc_set0.sc_ScreenTextureSmpSC,sc_set0.sc_RayTracingReflections,sc_set0.sc_RayTracingReflectionsSmpSC,sc_set0.sc_RayTracingGlobalIllumination,sc_set0.sc_RayTracingGlobalIlluminationSmpSC,sc_set0.sc_RayTracingShadows,sc_set0.sc_RayTracingShadowsSmpSC,gl_FragCoord,(*sc_set0.UserUniforms),in.varShadowTex,sc_set0.sc_ShadowTexture,sc_set0.sc_ShadowTextureSmpSC,out.sc_FragData0,sc_set0.sc_SSAOTexture,sc_set0.sc_SSAOTextureSmpSC);
}
param_19=fast::max(param_19,float4(0.0));
Output_N0=param_19;
FinalColor=Output_N0;
if ((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.x!=0u)
{
float4 param_21=FinalColor;
if ((int(sc_RayTracingCasterForceOpaque_tmp)!=0))
{
param_21.w=1.0;
}
float4 l9_1081=fast::max(param_21,float4(0.0));
float4 param_22=l9_1081;
if (sc_ShaderCacheConstant_tmp!=0)
{
param_22.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=param_22;
return out;
}
float4 param_23=FinalColor;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
float4 l9_1082=param_23;
float4 l9_1083=l9_1082;
float l9_1084=1.0;
if ((((int(sc_BlendMode_Normal_tmp)!=0)||(int(sc_BlendMode_AlphaToCoverage_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaHardware_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_1084=l9_1083.w;
}
else
{
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
l9_1084=fast::clamp(l9_1083.w*2.0,0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_1084=fast::clamp(dot(l9_1083.xyz,float3(l9_1083.w)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
l9_1084=1.0;
}
else
{
if ((int(sc_BlendMode_Multiply_tmp)!=0))
{
l9_1084=(1.0-dot(l9_1083.xyz,float3(0.33333001)))*l9_1083.w;
}
else
{
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_1084=(1.0-fast::clamp(dot(l9_1083.xyz,float3(1.0)),0.0,1.0))*l9_1083.w;
}
else
{
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
l9_1084=fast::clamp(dot(l9_1083.xyz,float3(1.0)),0.0,1.0)*l9_1083.w;
}
else
{
if ((int(sc_BlendMode_Add_tmp)!=0))
{
l9_1084=fast::clamp(dot(l9_1083.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_1084=fast::clamp(dot(l9_1083.xyz,float3(1.0)),0.0,1.0)*l9_1083.w;
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0))
{
l9_1084=dot(l9_1083.xyz,float3(0.33333001))*l9_1083.w;
}
else
{
if ((int(sc_BlendMode_Min_tmp)!=0))
{
l9_1084=1.0-fast::clamp(dot(l9_1083.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_Max_tmp)!=0))
{
l9_1084=fast::clamp(dot(l9_1083.xyz,float3(1.0)),0.0,1.0);
}
}
}
}
}
}
}
}
}
}
}
}
float l9_1085=l9_1084;
float l9_1086=l9_1085;
float l9_1087=(*sc_set0.UserUniforms).sc_ShadowDensity*l9_1086;
float3 l9_1088=mix((*sc_set0.UserUniforms).sc_ShadowColor.xyz,(*sc_set0.UserUniforms).sc_ShadowColor.xyz*l9_1082.xyz,float3((*sc_set0.UserUniforms).sc_ShadowColor.w));
float4 l9_1089=float4(l9_1088.x,l9_1088.y,l9_1088.z,l9_1087);
param_23=l9_1089;
}
else
{
if ((int(sc_RenderAlphaToColor_tmp)!=0))
{
param_23=float4(param_23.w);
}
else
{
if ((int(sc_BlendMode_Custom_tmp)!=0))
{
float4 l9_1090=param_23;
float4 l9_1091=float4(0.0);
float4 l9_1092=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_1093=out.sc_FragData0;
l9_1092=l9_1093;
}
else
{
float4 l9_1094=gl_FragCoord;
float2 l9_1095=l9_1094.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_1096=l9_1095;
float2 l9_1097=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_1098=1;
int l9_1099=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1099=0;
}
else
{
l9_1099=in.varStereoViewID;
}
int l9_1100=l9_1099;
int l9_1101=l9_1100;
float3 l9_1102=float3(l9_1096,0.0);
int l9_1103=l9_1098;
int l9_1104=l9_1101;
if (l9_1103==1)
{
l9_1102.y=((2.0*l9_1102.y)+float(l9_1104))-1.0;
}
float2 l9_1105=l9_1102.xy;
l9_1097=l9_1105;
}
else
{
l9_1097=l9_1096;
}
float2 l9_1106=l9_1097;
float2 l9_1107=l9_1106;
float2 l9_1108=l9_1107;
float2 l9_1109=l9_1108;
float l9_1110=0.0;
int l9_1111;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_1112=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1112=0;
}
else
{
l9_1112=in.varStereoViewID;
}
int l9_1113=l9_1112;
l9_1111=1-l9_1113;
}
else
{
int l9_1114=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1114=0;
}
else
{
l9_1114=in.varStereoViewID;
}
int l9_1115=l9_1114;
l9_1111=l9_1115;
}
int l9_1116=l9_1111;
float2 l9_1117=l9_1109;
int l9_1118=sc_ScreenTextureLayout_tmp;
int l9_1119=l9_1116;
float l9_1120=l9_1110;
float2 l9_1121=l9_1117;
int l9_1122=l9_1118;
int l9_1123=l9_1119;
float3 l9_1124=float3(0.0);
if (l9_1122==0)
{
l9_1124=float3(l9_1121,0.0);
}
else
{
if (l9_1122==1)
{
l9_1124=float3(l9_1121.x,(l9_1121.y*0.5)+(0.5-(float(l9_1123)*0.5)),0.0);
}
else
{
l9_1124=float3(l9_1121,float(l9_1123));
}
}
float3 l9_1125=l9_1124;
float3 l9_1126=l9_1125;
float4 l9_1127=sc_set0.sc_ScreenTexture.sample(sc_set0.sc_ScreenTextureSmpSC,l9_1126.xy,bias(l9_1120));
float4 l9_1128=l9_1127;
float4 l9_1129=l9_1128;
l9_1092=l9_1129;
}
float4 l9_1130=l9_1092;
float3 l9_1131=l9_1130.xyz;
float3 l9_1132=l9_1131;
float3 l9_1133=l9_1090.xyz;
float3 l9_1134=definedBlend(l9_1132,l9_1133,in.varStereoViewID,(*sc_set0.UserUniforms),sc_set0.intensityTexture,sc_set0.intensityTextureSmpSC);
l9_1091=float4(l9_1134.x,l9_1134.y,l9_1134.z,l9_1091.w);
float3 l9_1135=mix(l9_1131,l9_1091.xyz,float3(l9_1090.w));
l9_1091=float4(l9_1135.x,l9_1135.y,l9_1135.z,l9_1091.w);
l9_1091.w=1.0;
float4 l9_1136=l9_1091;
param_23=l9_1136;
}
else
{
if ((int(sc_Voxelization_tmp)!=0))
{
float4 l9_1137=float4(in.varScreenPos.xyz,1.0);
param_23=l9_1137;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
float4 l9_1138=gl_FragCoord;
float l9_1139=fast::clamp(abs(l9_1138.z),0.0,1.0);
float4 l9_1140=float4(l9_1139,1.0-l9_1139,1.0,1.0);
param_23=l9_1140;
}
else
{
float4 l9_1141=param_23;
float4 l9_1142=float4(0.0);
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_1142=float4(mix(float3(1.0),l9_1141.xyz,float3(l9_1141.w)),l9_1141.w);
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0)||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
float l9_1143=l9_1141.w;
if ((int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_1143=fast::clamp(l9_1143,0.0,1.0);
}
l9_1142=float4(l9_1141.xyz*l9_1143,l9_1143);
}
else
{
l9_1142=l9_1141;
}
}
float4 l9_1144=l9_1142;
param_23=l9_1144;
}
}
}
}
}
float4 l9_1145=param_23;
FinalColor=l9_1145;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
if (PreviewInfo.Saved)
{
FinalColor=float4(PreviewInfo.Color);
}
else
{
FinalColor=float4(0.0);
}
}
float4 l9_1146=float4(0.0);
l9_1146=float4(0.0);
float4 l9_1147=l9_1146;
float4 Cost=l9_1147;
if (Cost.w>0.0)
{
FinalColor=Cost;
}
FinalColor=fast::max(FinalColor,float4(0.0));
float4 param_24=FinalColor;
FinalColor=sc_OutputMotionVectorIfNeeded(param_24,in.varPosAndMotion,in.varNormalAndMotion);
float4 param_25=FinalColor;
float4 l9_1148=param_25;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_1148.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=l9_1148;
return out;
}
} // FRAGMENT SHADER

namespace SNAP_RECV {
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float3 BumpedNormal;
float3 ViewDirWS;
float3 PositionWS;
float3 VertexTangent_WorldSpace;
float3 VertexNormal_WorldSpace;
float3 VertexBinormal_WorldSpace;
float3 SurfacePosition_WorldSpace;
float2 Surface_UVCoord0;
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
int sc_RayTracingReceiverEffectsMask;
float4 sc_RayTracingReflectionsSize;
float4 sc_RayTracingReflectionsDims;
float4 sc_RayTracingReflectionsView;
float4 sc_RayTracingGlobalIlluminationSize;
float4 sc_RayTracingGlobalIlluminationDims;
float4 sc_RayTracingGlobalIlluminationView;
float4 sc_RayTracingShadowsSize;
float4 sc_RayTracingShadowsDims;
float4 sc_RayTracingShadowsView;
float3 sc_RayTracingOriginScale;
uint sc_RayTracingReceiverMask;
float3 sc_RayTracingOriginScaleInv;
float3 sc_RayTracingOriginOffset;
uint sc_RayTracingReceiverId;
uint4 sc_RayTracingCasterConfiguration;
uint4 sc_RayTracingCasterOffsetPNTC;
uint4 sc_RayTracingCasterOffsetTexture;
uint4 sc_RayTracingCasterFormatPNTC;
uint4 sc_RayTracingCasterFormatTexture;
float4 sc_RayTracingRayDirectionSize;
float4 sc_RayTracingRayDirectionDims;
float4 sc_RayTracingRayDirectionView;
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
int PreviewEnabled;
int PreviewNodeID;
float alphaTestThreshold;
float rimExponent;
float rimIntensity;
float4 rimColor;
float4 baseColor;
float4 albedoTexSize;
float4 albedoTexDims;
float4 albedoTexView;
float3x3 albedoTexTransform;
float4 albedoTexUvMinMax;
float4 albedoTexBorderColor;
float uvScale;
float4 albedoSecondarySize;
float4 albedoSecondaryDims;
float4 albedoSecondaryView;
float3x3 albedoSecondaryTransform;
float4 albedoSecondaryUvMinMax;
float4 albedoSecondaryBorderColor;
float progress;
float4 aoTexSize;
float4 aoTexDims;
float4 aoTexView;
float3x3 aoTexTransform;
float4 aoTexUvMinMax;
float4 aoTexBorderColor;
float aoScale;
float4 normalTexSize;
float4 normalTexDims;
float4 normalTexView;
float3x3 normalTexTransform;
float4 normalTexUvMinMax;
float4 normalTexBorderColor;
float metallic;
float roughness;
float2 Port_Center_N031;
float Port_Opacity_N000;
float4 Port_Input2_N019;
float3 Port_Emissive_N000;
float3 Port_AO_N000;
float3 Port_SpecularAO_N000;
float depthRef;
};
struct sc_Bone_t
{
float4 boneMatrix[3];
float4 normalMatrix[3];
};
struct sc_Bones_obj
{
sc_Bone_t sc_Bones[1];
};
struct sc_RayTracingCasterIndexBuffer_obj
{
uint sc_RayTracingCasterTriangles[1];
};
struct sc_RayTracingCasterVertexBuffer_obj
{
float sc_RayTracingCasterVertices[1];
};
struct sc_RayTracingCasterNonAnimatedVertexBuffer_obj
{
float sc_RayTracingCasterNonAnimatedVertices[1];
};
struct sc_Set0
{
const device sc_RayTracingCasterIndexBuffer_obj* sc_RayTracingCasterIndexBuffer [[id(0)]];
const device sc_RayTracingCasterVertexBuffer_obj* sc_RayTracingCasterVertexBuffer [[id(1)]];
const device sc_RayTracingCasterNonAnimatedVertexBuffer_obj* sc_RayTracingCasterNonAnimatedVertexBuffer [[id(2)]];
constant sc_Bones_obj* sc_BonesUBO [[id(3)]];
texture2d<float> albedoSecondary [[id(4)]];
texture2d<float> albedoTex [[id(5)]];
texture2d<float> aoTex [[id(6)]];
texture2d<float> intensityTexture [[id(7)]];
texture2d<float> normalTex [[id(8)]];
texture2d<float> sc_EnvmapDiffuse [[id(9)]];
texture2d<float> sc_EnvmapSpecular [[id(10)]];
texture2d<float> sc_RayTracingGlobalIllumination [[id(19)]];
texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric [[id(20)]];
texture2d<float> sc_RayTracingRayDirection [[id(21)]];
texture2d<float> sc_RayTracingReflections [[id(22)]];
texture2d<float> sc_RayTracingShadows [[id(23)]];
texture2d<float> sc_SSAOTexture [[id(24)]];
texture2d<float> sc_ScreenTexture [[id(25)]];
texture2d<float> sc_ShadowTexture [[id(26)]];
sampler albedoSecondarySmpSC [[id(28)]];
sampler albedoTexSmpSC [[id(29)]];
sampler aoTexSmpSC [[id(30)]];
sampler intensityTextureSmpSC [[id(31)]];
sampler normalTexSmpSC [[id(32)]];
sampler sc_EnvmapDiffuseSmpSC [[id(33)]];
sampler sc_EnvmapSpecularSmpSC [[id(34)]];
sampler sc_RayTracingGlobalIlluminationSmpSC [[id(36)]];
sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC [[id(37)]];
sampler sc_RayTracingRayDirectionSmpSC [[id(38)]];
sampler sc_RayTracingReflectionsSmpSC [[id(39)]];
sampler sc_RayTracingShadowsSmpSC [[id(40)]];
sampler sc_SSAOTextureSmpSC [[id(41)]];
sampler sc_ScreenTextureSmpSC [[id(42)]];
sampler sc_ShadowTextureSmpSC [[id(43)]];
constant userUniformsObj* UserUniforms [[id(45)]];
};
struct main_recv_out
{
uint4 sc_RayTracingPositionAndMask [[color(0)]];
uint4 sc_RayTracingNormalAndMore [[color(1)]];
};
struct main_recv_in
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float varViewSpaceDepth [[user(locn6)]];
float2 varShadowTex [[user(locn7)]];
int varStereoViewID [[user(locn8)]];
float varClipDistance [[user(locn9)]];
float4 varColor [[user(locn10)]];
float4 PreviewVertexColor [[user(locn11)]];
float PreviewVertexSaved [[user(locn12)]];
};
// Implementation of the GLSL mod() function,which is slightly different than Metal fmod()
template<typename Tx,typename Ty>
Tx mod(Tx x,Ty y)
{
return x-y*floor(x/y);
}
fragment main_recv_out main_recv(main_recv_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],float4 gl_FragCoord [[position]])
{
main_recv_out out={};
if ((int(sc_DepthOnly_tmp)!=0))
{
return out;
}
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
Globals.gTimeDelta=(*sc_set0.UserUniforms).sc_Time.y;
Globals.BumpedNormal=float3(0.0);
Globals.ViewDirWS=normalize((*sc_set0.UserUniforms).sc_Camera.position-in.varPosAndMotion.xyz);
Globals.PositionWS=in.varPosAndMotion.xyz;
Globals.VertexTangent_WorldSpace=normalize(in.varTangent.xyz);
Globals.VertexNormal_WorldSpace=normalize(in.varNormalAndMotion.xyz);
Globals.VertexBinormal_WorldSpace=cross(Globals.VertexNormal_WorldSpace,Globals.VertexTangent_WorldSpace)*in.varTangent.w;
Globals.SurfacePosition_WorldSpace=in.varPosAndMotion.xyz;
Globals.ViewDirWS=normalize((*sc_set0.UserUniforms).sc_Camera.position-Globals.SurfacePosition_WorldSpace);
Globals.Surface_UVCoord0=in.varTex01.xy;
float4 Output_N19=float4(0.0);
float4 param=float4(1.0);
float4 param_1=(*sc_set0.UserUniforms).Port_Input2_N019;
ssGlobals param_3=Globals;
float4 param_2;
if ((int(enableNormals_tmp)!=0))
{
float2 l9_0=float2(0.0);
l9_0=param_3.Surface_UVCoord0;
float l9_1=0.0;
float l9_2=(*sc_set0.UserUniforms).uvScale;
l9_1=l9_2;
float2 l9_3=float2(0.0);
l9_3=((l9_0-(*sc_set0.UserUniforms).Port_Center_N031)*float2(l9_1))+(*sc_set0.UserUniforms).Port_Center_N031;
float4 l9_4=float4(0.0);
float2 l9_5=l9_3;
int l9_6;
if ((int(normalTexHasSwappedViews_tmp)!=0))
{
int l9_7=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_7=0;
}
else
{
l9_7=in.varStereoViewID;
}
int l9_8=l9_7;
l9_6=1-l9_8;
}
else
{
int l9_9=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_9=0;
}
else
{
l9_9=in.varStereoViewID;
}
int l9_10=l9_9;
l9_6=l9_10;
}
int l9_11=l9_6;
int l9_12=normalTexLayout_tmp;
int l9_13=l9_11;
float2 l9_14=l9_5;
bool l9_15=(int(SC_USE_UV_TRANSFORM_normalTex_tmp)!=0);
float3x3 l9_16=(*sc_set0.UserUniforms).normalTexTransform;
int2 l9_17=int2(SC_SOFTWARE_WRAP_MODE_U_normalTex_tmp,SC_SOFTWARE_WRAP_MODE_V_normalTex_tmp);
bool l9_18=(int(SC_USE_UV_MIN_MAX_normalTex_tmp)!=0);
float4 l9_19=(*sc_set0.UserUniforms).normalTexUvMinMax;
bool l9_20=(int(SC_USE_CLAMP_TO_BORDER_normalTex_tmp)!=0);
float4 l9_21=(*sc_set0.UserUniforms).normalTexBorderColor;
float l9_22=0.0;
bool l9_23=l9_20&&(!l9_18);
float l9_24=1.0;
float l9_25=l9_14.x;
int l9_26=l9_17.x;
if (l9_26==1)
{
l9_25=fract(l9_25);
}
else
{
if (l9_26==2)
{
float l9_27=fract(l9_25);
float l9_28=l9_25-l9_27;
float l9_29=step(0.25,fract(l9_28*0.5));
l9_25=mix(l9_27,1.0-l9_27,fast::clamp(l9_29,0.0,1.0));
}
}
l9_14.x=l9_25;
float l9_30=l9_14.y;
int l9_31=l9_17.y;
if (l9_31==1)
{
l9_30=fract(l9_30);
}
else
{
if (l9_31==2)
{
float l9_32=fract(l9_30);
float l9_33=l9_30-l9_32;
float l9_34=step(0.25,fract(l9_33*0.5));
l9_30=mix(l9_32,1.0-l9_32,fast::clamp(l9_34,0.0,1.0));
}
}
l9_14.y=l9_30;
if (l9_18)
{
bool l9_35=l9_20;
bool l9_36;
if (l9_35)
{
l9_36=l9_17.x==3;
}
else
{
l9_36=l9_35;
}
float l9_37=l9_14.x;
float l9_38=l9_19.x;
float l9_39=l9_19.z;
bool l9_40=l9_36;
float l9_41=l9_24;
float l9_42=fast::clamp(l9_37,l9_38,l9_39);
float l9_43=step(abs(l9_37-l9_42),9.9999997e-06);
l9_41*=(l9_43+((1.0-float(l9_40))*(1.0-l9_43)));
l9_37=l9_42;
l9_14.x=l9_37;
l9_24=l9_41;
bool l9_44=l9_20;
bool l9_45;
if (l9_44)
{
l9_45=l9_17.y==3;
}
else
{
l9_45=l9_44;
}
float l9_46=l9_14.y;
float l9_47=l9_19.y;
float l9_48=l9_19.w;
bool l9_49=l9_45;
float l9_50=l9_24;
float l9_51=fast::clamp(l9_46,l9_47,l9_48);
float l9_52=step(abs(l9_46-l9_51),9.9999997e-06);
l9_50*=(l9_52+((1.0-float(l9_49))*(1.0-l9_52)));
l9_46=l9_51;
l9_14.y=l9_46;
l9_24=l9_50;
}
float2 l9_53=l9_14;
bool l9_54=l9_15;
float3x3 l9_55=l9_16;
if (l9_54)
{
l9_53=float2((l9_55*float3(l9_53,1.0)).xy);
}
float2 l9_56=l9_53;
l9_14=l9_56;
float l9_57=l9_14.x;
int l9_58=l9_17.x;
bool l9_59=l9_23;
float l9_60=l9_24;
if ((l9_58==0)||(l9_58==3))
{
float l9_61=l9_57;
float l9_62=0.0;
float l9_63=1.0;
bool l9_64=l9_59;
float l9_65=l9_60;
float l9_66=fast::clamp(l9_61,l9_62,l9_63);
float l9_67=step(abs(l9_61-l9_66),9.9999997e-06);
l9_65*=(l9_67+((1.0-float(l9_64))*(1.0-l9_67)));
l9_61=l9_66;
l9_57=l9_61;
l9_60=l9_65;
}
l9_14.x=l9_57;
l9_24=l9_60;
float l9_68=l9_14.y;
int l9_69=l9_17.y;
bool l9_70=l9_23;
float l9_71=l9_24;
if ((l9_69==0)||(l9_69==3))
{
float l9_72=l9_68;
float l9_73=0.0;
float l9_74=1.0;
bool l9_75=l9_70;
float l9_76=l9_71;
float l9_77=fast::clamp(l9_72,l9_73,l9_74);
float l9_78=step(abs(l9_72-l9_77),9.9999997e-06);
l9_76*=(l9_78+((1.0-float(l9_75))*(1.0-l9_78)));
l9_72=l9_77;
l9_68=l9_72;
l9_71=l9_76;
}
l9_14.y=l9_68;
l9_24=l9_71;
float2 l9_79=l9_14;
int l9_80=l9_12;
int l9_81=l9_13;
float l9_82=l9_22;
float2 l9_83=l9_79;
int l9_84=l9_80;
int l9_85=l9_81;
float3 l9_86=float3(0.0);
if (l9_84==0)
{
l9_86=float3(l9_83,0.0);
}
else
{
if (l9_84==1)
{
l9_86=float3(l9_83.x,(l9_83.y*0.5)+(0.5-(float(l9_85)*0.5)),0.0);
}
else
{
l9_86=float3(l9_83,float(l9_85));
}
}
float3 l9_87=l9_86;
float3 l9_88=l9_87;
float4 l9_89=sc_set0.normalTex.sample(sc_set0.normalTexSmpSC,l9_88.xy,bias(l9_82));
float4 l9_90=l9_89;
if (l9_20)
{
l9_90=mix(l9_21,l9_90,float4(l9_24));
}
float4 l9_91=l9_90;
float4 l9_92=l9_91;
float3 l9_93=(l9_92.xyz*1.9921875)-float3(1.0);
l9_92=float4(l9_93.x,l9_93.y,l9_93.z,l9_92.w);
l9_4=l9_92;
param=l9_4;
param_2=param;
}
else
{
param_2=param_1;
}
Output_N19=param_2;
float Output_N12=0.0;
float param_4=(*sc_set0.UserUniforms).roughness;
Output_N12=param_4;
float param_5=(*sc_set0.UserUniforms).Port_Opacity_N000;
float3 param_6=Output_N19.xyz;
float param_7=Output_N12;
ssGlobals param_8=Globals;
if (!(int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
param_8.BumpedNormal=float3x3(float3(param_8.VertexTangent_WorldSpace),float3(param_8.VertexBinormal_WorldSpace),float3(param_8.VertexNormal_WorldSpace))*param_6;
}
float l9_94=param_5;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (l9_94<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_95=gl_FragCoord;
float2 l9_96=floor(mod(l9_95.xy,float2(4.0)));
float l9_97=(mod(dot(l9_96,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (l9_94<l9_97)
{
discard_fragment();
}
}
float3 l9_98=param_8.PositionWS;
float3 l9_99=param_8.BumpedNormal;
float l9_100=param_7;
float3 l9_101=l9_98;
float3 l9_102=l9_99;
float l9_103=l9_100;
uint l9_104=0u;
uint3 l9_105=uint3(round((l9_101-(*sc_set0.UserUniforms).sc_RayTracingOriginOffset)*(*sc_set0.UserUniforms).sc_RayTracingOriginScale));
out.sc_RayTracingPositionAndMask=uint4(l9_105.x,l9_105.y,l9_105.z,out.sc_RayTracingPositionAndMask.w);
out.sc_RayTracingPositionAndMask.w=(*sc_set0.UserUniforms).sc_RayTracingReceiverMask;
float3 l9_106=l9_102;
float l9_107=dot(abs(l9_106),float3(1.0));
l9_106/=float3(l9_107);
float2 l9_108=float2(fast::clamp(-l9_106.z,0.0,1.0));
float2 l9_109=l9_106.xy+mix(-l9_108,l9_108,step(float2(0.0),l9_106.xy));
uint l9_110=as_type<uint>(half2(l9_109));
uint2 l9_111=uint2(l9_110&65535u,l9_110>>16u);
out.sc_RayTracingNormalAndMore=uint4(l9_111.x,l9_111.y,out.sc_RayTracingNormalAndMore.z,out.sc_RayTracingNormalAndMore.w);
out.sc_RayTracingNormalAndMore.z=l9_104;
uint l9_112=uint(fast::clamp(l9_103,0.0,1.0)*1000.0);
l9_112 |= (((*sc_set0.UserUniforms).sc_RayTracingReceiverId%32u)<<10u);
out.sc_RayTracingNormalAndMore.w=l9_112;
return out;
}
} // RECEIVER MODE SHADER
