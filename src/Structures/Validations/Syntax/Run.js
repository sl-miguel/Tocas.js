import Validation from "../../Base/Validation.js";
import Tracer from "../../Utililites/Tracer.js";

class Run extends Validation {

    constructor() {
        super();
        this.name = 'Run method is required';
        this.description = 'Checks if run is Implemented';
    }

    run(command) {
        const stringFunction = command.run.toString();
        const [, match] = stringFunction.match(/{([\s\S]*)}/m);
        const isEmpty = !match.trim();

        if (isEmpty) Tracer.error(`Command ${command.constructor.name}.js can't have a empty method run()`);
    }

}

export default Run;