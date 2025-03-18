import { Command } from './command';

/**
 * Base interface for command handlers
 */
export interface CommandHandler<T extends Command> {
    /**
     * Execute the command and return a result
     */
    execute(command: T): Promise<any>;
}
