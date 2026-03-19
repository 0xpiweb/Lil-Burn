export function withMinDelay<T>(
  queryFn: () => Promise<T>,
  delay = 500,
): () => Promise<T> {
  return async () => {
    const [result] = await Promise.all([
      queryFn(),
      new Promise((resolve) => setTimeout(resolve, delay)),
    ]);

    return result;
  };
}
