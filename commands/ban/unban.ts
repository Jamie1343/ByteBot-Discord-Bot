import { CacheType, Interaction, SlashCommandBuilder, SlashCommandUserOption, InteractionType, User, EmbedBuilder, Colors } from "npm:discord.js";
import { dcBot } from "../../main.ts";
import { connection } from "../../main.ts";

export const unbanCommand = () => {
  const cmd = new SlashCommandBuilder().setName("unban").setDescription("Ban The Selected User").addUserOption(new SlashCommandUserOption().setRequired(true).setName("id").setDescription("User ID To Unban"));

  return cmd;
};

export const unbanCommandHandler = async (interaction: Interaction<CacheType>) => {
  if (interaction.type != InteractionType.ApplicationCommand) return;
  if (interaction.commandName != "unban") return;

  interaction.deferReply();

  const user: User = interaction.options.get("id", true)!.user!;

  const bans = await interaction.guild?.bans.fetch()!;

  const bannedUser = bans.find((ban) => {
    console.log(ban.user.id, user.id, ban.user.id === user.id);
    return ban.user.id === user.id;
  });

  if (bannedUser === undefined) {
    const noBanEmbed = new EmbedBuilder()
      .setTitle(`${user.username} Is Not Banned`)
      .setFooter({ text: `Unbanned User ID: ${user.id}`, iconURL: dcBot.user?.avatarURL() as string })
      .setTimestamp()
      .setColor(Colors.Red);

    interaction.reply({ embeds: [noBanEmbed] });
    return;
  }

  const banEmbed = new EmbedBuilder()
    .setTitle(`${user.username} Was Unbanned`)
    .setFooter({ text: `Unbanned User ID: ${user.id}`, iconURL: dcBot.user?.avatarURL() as string })
    .setTimestamp()
    .setColor(Colors.Red);

  interaction.editReply({ embeds: [banEmbed] });
  interaction.guild?.bans.remove(user.id);
  connection.query("DELETE FROM byte_bot.moderation WHERE (moderation_type = 'ban' AND user_id = '" + user.id + "');");
};
