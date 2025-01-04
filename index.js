const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
] });

// Prefix and placeholders for the bot
const prefix = '!';
const inviteRewards = {};
const trackedInvites = {};

// Replace with your welcome and goodbye channel IDs
const WELCOME_CHANNEL_ID = 'YOUR_WELCOME_CHANNEL_ID';
const GOODBYE_CHANNEL_ID = 'YOUR_GOODBYE_CHANNEL_ID';

client.once('ready', async () => {
  console.log(`${client.user.tag} is online!`);

  // Fetch all guild invites to track
  for (const [guildId, guild] of client.guilds.cache) {
    const invites = await guild.invites.fetch();
    trackedInvites[guildId] = new Map(invites.map(invite => [invite.code, invite.uses || 0]));
  }
});

// Helper function to add points
function addPoints(userId, points) {
  if (!inviteRewards[userId]) inviteRewards[userId] = 0;
  inviteRewards[userId] += points;
}

// Command handler
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  if (command === 'spin') {
    const userPoints = inviteRewards[message.author.id] || 0;

    const embed = new EmbedBuilder()
      .setTitle('Spin Rewards')
      .setDescription(`\uD83C\uDF96\uFE0F انفايت ل عجلة مميزة5\n\uD83C\uDF96\uFE0F 5 invites for special spin\n\n🥈 انفايت واحد ل عجلة عادية\n🥈 1 invite for normal spin\n\nYour Points 🎪 **${userPoints} points**\nانت لديك 🎪 **${userPoints} نقطة**`)
      .setThumbnail('YOUR_THUMBNAIL_URL') // Replace with your thumbnail URL
      .setColor(0x0099ff);

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('normal_spin')
        .setLabel('Normal Spin 🎡')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('special_spin')
        .setLabel('Special Spin 🌟')
        .setStyle(ButtonStyle.Secondary)
    );

    await message.channel.send({ embeds: [embed], components: [buttons] });
  }
});

// Button interaction handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const userId = interaction.user.id;
  const userPoints = inviteRewards[userId] || 0;
  const normalRewards = [5000, 10000, 25000, 50000, 750000, 2500000];
  const specialRewards = [5000000, 10000000, 25000000, 50000000];

  if (interaction.customId === 'normal_spin') {
    if (userPoints < 1) {
      return interaction.reply({ content: 'You need at least 1 invite to spin the normal wheel!', ephemeral: true });
    }
    const reward = normalRewards[Math.floor(Math.random() * normalRewards.length)];
    addPoints(userId, -1);
    return interaction.reply({ content: `You spun the normal wheel and won **${reward} points**!` });
  } else if (interaction.customId === 'special_spin') {
    if (userPoints < 5) {
      return interaction.reply({ content: 'You need at least 5 invites to spin the special wheel!', ephemeral: true });
    }
    const reward = specialRewards[Math.floor(Math.random() * specialRewards.length)];
    addPoints(userId, -5);
    return interaction.reply({ content: `You spun the special wheel and won **${reward} points**!` });
  }
});

// Invite tracking
client.on('guildMemberAdd', async (member) => {
  const guildInvites = await member.guild.invites.fetch();
  const previousInvites = trackedInvites[member.guild.id] || new Map();
  const usedInvite = guildInvites.find(invite => invite.uses > (previousInvites.get(invite.code) || 0));

  if (usedInvite) {
    const inviter = usedInvite.inviter;
    addPoints(inviter.id, 1);

    const inviterPoints = inviteRewards[inviter.id];
    const welcomeChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);

    if (welcomeChannel) {
      welcomeChannel.send(`**${member.user.tag}** just joined. They were invited by **${inviter.tag}** who now has **${inviterPoints} points**!`);
    }

    // Update the tracked invites
    trackedInvites[member.guild.id].set(usedInvite.code, usedInvite.uses);
  }
});

// Handle member leaves
client.on('guildMemberRemove', async (member) => {
  const guildInvites = await member.guild.invites.fetch();
  const previousInvites = trackedInvites[member.guild.id] || new Map();
  const usedInvite = guildInvites.find(invite => invite.uses < (previousInvites.get(invite.code) || 0));

  if (usedInvite) {
    const inviter = usedInvite.inviter;
    addPoints(inviter.id, -1);

    const inviterPoints = inviteRewards[inviter.id];
    const goodbyeChannel = member.guild.channels.cache.get(GOODBYE_CHANNEL_ID);

    if (goodbyeChannel) {
      goodbyeChannel.send(`**${member.user.tag}** has left the server. They were invited by **${inviter.tag}**, who now has **${inviterPoints} points**.`);
    }

    // Update the tracked invites
    trackedInvites[member.guild.id].set(usedInvite.code, usedInvite.uses);
  }
});

client.login('YOUR_BOT_TOKEN');
