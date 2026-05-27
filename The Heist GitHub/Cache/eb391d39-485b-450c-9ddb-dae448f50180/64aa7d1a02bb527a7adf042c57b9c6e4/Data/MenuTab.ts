/**
 * One main-menu tab: a button script component plus the UI elements for that view.
 *
 * In the Inspector, assign the RectangleButton Script Component to `button`,
 * then assign that tab's UI SceneObjects to `elements`.
 */
@typedef
export class MenuTab {
  @input
  @allowUndefined
  @hint("Tab button — assign the RectangleButton component.")
  button: ScriptComponent

  @input
  @hint("Scene objects shown for this tab's panel.")
  elements: SceneObject[] = []
}
