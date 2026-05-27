/**
 * Module prefab entry for the safe puzzle.
 */
@typedef
export class SafeModuleConfig {
  @input
  moduleName: string = ""

  @input
  moduleId: string = ""

  @input
  prefab: ObjectPrefab
}
