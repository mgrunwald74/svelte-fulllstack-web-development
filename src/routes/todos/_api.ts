import type { RequestEvent } from '@sveltejs/kit/types/private';
import PrismaClient from '$lib/prisma';

const prisma = new PrismaClient();

export const api = async (event: RequestEvent<{ uid?: string }>, data?: Record<string, unknown>) => {
	const { request, params } = event;
	let body = {};
	let status = 500;

	switch (request.method.toLocaleUpperCase()) {
		case 'GET':
			body = await prisma.todo.findMany();
			status = 200;
			break;
		case 'POST':
			if (!data.text) {
				status = 500;
				body = { message: 'Text cannot be empty!' };
				break;
			}
			body = await prisma.todo.create({
				data: {
					created_at: data.created_at as Date,
					done: data.done as boolean,
					text: data.text as string
				}
			})
			status = 201;
			break;
		case 'PATCH':
			if (!data.text && data.done === undefined) {
				status = 200;
				body = data;
				break;
			}
			body = await prisma.todo.update({
				where: {
					uid: params.uid
				},
				data: {
					done: data.done as boolean,
					text: data.text as string
				}
			})
			status = 200;
			break;
		case 'DELETE':
			body = await prisma.todo.delete({
				where: {
					uid: params.uid
				}
			})
			status = 200;
			break;

		default:
			break;
	}

	if (request.method !== 'GET' && request.headers.get('accept') !== 'application/json') {
		return {
			status: 303,
			headers: {
				location: '/'
			}
		};
	}

	return {
		status,
		body
	};
};
