const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

const { Jimp, intToRGBA, rgbaToInt } = require('jimp');

const axios = require('axios');

const output = "./output.png"

const fs = require('fs');

const dataLink = "http://24.199.91.149:3000/api/dailyScore"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rrdailydata')
        .setDescription('Get data about the current daily!'),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        await interaction.deferReply({ ephemeral: false });

        let response = await fetch(dataLink)

        console.log response

        let file = new Jimp({
            width: 32 * 5,
            height: 32,
            color: 0x000000ff,
        });

        await file.write(output)

        const attachment = new AttachmentBuilder(output, { name: "file.png" });

        await interaction.editReply(
            {
                response,
                files: [attachment]
            }
        );

        fs.unlink(output, () => {})
    },
};
