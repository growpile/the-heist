<!-- Component Name: The name of the component as it will appear in the component library -->
# Score UI Component

<!-- Description: A detailed description of what this component does and its purpose -->
- Description: This AI block is a component for managing and displaying score in a 2D or 3D environment. It provides settings for customizing the font, color, size, and animations of the score display, as well as script functions for modifying and clearing the score. It can optionally save the personal best score on device, allowing for synced score across sessions.

<!--
Render Layer: Where your component should be placed in the rendering pipeline.
Choose one: 2D Pre Background, 3D Background, 2D Background, 3D Face, 3D Foreground, Post Effect, 2D Foreground, 3D UI (Safe Region), 2D UI (Safe Region)
-->
- Render Layer: 2D Foreground

## Composition Notes
<!-- These notes are used by the system to determine component inclusion in a lens. -->
Used for scoring and displaying scores in a game or puzzle environment, highly customizable. The block self-initalizes when added to the scene. The block requires access to the global scene.

## Design Notes
<!-- These notes influence how the system populates the component's inputs. Please provide some examples of input values and explain how they affect the component's behavior. -->
Designers should customize the font, color, size and other settings to match the visual style of the project as well as the UX.

## Coding Notes
<!-- These notes are for the coding agent, describe how to use the API of your component (inputs/functions/events) for different scenarios -->
Developers can interact with the block by calling functions like 'increaseScore(amount)', 'decreaseScore(amount)', 'clearScore()', 'startScoring()', 'endScoring()' or accessing script properties. Callbacks: `onScoreChanged(score)` fires on each score change; `onPersonalBest(score)` fires when a personal best is recorded.

<!--
 * inputs: The input parameters for this custom component. This should correspond to the // @input in your script.

 * For each input parameter you should have the following:
 * - Name: The name of the input parameter as it appears in the interface
 * - Description: Explain what this input does and how it affects the component's behavior
 * - Type: The data type expected. Choose one: string, int, float, boolean, vec2, vec3, vec4, Asset.Texture, Asset.ObjectPrefab

 * If you are using primitives like strings, or numbers, you need to provide a default value:
 * - Default: The default value used when no input is provided

 * If instead you want to use asset generators, you need to provide the asset provider and asset style:
 * - Asset Provider: Asset provider type for asset-based inputs (Sticker, Sprite, Image, 3D Object)
 * - Asset Style: Asset style description for guiding asset generation (e.g. Cartoony)
-->
## Inputs

### scoreType
- Description: Type of score (Int or Float). 0 is Int, 1 is Float. Keep Int for most experiences, i.e. where the score is whole numbers and Float for more precise scoring.
- Type: int
- Default: 0

### initialScoreInt
- Description: Initial float score value. Keep 0 for most experiences, if not explicitly instructed a different starting value.
- Type: int
- Default: 0

### initialScoreFloat
- Description: Initial float score value. Keep 0 for most experiences, if not explicitly instructed a different starting value.
- Type: float
- Default: 0

### decimals
- Description: Number of decimal places for float scores. Keep 2 for most experiences, if not explicitly instructed a different number.
- Type: int
- Default: 2

### persistentScore
- Description: Flag to indicate if score should persist between sessions. Keep on for most experiences, if not explicitly instructed that it should not persists.
- Type: boolean

### allowPersonalBest
- Description: Flag to allow tracking of personal best score. Keep enabled for most experiences, unless instructed otherwise.
- Type: boolean

### updatePersonalBest
- Description: When to check & update personal best score if succeeded. 0 is everytime the score is increased. 1 is at the end of the scoring, i.e. the endScoring() function. Keep 1 for most lenses, unless specified otherwise.
- Type: int
- Default: 1

### scoreDisplay
- Description: Select the display location for the score text. 0 is score that follows the lens user's head. 1 is 2D score that is static on the screen. Select 0 for more dynamic lenses and 1 for more static, 2D experiences.
- Type: int
- Default: 0

