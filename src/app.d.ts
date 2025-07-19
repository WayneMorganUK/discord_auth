// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			discord_access_token: string;
			discord_refresh_token: string;
			user: User
		}
		// interface PageData {}
		// interface PageState {}
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

	type Guilds = {
		id: string
		name: string;
		icon: string;
		banner: string;
		owner: boolean;
		permissions: number;
		permissions_new: string;
		features: string[];
	}
	type Guild = {
		id: string;
		last_message_id: string;
		flags: number;
		guild_id: string;
		name: string;

		parent_id: string | null;
		rate_limit_per_user: number;
		topic: string | null;
		position: number;
		permission_overwrites: PermissionOverwrites[];
		nsfw: boolean;
		icon_emoji: IconEmoji;

	}

	type IconEmoji = {
		id: string | null;
		name: string;
	}

	type PermissionOverwrites = {
		id: string;
		type: number;
		allow: string;
		deny: string;
	}
}

export { };
