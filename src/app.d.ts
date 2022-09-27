// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		dscrd_access_token: string;
		dscrd_refresh_token: string;
		user: User
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

type DataObject = Record<string, string>;

type User = null | {
	id: string;
	username: string;
	avatar: string;
	avatar_decoration: null | string;
	discriminator: string;
	public_flags: number;
	flags: number;
	banner: null | string;
	banner_color: string;
	accent_color: string;
	locale: string;
	mfa_enabled: boolean;
	email: string;
	verified: boolean;
};
