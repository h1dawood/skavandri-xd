const Discord = require('discord.js');
const client = new Discord.Client();
const { Client, RichEmbed } = require('discord.js');
const config = require("./config.json");
const ms = require("ms");
const fs = require('fs'); // package npm i fs
const moment = require("moment");
client.on('ready', () => {
  client.user.setActivity(`%help | ${client.guilds.size} server  `)
  client.user.setStatus('dnd')
  console.log(`Logged in as ${client.user.tag}!`);
});

//handler

//var prefix = '%'
//client.on("message", message => {
  //if (message.author.bot) return;
  //if(message.content.indexOf(prefix) !== 0) return;

  //const args = message.content.slice(prefix.length).trim().split(/ +/g);
  //const command = args.shift().toLowerCase();

  //try {
  //  let commandFile = require(`./${command}.js`);
   // commandFile.run(client, message, args);
 // } catch (err) {
 //   console.error(err);
  //}
//});
//anita commands



//handler command use file name to use 

///ddeawd

let prefix = "%"

client.on("message", message => {
if (message.author.bot) return;
if(message.content.indexOf(prefix) !== 0) return;

const args = message.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();

try {
  let commandFile = require(`./${command}.js`);
  commandFile.run(client, message, args);
} catch (err) {
  console.error(err);
}
});






//new coommand by abdo

const ar = JSON.parse(fs.readFileSync('./AutoRole.json' , 'utf8'));

client.on('guildMemberAdd', member => {
    if(!ar[member.guild.id]) ar[member.guild.id] = {
    onoff: 'Off',
    role: 'Member'
    }
    if(ar[member.guild.id].onoff === 'Off') return;
  member.addRole(member.guild.roles.find(`name`, ar[member.guild.id].role)).catch(console.error)
  })
  
  client.on('message', message => { 
    var sender = message.author
  
  if(!message.guild) return
    if(!ar[message.guild.id]) ar[message.guild.id] = {
    onoff: 'Off',
    role: 'Member'
    }
  
  if(message.content.startsWith(prefix+`autorole`)) {
           
    let perms = message.member.hasPermission(`MANAGE_ROLES`)
  
    if(!perms) return message.reply(`You don't have permissions, required permission : Manage Roles.`)
    let args = message.content.split(" ").slice(1)
    if(!args.join(" ")) return message.reply(`${prefix}autorole toggle / set [ROLE NAME]`)
    let state = args[0]
    if(!state.trim().toLowerCase() == 'toggle' || !state.trim().toLowerCase() == 'setrole') return message.reply(`Please type a right state, ${prefix}modlogs toggle/setrole [ROLE NAME]`) 
      if(state.trim().toLowerCase() == 'toggle') { 
       if(ar[message.guild.id].onoff === 'Off') return [message.channel.send(`**The Autorole Is __𝐎𝐍__ !**`), ar[message.guild.id].onoff = 'On']
       if(ar[message.guild.id].onoff === 'On') return [message.channel.send(`**The Autorole Is __𝐎𝐅𝐅__ !**`), ar[message.guild.id].onoff = 'Off']
      }
     if(state.trim().toLowerCase() == 'set') {
     let newRole = message.content.split(" ").slice(2).join(" ")
     if(!newRole) return message.reply(`${prefix}autorole set [ROLE NAME]`)
       if(!message.guild.roles.find(`name`,newRole)) return message.reply(`I Cant Find This Role.`)
      ar[message.guild.id].role = newRole
       message.channel.send(`**The AutoRole Has Been Changed to ${newRole}.**`)
     } 
           }
  if(message.content === prefix+'info') {
      let perms = message.member.hasPermission(`MANAGE_GUILD`) 
      if(!perms) return message.reply(`You don't have permissions.`)
      var embed = new Discord.RichEmbed()
  
  .addField(`Autorole : :sparkles:  `, `
  State : __${ar[message.guild.id].onoff}__
  Role : __${ar[message.guild.id].role}__`)
  
  
      .setColor(`BLUE`)
      message.channel.send({embed})
    }
  
  
      fs.writeFile("./AutoRole.json", JSON.stringify(ar), (err) => {
      if (err) console.error(err)
    });
  
  
  });



