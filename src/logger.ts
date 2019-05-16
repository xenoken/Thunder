import * as Settings from "./settings"

export function SafeLog(message: string) {
    if (Settings.Get(Settings.DebugMode) as boolean) {
        console.log(message);
    }
}
