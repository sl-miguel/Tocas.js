import { Schema, model } from "mongoose";

const ClientDB = new Schema({
    Client: Boolean,
    Memory: Array,
});

export default model["ClientDB"] || model("ClientDB", ClientDB);