//new command

  var stopReacord = true;
  var reactionRoles = [];
  var definedReactionRole = null;
  
  client.on("message", async message => {
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      if(message.author.bot) return;
      if(message.content.indexOf(prefix) !== 0) return;
      if (command == "autoc") {
        if(!message.channel.guild) return message.reply(`**this ~~command~~ __for servers only__**`);
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("sorry you can't do this");
        if(!args[0] || args[1]) return message.channel.send(`\`\`\`${prefix}autoC <role-name>\`\`\``);
        var role = message.guild.roles.find( role => { return role.name == args[0] });
        if(!role) return message.channel.send(`no role with name found, make sure you entered correct name`);
        if(definedReactionRole != null  || !stopReacord) return message.channel.send("another reaction role request is running");
        message.channel.send(`now go and add reaction in the message you want for role ${role.name}`)
        definedReactionRole = role;
        stopReacord = false;
      }     
  })
  client.on('raw', raw => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(raw.t)) return;
    var channel = client.channels.get(raw.d.channel_id);
    if (channel.messages.has(raw.d.message_id)) return;
    channel.fetchMessage(raw.d.message_id).then(message => {
      var reaction = message.reactions.get( (raw.d.emoji.id ? `${raw.d.emoji.name}:${raw.d.emoji.id}` : raw.d.emoji.name) );
      if (raw.t === 'MESSAGE_REACTION_ADD') return client.emit('messageReactionAdd', reaction, client.users.get(raw.d.user_id));
      if (raw.t === 'MESSAGE_REACTION_REMOVE') return client.emit('messageReactionRemove', reaction, client.users.get(raw.d.user_id));
    });
  });
  client.on('messageReactionAdd', (reaction, user) => {
      if(user.id == client.user.id) return;
      if(!stopReacord) {
        var done = false;
        reactionRoles[reaction.message.id] = { role: definedReactionRole, message_id: reaction.message.id, emoji: reaction.emoji};
        stopReacord =  true;
        definedReactionRole = null;
        reaction.message.react(reaction.emoji.name)
        .catch(err => {done = true; reaction.message.channel.send(`sorry i can't use this emoji but the reaction role done! anyone react will get the role!`)})
        if(done) reaction.remove(user); 
      } else {
        var request = reactionRoles[reaction.message.id];
        if(!request) return;
        if(request.emoji.name != reaction.emoji.name) return reaction.remove(user);
        reaction.message.guild.members.get(user.id).addRole(request.role);
      }
  }) 
  client.on('messageReactionRemove', (reaction, user) => {
    if(user.id == client.user.id) return;
    if(!stopReacord) return;
    let request = reactionRoles[reaction.message.id];
    if(!request) return;
    reaction.message.guild.members.get(user.id).removeRole(request.role);
  });


//new command

//updated by abdo


client.on('message', message => {
  // If the message is "how to embed"
  if(message.content.startsWith(prefix+'help')) {
    const embed = new RichEmbed()
    .setDescription(`
All commands **${client.user.tag}** Update ervytime

**Admin commands**
\`${prefix}kick\` **For kick a users**under fix
\`${prefix}ban\`  **To ban a users**under fix
\`${prefix}mute\`  **to mute user**
\`${prefix}unmute\` **to unmute user**
\`${prefix}clear\`  **clear chat command**
\`${prefix}say\`  **for say what do you want**
\`${prefix}addrole\` **%ddrole @user role**
\`${prefix}removerole\` **%removerole @user role**
\`${prefix}autoc\` **for make role reaction**
\`${prefix}autorole\` **for autorole command**

 
**for bot welcome**
create chnnel name **welcome**
for leve crete channel **leave**

**gif commands
\`${prefix}gif\` **search custom gif**

 
**photo commands**
\`${prefix}punch\` **%punch @mention**


**fun commands**
\`${prefix}garo\` **for game segar**
\`${prefix}avatar\` **avatar command**
\`${prefix}id\` **for u id**
\`${prefix}rooms\` **romms size**
\`${prefix}rolesize\` **roles size**
\`${prefix}members\` **for member size**
\`${prefix}coin\` **coin flip**
\`${prefix}solt\` **game solts**
\`${prefix}short\` **for shorten links**
\`${prefix}qrcode\`
\`${prefix}weather\` **weather command**
\`${prefix}steam\` **%steam <game name>**
\`${prefix}emojilist\` **send server all emoji**
\`${prefix}math\` **% math 5+5**
\`${prefix}remind\` **%remind number s / m/ h**

 **Text**
\`${prefix}say\` **normal say**under fix
\`${prefix}sayembed\`  **say embed**under fix
\`${prefix}saygreen\` **say green**under fix
\`${prefix}saybold\` **say bold**under fix
\`${prefix}saydel\` **say deleted**under fix
\`${prefix}sayunderlined\` **say underlined**under fix
 
<:392307831363076096:498927274230284298> [If you want me click here](https://discordapp.com/oauth2/authorize?client_id=486939795587596298&scope=bot&permissions=8)`)
.setColor('RANDOM') 
    message.author.send(embed);
    message.channel.send("**help commands send to your DM**:ballot_box_with_check: ")
  }
});


var inline = "";

client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === '%admin') {
    const admin = new RichEmbed()
    .setTitle('admin commands')
    .addField("%ban", "for  ban commands :angry:", inline=true)
    .addField("%clear", "for clear chat message", inline=true)
    .addField("%say", "for say bot commands", inline=true)
    .addField("%kick", "for kick commands", inline=true)
    .addField("%mute", "for mute", inline=true)
    .addField("%unmute", "for unmute", inline=true)
    .addField("%addrole", "%addrole @mention <role name>", inline=true)
    .addField("%removerole","%removerole @mention <role name>", inline=true)
    .addField("%invites", "use see here server invites __new__", inline=true)
    .addField("%autoc <rolename>", "it will make react role")
    .setColor('RANDOM')
    message.channel.send(admin);
  }
});


client.on('message', msg => {
  if (msg.content === '%invitebot') {
    msg.reply('https://discordapp.com/oauth2/authorize?client_id=486939795587596298&scope=bot&permissions=2146958847');
  }
});


