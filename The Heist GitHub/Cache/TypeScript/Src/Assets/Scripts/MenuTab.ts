/** One main-menu tab: button + panel elements to pop in/out. */
@typedef
export class MenuTab {
  @input
  @allowUndefined
  button: ScriptComponent

  @input
  elements: SceneObject[] = []
}
