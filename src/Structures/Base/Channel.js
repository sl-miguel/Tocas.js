import { Collection } from "discord.js";
import ChannelDB from "../Schemas/ChannelDB.js";

class Channel {

    constructor() {
        this.channels = new Collection();
    }

    async add(guildId, commandName, channelId) {
        const uid = `${guildId}-${commandName}`;
        const result = await ChannelDB.findOneAndUpdate({ Id: uid }, { Id: uid, $addToSet: { Channels: channelId } }, { upsert: true, new: true });
        this.channels.set(uid, result.Channels)
        return result.Channels;
    }

    async remove(guildId, commandName, channelId) {
        const uid = `${guildId}-${commandName}`;
        const result = await ChannelDB.findOneAndUpdate({ Id: uid }, { Id: uid, $pull: { Channels: channelId } }, { upsert: true, new: true });
        this.channels.set(uid, result.Channels)
        return result.Channels;
    }

    async getAvailableChannels(guildId, commandName) {
        const uid = `${guildId}-${commandName}`;
        let channels = this.channels.get(uid);

        if (!channels) {
            console.log('Fetching channels from database');
            const results = await ChannelDB.findOne({ Id: uid });
            channels = results ? results.Channels : [];
            this.channels.set(uid, channels);
        }

        return channels;
    }

}

export default Channel;