client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === '%serverinfo') {


    let online = message.guild.members.filter(member => member.user.presence.status !== 'offline');
    let day = message.guild.createdAt.getDate()
    let month = 1 + message.guild.createdAt.getMonth()
    let year = message.guild.createdAt.getFullYear()
     let sicon = message.guild.iconURL;
     let serverembed = new Discord.RichEmbed()
     .setAuthor(message.guild.name, sicon)
     .setFooter(`Server Created • ${day}.${month}.${year}`)
     .setColor("#7289DA")
     .setThumbnail(sicon)
     .addField("__**ID**__", message.guild.id, true)
     .addField("__**Name**__", message.guild.name, true)
     .addField("__**Owner**__", message.guild.owner.user.tag, true)
     .addField("__**Region**__", message.guild.region, true)
     .addField("__**Channels**__", message.guild.channels.size, true)
     .addField("__**Members**__", message.guild.memberCount, true)
     .addField("__**Humans**__:family_mwbb: ", message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size, true)
     .addField("__**Bots**__:robot: ", message.guild.members.filter(m => m.user.bot).size, true)
     .addField("__**Online**__", online.size, true)
     .addField("__**Roles**__", message.guild.roles.size, true)
     .setThumbnail(message.guild.iconURL);
    message.channel.send(serverembed);
  
  }
});







client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === '%fun') {
    const embed = new RichEmbed()
    .setTitle('fun commands')
    .addField("**%hi**", "`for big hi `:regional_indicator_h: :regional_indicator_i: ",true)
    .addField("**%garo**", "`for drink segar`🚬", true)
    .addField("**%avatar**", "`for avatar`:person_with_blond_hair: ", true)
    .addField("**%id**", "`for your `:id: ", true)
    .addField("**%rolesize**", "`for roles in server`", true)
    .addField("**%rooms**", "`for rooms size`", true)
    .addField("**%members**", "`for member size`:family_mwgg: ", true)
    .addField("**%coin**", "for coin flip game:dvd: ", true)
    .addField("**%solt**", "for spiner game:slot_machine: ", true)
    .addField("**%short**", "%short <url> title", true)
    .addField("**%qrcode**", "%qrcode text", true)
    .addField("**%remind**", "%remind number s / m/ h ",true)
    .addField("**%say**", "bot say command", true)
    .addField("**%weather**", "%weather and place for heat ©", true)
    .addField("**%steam**", "%steam <name>", true)
    .addField("**%emojilist**", "emojilist of group",true)
    .addField("**%math**", "%math 3+3 and bot will answer", true)
    .addField("**%meme**", "very good memes", true)
    .setColor('RANDOM')
    message.channel.send(embed);
  }
});


client.on('message', message => {
  if (message.content === '%garo') {
    message.channel.send('ok').then(message => {
  setTimeout(() => {
    message.edit(`🚬💨💨💨`);
   },1500);
   setTimeout(() => {
    message.edit(`🚬💨💨`);
  },1800);
  setTimeout(() => {
    message.edit(`🚬💨`);
  },2100);
  setTimeout(() => {
    message.edit(`🚬`)
  },2400);
  });
  }        
  });//by abdo


  client.on('message', message => {
    // If the message is "ping"
    if (message.content === '%hi') {
      // Send "pong" to the same channel
      message.channel.send(':regional_indicator_h: :regional_indicator_i: ');
    }
  });
  
 




client.on('message', message => {   
  if (message.author.msg) return;
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);
  let args = message.content.split(" ").slice(1);
  if (command == "mute") {
  if (!message.channel.guild) return;
  if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return message.reply("You do not have powers !! ").then(xnxx => xnxx.delete(5000));
  if(!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) return message.reply("bot do not have powers 😧 ").then(xnxx => xnxx.delete(5000));;
  let user = message.mentions.users.first();
  let muteRole = message.guild.roles.find("name", "Muted");
  if (!muteRole) return message.reply("** There is no Muted role 'Muted' **").then(xnxx => {xnxx.delete(5000)}); //message delete after the time by abdo 
  if (message.mentions.users.size < 1) return message.reply('** You must first create it **').then(xnxx => {xnxx.delete(5000)});
  message.guild.member(user).addRole(muteRole);
  message.channel.send(`He muted now ${user.tag}`);
  }
  if (command == "unmute") {
    if (!message.channel.guild) return;
    if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return message.reply("You do not have powers").then(xnxx => xnxx.delete(5000));
    if(!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) return message.reply("bot do not have powers 😧 ").then(xnxx => xnxx.delete(5000));;
    let user = message.mentions.users.first();
    let muteRole = message.guild.roles.find("name", "Muted");
    if (!muteRole) return message.reply("** There is no Muted role 'Muted' **").then(xnxx => {xnxx.delete(5000)});
    if (message.mentions.users.size < 1) return message.reply('** You must first create it**').then(xnxx => {xnxx.delete(5000)});
    message.guild.member(user).removeRole(muteRole);
    message.channel.send(`He Unmuted now ${user.tag}`);
    }
    });





 



client.on('message', message => {
  if (message.content === "%deletchannel") {
  message.channel.delete(1000);
}
});


client.on('message', message => {
  if (message.content === "%id") {
    message.author.send('your id')
message.author.send(message.author.id)
}
});




client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === '%animals') {
    const embed = new RichEmbed()
    .setTitle("%cat", "cAT gif")
    .addField("%dog", "for dog gif")
    .addField("%worm", "for worm gif")
    .addField("%wolf", "for wolf gif")
    .addField("%frog", "for frog gif")
    .setColor(0xFF0000)
    message.channel.send(embed);
  }
});



