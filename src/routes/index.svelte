<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { enhance } from '$lib/action/form';

	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/todos.json');

		if (res.ok) {
			const todos = await res.json();
			return {
				props: { todos }
			};
		}

		const { message } = await res.json();
		return {
			error: new Error(message)
		};
	};
</script>

<script lang="ts">
	import TodoItem from '$lib/todo-item.svelte';

	export let todos: Todo[];

	const title = 'Todos';

	const processNewTodoResult = async (res: Response, form: HTMLFormElement) => {
		const newTodo = await res.json();
		todos = [...todos, newTodo];
		form.reset();
	};

	const processUpdatedTodoResult = async (res: Response) => {
		// TODO: Howto update or reverse text field when trying to update to an empty string?
		const updatedTodo = await res.json();

		todos = todos.map((t) => {
			if (t.uid === updatedTodo.uid) {
				return updatedTodo;
			}
			return t;
		});
		focusFirstInputElement();
	};

	const processDeletedTodoResult = async (todo: Todo) => {
		todos = todos.filter((t) => t.uid !== todo.uid);
		focusFirstInputElement();
	};

	const focusFirstInputElement = () => {
		const focusable = document.querySelectorAll('input');
		let firstFocusable = focusable[0] as HTMLInputElement;
		firstFocusable.focus();
	};
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="todos">
	<h1>{title}</h1>
	<form
		action="/todos.json"
		method="post"
		class="new"
		use:enhance={{ result: processNewTodoResult }}
	>
		<input type="text" name="text" aria-label="Add a todo" placeholder="+ tap to add a todo" />
	</form>

	{#each todos as todo}
		<TodoItem
			{todo}
			processDeletedTodoResult={() => processDeletedTodoResult(todo)}
			{processUpdatedTodoResult}
		/>
	{/each}
</div>

<style>
	.todos {
		width: 100%;
		max-width: 42rem;
		margin: 4rem auto 0 auto;
	}

	.new {
		margin: 0 0 0.5rem 0;
	}

	.new input {
		font-size: 28px;
		width: 100%;
		padding: 0.5em 1em 0.3em 1em;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		text-align: center;
	}

	/* target the .todos class and apply styles to all it´s children above!
		 -> :global() comes from svelte
	*/
	.todos :global(input) {
		border: 1px solid transparent;
	}

	.todos :global(input:focus-visible) {
		box-shadow: inset 1px 1px 6px rgba(0, 0, 0, 0.1);
		border: 1px solid #ff3e00 !important;
		outline: none;
	}
</style>
