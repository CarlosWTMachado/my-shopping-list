import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

export function generateItem() {
	return {
		title: faker.random.word(),
		url: faker.internet.url(),
		description: faker.lorem.paragraph(),
		amount: Math.floor(Math.random() * 100) + 1
	};
}

export async function createItem() {
	const item = generateItem();

	const insertedItem = await prisma.items.create({
		data: item
	});

	return {item, insertedItem};
}