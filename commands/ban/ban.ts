import { CacheType, Interaction, SlashCommandBuilder, SlashCommandUserOption, InteractionType, User, SlashCommandStringOption, SlashCommandBooleanOption, EmbedBuilder, Colors } from "npm:discord.js";
//@ts-types="npm:@types/ms"
import ms from "npm:ms";
import { dcBot } from "../../main.ts";
import { connection } from "../../main.ts";
import { randomUUID } from "node:crypto";

export const banCommand = () => {
  const cmd = new SlashCommandBuilder().setName("ban").setDescription("Ban The Selected User").addUserOption(new SlashCommandUserOption().setRequired(true).setName("user").setDescription("User To Ban"));
  cmd.addStringOption(new SlashCommandStringOption().setRequired(false).setMaxLength(100).setName("reason").setDescription("Reason Of Ban"));
  cmd.addStringOption(new SlashCommandStringOption().setRequired(false).setMaxLength(100).setName("length").setDescription("Length Of Ban eg. 5d"));
  cmd.addBooleanOption(new SlashCommandBooleanOption().setRequired(false).setName("delete_messages").setDescription("Delete The Users Messages?"));
  return cmd;
};

export const banCommandHandler = (interaction: Interaction<CacheType>) => {
  if (interaction.type != InteractionType.ApplicationCommand) return;
  if (interaction.commandName != "ban") return;

  const user: User = interaction.options.get("user", true)!.user!;
  const reason: string = interaction.options.get("reason", false)?.value?.toString() ?? "No Reason Provided";
  const length: string | undefined = interaction.options.get("length", false)?.value?.toString();
  const lengthParsed = length === undefined ? "Forever" : ms(length);
  const deleteMessages: boolean | undefined = (interaction.options.get("delete_messages", false)?.value as boolean) ?? false;

  console.dir(user);

  const banEmbed = new EmbedBuilder()
    .setTitle(`${user.username} Was Banned`)
    .addFields([
      { name: "Reason", value: reason },
      { name: "Length", value: typeof lengthParsed == "string" ? lengthParsed : ms(lengthParsed, { long: true }) },
    ])
    .setFooter({ text: `Banned User ID: ${user.id}`, iconURL: dcBot.user?.avatarURL() as string })
    .setTimestamp()
    .setColor(Colors.Red);

  interaction.reply({ embeds: [banEmbed] });

  let deleteSeconds = 0;

  if (deleteMessages === true) deleteSeconds = 604800;

  if (typeof lengthParsed != "string") {
    connection.query("INSERT INTO `byte_bot`.`moderation` (`id`, `guild_id`, `user_id`, `moderation_type`, `length`) VALUES ('" + randomUUID() + "', '" + interaction.guildId + "', '" + user.id + "', 'ban', '" + (Date.now() + lengthParsed) + "');");
  }

  interaction.guild?.bans.create(user, { reason: reason, deleteMessageSeconds: deleteSeconds });
};
