/**
 * A full-screen menu step: one root object plus the SceneObjects that pop in/out together.
 * Assign pop elements for a menu step, or leave empty to use direct children of root.
 */
@typedef
export class MenuView {
  @input
  @allowUndefined
  @hint("Parent object for this step, e.g. Solo Reminder Window or Team Room.")
  root: SceneObject

  @input
  @hint("UI pieces that pop in and out. Leave empty to use direct children of root.")
  elements: SceneObject[] = []
}
