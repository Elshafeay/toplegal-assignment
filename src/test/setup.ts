import { truncateDB } from './helpers';

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await truncateDB();
});