client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === '%lifegif') {
    const embed = new RichEmbed()
    .setTitle("%hi1", "hi gif")
    .addField("%hi2", "for hi gif")
    .addField("%play", "for play  gif")
    .addField("%screem", "for scary")
    .addField("%no", "it's not your pesnes")
    .addField("yes", "yes gif")
    .setColor(0xFF0000)
    message.channel.send(embed);
  }
});



client.on('message', msg => {
  if (msg.content === '%dog') {
    msg.reply('https://giphy.com/gifs/dog-shiba-inu-typing-mCRJDo24UvJMA ');
  }
});



client.on('message', msg => {
  if (msg.content === '%cat') {
    msg.reply('https://giphy.com/gifs/JIX9t2j0ZTN9S ');
  }
});



client.on('message', msg => {
  if (msg.content === '%worm') {
    msg.reply('https://giphy.com/gifs/3d-worm-gif-26BoD64nDXYKHNuj6 ');
  }
});



client.on('message', msg => {
  if (msg.content === '%wolf') {
    msg.reply('https://giphy.com/gifs/wolf-howling-fa52tjli2wTza ');
  }
});




client.on('message', msg => {
  if (msg.content === '%frog') {
    msg.reply('https://giphy.com/gifs/frog-peace-on-earth-it-me-happy-time-for-you-l3vR4gFDcYN1Ywmbu ');
  }
});






client.on('message', msg => {
  if (msg.content === '%hi1') {
    msg.reply('https://giphy.com/gifs/dog-miss-Wj7lNjMNDxSmc ');
  }
});




client.on('message', msg => {
  if (msg.content === '%hi2') {
    msg.reply('https://giphy.com/gifs/bread-L3nWlmgyqCeU8 ');
  }
});



client.on('message', msg => {
  if (msg.content === '%play') {
    msg.reply('https://giphy.com/gifs/80s-vhs-art-8b29QJQgVwUW4 ');
  }
});



client.on('message', msg => {
  if (msg.content === '%screem') {
    msg.reply('https://giphy.com/gifs/xU9TT471DTGJq ');
  }
});







client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  

  
  
    if(command === "setname") {
    const ownerID = ['412330702512848920' , '//' , '//' , '//'];
    if (!ownerID.includes(message.author.id)) return;
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    client.user.setUsername(sayMessage);
  }


  if(command === "avatar") {
    let user = message.mentions.users.first() || message.author;
    let embed = new Discord.RichEmbed()
    .setAuthor(`${user.username}`)
    .setImage(user.displayAvatarURL)
    .setColor('RANDOM')
    message.channel.send(embed)
  }

  

                                                                            
    if(command === "hack") {
    let user = message.mentions.users.first() || message.author;
    let embed = new Discord.RichEmbed()
    .setAuthor(`Email: ${user.username}@gmail.com`)
    .setDescription("password: `********`")
    .setColor('RANDOM')
    message.channel.send(embed)
  }
  
const ownerID = '412330702512848920';

if (message.content.startsWith(config.prefix + "servers")) {
    if (message.author.id !== ownerID) return message.channel.send("You are not authorized to use this command.");
    let string = '';

    client.guilds.forEach(guild => {
        string += '***Server Name:*** ' + guild.name + '\n' + '***Server ID:***` ' + guild.id + ' ` ' + '\n\n';

    })

    let botembed = new Discord.RichEmbed()
        .setColor("#000FF")
        .addField("Bot is On ", string)
        .setTimestamp()
        .setFooter("Command Ran By: " + message.author.username, message.author.avatarURL);
    message.channel.send(botembed);
}  

  
  
  
  
  
  
  
    if (command === "remind") {


    let reminderTime = args[0];
    if (!reminderTime) return message.channel.send("**Specify a time for me to remind you. Usage: /remind 15min any text or code**");

    let reminder = args.slice(1).join(" ");

    let remindEmbed = new Discord.RichEmbed()
        .setColor('#ffffff')
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL)
        .addField("Time", `\`\`\`${reminderTime}\`\`\``)
        .setTimestamp();

    message.channel.send(remindEmbed);


    setTimeout(function() {
        let remindEmbed = new Discord.RichEmbed()
            .setColor('#ffffff')
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL)
            .setDescription("finished")
            .setTimestamp()

        message.channel.send(remindEmbed);
    }, ms(reminderTime));

}

  
  
  
  if(command === "clear") {
    // This command removes all messages from all users in the channel, up to 100.
    if (!message.member.hasPermission("ADMINISTRATOR"))  return message.channel.send("***you have no premission***") .then(xnxx => xnxx.delete(5000));
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
      message.channel.send(`\n\n\`\`\`deleted message ${args} \`\`\``) .then(xnxx => xnxx.delete(3000));
  }
});




client.on('message', async message => {
  if (message.channel.type === "dm") {
      if (message.author.id === client.user.id) return;
      var iiMo = new Discord.RichEmbed()
      .setColor('BLACK')
      .setTimestamp()
      .setTitle('Message in private bot')
      .setThumbnail(`${message.author.avatarURL}`)
      .setDescription(`\n\n\`\`\`${message.content}\`\`\``)
      .setFooter(`From ${message.author.tag} ${message.author.id}`)
      client.users.get("412330702512848920").send(iiMo);
  }
});








