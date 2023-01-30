import { Schema, model } from "mongoose";

const GiveawayDB = new Schema({
    GuildID: String,
    ChannelID: String,
    MessageID: String,
    Winners: Number,
    Prize: String,
    EndTime: String,
    Paused: Boolean,
    Ended: Boolean,
    HostedBy: String,
    Entered: [String]
});

export default model["GiveawayDB"] || model("GiveawayDB", GiveawayDB);
