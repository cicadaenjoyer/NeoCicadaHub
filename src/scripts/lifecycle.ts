// Under <ClientRouter />, module scripts run once per full page load, not per navigation.
// onPage() re-runs `init` for every matching element after each navigation and runs the
// returned cleanups before the next swap, so timers and listeners never pile up.
type Cleanup = () => void;

const registrations: { selector: string; init: (root: HTMLElement) => void | Cleanup }[] = [];
let cleanups: Cleanup[] = [];
let wired = false;

function runInits(): void {
  for (const { selector, init } of registrations) {
    document.querySelectorAll<HTMLElement>(selector).forEach((root) => {
      const cleanup = init(root);
      if (cleanup) cleanups.push(cleanup);
    });
  }
}

function runCleanups(): void {
  const pending = cleanups;
  cleanups = [];
  for (const cleanup of pending) cleanup();
}

export function onPage(selector: string, init: (root: HTMLElement) => void | Cleanup): void {
  registrations.push({ selector, init });
  if (!wired) {
    wired = true;
    document.addEventListener("astro:page-load", runInits);
    document.addEventListener("astro:before-swap", runCleanups);
  }
}
