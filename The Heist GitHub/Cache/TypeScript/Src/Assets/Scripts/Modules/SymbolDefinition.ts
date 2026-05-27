/**
 * Maps a symbol id string to its display texture (used by Symbol Order Module).
 */
@typedef
export class SymbolDefinition {
  @input
  @hint("Symbol id matching the symbol map (e.g. fork, doNotPress).")
  symbolId: string = ""

  @input
  @allowUndefined
  @hint("Texture applied to the symbol image mainPass.symbolMap.")
  symbolTexture: Texture
}
