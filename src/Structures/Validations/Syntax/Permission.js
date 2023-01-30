import Validation from "../../Base/Validation.js";
import Tracer from "../../Utililites/Tracer.js";

class Permission extends Validation {

    constructor() {
        super();
        this.name = 'Permission is required';
        this.description = 'Checks syntax of permission';
    }

    run(command) {
        if (command.permission.length && command.target.some(element => element !== "GUILD"))
        Tracer.error(`Command ${command.constructor.name}.js is not only a guild command, but permissions are specified.`);
    }
}

export default Permission;