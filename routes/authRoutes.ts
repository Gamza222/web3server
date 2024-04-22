import express from 'express';

import {
  Login,
  Register,
  SendLoginCode,
  VerifyUser,
} from 'controllers/authController';
import { Defaultlimiter } from 'utils/limiters/DefaultRateLimit/defaultRateLimit';

const authRouter = express.Router();

authRouter.post(
  '/register',
  Defaultlimiter('Too many register requests in 1 minute', 1, 3),
  Register,
);
authRouter.post(
  '/verify_user',
  Defaultlimiter('Too many verify  requests in 1 minute', 1, 3),
  VerifyUser,
);
authRouter.post(
  '/login',
  Defaultlimiter('Too many login  requests try in 1 minute', 1, 3),
  Login,
);
authRouter.post(
  '/send_login_code',
  Defaultlimiter('Too many login verify requests in 1 minute', 1, 3),
  SendLoginCode,
);
// router.post('/login', Login);

export default authRouter;
