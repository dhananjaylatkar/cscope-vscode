import * as vscode from "vscode";
import { cmd_run } from "./utils";

export async function build() {
  const config = vscode.workspace.getConfiguration("cscope-vscode");
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const build_script: string | undefined = config.get("build_script");
  const args = config.get("build_args");
  const bin = config.get("bin");
  let cmd: string;

  if (!workspaceFolders) {
    return;
  }

  if (!build_script || build_script === "none") {
    cmd = `${bin} ${args}`;
  } else {
    cmd = build_script;
  }

  for (const ws of workspaceFolders) {
    await cmd_run(cmd, ws.uri.fsPath);
    vscode.window.showInformationMessage(
      `cscope db build completed for ${ws.uri.fsPath}`
    );
  }
}
