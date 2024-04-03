import type { MergeDeep } from "type-fest";
import type { Database as DatabaseGenerated } from "./database-generated.types";
export type {
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
} from "./database-generated.types";

// Override the type for a specific column in a view:
export type Database = MergeDeep<DatabaseGenerated, {}>;
