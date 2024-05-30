const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const app = require('../app.js')
const request = require("supertest")
const db = require('../db/connection.js')

beforeEach(() => seed(testData))
afterAll(() => db.end());

describe('GET /api/users', () => {
    test('should get all users', () => {
        return request(app)
            .get('/api/users')
            .then(({ body }) => {
                expect(body).toHaveProperty(['users'])
                body.users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    test('204 - should delete the given comment by comment_id', () => {
        return request(app)
            .delete('/api/comments/1')
            .expect(204)
            .then(() => {
                return request(app)
                    .get("/api/articles/9/comments")
                    .expect(200)
                    .then(({ body }) => {
                        body.comments.forEach((comment) => {
                            expect(comment.comment_id).not.toBe(1)
                        })
                    })
            })
    });
    test('404 - if sent valid comment_id but the id does not exist', () => {
        return request(app)
            .delete('/api/comments/0')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('404 - Not Found')
            })
    });
    test('400 - throws an error if sent invalid comment_id', () => {
        return request(app)
            .delete('/api/comments/NotAnId')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('400 - Invalid Input')
            })
    });
    test('404 - throws an error if sent invalid endpoint', () => {
        return request(app)
            .delete('/api/SpellingMistake/1')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('404 - Not Found')
            })
    });

});

describe('PATCH /api/articles/:article_id', () => {
    test('200 - patch an article by article_id', () => {
        const newPatch = {
            inc_votes: 1
        }
        return request(app)
            .patch('/api/articles/1').send(newPatch)
            .expect(200)
            .then(({ body }) => {
                expect(body).toContainKeys(["article"])
                expect(body.article.votes).not.toBe(100)
                expect(body.article.votes).toBe(101)
                expect(body.article.article_id).toBe(1)
            })
    });

    test('200 - can subtract votes', () => {

        const newPatch = {
            inc_votes: -100
        }

        return request(app)
            .patch('/api/articles/1').send(newPatch)
            .expect(200)
            .then(({ body }) => {
                expect(body).toContainKeys(["article"])
                expect(body.article.votes).not.toBe(100)
                expect(body.article.votes).toBe(0)
                expect(body.article.article_id).toBe(1)
            })
    });

    test('200 - can subtract votes from votes that are 0', () => {

        const newPatch = {
            inc_votes: -100
        }

        return request(app)
            .patch('/api/articles/2').send(newPatch)
            .expect(200)
            .then(({ body }) => {
                expect(body).toContainKeys(["article"])
                expect(body.article.votes).not.toBe(0)
                expect(body.article.votes).toBe(-100)
                expect(body.article.article_id).toBe(2)
            })
    });

    test('200 - ignores patches with extra keys', () => {

        const newPatch = {
            inc_votes: -100,
            some_other_random_thing: 5
        }

        return request(app)
            .patch('/api/articles/2').send(newPatch)
            .expect(200)
            .then(({ body }) => {
                expect(body.article.votes).toBe(-100)
            })
    });

    test('400 - throws error if patch is missing required key', () => {

        const newPatch = {
            some_other_random_thing: 5
        }

        return request(app)
            .patch('/api/articles/2').send(newPatch)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe("400 - Bad Request")
            })
    });

    test('400 - throws error if valid patch but invalid article_id', () => {

        const newPatch = {
            inc_votes: 100
        }

        return request(app)
            .patch('/api/articles/notAnId').send(newPatch)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe("400 - Invalid Input")
            })
    });

    test('400 - throws error if patch has wrong property type', () => {

        const newPatch = {
            inc_votes: "puddings"
        }

        return request(app)
            .patch('/api/articles/1').send(newPatch)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe("400 - Invalid Input")
            })
    });

    test('404 - when given valid article_id that doesnt exist', () => {

        const newPatch = {
            inc_votes: 100
        }

        return request(app)
            .patch('/api/articles/0').send(newPatch)
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe("404 - Not Found")
            })
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    test('201 - should add a new comment for an article', () => {
        const newComment = {
            body: "I am a new comment!",
            username: "lurker",
        }
        return request(app)
            .post('/api/articles/1/comments').send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body).toContainKeys(["comment"])
                expect(body.comment.body).toEqual("I am a new comment!")
                expect(body.comment.article_id).toEqual(1)
                expect(body.comment.author).toBeDefined()
                expect(body.comment.votes).toBe(0)
                expect(body.comment.author).toBe("lurker")
            })
    });

    test('201 - ignores extra properties', () => {
        const newComment = {
            body: "I am a new comment!",
            username: "lurker",
            votes: 10000
        }
        return request(app)
            .post('/api/articles/1/comments').send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment.body).toEqual("I am a new comment!")
                expect(body.comment.votes).not.toEqual(1000)
                expect(body.comment.votes).toEqual(0)
            })
    });

    test('400 - should return error if sent comment body with missing required fields', () => {
        const newComment = {
            body: "I am a new comment!",
        }
        return request(app)
            .post('/api/articles/1/comments').send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe("400 - Bad Request")
            })
    });

    test('400 - should return error if sent invalid article_id', () => {
        const newComment = {
            body: "I am a new comment!",
            username: "lurker",
        }
        return request(app)
            .post('/api/articles/notAnIdYo/comments').send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe("400 - Bad Request")
            })
    });

    test('404 - should return not found for non-existent but valid article_id', () => {
        const newComment = {
            body: "I am a new comment!",
            username: "lurker",
        }
        return request(app)
            .post('/api/articles/0/comments').send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe("404 - Not Found")
            })
    });

    test('404 - should throw an error if passed a username that does not exist', () => {
        const newComment = {
            body: "I am a new comment!",
            username: "not a valid user name",
        }
        return request(app)
            .post('/api/articles/1/comments').send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toEqual("404 - Not Found")

            })
    });
});

