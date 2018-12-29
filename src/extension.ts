// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';
import { workspace, window, ExtensionContext, Range, TextEditorSelectionChangeKind } from 'vscode';


//const vscode = require('vscode');
const TelemetryReporter = require('vscode-extension-telemetry');

// all events will be prefixed with this event name
const extensionId = 'Thunder'; //'<your extension unique name>';

// extension version will be reported as a property with each event 
const extensionVersion = '0.1.0'; //'<your extension version>'; 

// the application insights key (also known as instrumentation key)
const key = CreaChiave();

// telemetry reporter 
let reporter: any;


var ThunderMaxIntervalMS: number = 200;
var ThunderMappings: Array<Array<string>> = [];
const SETTING_THUNDER_MAPPINGS = "thunder.mappings";
const SETTING_THUDER_MAXINTERVAL = "thunder.maxInterval";

function CreaChiave() : string{
    return '8378d290-7a43-4741-b935-23d2fdafb4b7';
}

function GatherSettingMappings() {
    console.log("Thunder: Reading 'Mappings'.");
    let mappings: Array<Array<string>> | undefined = workspace.getConfiguration("").get(SETTING_THUNDER_MAPPINGS);
    if (mappings != undefined && ThunderMappings != mappings) {
        ThunderMappings = mappings;
    }
}

function GatherSettingMaxIntervals() {
    console.log("Thunder: Reading 'MaxIntervalMS'.");
    // check if the relevant settings were changed.
    let interval: number | undefined = workspace.getConfiguration("").get(SETTING_THUDER_MAXINTERVAL);
    if (interval != undefined && interval != ThunderMaxIntervalMS && interval >= 0) {
        if (interval >= 0) {

            ThunderMaxIntervalMS = interval;
        }
        else {

            console.log("Thunder: the setting 'MaxInterval' cannot be less than 0")
        }
    }
}

function GatherSettings() {

    GatherSettingMaxIntervals();
    GatherSettingMappings();
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    console.log("Thunder: Extension Activated.");

    // create telemetry reporter on extension activation
    reporter = new TelemetryReporter(extensionId, extensionVersion, key);
    // ensure it gets property disposed
    context.subscriptions.push(reporter);


    // send event any time after activation
    // reporter.sendTelemetryEvent('sampleEvent', { 'stringProp': 'some string' }, { 'numericMeasure': 123});
    reporter.sendTelemetryEvent('thunder.activation', {});


    var last_text: String | undefined;
    var last_timestampMS: number | undefined = undefined;

    GatherSettings();

    var removanda2 = workspace.onDidChangeConfiguration(e => {
        // the configuration was changed.
        //console.log("Thunder: Configuration was changed.");
        // on configuration changed.
        if (e.affectsConfiguration(SETTING_THUDER_MAXINTERVAL)) {
            reporter.sendTelemetryEvent('thunder.settingchanged.maxinterval', {});
            GatherSettingMaxIntervals();
        }
        else if (e.affectsConfiguration(SETTING_THUNDER_MAPPINGS)) {
            reporter.sendTelemetryEvent('thunder.settingchanged.mappings', {});
            GatherSettingMappings();
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

    var removanda = window.onDidChangeTextEditorSelection(function (event) {
        if (event.kind == TextEditorSelectionChangeKind.Keyboard) {

            //let _trackedCharPressedNow = false;
            var cur_timestampMS: number | undefined = undefined;



            // go back to the previous caret position.
            var backpos = event.selections[0].start.translate(0, -1);
            // keep current caret position.
            var currentpos = event.selections[0].end;
            // create range from prev pos to current pos.
            let range = new Range(backpos, currentpos);
            // get text in range.
            let text = event.textEditor.document.getText(range);


            // did the user pressed a tracked character?
            let _tracked = isTracked(text);

            if (_tracked != null) {
                //  _trackedCharPressedNow = true;
                cur_timestampMS = new Date().getTime();


                // if (text == "2") {
                // }

                let timeRequirementSatisfied = (last_timestampMS != null &&
                    last_timestampMS != undefined &&
                    cur_timestampMS != undefined &&
                    cur_timestampMS - last_timestampMS < ThunderMaxIntervalMS);

                // tracked character was pressed now and before?
                if (last_text == text && timeRequirementSatisfied) {
                    event.textEditor.edit(function (builder) {
                        // insert the double quotes.
                        var replacedRange = new Range(range.start.translate(0, -1), range.end);
                        // execute.
                        // builder.replace(replacedRange, "\"");
                        builder.replace(replacedRange, _tracked as string)



                    }).then(function () {
                        // DEBUG
                        //console.log("Thunder: -i:" + text + " -o:" + _tracked as string);
                    });


                }


                // a tracked character was pressed. so we can save the timestamp.
                last_timestampMS = cur_timestampMS;
                last_text = text;

            }
            else {
                // a character was pressed but it is not a tracked character.
                last_timestampMS = undefined;
                last_text = undefined;
            }

        }
    })



    context.subscriptions.push(removanda2);
    // context.subscriptions.push(disposable);
    context.subscriptions.push(removanda);
}

// this method is called when your extension is deactivated
export function deactivate() {
    reporter.sendTelemetryEvent('thunder.deactivation', {});
    // This will ensure all pending events get flushed
    reporter.dispose();
}

// TELEMETRY


