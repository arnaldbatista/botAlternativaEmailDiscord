const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('../../config.json');
const emailOutlook = require('./emailOutlook');
const { setInterval } = require('node:timers');


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = function botDiscord() {
    client.once(Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });
    
    client.login(token);
    
    client.commands = new Collection();
    
    function teste2() {
        console.log('2 - chamando o teste()')
        teste()
    }
    function teste() {
        console.log('3 - inicio do teste()')


        emailOutlook().then(res => {
            console.log('inicio do res =>')
            // console.log(res)
            // client.channels.cache.get('1058449545488506982').send(res.link)
            let teste = []
            teste.push(res)
    
            setInterval(() => {
                if(teste.length !== 0){
                    console.log(teste)
                    teste.splice(0)
                    console.log('dentro do loop')
                    clearInterval()
                    console.log('clearInterval()')
                    teste2()
                    console.log('dps de chamar o teste2')
                }
            }, 1000) 
            console.log('final do res =>')
            return           
        })

        
        console.log('4 - final do teste()')
    }
    console.log('1 - chamando o teste2')
    teste2()



    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });
}