// tests/cars.test.js
const request = require('supertest');
const app = require('../server');

// Mock the database module to avoid real DB calls
jest.mock('../db', () => {
    return {
        query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 })
    };
});

describe('API Endpoints', () => {
    test('GET /api/health should return status UP', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status: 'UP' });
    });

    test('GET / should return JSON when Accept: application/json', async () => {
        const res = await request(app)
            .get('/')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body).toHaveProperty('message', 'Break Backend API is running smoothly');
    });
});
