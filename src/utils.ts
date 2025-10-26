import { exec } from "child_process";
import * as vscode from "vscode";

export function cmd_run(command: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });
}

export function get_word(): string | null {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return null;
  }

  const document = editor.document;
  const selection = editor.selection;

  let word: string;

  // Check if there is a selection (non-empty range)
  if (!selection.isEmpty) {
    // Get the selected text
    word = document.getText(selection);
  } else {
    // No selection, get word under cursor
    const position = selection.active;
    const wordRange = document.getWordRangeAtPosition(position);

    if (wordRange) {
      word = document.getText(wordRange);
    } else {
      return null;
    }
  }

  return word;
}