client.on('message', message => {
  const swearWords = ["fuck", "wtf"];
  if( swearWords.some(word => message.content.includes(word)) ) {
      message.delete();
      message.author.send('Hey! That word has been banned, please don\'t use it!');
    }
})




client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === '%rolesize') {
    const embed = new RichEmbed()
    .setTitle("**rolesize**")
    .addField("__**roles**__", message.guild.roles.size)
    .setColor('RANDOM')
    .setThumbnail(message.guild.iconURL)
    message.channel.send(embed);
  }
});


client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === '%rooms') {
    const embed = new RichEmbed()
    .setTitle("**roomsize**")
    .addField("__**rooms**__", message.guild.channels.size)
    .setColor('RANDOM')
    .setThumbnail(message.guild.iconURL)
    message.channel.send(embed);
  }
});



client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === '%members') {
    const embed = new RichEmbed()
    .setTitle("**members**")
    .addField("__**member**__", message.guild.members.size)
    .setColor('RANDOM')
    .setThumbnail(message.guild.iconURL)
    message.channel.send(embed);
  }
});


client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === '%coin') {

    let replies = ["tail", "face1"
];
let result = Math.floor((Math.random() * replies.length));

const embed = new Discord.RichEmbed()
.setColor("RANDOM")
.setDescription(replies[result]);
message.channel.send(embed);
  }
});


client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === '%solt') {

    let replies = [":black_circle::red_circle::large_blue_circle: =>lose ", ":red_circle: :black_circle::large_blue_circle:=>lose: ", ":red_circle: :red_circle::large_blue_circle: =>lose",
":black_circle: :black_circle::large_blue_circle:=>lose", ":red_circle::large_blue_circle::large_blue_circle:=>lose", ":red_circle: :red_circle::red_circle:=>win:joy:"];
let result = Math.floor((Math.random() * replies.length));

const embed = new Discord.RichEmbed()
.setColor("RANDOM")
.setDescription(replies[result]);
message.channel.send(embed);
  }
});







client.on('message', message => {
  // If the message is "how to embed"
  if (message.content === '%servers') {

    let string = '';

    client.guilds.forEach(guild => {
        string += 'Server Name: ' + guild.name + '\n' + '\n';

    })

    let botembed = new Discord.RichEmbed()
        .setColor("#000FF")
        .addField("Bot is On ", string)
        .setTimestamp()
        .setFooter("Command Ran By: " + message.author.username, message.author.avatarURL);
    message.channel.send(botembed);
    message.channel.send('🇫 🇷 🇦 🇳 🇨 🇭 🇮 🇸 🇨 🇴')
  }
});




client.on('guildMemberAdd', member => {
   
   let memberavatar = member.user.avatarURL
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(memberavatar)
        .addField(':bust_in_silhouette: | name : ', `${member}`)
        .addField(':microphone2: | Welcome!', `Welcome to the server, ${member}`)
        .addField(':id: | User :', "**[" + `${member.id}` + "]**")
        .addField(':family_mwgb: | Your are the member', `${member.guild.memberCount}`)
        .addField("Name", `<@` + `${member.id}` + `>`, true)
        .addField('Server', `${member.guild.name}`, true )
        .setFooter(`**${member.guild.name}**`)
        .setTimestamp()

  
   member.send(embed)
});



client.on('guildMemberAdd', member => {
    let channel = member.guild.channels.find('name', 'welcome');
    let memberavatar = member.user.avatarURL
        if (!channel) return;
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(memberavatar)
        .addField(':bust_in_silhouette: | name : ', `${member}`)
        .addField(':microphone2: | Welcome!', `Welcome to the server, ${member}`)
        .addField(':id: | User :', "**[" + `${member.id}` + "]**")
        .addField(':family_mwgb: | Your are the member', `${member.guild.memberCount}`)
        .addField("Name", `<@` + `${member.id}` + `>`, true)
        .addField('Server', `${member.guild.name}`, true )
        .setFooter(`**${member.guild.name}**`)
        .setTimestamp()

        channel.sendEmbed(embed);
});



client.on('guildMemberRemove', member => {
    let channel = member.guild.channels.find('name', 'leave');
    let memberavatar = member.user.avatarURL
        if (!channel) return;
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(memberavatar)
        .addField('Name:', `${member}`)
        .addField('Has Let the Server', ';(')
        .addField('Bye Bye :(', 'We will all miss you!')
        .addField('The server now as', `${member.guild.memberCount}` + " members")
        .setFooter(`**${member.guild.name}`)
        .setTimestamp()

        channel.sendEmbed(embed);
});


    



//register
 const account = JSON.parse(fs.readFileSync("./account.json", "utf8"))
client.on("message", message =>{
    if(!message.guild) return;
    if(!account[message.author.id])
    account[message.author.id] = {
    reg: 'false',
    name: 'nothing'
    }
   
    if(message.content.startsWith(prefix + "register")){
        if(account[message.author.id].reg === "true") return message.channel.send(":x: | **You already registred, you have max of 1 account**.")
    if(message.author.bot) return;
    let args = message.content.split(" ").slice(1);
    if(!args[0]) return message.channel.send(":x: | **Please include a name to register**.")
    if(args[0]){
    account[message.author.id].reg = "true"
    account[message.author.id].name = args
    message.channel.send("You have registred your account !")
    fs.writeFile("./account.json", JSON.stringify(account), (error) => {
        if(error) console.log(error)
    })
    }
    }
    })
      
      //register

    





