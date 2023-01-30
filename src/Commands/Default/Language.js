import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../../Structures/Base/Command.js";

class Language extends Command {

    constructor() {
        super();
        this.name = "language";
        this.description = "Set language in this guilds.";
        this.target = ["GUILD"];
        this.permission = [PermissionFlagsBits.Administrator]
        this.options = [{
            name: 'language',
            description: 'Sets the language for the server',
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
            required: true,
        }]
    }

    autocomplete() {
        // Get all files from locales (json)
        return ["fr-FR", 'pt-PT', 'en-US'];
    }

    run(message, args) {
        return 'Needs to be implemented';
    }
}

export default Language;