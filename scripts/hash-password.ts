import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";
async function main() {
  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log(
    "Create an admin password (input is visible; run in a private terminal).",
  );
  const password = await terminal.question(
    "Password (at least 12 characters): ",
  );
  terminal.close();
  if (password.length < 12) throw new Error("Use at least 12 characters.");
  console.log(await bcrypt.hash(password, 12));
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
