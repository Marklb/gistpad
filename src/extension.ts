import * as vscode from "vscode";
import { registerCommands } from "./commands";
import { registerCommentController } from "./comments";
import { registerFileSystemProvider } from "./fileSystem";
import { log } from "./logger";
import { registerPlaygroundContentProvider } from "./playgrounds/contentProvider";
import { registerRepoModule } from "./repos";
import { store } from "./store";
import { refreshShowcase } from "./store/actions";
import { initializeAuth } from "./store/auth";
import { initializeStorage } from "./store/storage";
import { registerTreeProvider } from "./tree";
import { registerTreeProvider as registerActiveGistTreeProvider } from "./tree/activeGist";
import { registerTreeProvider as registerShowcaseTreeProvider } from "./tree/showcase";
import { registerProtocolHander } from "./uriHandler";
import { getGistWorkspaceId, isGistWorkspace, openGistFiles } from "./utils";

export async function activate(context: vscode.ExtensionContext) {
  log.setLoggingChannel(vscode.window.createOutputChannel("GistPad"));

  registerCommands(context);
  registerCommentController();
  registerFileSystemProvider(store);
  registerPlaygroundContentProvider();
  registerProtocolHander();
  registerTreeProvider(store, context);
  registerActiveGistTreeProvider(store, context);

  if (isGistWorkspace()) {
    const gistId = getGistWorkspaceId();
    openGistFiles(gistId);
  }

  initializeStorage(context);
  initializeAuth();

  registerRepoModule(context);

  registerShowcaseTreeProvider(store, context);
  refreshShowcase();
}
