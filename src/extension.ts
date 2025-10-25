// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as find from "./find";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "cscope-vscode" is now active!');

  const commands: vscode.Disposable[] = new Array(
    vscode.commands.registerCommand("cscope-vscode.find.symbol", () => {
      find.run(null, find.ops["symbol"]);
    }),
    vscode.commands.registerCommand("cscope-vscode.find.global", () => {
      find.run(null, find.ops["global"]);
    }),
    vscode.commands.registerCommand("cscope-vscode.find.called", () => {
      find.run(null, find.ops["called"]);
    }),
    vscode.commands.registerCommand("cscope-vscode.find.calling", () => {
      find.run(null, find.ops["calling"]);
    }),
    vscode.commands.registerCommand("cscope-vscode.find.text", () => {
      find.run(null, find.ops["text"]);
    }),
    vscode.commands.registerCommand("cscope-vscode.find.egrep", () => {
      find.run(null, find.ops["egrep"]);
    }),
    vscode.commands.registerCommand("cscope-vscode.find.file", () => {
      find.run(null, find.ops["file"]);
    }),
    vscode.commands.registerCommand("cscope-vscode.find.include", () => {
      find.run(null, find.ops["include"]);
    }),
    vscode.commands.registerCommand("cscope-vscode.find.assignments", () => {
      find.run(null, find.ops["assignments"]);
    })
  );

  context.subscriptions.push(...commands);
}

// This method is called when your extension is deactivated
export function deactivate() {}
