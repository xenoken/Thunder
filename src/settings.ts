import  {workspace} from 'vscode';

export let Mappings : string = "thunder.mappings";
export let MaxInterval: string = "thunder.maxInterval";
export let DebugMode: string = "thunder.debugMode";


export function Get(settingName : string){
    return workspace.getConfiguration("").get(settingName);
   
}
