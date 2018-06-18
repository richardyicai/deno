// Copyright 2018 Ryan Dahl <ry@tinyclouds.org>
// All rights reserved. MIT License.

import * as ts from "typescript";

interface DocEntry {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  constructors?: DocEntry[];
  parameters?: DocEntry[];
  returnType?: string;
}

interface Data {
  checker: ts.TypeChecker;
  stage: number;
  entries: DocEntry[];
}

const visitors = {
  ImportDeclaration(this: Data, node: ts.Node) {

  },
  ClassDeclaration(this: Data, node: ts.Node) {
    if (this.stage === 1 && !isNodeExported(node)) {
      return;
    }
  }
};

function gen(rootFile: string, options: ts.CompilerOptions): DocEntry[] {
  const program = ts.createProgram([rootFile], options);

  const data: Data = {
    checker: program.getTypeChecker(),
    stage: 1,
    entries: []
  };

  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Each documentation should contain all the exported things
      // including classes, functions, interfaces and so on...
      // However a developer might use some private type in an
      // exported function/class and we should put those types in
      // doc too.
      //
      // Due to this fact we iterate source code twice.
      // First find and extract all the exported stuff.
      // Also in this step we're going to collect name of used
      // types/interfaces.
      ts.forEachChild(sourceFile, visit);
      data.stage += 1; // == 2
      // Now in this last step we extract info about un-exported
      // types/interfaces which are present in source code based
      // on information we've collected in first step.
      ts.forEachChild(sourceFile, visitPrivate);
    }
  }

  return data.entries;

  function visit(node: ts.Node) {
    // tslint:disable-next-line:no-any
    const kind = (ts as any).SyntaxKind[node.kind];
    if (visitors[kind]) {
      visitors[kind].call(data, node);
    }
  }

  function visitPrivate(node: ts.Node) {
    // TODO
  }
}

// Some utility functions to work with AST.

//  True if this is visible outside this file, false otherwise.
function isNodeExported(node: ts.Node): boolean {
  return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
}

// tslint:disable-next-line:no-require-imports
gen("./testdata/file.ts", require("./tsconfig.json"));
