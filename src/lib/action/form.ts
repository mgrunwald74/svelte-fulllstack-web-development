// TODO: Add error handling
export const enhance = (form: HTMLFormElement, {
  result
}) => {
	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		try {
			const body = new FormData(form);
			const res = await fetch(form.action, {
				headers: {
					accept: 'application/json'
				},
				method: form.method,
				body
			});

      if (res.ok) {
        result(res, form)
      } else {
        console.error('Fetch error: ', await res.json())
      }
		} catch (error) {
			console.error('Could not submit the form: ', error);
		}
	};

	form.addEventListener('submit', handleSubmit);

	return {
		destroy() {
			form.removeEventListener('submit', handleSubmit);
		}
	};
};