### headAttachmentPoint
- Description: Choose where on the head to attach the head-following score (when scoreDisplay = 0). Options: Forehead, HeadCenter, CandideCenter, Chin, LeftCheek, RightCheek, LeftForehead, RightForehead, MouthCenter, LeftEyeballCenter, RightEyeballCenter, TriangleBarycentric. Default is Forehead.
- Type: int
- Default: 0

### scoreAnimation
- Description: If toggled true, animation will play on the score text when modifying the score.
- Type: boolean

### newBestVFX
- Description: If toggled true, particles will emit when the user achieves a new best score. Only works when allowPersonalBest is enabled. Enable unless instructed otherwise.
- Type: boolean

### vfxDuration
- Description: Duration of particle effect emission. Keep 0.25 for most experiences, when no other value is specified. 
- Type: float
- Default: 0.25

### particleTextureType
- Description: Type of particle texture. 0 is the default, package-included Star texture. 1 is a custom texture, either supplied manually or generated. Use 1 to match the particle texture to the theme of the lens.
- Type: int

### customParticleTexture
- Description: Custom particle texture
- Type: Asset.Texture
- Asset Provider: Sprite
- Asset Style: A style that matches the theme of the lens and is suitable for a transparent background particle texture.

### scoreBackplate
- Description: Toggle a themed backplate behind the score text. Enable to allow a custom texture to be manually provided or generated.
- Type: boolean

### customScoreBackplate
- Description: Custom backplate texture applied to the backplate image. Generate something in the lens theme!
- Type: Asset.Texture
- Asset Provider: Sprite
- Asset Style: A themed banner/panel that fits behind score text (e.g., scroll, plaque, neon badge) with alpha for clean edges.

### scoreFontType
- Description: Select the type of font to use for the score display. Always select 0 for this input.
- Type: int
- Default: 0

### scoreFontPreset
- Description: Select a preset font style. 0 is default, neutral. 1 is modern/simple. 2 is retro/newspaper/old. 3 is sci-fi/futuristic. 4 is scary/medieval/gothic. Choose the right one for the theme of the lens.
- Type: int
- Default: 0

### scoreCustomFont
- Description: The user can upload a custom font file if 'Use Custom Font' is chosen. Do NOT touch this input.
- Type: Asset.Font

### scoreColor
- Description: Set the color of the score text to match the theme of the lens and achieve color consistency. Sometimes simple colors are the best.
- Type: vec4

### letterSpacing
- Description: Adjust the spacing between letter in the score text. Always keep at 0.
- Type: float
- Default: 0

### scoreOutline
- Description: Toggle the outline effect for the score text. Toggle to true if this would help the score fit the theme of the lens or if explicitly instructed.
- Type: boolean

### outlineColor
- Description: Set the color of the outline around the score text, if scoreOutline has been enabled. Choose a color that contrasts, helps the scoreColor stand out and also fits the theme.
- Type: vec4

### outlineSize
- Description: Adjust the size of the outline around the score text. Keep at 0.25 for best effect.
- Type: float
- Default: 0.25

### scoreSize
- Description: Select the size of the score text. Always keep at 0, do not change this.
- Type: int
- Default: 0

### customScoreSize
- Description: Set the custom size for the score text in 2D space. Keep at 78.
- Type: float
- Default: 78

### customScoreSize3d
- Description: Set the custom size for the score text in 3D space. Keep at 178.
- Type: float
- Default: 178

### endAnimation
- Description: Set the type of animation that will play when showing the final score/end view. 0 is no animation. 1 is sliding up. 2 is sliding down. Keep 2 for most lenses, when not instructed otherwise.
- Type: int
- Default: 2

### customEndText
- Description: If toggled true, other than the default final score/end view labels will be used.
- Type: boolean

### finalScoreText
- Description: If customEndText is enabled, here you can specify the custom label that will show above the final score. Keep this very short, since we don't want it wrapping. Example strings are "COINS COLLECTED", "FINAL SCORE", "FISH COOKED", "PIES BAKED", "COOKIES SNATCHED".
- Type: string
- Default: "FINAL SCORE"

### finalNewBestText
- Description: If customEndText is enabled, here you can specify the custom label that will show above the final score - if that final score is a personal best (& if allowPersonalBest is enabled). Keep this very short, since we don't want it wrapping. Example strings are "NEW BEST", "RECORD BEATEN", "PERSONAL RECORD".
- Type: string
- Default: "NEW BEST"

