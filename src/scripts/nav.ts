/** Whether a dock link is the current screen. Every /projects/... route belongs to Projects. */
export function isCurrent(href: string, pathname: string): boolean {
  if (href === "/projects/") return pathname.startsWith("/projects/");
  return href === pathname;
}
