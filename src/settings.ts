import  {workspace} from 'vscode';

export var Mappings : string = "thunder.mappings";
export var MaxInterval: string = "thunder.maxInterval";
export var DebugMode: string = "thunder.debugMode";


export function Get(settingName : string){
    return workspace.getConfiguration("").get(settingName);
   
}
