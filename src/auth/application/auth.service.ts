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

  async confirmEmail(code: string): Promise<boolean> {
    try {
        const user = await usersRepository.findByConfirmationCode(code);
        
        if (user.emailConfirmation.isConfirmed) {
            return false; // Already confirmed
        }
        
        const result = await usersRepository.updateConfirmation(user._id);
        return result;
    } catch (error) {
        return false; // User not found or other error
    }
  },

  async resendConfirmationEmail(email: string): Promise<Result<null>> {
    const user = await usersRepository.findByLoginOrEmail(email);
    
    if (!user) {
        return {
            status: HttpStatus.BadRequest,
            data: null,
            errorMessage: 'User not found',
            extensions: [{ field: 'email', message: 'User with this email does not exist' }],
        };
    }

    // Check if user is already confirmed
    const userWithConfirmation = user as WithId<UserWithConfirmation>;
    if (userWithConfirmation.emailConfirmation?.isConfirmed) {
        return {
            status: HttpStatus.BadRequest,
            data: null,
            errorMessage: 'Email already confirmed',
            extensions: [{ field: 'email', message: 'Email is already confirmed' }],
        };
    }

    // Generate new confirmation code
    const newConfirmationCode = uuid();
    
    // Update user with new confirmation code
    await usersRepository.updateConfirmationCode(user._id, newConfirmationCode);
    
    // Send email with new code
    const updatedUser = { ...userWithConfirmation, emailConfirmation: { ...userWithConfirmation.emailConfirmation, confirmationCode: newConfirmationCode } };
    await emailManager.sendEmailConfimationMessage(updatedUser);

    return {
        status: HttpStatus.NoContent,
        data: null,
        errorMessage: '',
        extensions: [],
    };
},
};
