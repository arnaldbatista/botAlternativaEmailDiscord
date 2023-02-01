const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ok')
		.setDescription('Comando para veriicar se o bot está ativo'),
	async execute(interaction) {
		await interaction.reply('bot ativo ')
	},
}