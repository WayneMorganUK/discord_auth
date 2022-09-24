import type { PageLoad } from '../../.svelte-kit/types/src/routes/$types';

export const load: PageLoad = async ({ parent }) => {
	console.log('==================== +page.ts =======================');
	const locals = await parent();
	return {
		locals
	};
};
