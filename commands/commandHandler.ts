import { banCommandHandler } from "./ban/ban.ts";
import { Interaction } from "npm:discord.js";

export function commandHandler(interaction: Interaction) {
  banCommandHandler(interaction);
}
