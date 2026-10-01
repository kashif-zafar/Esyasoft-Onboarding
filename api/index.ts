/**
 * Vercel serverless entry point.
 *
 * Every /api/* request is rewritten to this function (see vercel.json)
 * and handled by the Express app in server/index.ts.
 */
import app from '../server/index.js';

export default app;
