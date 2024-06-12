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
    { name: "Mediterranean" },
    { name: "African" },
  ]);
  await seed.diets([
    { name: "Vegan" },
    { name: "Vegetarian" },
    { name: "Ketogenic" },
    { name: "Atkins" },
    { name: "Carnivore" },
    { name: "Low-carb" },
    { name: "Low-fat" },
    { name: "Mayo Clinic" },
    { name: "Mediterranean" },
    { name: "Nordic" },
    { name: "Paleo" },
    { name: "Pescetarian" },
    { name: "Whole 30" },
  ]);
  await seed.recreations([
    { name: "Parks" },
    { name: "Museums" },
    { name: "Beach" },
    { name: "Nightlife" },
    { name: "Adventures" },
    { name: "Outdoors" },
    { name: "Food Tours" },
    { name: "Guided Tours" },
    { name: "History" },
    { name: "Architecture" },
    { name: "Religion" },
    { name: "Shopping" },
    { name: "Market Places" },
    { name: "Bike Tours" },
    { name: "Amusement Parks" },
    { name: "Local Favorites" },
  ]);
  await seed.foodAllergies([
    { name: "Milk" },
    { name: "Peanut" },
    { name: "Fish" },
    { name: "Seafood" },
    { name: "Shellfish" },
    { name: "Eggs" },
    { name: "Tree nuts" },
    { name: "Wheat" },
    { name: "Soybean" },
    { name: "Sesame" },
  ]);

  // TODO - find a way to seed oauth users since we don't use email/passwords

  process.exit();
};

main();
