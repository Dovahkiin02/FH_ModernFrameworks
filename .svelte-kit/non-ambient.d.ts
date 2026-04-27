
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/(auth)" | "/(app)" | "/" | "/(auth)/auth" | "/(auth)/auth/callback" | "/(app)/history" | "/how-to-play" | "/(app)/lab" | "/(auth)/login" | "/(auth)/logout" | "/(app)/play" | "/(auth)/signup";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/(auth)": Record<string, never>;
			"/(app)": Record<string, never>;
			"/": Record<string, never>;
			"/(auth)/auth": Record<string, never>;
			"/(auth)/auth/callback": Record<string, never>;
			"/(app)/history": Record<string, never>;
			"/how-to-play": Record<string, never>;
			"/(app)/lab": Record<string, never>;
			"/(auth)/login": Record<string, never>;
			"/(auth)/logout": Record<string, never>;
			"/(app)/play": Record<string, never>;
			"/(auth)/signup": Record<string, never>
		};
		Pathname(): "/" | "/auth/callback" | "/history" | "/how-to-play" | "/lab" | "/login" | "/logout" | "/play" | "/signup";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/robots.txt" | string & {};
	}
}