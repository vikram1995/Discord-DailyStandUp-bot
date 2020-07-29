const Discord = require('discord.js');
const { MessageEmbed} = require('discord.js');
var schedule = require('node-schedule');


const client = new Discord.Client();

const token = 'NzM2OTY4MDY5NjQ5NTMwOTIz.Xx2hAA.yKfc5hmAnX0Ly8z-MQEtsAvS420';

const channelIDs = ["737605954543026186","737345446078316606"]   // enter channelID for standUp - you can get channel id by the command !channelID


function startStandUp(channelID){
   
     console.log(channelID);
    const channel = client.channels.cache.get(channelID);
    channelName = channel.name;
  
    let users = channel.members;  // get the all users of channel
    
    const stantUpStartMessage = new MessageEmbed()
      // Set the title of the field
      .setTitle(`Daily standup for the channel  "${channelName}" with channel ID : ${channelID}`)
      // Set the color of the embed
      .setColor(0x16a085)
      // Set the main content of the embed
      .setDescription("start by command '!standUp' and mention the channel ID when asked" );

       users.forEach(users=>{
        
        if(!users.user.bot){
            users.send(stantUpStartMessage).catch(console.error);
        }
         
       })  // sending message to each member of the channel to start standup
        
    
}


function standUpReminder(channelID){

    const channel = client.channels.cache.get(channelID);
  
    let users = channel.members;  // get the all users of channel

    const stantUpStartMessage = new MessageEmbed()
      // Set the title of the field
      .setTitle('Standup Reminder')
      // Set the color of the embed
      .setColor(0x16a085)
      // Set the main content of the embed
      .setDescription("start by command '!standUp' ");

      // users need to filter out as per role

       users.each(users=> users.send(stantUpStartMessage).catch(console.error)); // sending message to each member of the channel to start standup
}



client.on('ready', ()=>{
    console.log("this bot is online");
    schedule.scheduleJob('41 11 * * *', function(){ // set time for standup more on https://www.npmjs.com/package/node-schedule
        console.log('The answer to life, the universe, and everything!');
        channelIDs.forEach(channelID=>{
            startStandUp(channelID);  
          })
         
      });
    
      channelIDs.forEach(channelID=>{
        startStandUp(channelID);  
      })
       
    
})



client.on('message',async (message)=>{
    const msg = message.content.toLowerCase();
    if(msg == '!channelid'){
        message.reply(message.channel.id);
    }

  

    if (msg.startsWith('!standup')) {
        let answers={
            did :"",
            plan :"",
            problem :"",
            channelID:""
        }
        message.channel.send("Enter the channel ID");
       
        const filter = m => !m.author.bot;
        // Errors: ['time'] treats ending because of the time limit as an error
        message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected =>{
            console.log(collected.size);
            answers.channelID = collected.first().content
            message.channel.send("what you did today ? ");
        } ).then(collected=>{
            message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected =>{
                answers.did = collected.first().content
                message.channel.send("What are you planning on doing tomorrow ?");  
            })
        .then(collected=>{
            message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected =>{
                answers.plan = collected.first().content
                message.channel.send("facing any problem ?");
                 
            }).then(collected=>{
                message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected =>{
                    answers.problem = collected.first().content
                    message.channel.send("All done! Congrats for maintaining a streak for X days!");

                    //message embed
                    if(answers.channelID){
                        let destinationChannel = client.channels.cache.get(answers.channelID);
                        const updateEmbed = new Discord.MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(`${message.author.username} progress updates`)
                                
                                .addFields(
                                    { name: 'What did you do today?', value: answers.did },
                                    { name: 'What are you planning on doing tomorrow?', value: answers.plan },
                                    { name: 'Where do you need help?', value: answers.problem },
                                    
                                )
                                
                                .setTimestamp()
                                destinationChannel.send(updateEmbed);

                    }

                    console.log(answers);
                }).catch(collected => message.channel.send(`timeout start again with command "!standup" `))
            }).catch(collected => message.channel.send(`timeout start again with command "!standup" `))
             
        }).catch(collected => message.channel.send(`timeout start again with command "!standup" `))
        }).catch(collected => message.channel.send(`timeout start again with command "!standup" `));
        

      }

      
})



client.login(token);