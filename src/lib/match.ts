type Params = Record<string, string>;

export function match(pattern: string, pathname: string): Params | null {
  const keys: string[] = [];

  const regex = new RegExp(
    '^' +
      pattern
        // escape all regex metacharacters
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        // replace each :name with a capture-group
        .replace(/:(\w+)/g, (_m, k) => {
          keys.push(k);
          return '([^/]+)';
        }) +
      '/?$',
  );

  const m = pathname.match(regex);
  if (!m) return null;

  return keys.reduce<Params>((acc, k, i) => {
    acc[k] = decodeURIComponent(m[i + 1]);
    return acc;
  }, {});
}
