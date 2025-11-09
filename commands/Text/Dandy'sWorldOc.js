const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

const axios = require('axios');

const output = "./output.png"

const fs = require('fs');

const http = require('http');

const dataLink = "https://random-word-api.herokuapp.com/word"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dwocgenerator')
        .setDescription('Generates a fuckass DW oc'),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        await interaction.deferReply({ ephemeral: false });

        let response = await axios.get(dataLink)

        let name = response.data[0]

        if (getRandomInt(0,1) == 1)
        {
            name = name + "a"
        }
        else
        {
            name = name + "o"
        }

        let isMain = Math.random() < 0.5

        let statTotal = 15

        if (isMain)
        {
            statTotal++
        }

        let stats = [0,0,0,0,0]

        while (statTotal > 0)
        {
            for (i = 0; i < 5; i++)
            {
                let newStat = getRandomInt(0,2)

                console.log(statTotal)

                statTotal -= newStat

                if (statTotal < 0)
                {
                    statTotal += newStat

                    break
                }

                stats[i] += newStat

                if (stats[i] > 5)
                {
                    newStat += stats[i] - 5

                    stats[i] = 5
                }
            }
        }

        text = "This is my new oc, " + name + "! \nTheir stats are so cool, take a look!"

        if (isMain)
        {
            text = text + "\nhealth: 2"
        }
        else
        {
            text = text + "\nhealth: 3"
        }

        statNames = [
            "Skill Check",
            "Speed",
            "Stamina",
            "Stealth",
            "Extraction Speed"
        ]

        for (i = 0; i < 5; i++)
        {
            text = text + "\n" + statNames[i] + ": " + stats[i].toString()
        }

        text = text + "\nTheir abilities are also cool! Look!!!!!!"

        text = text + "\n\n" + ability()

        if (isMain)
        {
            text = text + "\n\n" + ability()
        }

        await interaction.editReply(
            {
                content: text
            }
        );
    },
};

function ability()
{
    start = [
        "Upon a machine being completed, this toon will",
        "On use this toon will",
        "Every 1.5 seconds this toon will",
        "On hit this toon will"
    ]

    middle = [
        "gain a random",
        "get a free",
        "stun a twisted and get one",
        "randomly get a",
        "lose one",
        "permenantly distract a twisted and lose one",
        "side with rox then lose one",
        "spray paint the wall, do a backflip 10 miles away from any enemies, then get one",
        "do bad game design at the cost of one"
    ]

    end = [
        "item.",
        "speed boost.",
        "tapes.",
        "research.",
        "stat boost",
        "heart"
    ]

    return start[getRandomInt(0,start.length)] + " " + middle[getRandomInt(0,middle.length)] + " " + end[getRandomInt(0,end.length)]
}

function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}
