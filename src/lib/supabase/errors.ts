type ErrorWithCause = Error & {
	cause?: {
		code?: string;
		message?: string;
	};
};

export function formatSupabaseRequestError(error: unknown, mode: 'signup' | 'login'): string {
	const action = mode === 'signup' ? 'Sign-up' : 'Login';
	const cause = error instanceof Error ? (error as ErrorWithCause).cause : undefined;
	const causeCode = typeof cause?.code === 'string' ? cause.code : null;
	const causeMessage = typeof cause?.message === 'string' ? cause.message : null;

	if (causeCode === 'SELF_SIGNED_CERT_IN_CHAIN') {
		return `${action} could not reach Supabase because this network is rewriting HTTPS certificates. Try another network or trust the local root certificate first.`;
	}

	if (causeMessage) {
		return `${action} failed: ${causeMessage}`;
	}

	if (error instanceof Error) {
		return `${action} failed: ${error.message}`;
	}

	return `${action} failed.`;
}
