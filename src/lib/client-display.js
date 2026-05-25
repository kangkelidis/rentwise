export function getClientDisplayName(client, fallback = 'Missing client') {
	if (!client) return fallback

	const candidates = [
		client.full_name,
		client.email,
		client.tel,
		client.license,
		client.passport,
	]

	const value = candidates.find(
		(candidate) => typeof candidate === 'string' && candidate.trim()
	)

	return value?.trim() || fallback
}

export function getRecordId(record) {
	return record?._id?.toString?.() || record?.id?.toString?.() || ''
}
