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

        text = "Introducing the NEW DW TOON! " + name + "! \ [Stats]"

        if (isMain)
        {
            text = text + "\nHP: 2"
        }
        else
        {
            text = text + "\nHP: 3"
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

        text = text + "\n[Traits!]"

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
        "Upon completing a Machine, this Toon will",
        "Upon completing a Floor, this Toon will",
        "Upon the start of the Floor, this Toon will",
        "Upon the start of Panic Mode, this Toon will",
        "Upon picking up a Tape, this Toon will",
        "Upon picking up an item, this Toon will",
        "Upon picking up a Research Capsule, this Toon will",
        "Upon picking up a Tape, this Toon will",
        "On hit, this Toon will",
        "On use, this Toon will",
        "On hit this Toon will",
        "Upon being noticed by a Twisted, this Toon will",
        "Overtime, this Toon will",
        "Once per Floor, this Toon will",
        "By their SPECIAL FORM,",
        "At the cost of Stamina, this Toon will",
        "At the cost of some Tapes, this Toon will",
        "At the cost of a single ❤︎, this Toon will",
    ]

    middle = [
        "gain a",
        "lose a",
        "set down a building, which locates a",
        "set down a building, which grants a",
        "grant a nearby ally a",
        "grant all nearby allies a",
    ]

    end = [
        "random item",
        "Bandage",
        "Medkit",
        "random stat debuff",
        "random stat buff",
        "lowered Speedboost",
        "higher Speedboost",
        "lowered Skill Check",
        "higher Skill Check",
        "lower Stealth",
        "higher Stealh",
        "lower Extraction Speed",
        "higher Extraction Speed",
        "lower Max Stamina",
        "higher Max Stamina",
        "portion of Stamina",
        "Tape",
        "single ❤︎",

    ]

    ]

    bonus = [
        ".",
        ", lasting only for that Floor.",
        "permanently.",
        "before setting this Toon to zero Stamina.",

    ]

    return start[getRandomInt(0,start.length)] + " " + middle[getRandomInt(0,middle.length)] + " " + end[getRandomInt(0,end.length)] + " " + bonus[getRandomInt(0,bonus.length)]
}

function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}
