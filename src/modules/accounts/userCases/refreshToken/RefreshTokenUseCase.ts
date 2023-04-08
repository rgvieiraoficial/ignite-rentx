import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { AppError } from '@shared/errors/AppError';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

import auth from '@config/auth';

interface IPayload {
  email: string;
  sub: string;
}

interface ITokenReponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {

  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider
  ) { }

  async execute(token: string): Promise<ITokenReponse> {
    const { secret_refresh_token, secret_token, expires_in_refresh_token, expires_in_token, expires_refresh_token_days } = auth;

    const { email, sub } = verify(token, secret_refresh_token) as IPayload;

    const user_id = sub;

    const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(user_id, token);

    if (!userToken) {
      throw new AppError('Refresh Token does not exists!')
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const expires_date = this.dateProvider.addDays(expires_refresh_token_days);

    const refresh_token = sign({ email }, secret_refresh_token, {
      subject: user_id,
      expiresIn: expires_in_refresh_token
    });

    const newToken = sign({}, secret_token, {
      subject: user_id,
      expiresIn: expires_in_token
    });

    await this.usersTokensRepository.create({
      user_id,
      expires_date,
      refresh_token
    });

    return { token: newToken, refresh_token };
  }
}

export { RefreshTokenUseCase };