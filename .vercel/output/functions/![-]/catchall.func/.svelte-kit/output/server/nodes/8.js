import * as server from '../entries/pages/(auth)/signup/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(auth)/signup/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(auth)/signup/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.8iS0DjI1.js","_app/immutable/chunks/O_MAeoO4.js","_app/immutable/chunks/DLRrmHlY.js","_app/immutable/chunks/DG9sdZuV.js","_app/immutable/chunks/DAXD84rI.js","_app/immutable/chunks/CwWKXjO-.js","_app/immutable/chunks/DZE5OIJc.js"];
export const stylesheets = [];
export const fonts = [];
