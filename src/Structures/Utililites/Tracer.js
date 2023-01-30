import chalk from "chalk";

class Tracer {

    static error(message) {
        console.log(chalk.red(message));
        process.exit();
    }

    static info(message) {
        console.log(chalk.blueBright(message));
    }

}

export default Tracer;