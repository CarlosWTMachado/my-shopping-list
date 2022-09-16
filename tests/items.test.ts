import app from '../src/app';
import supertest from 'supertest';
import { generateItem, createItem } from './factories/itemFactory';
import { prisma } from '../src/database';

beforeEach(async () => {
	await prisma.$executeRaw`TRUNCATE TABLE items`;
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe('Testa POST /items ', () => {
	it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
		const body = generateItem();

		const result = await supertest(app).post("/items").send(body);

		expect(result.status).toEqual(201);
	});

	it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
		const { item: body } = await createItem();

		const result = await supertest(app).post("/items").send(body);

		expect(result.status).toEqual(409);
	});
});

describe('Testa GET /items ', () => {
	it('Deve retornar status 200 e o body no formato de Array', async () => {
		const result = await supertest(app).get("/items");

		expect(result.status).toEqual(200);
		expect(result.body).toBeInstanceOf(Array);
	});
});

describe('Testa GET /items/:id ', () => {
	it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
		const { insertedItem: item } = await createItem();

		const result = await supertest(app).get(`/items/${item.id}`);

		expect(result.status).toEqual(200);
		expect(result.body).toEqual(item);
	});
	it('Deve retornar status 404 caso não exista um item com esse id', async () => {
		const result = await supertest(app).get("/items/-1");

		expect(result.status).toEqual(404);
	});
});
