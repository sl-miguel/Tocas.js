import DisableDB from "../Schemas/DisableDB.js";

class Disable {

    constructor() {
        this.disabled = [];
        this.load();
    }

    async load() {
        const results = await DisableDB.find({});

        for (const result of results) {
            this.disabled.push(result.Id);
        }
    }

    async on(guildId, commandName) {
        if (!this.isOff(guildId, commandName)) return;

        const uid = `${guildId}-${commandName}`;
        this.disabled = this.disabled.filter((id) => id !== uid);
        await DisableDB.deleteOne({ Id: uid });
    }

    async off(guildId, commandName) {
        if (this.isOff(guildId, commandName)) return;

        const uid = `${guildId}-${commandName}`;
        this.disabled.push(uid);

        try {
            // await new DisableDB({ Id: uid }).save()
            await DisableDB.create({ Id: uid })
        }
        catch (ignored) {}

    }

    isOff(guildId, commandName) {
        return this.disabled.includes(`${guildId}-${commandName}`)
    }

}

export default Disable;