import * as vscode from "vscode";
import { cmd_run } from "./utils";

type CsResult = {
  fname: string;
  ctx: string;
  lnum: number;
  text: string;
};

type CsWsResult = {
  ws: vscode.WorkspaceFolder;
  res: CsResult[];
};

type CsOperation = number;

export const ops: { [key: string]: CsOperation } = {
  symbol: 0,
  global: 1,
  called: 2,
  calling: 3,
  text: 4,
  egrep: 6,
  file: 7,
  include: 8,
  assignments: 9,
};

function parse_lines(out: string): CsResult[] {
  let res: CsResult[] = [];
  if (out === "") {
    return res;
  }

  const lines = out.split("\n");

  for (const line of lines) {
    if (line === "") {
      continue;
    }

    const contents = line.split(" ");
    let ctx = contents[1];

    if (ctx.startsWith("<")) {
      ctx = `<${ctx}>`;
    } else {
      ctx = `<<${ctx}>>`;
    }

    res.push({
      fname: contents[0],
      ctx: ctx,
      lnum: +contents[2],
      text: contents.slice(3).join(" "),
    });
  }

  return res;
}

async function get_output(sym: string, op: number): Promise<CsWsResult[]> {
  let res: CsWsResult[] = [];
  if (sym === "") {
    return res;
  }

  let cmd = `cscope -dL -${op} ${sym}`;
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    return res;
  }

  console.debug(`cmd="${cmd}"`);

  for (const ws of workspaceFolders) {
    const out = await cmd_run(cmd, ws.uri.fsPath);
    res.push({
      ws: ws,
      res: parse_lines(out),
    });
  }

  return res;
}

function get_sym_under_cursor(): string {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return "";
  }

  const document = editor.document;
  const selection = editor.selection;

  let sym: string;

  // Check if there is a selection (non-empty range)
  if (!selection.isEmpty) {
    // Get the selected text
    sym = document.getText(selection);
  } else {
    // No selection, get word under cursor
    const position = selection.active;
    const wordRange = document.getWordRangeAtPosition(position);

    if (wordRange) {
      sym = document.getText(wordRange);
    } else {
      return "";
    }
  }

  return sym;
}

export async function run(sym: string | null, op: CsOperation) {
  let _sym: string = sym === null ? get_sym_under_cursor() : sym;

  console.debug(`sym="${_sym}" op="${op}"`);
  let out = await get_output(_sym, op);
  console.debug(out);
  return out;
}
