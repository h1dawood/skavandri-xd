# Multi-Purpose Discord Bot

A versatile Discord bot built with Node.js and Discord.js, packed with a wide range of features including administration, moderation, fun commands, an economy system, and automated role management.

## Features

This bot includes a variety of commands and automated features, categorized for ease of use.

### 👑 Administration & Moderation
-   `%kick <@user>`: Kicks a member from the server.
-   `%ban <@user>`: Bans a member from the server.
-   `%mute <@user>`: Mutes a user by assigning a "Muted" role.
-   `%unmute <@user>`: Unmutes a user by removing the "Muted" role.
-   `%clear <number>`: Bulk deletes messages in a channel (from 2 to 100).
-   `%addrole <@user> <role>`: Adds a specified role to a user.
-   `%removerole <@user> <role>`: Removes a specified role from a user.
-   `%say <message>`: Makes the bot say a message and deletes the command.
-   **Anti-Swear Filter**: Automatically deletes messages containing blacklisted words.

### ⚙️ Automation & Utility
-   **Welcome/Leave Messages**: Automatically sends welcome and goodbye messages in channels named `#welcome` and `#leave`.
-   **Auto-Role on Join**: Automatically assigns a default role to new members.
    -   `%autorole toggle`: Turns the auto-role feature on or off.
    -   `%autorole set <role name>`: Sets the role to be assigned to new members.
-   **Reaction Roles**:
    -   `%autoc <role name>`: Starts the setup to assign a role via message reaction.
    -   `%make`: (Owner-only) A pre-configured command to set up multiple reaction roles at once.

###  zabawne & Social
-   `%avatar [@user]`: Displays the avatar of a user.
-   `%punch <@user>`: Sends a GIF of a punch aimed at the mentioned user.
-   `%gif <query>`: Searches for a custom GIF.
-   `%coin`: Flips a coin (heads or tails).
-   `%solt`: A simple slot machine game.
-   `%meme`: Displays a meme.
-   `%garo`: Shows a fun smoking animation.

### 📈 Economy
-   `%balance`: Check your account balance.
-   `%store`: View all available items in the store.
-   `%store <item name>`: Buy an item from the store.
-   `%transfer <amount> <@user>`: (Admin-only) Transfers money to a user.

### ℹ️ Information
-   `%help`: Sends a detailed list of commands to your DMs.
-   `%serverinfo`: Displays detailed information about the server.
-   `%userinfo [@user]`: Shows information about a specific user.
-   `%id`: Get your Discord user ID.
-   `%ping`: Checks the bot's latency.
-   `%weather <city>`: Shows the weather for a specified location.
-   `%steam <game>`: Searches for a game on Steam.

## Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v12 or higher recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation & Setup

Follow these steps to get your bot up and running.

**1. Clone the Repository**
```sh
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

**2. Install Dependencies**
```sh
npm install discord.js ms moment discord-eco fs
```

**3. Configure the Bot**
Create a file named `config.json` in the root directory and add your bot's token and prefix.

**`config.json`**
```json
{
  "token": "YOUR_DISCORD_BOT_TOKEN_HERE",
  "prefix": "%"
}
```
*Replace `YOUR_DISCORD_BOT_TOKEN_HERE` with the token you get from the [Discord Developer Portal](https://discord.com/developers/applications).*

**4. Create Required JSON Files**
The bot uses several `.json` files to store data. Create the following empty files in the root directory:
-   `AutoRole.json`: For the auto-role settings.
    ```json
    {}
    ```
-   `account.json`: For the user registration system.
    ```json
    {}
    ```
-   `items.json`: For the economy store items.
    ```json
    [
      {
        "name": "Helper Role",
        "price": 5000,
        "desc": "Get a special 'Helper' role in the server!",
        "type": "Roles"
      },
      {
        "name": "Cool Item",
        "price": 100,
        "desc": "A very cool item to show off.",
        "type": "Inventory"
      }
    ]
    ```

**5. Discord Server Setup**
-   **Mute Command**: Create a role named exactly `Muted` and configure its permissions in every channel to deny "Send Messages".
-   **Welcome/Leave**: Create text channels named exactly `welcome` and `leave` for the automated messages.
-   **Admin Role**: For the economy `transfer` command, ensure you have a role named `owner`.

**6. Start the Bot**
```sh
node your_main_bot_file.js
```
*Replace `your_main_bot_file.js` with the name of the main JavaScript file (e.g., `index.js`).*

## Usage

Once the bot is online, you can interact with it using the prefix specified in `config.json` (default is `%`).

-   To see all commands, type `%help`.
-   To check your balance, type `%balance`.
-   To clear 10 messages, type `%clear 10`.