describe('GET /api/articles/:article_id/comments', () => {
    test('200 - it responds with an array of comments for the given article_id', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body).toContainKeys(['comments'])
                expect(body.comments.length).toBe(11)
                body.comments.forEach((comment) => {
                    expect(comment).toMatchObject(
                        {
                            comment_id: expect.any(Number),
                            body: expect.any(String),
                            votes: expect.any(Number),
                            author: expect.any(String),
                            article_id: expect.any(Number),
                            created_at: expect.any(String)
                        })
                })
            })
    });
    test('200 - comments should be served with the most recent comments first', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments.length).toBe(11)
                expect(body.comments).toBeSortedBy('created_at', { descending: true })
            })
    });
    test('200 - it responds with empty array when valid article_id but no related comments', () => {
        return request(app)
            .get('/api/articles/10/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments.length).toBe(0)
            })
    });
    test('400 - it responds with error message when an invalid article_id is requested', () => {
        return request(app)
            .get('/api/articles/potatoes/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('400 - Invalid Input')
            })
    });
    test('404 - it responds with error message when given valid article_id but invalid endpoint', () => {
        return request(app)
            .get('/api/articles/1/commentos!')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('404 - Not Found')
            })
    });

});

describe('GET /api/articles', () => {
    test('200 - should respond with an articles array of article objects', () => {
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
                })
            })
    });
    test('200 - should respond with an articles array of article objects that do not contain body property', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13);
                body.articles.forEach((article) => {
                    expect(article).not.toHaveProperty('body');
                })
            })
    });
    test('200 - should respond with an articles array sorted by descending date', () => {
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
    // should respond with empty array if there are no articles?
    test('404 - it responds with error message when non-existent endpoint is requested', () => {
        return request(app)
            .get('/api/bananas')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('404 - Not Found')
            })
    });
});

describe('GET /api/articles/:article_id', () => {
    test('200 - should respond with an article object', () => {
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
    test('404 - it responds with error message when valid but non-existent article_id is requested', () => {
        return request(app)
            .get('/api/articles/99985')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('404 - Not Found')
            })
    });
    test('400 - it responds with error message when an invalid article_id is requested', () => {
        return request(app)
            .get('/api/articles/notAnId')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('400 - Bad Request')
            })
    });
});

describe('GET /api', () => {
    test('200 - should respond with an object describing all available endpoints on the API', () => {
        const endpointsJSON = require('../endpoints.json')
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body).toContainKeys(['endpoints']);
                expect(body.endpoints).toEqual(endpointsJSON);
            })
    });
    test('404 - should respond with an error if given unknown endpoint', () => {
        return request(app)
            .get('/apiii')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toEqual("404 - Not Found")
            })
    });
});

describe('GET /api/topics', () => {
    test('200 - should return an array of topics', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                expect(body).toContainKeys(['topics']);
                expect(body.topics.length).toBe(3);
                expect(body.topics[0]).toContainKeys(['slug', 'description']);
            })
    });
    test('404 - should respond with an error if given unknown endpoint', () => {
        return request(app)
            .get('/api/topicsicoco')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toEqual("404 - Not Found")
            })
    });
});