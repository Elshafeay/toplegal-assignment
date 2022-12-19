import { truncateDB } from './helpers';

beforeEach(async () => {
  jest.clearAllMocks();
  process.env.JWT_KEY = 'somesecret';
});

afterAll(async () => {
  await truncateDB();
});
