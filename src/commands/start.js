const { SlashCommandBuilder } = require('discord.js');
const fetchEmails = require('../connections/emailGmail')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Comando para iniciar o bot'),
	async execute(interaction) {
		const teste = fetchEmails()

		console.log(teste)

		await interaction.reply('bot iniciado' + teste)
	},
}