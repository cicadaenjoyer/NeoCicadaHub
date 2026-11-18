// Build-time only: resolves the current GitHub avatar URL once per build.
// github.com/<user>.png redirects to avatars.githubusercontent.com/u/<id>?v=<version>;
// the version changes whenever the picture does. On any failure (offline build, GitHub
// outage) this returns null and callers fall back to the local pixel avatar.
let cached: Promise<string | null> | undefined;

export function resolveGithubAvatar(profileUrl: string): Promise<string | null> {
  cached ??= (async () => {
    try {
      const res = await fetch(`${profileUrl.replace(/\/$/, "")}.png`, { redirect: "follow", signal: AbortSignal.timeout(10_000) });
      if (!res.ok || !res.headers.get("content-type")?.startsWith("image/")) throw new Error(`HTTP ${res.status}`);
      await res.body?.cancel();
      return res.url;
    } catch (err) {
      console.warn(`[avatar] GitHub avatar unavailable, using the local pixel avatar (${String(err)})`);
      return null;
    }
  })();
  return cached;
}
