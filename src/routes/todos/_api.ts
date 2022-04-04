import type { RequestEvent } from '@sveltejs/kit/types/private';

// TODO: Persist in database
let todos: Todo[] = [];

export const api = (event: RequestEvent<{ uid?: string }>, todo?: Todo) => {
	const { request, params } = event;
	let body = {};
	let status = 500;

	switch (request.method.toLocaleUpperCase()) {
		case 'GET':
			body = todos;
			status = 200;
			break;
		case 'POST':
			todos.push(todo);
      body =  todo;
      status = 201;
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
