const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const app = require('../app.js')
const request = require("supertest")
const db = require('../db/connection.js')

beforeEach(() => seed(testData))
afterAll(() => db.end());

describe('GET /api/articles', () => {
    test('should respond with an articles array of article objects', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body).toContainKeys(['articles']);
                expect(body.articles.length).toBe(13);
                body.articles.forEach((article) => {
                    expect(article).toHaveProperty('author');
                    expect(article).toHaveProperty('title');
                    expect(article).toHaveProperty('article_id');
                    expect(article).toHaveProperty('topic');
                    expect(article).toHaveProperty('created_at');
                    expect(article).toHaveProperty('votes');
                    expect(article).toHaveProperty('article_img_url');
                    expect(article).toHaveProperty('comment_count');
                    expect(article).not.toHaveProperty('body');
                })
            })
    });
    test('should respond with an articles array sorted by descending date', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13);
                expect(body.articles).toBeSortedBy('created_at', {
                    descending: true
                });
            })
    });
});

describe('GET /api/articles/:article_id', () => {
    test('should respond with an article object', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body).toContainKeys(['article']);
                expect(body.article).toMatchObject({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 100,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                })
            })
    });
});


describe('GET /api', () => {
    test('should respond with an object describing all available endpoints on the API', () => {
        const endpointsJSON = require('../endpoints.json')
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body).toContainKeys(['endpoints']);
                expect(body.endpoints).toEqual(endpointsJSON);
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

    test('it responds with error message when valid but non-existent article_id is requested', () => {
        return request(app)
            .get('/api/articles/99985')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('404 - Not Found')
            })
    });


    test('it responds with error message when valid but non-existent article_id is requested', () => {
        return request(app)
            .get('/api/articles/99985')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('404 - Not Found')
            })
    });

    test('it responds with error message when an invalid article_id is requested', () => {
        return request(app)
            .get('/api/articles/notAnId')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('400 - Bad Request')
            })
    });
});