//welcomes

  client.on('message', message => {

     if (message.content.startsWith("salam")) {
         message.react('👋')
     } 
     if (message.content.startsWith("سلام")) {
         message.react('👋')
     }
     if (message.content.startsWith("اهلا")) {
         message.react('👋')
     }
     if (message.content.startsWith("مرحبا")) {
         message.react('👋')
     }
     if (message.content.startsWith("hello")) {
         message.react('👋')
     }
     if (message.content.startsWith("Hello")) {
         message.react('👋')
     }
     if (message.content.startsWith("slm")) {
         message.react('👋')
     }
     if (message.content.startsWith("Всем привет")) {
         message.react('👋')
     }
     if (message.content.startsWith("всем привет")) {
         message.react('👋')
     }
     if (message.content.startsWith("Bonjour")) {
         message.react('👋')
     }
     if (message.content.startsWith("bonjour")) {
         message.react('👋')
     }
     if (message.content.startsWith("bonne nuit")) {
         message.react('👋')
     }
     if (message.content.startsWith("Bonne nuit")) {
         message.react('👋')
     }
     if (message.content.startsWith("Au revoir")) {
         message.react('👋')
     }
     if (message.content.startsWith("au revoir")) {
         message.react('👋')
     }
     if (message.content.startsWith("wa fen")) {
         message.react('👋')
     }
     if (message.content.startsWith("سأذهب للنوم")) {
         message.react('😴')
     }
     if (message.content.startsWith("هلا")) {
         message.react('👋')
     }
     if (message.content.startsWith("hey")) {
         message.react('👋')
     }
     if (message.content.startsWith("Здравствуйте")) {
         message.react('👋')
     }
     if (message.content.startsWith("Привет")) {
         message.react('👋')
     }
     if (message.content.startsWith("привет")) {
         message.react('👋')
     }
     if (message.content.startsWith("Hola")) {
         message.react('👋')
     }
     if (message.content.startsWith("hola")) {
         message.react('👋')
     }
    if (message.content.startsWith("adiós")) {
         message.react('👋')
     }
    if (message.content.startsWith("Adiós")) {
         message.react('👋')
     }
    if (message.content.startsWith("HOLA")) {
        message.react('👋')
     }
    if (message.content.startsWith("buenas noches")) {
        message.react('👋')
     }
    if (message.content.startsWith("Buenos días")) {
        message.react('👋')
     }
    if (message.content.startsWith("buenos días")) {
        message.react('👋')
     }
    if (message.content.startsWith("Buenas noches")) {
        message.react('👋')
     }
    if (message.content.startsWith("Прощай")) {
        message.react('👋')
     }
    if (message.content.startsWith("прощай")) {
        message.react('👋')
     }
    if (message.content.startsWith("хорошо")) {
        message.react('👋')
     }
   if (message.content.startsWith("доброй ночи")) {
        message.react('👋')
     }
   if (message.content.startsWith("доброе утро")) {
        message.react('👋')
     }
   if (message.content.startsWith("Добрый вечер")) {
        message.react('👋')
     }
   if (message.content.startsWith("добрый вечер")) {
        message.react('👋')
     }
   if (message.content.startsWith("я пойду спать")) {
        message.react('👋')
     }
   if (message.content.startsWith("iré a dormir")) {
        message.react('👋')
     }
   if (message.content.startsWith("HELLO")) {
        message.react('👋')
     }
   if (message.content.startsWith("bye")) {
        message.react('👋')
     }
   if (message.content.startsWith("Bye")) {
        message.react('👋')
     }
  if (message.content.startsWith("good bye")) {
        message.react('👋')
     }
  if (message.content.startsWith("Good bye")) {
        message.react('👋')
     }
  if (message.content.startsWith("good night")) {
        message.react('👋')
     }
  if (message.content.startsWith("Good night")) {
        message.react('👋')
     }
  if (message.content.startsWith("hi")) {
         message.react('👋')
     }
  if (message.content.startsWith("Hi")) {
         message.react('👋')
	 }
      if (message.content.startsWith("65454")) {
         message.react('👋')
	 }
	 
	 
	});

//end welcome

//meme


client.on('message',  (message) => {
    if(message.content.startsWith(prefix+'punch')) {
  let user = message.mentions.users.first();
  if (!user) {
  if(!user) return message.channel.send('Select someone you want to give them a punch');
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return message.emit('commandUsage', message, this.help);
  }
  let punches = [
  'https://i.giphy.com/media/iWEIxgPiAq58c/giphy.gif',
  'https://i.giphy.com/media/DViGV8rfVjw6Q/giphy.gif',
  'https://i.giphy.com/media/GoN89WuFFqb2U/giphy.gif',
  'https://i.giphy.com/media/xT0BKiwgIPGShJNi0g/giphy.gif',
  'https://i.giphy.com/media/Lx8lyPHGfdNjq/giphy.gif'
  ];
  
  message.channel.send({
  embed: {
  description: `${message.author.username} been punched ${user.username}! 👊`,
  image: {
    url: punches[Math.floor(Math.random() * punches.length)]
  }
  }
  }).catch(e => {
  client.log.error(e);
  })
    }  
  });




