import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../../Structures/Base/Command.js";

class Toggle extends Command {

    constructor() {
        super();
        this.name = "toggle";
        this.description = "Toggles commands on/off";
        this.target = ["GUILD"];
        this.defer = false; // temp fix
        this.permission = [PermissionFlagsBits.Administrator];
        this.options = [
            {
                name: 'command',
                description: 'The command to toggle on/off',
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
                required: true,
            }
        ]
    }

    autocomplete(interaction, command, arg, collection) {
        return [...collection.keys()];
    }

    async run({ interaction, instance, args }) {
        const { disabled } = instance;

        const [ commandName ] = args;

        if (disabled.isOff(interaction.guild.id, commandName)) {
            await disabled.on(interaction.guild.id, commandName);
            interaction.reply(`Command ${commandName} has been enabled.`);
        }
        else {
            await disabled.off(interaction.guild.id, commandName)
            interaction.reply(`Command ${commandName} has been disabled.`);
        }
    }
}

export default Toggle;