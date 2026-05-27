/** One menu step: root object plus elements that pop in/out together. */
@typedef
export class MenuView {
  @input
  @allowUndefined
  root: SceneObject

  @input
  @hint("Leave empty to use direct children of root.")
  elements: SceneObject[] = []
}
