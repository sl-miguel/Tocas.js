import { Events, InteractionType } from "discord.js";
import Event from '../../Structures/Base/Event.js'
import Utility from "../../Structures/Utililites/Utility.js";

class Slash extends Event {

    constructor() {
        super();
        this.name = 'Slash';
        this.type = Events.InteractionCreate
    }

    async run(interaction, instance) {

        if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            await instance.autocomplete(interaction);
            return;
        }

        if (interaction.type !== InteractionType.ApplicationCommand) return;
        console.log(`→ Interaction: ${interaction.commandName}`);

        const args = interaction.options.data.map(({ value }) => value);

        const command = instance.commands.get(interaction.commandName);
        if (!command) return;

        // Validations (runtime)
        const path = Utility.root('src/Structures/Validations/Runtime');
        const validations = await Utility.files(path);

        for (const validation of validations) {
            const { default: Validate } = await import(validation);
            const validate = new Validate();
            const isValid = await validate.run(command, { interaction, args, instance });
            if (!isValid) return;
        }

        if (command.defer)
        await interaction.deferReply({ ephemeral: command.defer === 'ephemeral' });

        const response = await instance.run(command, args, interaction);
        if (!response) return;

        if (command.defer) await interaction.editReply(response);
        else await interaction.reply(response);
    }

}

export default Slash;

