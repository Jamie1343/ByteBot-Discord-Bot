import { banCommandHandler } from "./ban/ban.ts";
import { Interaction } from "npm:discord.js";
import { unbanCommandHandler } from "./ban/unban.ts";
import { muteCommandHandler } from "./mute/mute.ts";
import { unmuteCommandHandler } from "./mute/unmute.ts";

export function commandHandler(interaction: Interaction) {
  banCommandHandler(interaction);
  unbanCommandHandler(interaction);
  muteCommandHandler(interaction);
  unmuteCommandHandler(interaction);
}
