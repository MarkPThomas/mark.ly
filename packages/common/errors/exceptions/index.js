"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticClassInstantiationException = exports.NotImplementedException = exports.NotSupportedException = exports.ArgumentOutOfRangeException = exports.DivideByZeroException = exports.ArgumentException = void 0;
class ArgumentException extends Error {
}
exports.ArgumentException = ArgumentException;
class DivideByZeroException extends Error {
}
exports.DivideByZeroException = DivideByZeroException;
class ArgumentOutOfRangeException extends Error {
}
exports.ArgumentOutOfRangeException = ArgumentOutOfRangeException;
class NotSupportedException extends Error {
}
exports.NotSupportedException = NotSupportedException;
class NotImplementedException extends Error {
}
exports.NotImplementedException = NotImplementedException;
class StaticClassInstantiationException extends Error {
    constructor(message = StaticClassInstantiationException.MESSAGE_DEFAULT) {
        super(message);
    }
}
exports.StaticClassInstantiationException = StaticClassInstantiationException;
StaticClassInstantiationException.MESSAGE_DEFAULT = 'A static class cannot be instantiated.';
//# sourceMappingURL=index.js.map