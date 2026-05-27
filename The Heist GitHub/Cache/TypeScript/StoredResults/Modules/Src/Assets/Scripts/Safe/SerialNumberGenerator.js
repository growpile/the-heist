"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSerialNumber = generateSerialNumber;
const SafeTypes_1 = require("./SafeTypes");
const WORDS = SafeTypes_1.SERIAL_WORDS;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
function randInt(min, max) {
    if (global.utils && global.utils.rng) {
        return global.utils.rng(min, max);
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateSerialNumber() {
    const forceWord = Math.random() < 0.1;
    const forcedWord = forceWord ? WORDS[Math.floor(Math.random() * WORDS.length)] : "";
    const wordInsertIndex = forceWord ? Math.floor(Math.random() * (6 - forcedWord.length + 1)) : 0;
    const wordLength = forcedWord.length;
    const chars = [];
    let letterCount = 0;
    let numberCount = 0;
    let containsOddNumber = false;
    let containsEvenNumber = false;
    for (let i = 0; i < 6; i++) {
        if (forceWord && i >= wordInsertIndex && i < wordInsertIndex + wordLength) {
            const forcedChar = forcedWord.charAt(i - wordInsertIndex);
            chars.push(forcedChar);
            letterCount++;
            continue;
        }
        const lastIsLetter = i > 0 && /[A-Z]/.test(chars[i - 1]);
        const useLetter = !lastIsLetter && randInt(0, 1) === 1;
        if (useLetter) {
            const li = randInt(0, LETTERS.length - 1);
            chars.push(LETTERS.charAt(li));
            letterCount++;
        }
        else {
            const di = randInt(0, DIGITS.length - 1);
            const digit = DIGITS.charAt(di);
            chars.push(digit);
            numberCount++;
            const num = parseInt(digit, 10);
            if (num % 2 === 0) {
                containsEvenNumber = true;
            }
            else {
                containsOddNumber = true;
            }
        }
    }
    const serial = chars.join("");
    let containsWord = false;
    for (const word of WORDS) {
        if (serial.indexOf(word) !== -1) {
            containsWord = true;
            break;
        }
    }
    return {
        string: serial,
        containsWord,
        containsOddNumber,
        containsEvenNumber,
        numberCount,
        letterCount
    };
}
//# sourceMappingURL=SerialNumberGenerator.js.map