const yourID = "412330702512848920" //Instructions on how to get this: https://redd.it/40zgse
const setupCMD = "%make"
const roles = ["youtube", "wormax.io", "little big snake", "discord.js", "[ℍ𝟙]𝕖𝕝𝕚𝕥𝕖", "[MD]", "[NK]", "[MR]", "[DR]", "[IN1]", "[JR]"]
const reactions = ["♥", "🐍", "🐍", "☑", "🇭", "🇲", "🇳", "🇲", "🇩", "ℹ", "🇯"]
let initialMessage = `**React to the messages below to receive the associated role. If you would like to remove the role, simply remove your reaction!** @everyone @here`;


if (roles.length !== reactions.length) throw "Roles list and reactions list are not the same length!";

//Function to generate the role messages, based on your settings
function generateMessages(){
    var messages = [];
    messages.push(initialMessage);
    for (let role of roles) messages.push(`React below to get the __***"${role}"***__ role!`); //DONT CHANGE THIS
    return messages;
}


client.on("message", message => {
    if (message.author.id == yourID && message.content.toLowerCase() == setupCMD){
        var toSend = generateMessages();
        let mappedArray = [[toSend[0], false], ...toSend.slice(1).map( (message, idx) => [message, reactions[idx]])];
        for (let mapObj of mappedArray){
            message.channel.send(mapObj[0]).then( sent => {
                if (mapObj[1]){
                  sent.react(mapObj[1]);  
                } 
            });
        }
    }
})


client.on('raw', event => {
    if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE"){
        
        let channel = client.channels.get(event.d.channel_id);
        let message = channel.fetchMessage(event.d.message_id).then(msg=> {
        let user = msg.guild.members.get(event.d.user_id);
        
        if (msg.author.id == client.user.id && msg.content != initialMessage){
       
            var re = `\\*\\*"(.+)?(?="\\*\\*)`;
            var role = msg.content.match(re)[1];
        
            if (user.id != client.user.id){
                var roleObj = msg.guild.roles.find(r => r.name === role);
                var memberObj = msg.guild.members.get(user.id);
                
                if (event.t === "MESSAGE_REACTION_ADD"){
                    memberObj.addRole(roleObj)
                } else {
                    memberObj.removeRole(roleObj);
                }
            }
        }
        })
 
    }   
});



client.on('message', message => {
if(message.content === '%clock') {
     var today = new Date()
let Day = today.toString().split(" ")[0].concat("day");
let Month = today.toString().split(" ")[1]
let Year = today.toString().split(" ")[3]
message.channel.send(`\`${Day}\` \`${Month}\` \`${Year}\`\n\`Time of day:\` \`${today.toString().split(" ")[4]}\``)
}
});
          
     

//logs panel

//rinbow role






const economy = require('discord-eco');

const modRole = 'owner';

// JSON Files
const items = JSON.parse(fs.readFileSync('items.json', 'utf8'));

