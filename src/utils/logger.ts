/**
 * Quiet by default so CI logs stay readable.
 * Enable with DEBUG_TESTS=true.
 */
export const logger = {
  debug(message: string): void {
    if (process.env.DEBUG_TESTS === 'true') {
      console.log(`[framework] ${message}`);
    }
  },
};
