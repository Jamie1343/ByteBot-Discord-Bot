import { setInterval } from "node:timers";
import { connection, dcBot } from "../../main.ts";

setInterval(() => {
  console.log("Auto Unban Scan");
  connection.query("SELECT * FROM byte_bot.moderation WHERE (moderation_type = 'ban');", (_e, r) => {
    // deno-lint-ignore no-explicit-any
    r.forEach((res: any) => {
      console.log(res.moderation_type == "ban", res.length < Date.now(), res.moderation_type);
      if (res.moderation_type == "ban" && res.length < Date.now()) {
        console.log("DELETE FROM byte_bot.moderation WHERE (moderation_type = 'ban' AND user_id = '" + res.user_id + "');");
        connection.query("DELETE FROM byte_bot.moderation WHERE (moderation_type = 'ban' AND user_id = '" + res.user_id + "');");
        dcBot.guilds.cache
          .find((g) => {
            return g.id === res.guild_id;
          })
          ?.bans.remove(res.user_id);
      }
    });
  });
}, 30000);
