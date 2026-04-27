function getErrorCauseMessage(error: unknown): string | null {
	if (
		error &&
		typeof error === 'object' &&
		'cause' in error &&
		error.cause &&
		typeof error.cause === 'object' &&
		'message' in error.cause &&
		typeof error.cause.message === 'string'
	) {
		return error.cause.message;
	}

	return null;
}

function getErrorCauseCode(error: unknown): string | null {
	if (
		error &&
		typeof error === 'object' &&
		'cause' in error &&
		error.cause &&
		typeof error.cause === 'object' &&
		'code' in error.cause &&
		typeof error.cause.code === 'string'
	) {
		return error.cause.code;
	}

	return null;
}

export function formatSupabaseRequestError(error: unknown, mode: 'signup' | 'login'): string {
	const baseAction = mode === 'signup' ? 'Sign-up' : 'Login';
	const causeMessage = getErrorCauseMessage(error);
	const causeCode = getErrorCauseCode(error);

	if (causeCode === 'SELF_SIGNED_CERT_IN_CHAIN') {
		return `${baseAction} could not reach Supabase because your local Node runtime does not trust the HTTPS certificate chain on this network. Try another network or trust the proxy/root certificate locally.`;
	}

	if (causeMessage) {
		return `${baseAction} failed: ${causeMessage}`;
	}

	if (error instanceof Error) {
		return `${baseAction} failed: ${error.message}`;
	}

	return `${baseAction} failed unexpectedly.`;
}
