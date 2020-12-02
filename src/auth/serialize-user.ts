import { User } from '../entities/users/user';

export async function serializeUser(user: User) {
  return {
    _id: user._id,
    authType: user.authProvider,
    name: user.name,
    email: user.email,
  };
}
