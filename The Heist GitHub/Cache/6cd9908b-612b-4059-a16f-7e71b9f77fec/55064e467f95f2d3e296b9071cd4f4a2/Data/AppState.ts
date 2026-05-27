type StorageType = "bool" | "int" | "float"

type StorageDefault = {
  type: StorageType
  defaultValue: boolean | number
}

const STORAGE_DEFAULTS: Record<string, StorageDefault> = {
  enabledGloves: {type: "bool", defaultValue: true},
  masterVolume: {type: "float", defaultValue: 1},
  safesOpened: {type: "int", defaultValue: 0},
  safesFailed: {type: "int", defaultValue: 0},
  tutorialPlayed: {type: "bool", defaultValue: false},
  currencyCount: {type: "int", defaultValue: 0}
}

function getPersistentStore(): any {
  if (global.persistentStorageSystem && (global.persistentStorageSystem as any).store) {
    return (global.persistentStorageSystem as any).store
  }
  return null
}

function storeHasKey(store: any, key: string): boolean {
  if (!store) {
    return false
  }
  if (typeof store.has === "function") {
    return store.has(key)
  }
  if (typeof store.contains === "function") {
    return store.contains(key)
  }
  if (typeof store.getString === "function") {
    const val = store.getString(key)
    return val !== null && val !== undefined && val !== ""
  }
  return false
}

function readFromStore(store: any, key: string, type: StorageType): unknown {
  if (!store) {
    return undefined
  }
  if (type === "bool") {
    if (typeof store.getBool === "function") {
      return store.getBool(key)
    }
    if (typeof store.getBoolean === "function") {
      return store.getBoolean(key)
    }
  } else if (type === "int") {
    if (typeof store.getInt === "function") {
      return store.getInt(key)
    }
    if (typeof store.getNumber === "function") {
      return store.getNumber(key)
    }
  } else if (type === "float") {
    if (typeof store.getFloat === "function") {
      return store.getFloat(key)
    }
    if (typeof store.getNumber === "function") {
      return store.getNumber(key)
    }
  }
  if (typeof store.getString === "function") {
    return store.getString(key)
  }
  return undefined
}

function writeToStore(store: any, key: string, value: unknown, type: StorageType): void {
  if (!store) {
    return
  }
  if (type === "bool") {
    if (typeof store.putBool === "function") {
      store.putBool(key, value)
      return
    }
    if (typeof store.putBoolean === "function") {
      store.putBoolean(key, value)
      return
    }
  } else if (type === "int") {
    if (typeof store.putInt === "function") {
      store.putInt(key, value)
      return
    }
    if (typeof store.putNumber === "function") {
      store.putNumber(key, value)
      return
    }
  } else if (type === "float") {
    if (typeof store.putFloat === "function") {
      store.putFloat(key, value)
      return
    }
    if (typeof store.putNumber === "function") {
      store.putNumber(key, value)
      return
    }
  }
  if (typeof store.putString === "function") {
    store.putString(key, String(value))
  } else if (typeof store.setString === "function") {
    store.setString(key, String(value))
  }
}

function coerceValue(value: unknown, type: StorageType, fallback: boolean | number): boolean | number {
  if (value === undefined || value === null || value === "") {
    return fallback
  }
  if (type === "bool") {
    if (typeof value === "boolean") {
      return value
    }
    if (typeof value === "string") {
      return value.toLowerCase() === "true"
    }
    return !!value
  }
  if (type === "int") {
    const intVal = parseInt(String(value), 10)
    return isNaN(intVal) ? (fallback as number) : intVal
  }
  if (type === "float") {
    const floatVal = parseFloat(String(value))
    return isNaN(floatVal) ? (fallback as number) : floatVal
  }
  return fallback
}

function checkStorage(key: string): boolean | number | string {
    const def = STORAGE_DEFAULTS[key]
    if (!def) {
      return undefined as unknown as boolean
    }

    const state = global.appState
    if (state.storage.hasOwnProperty(key)) {
      return state.storage[key] as boolean | number | string
    }

    const store = getPersistentStore()
    const hasKey = storeHasKey(store, key)
    const rawValue = hasKey ? readFromStore(store, key, def.type) : undefined
    const value = coerceValue(rawValue, def.type, def.defaultValue)
    state.storage[key] = value

    if (!hasKey) {
      writeToStore(store, key, value, def.type)
    }

    return value as boolean | number | string
}

function setStorage(key: string, value: boolean | number | string): void {
    const def = STORAGE_DEFAULTS[key]
    if (!def) {
      return
    }

    const coerced = coerceValue(value, def.type, def.defaultValue)
    global.appState.storage[key] = coerced

    const store = getPersistentStore()
    writeToStore(store, key, coerced, def.type)
}

function initGlobalAppState(): void {
  if (global.appState) {
    return
  }

  const checkStorageFn = checkStorage as HeistAppState["checkStorage"]
  const setStorageFn = setStorage as HeistAppState["setStorage"]

  global.appState = {
    currentState: "intro",
    anchorManager: null,
    inTransition: false,
    signedInSnapCloud: false,
    currentClientTime: null,
    safe: {} as HeistSafeState,
    storage: {} as Record<string, unknown>,
    checkStorage: checkStorageFn,
    setStorage: setStorageFn
  }
}

// Match legacy AppState.js: available as soon as this script loads.
initGlobalAppState()

/**
 * Initializes `global.appState` and persistent storage helpers.
 * Attach on Prerequisites → AppState (replaces AppState.js).
 */
@component
export class AppState extends BaseScriptComponent {
  onAwake(): void {
    initGlobalAppState()
  }
}