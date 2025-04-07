import { Client, Collection, GatewayIntentBits } from "npm:discord.js";
import { botStatus } from "./status.ts";
import "./commands/ban/ban.ts";
import "./commands/ban/unban.ts";
import "./commands/ban/autoUnban.ts";
import { banCommand } from "./commands/ban/ban.ts";
import { commandHandler } from "./commands/commandHandler.ts";
//@ts-types="npm:@types/mysql"
import mysql from "npm:mysql";
import { unbanCommand } from "./commands/ban/unban.ts";
import { muteCommand } from "./commands/mute/mute.ts";
import { unmuteCommand } from "./commands/mute/unmute.ts";

export const connection = mysql.createPool({
  host: Deno.env.get("DB_HOST"),
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  database: "byte_bot",
});

const dcBot = new Client({ intents: [GatewayIntentBits.Guilds] });

dcBot.on("ready", () => {
  console.log("Bot Logged In");
  dcBot.application?.commands.set([]);
  dcBot.application?.commands.set([banCommand(), unbanCommand(), muteCommand(), unmuteCommand()], Deno.env.get("TESTSERVER_ID") as string).then(() => {
    console.log("Commands Registered");
  });
  // botStatus(dcBot);
});

dcBot.on("interactionCreate", (interaction) => {
  commandHandler(interaction);
});

dcBot.login(Deno.env.get("TOKEN"));
export { dcBot };
