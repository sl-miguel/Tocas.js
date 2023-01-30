import { PermissionFlagsBits } from 'discord.js';
import Validation from "../../Base/Validation.js";

class Disabled extends Validation {

    constructor() {
        super();
        this.name = 'Disabled is required';
        this.description = 'Checks syntax of disabled';
        this.keys = Object.keys(PermissionFlagsBits);
    }

    async run(command, { interaction, instance }) {

        if (!interaction.guild) return true;

        if (instance.disabled.isOff(interaction.guild.id, command.name)) {
            console.log('Disabled ?')
            interaction.reply(`This command is disabled.`);
            return false;
        }

        return true;
    }
}

export default Disabled;