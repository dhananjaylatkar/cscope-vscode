import * as vscode from "vscode";
import { cmd_run, get_word } from "./utils";

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

export enum CsOps {
  symbol = 0,
  global = 1,
  called = 2,
  calling = 3,
  text = 4,
  egrep = 6,
  file = 7,
  include = 8,
  assignments = 9,
}

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

async function get_output(sym: string, op: CsOps): Promise<CsWsResult[]> {
  let res: CsWsResult[] = [];
  if (sym === "") {
    return res;
  }

  const config = vscode.workspace.getConfiguration("cscope-vscode");
  const bin = config.get("bin");

  let cmd = `${bin} -dL -${op} ${sym}`;
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

export async function run(
  sym: string | null,
  op: CsOps
): Promise<CsWsResult[] | null> {
  let _sym: string | null = sym === null ? get_word() : sym;

  if (!_sym) {
    return null;
  }

  console.debug(`sym="${_sym}" op="${op}"`);
  let out = await get_output(_sym, op);
  console.debug(out);
  return out;
}
