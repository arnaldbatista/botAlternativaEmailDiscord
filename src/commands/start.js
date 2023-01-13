const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Comando para iniciar o bot'),
	async execute(interaction) {
		await interaction.reply('bot iniciado')
	},
}