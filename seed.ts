/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";

const main = async () => {
  const seed = await createSeedClient({ dryRun: true });

  // Truncate all tables in the database
  await seed.$resetDatabase();

  await seed.cuisines([
    { name: "Local" },
    { name: "Asian" },
    { name: "European" },
    { name: "American" },
    { name: "Middle Eastern" },
    { name: "Indian" },
  ]);
  await seed.diets([
    { name: "Vegan" },
    { name: "Vegetarian" },
    { name: "Keto" },
  ]);
  await seed.recreations([
    { name: "Parks" },
    { name: "Museums" },
    { name: "Beach" },
  ]);
  await seed.foodAllergies([{ name: "Milk" }, { name: "Peanut" }]);

  // TODO - find a way to seed oauth users since we don't use email/passwords

  process.exit();
};

main();
