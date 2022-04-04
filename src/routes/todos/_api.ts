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
			if (!data.text) {
				status = 500;
				body = { message: 'Text cannot be empty!' };
				break;
			}
			todos.push(data as Todo);
			status = 201;
			body = data;
			break;
		case 'PATCH':
			if (!data.text && data.done === undefined) {
				status = 200;
				body = data
				break;
			}
			todos = todos.map((todo) => {
				if (todo.uid === params.uid) {
					if (data.text && data.text !== '') {
						todo.text = data.text as string;
					} else if (data.done !== undefined) {
						todo.done = data.done as boolean;
					}
				}
				return todo;
			});
			status = 200;
			body = todos.find((todo) => todo.uid === params.uid);
			break;
		case 'DELETE':
			todos = todos.filter((todo) => todo.uid !== params.uid);
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
