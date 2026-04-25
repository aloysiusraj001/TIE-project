export const DEMO_PASSWORD = "demo";

export function isValidDemoPassword(pw: string) {
  return pw.trim() === DEMO_PASSWORD;
}

