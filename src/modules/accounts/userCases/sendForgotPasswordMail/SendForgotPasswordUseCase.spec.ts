import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';
import { AppError } from '@shared/errors/AppError';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProviderInMemory: MailProviderInMemory;

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;

describe('Send Forgot Password Mail', () => {

  usersRepositoryInMemory = new UsersRepositoryInMemory();
  usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
  dateProvider = new DayjsDateProvider();
  mailProviderInMemory = new MailProviderInMemory();

  beforeEach(() => {
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProviderInMemory
    );
  });

  it('should be able to send a forgot password mail to user', async () => {
    const sendMail = jest.spyOn(mailProviderInMemory, 'sendMail');

    await usersRepositoryInMemory.create({
      name: 'Glodobaldo Ferrundes',
      email: 'glodobaldo.ferrundes@gmail.com',
      password: '123456',
      driver_license: 'ART4-845E'
    });

    await sendForgotPasswordMailUseCase.execute('glodobaldo.ferrundes@gmail.com');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send an email if user does not exits', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('ferronildo@gmail.com')
    ).rejects.toEqual(new AppError('User does not exists!'));
  });

  it('should be able to create an users token', async () => {
    const generateTokenMail = jest.spyOn(usersTokensRepositoryInMemory, 'create');

    await usersRepositoryInMemory.create({
      name: 'Usuário Oculto',
      email: 'hidden.user@gmail.com',
      password: '123456',
      driver_license: 'PVQ42-742F'
    });

    await sendForgotPasswordMailUseCase.execute('hidden.user@gmail.com');

    expect(generateTokenMail).toHaveBeenCalled();
  });
});