import supertest from 'supertest';
import app from '../../handler';

describe('General Tests', function() {
  describe('Testing 404 NotFound', function() {
    it('returns 404 if the route doesn\'t match any endpoints', async function() {
      await supertest(app)
        .get('/somereallydummyroute')
        .expect(404);
    });
  });
});
