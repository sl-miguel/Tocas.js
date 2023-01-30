import { Schema, model } from "mongoose";

const ChannelDB = new Schema({
    Id: String,
    Channels: [String],
});

export default model["ChannelDB"] || model("ChannelDB", ChannelDB);