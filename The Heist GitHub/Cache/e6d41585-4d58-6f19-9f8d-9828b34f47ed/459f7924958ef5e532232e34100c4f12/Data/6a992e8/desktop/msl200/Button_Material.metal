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
// SCC_BACKEND_SHADER_FLAG_DISABLE_FRUSTUM_CULLING
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
//sampler sampler baseTex2SmpSC 0:18
//sampler sampler baseTexSmpSC 0:19
//sampler sampler intensityTextureSmpSC 0:20
//sampler sampler sc_ScreenTextureSmpSC 0:25
//texture texture2D baseTex 0:1:0:19
//texture texture2D baseTex2 0:2:0:18
//texture texture2D intensityTexture 0:3:0:20
//texture texture2D sc_ScreenTexture 0:15:0:25
//ubo float sc_BonesUBO 0:0:96 {
//sc_Bone_t sc_Bones 0:[1]:96
//float4 sc_Bones.boneMatrix 0:[3]:16
//float4 sc_Bones.normalMatrix 48:[3]:16
//}
//ubo int UserUniforms 0:28:4832 {
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
//float4 voxelization_params_0 3824
//float4 voxelization_params_frustum_lrbt 3840
//float4 voxelization_params_frustum_nf 3856
//float3 voxelization_params_camera_pos 3872
//float4x4 sc_ModelMatrixVoxelization 3888
//float correctedIntensity 3952
//float3x3 intensityTextureTransform 4016
//float4 intensityTextureUvMinMax 4064
//float4 intensityTextureBorderColor 4080
//int PreviewEnabled 4244
//int PreviewNodeID 4248
//float alphaTestThreshold 4252
//float4 baseTexSize 4256
//float3x3 baseTexTransform 4304
//float4 baseTexUvMinMax 4352
//float4 baseTexBorderColor 4368
//float2 boxBounds 4384
//float cornerRadius 4392
//float3x3 baseTex2Transform 4448
//float4 baseTex2UvMinMax 4496
//float4 baseTex2BorderColor 4512
//float state 4528
//float4 baseColor 4544
//float4 strokeColor 4560
//float strokeThickness 4576
//float opacity 4580
//float Port_Value_N057 4584
//float3 Port_Input2_N052 4592
//float Port_Value_N061 4608
//float Port_Input1_N023 4612
//float2 Port_Scale_N013 4616
//float2 Port_Center_N013 4624
//float2 Port_Default_N040 4632
//float2 Port_Value_N002 4648
//float2 Port_Input1_N089 4664
//float2 Port_Input2_N089 4672
//float Port_Input0_N036 4680
//float2 Port_Input1_N028 4696
//float Port_Input0_N038 4708
//float Port_Input1_N038 4712
//float4 Port_Import_N104 4720
//float4 Port_Import_N105 4736
//float Port_Input0_N117 4752
//float Port_Input1_N117 4756
//float Port_RangeMinA_N106 4760
//float Port_RangeMaxA_N106 4764
//float Port_RangeMinB_N106 4768
//float Port_RangeMaxB_N106 4772
//float2 Port_Import_N107 4776
//float2 Port_Center_N108 4784
//float2 Port_Import_N109 4792
//float2 Port_Import_N111 4800
//float Port_Input1_N116 4808
//float Port_Input2_N116 4812
//float Port_Input2_N044 4816
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
//spec_const bool SC_USE_CLAMP_TO_BORDER_baseTex2 31 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_baseTex 32 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_intensityTexture 33 0
//spec_const bool SC_USE_UV_MIN_MAX_baseTex2 34 0
//spec_const bool SC_USE_UV_MIN_MAX_baseTex 35 0
//spec_const bool SC_USE_UV_MIN_MAX_intensityTexture 36 0
//spec_const bool SC_USE_UV_TRANSFORM_baseTex2 37 0
//spec_const bool SC_USE_UV_TRANSFORM_baseTex 38 0
//spec_const bool SC_USE_UV_TRANSFORM_intensityTexture 39 0
//spec_const bool Tweak_N45 40 0
//spec_const bool Tweak_N65 41 0
//spec_const bool Tweak_N67 42 0
//spec_const bool UseViewSpaceDepthVariant 43 1
//spec_const bool baseTex2HasSwappedViews 44 0
//spec_const bool baseTexHasSwappedViews 45 0
//spec_const bool intensityTextureHasSwappedViews 46 0
//spec_const bool sc_BlendMode_AddWithAlphaFactor 47 0
//spec_const bool sc_BlendMode_Add 48 0
//spec_const bool sc_BlendMode_AlphaTest 49 0
//spec_const bool sc_BlendMode_AlphaToCoverage 50 0
//spec_const bool sc_BlendMode_ColoredGlass 51 0
//spec_const bool sc_BlendMode_Custom 52 0
//spec_const bool sc_BlendMode_Max 53 0
//spec_const bool sc_BlendMode_Min 54 0
//spec_const bool sc_BlendMode_MultiplyOriginal 55 0
//spec_const bool sc_BlendMode_Multiply 56 0
//spec_const bool sc_BlendMode_Normal 57 0
//spec_const bool sc_BlendMode_PremultipliedAlphaAuto 58 0
//spec_const bool sc_BlendMode_PremultipliedAlphaHardware 59 0
//spec_const bool sc_BlendMode_PremultipliedAlpha 60 0
//spec_const bool sc_BlendMode_Screen 61 0
//spec_const bool sc_DepthOnly 62 0
//spec_const bool sc_FramebufferFetch 63 0
//spec_const bool sc_MotionVectorsPass 64 0
//spec_const bool sc_OITCompositingPass 65 0
//spec_const bool sc_OITDepthBoundsPass 66 0
//spec_const bool sc_OITDepthGatherPass 67 0
//spec_const bool sc_OutputBounds 68 0
//spec_const bool sc_ProjectiveShadowsCaster 69 0
//spec_const bool sc_ProjectiveShadowsReceiver 70 0
//spec_const bool sc_RenderAlphaToColor 71 0
//spec_const bool sc_ScreenTextureHasSwappedViews 72 0
//spec_const bool sc_TAAEnabled 73 0
//spec_const bool sc_VertexBlendingUseNormals 74 0
//spec_const bool sc_VertexBlending 75 0
//spec_const bool sc_Voxelization 76 0
//spec_const int SC_SOFTWARE_WRAP_MODE_U_baseTex2 77 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_baseTex 78 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_intensityTexture 79 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_baseTex2 80 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_baseTex 81 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_intensityTexture 82 -1
//spec_const int baseTex2Layout 83 0
//spec_const int baseTexLayout 84 0
//spec_const int intensityTextureLayout 85 0
//spec_const int sc_DepthBufferMode 86 0
//spec_const int sc_RenderingSpace 87 -1
//spec_const int sc_ScreenTextureLayout 88 0
//spec_const int sc_ShaderCacheConstant 89 0
//spec_const int sc_SkinBonesCount 90 0
//spec_const int sc_StereoRenderingMode 91 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 92 0
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
constant bool SC_USE_CLAMP_TO_BORDER_baseTex2 [[function_constant(31)]];
constant bool SC_USE_CLAMP_TO_BORDER_baseTex2_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_baseTex2) ? SC_USE_CLAMP_TO_BORDER_baseTex2 : false;
constant bool SC_USE_CLAMP_TO_BORDER_baseTex [[function_constant(32)]];
constant bool SC_USE_CLAMP_TO_BORDER_baseTex_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_baseTex) ? SC_USE_CLAMP_TO_BORDER_baseTex : false;
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture [[function_constant(33)]];
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_intensityTexture) ? SC_USE_CLAMP_TO_BORDER_intensityTexture : false;
constant bool SC_USE_UV_MIN_MAX_baseTex2 [[function_constant(34)]];
constant bool SC_USE_UV_MIN_MAX_baseTex2_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_baseTex2) ? SC_USE_UV_MIN_MAX_baseTex2 : false;
constant bool SC_USE_UV_MIN_MAX_baseTex [[function_constant(35)]];
constant bool SC_USE_UV_MIN_MAX_baseTex_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_baseTex) ? SC_USE_UV_MIN_MAX_baseTex : false;
constant bool SC_USE_UV_MIN_MAX_intensityTexture [[function_constant(36)]];
constant bool SC_USE_UV_MIN_MAX_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_intensityTexture) ? SC_USE_UV_MIN_MAX_intensityTexture : false;
constant bool SC_USE_UV_TRANSFORM_baseTex2 [[function_constant(37)]];
constant bool SC_USE_UV_TRANSFORM_baseTex2_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_baseTex2) ? SC_USE_UV_TRANSFORM_baseTex2 : false;
constant bool SC_USE_UV_TRANSFORM_baseTex [[function_constant(38)]];
constant bool SC_USE_UV_TRANSFORM_baseTex_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_baseTex) ? SC_USE_UV_TRANSFORM_baseTex : false;
constant bool SC_USE_UV_TRANSFORM_intensityTexture [[function_constant(39)]];
constant bool SC_USE_UV_TRANSFORM_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_intensityTexture) ? SC_USE_UV_TRANSFORM_intensityTexture : false;
constant bool Tweak_N45 [[function_constant(40)]];
constant bool Tweak_N45_tmp = is_function_constant_defined(Tweak_N45) ? Tweak_N45 : false;
constant bool Tweak_N65 [[function_constant(41)]];
constant bool Tweak_N65_tmp = is_function_constant_defined(Tweak_N65) ? Tweak_N65 : false;
constant bool Tweak_N67 [[function_constant(42)]];
constant bool Tweak_N67_tmp = is_function_constant_defined(Tweak_N67) ? Tweak_N67 : false;
constant bool UseViewSpaceDepthVariant [[function_constant(43)]];
constant bool UseViewSpaceDepthVariant_tmp = is_function_constant_defined(UseViewSpaceDepthVariant) ? UseViewSpaceDepthVariant : true;
constant bool baseTex2HasSwappedViews [[function_constant(44)]];
constant bool baseTex2HasSwappedViews_tmp = is_function_constant_defined(baseTex2HasSwappedViews) ? baseTex2HasSwappedViews : false;
constant bool baseTexHasSwappedViews [[function_constant(45)]];
constant bool baseTexHasSwappedViews_tmp = is_function_constant_defined(baseTexHasSwappedViews) ? baseTexHasSwappedViews : false;
constant bool intensityTextureHasSwappedViews [[function_constant(46)]];
constant bool intensityTextureHasSwappedViews_tmp = is_function_constant_defined(intensityTextureHasSwappedViews) ? intensityTextureHasSwappedViews : false;
constant bool sc_BlendMode_AddWithAlphaFactor [[function_constant(47)]];
constant bool sc_BlendMode_AddWithAlphaFactor_tmp = is_function_constant_defined(sc_BlendMode_AddWithAlphaFactor) ? sc_BlendMode_AddWithAlphaFactor : false;
constant bool sc_BlendMode_Add [[function_constant(48)]];
constant bool sc_BlendMode_Add_tmp = is_function_constant_defined(sc_BlendMode_Add) ? sc_BlendMode_Add : false;
constant bool sc_BlendMode_AlphaTest [[function_constant(49)]];
constant bool sc_BlendMode_AlphaTest_tmp = is_function_constant_defined(sc_BlendMode_AlphaTest) ? sc_BlendMode_AlphaTest : false;
constant bool sc_BlendMode_AlphaToCoverage [[function_constant(50)]];
constant bool sc_BlendMode_AlphaToCoverage_tmp = is_function_constant_defined(sc_BlendMode_AlphaToCoverage) ? sc_BlendMode_AlphaToCoverage : false;
constant bool sc_BlendMode_ColoredGlass [[function_constant(51)]];
constant bool sc_BlendMode_ColoredGlass_tmp = is_function_constant_defined(sc_BlendMode_ColoredGlass) ? sc_BlendMode_ColoredGlass : false;
constant bool sc_BlendMode_Custom [[function_constant(52)]];
constant bool sc_BlendMode_Custom_tmp = is_function_constant_defined(sc_BlendMode_Custom) ? sc_BlendMode_Custom : false;
constant bool sc_BlendMode_Max [[function_constant(53)]];
constant bool sc_BlendMode_Max_tmp = is_function_constant_defined(sc_BlendMode_Max) ? sc_BlendMode_Max : false;
constant bool sc_BlendMode_Min [[function_constant(54)]];
constant bool sc_BlendMode_Min_tmp = is_function_constant_defined(sc_BlendMode_Min) ? sc_BlendMode_Min : false;
constant bool sc_BlendMode_MultiplyOriginal [[function_constant(55)]];
constant bool sc_BlendMode_MultiplyOriginal_tmp = is_function_constant_defined(sc_BlendMode_MultiplyOriginal) ? sc_BlendMode_MultiplyOriginal : false;
constant bool sc_BlendMode_Multiply [[function_constant(56)]];
constant bool sc_BlendMode_Multiply_tmp = is_function_constant_defined(sc_BlendMode_Multiply) ? sc_BlendMode_Multiply : false;
constant bool sc_BlendMode_Normal [[function_constant(57)]];
constant bool sc_BlendMode_Normal_tmp = is_function_constant_defined(sc_BlendMode_Normal) ? sc_BlendMode_Normal : false;
constant bool sc_BlendMode_PremultipliedAlphaAuto [[function_constant(58)]];
constant bool sc_BlendMode_PremultipliedAlphaAuto_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaAuto) ? sc_BlendMode_PremultipliedAlphaAuto : false;
constant bool sc_BlendMode_PremultipliedAlphaHardware [[function_constant(59)]];
constant bool sc_BlendMode_PremultipliedAlphaHardware_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaHardware) ? sc_BlendMode_PremultipliedAlphaHardware : false;
constant bool sc_BlendMode_PremultipliedAlpha [[function_constant(60)]];
constant bool sc_BlendMode_PremultipliedAlpha_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlpha) ? sc_BlendMode_PremultipliedAlpha : false;
constant bool sc_BlendMode_Screen [[function_constant(61)]];
constant bool sc_BlendMode_Screen_tmp = is_function_constant_defined(sc_BlendMode_Screen) ? sc_BlendMode_Screen : false;
constant bool sc_DepthOnly [[function_constant(62)]];
constant bool sc_DepthOnly_tmp = is_function_constant_defined(sc_DepthOnly) ? sc_DepthOnly : false;
constant bool sc_FramebufferFetch [[function_constant(63)]];
constant bool sc_FramebufferFetch_tmp = is_function_constant_defined(sc_FramebufferFetch) ? sc_FramebufferFetch : false;
constant bool sc_MotionVectorsPass [[function_constant(64)]];
constant bool sc_MotionVectorsPass_tmp = is_function_constant_defined(sc_MotionVectorsPass) ? sc_MotionVectorsPass : false;
constant bool sc_OITCompositingPass [[function_constant(65)]];
constant bool sc_OITCompositingPass_tmp = is_function_constant_defined(sc_OITCompositingPass) ? sc_OITCompositingPass : false;
constant bool sc_OITDepthBoundsPass [[function_constant(66)]];
constant bool sc_OITDepthBoundsPass_tmp = is_function_constant_defined(sc_OITDepthBoundsPass) ? sc_OITDepthBoundsPass : false;
constant bool sc_OITDepthGatherPass [[function_constant(67)]];
constant bool sc_OITDepthGatherPass_tmp = is_function_constant_defined(sc_OITDepthGatherPass) ? sc_OITDepthGatherPass : false;
constant bool sc_OutputBounds [[function_constant(68)]];
constant bool sc_OutputBounds_tmp = is_function_constant_defined(sc_OutputBounds) ? sc_OutputBounds : false;
constant bool sc_ProjectiveShadowsCaster [[function_constant(69)]];
constant bool sc_ProjectiveShadowsCaster_tmp = is_function_constant_defined(sc_ProjectiveShadowsCaster) ? sc_ProjectiveShadowsCaster : false;
constant bool sc_ProjectiveShadowsReceiver [[function_constant(70)]];
constant bool sc_ProjectiveShadowsReceiver_tmp = is_function_constant_defined(sc_ProjectiveShadowsReceiver) ? sc_ProjectiveShadowsReceiver : false;
constant bool sc_RenderAlphaToColor [[function_constant(71)]];
constant bool sc_RenderAlphaToColor_tmp = is_function_constant_defined(sc_RenderAlphaToColor) ? sc_RenderAlphaToColor : false;
constant bool sc_ScreenTextureHasSwappedViews [[function_constant(72)]];
constant bool sc_ScreenTextureHasSwappedViews_tmp = is_function_constant_defined(sc_ScreenTextureHasSwappedViews) ? sc_ScreenTextureHasSwappedViews : false;
constant bool sc_TAAEnabled [[function_constant(73)]];
constant bool sc_TAAEnabled_tmp = is_function_constant_defined(sc_TAAEnabled) ? sc_TAAEnabled : false;
constant bool sc_VertexBlendingUseNormals [[function_constant(74)]];
constant bool sc_VertexBlendingUseNormals_tmp = is_function_constant_defined(sc_VertexBlendingUseNormals) ? sc_VertexBlendingUseNormals : false;
constant bool sc_VertexBlending [[function_constant(75)]];
constant bool sc_VertexBlending_tmp = is_function_constant_defined(sc_VertexBlending) ? sc_VertexBlending : false;
constant bool sc_Voxelization [[function_constant(76)]];
constant bool sc_Voxelization_tmp = is_function_constant_defined(sc_Voxelization) ? sc_Voxelization : false;
constant int SC_SOFTWARE_WRAP_MODE_U_baseTex2 [[function_constant(77)]];
constant int SC_SOFTWARE_WRAP_MODE_U_baseTex2_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_baseTex2) ? SC_SOFTWARE_WRAP_MODE_U_baseTex2 : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_baseTex [[function_constant(78)]];
constant int SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_baseTex) ? SC_SOFTWARE_WRAP_MODE_U_baseTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture [[function_constant(79)]];
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_U_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_baseTex2 [[function_constant(80)]];
constant int SC_SOFTWARE_WRAP_MODE_V_baseTex2_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_baseTex2) ? SC_SOFTWARE_WRAP_MODE_V_baseTex2 : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_baseTex [[function_constant(81)]];
constant int SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_baseTex) ? SC_SOFTWARE_WRAP_MODE_V_baseTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture [[function_constant(82)]];
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_V_intensityTexture : -1;
constant int baseTex2Layout [[function_constant(83)]];
constant int baseTex2Layout_tmp = is_function_constant_defined(baseTex2Layout) ? baseTex2Layout : 0;
constant int baseTexLayout [[function_constant(84)]];
constant int baseTexLayout_tmp = is_function_constant_defined(baseTexLayout) ? baseTexLayout : 0;
constant int intensityTextureLayout [[function_constant(85)]];
constant int intensityTextureLayout_tmp = is_function_constant_defined(intensityTextureLayout) ? intensityTextureLayout : 0;
constant int sc_DepthBufferMode [[function_constant(86)]];
constant int sc_DepthBufferMode_tmp = is_function_constant_defined(sc_DepthBufferMode) ? sc_DepthBufferMode : 0;
constant int sc_RenderingSpace [[function_constant(87)]];
constant int sc_RenderingSpace_tmp = is_function_constant_defined(sc_RenderingSpace) ? sc_RenderingSpace : -1;
constant int sc_ScreenTextureLayout [[function_constant(88)]];
constant int sc_ScreenTextureLayout_tmp = is_function_constant_defined(sc_ScreenTextureLayout) ? sc_ScreenTextureLayout : 0;
constant int sc_ShaderCacheConstant [[function_constant(89)]];
constant int sc_ShaderCacheConstant_tmp = is_function_constant_defined(sc_ShaderCacheConstant) ? sc_ShaderCacheConstant : 0;
constant int sc_SkinBonesCount [[function_constant(90)]];
constant int sc_SkinBonesCount_tmp = is_function_constant_defined(sc_SkinBonesCount) ? sc_SkinBonesCount : 0;
constant int sc_StereoRenderingMode [[function_constant(91)]];
constant int sc_StereoRenderingMode_tmp = is_function_constant_defined(sc_StereoRenderingMode) ? sc_StereoRenderingMode : 0;
constant int sc_StereoRendering_IsClipDistanceEnabled [[function_constant(92)]];
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
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float3 SurfacePosition_ObjectSpace;
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
int PreviewEnabled;
int PreviewNodeID;
float alphaTestThreshold;
float4 baseTexSize;
float4 baseTexDims;
float4 baseTexView;
float3x3 baseTexTransform;
float4 baseTexUvMinMax;
float4 baseTexBorderColor;
float2 boxBounds;
float cornerRadius;
float4 baseTex2Size;
float4 baseTex2Dims;
float4 baseTex2View;
float3x3 baseTex2Transform;
float4 baseTex2UvMinMax;
float4 baseTex2BorderColor;
float state;
float4 baseColor;
float4 strokeColor;
float strokeThickness;
float opacity;
float Port_Value_N057;
float3 Port_Input2_N052;
float Port_Value_N061;
float Port_Input1_N023;
float2 Port_Scale_N013;
float2 Port_Center_N013;
float2 Port_Default_N040;
float2 Port_Import_N032;
float2 Port_Value_N002;
float2 Port_Import_N018;
float2 Port_Input1_N089;
float2 Port_Input2_N089;
float Port_Input0_N036;
float2 Port_Import_N021;
float2 Port_Input1_N028;
float Port_Import_N022;
float Port_Input0_N038;
float Port_Input1_N038;
float4 Port_Import_N104;
float4 Port_Import_N105;
float Port_Input0_N117;
float Port_Input1_N117;
float Port_RangeMinA_N106;
float Port_RangeMaxA_N106;
float Port_RangeMinB_N106;
float Port_RangeMaxB_N106;
float2 Port_Import_N107;
float2 Port_Center_N108;
float2 Port_Import_N109;
float2 Port_Import_N111;
float Port_Input1_N116;
float Port_Input2_N116;
float Port_Input2_N044;
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
struct sc_Set0
{
constant sc_Bones_obj* sc_BonesUBO [[id(0)]];
texture2d<float> baseTex [[id(1)]];
texture2d<float> baseTex2 [[id(2)]];
texture2d<float> intensityTexture [[id(3)]];
texture2d<float> sc_ScreenTexture [[id(15)]];
sampler baseTex2SmpSC [[id(18)]];
sampler baseTexSmpSC [[id(19)]];
sampler intensityTextureSmpSC [[id(20)]];
sampler sc_ScreenTextureSmpSC [[id(25)]];
constant userUniformsObj* UserUniforms [[id(28)]];
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
out.PreviewVertexColor=float4(0.5);
ssPreviewInfo PreviewInfo;
PreviewInfo.Color=float4(0.5);
PreviewInfo.Saved=false;
out.PreviewVertexSaved=0.0;
sc_Vertex_t l9_0;
l9_0.position=in.position;
l9_0.normal=in.normal;
l9_0.tangent=in.tangent.xyz;
l9_0.texture0=in.texture0;
l9_0.texture1=in.texture1;
sc_Vertex_t l9_1=l9_0;
sc_Vertex_t param=l9_1;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_2=param;
param=l9_2;
}
sc_Vertex_t l9_3=param;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_4=l9_3;
float3 l9_5=in.blendShape0Pos;
float3 l9_6=in.blendShape0Normal;
float l9_7=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_8=l9_4;
float3 l9_9=l9_5;
float l9_10=l9_7;
float3 l9_11=l9_8.position.xyz+(l9_9*l9_10);
l9_8.position=float4(l9_11.x,l9_11.y,l9_11.z,l9_8.position.w);
l9_4=l9_8;
l9_4.normal+=(l9_6*l9_7);
l9_3=l9_4;
sc_Vertex_t l9_12=l9_3;
float3 l9_13=in.blendShape1Pos;
float3 l9_14=in.blendShape1Normal;
float l9_15=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_16=l9_12;
float3 l9_17=l9_13;
float l9_18=l9_15;
float3 l9_19=l9_16.position.xyz+(l9_17*l9_18);
l9_16.position=float4(l9_19.x,l9_19.y,l9_19.z,l9_16.position.w);
l9_12=l9_16;
l9_12.normal+=(l9_14*l9_15);
l9_3=l9_12;
sc_Vertex_t l9_20=l9_3;
float3 l9_21=in.blendShape2Pos;
float3 l9_22=in.blendShape2Normal;
float l9_23=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_24=l9_20;
float3 l9_25=l9_21;
float l9_26=l9_23;
float3 l9_27=l9_24.position.xyz+(l9_25*l9_26);
l9_24.position=float4(l9_27.x,l9_27.y,l9_27.z,l9_24.position.w);
l9_20=l9_24;
l9_20.normal+=(l9_22*l9_23);
l9_3=l9_20;
}
else
{
sc_Vertex_t l9_28=l9_3;
float3 l9_29=in.blendShape0Pos;
float l9_30=(*sc_set0.UserUniforms).weights0.x;
float3 l9_31=l9_28.position.xyz+(l9_29*l9_30);
l9_28.position=float4(l9_31.x,l9_31.y,l9_31.z,l9_28.position.w);
l9_3=l9_28;
sc_Vertex_t l9_32=l9_3;
float3 l9_33=in.blendShape1Pos;
float l9_34=(*sc_set0.UserUniforms).weights0.y;
float3 l9_35=l9_32.position.xyz+(l9_33*l9_34);
l9_32.position=float4(l9_35.x,l9_35.y,l9_35.z,l9_32.position.w);
l9_3=l9_32;
sc_Vertex_t l9_36=l9_3;
float3 l9_37=in.blendShape2Pos;
float l9_38=(*sc_set0.UserUniforms).weights0.z;
float3 l9_39=l9_36.position.xyz+(l9_37*l9_38);
l9_36.position=float4(l9_39.x,l9_39.y,l9_39.z,l9_36.position.w);
l9_3=l9_36;
sc_Vertex_t l9_40=l9_3;
float3 l9_41=in.blendShape3Pos;
float l9_42=(*sc_set0.UserUniforms).weights0.w;
float3 l9_43=l9_40.position.xyz+(l9_41*l9_42);
l9_40.position=float4(l9_43.x,l9_43.y,l9_43.z,l9_40.position.w);
l9_3=l9_40;
sc_Vertex_t l9_44=l9_3;
float3 l9_45=in.blendShape4Pos;
float l9_46=(*sc_set0.UserUniforms).weights1.x;
float3 l9_47=l9_44.position.xyz+(l9_45*l9_46);
l9_44.position=float4(l9_47.x,l9_47.y,l9_47.z,l9_44.position.w);
l9_3=l9_44;
sc_Vertex_t l9_48=l9_3;
float3 l9_49=in.blendShape5Pos;
float l9_50=(*sc_set0.UserUniforms).weights1.y;
float3 l9_51=l9_48.position.xyz+(l9_49*l9_50);
l9_48.position=float4(l9_51.x,l9_51.y,l9_51.z,l9_48.position.w);
l9_3=l9_48;
}
}
param=l9_3;
sc_Vertex_t l9_52=param;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_53=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_53=float4(1.0,fract(in.boneData.yzw));
l9_53.x-=dot(l9_53.yzw,float3(1.0));
}
float4 l9_54=l9_53;
float4 l9_55=l9_54;
int l9_56=int(in.boneData.x);
int l9_57=int(in.boneData.y);
int l9_58=int(in.boneData.z);
int l9_59=int(in.boneData.w);
int l9_60=l9_56;
float4 l9_61=l9_52.position;
float3 l9_62=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_63=l9_60;
float4 l9_64=(*sc_set0.sc_BonesUBO).sc_Bones[l9_63].boneMatrix[0];
float4 l9_65=(*sc_set0.sc_BonesUBO).sc_Bones[l9_63].boneMatrix[1];
float4 l9_66=(*sc_set0.sc_BonesUBO).sc_Bones[l9_63].boneMatrix[2];
float4 l9_67[3];
l9_67[0]=l9_64;
l9_67[1]=l9_65;
l9_67[2]=l9_66;
l9_62=float3(dot(l9_61,l9_67[0]),dot(l9_61,l9_67[1]),dot(l9_61,l9_67[2]));
}
else
{
l9_62=l9_61.xyz;
}
float3 l9_68=l9_62;
float3 l9_69=l9_68;
float l9_70=l9_55.x;
int l9_71=l9_57;
float4 l9_72=l9_52.position;
float3 l9_73=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_74=l9_71;
float4 l9_75=(*sc_set0.sc_BonesUBO).sc_Bones[l9_74].boneMatrix[0];
float4 l9_76=(*sc_set0.sc_BonesUBO).sc_Bones[l9_74].boneMatrix[1];
float4 l9_77=(*sc_set0.sc_BonesUBO).sc_Bones[l9_74].boneMatrix[2];
float4 l9_78[3];
l9_78[0]=l9_75;
l9_78[1]=l9_76;
l9_78[2]=l9_77;
l9_73=float3(dot(l9_72,l9_78[0]),dot(l9_72,l9_78[1]),dot(l9_72,l9_78[2]));
}
else
{
l9_73=l9_72.xyz;
}
float3 l9_79=l9_73;
float3 l9_80=l9_79;
float l9_81=l9_55.y;
int l9_82=l9_58;
float4 l9_83=l9_52.position;
float3 l9_84=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_85=l9_82;
float4 l9_86=(*sc_set0.sc_BonesUBO).sc_Bones[l9_85].boneMatrix[0];
float4 l9_87=(*sc_set0.sc_BonesUBO).sc_Bones[l9_85].boneMatrix[1];
float4 l9_88=(*sc_set0.sc_BonesUBO).sc_Bones[l9_85].boneMatrix[2];
float4 l9_89[3];
l9_89[0]=l9_86;
l9_89[1]=l9_87;
l9_89[2]=l9_88;
l9_84=float3(dot(l9_83,l9_89[0]),dot(l9_83,l9_89[1]),dot(l9_83,l9_89[2]));
}
else
{
l9_84=l9_83.xyz;
}
float3 l9_90=l9_84;
float3 l9_91=l9_90;
float l9_92=l9_55.z;
int l9_93=l9_59;
float4 l9_94=l9_52.position;
float3 l9_95=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_96=l9_93;
float4 l9_97=(*sc_set0.sc_BonesUBO).sc_Bones[l9_96].boneMatrix[0];
float4 l9_98=(*sc_set0.sc_BonesUBO).sc_Bones[l9_96].boneMatrix[1];
float4 l9_99=(*sc_set0.sc_BonesUBO).sc_Bones[l9_96].boneMatrix[2];
float4 l9_100[3];
l9_100[0]=l9_97;
l9_100[1]=l9_98;
l9_100[2]=l9_99;
l9_95=float3(dot(l9_94,l9_100[0]),dot(l9_94,l9_100[1]),dot(l9_94,l9_100[2]));
}
else
{
l9_95=l9_94.xyz;
}
float3 l9_101=l9_95;
float3 l9_102=(((l9_69*l9_70)+(l9_80*l9_81))+(l9_91*l9_92))+(l9_101*l9_55.w);
l9_52.position=float4(l9_102.x,l9_102.y,l9_102.z,l9_52.position.w);
int l9_103=l9_56;
float3x3 l9_104=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_103].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_103].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_103].normalMatrix[2].xyz));
float3x3 l9_105=l9_104;
float3x3 l9_106=l9_105;
int l9_107=l9_57;
float3x3 l9_108=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_107].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_107].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_107].normalMatrix[2].xyz));
float3x3 l9_109=l9_108;
float3x3 l9_110=l9_109;
int l9_111=l9_58;
float3x3 l9_112=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_111].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_111].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_111].normalMatrix[2].xyz));
float3x3 l9_113=l9_112;
float3x3 l9_114=l9_113;
int l9_115=l9_59;
float3x3 l9_116=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_115].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_115].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_115].normalMatrix[2].xyz));
float3x3 l9_117=l9_116;
float3x3 l9_118=l9_117;
l9_52.normal=((((l9_106*l9_52.normal)*l9_55.x)+((l9_110*l9_52.normal)*l9_55.y))+((l9_114*l9_52.normal)*l9_55.z))+((l9_118*l9_52.normal)*l9_55.w);
l9_52.tangent=((((l9_106*l9_52.tangent)*l9_55.x)+((l9_110*l9_52.tangent)*l9_55.y))+((l9_114*l9_52.tangent)*l9_55.z))+((l9_118*l9_52.tangent)*l9_55.w);
}
param=l9_52;
if (sc_RenderingSpace_tmp==3)
{
out.varPosAndMotion=float4(float3(0.0).x,float3(0.0).y,float3(0.0).z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param.normal.x,param.normal.y,param.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param.tangent.x,param.tangent.y,param.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==4)
{
out.varPosAndMotion=float4(float3(0.0).x,float3(0.0).y,float3(0.0).z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param.normal.x,param.normal.y,param.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param.tangent.x,param.tangent.y,param.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
out.varPosAndMotion=float4(param.position.xyz.x,param.position.xyz.y,param.position.xyz.z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param.normal.x,param.normal.y,param.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param.tangent.x,param.tangent.y,param.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
float3 l9_119=((*sc_set0.UserUniforms).sc_ModelMatrix*param.position).xyz;
out.varPosAndMotion=float4(l9_119.x,l9_119.y,l9_119.z,out.varPosAndMotion.w);
float3 l9_120=(*sc_set0.UserUniforms).sc_NormalMatrix*param.normal;
out.varNormalAndMotion=float4(l9_120.x,l9_120.y,l9_120.z,out.varNormalAndMotion.w);
float3 l9_121=(*sc_set0.UserUniforms).sc_NormalMatrix*param.tangent;
out.varTangent=float4(l9_121.x,l9_121.y,l9_121.z,out.varTangent.w);
}
}
}
}
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
param.texture0.x=1.0-param.texture0.x;
}
out.varColor=in.color;
sc_Vertex_t v=param;
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
Globals.gTimeDelta=(*sc_set0.UserUniforms).sc_Time.y;
Globals.SurfacePosition_ObjectSpace=((*sc_set0.UserUniforms).sc_ModelMatrixInverse*float4(out.varPosAndMotion.xyz,1.0)).xyz;
float3 WorldPosition=out.varPosAndMotion.xyz;
float3 WorldNormal=out.varNormalAndMotion.xyz;
float3 WorldTangent=out.varTangent.xyz;
float3 Position_N51=float3(0.0);
Position_N51=Globals.SurfacePosition_ObjectSpace;
float Output_N57=0.0;
float param_1=(*sc_set0.UserUniforms).Port_Value_N057;
float param_2=param_1+0.001;
param_2-=0.001;
Output_N57=param_2;
float Output_N56=0.0;
Output_N56=Output_N57+1.0;
float3 Output_N52=float3(0.0);
Output_N52=(Position_N51*float3(Output_N56))+(*sc_set0.UserUniforms).Port_Input2_N052;
float3 VectorOut_N53=float3(0.0);
VectorOut_N53=((*sc_set0.UserUniforms).sc_ModelMatrix*float4(Output_N52,1.0)).xyz;
WorldPosition=VectorOut_N53;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
WorldPosition=out.varPosAndMotion.xyz;
WorldNormal=out.varNormalAndMotion.xyz;
WorldTangent=out.varTangent.xyz;
}
sc_Vertex_t param_3=v;
float3 param_4=WorldPosition;
float3 param_5=WorldNormal;
float3 param_6=WorldTangent;
float4 param_7=v.position;
out.varPosAndMotion=float4(param_4.x,param_4.y,param_4.z,out.varPosAndMotion.w);
float3 l9_122=normalize(param_5);
out.varNormalAndMotion=float4(l9_122.x,l9_122.y,l9_122.z,out.varNormalAndMotion.w);
float3 l9_123=normalize(param_6);
out.varTangent=float4(l9_123.x,l9_123.y,l9_123.z,out.varTangent.w);
out.varTangent.w=in.tangent.w;
if ((int(UseViewSpaceDepthVariant_tmp)!=0)&&(((int(sc_OITDepthGatherPass_tmp)!=0)||(int(sc_OITCompositingPass_tmp)!=0))||(int(sc_OITDepthBoundsPass_tmp)!=0)))
{
float4 l9_124=param_3.position;
float4 l9_125=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
int l9_126=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_126=0;
}
else
{
l9_126=gl_InstanceIndex%2;
}
int l9_127=l9_126;
l9_125=(*sc_set0.UserUniforms).sc_ProjectionMatrixInverseArray[l9_127]*l9_124;
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_128=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_128=0;
}
else
{
l9_128=gl_InstanceIndex%2;
}
int l9_129=l9_128;
l9_125=(*sc_set0.UserUniforms).sc_ViewMatrixArray[l9_129]*l9_124;
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_130=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_130=0;
}
else
{
l9_130=gl_InstanceIndex%2;
}
int l9_131=l9_130;
l9_125=(*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_131]*l9_124;
}
else
{
l9_125=l9_124;
}
}
}
float4 l9_132=l9_125;
out.varViewSpaceDepth=-l9_132.z;
}
float4 l9_133=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
l9_133=param_7;
}
else
{
if (sc_RenderingSpace_tmp==4)
{
int l9_134=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_134=0;
}
else
{
l9_134=gl_InstanceIndex%2;
}
int l9_135=l9_134;
l9_133=((*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_135]*param_3.position)*float4(1.0/(*sc_set0.UserUniforms).sc_Camera.aspect,1.0,1.0,1.0);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_136=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_136=0;
}
else
{
l9_136=gl_InstanceIndex%2;
}
int l9_137=l9_136;
l9_133=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_137]*float4(out.varPosAndMotion.xyz,1.0);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_138=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_138=0;
}
else
{
l9_138=gl_InstanceIndex%2;
}
int l9_139=l9_138;
l9_133=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_139]*float4(out.varPosAndMotion.xyz,1.0);
}
}
}
}
out.varTex01=float4(param_3.texture0,param_3.texture1);
if ((int(sc_ProjectiveShadowsReceiver_tmp)!=0))
{
float4 l9_140=param_3.position;
float4 l9_141=l9_140;
if (sc_RenderingSpace_tmp==1)
{
l9_141=(*sc_set0.UserUniforms).sc_ModelMatrix*l9_140;
}
float4 l9_142=(*sc_set0.UserUniforms).sc_ProjectorMatrix*l9_141;
float2 l9_143=((l9_142.xy/float2(l9_142.w))*0.5)+float2(0.5);
out.varShadowTex=l9_143;
}
float4 l9_144=l9_133;
if (sc_DepthBufferMode_tmp==1)
{
int l9_145=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_145=0;
}
else
{
l9_145=gl_InstanceIndex%2;
}
int l9_146=l9_145;
if ((*sc_set0.UserUniforms).sc_ProjectionMatrixArray[l9_146][2].w!=0.0)
{
float l9_147=2.0/log2((*sc_set0.UserUniforms).sc_Camera.clipPlanes.y+1.0);
l9_144.z=((log2(fast::max((*sc_set0.UserUniforms).sc_Camera.clipPlanes.x,1.0+l9_144.w))*l9_147)-1.0)*l9_144.w;
}
}
float4 l9_148=l9_144;
l9_133=l9_148;
float4 l9_149=l9_133;
if ((int(sc_TAAEnabled_tmp)!=0))
{
float2 l9_150=l9_149.xy+((*sc_set0.UserUniforms).sc_TAAJitterOffset*l9_149.w);
l9_149=float4(l9_150.x,l9_150.y,l9_149.z,l9_149.w);
}
float4 l9_151=l9_149;
l9_133=l9_151;
float4 l9_152=l9_133;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_152.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_153=l9_152;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_154=dot(l9_153,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_155=l9_154;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_155;
}
}
float4 l9_156=float4(l9_152.x,-l9_152.y,(l9_152.z*0.5)+(l9_152.w*0.5),l9_152.w);
out.gl_Position=l9_156;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_158=param_3;
sc_Vertex_t l9_159=l9_158;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_160=l9_159;
float3 l9_161=in.blendShape0Pos;
float3 l9_162=in.blendShape0Normal;
float l9_163=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_164=l9_160;
float3 l9_165=l9_161;
float l9_166=l9_163;
float3 l9_167=l9_164.position.xyz+(l9_165*l9_166);
l9_164.position=float4(l9_167.x,l9_167.y,l9_167.z,l9_164.position.w);
l9_160=l9_164;
l9_160.normal+=(l9_162*l9_163);
l9_159=l9_160;
sc_Vertex_t l9_168=l9_159;
float3 l9_169=in.blendShape1Pos;
float3 l9_170=in.blendShape1Normal;
float l9_171=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_172=l9_168;
float3 l9_173=l9_169;
float l9_174=l9_171;
float3 l9_175=l9_172.position.xyz+(l9_173*l9_174);
l9_172.position=float4(l9_175.x,l9_175.y,l9_175.z,l9_172.position.w);
l9_168=l9_172;
l9_168.normal+=(l9_170*l9_171);
l9_159=l9_168;
sc_Vertex_t l9_176=l9_159;
float3 l9_177=in.blendShape2Pos;
float3 l9_178=in.blendShape2Normal;
float l9_179=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_180=l9_176;
float3 l9_181=l9_177;
float l9_182=l9_179;
float3 l9_183=l9_180.position.xyz+(l9_181*l9_182);
l9_180.position=float4(l9_183.x,l9_183.y,l9_183.z,l9_180.position.w);
l9_176=l9_180;
l9_176.normal+=(l9_178*l9_179);
l9_159=l9_176;
}
else
{
sc_Vertex_t l9_184=l9_159;
float3 l9_185=in.blendShape0Pos;
float l9_186=(*sc_set0.UserUniforms).weights0.x;
float3 l9_187=l9_184.position.xyz+(l9_185*l9_186);
l9_184.position=float4(l9_187.x,l9_187.y,l9_187.z,l9_184.position.w);
l9_159=l9_184;
sc_Vertex_t l9_188=l9_159;
float3 l9_189=in.blendShape1Pos;
float l9_190=(*sc_set0.UserUniforms).weights0.y;
float3 l9_191=l9_188.position.xyz+(l9_189*l9_190);
l9_188.position=float4(l9_191.x,l9_191.y,l9_191.z,l9_188.position.w);
l9_159=l9_188;
sc_Vertex_t l9_192=l9_159;
float3 l9_193=in.blendShape2Pos;
float l9_194=(*sc_set0.UserUniforms).weights0.z;
float3 l9_195=l9_192.position.xyz+(l9_193*l9_194);
l9_192.position=float4(l9_195.x,l9_195.y,l9_195.z,l9_192.position.w);
l9_159=l9_192;
sc_Vertex_t l9_196=l9_159;
float3 l9_197=in.blendShape3Pos;
float l9_198=(*sc_set0.UserUniforms).weights0.w;
float3 l9_199=l9_196.position.xyz+(l9_197*l9_198);
l9_196.position=float4(l9_199.x,l9_199.y,l9_199.z,l9_196.position.w);
l9_159=l9_196;
sc_Vertex_t l9_200=l9_159;
float3 l9_201=in.blendShape4Pos;
float l9_202=(*sc_set0.UserUniforms).weights1.x;
float3 l9_203=l9_200.position.xyz+(l9_201*l9_202);
l9_200.position=float4(l9_203.x,l9_203.y,l9_203.z,l9_200.position.w);
l9_159=l9_200;
sc_Vertex_t l9_204=l9_159;
float3 l9_205=in.blendShape5Pos;
float l9_206=(*sc_set0.UserUniforms).weights1.y;
float3 l9_207=l9_204.position.xyz+(l9_205*l9_206);
l9_204.position=float4(l9_207.x,l9_207.y,l9_207.z,l9_204.position.w);
l9_159=l9_204;
}
}
l9_158=l9_159;
sc_Vertex_t l9_208=l9_158;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_209=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_209=float4(1.0,fract(in.boneData.yzw));
l9_209.x-=dot(l9_209.yzw,float3(1.0));
}
float4 l9_210=l9_209;
float4 l9_211=l9_210;
int l9_212=int(in.boneData.x);
int l9_213=int(in.boneData.y);
int l9_214=int(in.boneData.z);
int l9_215=int(in.boneData.w);
int l9_216=l9_212;
float4 l9_217=l9_208.position;
float3 l9_218=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_219=l9_216;
float4 l9_220=(*sc_set0.sc_BonesUBO).sc_Bones[l9_219].boneMatrix[0];
float4 l9_221=(*sc_set0.sc_BonesUBO).sc_Bones[l9_219].boneMatrix[1];
float4 l9_222=(*sc_set0.sc_BonesUBO).sc_Bones[l9_219].boneMatrix[2];
float4 l9_223[3];
l9_223[0]=l9_220;
l9_223[1]=l9_221;
l9_223[2]=l9_222;
l9_218=float3(dot(l9_217,l9_223[0]),dot(l9_217,l9_223[1]),dot(l9_217,l9_223[2]));
}
else
{
l9_218=l9_217.xyz;
}
float3 l9_224=l9_218;
float3 l9_225=l9_224;
float l9_226=l9_211.x;
int l9_227=l9_213;
float4 l9_228=l9_208.position;
float3 l9_229=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_230=l9_227;
float4 l9_231=(*sc_set0.sc_BonesUBO).sc_Bones[l9_230].boneMatrix[0];
float4 l9_232=(*sc_set0.sc_BonesUBO).sc_Bones[l9_230].boneMatrix[1];
float4 l9_233=(*sc_set0.sc_BonesUBO).sc_Bones[l9_230].boneMatrix[2];
float4 l9_234[3];
l9_234[0]=l9_231;
l9_234[1]=l9_232;
l9_234[2]=l9_233;
l9_229=float3(dot(l9_228,l9_234[0]),dot(l9_228,l9_234[1]),dot(l9_228,l9_234[2]));
}
else
{
l9_229=l9_228.xyz;
}
float3 l9_235=l9_229;
float3 l9_236=l9_235;
float l9_237=l9_211.y;
int l9_238=l9_214;
float4 l9_239=l9_208.position;
float3 l9_240=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_241=l9_238;
float4 l9_242=(*sc_set0.sc_BonesUBO).sc_Bones[l9_241].boneMatrix[0];
float4 l9_243=(*sc_set0.sc_BonesUBO).sc_Bones[l9_241].boneMatrix[1];
float4 l9_244=(*sc_set0.sc_BonesUBO).sc_Bones[l9_241].boneMatrix[2];
float4 l9_245[3];
l9_245[0]=l9_242;
l9_245[1]=l9_243;
l9_245[2]=l9_244;
l9_240=float3(dot(l9_239,l9_245[0]),dot(l9_239,l9_245[1]),dot(l9_239,l9_245[2]));
}
else
{
l9_240=l9_239.xyz;
}
float3 l9_246=l9_240;
float3 l9_247=l9_246;
float l9_248=l9_211.z;
int l9_249=l9_215;
float4 l9_250=l9_208.position;
float3 l9_251=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_252=l9_249;
float4 l9_253=(*sc_set0.sc_BonesUBO).sc_Bones[l9_252].boneMatrix[0];
float4 l9_254=(*sc_set0.sc_BonesUBO).sc_Bones[l9_252].boneMatrix[1];
float4 l9_255=(*sc_set0.sc_BonesUBO).sc_Bones[l9_252].boneMatrix[2];
float4 l9_256[3];
l9_256[0]=l9_253;
l9_256[1]=l9_254;
l9_256[2]=l9_255;
l9_251=float3(dot(l9_250,l9_256[0]),dot(l9_250,l9_256[1]),dot(l9_250,l9_256[2]));
}
else
{
l9_251=l9_250.xyz;
}
float3 l9_257=l9_251;
float3 l9_258=(((l9_225*l9_226)+(l9_236*l9_237))+(l9_247*l9_248))+(l9_257*l9_211.w);
l9_208.position=float4(l9_258.x,l9_258.y,l9_258.z,l9_208.position.w);
int l9_259=l9_212;
float3x3 l9_260=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_259].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_259].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_259].normalMatrix[2].xyz));
float3x3 l9_261=l9_260;
float3x3 l9_262=l9_261;
int l9_263=l9_213;
float3x3 l9_264=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[2].xyz));
float3x3 l9_265=l9_264;
float3x3 l9_266=l9_265;
int l9_267=l9_214;
float3x3 l9_268=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[2].xyz));
float3x3 l9_269=l9_268;
float3x3 l9_270=l9_269;
int l9_271=l9_215;
float3x3 l9_272=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[2].xyz));
float3x3 l9_273=l9_272;
float3x3 l9_274=l9_273;
l9_208.normal=((((l9_262*l9_208.normal)*l9_211.x)+((l9_266*l9_208.normal)*l9_211.y))+((l9_270*l9_208.normal)*l9_211.z))+((l9_274*l9_208.normal)*l9_211.w);
l9_208.tangent=((((l9_262*l9_208.tangent)*l9_211.x)+((l9_266*l9_208.tangent)*l9_211.y))+((l9_270*l9_208.tangent)*l9_211.z))+((l9_274*l9_208.tangent)*l9_211.w);
}
l9_158=l9_208;
float l9_275=(*sc_set0.UserUniforms).voxelization_params_0.y;
float l9_276=(*sc_set0.UserUniforms).voxelization_params_0.z;
float l9_277=(*sc_set0.UserUniforms).voxelization_params_0.w;
float l9_278=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_279=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_280=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_281=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_282=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_283=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float3 l9_284=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float l9_285=l9_275/l9_276;
int l9_286=gl_InstanceIndex;
int l9_287=l9_286;
l9_158.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_158.position;
float3 l9_288=l9_158.position.xyz;
float3 l9_289=float3(float(l9_287%int(l9_277))*l9_275,float(l9_287/int(l9_277))*l9_275,(float(l9_287)*l9_285)+l9_282);
float3 l9_290=l9_288+l9_289;
float4 l9_291=float4(l9_290-l9_284,1.0);
float l9_292=l9_278;
float l9_293=l9_279;
float l9_294=l9_280;
float l9_295=l9_281;
float l9_296=l9_282;
float l9_297=l9_283;
float4x4 l9_298=float4x4(float4(2.0/(l9_293-l9_292),0.0,0.0,(-(l9_293+l9_292))/(l9_293-l9_292)),float4(0.0,2.0/(l9_295-l9_294),0.0,(-(l9_295+l9_294))/(l9_295-l9_294)),float4(0.0,0.0,(-2.0)/(l9_297-l9_296),(-(l9_297+l9_296))/(l9_297-l9_296)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_299=l9_298;
float4 l9_300=l9_299*l9_291;
l9_300.w=1.0;
out.varScreenPos=l9_300;
float4 l9_301=l9_300*1.0;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_301.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_302=l9_301;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_303=dot(l9_302,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_304=l9_303;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_304;
}
}
float4 l9_305=float4(l9_301.x,-l9_301.y,(l9_301.z*0.5)+(l9_301.w*0.5),l9_301.w);
out.gl_Position=l9_305;
param_3=l9_158;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
sc_Vertex_t l9_306=param_3;
sc_Vertex_t l9_307=l9_306;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_308=l9_307;
float3 l9_309=in.blendShape0Pos;
float3 l9_310=in.blendShape0Normal;
float l9_311=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_312=l9_308;
float3 l9_313=l9_309;
float l9_314=l9_311;
float3 l9_315=l9_312.position.xyz+(l9_313*l9_314);
l9_312.position=float4(l9_315.x,l9_315.y,l9_315.z,l9_312.position.w);
l9_308=l9_312;
l9_308.normal+=(l9_310*l9_311);
l9_307=l9_308;
sc_Vertex_t l9_316=l9_307;
float3 l9_317=in.blendShape1Pos;
float3 l9_318=in.blendShape1Normal;
float l9_319=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_320=l9_316;
float3 l9_321=l9_317;
float l9_322=l9_319;
float3 l9_323=l9_320.position.xyz+(l9_321*l9_322);
l9_320.position=float4(l9_323.x,l9_323.y,l9_323.z,l9_320.position.w);
l9_316=l9_320;
l9_316.normal+=(l9_318*l9_319);
l9_307=l9_316;
sc_Vertex_t l9_324=l9_307;
float3 l9_325=in.blendShape2Pos;
float3 l9_326=in.blendShape2Normal;
float l9_327=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_328=l9_324;
float3 l9_329=l9_325;
float l9_330=l9_327;
float3 l9_331=l9_328.position.xyz+(l9_329*l9_330);
l9_328.position=float4(l9_331.x,l9_331.y,l9_331.z,l9_328.position.w);
l9_324=l9_328;
l9_324.normal+=(l9_326*l9_327);
l9_307=l9_324;
}
else
{
sc_Vertex_t l9_332=l9_307;
float3 l9_333=in.blendShape0Pos;
float l9_334=(*sc_set0.UserUniforms).weights0.x;
float3 l9_335=l9_332.position.xyz+(l9_333*l9_334);
l9_332.position=float4(l9_335.x,l9_335.y,l9_335.z,l9_332.position.w);
l9_307=l9_332;
sc_Vertex_t l9_336=l9_307;
float3 l9_337=in.blendShape1Pos;
float l9_338=(*sc_set0.UserUniforms).weights0.y;
float3 l9_339=l9_336.position.xyz+(l9_337*l9_338);
l9_336.position=float4(l9_339.x,l9_339.y,l9_339.z,l9_336.position.w);
l9_307=l9_336;
sc_Vertex_t l9_340=l9_307;
float3 l9_341=in.blendShape2Pos;
float l9_342=(*sc_set0.UserUniforms).weights0.z;
float3 l9_343=l9_340.position.xyz+(l9_341*l9_342);
l9_340.position=float4(l9_343.x,l9_343.y,l9_343.z,l9_340.position.w);
l9_307=l9_340;
sc_Vertex_t l9_344=l9_307;
float3 l9_345=in.blendShape3Pos;
float l9_346=(*sc_set0.UserUniforms).weights0.w;
float3 l9_347=l9_344.position.xyz+(l9_345*l9_346);
l9_344.position=float4(l9_347.x,l9_347.y,l9_347.z,l9_344.position.w);
l9_307=l9_344;
sc_Vertex_t l9_348=l9_307;
float3 l9_349=in.blendShape4Pos;
float l9_350=(*sc_set0.UserUniforms).weights1.x;
float3 l9_351=l9_348.position.xyz+(l9_349*l9_350);
l9_348.position=float4(l9_351.x,l9_351.y,l9_351.z,l9_348.position.w);
l9_307=l9_348;
sc_Vertex_t l9_352=l9_307;
float3 l9_353=in.blendShape5Pos;
float l9_354=(*sc_set0.UserUniforms).weights1.y;
float3 l9_355=l9_352.position.xyz+(l9_353*l9_354);
l9_352.position=float4(l9_355.x,l9_355.y,l9_355.z,l9_352.position.w);
l9_307=l9_352;
}
}
l9_306=l9_307;
sc_Vertex_t l9_356=l9_306;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_357=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_357=float4(1.0,fract(in.boneData.yzw));
l9_357.x-=dot(l9_357.yzw,float3(1.0));
}
float4 l9_358=l9_357;
float4 l9_359=l9_358;
int l9_360=int(in.boneData.x);
int l9_361=int(in.boneData.y);
int l9_362=int(in.boneData.z);
int l9_363=int(in.boneData.w);
int l9_364=l9_360;
float4 l9_365=l9_356.position;
float3 l9_366=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_367=l9_364;
float4 l9_368=(*sc_set0.sc_BonesUBO).sc_Bones[l9_367].boneMatrix[0];
float4 l9_369=(*sc_set0.sc_BonesUBO).sc_Bones[l9_367].boneMatrix[1];
float4 l9_370=(*sc_set0.sc_BonesUBO).sc_Bones[l9_367].boneMatrix[2];
float4 l9_371[3];
l9_371[0]=l9_368;
l9_371[1]=l9_369;
l9_371[2]=l9_370;
l9_366=float3(dot(l9_365,l9_371[0]),dot(l9_365,l9_371[1]),dot(l9_365,l9_371[2]));
}
else
{
l9_366=l9_365.xyz;
}
float3 l9_372=l9_366;
float3 l9_373=l9_372;
float l9_374=l9_359.x;
int l9_375=l9_361;
float4 l9_376=l9_356.position;
float3 l9_377=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_378=l9_375;
float4 l9_379=(*sc_set0.sc_BonesUBO).sc_Bones[l9_378].boneMatrix[0];
float4 l9_380=(*sc_set0.sc_BonesUBO).sc_Bones[l9_378].boneMatrix[1];
float4 l9_381=(*sc_set0.sc_BonesUBO).sc_Bones[l9_378].boneMatrix[2];
float4 l9_382[3];
l9_382[0]=l9_379;
l9_382[1]=l9_380;
l9_382[2]=l9_381;
l9_377=float3(dot(l9_376,l9_382[0]),dot(l9_376,l9_382[1]),dot(l9_376,l9_382[2]));
}
else
{
l9_377=l9_376.xyz;
}
float3 l9_383=l9_377;
float3 l9_384=l9_383;
float l9_385=l9_359.y;
int l9_386=l9_362;
float4 l9_387=l9_356.position;
float3 l9_388=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_389=l9_386;
float4 l9_390=(*sc_set0.sc_BonesUBO).sc_Bones[l9_389].boneMatrix[0];
float4 l9_391=(*sc_set0.sc_BonesUBO).sc_Bones[l9_389].boneMatrix[1];
float4 l9_392=(*sc_set0.sc_BonesUBO).sc_Bones[l9_389].boneMatrix[2];
float4 l9_393[3];
l9_393[0]=l9_390;
l9_393[1]=l9_391;
l9_393[2]=l9_392;
l9_388=float3(dot(l9_387,l9_393[0]),dot(l9_387,l9_393[1]),dot(l9_387,l9_393[2]));
}
else
{
l9_388=l9_387.xyz;
}
float3 l9_394=l9_388;
float3 l9_395=l9_394;
float l9_396=l9_359.z;
int l9_397=l9_363;
float4 l9_398=l9_356.position;
float3 l9_399=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_400=l9_397;
float4 l9_401=(*sc_set0.sc_BonesUBO).sc_Bones[l9_400].boneMatrix[0];
float4 l9_402=(*sc_set0.sc_BonesUBO).sc_Bones[l9_400].boneMatrix[1];
float4 l9_403=(*sc_set0.sc_BonesUBO).sc_Bones[l9_400].boneMatrix[2];
float4 l9_404[3];
l9_404[0]=l9_401;
l9_404[1]=l9_402;
l9_404[2]=l9_403;
l9_399=float3(dot(l9_398,l9_404[0]),dot(l9_398,l9_404[1]),dot(l9_398,l9_404[2]));
}
else
{
l9_399=l9_398.xyz;
}
float3 l9_405=l9_399;
float3 l9_406=(((l9_373*l9_374)+(l9_384*l9_385))+(l9_395*l9_396))+(l9_405*l9_359.w);
l9_356.position=float4(l9_406.x,l9_406.y,l9_406.z,l9_356.position.w);
int l9_407=l9_360;
float3x3 l9_408=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_407].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_407].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_407].normalMatrix[2].xyz));
float3x3 l9_409=l9_408;
float3x3 l9_410=l9_409;
int l9_411=l9_361;
float3x3 l9_412=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[2].xyz));
float3x3 l9_413=l9_412;
float3x3 l9_414=l9_413;
int l9_415=l9_362;
float3x3 l9_416=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[2].xyz));
float3x3 l9_417=l9_416;
float3x3 l9_418=l9_417;
int l9_419=l9_363;
float3x3 l9_420=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[2].xyz));
float3x3 l9_421=l9_420;
float3x3 l9_422=l9_421;
l9_356.normal=((((l9_410*l9_356.normal)*l9_359.x)+((l9_414*l9_356.normal)*l9_359.y))+((l9_418*l9_356.normal)*l9_359.z))+((l9_422*l9_356.normal)*l9_359.w);
l9_356.tangent=((((l9_410*l9_356.tangent)*l9_359.x)+((l9_414*l9_356.tangent)*l9_359.y))+((l9_418*l9_356.tangent)*l9_359.z))+((l9_422*l9_356.tangent)*l9_359.w);
}
l9_306=l9_356;
float3 l9_423=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float2 l9_424=((l9_306.position.xy/float2(l9_306.position.w))*0.5)+float2(0.5);
out.varTex01=float4(l9_424.x,l9_424.y,out.varTex01.z,out.varTex01.w);
l9_306.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_306.position;
float3 l9_425=l9_306.position.xyz-l9_423;
l9_306.position=float4(l9_425.x,l9_425.y,l9_425.z,l9_306.position.w);
out.varPosAndMotion=float4(l9_306.position.xyz.x,l9_306.position.xyz.y,l9_306.position.xyz.z,out.varPosAndMotion.w);
float3 l9_426=normalize(l9_306.normal);
out.varNormalAndMotion=float4(l9_426.x,l9_426.y,l9_426.z,out.varNormalAndMotion.w);
float l9_427=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_428=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_429=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_430=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_431=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_432=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float l9_433=l9_427;
float l9_434=l9_428;
float l9_435=l9_429;
float l9_436=l9_430;
float l9_437=l9_431;
float l9_438=l9_432;
float4x4 l9_439=float4x4(float4(2.0/(l9_434-l9_433),0.0,0.0,(-(l9_434+l9_433))/(l9_434-l9_433)),float4(0.0,2.0/(l9_436-l9_435),0.0,(-(l9_436+l9_435))/(l9_436-l9_435)),float4(0.0,0.0,(-2.0)/(l9_438-l9_437),(-(l9_438+l9_437))/(l9_438-l9_437)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_440=l9_439;
float4 l9_441=float4(0.0);
float3 l9_442=(l9_440*l9_306.position).xyz;
l9_441=float4(l9_442.x,l9_442.y,l9_442.z,l9_441.w);
l9_441.w=1.0;
out.varScreenPos=l9_441;
float4 l9_443=l9_441*1.0;
float4 l9_444=l9_443;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_444.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_445=l9_444;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_446=dot(l9_445,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_447=l9_446;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_447;
}
}
float4 l9_448=float4(l9_444.x,-l9_444.y,(l9_444.z*0.5)+(l9_444.w*0.5),l9_444.w);
out.gl_Position=l9_448;
param_3=l9_306;
}
}
v=param_3;
float3 param_8=out.varPosAndMotion.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
float4 l9_449=((*sc_set0.UserUniforms).sc_PrevFrameModelMatrix*(*sc_set0.UserUniforms).sc_ModelMatrixInverse)*float4(param_8,1.0);
float3 l9_450=param_8;
float3 l9_451=l9_449.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
int l9_452=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_452=0;
}
else
{
l9_452=gl_InstanceIndex%2;
}
int l9_453=l9_452;
float4 l9_454=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_453]*float4(l9_450,1.0);
float2 l9_455=l9_454.xy/float2(l9_454.w);
l9_454=float4(l9_455.x,l9_455.y,l9_454.z,l9_454.w);
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
float4 l9_458=(*sc_set0.UserUniforms).sc_PrevFrameViewProjectionMatrixArray[l9_457]*float4(l9_451,1.0);
float2 l9_459=l9_458.xy/float2(l9_458.w);
l9_458=float4(l9_459.x,l9_459.y,l9_458.z,l9_458.w);
float2 l9_460=(l9_454.xy-l9_458.xy)*0.5;
out.varPosAndMotion.w=l9_460.x;
out.varNormalAndMotion.w=l9_460.y;
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
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
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
float4 baseTexSize;
float4 baseTexDims;
float4 baseTexView;
float3x3 baseTexTransform;
float4 baseTexUvMinMax;
float4 baseTexBorderColor;
float2 boxBounds;
float cornerRadius;
float4 baseTex2Size;
float4 baseTex2Dims;
float4 baseTex2View;
float3x3 baseTex2Transform;
float4 baseTex2UvMinMax;
float4 baseTex2BorderColor;
float state;
float4 baseColor;
float4 strokeColor;
float strokeThickness;
float opacity;
float Port_Value_N057;
float3 Port_Input2_N052;
float Port_Value_N061;
float Port_Input1_N023;
float2 Port_Scale_N013;
float2 Port_Center_N013;
float2 Port_Default_N040;
float2 Port_Import_N032;
float2 Port_Value_N002;
float2 Port_Import_N018;
float2 Port_Input1_N089;
float2 Port_Input2_N089;
float Port_Input0_N036;
float2 Port_Import_N021;
float2 Port_Input1_N028;
float Port_Import_N022;
float Port_Input0_N038;
float Port_Input1_N038;
float4 Port_Import_N104;
float4 Port_Import_N105;
float Port_Input0_N117;
float Port_Input1_N117;
float Port_RangeMinA_N106;
float Port_RangeMaxA_N106;
float Port_RangeMinB_N106;
float Port_RangeMaxB_N106;
float2 Port_Import_N107;
float2 Port_Center_N108;
float2 Port_Import_N109;
float2 Port_Import_N111;
float Port_Input1_N116;
float Port_Input2_N116;
float Port_Input2_N044;
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
constant sc_Bones_obj* sc_BonesUBO [[id(0)]];
texture2d<float> baseTex [[id(1)]];
texture2d<float> baseTex2 [[id(2)]];
texture2d<float> intensityTexture [[id(3)]];
texture2d<float> sc_ScreenTexture [[id(15)]];
sampler baseTex2SmpSC [[id(18)]];
sampler baseTexSmpSC [[id(19)]];
sampler intensityTextureSmpSC [[id(20)]];
sampler sc_ScreenTextureSmpSC [[id(25)]];
constant userUniformsObj* UserUniforms [[id(28)]];
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
Globals.Surface_UVCoord0=in.varTex01.xy;
float4 Result_N66=float4(0.0);
float4 param=float4(0.0);
float4 param_1=float4(0.0);
ssGlobals param_3=Globals;
float4 param_2;
if ((int(Tweak_N67_tmp)!=0))
{
float l9_0=0.0;
float l9_1=(*sc_set0.UserUniforms).Port_Value_N061;
float l9_2=l9_1+0.001;
l9_2-=0.001;
l9_0=l9_2;
float2 l9_3=float2(0.0);
l9_3=param_3.Surface_UVCoord0;
float2 l9_4=float2(0.0);
l9_4=((l9_3-(*sc_set0.UserUniforms).Port_Center_N013)*(*sc_set0.UserUniforms).Port_Scale_N013)+(*sc_set0.UserUniforms).Port_Center_N013;
float2 l9_5=float2(0.0);
float2 l9_6=float2(0.0);
float2 l9_7=(*sc_set0.UserUniforms).Port_Default_N040;
float2 l9_8;
if ((int(Tweak_N65_tmp)!=0))
{
float2 l9_9=float2(0.0);
float2 l9_10=(*sc_set0.UserUniforms).baseTexSize.xy;
l9_9=l9_10;
float2 l9_11=float2(0.0);
float l9_12=0.0;
float l9_13=0.0;
float2 l9_14=l9_9;
float2 l9_15=float2(l9_14);
float l9_16=l9_14.x;
float l9_17=l9_14.y;
l9_11=l9_15;
l9_12=l9_16;
l9_13=l9_17;
float l9_18=0.0;
l9_18=fast::min(l9_12,l9_13);
float2 l9_19=float2(0.0);
l9_19=l9_11/(float2(l9_18)+float2(1.234e-06));
l9_6=l9_19;
l9_8=l9_6;
}
else
{
l9_8=l9_7;
}
l9_5=l9_8;
float2 l9_20=float2(0.0);
l9_20=l9_4*l9_5;
float2 l9_21=float2(0.0);
l9_21=l9_20;
float2 l9_22=float2(0.0);
float2 l9_23=(*sc_set0.UserUniforms).Port_Value_N002;
float2 l9_24=l9_23+float2(0.001);
l9_24-=float2(0.001);
l9_22=l9_24;
float2 l9_25=float2(0.0);
l9_25=l9_22*l9_5;
float2 l9_26=float2(0.0);
l9_26=l9_25;
float2 l9_27=float2(0.0);
l9_27=l9_21-l9_26;
float2 l9_28=float2(0.0);
l9_28=abs(l9_27);
float2 l9_29=float2(0.0);
float2 l9_30=(*sc_set0.UserUniforms).boxBounds;
l9_29=l9_30;
float2 l9_31=float2(0.0);
l9_31=fast::clamp(l9_29,(*sc_set0.UserUniforms).Port_Input1_N089,(*sc_set0.UserUniforms).Port_Input2_N089);
float2 l9_32=float2(0.0);
l9_32=float2((*sc_set0.UserUniforms).Port_Input0_N036)/(l9_5+float2(1.234e-06));
float l9_33=0.0;
float l9_34=(*sc_set0.UserUniforms).cornerRadius;
l9_33=l9_34;
float2 l9_35=float2(0.0);
l9_35=l9_32*float2(l9_33);
float2 l9_36=float2(0.0);
l9_36=l9_31-l9_35;
float2 l9_37=float2(0.0);
l9_37=l9_36*l9_5;
float2 l9_38=float2(0.0);
l9_38=l9_37;
float2 l9_39=float2(0.0);
l9_39=l9_28-l9_38;
float2 l9_40=float2(0.0);
float2 l9_41=l9_39;
float2 l9_42=l9_41;
bool l9_43=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_44;
if (l9_43)
{
l9_44=!PreviewInfo.Saved;
}
else
{
l9_44=l9_43;
}
bool l9_45;
if (l9_44)
{
l9_45=8==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_45=l9_44;
}
if (l9_45)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=float4(l9_42,0.0,1.0);
PreviewInfo.Color.w=1.0;
}
l9_40=l9_42;
float2 l9_46=float2(0.0);
l9_46=fast::max(l9_40,(*sc_set0.UserUniforms).Port_Input1_N028);
float l9_47=0.0;
l9_47=length(l9_46);
float l9_48=0.0;
l9_48=l9_33;
float l9_49=0.0;
l9_49=l9_47-l9_48;
float l9_50=0.0;
l9_50=l9_49;
float l9_51=0.0;
float l9_52=l9_50;
float l9_53=l9_52;
bool l9_54=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_55;
if (l9_54)
{
l9_55=!PreviewInfo.Saved;
}
else
{
l9_55=l9_54;
}
bool l9_56;
if (l9_55)
{
l9_56=10==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_56=l9_55;
}
if (l9_56)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=float4(l9_53,l9_53,l9_53,1.0);
PreviewInfo.Color.w=1.0;
}
l9_51=l9_53;
float l9_57=0.0;
l9_57=smoothstep(l9_0,(*sc_set0.UserUniforms).Port_Input1_N023,l9_51);
float4 l9_58=float4(0.0);
float4 l9_59=float4(0.0);
float4 l9_60=float4(0.0);
ssGlobals l9_61=param_3;
float4 l9_62;
if ((int(Tweak_N65_tmp)!=0))
{
float2 l9_63=float2(0.0);
l9_63=l9_61.Surface_UVCoord0;
float2 l9_64=float2(0.0);
l9_64=((l9_63-(*sc_set0.UserUniforms).Port_Center_N013)*(*sc_set0.UserUniforms).Port_Scale_N013)+(*sc_set0.UserUniforms).Port_Center_N013;
float4 l9_65=float4(0.0);
float2 l9_66=l9_64;
int l9_67;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_68=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_68=0;
}
else
{
l9_68=in.varStereoViewID;
}
int l9_69=l9_68;
l9_67=1-l9_69;
}
else
{
int l9_70=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_70=0;
}
else
{
l9_70=in.varStereoViewID;
}
int l9_71=l9_70;
l9_67=l9_71;
}
int l9_72=l9_67;
int l9_73=baseTexLayout_tmp;
int l9_74=l9_72;
float2 l9_75=l9_66;
bool l9_76=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_77=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_78=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_79=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_80=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_81=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_82=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_83=0.0;
bool l9_84=l9_81&&(!l9_79);
float l9_85=1.0;
float l9_86=l9_75.x;
int l9_87=l9_78.x;
if (l9_87==1)
{
l9_86=fract(l9_86);
}
else
{
if (l9_87==2)
{
float l9_88=fract(l9_86);
float l9_89=l9_86-l9_88;
float l9_90=step(0.25,fract(l9_89*0.5));
l9_86=mix(l9_88,1.0-l9_88,fast::clamp(l9_90,0.0,1.0));
}
}
l9_75.x=l9_86;
float l9_91=l9_75.y;
int l9_92=l9_78.y;
if (l9_92==1)
{
l9_91=fract(l9_91);
}
else
{
if (l9_92==2)
{
float l9_93=fract(l9_91);
float l9_94=l9_91-l9_93;
float l9_95=step(0.25,fract(l9_94*0.5));
l9_91=mix(l9_93,1.0-l9_93,fast::clamp(l9_95,0.0,1.0));
}
}
l9_75.y=l9_91;
if (l9_79)
{
bool l9_96=l9_81;
bool l9_97;
if (l9_96)
{
l9_97=l9_78.x==3;
}
else
{
l9_97=l9_96;
}
float l9_98=l9_75.x;
float l9_99=l9_80.x;
float l9_100=l9_80.z;
bool l9_101=l9_97;
float l9_102=l9_85;
float l9_103=fast::clamp(l9_98,l9_99,l9_100);
float l9_104=step(abs(l9_98-l9_103),9.9999997e-06);
l9_102*=(l9_104+((1.0-float(l9_101))*(1.0-l9_104)));
l9_98=l9_103;
l9_75.x=l9_98;
l9_85=l9_102;
bool l9_105=l9_81;
bool l9_106;
if (l9_105)
{
l9_106=l9_78.y==3;
}
else
{
l9_106=l9_105;
}
float l9_107=l9_75.y;
float l9_108=l9_80.y;
float l9_109=l9_80.w;
bool l9_110=l9_106;
float l9_111=l9_85;
float l9_112=fast::clamp(l9_107,l9_108,l9_109);
float l9_113=step(abs(l9_107-l9_112),9.9999997e-06);
l9_111*=(l9_113+((1.0-float(l9_110))*(1.0-l9_113)));
l9_107=l9_112;
l9_75.y=l9_107;
l9_85=l9_111;
}
float2 l9_114=l9_75;
bool l9_115=l9_76;
float3x3 l9_116=l9_77;
if (l9_115)
{
l9_114=float2((l9_116*float3(l9_114,1.0)).xy);
}
float2 l9_117=l9_114;
l9_75=l9_117;
float l9_118=l9_75.x;
int l9_119=l9_78.x;
bool l9_120=l9_84;
float l9_121=l9_85;
if ((l9_119==0)||(l9_119==3))
{
float l9_122=l9_118;
float l9_123=0.0;
float l9_124=1.0;
bool l9_125=l9_120;
float l9_126=l9_121;
float l9_127=fast::clamp(l9_122,l9_123,l9_124);
float l9_128=step(abs(l9_122-l9_127),9.9999997e-06);
l9_126*=(l9_128+((1.0-float(l9_125))*(1.0-l9_128)));
l9_122=l9_127;
l9_118=l9_122;
l9_121=l9_126;
}
l9_75.x=l9_118;
l9_85=l9_121;
float l9_129=l9_75.y;
int l9_130=l9_78.y;
bool l9_131=l9_84;
float l9_132=l9_85;
if ((l9_130==0)||(l9_130==3))
{
float l9_133=l9_129;
float l9_134=0.0;
float l9_135=1.0;
bool l9_136=l9_131;
float l9_137=l9_132;
float l9_138=fast::clamp(l9_133,l9_134,l9_135);
float l9_139=step(abs(l9_133-l9_138),9.9999997e-06);
l9_137*=(l9_139+((1.0-float(l9_136))*(1.0-l9_139)));
l9_133=l9_138;
l9_129=l9_133;
l9_132=l9_137;
}
l9_75.y=l9_129;
l9_85=l9_132;
float2 l9_140=l9_75;
int l9_141=l9_73;
int l9_142=l9_74;
float l9_143=l9_83;
float2 l9_144=l9_140;
int l9_145=l9_141;
int l9_146=l9_142;
float3 l9_147=float3(0.0);
if (l9_145==0)
{
l9_147=float3(l9_144,0.0);
}
else
{
if (l9_145==1)
{
l9_147=float3(l9_144.x,(l9_144.y*0.5)+(0.5-(float(l9_146)*0.5)),0.0);
}
else
{
l9_147=float3(l9_144,float(l9_146));
}
}
float3 l9_148=l9_147;
float3 l9_149=l9_148;
float4 l9_150=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_149.xy,bias(l9_143));
float4 l9_151=l9_150;
if (l9_81)
{
l9_151=mix(l9_82,l9_151,float4(l9_85));
}
float4 l9_152=l9_151;
float4 l9_153=l9_152;
l9_65=l9_153;
float4 l9_154=float4(0.0);
float2 l9_155=l9_64;
int l9_156;
if ((int(baseTex2HasSwappedViews_tmp)!=0))
{
int l9_157=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_157=0;
}
else
{
l9_157=in.varStereoViewID;
}
int l9_158=l9_157;
l9_156=1-l9_158;
}
else
{
int l9_159=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_159=0;
}
else
{
l9_159=in.varStereoViewID;
}
int l9_160=l9_159;
l9_156=l9_160;
}
int l9_161=l9_156;
int l9_162=baseTex2Layout_tmp;
int l9_163=l9_161;
float2 l9_164=l9_155;
bool l9_165=(int(SC_USE_UV_TRANSFORM_baseTex2_tmp)!=0);
float3x3 l9_166=(*sc_set0.UserUniforms).baseTex2Transform;
int2 l9_167=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex2_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex2_tmp);
bool l9_168=(int(SC_USE_UV_MIN_MAX_baseTex2_tmp)!=0);
float4 l9_169=(*sc_set0.UserUniforms).baseTex2UvMinMax;
bool l9_170=(int(SC_USE_CLAMP_TO_BORDER_baseTex2_tmp)!=0);
float4 l9_171=(*sc_set0.UserUniforms).baseTex2BorderColor;
float l9_172=0.0;
bool l9_173=l9_170&&(!l9_168);
float l9_174=1.0;
float l9_175=l9_164.x;
int l9_176=l9_167.x;
if (l9_176==1)
{
l9_175=fract(l9_175);
}
else
{
if (l9_176==2)
{
float l9_177=fract(l9_175);
float l9_178=l9_175-l9_177;
float l9_179=step(0.25,fract(l9_178*0.5));
l9_175=mix(l9_177,1.0-l9_177,fast::clamp(l9_179,0.0,1.0));
}
}
l9_164.x=l9_175;
float l9_180=l9_164.y;
int l9_181=l9_167.y;
if (l9_181==1)
{
l9_180=fract(l9_180);
}
else
{
if (l9_181==2)
{
float l9_182=fract(l9_180);
float l9_183=l9_180-l9_182;
float l9_184=step(0.25,fract(l9_183*0.5));
l9_180=mix(l9_182,1.0-l9_182,fast::clamp(l9_184,0.0,1.0));
}
}
l9_164.y=l9_180;
if (l9_168)
{
bool l9_185=l9_170;
bool l9_186;
if (l9_185)
{
l9_186=l9_167.x==3;
}
else
{
l9_186=l9_185;
}
float l9_187=l9_164.x;
float l9_188=l9_169.x;
float l9_189=l9_169.z;
bool l9_190=l9_186;
float l9_191=l9_174;
float l9_192=fast::clamp(l9_187,l9_188,l9_189);
float l9_193=step(abs(l9_187-l9_192),9.9999997e-06);
l9_191*=(l9_193+((1.0-float(l9_190))*(1.0-l9_193)));
l9_187=l9_192;
l9_164.x=l9_187;
l9_174=l9_191;
bool l9_194=l9_170;
bool l9_195;
if (l9_194)
{
l9_195=l9_167.y==3;
}
else
{
l9_195=l9_194;
}
float l9_196=l9_164.y;
float l9_197=l9_169.y;
float l9_198=l9_169.w;
bool l9_199=l9_195;
float l9_200=l9_174;
float l9_201=fast::clamp(l9_196,l9_197,l9_198);
float l9_202=step(abs(l9_196-l9_201),9.9999997e-06);
l9_200*=(l9_202+((1.0-float(l9_199))*(1.0-l9_202)));
l9_196=l9_201;
l9_164.y=l9_196;
l9_174=l9_200;
}
float2 l9_203=l9_164;
bool l9_204=l9_165;
float3x3 l9_205=l9_166;
if (l9_204)
{
l9_203=float2((l9_205*float3(l9_203,1.0)).xy);
}
float2 l9_206=l9_203;
l9_164=l9_206;
float l9_207=l9_164.x;
int l9_208=l9_167.x;
bool l9_209=l9_173;
float l9_210=l9_174;
if ((l9_208==0)||(l9_208==3))
{
float l9_211=l9_207;
float l9_212=0.0;
float l9_213=1.0;
bool l9_214=l9_209;
float l9_215=l9_210;
float l9_216=fast::clamp(l9_211,l9_212,l9_213);
float l9_217=step(abs(l9_211-l9_216),9.9999997e-06);
l9_215*=(l9_217+((1.0-float(l9_214))*(1.0-l9_217)));
l9_211=l9_216;
l9_207=l9_211;
l9_210=l9_215;
}
l9_164.x=l9_207;
l9_174=l9_210;
float l9_218=l9_164.y;
int l9_219=l9_167.y;
bool l9_220=l9_173;
float l9_221=l9_174;
if ((l9_219==0)||(l9_219==3))
{
float l9_222=l9_218;
float l9_223=0.0;
float l9_224=1.0;
bool l9_225=l9_220;
float l9_226=l9_221;
float l9_227=fast::clamp(l9_222,l9_223,l9_224);
float l9_228=step(abs(l9_222-l9_227),9.9999997e-06);
l9_226*=(l9_228+((1.0-float(l9_225))*(1.0-l9_228)));
l9_222=l9_227;
l9_218=l9_222;
l9_221=l9_226;
}
l9_164.y=l9_218;
l9_174=l9_221;
float2 l9_229=l9_164;
int l9_230=l9_162;
int l9_231=l9_163;
float l9_232=l9_172;
float2 l9_233=l9_229;
int l9_234=l9_230;
int l9_235=l9_231;
float3 l9_236=float3(0.0);
if (l9_234==0)
{
l9_236=float3(l9_233,0.0);
}
else
{
if (l9_234==1)
{
l9_236=float3(l9_233.x,(l9_233.y*0.5)+(0.5-(float(l9_235)*0.5)),0.0);
}
else
{
l9_236=float3(l9_233,float(l9_235));
}
}
float3 l9_237=l9_236;
float3 l9_238=l9_237;
float4 l9_239=sc_set0.baseTex2.sample(sc_set0.baseTex2SmpSC,l9_238.xy,bias(l9_232));
float4 l9_240=l9_239;
if (l9_170)
{
l9_240=mix(l9_171,l9_240,float4(l9_174));
}
float4 l9_241=l9_240;
float4 l9_242=l9_241;
l9_154=l9_242;
float l9_243=0.0;
float l9_244=(*sc_set0.UserUniforms).state;
l9_243=l9_244;
float4 l9_245=float4(0.0);
l9_245=mix(l9_65,l9_154,float4(l9_243));
float4 l9_246=float4(0.0);
float4 l9_247=(*sc_set0.UserUniforms).baseColor;
l9_246=l9_247;
float4 l9_248=float4(0.0);
l9_248=l9_245*l9_246;
l9_59=l9_248;
l9_62=l9_59;
}
else
{
float4 l9_249=float4(0.0);
float4 l9_250=(*sc_set0.UserUniforms).baseColor;
l9_249=l9_250;
l9_60=l9_249;
l9_62=l9_60;
}
l9_58=l9_62;
float4 l9_251=float4(0.0);
l9_251=float4(l9_57)*l9_58;
float4 l9_252=float4(0.0);
float4 l9_253=(*sc_set0.UserUniforms).strokeColor;
l9_252=l9_253;
float l9_254=0.0;
l9_254=smoothstep((*sc_set0.UserUniforms).Port_Input0_N038,(*sc_set0.UserUniforms).Port_Input1_N038,l9_51);
float l9_255=0.0;
float l9_256=(*sc_set0.UserUniforms).strokeThickness;
l9_255=l9_256;
float l9_257=0.0;
l9_257=l9_0+l9_255;
float l9_258=0.0;
l9_258=smoothstep(l9_257,l9_255,l9_51);
float l9_259=0.0;
l9_259=l9_254*l9_258;
float l9_260=0.0;
float l9_261=l9_259;
float l9_262=l9_261;
bool l9_263=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_264;
if (l9_263)
{
l9_264=!PreviewInfo.Saved;
}
else
{
l9_264=l9_263;
}
bool l9_265;
if (l9_264)
{
l9_265=27==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_265=l9_264;
}
if (l9_265)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=float4(l9_262,l9_262,l9_262,1.0);
PreviewInfo.Color.w=1.0;
}
l9_260=l9_262;
float4 l9_266=float4(0.0);
l9_266=mix(l9_251,l9_252,float4(l9_260));
param=l9_266;
param_2=param;
}
else
{
float l9_267=0.0;
float l9_268=(*sc_set0.UserUniforms).Port_Value_N061;
float l9_269=l9_268+0.001;
l9_269-=0.001;
l9_267=l9_269;
float2 l9_270=float2(0.0);
l9_270=param_3.Surface_UVCoord0;
float2 l9_271=float2(0.0);
l9_271=((l9_270-(*sc_set0.UserUniforms).Port_Center_N013)*(*sc_set0.UserUniforms).Port_Scale_N013)+(*sc_set0.UserUniforms).Port_Center_N013;
float2 l9_272=float2(0.0);
float2 l9_273=float2(0.0);
float2 l9_274=(*sc_set0.UserUniforms).Port_Default_N040;
float2 l9_275;
if ((int(Tweak_N65_tmp)!=0))
{
float2 l9_276=float2(0.0);
float2 l9_277=(*sc_set0.UserUniforms).baseTexSize.xy;
l9_276=l9_277;
float2 l9_278=float2(0.0);
float l9_279=0.0;
float l9_280=0.0;
float2 l9_281=l9_276;
float2 l9_282=float2(l9_281);
float l9_283=l9_281.x;
float l9_284=l9_281.y;
l9_278=l9_282;
l9_279=l9_283;
l9_280=l9_284;
float l9_285=0.0;
l9_285=fast::min(l9_279,l9_280);
float2 l9_286=float2(0.0);
l9_286=l9_278/(float2(l9_285)+float2(1.234e-06));
l9_273=l9_286;
l9_275=l9_273;
}
else
{
l9_275=l9_274;
}
l9_272=l9_275;
float2 l9_287=float2(0.0);
l9_287=l9_271*l9_272;
float2 l9_288=float2(0.0);
l9_288=l9_287;
float2 l9_289=float2(0.0);
float2 l9_290=(*sc_set0.UserUniforms).Port_Value_N002;
float2 l9_291=l9_290+float2(0.001);
l9_291-=float2(0.001);
l9_289=l9_291;
float2 l9_292=float2(0.0);
l9_292=l9_289*l9_272;
float2 l9_293=float2(0.0);
l9_293=l9_292;
float2 l9_294=float2(0.0);
l9_294=l9_288-l9_293;
float2 l9_295=float2(0.0);
l9_295=abs(l9_294);
float2 l9_296=float2(0.0);
float2 l9_297=(*sc_set0.UserUniforms).boxBounds;
l9_296=l9_297;
float2 l9_298=float2(0.0);
l9_298=fast::clamp(l9_296,(*sc_set0.UserUniforms).Port_Input1_N089,(*sc_set0.UserUniforms).Port_Input2_N089);
float2 l9_299=float2(0.0);
l9_299=float2((*sc_set0.UserUniforms).Port_Input0_N036)/(l9_272+float2(1.234e-06));
float l9_300=0.0;
float l9_301=(*sc_set0.UserUniforms).cornerRadius;
l9_300=l9_301;
float2 l9_302=float2(0.0);
l9_302=l9_299*float2(l9_300);
float2 l9_303=float2(0.0);
l9_303=l9_298-l9_302;
float2 l9_304=float2(0.0);
l9_304=l9_303*l9_272;
float2 l9_305=float2(0.0);
l9_305=l9_304;
float2 l9_306=float2(0.0);
l9_306=l9_295-l9_305;
float2 l9_307=float2(0.0);
float2 l9_308=l9_306;
float2 l9_309=l9_308;
bool l9_310=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_311;
if (l9_310)
{
l9_311=!PreviewInfo.Saved;
}
else
{
l9_311=l9_310;
}
bool l9_312;
if (l9_311)
{
l9_312=8==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_312=l9_311;
}
if (l9_312)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=float4(l9_309,0.0,1.0);
PreviewInfo.Color.w=1.0;
}
l9_307=l9_309;
float2 l9_313=float2(0.0);
l9_313=fast::max(l9_307,(*sc_set0.UserUniforms).Port_Input1_N028);
float l9_314=0.0;
l9_314=length(l9_313);
float l9_315=0.0;
l9_315=l9_300;
float l9_316=0.0;
l9_316=l9_314-l9_315;
float l9_317=0.0;
l9_317=l9_316;
float l9_318=0.0;
float l9_319=l9_317;
float l9_320=l9_319;
bool l9_321=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_322;
if (l9_321)
{
l9_322=!PreviewInfo.Saved;
}
else
{
l9_322=l9_321;
}
bool l9_323;
if (l9_322)
{
l9_323=10==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_323=l9_322;
}
if (l9_323)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=float4(l9_320,l9_320,l9_320,1.0);
PreviewInfo.Color.w=1.0;
}
l9_318=l9_320;
float l9_324=0.0;
l9_324=smoothstep(l9_267,(*sc_set0.UserUniforms).Port_Input1_N023,l9_318);
float4 l9_325=float4(0.0);
float4 l9_326=float4(0.0);
float4 l9_327=float4(0.0);
ssGlobals l9_328=param_3;
float4 l9_329;
if ((int(Tweak_N65_tmp)!=0))
{
float2 l9_330=float2(0.0);
l9_330=l9_328.Surface_UVCoord0;
float2 l9_331=float2(0.0);
l9_331=((l9_330-(*sc_set0.UserUniforms).Port_Center_N013)*(*sc_set0.UserUniforms).Port_Scale_N013)+(*sc_set0.UserUniforms).Port_Center_N013;
float4 l9_332=float4(0.0);
float2 l9_333=l9_331;
int l9_334;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_335=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_335=0;
}
else
{
l9_335=in.varStereoViewID;
}
int l9_336=l9_335;
l9_334=1-l9_336;
}
else
{
int l9_337=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_337=0;
}
else
{
l9_337=in.varStereoViewID;
}
int l9_338=l9_337;
l9_334=l9_338;
}
int l9_339=l9_334;
int l9_340=baseTexLayout_tmp;
int l9_341=l9_339;
float2 l9_342=l9_333;
bool l9_343=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_344=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_345=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_346=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_347=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_348=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_349=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_350=0.0;
bool l9_351=l9_348&&(!l9_346);
float l9_352=1.0;
float l9_353=l9_342.x;
int l9_354=l9_345.x;
if (l9_354==1)
{
l9_353=fract(l9_353);
}
else
{
if (l9_354==2)
{
float l9_355=fract(l9_353);
float l9_356=l9_353-l9_355;
float l9_357=step(0.25,fract(l9_356*0.5));
l9_353=mix(l9_355,1.0-l9_355,fast::clamp(l9_357,0.0,1.0));
}
}
l9_342.x=l9_353;
float l9_358=l9_342.y;
int l9_359=l9_345.y;
if (l9_359==1)
{
l9_358=fract(l9_358);
}
else
{
if (l9_359==2)
{
float l9_360=fract(l9_358);
float l9_361=l9_358-l9_360;
float l9_362=step(0.25,fract(l9_361*0.5));
l9_358=mix(l9_360,1.0-l9_360,fast::clamp(l9_362,0.0,1.0));
}
}
l9_342.y=l9_358;
if (l9_346)
{
bool l9_363=l9_348;
bool l9_364;
if (l9_363)
{
l9_364=l9_345.x==3;
}
else
{
l9_364=l9_363;
}
float l9_365=l9_342.x;
float l9_366=l9_347.x;
float l9_367=l9_347.z;
bool l9_368=l9_364;
float l9_369=l9_352;
float l9_370=fast::clamp(l9_365,l9_366,l9_367);
float l9_371=step(abs(l9_365-l9_370),9.9999997e-06);
l9_369*=(l9_371+((1.0-float(l9_368))*(1.0-l9_371)));
l9_365=l9_370;
l9_342.x=l9_365;
l9_352=l9_369;
bool l9_372=l9_348;
bool l9_373;
if (l9_372)
{
l9_373=l9_345.y==3;
}
else
{
l9_373=l9_372;
}
float l9_374=l9_342.y;
float l9_375=l9_347.y;
float l9_376=l9_347.w;
bool l9_377=l9_373;
float l9_378=l9_352;
float l9_379=fast::clamp(l9_374,l9_375,l9_376);
float l9_380=step(abs(l9_374-l9_379),9.9999997e-06);
l9_378*=(l9_380+((1.0-float(l9_377))*(1.0-l9_380)));
l9_374=l9_379;
l9_342.y=l9_374;
l9_352=l9_378;
}
float2 l9_381=l9_342;
bool l9_382=l9_343;
float3x3 l9_383=l9_344;
if (l9_382)
{
l9_381=float2((l9_383*float3(l9_381,1.0)).xy);
}
float2 l9_384=l9_381;
l9_342=l9_384;
float l9_385=l9_342.x;
int l9_386=l9_345.x;
bool l9_387=l9_351;
float l9_388=l9_352;
if ((l9_386==0)||(l9_386==3))
{
float l9_389=l9_385;
float l9_390=0.0;
float l9_391=1.0;
bool l9_392=l9_387;
float l9_393=l9_388;
float l9_394=fast::clamp(l9_389,l9_390,l9_391);
float l9_395=step(abs(l9_389-l9_394),9.9999997e-06);
l9_393*=(l9_395+((1.0-float(l9_392))*(1.0-l9_395)));
l9_389=l9_394;
l9_385=l9_389;
l9_388=l9_393;
}
l9_342.x=l9_385;
l9_352=l9_388;
float l9_396=l9_342.y;
int l9_397=l9_345.y;
bool l9_398=l9_351;
float l9_399=l9_352;
if ((l9_397==0)||(l9_397==3))
{
float l9_400=l9_396;
float l9_401=0.0;
float l9_402=1.0;
bool l9_403=l9_398;
float l9_404=l9_399;
float l9_405=fast::clamp(l9_400,l9_401,l9_402);
float l9_406=step(abs(l9_400-l9_405),9.9999997e-06);
l9_404*=(l9_406+((1.0-float(l9_403))*(1.0-l9_406)));
l9_400=l9_405;
l9_396=l9_400;
l9_399=l9_404;
}
l9_342.y=l9_396;
l9_352=l9_399;
float2 l9_407=l9_342;
int l9_408=l9_340;
int l9_409=l9_341;
float l9_410=l9_350;
float2 l9_411=l9_407;
int l9_412=l9_408;
int l9_413=l9_409;
float3 l9_414=float3(0.0);
if (l9_412==0)
{
l9_414=float3(l9_411,0.0);
}
else
{
if (l9_412==1)
{
l9_414=float3(l9_411.x,(l9_411.y*0.5)+(0.5-(float(l9_413)*0.5)),0.0);
}
else
{
l9_414=float3(l9_411,float(l9_413));
}
}
float3 l9_415=l9_414;
float3 l9_416=l9_415;
float4 l9_417=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_416.xy,bias(l9_410));
float4 l9_418=l9_417;
if (l9_348)
{
l9_418=mix(l9_349,l9_418,float4(l9_352));
}
float4 l9_419=l9_418;
float4 l9_420=l9_419;
l9_332=l9_420;
float4 l9_421=float4(0.0);
float2 l9_422=l9_331;
int l9_423;
if ((int(baseTex2HasSwappedViews_tmp)!=0))
{
int l9_424=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_424=0;
}
else
{
l9_424=in.varStereoViewID;
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
l9_426=in.varStereoViewID;
}
int l9_427=l9_426;
l9_423=l9_427;
}
int l9_428=l9_423;
int l9_429=baseTex2Layout_tmp;
int l9_430=l9_428;
float2 l9_431=l9_422;
bool l9_432=(int(SC_USE_UV_TRANSFORM_baseTex2_tmp)!=0);
float3x3 l9_433=(*sc_set0.UserUniforms).baseTex2Transform;
int2 l9_434=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex2_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex2_tmp);
bool l9_435=(int(SC_USE_UV_MIN_MAX_baseTex2_tmp)!=0);
float4 l9_436=(*sc_set0.UserUniforms).baseTex2UvMinMax;
bool l9_437=(int(SC_USE_CLAMP_TO_BORDER_baseTex2_tmp)!=0);
float4 l9_438=(*sc_set0.UserUniforms).baseTex2BorderColor;
float l9_439=0.0;
bool l9_440=l9_437&&(!l9_435);
float l9_441=1.0;
float l9_442=l9_431.x;
int l9_443=l9_434.x;
if (l9_443==1)
{
l9_442=fract(l9_442);
}
else
{
if (l9_443==2)
{
float l9_444=fract(l9_442);
float l9_445=l9_442-l9_444;
float l9_446=step(0.25,fract(l9_445*0.5));
l9_442=mix(l9_444,1.0-l9_444,fast::clamp(l9_446,0.0,1.0));
}
}
l9_431.x=l9_442;
float l9_447=l9_431.y;
int l9_448=l9_434.y;
if (l9_448==1)
{
l9_447=fract(l9_447);
}
else
{
if (l9_448==2)
{
float l9_449=fract(l9_447);
float l9_450=l9_447-l9_449;
float l9_451=step(0.25,fract(l9_450*0.5));
l9_447=mix(l9_449,1.0-l9_449,fast::clamp(l9_451,0.0,1.0));
}
}
l9_431.y=l9_447;
if (l9_435)
{
bool l9_452=l9_437;
bool l9_453;
if (l9_452)
{
l9_453=l9_434.x==3;
}
else
{
l9_453=l9_452;
}
float l9_454=l9_431.x;
float l9_455=l9_436.x;
float l9_456=l9_436.z;
bool l9_457=l9_453;
float l9_458=l9_441;
float l9_459=fast::clamp(l9_454,l9_455,l9_456);
float l9_460=step(abs(l9_454-l9_459),9.9999997e-06);
l9_458*=(l9_460+((1.0-float(l9_457))*(1.0-l9_460)));
l9_454=l9_459;
l9_431.x=l9_454;
l9_441=l9_458;
bool l9_461=l9_437;
bool l9_462;
if (l9_461)
{
l9_462=l9_434.y==3;
}
else
{
l9_462=l9_461;
}
float l9_463=l9_431.y;
float l9_464=l9_436.y;
float l9_465=l9_436.w;
bool l9_466=l9_462;
float l9_467=l9_441;
float l9_468=fast::clamp(l9_463,l9_464,l9_465);
float l9_469=step(abs(l9_463-l9_468),9.9999997e-06);
l9_467*=(l9_469+((1.0-float(l9_466))*(1.0-l9_469)));
l9_463=l9_468;
l9_431.y=l9_463;
l9_441=l9_467;
}
float2 l9_470=l9_431;
bool l9_471=l9_432;
float3x3 l9_472=l9_433;
if (l9_471)
{
l9_470=float2((l9_472*float3(l9_470,1.0)).xy);
}
float2 l9_473=l9_470;
l9_431=l9_473;
float l9_474=l9_431.x;
int l9_475=l9_434.x;
bool l9_476=l9_440;
float l9_477=l9_441;
if ((l9_475==0)||(l9_475==3))
{
float l9_478=l9_474;
float l9_479=0.0;
float l9_480=1.0;
bool l9_481=l9_476;
float l9_482=l9_477;
float l9_483=fast::clamp(l9_478,l9_479,l9_480);
float l9_484=step(abs(l9_478-l9_483),9.9999997e-06);
l9_482*=(l9_484+((1.0-float(l9_481))*(1.0-l9_484)));
l9_478=l9_483;
l9_474=l9_478;
l9_477=l9_482;
}
l9_431.x=l9_474;
l9_441=l9_477;
float l9_485=l9_431.y;
int l9_486=l9_434.y;
bool l9_487=l9_440;
float l9_488=l9_441;
if ((l9_486==0)||(l9_486==3))
{
float l9_489=l9_485;
float l9_490=0.0;
float l9_491=1.0;
bool l9_492=l9_487;
float l9_493=l9_488;
float l9_494=fast::clamp(l9_489,l9_490,l9_491);
float l9_495=step(abs(l9_489-l9_494),9.9999997e-06);
l9_493*=(l9_495+((1.0-float(l9_492))*(1.0-l9_495)));
l9_489=l9_494;
l9_485=l9_489;
l9_488=l9_493;
}
l9_431.y=l9_485;
l9_441=l9_488;
float2 l9_496=l9_431;
int l9_497=l9_429;
int l9_498=l9_430;
float l9_499=l9_439;
float2 l9_500=l9_496;
int l9_501=l9_497;
int l9_502=l9_498;
float3 l9_503=float3(0.0);
if (l9_501==0)
{
l9_503=float3(l9_500,0.0);
}
else
{
if (l9_501==1)
{
l9_503=float3(l9_500.x,(l9_500.y*0.5)+(0.5-(float(l9_502)*0.5)),0.0);
}
else
{
l9_503=float3(l9_500,float(l9_502));
}
}
float3 l9_504=l9_503;
float3 l9_505=l9_504;
float4 l9_506=sc_set0.baseTex2.sample(sc_set0.baseTex2SmpSC,l9_505.xy,bias(l9_499));
float4 l9_507=l9_506;
if (l9_437)
{
l9_507=mix(l9_438,l9_507,float4(l9_441));
}
float4 l9_508=l9_507;
float4 l9_509=l9_508;
l9_421=l9_509;
float l9_510=0.0;
float l9_511=(*sc_set0.UserUniforms).state;
l9_510=l9_511;
float4 l9_512=float4(0.0);
l9_512=mix(l9_332,l9_421,float4(l9_510));
float4 l9_513=float4(0.0);
float4 l9_514=(*sc_set0.UserUniforms).baseColor;
l9_513=l9_514;
float4 l9_515=float4(0.0);
l9_515=l9_512*l9_513;
l9_326=l9_515;
l9_329=l9_326;
}
else
{
float4 l9_516=float4(0.0);
float4 l9_517=(*sc_set0.UserUniforms).baseColor;
l9_516=l9_517;
l9_327=l9_516;
l9_329=l9_327;
}
l9_325=l9_329;
float4 l9_518=float4(0.0);
l9_518=float4(l9_324)*l9_325;
param_1=l9_518;
param_2=param_1;
}
Result_N66=param_2;
float3 Value1_N1=float3(0.0);
float4 param_4=Result_N66;
float3 param_5=param_4.xyz;
Value1_N1=param_5;
float4 Output_N44=float4(0.0);
float4 param_6=float4(1.0);
float param_7=(*sc_set0.UserUniforms).Port_Input2_N044;
ssGlobals param_9=Globals;
float4 param_8;
if ((int(Tweak_N45_tmp)!=0))
{
float4 l9_519=float4(0.0);
float4 l9_520=float4(0.0);
float4 l9_521=float4(0.0);
ssGlobals l9_522=param_9;
float4 l9_523;
if ((int(Tweak_N67_tmp)!=0))
{
float l9_524=0.0;
float l9_525=(*sc_set0.UserUniforms).Port_Value_N061;
float l9_526=l9_525+0.001;
l9_526-=0.001;
l9_524=l9_526;
float2 l9_527=float2(0.0);
l9_527=l9_522.Surface_UVCoord0;
float2 l9_528=float2(0.0);
l9_528=((l9_527-(*sc_set0.UserUniforms).Port_Center_N013)*(*sc_set0.UserUniforms).Port_Scale_N013)+(*sc_set0.UserUniforms).Port_Center_N013;
float2 l9_529=float2(0.0);
float2 l9_530=float2(0.0);
float2 l9_531=(*sc_set0.UserUniforms).Port_Default_N040;
float2 l9_532;
if ((int(Tweak_N65_tmp)!=0))
{
float2 l9_533=float2(0.0);
float2 l9_534=(*sc_set0.UserUniforms).baseTexSize.xy;
l9_533=l9_534;
float2 l9_535=float2(0.0);
float l9_536=0.0;
float l9_537=0.0;
float2 l9_538=l9_533;
float2 l9_539=float2(l9_538);
float l9_540=l9_538.x;
float l9_541=l9_538.y;
l9_535=l9_539;
l9_536=l9_540;
l9_537=l9_541;
float l9_542=0.0;
l9_542=fast::min(l9_536,l9_537);
float2 l9_543=float2(0.0);
l9_543=l9_535/(float2(l9_542)+float2(1.234e-06));
l9_530=l9_543;
l9_532=l9_530;
}
else
{
l9_532=l9_531;
}
l9_529=l9_532;
float2 l9_544=float2(0.0);
l9_544=l9_528*l9_529;
float2 l9_545=float2(0.0);
l9_545=l9_544;
float2 l9_546=float2(0.0);
float2 l9_547=(*sc_set0.UserUniforms).Port_Value_N002;
float2 l9_548=l9_547+float2(0.001);
l9_548-=float2(0.001);
l9_546=l9_548;
float2 l9_549=float2(0.0);
l9_549=l9_546*l9_529;
float2 l9_550=float2(0.0);
l9_550=l9_549;
float2 l9_551=float2(0.0);
l9_551=l9_545-l9_550;
float2 l9_552=float2(0.0);
l9_552=abs(l9_551);
float2 l9_553=float2(0.0);
float2 l9_554=(*sc_set0.UserUniforms).boxBounds;
l9_553=l9_554;
float2 l9_555=float2(0.0);
l9_555=fast::clamp(l9_553,(*sc_set0.UserUniforms).Port_Input1_N089,(*sc_set0.UserUniforms).Port_Input2_N089);
float2 l9_556=float2(0.0);
l9_556=float2((*sc_set0.UserUniforms).Port_Input0_N036)/(l9_529+float2(1.234e-06));
float l9_557=0.0;
float l9_558=(*sc_set0.UserUniforms).cornerRadius;
l9_557=l9_558;
float2 l9_559=float2(0.0);
l9_559=l9_556*float2(l9_557);
float2 l9_560=float2(0.0);
l9_560=l9_555-l9_559;
float2 l9_561=float2(0.0);
l9_561=l9_560*l9_529;
float2 l9_562=float2(0.0);
l9_562=l9_561;
float2 l9_563=float2(0.0);
l9_563=l9_552-l9_562;
float2 l9_564=float2(0.0);
float2 l9_565=l9_563;
float2 l9_566=l9_565;
bool l9_567=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_568;
if (l9_567)
{
l9_568=!PreviewInfo.Saved;
}
else
{
l9_568=l9_567;
}
bool l9_569;
if (l9_568)
{
l9_569=8==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_569=l9_568;
}
if (l9_569)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=float4(l9_566,0.0,1.0);
PreviewInfo.Color.w=1.0;
}
l9_564=l9_566;
float2 l9_570=float2(0.0);
l9_570=fast::max(l9_564,(*sc_set0.UserUniforms).Port_Input1_N028);
float l9_571=0.0;
l9_571=length(l9_570);
float l9_572=0.0;
l9_572=l9_557;
float l9_573=0.0;
l9_573=l9_571-l9_572;
float l9_574=0.0;
l9_574=l9_573;
float l9_575=0.0;
float l9_576=l9_574;
float l9_577=l9_576;
bool l9_578=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_579;
if (l9_578)
{
l9_579=!PreviewInfo.Saved;
}
else
{
l9_579=l9_578;
}
bool l9_580;
if (l9_579)
{
l9_580=10==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_580=l9_579;
}
if (l9_580)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=float4(l9_577,l9_577,l9_577,1.0);
PreviewInfo.Color.w=1.0;
}
l9_575=l9_577;
float l9_581=0.0;
l9_581=smoothstep(l9_524,(*sc_set0.UserUniforms).Port_Input1_N023,l9_575);
float4 l9_582=float4(0.0);
float4 l9_583=float4(0.0);
float4 l9_584=float4(0.0);
ssGlobals l9_585=l9_522;
float4 l9_586;
if ((int(Tweak_N65_tmp)!=0))
{
float2 l9_587=float2(0.0);
l9_587=l9_585.Surface_UVCoord0;
float2 l9_588=float2(0.0);
l9_588=((l9_587-(*sc_set0.UserUniforms).Port_Center_N013)*(*sc_set0.UserUniforms).Port_Scale_N013)+(*sc_set0.UserUniforms).Port_Center_N013;
float4 l9_589=float4(0.0);
float2 l9_590=l9_588;
int l9_591;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_592=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_592=0;
}
else
{
l9_592=in.varStereoViewID;
}
int l9_593=l9_592;
l9_591=1-l9_593;
}
else
{
int l9_594=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_594=0;
}
else
{
l9_594=in.varStereoViewID;
}
int l9_595=l9_594;
l9_591=l9_595;
}
int l9_596=l9_591;
int l9_597=baseTexLayout_tmp;
int l9_598=l9_596;
float2 l9_599=l9_590;
bool l9_600=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_601=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_602=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_603=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_604=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_605=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_606=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_607=0.0;
bool l9_608=l9_605&&(!l9_603);
float l9_609=1.0;
float l9_610=l9_599.x;
int l9_611=l9_602.x;
if (l9_611==1)
{
l9_610=fract(l9_610);
}
else
{
if (l9_611==2)
{
float l9_612=fract(l9_610);
float l9_613=l9_610-l9_612;
float l9_614=step(0.25,fract(l9_613*0.5));
l9_610=mix(l9_612,1.0-l9_612,fast::clamp(l9_614,0.0,1.0));
}
}
l9_599.x=l9_610;
float l9_615=l9_599.y;
int l9_616=l9_602.y;
if (l9_616==1)
{
l9_615=fract(l9_615);
}
else
{
if (l9_616==2)
{
float l9_617=fract(l9_615);
float l9_618=l9_615-l9_617;
float l9_619=step(0.25,fract(l9_618*0.5));
l9_615=mix(l9_617,1.0-l9_617,fast::clamp(l9_619,0.0,1.0));
}
}
l9_599.y=l9_615;
if (l9_603)
{
bool l9_620=l9_605;
bool l9_621;
if (l9_620)
{
l9_621=l9_602.x==3;
}
else
{
l9_621=l9_620;
}
float l9_622=l9_599.x;
float l9_623=l9_604.x;
float l9_624=l9_604.z;
bool l9_625=l9_621;
float l9_626=l9_609;
float l9_627=fast::clamp(l9_622,l9_623,l9_624);
float l9_628=step(abs(l9_622-l9_627),9.9999997e-06);
l9_626*=(l9_628+((1.0-float(l9_625))*(1.0-l9_628)));
l9_622=l9_627;
l9_599.x=l9_622;
l9_609=l9_626;
bool l9_629=l9_605;
bool l9_630;
if (l9_629)
{
l9_630=l9_602.y==3;
}
else
{
l9_630=l9_629;
}
float l9_631=l9_599.y;
float l9_632=l9_604.y;
float l9_633=l9_604.w;
bool l9_634=l9_630;
float l9_635=l9_609;
float l9_636=fast::clamp(l9_631,l9_632,l9_633);
float l9_637=step(abs(l9_631-l9_636),9.9999997e-06);
l9_635*=(l9_637+((1.0-float(l9_634))*(1.0-l9_637)));
l9_631=l9_636;
l9_599.y=l9_631;
l9_609=l9_635;
}
float2 l9_638=l9_599;
bool l9_639=l9_600;
float3x3 l9_640=l9_601;
if (l9_639)
{
l9_638=float2((l9_640*float3(l9_638,1.0)).xy);
}
float2 l9_641=l9_638;
l9_599=l9_641;
float l9_642=l9_599.x;
int l9_643=l9_602.x;
bool l9_644=l9_608;
float l9_645=l9_609;
if ((l9_643==0)||(l9_643==3))
{
float l9_646=l9_642;
float l9_647=0.0;
float l9_648=1.0;
bool l9_649=l9_644;
float l9_650=l9_645;
float l9_651=fast::clamp(l9_646,l9_647,l9_648);
float l9_652=step(abs(l9_646-l9_651),9.9999997e-06);
l9_650*=(l9_652+((1.0-float(l9_649))*(1.0-l9_652)));
l9_646=l9_651;
l9_642=l9_646;
l9_645=l9_650;
}
l9_599.x=l9_642;
l9_609=l9_645;
float l9_653=l9_599.y;
int l9_654=l9_602.y;
bool l9_655=l9_608;
float l9_656=l9_609;
if ((l9_654==0)||(l9_654==3))
{
float l9_657=l9_653;
float l9_658=0.0;
float l9_659=1.0;
bool l9_660=l9_655;
float l9_661=l9_656;
float l9_662=fast::clamp(l9_657,l9_658,l9_659);
float l9_663=step(abs(l9_657-l9_662),9.9999997e-06);
l9_661*=(l9_663+((1.0-float(l9_660))*(1.0-l9_663)));
l9_657=l9_662;
l9_653=l9_657;
l9_656=l9_661;
}
l9_599.y=l9_653;
l9_609=l9_656;
float2 l9_664=l9_599;
int l9_665=l9_597;
int l9_666=l9_598;
float l9_667=l9_607;
float2 l9_668=l9_664;
int l9_669=l9_665;
int l9_670=l9_666;
float3 l9_671=float3(0.0);
if (l9_669==0)
{
l9_671=float3(l9_668,0.0);
}
else
{
if (l9_669==1)
{
l9_671=float3(l9_668.x,(l9_668.y*0.5)+(0.5-(float(l9_670)*0.5)),0.0);
}
else
{
l9_671=float3(l9_668,float(l9_670));
}
}
float3 l9_672=l9_671;
float3 l9_673=l9_672;
float4 l9_674=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_673.xy,bias(l9_667));
float4 l9_675=l9_674;
if (l9_605)
{
l9_675=mix(l9_606,l9_675,float4(l9_609));
}
float4 l9_676=l9_675;
float4 l9_677=l9_676;
l9_589=l9_677;
float4 l9_678=float4(0.0);
float2 l9_679=l9_588;
int l9_680;
if ((int(baseTex2HasSwappedViews_tmp)!=0))
{
int l9_681=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_681=0;
}
else
{
l9_681=in.varStereoViewID;
}
int l9_682=l9_681;
l9_680=1-l9_682;
}
else
{
int l9_683=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_683=0;
}
else
{
l9_683=in.varStereoViewID;
}
int l9_684=l9_683;
l9_680=l9_684;
}
int l9_685=l9_680;
int l9_686=baseTex2Layout_tmp;
int l9_687=l9_685;
float2 l9_688=l9_679;
bool l9_689=(int(SC_USE_UV_TRANSFORM_baseTex2_tmp)!=0);
float3x3 l9_690=(*sc_set0.UserUniforms).baseTex2Transform;
int2 l9_691=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex2_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex2_tmp);
bool l9_692=(int(SC_USE_UV_MIN_MAX_baseTex2_tmp)!=0);
float4 l9_693=(*sc_set0.UserUniforms).baseTex2UvMinMax;
bool l9_694=(int(SC_USE_CLAMP_TO_BORDER_baseTex2_tmp)!=0);
float4 l9_695=(*sc_set0.UserUniforms).baseTex2BorderColor;
float l9_696=0.0;
bool l9_697=l9_694&&(!l9_692);
float l9_698=1.0;
float l9_699=l9_688.x;
int l9_700=l9_691.x;
if (l9_700==1)
{
l9_699=fract(l9_699);
}
else
{
if (l9_700==2)
{
float l9_701=fract(l9_699);
float l9_702=l9_699-l9_701;
float l9_703=step(0.25,fract(l9_702*0.5));
l9_699=mix(l9_701,1.0-l9_701,fast::clamp(l9_703,0.0,1.0));
}
}
l9_688.x=l9_699;
float l9_704=l9_688.y;
int l9_705=l9_691.y;
if (l9_705==1)
{
l9_704=fract(l9_704);
}
else
{
if (l9_705==2)
{
float l9_706=fract(l9_704);
float l9_707=l9_704-l9_706;
float l9_708=step(0.25,fract(l9_707*0.5));
l9_704=mix(l9_706,1.0-l9_706,fast::clamp(l9_708,0.0,1.0));
}
}
l9_688.y=l9_704;
if (l9_692)
{
bool l9_709=l9_694;
bool l9_710;
if (l9_709)
{
l9_710=l9_691.x==3;
}
else
{
l9_710=l9_709;
}
float l9_711=l9_688.x;
float l9_712=l9_693.x;
float l9_713=l9_693.z;
bool l9_714=l9_710;
float l9_715=l9_698;
float l9_716=fast::clamp(l9_711,l9_712,l9_713);
float l9_717=step(abs(l9_711-l9_716),9.9999997e-06);
l9_715*=(l9_717+((1.0-float(l9_714))*(1.0-l9_717)));
l9_711=l9_716;
l9_688.x=l9_711;
l9_698=l9_715;
bool l9_718=l9_694;
bool l9_719;
if (l9_718)
{
l9_719=l9_691.y==3;
}
else
{
l9_719=l9_718;
}
float l9_720=l9_688.y;
float l9_721=l9_693.y;
float l9_722=l9_693.w;
bool l9_723=l9_719;
float l9_724=l9_698;
float l9_725=fast::clamp(l9_720,l9_721,l9_722);
float l9_726=step(abs(l9_720-l9_725),9.9999997e-06);
l9_724*=(l9_726+((1.0-float(l9_723))*(1.0-l9_726)));
l9_720=l9_725;
l9_688.y=l9_720;
l9_698=l9_724;
}
float2 l9_727=l9_688;
bool l9_728=l9_689;
float3x3 l9_729=l9_690;
if (l9_728)
{
l9_727=float2((l9_729*float3(l9_727,1.0)).xy);
}
float2 l9_730=l9_727;
l9_688=l9_730;
float l9_731=l9_688.x;
int l9_732=l9_691.x;
bool l9_733=l9_697;
float l9_734=l9_698;
if ((l9_732==0)||(l9_732==3))
{
float l9_735=l9_731;
float l9_736=0.0;
float l9_737=1.0;
bool l9_738=l9_733;
float l9_739=l9_734;
float l9_740=fast::clamp(l9_735,l9_736,l9_737);
float l9_741=step(abs(l9_735-l9_740),9.9999997e-06);
l9_739*=(l9_741+((1.0-float(l9_738))*(1.0-l9_741)));
l9_735=l9_740;
l9_731=l9_735;
l9_734=l9_739;
}
l9_688.x=l9_731;
l9_698=l9_734;
float l9_742=l9_688.y;
int l9_743=l9_691.y;
bool l9_744=l9_697;
float l9_745=l9_698;
if ((l9_743==0)||(l9_743==3))
{
float l9_746=l9_742;
float l9_747=0.0;
float l9_748=1.0;
bool l9_749=l9_744;
float l9_750=l9_745;
float l9_751=fast::clamp(l9_746,l9_747,l9_748);
float l9_752=step(abs(l9_746-l9_751),9.9999997e-06);
l9_750*=(l9_752+((1.0-float(l9_749))*(1.0-l9_752)));
l9_746=l9_751;
l9_742=l9_746;
l9_745=l9_750;
}
l9_688.y=l9_742;
l9_698=l9_745;
float2 l9_753=l9_688;
int l9_754=l9_686;
int l9_755=l9_687;
float l9_756=l9_696;
float2 l9_757=l9_753;
int l9_758=l9_754;
int l9_759=l9_755;
float3 l9_760=float3(0.0);
if (l9_758==0)
{
l9_760=float3(l9_757,0.0);
}
else
{
if (l9_758==1)
{
l9_760=float3(l9_757.x,(l9_757.y*0.5)+(0.5-(float(l9_759)*0.5)),0.0);
}
else
{
l9_760=float3(l9_757,float(l9_759));
}
}
float3 l9_761=l9_760;
float3 l9_762=l9_761;
float4 l9_763=sc_set0.baseTex2.sample(sc_set0.baseTex2SmpSC,l9_762.xy,bias(l9_756));
float4 l9_764=l9_763;
if (l9_694)
{
l9_764=mix(l9_695,l9_764,float4(l9_698));
}
float4 l9_765=l9_764;
float4 l9_766=l9_765;
l9_678=l9_766;
float l9_767=0.0;
float l9_768=(*sc_set0.UserUniforms).state;
l9_767=l9_768;
float4 l9_769=float4(0.0);
l9_769=mix(l9_589,l9_678,float4(l9_767));
float4 l9_770=float4(0.0);
float4 l9_771=(*sc_set0.UserUniforms).baseColor;
l9_770=l9_771;
float4 l9_772=float4(0.0);
l9_772=l9_769*l9_770;
l9_583=l9_772;
l9_586=l9_583;
}
else
{
float4 l9_773=float4(0.0);
float4 l9_774=(*sc_set0.UserUniforms).baseColor;
l9_773=l9_774;
l9_584=l9_773;
l9_586=l9_584;
}
l9_582=l9_586;
float4 l9_775=float4(0.0);
l9_775=float4(l9_581)*l9_582;
float4 l9_776=float4(0.0);
float4 l9_777=(*sc_set0.UserUniforms).strokeColor;
l9_776=l9_777;
float l9_778=0.0;
l9_778=smoothstep((*sc_set0.UserUniforms).Port_Input0_N038,(*sc_set0.UserUniforms).Port_Input1_N038,l9_575);
float l9_779=0.0;
float l9_780=(*sc_set0.UserUniforms).strokeThickness;
l9_779=l9_780;
float l9_781=0.0;
l9_781=l9_524+l9_779;
float l9_782=0.0;
l9_782=smoothstep(l9_781,l9_779,l9_575);
float l9_783=0.0;
l9_783=l9_778*l9_782;
float l9_784=0.0;
float l9_785=l9_783;
float l9_786=l9_785;
bool l9_787=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_788;
if (l9_787)
{
l9_788=!PreviewInfo.Saved;
}
else
{
l9_788=l9_787;
}
bool l9_789;
if (l9_788)
{
l9_789=27==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_789=l9_788;
}
if (l9_789)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=float4(l9_786,l9_786,l9_786,1.0);
PreviewInfo.Color.w=1.0;
}
l9_784=l9_786;
float4 l9_790=float4(0.0);
l9_790=mix(l9_775,l9_776,float4(l9_784));
l9_520=l9_790;
l9_523=l9_520;
}
else
{
float l9_791=0.0;
float l9_792=(*sc_set0.UserUniforms).Port_Value_N061;
float l9_793=l9_792+0.001;
l9_793-=0.001;
l9_791=l9_793;
float2 l9_794=float2(0.0);
l9_794=l9_522.Surface_UVCoord0;
float2 l9_795=float2(0.0);
l9_795=((l9_794-(*sc_set0.UserUniforms).Port_Center_N013)*(*sc_set0.UserUniforms).Port_Scale_N013)+(*sc_set0.UserUniforms).Port_Center_N013;
float2 l9_796=float2(0.0);
float2 l9_797=float2(0.0);
float2 l9_798=(*sc_set0.UserUniforms).Port_Default_N040;
float2 l9_799;
if ((int(Tweak_N65_tmp)!=0))
{
float2 l9_800=float2(0.0);
float2 l9_801=(*sc_set0.UserUniforms).baseTexSize.xy;
l9_800=l9_801;
float2 l9_802=float2(0.0);
float l9_803=0.0;
float l9_804=0.0;
float2 l9_805=l9_800;
float2 l9_806=float2(l9_805);
float l9_807=l9_805.x;
float l9_808=l9_805.y;
l9_802=l9_806;
l9_803=l9_807;
l9_804=l9_808;
float l9_809=0.0;
l9_809=fast::min(l9_803,l9_804);
float2 l9_810=float2(0.0);
l9_810=l9_802/(float2(l9_809)+float2(1.234e-06));
l9_797=l9_810;
l9_799=l9_797;
}
else
{
l9_799=l9_798;
}
l9_796=l9_799;
float2 l9_811=float2(0.0);
l9_811=l9_795*l9_796;
float2 l9_812=float2(0.0);
l9_812=l9_811;
float2 l9_813=float2(0.0);
float2 l9_814=(*sc_set0.UserUniforms).Port_Value_N002;
float2 l9_815=l9_814+float2(0.001);
l9_815-=float2(0.001);
l9_813=l9_815;
float2 l9_816=float2(0.0);
l9_816=l9_813*l9_796;
float2 l9_817=float2(0.0);
l9_817=l9_816;
float2 l9_818=float2(0.0);
l9_818=l9_812-l9_817;
float2 l9_819=float2(0.0);
l9_819=abs(l9_818);
float2 l9_820=float2(0.0);
float2 l9_821=(*sc_set0.UserUniforms).boxBounds;
l9_820=l9_821;
float2 l9_822=float2(0.0);
l9_822=fast::clamp(l9_820,(*sc_set0.UserUniforms).Port_Input1_N089,(*sc_set0.UserUniforms).Port_Input2_N089);
float2 l9_823=float2(0.0);
l9_823=float2((*sc_set0.UserUniforms).Port_Input0_N036)/(l9_796+float2(1.234e-06));
float l9_824=0.0;
float l9_825=(*sc_set0.UserUniforms).cornerRadius;
l9_824=l9_825;
float2 l9_826=float2(0.0);
l9_826=l9_823*float2(l9_824);
float2 l9_827=float2(0.0);
l9_827=l9_822-l9_826;
float2 l9_828=float2(0.0);
l9_828=l9_827*l9_796;
float2 l9_829=float2(0.0);
l9_829=l9_828;
float2 l9_830=float2(0.0);
l9_830=l9_819-l9_829;
float2 l9_831=float2(0.0);
float2 l9_832=l9_830;
float2 l9_833=l9_832;
bool l9_834=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_835;
if (l9_834)
{
l9_835=!PreviewInfo.Saved;
}
else
{
l9_835=l9_834;
}
bool l9_836;
if (l9_835)
{
l9_836=8==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_836=l9_835;
}
if (l9_836)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=float4(l9_833,0.0,1.0);
PreviewInfo.Color.w=1.0;
}
l9_831=l9_833;
float2 l9_837=float2(0.0);
l9_837=fast::max(l9_831,(*sc_set0.UserUniforms).Port_Input1_N028);
float l9_838=0.0;
l9_838=length(l9_837);
float l9_839=0.0;
l9_839=l9_824;
float l9_840=0.0;
l9_840=l9_838-l9_839;
float l9_841=0.0;
l9_841=l9_840;
float l9_842=0.0;
float l9_843=l9_841;
float l9_844=l9_843;
bool l9_845=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_846;
if (l9_845)
{
l9_846=!PreviewInfo.Saved;
}
else
{
l9_846=l9_845;
}
bool l9_847;
if (l9_846)
{
l9_847=10==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_847=l9_846;
}
if (l9_847)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=float4(l9_844,l9_844,l9_844,1.0);
PreviewInfo.Color.w=1.0;
}
l9_842=l9_844;
float l9_848=0.0;
l9_848=smoothstep(l9_791,(*sc_set0.UserUniforms).Port_Input1_N023,l9_842);
float4 l9_849=float4(0.0);
float4 l9_850=float4(0.0);
float4 l9_851=float4(0.0);
ssGlobals l9_852=l9_522;
float4 l9_853;
if ((int(Tweak_N65_tmp)!=0))
{
float2 l9_854=float2(0.0);
l9_854=l9_852.Surface_UVCoord0;
float2 l9_855=float2(0.0);
l9_855=((l9_854-(*sc_set0.UserUniforms).Port_Center_N013)*(*sc_set0.UserUniforms).Port_Scale_N013)+(*sc_set0.UserUniforms).Port_Center_N013;
float4 l9_856=float4(0.0);
float2 l9_857=l9_855;
int l9_858;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_859=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_859=0;
}
else
{
l9_859=in.varStereoViewID;
}
int l9_860=l9_859;
l9_858=1-l9_860;
}
else
{
int l9_861=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_861=0;
}
else
{
l9_861=in.varStereoViewID;
}
int l9_862=l9_861;
l9_858=l9_862;
}
int l9_863=l9_858;
int l9_864=baseTexLayout_tmp;
int l9_865=l9_863;
float2 l9_866=l9_857;
bool l9_867=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_868=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_869=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_870=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_871=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_872=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_873=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_874=0.0;
bool l9_875=l9_872&&(!l9_870);
float l9_876=1.0;
float l9_877=l9_866.x;
int l9_878=l9_869.x;
if (l9_878==1)
{
l9_877=fract(l9_877);
}
else
{
if (l9_878==2)
{
float l9_879=fract(l9_877);
float l9_880=l9_877-l9_879;
float l9_881=step(0.25,fract(l9_880*0.5));
l9_877=mix(l9_879,1.0-l9_879,fast::clamp(l9_881,0.0,1.0));
}
}
l9_866.x=l9_877;
float l9_882=l9_866.y;
int l9_883=l9_869.y;
if (l9_883==1)
{
l9_882=fract(l9_882);
}
else
{
if (l9_883==2)
{
float l9_884=fract(l9_882);
float l9_885=l9_882-l9_884;
float l9_886=step(0.25,fract(l9_885*0.5));
l9_882=mix(l9_884,1.0-l9_884,fast::clamp(l9_886,0.0,1.0));
}
}
l9_866.y=l9_882;
if (l9_870)
{
bool l9_887=l9_872;
bool l9_888;
if (l9_887)
{
l9_888=l9_869.x==3;
}
else
{
l9_888=l9_887;
}
float l9_889=l9_866.x;
float l9_890=l9_871.x;
float l9_891=l9_871.z;
bool l9_892=l9_888;
float l9_893=l9_876;
float l9_894=fast::clamp(l9_889,l9_890,l9_891);
float l9_895=step(abs(l9_889-l9_894),9.9999997e-06);
l9_893*=(l9_895+((1.0-float(l9_892))*(1.0-l9_895)));
l9_889=l9_894;
l9_866.x=l9_889;
l9_876=l9_893;
bool l9_896=l9_872;
bool l9_897;
if (l9_896)
{
l9_897=l9_869.y==3;
}
else
{
l9_897=l9_896;
}
float l9_898=l9_866.y;
float l9_899=l9_871.y;
float l9_900=l9_871.w;
bool l9_901=l9_897;
float l9_902=l9_876;
float l9_903=fast::clamp(l9_898,l9_899,l9_900);
float l9_904=step(abs(l9_898-l9_903),9.9999997e-06);
l9_902*=(l9_904+((1.0-float(l9_901))*(1.0-l9_904)));
l9_898=l9_903;
l9_866.y=l9_898;
l9_876=l9_902;
}
float2 l9_905=l9_866;
bool l9_906=l9_867;
float3x3 l9_907=l9_868;
if (l9_906)
{
l9_905=float2((l9_907*float3(l9_905,1.0)).xy);
}
float2 l9_908=l9_905;
l9_866=l9_908;
float l9_909=l9_866.x;
int l9_910=l9_869.x;
bool l9_911=l9_875;
float l9_912=l9_876;
if ((l9_910==0)||(l9_910==3))
{
float l9_913=l9_909;
float l9_914=0.0;
float l9_915=1.0;
bool l9_916=l9_911;
float l9_917=l9_912;
float l9_918=fast::clamp(l9_913,l9_914,l9_915);
float l9_919=step(abs(l9_913-l9_918),9.9999997e-06);
l9_917*=(l9_919+((1.0-float(l9_916))*(1.0-l9_919)));
l9_913=l9_918;
l9_909=l9_913;
l9_912=l9_917;
}
l9_866.x=l9_909;
l9_876=l9_912;
float l9_920=l9_866.y;
int l9_921=l9_869.y;
bool l9_922=l9_875;
float l9_923=l9_876;
if ((l9_921==0)||(l9_921==3))
{
float l9_924=l9_920;
float l9_925=0.0;
float l9_926=1.0;
bool l9_927=l9_922;
float l9_928=l9_923;
float l9_929=fast::clamp(l9_924,l9_925,l9_926);
float l9_930=step(abs(l9_924-l9_929),9.9999997e-06);
l9_928*=(l9_930+((1.0-float(l9_927))*(1.0-l9_930)));
l9_924=l9_929;
l9_920=l9_924;
l9_923=l9_928;
}
l9_866.y=l9_920;
l9_876=l9_923;
float2 l9_931=l9_866;
int l9_932=l9_864;
int l9_933=l9_865;
float l9_934=l9_874;
float2 l9_935=l9_931;
int l9_936=l9_932;
int l9_937=l9_933;
float3 l9_938=float3(0.0);
if (l9_936==0)
{
l9_938=float3(l9_935,0.0);
}
else
{
if (l9_936==1)
{
l9_938=float3(l9_935.x,(l9_935.y*0.5)+(0.5-(float(l9_937)*0.5)),0.0);
}
else
{
l9_938=float3(l9_935,float(l9_937));
}
}
float3 l9_939=l9_938;
float3 l9_940=l9_939;
float4 l9_941=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_940.xy,bias(l9_934));
float4 l9_942=l9_941;
if (l9_872)
{
l9_942=mix(l9_873,l9_942,float4(l9_876));
}
float4 l9_943=l9_942;
float4 l9_944=l9_943;
l9_856=l9_944;
float4 l9_945=float4(0.0);
float2 l9_946=l9_855;
int l9_947;
if ((int(baseTex2HasSwappedViews_tmp)!=0))
{
int l9_948=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_948=0;
}
else
{
l9_948=in.varStereoViewID;
}
int l9_949=l9_948;
l9_947=1-l9_949;
}
else
{
int l9_950=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_950=0;
}
else
{
l9_950=in.varStereoViewID;
}
int l9_951=l9_950;
l9_947=l9_951;
}
int l9_952=l9_947;
int l9_953=baseTex2Layout_tmp;
int l9_954=l9_952;
float2 l9_955=l9_946;
bool l9_956=(int(SC_USE_UV_TRANSFORM_baseTex2_tmp)!=0);
float3x3 l9_957=(*sc_set0.UserUniforms).baseTex2Transform;
int2 l9_958=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex2_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex2_tmp);
bool l9_959=(int(SC_USE_UV_MIN_MAX_baseTex2_tmp)!=0);
float4 l9_960=(*sc_set0.UserUniforms).baseTex2UvMinMax;
bool l9_961=(int(SC_USE_CLAMP_TO_BORDER_baseTex2_tmp)!=0);
float4 l9_962=(*sc_set0.UserUniforms).baseTex2BorderColor;
float l9_963=0.0;
bool l9_964=l9_961&&(!l9_959);
float l9_965=1.0;
float l9_966=l9_955.x;
int l9_967=l9_958.x;
if (l9_967==1)
{
l9_966=fract(l9_966);
}
else
{
if (l9_967==2)
{
float l9_968=fract(l9_966);
float l9_969=l9_966-l9_968;
float l9_970=step(0.25,fract(l9_969*0.5));
l9_966=mix(l9_968,1.0-l9_968,fast::clamp(l9_970,0.0,1.0));
}
}
l9_955.x=l9_966;
float l9_971=l9_955.y;
int l9_972=l9_958.y;
if (l9_972==1)
{
l9_971=fract(l9_971);
}
else
{
if (l9_972==2)
{
float l9_973=fract(l9_971);
float l9_974=l9_971-l9_973;
float l9_975=step(0.25,fract(l9_974*0.5));
l9_971=mix(l9_973,1.0-l9_973,fast::clamp(l9_975,0.0,1.0));
}
}
l9_955.y=l9_971;
if (l9_959)
{
bool l9_976=l9_961;
bool l9_977;
if (l9_976)
{
l9_977=l9_958.x==3;
}
else
{
l9_977=l9_976;
}
float l9_978=l9_955.x;
float l9_979=l9_960.x;
float l9_980=l9_960.z;
bool l9_981=l9_977;
float l9_982=l9_965;
float l9_983=fast::clamp(l9_978,l9_979,l9_980);
float l9_984=step(abs(l9_978-l9_983),9.9999997e-06);
l9_982*=(l9_984+((1.0-float(l9_981))*(1.0-l9_984)));
l9_978=l9_983;
l9_955.x=l9_978;
l9_965=l9_982;
bool l9_985=l9_961;
bool l9_986;
if (l9_985)
{
l9_986=l9_958.y==3;
}
else
{
l9_986=l9_985;
}
float l9_987=l9_955.y;
float l9_988=l9_960.y;
float l9_989=l9_960.w;
bool l9_990=l9_986;
float l9_991=l9_965;
float l9_992=fast::clamp(l9_987,l9_988,l9_989);
float l9_993=step(abs(l9_987-l9_992),9.9999997e-06);
l9_991*=(l9_993+((1.0-float(l9_990))*(1.0-l9_993)));
l9_987=l9_992;
l9_955.y=l9_987;
l9_965=l9_991;
}
float2 l9_994=l9_955;
bool l9_995=l9_956;
float3x3 l9_996=l9_957;
if (l9_995)
{
l9_994=float2((l9_996*float3(l9_994,1.0)).xy);
}
float2 l9_997=l9_994;
l9_955=l9_997;
float l9_998=l9_955.x;
int l9_999=l9_958.x;
bool l9_1000=l9_964;
float l9_1001=l9_965;
if ((l9_999==0)||(l9_999==3))
{
float l9_1002=l9_998;
float l9_1003=0.0;
float l9_1004=1.0;
bool l9_1005=l9_1000;
float l9_1006=l9_1001;
float l9_1007=fast::clamp(l9_1002,l9_1003,l9_1004);
float l9_1008=step(abs(l9_1002-l9_1007),9.9999997e-06);
l9_1006*=(l9_1008+((1.0-float(l9_1005))*(1.0-l9_1008)));
l9_1002=l9_1007;
l9_998=l9_1002;
l9_1001=l9_1006;
}
l9_955.x=l9_998;
l9_965=l9_1001;
float l9_1009=l9_955.y;
int l9_1010=l9_958.y;
bool l9_1011=l9_964;
float l9_1012=l9_965;
if ((l9_1010==0)||(l9_1010==3))
{
float l9_1013=l9_1009;
float l9_1014=0.0;
float l9_1015=1.0;
bool l9_1016=l9_1011;
float l9_1017=l9_1012;
float l9_1018=fast::clamp(l9_1013,l9_1014,l9_1015);
float l9_1019=step(abs(l9_1013-l9_1018),9.9999997e-06);
l9_1017*=(l9_1019+((1.0-float(l9_1016))*(1.0-l9_1019)));
l9_1013=l9_1018;
l9_1009=l9_1013;
l9_1012=l9_1017;
}
l9_955.y=l9_1009;
l9_965=l9_1012;
float2 l9_1020=l9_955;
int l9_1021=l9_953;
int l9_1022=l9_954;
float l9_1023=l9_963;
float2 l9_1024=l9_1020;
int l9_1025=l9_1021;
int l9_1026=l9_1022;
float3 l9_1027=float3(0.0);
if (l9_1025==0)
{
l9_1027=float3(l9_1024,0.0);
}
else
{
if (l9_1025==1)
{
l9_1027=float3(l9_1024.x,(l9_1024.y*0.5)+(0.5-(float(l9_1026)*0.5)),0.0);
}
else
{
l9_1027=float3(l9_1024,float(l9_1026));
}
}
float3 l9_1028=l9_1027;
float3 l9_1029=l9_1028;
float4 l9_1030=sc_set0.baseTex2.sample(sc_set0.baseTex2SmpSC,l9_1029.xy,bias(l9_1023));
float4 l9_1031=l9_1030;
if (l9_961)
{
l9_1031=mix(l9_962,l9_1031,float4(l9_965));
}
float4 l9_1032=l9_1031;
float4 l9_1033=l9_1032;
l9_945=l9_1033;
float l9_1034=0.0;
float l9_1035=(*sc_set0.UserUniforms).state;
l9_1034=l9_1035;
float4 l9_1036=float4(0.0);
l9_1036=mix(l9_856,l9_945,float4(l9_1034));
float4 l9_1037=float4(0.0);
float4 l9_1038=(*sc_set0.UserUniforms).baseColor;
l9_1037=l9_1038;
float4 l9_1039=float4(0.0);
l9_1039=l9_1036*l9_1037;
l9_850=l9_1039;
l9_853=l9_850;
}
else
{
float4 l9_1040=float4(0.0);
float4 l9_1041=(*sc_set0.UserUniforms).baseColor;
l9_1040=l9_1041;
l9_851=l9_1040;
l9_853=l9_851;
}
l9_849=l9_853;
float4 l9_1042=float4(0.0);
l9_1042=float4(l9_848)*l9_849;
l9_521=l9_1042;
l9_523=l9_521;
}
l9_519=l9_523;
float l9_1043=0.0;
float4 l9_1044=l9_519;
float l9_1045=l9_1044.w;
l9_1043=l9_1045;
float4 l9_1046=float4(0.0);
l9_1046=(*sc_set0.UserUniforms).Port_Import_N104;
float4 l9_1047=float4(0.0);
l9_1047=(*sc_set0.UserUniforms).Port_Import_N105;
float2 l9_1048=float2(0.0);
l9_1048=param_9.Surface_UVCoord0;
float2 l9_1049=float2(0.0);
l9_1049=(((l9_1048-float2((*sc_set0.UserUniforms).Port_RangeMinA_N106))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N106-(*sc_set0.UserUniforms).Port_RangeMinA_N106)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N106-(*sc_set0.UserUniforms).Port_RangeMinB_N106))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N106);
float2 l9_1050=float2(0.0);
l9_1050=(*sc_set0.UserUniforms).Port_Import_N107;
float2 l9_1051=float2(0.0);
l9_1051=((l9_1049-(*sc_set0.UserUniforms).Port_Center_N108)*l9_1050)+(*sc_set0.UserUniforms).Port_Center_N108;
float2 l9_1052=float2(0.0);
l9_1052=(*sc_set0.UserUniforms).Port_Import_N109;
float2 l9_1053=float2(0.0);
l9_1053=l9_1051-l9_1052;
float2 l9_1054=float2(0.0);
l9_1054=(*sc_set0.UserUniforms).Port_Import_N111;
float2 l9_1055=float2(0.0);
l9_1055=l9_1054-l9_1052;
float l9_1056=0.0;
l9_1056=dot(l9_1053,l9_1055);
float l9_1057=0.0;
l9_1057=dot(l9_1055,l9_1055);
float l9_1058=0.0;
l9_1058=l9_1056/(l9_1057+1.234e-06);
float l9_1059=0.0;
l9_1059=fast::clamp(l9_1058+0.001,(*sc_set0.UserUniforms).Port_Input1_N116+0.001,(*sc_set0.UserUniforms).Port_Input2_N116+0.001)-0.001;
float l9_1060=0.0;
l9_1060=smoothstep((*sc_set0.UserUniforms).Port_Input0_N117,(*sc_set0.UserUniforms).Port_Input1_N117,l9_1059);
float4 l9_1061=float4(0.0);
l9_1061=mix(l9_1046,l9_1047,float4(l9_1060));
float4 l9_1062=float4(0.0);
l9_1062=l9_1061;
float4 l9_1063=float4(0.0);
l9_1063=float4(l9_1043)*l9_1062;
param_6=l9_1063;
param_8=param_6;
}
else
{
param_8=float4(param_7);
}
Output_N44=param_8;
float Output_N42=0.0;
float param_10=(*sc_set0.UserUniforms).opacity;
Output_N42=param_10;
float4 Output_N43=float4(0.0);
Output_N43=Output_N44*float4(Output_N42);
float4 Value_N91=float4(0.0);
Value_N91=float4(Value1_N1.x,Value1_N1.y,Value1_N1.z,Value_N91.w);
Value_N91.w=Output_N43.x;
FinalColor=Value_N91;
float param_11=FinalColor.w;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (param_11<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_1064=gl_FragCoord;
float2 l9_1065=floor(mod(l9_1064.xy,float2(4.0)));
float l9_1066=(mod(dot(l9_1065,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (param_11<l9_1066)
{
discard_fragment();
}
}
float4 param_12=FinalColor;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
float4 l9_1067=param_12;
float4 l9_1068=l9_1067;
float l9_1069=1.0;
if ((((int(sc_BlendMode_Normal_tmp)!=0)||(int(sc_BlendMode_AlphaToCoverage_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaHardware_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_1069=l9_1068.w;
}
else
{
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
l9_1069=fast::clamp(l9_1068.w*2.0,0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_1069=fast::clamp(dot(l9_1068.xyz,float3(l9_1068.w)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
l9_1069=1.0;
}
else
{
if ((int(sc_BlendMode_Multiply_tmp)!=0))
{
l9_1069=(1.0-dot(l9_1068.xyz,float3(0.33333001)))*l9_1068.w;
}
else
{
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_1069=(1.0-fast::clamp(dot(l9_1068.xyz,float3(1.0)),0.0,1.0))*l9_1068.w;
}
else
{
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
l9_1069=fast::clamp(dot(l9_1068.xyz,float3(1.0)),0.0,1.0)*l9_1068.w;
}
else
{
if ((int(sc_BlendMode_Add_tmp)!=0))
{
l9_1069=fast::clamp(dot(l9_1068.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_1069=fast::clamp(dot(l9_1068.xyz,float3(1.0)),0.0,1.0)*l9_1068.w;
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0))
{
l9_1069=dot(l9_1068.xyz,float3(0.33333001))*l9_1068.w;
}
else
{
if ((int(sc_BlendMode_Min_tmp)!=0))
{
l9_1069=1.0-fast::clamp(dot(l9_1068.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_Max_tmp)!=0))
{
l9_1069=fast::clamp(dot(l9_1068.xyz,float3(1.0)),0.0,1.0);
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
float l9_1070=l9_1069;
float l9_1071=l9_1070;
float l9_1072=(*sc_set0.UserUniforms).sc_ShadowDensity*l9_1071;
float3 l9_1073=mix((*sc_set0.UserUniforms).sc_ShadowColor.xyz,(*sc_set0.UserUniforms).sc_ShadowColor.xyz*l9_1067.xyz,float3((*sc_set0.UserUniforms).sc_ShadowColor.w));
float4 l9_1074=float4(l9_1073.x,l9_1073.y,l9_1073.z,l9_1072);
param_12=l9_1074;
}
else
{
if ((int(sc_RenderAlphaToColor_tmp)!=0))
{
param_12=float4(param_12.w);
}
else
{
if ((int(sc_BlendMode_Custom_tmp)!=0))
{
float4 l9_1075=param_12;
float4 l9_1076=float4(0.0);
float4 l9_1077=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_1078=out.sc_FragData0;
l9_1077=l9_1078;
}
else
{
float4 l9_1079=gl_FragCoord;
float2 l9_1080=l9_1079.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_1081=l9_1080;
float2 l9_1082=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_1083=1;
int l9_1084=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1084=0;
}
else
{
l9_1084=in.varStereoViewID;
}
int l9_1085=l9_1084;
int l9_1086=l9_1085;
float3 l9_1087=float3(l9_1081,0.0);
int l9_1088=l9_1083;
int l9_1089=l9_1086;
if (l9_1088==1)
{
l9_1087.y=((2.0*l9_1087.y)+float(l9_1089))-1.0;
}
float2 l9_1090=l9_1087.xy;
l9_1082=l9_1090;
}
else
{
l9_1082=l9_1081;
}
float2 l9_1091=l9_1082;
float2 l9_1092=l9_1091;
float2 l9_1093=l9_1092;
float2 l9_1094=l9_1093;
float l9_1095=0.0;
int l9_1096;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_1097=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1097=0;
}
else
{
l9_1097=in.varStereoViewID;
}
int l9_1098=l9_1097;
l9_1096=1-l9_1098;
}
else
{
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
l9_1096=l9_1100;
}
int l9_1101=l9_1096;
float2 l9_1102=l9_1094;
int l9_1103=sc_ScreenTextureLayout_tmp;
int l9_1104=l9_1101;
float l9_1105=l9_1095;
float2 l9_1106=l9_1102;
int l9_1107=l9_1103;
int l9_1108=l9_1104;
float3 l9_1109=float3(0.0);
if (l9_1107==0)
{
l9_1109=float3(l9_1106,0.0);
}
else
{
if (l9_1107==1)
{
l9_1109=float3(l9_1106.x,(l9_1106.y*0.5)+(0.5-(float(l9_1108)*0.5)),0.0);
}
else
{
l9_1109=float3(l9_1106,float(l9_1108));
}
}
float3 l9_1110=l9_1109;
float3 l9_1111=l9_1110;
float4 l9_1112=sc_set0.sc_ScreenTexture.sample(sc_set0.sc_ScreenTextureSmpSC,l9_1111.xy,bias(l9_1105));
float4 l9_1113=l9_1112;
float4 l9_1114=l9_1113;
l9_1077=l9_1114;
}
float4 l9_1115=l9_1077;
float3 l9_1116=l9_1115.xyz;
float3 l9_1117=l9_1116;
float3 l9_1118=l9_1075.xyz;
float3 l9_1119=definedBlend(l9_1117,l9_1118,in.varStereoViewID,(*sc_set0.UserUniforms),sc_set0.intensityTexture,sc_set0.intensityTextureSmpSC);
l9_1076=float4(l9_1119.x,l9_1119.y,l9_1119.z,l9_1076.w);
float3 l9_1120=mix(l9_1116,l9_1076.xyz,float3(l9_1075.w));
l9_1076=float4(l9_1120.x,l9_1120.y,l9_1120.z,l9_1076.w);
l9_1076.w=1.0;
float4 l9_1121=l9_1076;
param_12=l9_1121;
}
else
{
if ((int(sc_Voxelization_tmp)!=0))
{
float4 l9_1122=float4(in.varScreenPos.xyz,1.0);
param_12=l9_1122;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
float4 l9_1123=gl_FragCoord;
float l9_1124=fast::clamp(abs(l9_1123.z),0.0,1.0);
float4 l9_1125=float4(l9_1124,1.0-l9_1124,1.0,1.0);
param_12=l9_1125;
}
else
{
float4 l9_1126=param_12;
float4 l9_1127=float4(0.0);
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_1127=float4(mix(float3(1.0),l9_1126.xyz,float3(l9_1126.w)),l9_1126.w);
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0)||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
float l9_1128=l9_1126.w;
if ((int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_1128=fast::clamp(l9_1128,0.0,1.0);
}
l9_1127=float4(l9_1126.xyz*l9_1128,l9_1128);
}
else
{
l9_1127=l9_1126;
}
}
float4 l9_1129=l9_1127;
param_12=l9_1129;
}
}
}
}
}
float4 l9_1130=param_12;
FinalColor=l9_1130;
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
float4 l9_1131=float4(0.0);
l9_1131=float4(0.0);
float4 l9_1132=l9_1131;
float4 Cost=l9_1132;
if (Cost.w>0.0)
{
FinalColor=Cost;
}
FinalColor=fast::max(FinalColor,float4(0.0));
float4 param_13=FinalColor;
FinalColor=sc_OutputMotionVectorIfNeeded(param_13,in.varPosAndMotion,in.varNormalAndMotion);
float4 param_14=FinalColor;
float4 l9_1133=param_14;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_1133.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=l9_1133;
return out;
}
} // FRAGMENT SHADER
