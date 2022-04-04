import type { RequestHandler } from '@sveltejs/kit';
import { api } from './_api';

export const del: RequestHandler = (event) => {
	return api(event);
};

export const patch: RequestHandler = async (event) => {
	const formData = await event.request.formData();
  const todoText = formData.has('text') ? (formData.get('text') as string).trim() : undefined
  const todoDone = formData.has('done') ? !!formData.get('done') : undefined

  return api(event, {
		text: todoText,
		done: todoDone
	});
};
