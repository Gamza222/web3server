import { rateLimit } from 'express-rate-limit';

export const Defaultlimiter = (
  message: string,
  minutes: number,
  numReq: number,
) => {
  const limiter = rateLimit({
    windowMs: minutes * 60 * 1000, // 15 minutes
    max: numReq, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: message,
  });
  return limiter;
};
