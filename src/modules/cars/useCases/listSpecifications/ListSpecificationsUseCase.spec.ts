import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory'
import { ListSpecificationsUseCase } from "./ListSpecificationsUseCase";

let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let listSpecificationsUseCase: ListSpecificationsUseCase;

describe('List Specifications', () => {
  beforeEach(() => {
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    listSpecificationsUseCase = new ListSpecificationsUseCase(specificationsRepositoryInMemory);
  });

  it('should be able to list all specifications', async () => {
    await specificationsRepositoryInMemory.create({
      name: 'Specification Test 1',
      description: 'Specification description'
    });

    await specificationsRepositoryInMemory.create({
      name: 'Specification Test 2',
      description: 'Specification description'
    });

    const specifications = await listSpecificationsUseCase.execute();

    expect(specifications.length).toBeGreaterThanOrEqual(1);
  });
});