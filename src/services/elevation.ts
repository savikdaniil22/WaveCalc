export const fetchElevation = async (lat: number, lon: number): Promise<number | null> => {
  try {
    const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`)
    if (!response.ok) return null
    const json = (await response.json()) as { results?: Array<{ elevation: number }> }
    return json.results?.[0]?.elevation ?? null
  } catch {
    return null
  }
}