### personalBestText
- Description: If customEndText is enabled, here you can specify the custom label that will show below the final score together with the personal best score (if allowPersonalBest is enabled). Keep this very short, since we don't want it wrapping. Example strings are "NEW BEST", "RECORD BEATEN", "PERSONAL RECORD".
- Type: string
- Default: "Personal Best:"

### restartText
- Description: If customEndText is enabled, here you can specify the custom hint label that will show below the final score. It should logically be connected to the action that the user has to do, to restart the game. Keep this short, since we don't want it wrapping more than 2 lines. Example strings are "TAP TO RESTART", "SWIPE TO TRY AGAIN", "TRY AGAIN".
- Type: string
- Default: "TAP TO RESTART"

### autoStart
- Description: If toggled true, will startScoring() instanly & allow scoring. Otherwise will need to start manually using script exposed function startScoring(). Keep toggled true unless instructed otherwise.
- Type: boolean

<!--
 * Functions: These are functions that can be called on this custom component. This should correspond to some function exposed in the script object of your script.

 * An example of a function description is the following:

```
 * ### functionName(argumentName1: argumentType1) : returnType
 * - description: Explain what this function does and when to use it.
 * - argumentName1: The description for argument1.
```

 * You can omit the arguments section if the function takes no parameters.
-->
## Functions

### increaseScore(amount: int) : void
- Description: Increase the score value by a specified amount, or by 1 if no argument.
- amount: The amount by which to increase the score. Can also be called without the argument, if desired increment is just 1.

### decreaseScore(amount: int) : void
- Description: Decrease the score value by a specified amount, or by 1 if no argument.
- amount: The amount by which to decrease the score. Can also be called without the argument, if desired decrement is just 1.

### clearScore() : void
- Description: Reset the score value to the initial value. No arguments.

### endScoring(onComplete: Function) : void
- Description: End the scoring session and display final score on final score/end view.
- onComplete: Optional callback that executes after the transitional animations have completed.

### startScoring(onComplete: Function) : void
- Description: Start the scoring session and allow scoring via the script exposed functions.
- onComplete: Optional callback that executes after the transitional animations have completed.

### resetSavedScore() : void
- Description: Resets the local stored personal best score. Only use this if explicitly asked. Example would be binding it to a tap on a button that resets the user's score. Should always warn the user that their score is going to be wiped beforehand.

## Events

### onScoreChanged(score: number)
- Description: Fired whenever the score changes (increase or decrease). Receives the current score.
- score: Current score after the change.

### onPersonalBest(score: number)
- Description: Fired when a personal best is recorded (respecting allowPersonalBest and persistence). Receives the new PB score.
- score: New personal best score.

<!--
Reference Documentation

Render Layer Definitions:
- 2D Pre Background: For 2D objects that are to be rendered before the background, behind everything else.
- 3D Background: For 3D objects that are to be rendered in the background, behind everything else.
- 2D Background: For 2D objects that are to be rendered in the background, behind everything else.
- 3D Face: For 3D objects that are intended to be attached to the face.
- 3D Foreground: For 3D objects that are to be rendered in the foreground, in front of everything else.
- Post Effect: For 2D post effects, rendered below the UI elements.
- 2D Foreground: For 2D objects that are to be rendered in the foreground, in front of everything else.
- 3D UI (Safe Region): For 3D objects that are to be rendered in the foreground, in front of everything else.
- 2D UI (Safe Region): For 2D objects that are to be rendered in the foreground, in front of everything else.

Asset Provider Definitions:
- Sticker: A texture with transparent background that will have a white outline around it. Perfect for sticker-style graphics and decals.
- Sprite: A texture with transparent background. Great for game sprites, icons, and similar graphics that need clean transparency without outlines.
- Image: A texture that will fill the entire space. Great for background images, green screen replacements, and full-screen graphics.
- 3D Object: An Asset.ObjectPrefab that can be instantiated to display a 3D object. Used for generating 3D models, meshes, and complex 3D assets.
-->
