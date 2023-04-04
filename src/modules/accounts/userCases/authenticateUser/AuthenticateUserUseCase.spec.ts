import { AppError } from '@shared/errors/AppError';
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from '@modules/accounts/userCases/createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let autheticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let dateProvider: DayjsDateProvider;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();

    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();

    dateProvider = new DayjsDateProvider();

    autheticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory, usersTokensRepositoryInMemory, dateProvider);

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      name: 'Glodobaldo Ferrundes',
      email: 'glodobaldo.ferrundes@gmail.com',
      password: '123456',
      driver_license: 'DG74-HJ87-EB24-AW96'
    };

    await createUserUseCase.execute(user);

    const result = await autheticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(result).toHaveProperty('token');
  });

  it('should not be able to authenticate a non-existent user', () => {
    expect(autheticateUserUseCase.execute({
      email: 'false@email.com',
      password: '123456'
    })).rejects.toEqual(new AppError('Email or password incorrect!'));
  });

  it('should no be able to authenticate with incorrect password', async () => {
    const user: ICreateUserDTO = {
      name: 'Ferronido da Silva',
      email: 'ferronildo.silva@gmail.com',
      password: '123456',
      driver_license: 'DG74-HJ87-EB24-AW96'
    };

    await createUserUseCase.execute(user);

    await expect(autheticateUserUseCase.execute({
      email: user.email,
      password: '41245'
    })).rejects.toEqual(new AppError('Email or password incorrect!'))
  })
});