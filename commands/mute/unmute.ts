import { CacheType, Interaction, SlashCommandBuilder, SlashCommandUserOption, InteractionType, EmbedBuilder, Colors, GuildMember } from "npm:discord.js";
//@ts-types="npm:@types/ms"
import { dcBot } from "../../main.ts";
import { connection } from "../../main.ts";

export const unmuteCommand = () => {
  const cmd = new SlashCommandBuilder().setName("unmute").setDescription("Unmute The Selected User").addUserOption(new SlashCommandUserOption().setRequired(true).setName("user").setDescription("User To Unmute"));
  return cmd;
};

export const unmuteCommandHandler = async (interaction: Interaction<CacheType>) => {
  if (interaction.type != InteractionType.ApplicationCommand) return;
  if (interaction.commandName != "unmute") return;

  const member: GuildMember = await interaction.guild?.members.fetch(interaction.options.get("user", true)!.user?.id!)!;

  const muteRole = await interaction.guild?.roles.cache.find((role) => {
    return role.name.toLowerCase() === "muted";
  });

  if (!muteRole) {
    const noMuteRoleEmbed = new EmbedBuilder().setTitle("Error - No Mute Role").setColor("Red").setTimestamp();
    interaction.reply({ embeds: [noMuteRoleEmbed] });
    return;
  }

  const isMuted = member.roles.cache.has(muteRole.id);

  if (!isMuted) {
    const notMutedEmbed = new EmbedBuilder().setTitle("Error - User Not Muted").setColor("Red").setTimestamp();
    interaction.reply({ embeds: [notMutedEmbed] });
    return;
  }

  member.roles.remove(muteRole);

  const muteEmbed = new EmbedBuilder()
    .setTitle(`${member.user.username} Was Unmuted`)
    .setFooter({ text: `Unmuted User ID: ${member.id}`, iconURL: dcBot.user?.avatarURL() as string })
    .setTimestamp()
    .setColor(Colors.Red);

  interaction.reply({ embeds: [muteEmbed] });
  connection.query("DELETE FROM byte_bot.moderation WHERE (moderation_type = 'mute' AND user_id = '" + member.user.id + "');");
};
