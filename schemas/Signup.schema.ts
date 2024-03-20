import { z } from 'zod';
import SigninSchema from './Signin.schema';

export default SigninSchema.extend({
  name: z.string().min(3).max(50), passwordConfirm: z.string().min(8)
}).refine(data => data.password === data.passwordConfirm, {
  message: "密码不一致",
  path: ["passwordConfirm"]
})  