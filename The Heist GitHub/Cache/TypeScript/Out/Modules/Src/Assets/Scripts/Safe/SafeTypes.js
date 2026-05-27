"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAFE_TIMER_COOP_SEC = exports.SAFE_TIMER_SOLO_SEC = exports.SAFE_TIMER_TUTORIAL_SEC = exports.SERIAL_WORDS = void 0;
exports.getSafeBombTimerSeconds = getSafeBombTimerSeconds;
/** Words that can appear embedded in generated serial numbers. */
exports.SERIAL_WORDS = ["SAFE", "BOMB", "CAT", "GOLD", "BOOM", "TICK", "LENS"];
/** Hardcoded bomb countdown durations (seconds). Timer UI shows M:SS (e.g. 959 = 9:59). */
exports.SAFE_TIMER_TUTORIAL_SEC = 9 * 60 + 59;
exports.SAFE_TIMER_SOLO_SEC = 7 * 60;
exports.SAFE_TIMER_COOP_SEC = 5 * 60;
function getSafeBombTimerSeconds(safeType) {
    switch (safeType) {
        case "tutorial":
            return exports.SAFE_TIMER_TUTORIAL_SEC;
        case "solo":
            return exports.SAFE_TIMER_SOLO_SEC;
        case "coop":
            return exports.SAFE_TIMER_COOP_SEC;
    }
}
//# sourceMappingURL=SafeTypes.js.map