import app from '../../../handler';
import supertest from 'supertest';
import { signup, truncateDB } from '../../test/helpers';
import { usersData } from './user.seedings';
import { documentClient } from '../../../config/database';
import * as uuid from 'uuid';

describe('[E2E] User', function() {

  describe('Testing the signup endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('creates an account and returns an Auth Token', async function() {
      const { userID, ...userData } = usersData[0];

      // status code should be 201 `Created`
      const response = await supertest(app)
        .post('/users')
        .send(userData);
      expect(response.statusCode).toBe(201);
      expect(response.body.data.user.email).toEqual(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    // Failure scenarios
    it('returns 400 if an account existed with the same email address', async function() {
      const { userID, ...userData } = usersData[0];

      // status code should be 201 `Created`
      const createUser1Response = await supertest(app)
        .post('/users')
        .send(userData);

      expect(createUser1Response.statusCode).toBe(201);

      // status code should be 400
      const createUser2Response = await supertest(app)
        .post('/users')
        .send(userData);
      expect(createUser2Response.statusCode).toBe(400);
    });

    it('returns 400 if the input violates any validation rule', async function() {

      // removing the id before using the seeding data
      const { userID, ...user } = usersData[0];

      // because sending the userID is not allowed
      await supertest(app)
        .post('/users')
        .send(usersData[0])
        .expect(400);

      // empty names are not allowed
      await supertest(app)
        .post('/users')
        .send({
          ...user,
          firstname: '',
        })
        .expect(400);

      // names must have a minimum length of 3
      await supertest(app)
        .post('/users')
        .send({
          ...user,
          lastname: 'a',
        })
        .expect(400);

      // email must be a valid email
      await supertest(app)
        .post('/users')
        .send({
          ...user,
          email: 'test@',
        })
        .expect(400);

      // password must be have a mimimum length of 8
      await supertest(app)
        .post('/users')
        .send({
          ...user,
          password: '1234567',
        })
        .expect(400);
    });
  });

  describe('Testing the login endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('Logins Successfully', async function() {
      const { userID, ...userData } = usersData[0];

      // status code should be 201 `Created`
      const response = await supertest(app)
        .post('/users')
        .send(userData);
      expect(response.statusCode).toBe(201);

      await supertest(app)
        .post('/users/login')
        .send({
          email: userData.email,
          password: userData.password,
        }).expect(200);
    });

    // Failure scenarios
    it('returns 401 if invalid credentials', async function() {
      const { userID, ...userData } = usersData[0];

      // status code should be 201 `Created`
      await supertest(app)
        .post('/users')
        .send(userData)
        .expect(201);

      // status code should be 401
      await supertest(app)
        .post('/users/login')
        .send({
          email: userData.email,
          password: userData.password+'1',
        }).expect(401);

      // status code should be 401
      await supertest(app)
        .post('/users/login')
        .send({
          email: 'a'+userData.email,
          password: userData.password,
        }).expect(401);

    });

    it('returns 400 if the input violates any validation rule', async function() {

      // email must be a valid email
      await supertest(app)
        .post('/users')
        .send({
          email: 'test@',
          password: usersData[0].password,
        })
        .expect(400);

      // password must be have a mimimum length of 8
      await supertest(app)
        .post('/users')
        .send({
          email: usersData[0].email,
          password: '1234567',
        })
        .expect(400);
    });
  });

  describe('Testing getUsers endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('Fetches Users', async function() {
      await documentClient.batchWrite({
        RequestItems: {
          users: [
            ...usersData.map(user => {
              return {
                PutRequest: {
                  Item: {
                    ...user,
                  },
                },
              };
            }),
          ],
        },
      }).promise();

      const response = await supertest(app)
        .get('/users')
        .set({ Authorization: await signup() });

      expect(response.statusCode).toEqual(200);

      // 3 in the seeding + 1 user we created for authentication
      expect(response.body.data.users.length).toEqual(4);
    });

    // Failure scenarios
    it('requires authentication', async function() {
      const response = await supertest(app)
        .get('/users');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing getProfile endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('returns the profile data successfully', async function() {
      const response = await supertest(app)
        .get('/me')
        .set({ Authorization: await signup() });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.profile.firstname).toBe('test');
    });

    // Failure scenarios
    it('requires authentication', async function() {
      const response = await supertest(app)
        .get('/me');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing getUser endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('returns the user data successfully', async function() {
      const { userID, ...userData } = usersData[0];

      const createUserResponse = await supertest(app)
        .post('/users')
        .send(userData);
      const id = createUserResponse.body.data.user.userID;

      const getUserResponse = await supertest(app)
        .get(`/users/${id}`)
        .set({ Authorization: await signup() });

      expect(getUserResponse.statusCode).toBe(200);
      expect(getUserResponse.body.data.user.email).toBe(userData.email);
    });

    // Failure scenarios
    it('requires authentication', async function() {
      await supertest(app)
        .get('/users/'+uuid.v4())
        .expect(401);
    });

    it('returns 400 incase of violating the validation', async function() {
      await supertest(app)
        .get('/users/11111')
        .set({ Authorization: await signup() })
        .expect(400);
    });
  });

});