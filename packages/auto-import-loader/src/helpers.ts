export function detectIsJsxResource(resource: string): boolean {
  return resource.endsWith('.tsx') || resource.endsWith('.jsx')
}
