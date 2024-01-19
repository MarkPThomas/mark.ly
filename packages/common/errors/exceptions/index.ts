export class ArgumentException extends Error {

}

export class DivideByZeroException extends Error {

}

export class ArgumentOutOfRangeException extends Error {

}

export class NotSupportedException extends Error {

}

export class NotImplementedException extends Error {

}

export class StaticClassInstantiationException extends Error {
  static readonly MESSAGE_DEFAULT = 'A static class cannot be instantiated.';
  constructor(message: string = StaticClassInstantiationException.MESSAGE_DEFAULT) {
    super(message);
  }
}