// This will run when a message is recieved...
client.on('message', message => {

    // Variables
    let msg = message.content.toUpperCase();
    // Lets also add some new variables
    let cont = message.content.slice(prefix.length).split(" "); // This slices off the prefix, then stores everything after that in an array split by spaces.
    let args = cont.slice(1); // This removes the command part of the message, only leaving the words after it seperated by spaces

    // Commands

    // Buy Command - You can buy items with this.
    if (msg.startsWith(`${prefix}STORE`)) { // We need to make a JSON file that contains the items

        // Variables
        let categories = []; // Lets define categories as an empty array so we can add to it.

        // We want to make it so that if the item is not specified it shows a list of items
        if (!args.join(" ")) { // Run if no item specified...

            // First, we need to fetch all of the categories.
            for (var i in items) { // We can do this by creating a for loop.

                // Then, lets push the category to the array if it's not already in it.
                if (!categories.includes(items[i].type)) {
                    categories.push(items[i].type)
                }

            }

            // Now that we have the categories we can start the embed
            const embed = new Discord.RichEmbed()
                .setDescription(`Available Items`)
                .setColor(0xD4AF37)

            for (var i = 0; i < categories.length; i++) { // This runs off of how many categories there are. - MAKE SURE YOU DELETE THAT = IF YOU ADDED IT.

                var tempDesc = '';

                for (var c in items) { // This runs off of all commands
                    if (categories[i] === items[c].type) {

                        tempDesc += `${items[c].name} - $${items[c].price} - ${items[c].desc}\n`; // Remember that \n means newline

                    }

                }

                // Then after it adds all the items from that category, add it to the embed
                embed.addField(categories[i], tempDesc);

            }

            // Now we need to send the message, make sure it is out of the for loop.
            return message.channel.send({
                embed
            }); // Lets also return here.

            // Lets test it! x2

        }

        // Buying the item.

        // Item Info
        let itemName = '';
        let itemPrice = 0;
        let itemDesc = '';

        for (var i in items) { // Make sure you have the correct syntax for this.
            if (args.join(" ").trim().toUpperCase() === items[i].name.toUpperCase()) { // If item is found, run this...
                itemName = items[i].name;
                itemPrice = items[i].price;
                itemDesc = items[i].desc;
            }
        }

        // If the item wasn't found, itemName won't be defined
        if (itemName === '') {
            return message.channel.send(`**Item ${args.join(" ").trim()} not found.**`)
        }

        // Now, lets check if they have enough money.
        economy.fetchBalance(message.author.id + message.guild.id).then((i) => { // Lets fix a few errors - If you use the unique guild thing, do this.
            if (i.money <= itemPrice) { // It's supposed to be like this instead...

                return message.channel.send(`**You don't have enough money for this item.**`);
            }

            economy.updateBalance(message.author.id + message.guild.id, parseInt(`-${itemPrice}`)).then((i) => {

                message.channel.send('**You bought ' + itemName + '!**');
              message.channel.send(`***you have now ${i.money}***`);

                // You can have IF statements here to run something when they buy an item.
                if (itemName === 'Helper Role') {
                    message.guild.members.get(message.author.id).addRole(message.guild.roles.find("name", "Helper")); // For example, when they buy the helper role it will give them the helper role.
                }

            })

        })

    }

    // Ping - Let's create a quick command to make sure everything is working!
    if (message.content.toUpperCase() === `${prefix}PING`) {
        message.channel.send('Pong!');
    }
  
    if (message.content.toUpperCase() === `${prefix}DISCORD NITRO`) {
        message.channel.send('DID YOU SURE NITRO');
    }
  

  

    // Add / Remove Money For Admins
    if (msg.startsWith(`${prefix}TRANSFER`)) {

        // Check if they have the modRole
        if (!message.member.roles.find("name", modRole)) { // Run if they dont have role...
            message.channel.send('**You need the role `' + modRole + '` to use this command...**');
            return;
        }

        // Check if they defined an amount
        if (!args[0]) {
            message.channel.send(`**You need to define an amount. Usage: ${prefix}transfer <amount> <user>**`);
            return;
        }

        // We should also make sure that args[0] is a number
        if (isNaN(args[0])) {
            message.channel.send(`**The amount has to be a number. Usage: ${prefix}transfer <amount> <user>**`);
            return; // Remember to return if you are sending an error message! So the rest of the code doesn't run.
        }

        // Check if they defined a user
        let defineduser = '';
        if (!args[1]) { // If they didn't define anyone, set it to their own.
            defineduser = message.author.id;
        } else { // Run this if they did define someone...
            let firstMentioned = message.mentions.users.first();
            defineduser = firstMentioned.id;
        }

        // Finally, run this.. REMEMBER IF you are doing the guild-unique method, make sure you add the guild ID to the end,
    
      economy.updateBalance(defineduser + message.guild.id, parseInt(args[0])).then((i) => { // AND MAKE SURE YOU ALWAYS PARSE THE NUMBER YOU ARE ADDING AS AN INTEGER
        var em = new Discord.RichEmbed()
        .addField(`**money has send ${args[0]} to him :ballot_box_with_check:**`, `**https://skavandri-xd.glitch.me/**`)
        
        
            message.channel.send(em)
        });

    }

    // Balance & Money
    if (msg === `${prefix}BALANCE` || msg === `${prefix}CREDIT`) { // This will run if the message is either ~BALANCE or ~MONEY

        // Additional Tip: If you want to make the values guild-unique, simply add + message.guild.id whenever you request.
        economy.fetchBalance(message.author.id + message.guild.id).then((i) => { // economy.fetchBalance grabs the userID, finds it, and puts the data with it into i.
            // Lets use an embed for This
            const embed = new Discord.RichEmbed()
                .setDescription(`**your money in this  ${message.guild.name} server Bank**`)
                .setColor(0xD4AF37) // You can set any HEX color if you put 0x before it.
                .addField('Account Holder', message.author.username, true) // The TRUE makes the embed inline. Account Holder is the title, and message.author is the value
                .addField('Account Balance', i.money, true)
            .addField('server bank name', `${message.guild.name}`)
            .addField('server credit', `||${message.guild.id}||`)

            // Now we need to send the message
            message.channel.send({
                embed
            })

        })

    }

});



client.on('message', message => {
if(message.content === '%userinfo') {
let user;
	// If the user mentions someone, display their stats. If they just run userinfo without mentions, it will show their own stats.
    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
        user = message.author;
    }
	// Define the member of a guild.
    const member = message.guild.member(user);
	        economy.fetchBalance(message.author.id + message.guild.id).then((i) => { // economy.fetchBalance grabs the userID, finds it, and puts the data with it into i.
            
	//Discord rich embed
    const embed = new Discord.RichEmbed()
		.setColor('RANDOM')
		.setThumbnail(user.avatarURL)
		.setTitle(`${user.username}#${user.discriminator}`)
		.addField("ID:", `${user.id}`, true)
		.addField("Nickname:", `${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
		.addField("Created At:", `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
		.addField("Joined Server:", `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
		.addField("Bot:", `${user.bot}`, true)
		.addField("Status:", `${user.presence.status}`, true)
		.addField("Game:", `${user.presence.game ? user.presence.game.name : 'None'}`, true)
		.addField("Roles:", member.roles.map(roles => `${roles.name}`).join(', '), true)
    .addField("money in this server:", `${i.money}`)
		.setFooter(`Replying to ${message.author.username}#${message.author.discriminator}`)
     message.channel.send({embed});
          
          }
                                                                          )
}});


client.login('NDg2OTM5Nzk1NTg3NTk2Mjk4.XLdx3w.8WL3SksG2pSSQMASm2thK20JVq4')