import { Client, GatewayIntentBits } from "npm:discord.js";
import { botStatus } from "./status.ts";
import "./commands/ban/ban.ts";
import "./commands/ban/autoUnban.ts";
import { banCommand } from "./commands/ban/ban.ts";
import { commandHandler } from "./commands/commandHandler.ts";
//@ts-types="npm:@types/mysql"
import mysql from "npm:mysql";

export const connection = mysql.createPool({
  host: Deno.env.get("DB_HOST"),
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  database: "byte_bot",
});

const dcBot = new Client({ intents: [GatewayIntentBits.Guilds] });

dcBot.on("ready", async () => {
  console.log("Bot Logged In");
  // botStatus(dcBot);

  dcBot.application?.commands
    .create(banCommand(), "1296015106773221417")
    .then(() => {
      console.log("Ban Registered");
    })
    .catch((err) => {
      console.error(err);
    });
  // dcBot.application?.commands.set([]);

  // dcBot.application?.commands.delete("1296531015648677961");
});

dcBot.on("interactionCreate", (interaction) => {
  commandHandler(interaction);
});

dcBot.login(Deno.env.get("TOKEN"));
export { dcBot };
