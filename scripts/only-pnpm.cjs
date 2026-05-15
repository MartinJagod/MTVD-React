const userAgent = process.env.npm_config_user_agent || "";

if (!userAgent.startsWith("pnpm/")) {
  console.error("\nEste proyecto usa pnpm como package manager. Ejecutá: corepack enable && pnpm install\n");
  process.exit(1);
}
