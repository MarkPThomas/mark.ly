/**
 * Class representing an exception for overlapping curves.
 * @extends {Error}
 */
export class OverlappingCurvesException extends Error {
  /**
   * Creates an instance of `OverlappingCurvesException`.
   * @param {string} [message] The message that describes the error.
   */
  constructor(message?: string) {
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, OverlappingCurvesException.prototype);
  }
}

/**
 * Function to create an instance of `OverlappingCurvesException`.
 * @param {string} [message] The message that describes the error.
 * @param {Error} [inner] The inner error.
 * @returns {OverlappingCurvesException} An instance of `OverlappingCurvesException`.
 */
export function createOverlappingCurvesException(
  message?: string,
  inner?: Error
): OverlappingCurvesException {
  const exception = new OverlappingCurvesException(message);
  if (inner) {
    exception.stack += `\nCaused by: ${inner.stack}`;
  }
  return exception;
}
