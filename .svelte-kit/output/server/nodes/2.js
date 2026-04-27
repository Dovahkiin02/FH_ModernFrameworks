import * as server from '../entries/pages/(app)/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.BXr7sTuf.js","_app/immutable/chunks/O_MAeoO4.js","_app/immutable/chunks/DLRrmHlY.js","_app/immutable/chunks/C8uwIP-y.js","_app/immutable/chunks/Jl_weQEk.js","_app/immutable/chunks/CwWKXjO-.js","_app/immutable/chunks/CnKYNCKA.js","_app/immutable/chunks/kc7dcQGq.js"];
export const stylesheets = [];
export const fonts = [];
