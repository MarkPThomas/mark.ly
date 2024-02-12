/**
 * Class representing an exception for intersecting curves.
 * @extends {Error}
 */
export class IntersectingCurveException extends Error {
  /**
   * Creates an instance of `IntersectingCurveException`.
   * @param {string} [message] The message that describes the error.
   */
  constructor(message?: string) {
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, IntersectingCurveException.prototype);
  }
}

/**
 * Function to create an instance of `IntersectingCurveException`.
 * @param {string} [message] The message that describes the error.
 * @param {Error} [inner] The inner error.
 * @returns {IntersectingCurveException} An instance of `IntersectingCurveException`.
 */
export function createIntersectingCurveException(
  message?: string,
  inner?: Error
): IntersectingCurveException {
  const exception = new IntersectingCurveException(message);
  if (inner) {
    exception.stack += `\nCaused by: ${inner.stack}`;
  }
  return exception;
}
