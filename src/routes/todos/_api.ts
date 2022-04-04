import type { RequestEvent } from '@sveltejs/kit/types/private';

// TODO: Persist in database
let todos: Todo[] = [];

export const api = (event: RequestEvent<{ uid?: string }>, data?: Record<string, unknown>) => {
	const { request, params } = event;
	let body = {};
	let status = 500;

	switch (request.method.toLocaleUpperCase()) {
		case 'GET':
			body = todos;
			status = 200;
			break;
		case 'POST':
			todos.push(data as Todo);
			body = data;
			status = 201;
			break;
		case 'PATCH':
			todos = todos.map((todo) => {
				if (todo.uid === params.uid) {
					todo.text = data.text as string;
				}
				return todo;
			});
			status = 200;
			break;
		case 'DELETE':
			todos = todos.filter((todo) => todo.uid !== params.uid);
			status = 200;
			break;

		default:
			break;
	}

	if (request.method !== 'GET') {
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
