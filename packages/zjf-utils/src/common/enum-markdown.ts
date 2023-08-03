export function enumMarkdown(obj: Record<string, string>) {
  return Object.entries(obj).map(([key, value]) => {
    return `- \`${key}\`: ${value}`
  }).join("\n")
}