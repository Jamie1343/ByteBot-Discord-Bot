import { CacheType, Interaction, SlashCommandBuilder, SlashCommandUserOption, InteractionType, SlashCommandStringOption, EmbedBuilder, Colors, GuildMember } from "npm:discord.js";
//@ts-types="npm:@types/ms"
import ms from "npm:ms";
import { dcBot } from "../../main.ts";
import { connection } from "../../main.ts";
import { randomUUID } from "node:crypto";

export const muteCommand = () => {
  const cmd = new SlashCommandBuilder().setName("mute").setDescription("Mute The Selected User").addUserOption(new SlashCommandUserOption().setRequired(true).setName("user").setDescription("User To Mute"));
  cmd.addStringOption(new SlashCommandStringOption().setRequired(false).setMaxLength(100).setName("reason").setDescription("Reason Of Mute"));
  cmd.addStringOption(new SlashCommandStringOption().setRequired(false).setMaxLength(100).setName("length").setDescription("Length Of Mute eg. 5d"));
  return cmd;
};

export const muteCommandHandler = async (interaction: Interaction<CacheType>) => {
  if (interaction.type != InteractionType.ApplicationCommand) return;
  if (interaction.commandName != "mute") return;

  const muteRole = await interaction.guild?.roles.cache.find((role) => {
    return role.name.toLowerCase() === "muted";
  });

  const memberRole = await interaction.guild?.roles.cache.find((role) => {
    return role.name.toLowerCase() === "member";
  });

  //add mute role if it doesnt exist
  if (!muteRole) {
    interaction.guild?.roles.create({
      name: "muted",
      color: "Grey",
      permissions: ["ViewChannel"],
      mentionable: false,
      position: memberRole?.position ?? 0 + 1,
    });
    return;
  }

  const member: GuildMember = await interaction.guild?.members.fetch(interaction.options.get("user", true)!.user?.id!)!;
  const reason: string = interaction.options.get("reason", false)?.value?.toString() ?? "No Reason Provided";
  const length: string | undefined = interaction.options.get("length", false)?.value?.toString();
  const lengthParsed = length === undefined ? "Forever" : ms(length);

  member.roles.add(
    interaction.guild?.roles.cache.find((role) => {
      return role.name === "muted";
    })!
  );

  const muteEmbed = new EmbedBuilder()
    .setTitle(`${member.user.username} Was Muted`)
    .addFields([
      { name: "Reason", value: reason },
      { name: "Length", value: typeof lengthParsed == "string" ? lengthParsed : ms(lengthParsed, { long: true }) },
    ])
    .setFooter({ text: `Muted User ID: ${member.id}`, iconURL: dcBot.user?.avatarURL() as string })
    .setTimestamp()
    .setColor(Colors.Red);

  interaction.reply({ embeds: [muteEmbed] });

  if (typeof lengthParsed != "string") {
    connection.query("INSERT INTO `byte_bot`.`moderation` (`id`, `guild_id`, `user_id`, `moderation_type`, `length`) VALUES ('" + randomUUID() + "', '" + interaction.guildId + "', '" + member.user.id + "', 'mute', '" + (Date.now() + lengthParsed) + "');");
  }
};
