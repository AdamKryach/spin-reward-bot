# Discord Spin Rewards Bot

This project is a **Discord bot** that allows users to spin a rewards wheel based on their invite points. The bot tracks invites and manages a reward system where users earn points for inviting others to the server. These points can be used to spin normal or special wheels for exciting rewards.

---

## Features

1. **Invite Tracking System**
   - Automatically tracks server invites for each user.
   - Awards points to users when someone joins using their invite link.
   - Deducts points if invited users leave the server.

2. **Reward System**
   - Two types of spins:
     - **Normal Spin** (requires 1 invite point):
       - Rewards: 5,000 / 10,000 / 25,000 / 50,000 / 750,000 / 2,500,000 points.
     - **Special Spin** (requires 5 invite points):
       - Rewards: 5,000,000 / 10,000,000 / 25,000,000 / 50,000,000 points.

3. **Interactive Commands**
   - `!spin` command displays the user's points and buttons for spins.
   - Buttons for "Normal Spin" and "Special Spin" with emojis.

4. **Welcome and Goodbye Messages**
   - Sends a welcome message when a new member joins, indicating who invited them and their updated points.
   - Sends a goodbye message when a member leaves, updating the inviter's points.

5. **Data Persistence**
   - All invite rewards and tracked invites are saved to JSON files (`inviteRewards.json`, `trackedInvites.json`), ensuring data remains intact after bot restarts.

---

## Installation and Setup

### Prerequisites
1. [Node.js](https://nodejs.org/) installed.
2. [Discord.js](https://discord.js.org/) library.

### Steps
1. Clone this repository.
2. Install required dependencies:
   ```bash
   npm install discord.js
   ```
3. Ensure to change DISCORD_BOT_TOKEN with your bot token:
   ```env
   DISCORD_BOT_TOKEN=your-bot-token
   ```
4. Replace placeholders in the script:
   - `YOUR_WELCOME_CHANNEL_ID`
   - `YOUR_GOODBYE_CHANNEL_ID`
   - `YOUR_THUMBNAIL_URL`
5. Run the bot:
   ```bash
   node bot.js
   ```

---

## File Structure

- `index.js`: Main bot logic.
- `inviteRewards.json`: Stores users' invite points.
- `trackedInvites.json`: Tracks the invites per server.

---

## Developer

This project was created by [Mazen Bailo](https://bailo-portfolio.kesug.com). For any inquiries or support, please visit the [support server](https://discord.gg/SZsP3kgPxs).

---

## License
This project is licensed under the MIT License. Feel free to use and modify the code for your purposes.

