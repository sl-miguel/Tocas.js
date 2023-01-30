import { Collection } from "discord.js";
import CooldownDB from '../Schemas/CooldownDB.js'

const cooldownDurations = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24
}

const cooldownTypes = ["perUser", "perUserPerGuild", "perGuild", "global"];

class Cooldowns {

    constructor(settings) {
        this.settings = settings;
        this.cooldowns = new Collection();
        this.error = 'Please wait {TIME} ';
        this.load();
    }

    async load() {
        await CooldownDB.deleteMany({ Expires: { $lt: new Date() } });
        const results = await CooldownDB.find({});

        for (const result of results) {
            const { Id, Expires } = result;
            this.cooldowns.set(Id, Expires);
        }
    }

    async update(cooldownUsage, expires) {
        const { cooldownType, userId, actionId, guildId } = cooldownUsage;
        const key = this.getKey(cooldownType, userId, actionId, guildId);
        this.cooldowns.set(key, expires);

        const now = new Date();
        const difference = (expires.getTime() - now.getTime()) / 1000;

        if (difference > this.settings.COOLDOWN.THRESHOLD) {
            await CooldownDB.findOneAndUpdate({ Id: key }, { Id: key, Expires: expires }, { upsert: true });
        }
    }

    async delete(cooldownUsage) {
        const { cooldownType, userId, actionId, guildId } = cooldownUsage;
        const key = this.getKey(cooldownType, userId, actionId, guildId);
        this.cooldowns.delete(key);
        await CooldownDB.deleteOne({ Id: key });
    }

    verify(duration) {

        if (typeof duration === 'number') return duration;

        const split = duration.split(' ');
        if (split.length !== 2) throw new Error(`Duration ${duration} is an invalid syntax.`);

        const [quantity, type] = split;

        if (!cooldownDurations[type]) throw new Error(`Unknown duration type: ${type}`);
        if (quantity <= 0) throw new Error(`Invalid quantity: ${quantity}`);

        return quantity * cooldownDurations[type];
    }

    getKey(cooldownType, userId, actionId, guildId) {
        const isPerUser = cooldownType === cooldownTypes[0];
        const isPerUserPerGuild = cooldownType === cooldownTypes[1];
        const isPerGuild = cooldownType === cooldownTypes[2];
        const isGlobal = cooldownType === cooldownTypes[3];

        if ((isPerUserPerGuild || isPerGuild) && !guildId)
            throw new Error(`Invalid cooldown type: ${cooldownType} used in dm`);

        if (isPerUser) return `${userId}-${actionId}`;
        if (isPerUserPerGuild) return `${userId}-${guildId}-${actionId}`;
        if (isPerGuild) return `${guildId}-${actionId}`;
        if (isGlobal) return actionId;
    }

    bypass(userId) {
        if (!this.settings.COOLDOWN.BYPASS) return false;
        return this.settings.BOT.OWNERS.includes(userId);
    }

    async start({ cooldownType, userId, actionId, guildId = '', duration }) {

        const canBypass = this.bypass(userId);
        if (canBypass) return;

        if (!cooldownTypes.includes(cooldownType)) throw new Error(`Invalid cooldown type: ${cooldownType}`);

        const seconds = this.verify(duration);
        const key = this.getKey(cooldownType, userId, actionId, guildId);

        const expires = new Date();
        expires.setSeconds(expires.getSeconds() + seconds);

        if (seconds >= this.settings.COOLDOWN.THRESHOLD) {
            await CooldownDB.findOneAndUpdate({ Id: key }, { Id: key, Expires: expires }, { upsert: true });
        }

        this.cooldowns.set(key, expires);
        console.log(this.cooldowns);
    }

    check({ cooldownType, userId, actionId, guildId = '', errorMessage = this.error }) {

        if (this.bypass(userId)) return true;

        const key = this.getKey(cooldownType, userId, actionId, guildId);
        const expires = this.cooldowns.get(key);

        if (!expires) return true;

        const now = new Date();

        if (now > expires) {
            this.cooldowns.delete(key);
            return true;
        }

        const secondsDiff = (expires.getTime() - now.getTime()) / 1000;
        const d = Math.floor(secondsDiff / (3600 * 24));
        const h = Math.floor((secondsDiff % (3600 * 24)) / 3600);
        const m = Math.floor((secondsDiff % 3600) / 60);
        const s = Math.floor(secondsDiff % 60);

        let time = '';
        if (d > 0) time += `${d}d `;
        if (h > 0) time += `${h}h `;
        if (m > 0) time += `${m}m `;
        time += `${s}s`;


        errorMessage = errorMessage.replace('{TIME}', time);
        return errorMessage;
    }

}

export default Cooldowns;