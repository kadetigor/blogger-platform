import { WithId } from 'mongodb';
import { jwtService } from '../adapters/jwt.service';
import { bcryptService } from '../adapters/bcrypt.service';
import { HttpStatus } from '../../core/types/httpStatus';
import { Result } from '../../core/result/result.type';
import { usersRepository } from '../../users/repositories/usersRepository';
import { User } from '../../users/domain/user';
import { emailManager } from '../../email/managers/email.manager';
import { uuid } from 'uuidv4';
import { UserWithConfirmation } from '../../email/user.with.confirmation.type';

export const authService = {
  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<{ accessToken: string } | null>> {
    const result = await this.checkUserCredentials(loginOrEmail, password);
    if (result.status !== HttpStatus.Ok)
      return {
        status: HttpStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
        data: null,
      };

    const accessToken = await jwtService.createToken(result.data!._id.toString(), result.data!.login);

    return {
      status: HttpStatus.Ok,
      data: { accessToken },
      extensions: [],
    };
  },

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<WithId<User> | null>> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user)
      return {
        status: HttpStatus.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
      };

    const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);
    if (!isPassCorrect)
      return {
        status: HttpStatus.BadRequest,
        data: null,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'password', message: 'Wrong password' }],
      };

    return {
      status: HttpStatus.Ok,
      data: user,
      extensions: [],
    };
  },

  async registerUser(
    login: string,
    email: string,
    password: string
  ): Promise<Result<WithId<User> | null>> {
    const passwordHash = await bcryptService.generateHash(password)

    const user: UserWithConfirmation = {
      login,
      email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: uuid(),
        isConfirmed: false
      }
    };

    await usersRepository.create(user)
    await emailManager.sendEmailConfimationMessage(user)

    return {
      status: HttpStatus.NoContent,
      data: null,
      errorMessage: 'Not Found',
      extensions: [],
    }
  },

  async confirmEmail(
    code: string,
  ): Promise<boolean> {
    let user = await usersRepository.findByConfirmationCode(code)
    if (!user) return false
    if (user.emailConfirmation.confirmationCode !== code) return false
    
    let result = await usersRepository.updateConfirmation(user._id)
    return result
  }
};
