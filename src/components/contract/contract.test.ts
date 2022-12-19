import app from '../../../handler';
import supertest from 'supertest';
import { truncateDB } from '../../test/helpers';
import { contractsData } from './contract.seedings';
import { documentClient } from '../../../config/database';

describe('[E2E] Contracts', function() {

  describe('Testing createContract endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('creates a contract', async function() {
      // status code should be 201 `Created`

      // removing the id before using the seeding data
      const { contractID, ...contract } = contractsData[0];

      await supertest(app)
        .post('/createContract')
        .send(contract)
        .expect(201);
    });

    // Failure scenarios
    it('returns 400 if the input violates any validation rule', async function() {

      // removing the id before using the seeding data
      const { contractID, ...contract } = contractsData[0];

      // because sending the contractID is not allowed
      await supertest(app)
        .post('/createContract')
        .send(contractsData[0])
        .expect(400);

      // empty names are not allowed
      await supertest(app)
        .post('/createContract')
        .send({
          ...contract,
          contractName: '',
        })
        .expect(400);

      // userID must be a valid uuid string
      await supertest(app)
        .post('/createContract')
        .send({
          ...contract,
          userID: 'test',
        })
        .expect(400);

      // templateID must be a valid uuid string
      await supertest(app)
        .post('/createContract')
        .send({
          ...contract,
          templateID: 'test',
        })
        .expect(400);
    });
  });

  describe('Testing getContractIDs endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('fetches the contracts', async function() {
      await documentClient.batchWrite({
        RequestItems: {
          contracts: [
            ...contractsData.map(contract => {
              return {
                PutRequest: {
                  Item: {
                    ...contract,
                  },
                },
              };
            }),
          ],
        },
      }).promise();

      const response = await supertest(app)
        .get('/getContractIDs');

      expect(response.statusCode).toEqual(200);
      expect(response.body.data.length).toEqual(4);
    });

  });

  describe('Testing getContract endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('fetches the details of the requested contract', async function() {
      await documentClient.put({
        TableName: 'contracts',
        Item: {
          ...contractsData[0],
        },
      }).promise();

      const response = await supertest(app)
        .get(`/getContract?id=${contractsData[0].contractID}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body.data.contractID).toEqual(contractsData[0].contractID);
      expect(response.body.data.contractName).toEqual(contractsData[0].contractName);
    });

    // failure scenarios
    it('returns 404 if no contracts found', async function() {
      const response = await supertest(app)
        .get(`/getContract?id=${contractsData[0].contractID}`);

      expect(response.statusCode).toEqual(404);
    });
  });

});
