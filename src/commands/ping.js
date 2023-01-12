const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('teste')
		.setDescription('Comando para testes'),
	async execute(interaction) {
		await interaction.reply('Teste feito');
	},
}