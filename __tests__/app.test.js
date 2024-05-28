const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const app = require('../app.js')
const request = require("supertest")
const db = require('../db/connection.js')

beforeEach(() => seed(testData))
afterAll(() => db.end());

describe('GET /api', () => {
    test('should respond with an object describing all available endpoints on the API', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body).toContainKeys(['endpoints']);
                expect(body.endpoints["GET /api"].description).toBe("serves up a json representation of all the available endpoints of the api");
            })
    });
});

describe('GET /api/topics', () => {
    test('should return an array of topics', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                expect(body).toContainKeys(['topics']);
                expect(body.topics.length).toBe(3);
                expect(body.topics[0]).toContainKeys(['slug', 'description']);
            })
    });
});

describe('Error Handling', () => {
    test('it responds with error message when non-existent endpoint is requested', () => {
        return request(app)
            .get('/api/bananas')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('404 - Not Found')
            })
    });
});