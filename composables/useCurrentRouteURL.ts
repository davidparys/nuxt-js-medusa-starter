/**
 * Returns the current route URL for tracking purposes.
 *
 * @returns The current route URL.
 */
export function useCurrentRouteURL() {
  const route = useRoute()
  return route.path
}
