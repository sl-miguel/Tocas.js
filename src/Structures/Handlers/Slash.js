import { Collection, InteractionType } from "discord.js";

import Utility from "../Utililites/Utility.js";
import Cooldown from "../Base/Cooldown.js";
import Channel from "../Base/Channel.js";
import Disable from "../Base/Disable.js";

class Slash {

    constructor(client) {
        this.client = client;
        this.commands = new Collection();
        this.cooldowns = new Cooldown(this.client.settings);
        this.channels = new Channel();
        this.disabled = new Disable();
    }

    async run(command, args, interaction) {

        const { guild, member, user } = interaction;
        const usage = { interaction, args, guild, member, user, instance: this };

        if (command.cooldown) {

            let cooldownType;
            const cooldownTypes = ["perUser", "perUserPerGuild", "perGuild", "global"];

            for (const type of cooldownTypes) {
                if (command.cooldown[type]) {
                    cooldownType = type;
                    break;
                }
            }

            const cooldownUsage = {
                cooldownType,
                userId: user.id,
                actionId: `command_${command.name}`,
                guildId: guild?.id,
                duration: command.cooldown[cooldownType],
                errorMessage: command.cooldown.errorMessage,
            }

            const result = this.cooldowns.check(cooldownUsage);
            if (typeof result === 'string') return result;

            await this.cooldowns.start(cooldownUsage);

            usage.cancel = () => this.cooldowns.delete(cooldownUsage);
            usage.update = (expires) => this.cooldowns.update(cooldownUsage, expires);
        }

        return await command.run(usage);
    }

    async autocomplete(interaction) {
        const command = this.commands.get(interaction.commandName);

        if (!command) return;
        if (!command.autocomplete.length) return;

        const focusedOption = interaction.options.getFocused(true);
        const choices = await command.autocomplete(interaction, command, focusedOption.name, this.commands);

        const filtered = choices.filter((choice) => {
            const lowerCaseChoice = choice.toLowerCase();
            const lowerCaseFocusedOption = focusedOption.value.toLowerCase();
            return lowerCaseChoice.startsWith(lowerCaseFocusedOption);
        })

        const result = filtered.slice(0, 25);
        const response = result.map((choice) => ({ name: choice, value: choice }));
        await interaction.respond(response);
    }

    async load() {
        const path = Utility.root('src/Commands');
        const files = await Utility.files(path);

        const validationsPath = Utility.root('src/Structures/Validations/Syntax');
        const validations = await Utility.files(validationsPath);

        for (const file of files) {

            const { default: Command } = await import(file);
            const command = new Command();

            const { name, description, options } = command;

            if (command.delete) {

                if (!command.test) {
                    await this.delete(name);
                    continue;
                }

                const guilds = this.client.settings.GUILDS.DEV;
                for (const guild of guilds) {
                    await this.delete(name, guild);
                }

                continue;
            }

            // Validations (syntax)
             for (const validation of validations) {
                 const { default: Validate } = await import(validation);
                 const validate = new Validate();
                 await validate.run(command);
             }


            await command.prepare(this.client, command);
            this.commands.set(name, command);

            if (!command.test) {
                await this.create(name, description, options);
                continue;
            }

            const guilds = this.client.settings.GUILDS.DEV;
            for (const guild of guilds) {
                await this.create(name, description, options, guild);
            }

        }
    }

    async create(name, description, options, guildId) {
        const commands = await this.read(guildId);
        const existingCommand = commands.cache.find((cmd) => cmd.name === name);

        if (existingCommand)
        return await this.update(existingCommand, commands, description, options);

        console.log(`Created ${name}`);
        await commands.create({ name, description, options });
    }

    async read(guildId) {
        const guild = guildId && await this.client.guilds.fetch(guildId);
        const commands = guild ? guild.commands : this.client.application.commands;
        await commands.fetch();
        return commands;
    }

    async update(existingCommand, commands, description, options) {
        const isDescriptionDifferent = description !== existingCommand.description;
        const isLengthOptionsDifferent = options.length !== existingCommand.options.length;
        const isOptionsDifferent = Utility.optionsDifferent(options, existingCommand.options);

        if (isDescriptionDifferent || isLengthOptionsDifferent || isOptionsDifferent)

        console.log(`→ Updated ${existingCommand.name}`);
        await commands.edit(existingCommand.id, { description, options });
    }

    async delete(name, guildId) {
        const commands = await this.read(guildId);
        const existingCommand = commands.cache.find((cmd) => cmd.name === name);

        if (!existingCommand) return;

        console.log(`→ Deleted ${name}`);
        await existingCommand.delete();
    }

}

export default Slash;