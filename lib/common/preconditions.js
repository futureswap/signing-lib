"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkArgument = exports.checkDefined = void 0;
function checkDefined(val, message = 'Should not be befined') {
    if (val === null || val === undefined) {
        throw new Error(message);
    }
    return val;
}
exports.checkDefined = checkDefined;
function checkArgument(expression, message = 'checkArgument') {
    if (!expression) {
        throw new Error(message);
    }
}
exports.checkArgument = checkArgument;
