// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

import { TextEditor, window, ExtensionContext, Range, TextEditorSelectionChangeKind } from 'vscode';

import * as settings from './settings';
import * as logger from "./logger";

function isTracked(text: string): string | undefined {

    let mappings = settings.Get(settings.Mappings) as Array<Array<string>>;

    if (mappings != null || mappings != undefined) {
        let count = mappings.length;
        for (let index = 0; index < count; index++) {
            const pair = mappings[index];
            if (pair[0] == text) return pair[1];

        }
    }

    return undefined;
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    logger.SafeLog("Thunder: Extension Activated.");

    let _prevT: number | undefined = undefined;
    let _prev_DocVersion: number = -1;
    let _prevString: string | undefined = undefined;
   

    let subOnDidChangedTextEditor = window.onDidChangeActiveTextEditor((editor: TextEditor | undefined) => {

        
            
                if (editor === undefined) {
                    logger.SafeLog("Thunder: Text Editor Changed: No Valid Editor.");
                }
                else {
                    logger.SafeLog("Thunder: Text Editor Changed: New Text Editor ready.");
                }
               
                // reset versions
                _prev_DocVersion = -1;
                // reset timestamps
                _prevT = undefined;
                // reset character
                _prevString = undefined;
            
        


    });

    async function TryExecuteReplacement( editor:TextEditor,_curChar:string, _curT: number, curCharRange: Range,  _replacer: string | undefined) : Promise<boolean> {
        
        let _onTime = (_prevT != null && _prevT != undefined && _curT != undefined &&
            _curT - _prevT < (settings.Get(settings.MaxInterval) as number));

        if (_onTime){
              // determine the string to be replaced.
              let replacedRange = new Range(curCharRange.start.translate(0, -1), curCharRange.end);
              var result = await editor.edit(function (builder) {
                  // Replace!
                  builder.replace(replacedRange, _replacer as string);
                  // the replacement was done so now reset.          
              });
              logger.SafeLog("Thunder: Replacement executed successfully for the pair: [" + _curChar + " | " + _replacer + "]");
              return result;
        }
        else{
            logger.SafeLog("Thunder: Replacement Opportunity not taken for excessive delay.");
            return false;
        }
       
    }

    var subOnDidChangeTextEditorSelection = window.onDidChangeTextEditorSelection(async function (event) {

        if (event.kind == TextEditorSelectionChangeKind.Keyboard) {

          

            // timestamp of this text change
            let _curT: number | undefined = new Date().getTime();

            // current version of the document.
            let _cur_DocVersion = event.textEditor.document.version;

            // an actual text change was made.
            if (_prev_DocVersion < _cur_DocVersion) {  

                // go back to the previous caret position.
                let backpos = event.selections[0].start.translate(0, -1);
                // keep current caret position.
                let currentpos = event.selections[0].end;
                // create range from prev pos to current pos.
                let curCharRange = new Range(backpos, currentpos);
                // get text in range.
                let _curString = event.textEditor.document.getText(curCharRange);

                
                // did the user pressed a tracked character?
                // P.S the isTracked function returns the replacer if text is a tracked string..
                let _replacer = isTracked(_curString);

                let _isTracked = (_replacer != null);

                let _replaced:boolean = false;

                logger.SafeLog("Thunder: '" +  _curString +  "' was typed."  + (_isTracked ? "it is a tracked character!" : "it is not a tracked character..."));

                if (_isTracked && _prevString != undefined && _prevT != undefined && _prevString === _curString) {
                             // was the tracked character pressed in time?
                             _replaced=  await TryExecuteReplacement(event.textEditor,_curString, _curT, curCharRange, _replacer);                                                                    
            
                }
               
                _prevString = _replaced ? _replacer : _curString;              
                _prevT = _curT;
            }

            _prev_DocVersion = _cur_DocVersion;
        }
    })



    context.subscriptions.push(subOnDidChangedTextEditor);
    context.subscriptions.push(subOnDidChangeTextEditorSelection);

   
}



// this method is called when your extension is deactivated
export function deactivate() {

}

