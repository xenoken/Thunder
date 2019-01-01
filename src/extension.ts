// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

import { workspace, TextEditor, window, ExtensionContext, Range, TextEditorSelectionChangeKind } from 'vscode';


var ThunderMaxIntervalMS: number = 200;
var ThunderMappings: Array<Array<string>> = [];
var ThunderDebugMode: boolean = false;

const SETTING_THUNDER_MAPPINGS = "thunder.mappings";
const SETTING_THUNDER_MAXINTERVAL = "thunder.maxInterval";
const SETTING_THUNDER_DEBUGMODE = "thunder.debugMode";

function log(message: string) {
    if (ThunderDebugMode) {
        console.log(message);
    }
}


function GatherSettingDebugMode() {
    log("Thunder: Reading 'DebugMode'.");

    let debugMode: boolean | undefined = workspace.getConfiguration("").get(SETTING_THUNDER_DEBUGMODE);
    if (debugMode != undefined && ThunderDebugMode != debugMode) {
        ThunderDebugMode = debugMode;
    }

}


function GatherSettingMappings() {
    log("Thunder: Reading 'Mappings'.");
    let mappings: Array<Array<string>> | undefined = workspace.getConfiguration("").get(SETTING_THUNDER_MAPPINGS);
    if (mappings != undefined && ThunderMappings != mappings) {
        ThunderMappings = mappings;
    }
}

function GatherSettingMaxIntervals() {
    log("Thunder: Reading 'MaxIntervalMS'.");
    // check if the relevant settings were changed.
    let interval: number | undefined = workspace.getConfiguration("").get(SETTING_THUNDER_MAXINTERVAL);
    if (interval != undefined && interval != ThunderMaxIntervalMS && interval >= 0) {
        if (interval >= 0) {

            ThunderMaxIntervalMS = interval;
        }
        else {

            log("Thunder: the setting 'MaxInterval' cannot be less than 0");
        }
    }
}



function GatherSettings() {
    GatherSettingDebugMode();
    GatherSettingMaxIntervals();
    GatherSettingMappings();
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    log("Thunder: Extension Activated.");


    var _lastTypedCharacter: String | undefined;
    var _lastTypedCharacterTimestampMS: number | undefined = undefined;

    GatherSettings();

    var subOnDidChangeConfiguration = workspace.onDidChangeConfiguration(e => {
        // the configuration was changed.
        log("Thunder: Configuration was changed.");
        // on configuration changed.
        if (e.affectsConfiguration(SETTING_THUNDER_MAXINTERVAL)) {
            GatherSettingMaxIntervals();
        }
        else if (e.affectsConfiguration(SETTING_THUNDER_MAPPINGS)) {
            GatherSettingMappings();
        }
        else if (e.affectsConfiguration(SETTING_THUNDER_DEBUGMODE)) {
            GatherSettingDebugMode();
        }
    });


    function isTracked(text: string): string | null {

        if (ThunderMappings != null || ThunderMappings != undefined) {
            var count = ThunderMappings.length;
            for (let index = 0; index < count; index++) {
                const pair = ThunderMappings[index];
                if (pair[0] == text) return pair[1];

            }
        }

        return null;
    }

    let _curTextEditor: TextEditor | undefined = undefined;
    let subOnDidChangedTextEditor = window.onDidChangeActiveTextEditor((editor: TextEditor | undefined) => {


        // if the new 
        if (!_curTextEditor) {
            log("Thunder: text editor was changed - tracking first text editor.");
            _curTextEditor = editor;
        }
        else {
            if (_curTextEditor != editor) {
                if (editor === undefined){
                    log("Thunder: text editor was changed - null editor");
                }
                else{
                    log("Thunder: text editor was changed - tracking new text editor.");
                }
                // swap the editors 
                _curTextEditor = editor;
                // reset versions
                _lastTextEditorDocVersion = -1;
                // reset timestamps
                _lastTypedCharacterTimestampMS = undefined;
                _lastTypedCharacter = undefined;
            }
        }


    });

    let _lastTextEditorDocVersion: number = -1;

    var subOnDidChangeTextEditorSelection = window.onDidChangeTextEditorSelection(function (event) {
        if (event.kind == TextEditorSelectionChangeKind.Keyboard) {

            //let _trackedCharPressedNow = false;
            var cur_timestampMS: number | undefined = undefined;

            let _curTextEditorDocVersion = event.textEditor.document.version;

            if (_lastTextEditorDocVersion < 0) {
                // start tracking versions
                _lastTextEditorDocVersion = _curTextEditorDocVersion;
            }

            if (_lastTextEditorDocVersion < _curTextEditorDocVersion) { // an actual text change was made.
                log("Thunder: New Text change detected");

                // go back to the previous caret position.
                var backpos = event.selections[0].start.translate(0, -1);
                // keep current caret position.
                var currentpos = event.selections[0].end;
                // create range from prev pos to current pos.
                let range = new Range(backpos, currentpos);
                // get text in range.
                let text = event.textEditor.document.getText(range);


                // did the user pressed a tracked character?
                // P.S the isTracked function returns the replacer if text is a tracked string..
                let _tracked = isTracked(text);

                if (_tracked != null) {
                    //  _trackedCharPressedNow = true;
                    cur_timestampMS = new Date().getTime();


                    // if (text == "2") {
                    // }

                    let timeRequirementSatisfied = (_lastTypedCharacterTimestampMS != null &&
                        _lastTypedCharacterTimestampMS != undefined &&
                        cur_timestampMS != undefined &&
                        cur_timestampMS - _lastTypedCharacterTimestampMS < ThunderMaxIntervalMS);

                    // tracked character was pressed now and before?
                    if (_lastTypedCharacter == text && timeRequirementSatisfied) {
                        event.textEditor.edit(function (builder) {
                            // insert the double quotes.
                            var replacedRange = new Range(range.start.translate(0, -1), range.end);
                            // execute.
                            // builder.replace(replacedRange, "\"");
                            builder.replace(replacedRange, _tracked as string)



                        });


                    }


                    // a tracked character was pressed. so we can save the timestamp.
                    _lastTypedCharacterTimestampMS = cur_timestampMS;
                    _lastTypedCharacter = text;

                }
                else {
                    // a character was pressed but it is not a tracked character.
                    _lastTypedCharacterTimestampMS = undefined;
                    _lastTypedCharacter = undefined;
                }

            }

            _lastTextEditorDocVersion = _curTextEditorDocVersion;
        }
    })



    context.subscriptions.push(subOnDidChangeConfiguration);
    context.subscriptions.push(subOnDidChangedTextEditor);
    context.subscriptions.push(subOnDidChangeTextEditorSelection);
}

// this method is called when your extension is deactivated
export function deactivate() {

}

