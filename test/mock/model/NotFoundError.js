/**
 * Thrown when model is non-existent
 */
class NotFoundError extends Error {
  /**
   * Initializes message
   */
  constructor() {
    super();
    this.message = 'Model not found.';
  }
}

module.exports = NotFoundError;
