/**
 * A full-screen menu step: one root object plus the SceneObjects that pop in/out together.
 * Assign pop elements for a menu step, or leave empty to use direct children of root.
 */
@typedef
export class MenuView {
  @input
  @allowUndefined
  @hint("Parent object for this step (e.g. Solo Reminder Window, Team Room).")
  root: SceneObject

  @input
  @hint("UI pieces that animate with pop-in / pop-out. If empty, direct children of root are used.")
  elements: SceneObject[] = []
}
