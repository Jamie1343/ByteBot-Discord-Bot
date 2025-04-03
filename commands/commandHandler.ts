import { banCommandHandler } from "./ban/ban.ts";
import { Interaction } from "npm:discord.js";
import { unbanCommandHandler } from "./ban/unban.ts";

export function commandHandler(interaction: Interaction) {
  banCommandHandler(interaction);
  unbanCommandHandler(interaction);
}
