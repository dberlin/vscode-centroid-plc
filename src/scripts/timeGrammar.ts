import {
  ANTLRErrorListener,
  ANTLRInputStream,
  BailErrorStrategy,
  CharStreams,
  CommonTokenStream,
  DiagnosticErrorListener,
  Parser,
  ParserErrorListener,
  ParserRuleContext,
  RecognitionException,
  Recognizer,
  Token,
  TokenStream,
} from "antlr4ts";
import { ATN } from "antlr4ts/atn/ATN";
import { ATNConfigSet } from "antlr4ts/atn/ATNConfigSet";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { PredictionContextCache } from "antlr4ts/atn/PredictionContextCache";
import { PredictionMode } from "antlr4ts/atn/PredictionMode";
import { SimulatorState } from "antlr4ts/atn/SimulatorState";
import { DFA } from "antlr4ts/dfa/DFA";
import { DFAState } from "antlr4ts/dfa/DFAState";
import { BitSet } from "antlr4ts/misc/BitSet";
import { Interval } from "antlr4ts/misc/Interval";
import * as fs from "fs";
import * as path from "path";
import { CentroidPLCLexer } from "../CentroidPLCLexer";
import { CentroidPLCParser } from "../CentroidPLCParser";
const testFilePath =
  process.argv[2] ||
  "/Users/dannyb/Dropbox/sources/vscode/centroid-plc-language/testfiles/";

class TestPerformance {
  public static REPORT_AMBIGUITIES = true;
  public static REPORT_FULL_CONTEXT = true;
  public static COMPUTE_TRANSITION_STATS = true;
  public static REPORT_CONTEXT_SENSITIVITY = true;
  public static REPORT_DETAILED_DFA_STATS = true;
  public static DETAILED_DFA_STATE_STATS = true;
}
class StatisticsParserATNSimulator extends ParserATNSimulator {
  public decisionInvocations: Uint32Array;
  public fullContextFallback: Uint32Array;
  public nonSll: Uint32Array;
  public totalTransitions: Uint32Array;
  public computedTransitions: Uint32Array;
  public fullContextTransitions: Uint32Array;

  private decision: number;

  constructor(atn: ATN, parser: Parser) {
    super(atn, parser);
    this.decisionInvocations = new Uint32Array(atn.decisionToState.length);
    this.fullContextFallback = new Uint32Array(atn.decisionToState.length);
    this.nonSll = new Uint32Array(atn.decisionToState.length);
    this.totalTransitions = new Uint32Array(atn.decisionToState.length);
    this.computedTransitions = new Uint32Array(atn.decisionToState.length);
    this.fullContextTransitions = new Uint32Array(atn.decisionToState.length);
    this.decision = -1;
  }

  public adaptivePredict(
    input: TokenStream,
    decision: number,
    outerContext: ParserRuleContext,
  ): number;
  public adaptivePredict(
    input: TokenStream,
    decision: number,
    outerContext: ParserRuleContext,
    useContext: boolean,
  ): number;

  public adaptivePredict(
    input: TokenStream,
    decision: number,
    outerContext: ParserRuleContext,
    useContext?: boolean,
  ): number {
    if (useContext === undefined) {
      try {
        this.decision = decision;
        this.decisionInvocations[decision]++;
        return super.adaptivePredict(input, decision, outerContext);
      } finally {
        this.decision = -1;
      }
    } else {
      if (useContext) {
        this.fullContextFallback[decision]++;
      }

      return super.adaptivePredict(input, decision, outerContext, useContext);
    }
  }

  protected getExistingTargetState(
    previousD: DFAState,
    t: number,
  ): DFAState | undefined {
    this.totalTransitions[this.decision]++;
    return super.getExistingTargetState(previousD, t);
  }

  protected computeTargetState(
    dfa: DFA,
    s: DFAState,
    remainingGlobalContext: ParserRuleContext,
    t: number,
    useContext: boolean,
    contextCache: PredictionContextCache,
  ): [DFAState, ParserRuleContext | undefined] {
    this.computedTransitions[this.decision]++;
    return super.computeTargetState(
      dfa,
      s,
      remainingGlobalContext,
      t,
      useContext,
      contextCache,
    );
  }

  protected computeReachSet(
    dfa: DFA,
    previous: SimulatorState,
    t: number,
    contextCache: PredictionContextCache,
  ): SimulatorState | undefined {
    if (previous.useContext) {
      this.totalTransitions[this.decision]++;
      this.computedTransitions[this.decision]++;
      this.fullContextTransitions[this.decision]++;
    }

    return super.computeReachSet(dfa, previous, t, contextCache);
  }
}

class DescriptiveErrorListener implements ParserErrorListener {
  public static INSTANCE: DescriptiveErrorListener = new DescriptiveErrorListener();

  public syntaxError<T extends Token>(
    recognizer: Recognizer<T, any>,
    offendingSymbol: T | undefined,
    line: number,
    charPositionInLine: number,
    msg: string,
    e: RecognitionException | undefined,
  ): void {
    const inputStream = recognizer.inputStream;
    let sourceName: string = inputStream != null ? inputStream.sourceName : "";
    if (sourceName.length > 0) {
      sourceName = `${sourceName}:${line}:${charPositionInLine}: `;
    }

    console.error(
      sourceName + "line " + line + ":" + charPositionInLine + " " + msg,
    );
  }
}

class DescriptiveLexerErrorListener implements ANTLRErrorListener<number> {
  public static INSTANCE: DescriptiveLexerErrorListener = new DescriptiveLexerErrorListener();

  public syntaxError<T extends number>(
    recognizer: Recognizer<T, any>,
    offendingSymbol: T | undefined,
    line: number,
    charPositionInLine: number,
    msg: string,
    e: RecognitionException | undefined,
  ): void {
    const inputStream = recognizer.inputStream;
    let sourceName: string = inputStream != null ? inputStream.sourceName : "";
    if (sourceName.length > 0) {
      sourceName = `${sourceName}:${line}:${charPositionInLine}: `;
    }

    process.stderr.write(
      sourceName + "line " + line + ":" + charPositionInLine + " " + msg,
    );
  }
}

class SummarizingDiagnosticErrorListener extends DiagnosticErrorListener {
  private _sllConflict: BitSet | undefined;
  private _sllConfigs: ATNConfigSet = new ATNConfigSet();
  public reportAmbiguity(
    recognizer: Parser,
    dfa: DFA,
    startIndex: number,
    stopIndex: number,
    exact: boolean,
    ambigAlts: BitSet | undefined,
    configs: ATNConfigSet,
  ): void {
    if (1) {
      const sllPredictions: BitSet = this.getConflictingAlts(
        this._sllConflict,
        this._sllConfigs,
      );
      const sllPrediction: number = sllPredictions.nextSetBit(0);
      const llPredictions: BitSet = this.getConflictingAlts(ambigAlts, configs);
      const llPrediction: number =
        llPredictions.cardinality() === 0
          ? ATN.INVALID_ALT_NUMBER
          : llPredictions.nextSetBit(0);
      if (sllPrediction !== llPrediction) {
        (recognizer.interpreter as StatisticsParserATNSimulator).nonSll[
          dfa.decision
        ]++;
      }
    }

    if (!TestPerformance.REPORT_AMBIGUITIES) {
      return;
    }

    // show the rule name along with the decision
    const decision: number = dfa.decision;
    const rule: string = recognizer.ruleNames[dfa.atnStartState.ruleIndex];
    const input: string = recognizer.inputStream.getText(
      Interval.of(startIndex, stopIndex),
    );
    recognizer.notifyErrorListeners(
      `reportAmbiguity d=${decision} (${rule}): ambigAlts=${ambigAlts}, input='${input}'`,
    );
  }

  public reportAttemptingFullContext(
    recognizer: Parser,
    dfa: DFA,
    startIndex: number,
    stopIndex: number,
    conflictingAlts: BitSet | undefined,
    conflictState: SimulatorState,
  ): void {
    this._sllConflict = conflictingAlts;
    this._sllConfigs = conflictState.s0.configs;
    if (!TestPerformance.REPORT_FULL_CONTEXT) {
      return;
    }

    // show the rule name and viable configs along with the base info
    const decision: number = dfa.decision;
    const rule: string = recognizer.ruleNames[dfa.atnStartState.ruleIndex];
    const input: string = recognizer.inputStream.getText(
      Interval.of(startIndex, stopIndex),
    );
    const representedAlts: BitSet = this.getConflictingAlts(
      conflictingAlts,
      conflictState.s0.configs,
    );
    recognizer.notifyErrorListeners(
      `reportAttemptingFullContext d=${decision} (${rule}), input='${input}', viable=${representedAlts}`,
    );
  }

  public reportContextSensitivity(
    recognizer: Parser,
    dfa: DFA,
    startIndex: number,
    stopIndex: number,
    prediction: number,
    acceptState: SimulatorState,
  ): void {
    if (
      TestPerformance.COMPUTE_TRANSITION_STATS &&
      TestPerformance.DETAILED_DFA_STATE_STATS
    ) {
      const sllPredictions: BitSet = this.getConflictingAlts(
        this._sllConflict,
        this._sllConfigs,
      );
      const sllPrediction: number = sllPredictions.nextSetBit(0);
      if (sllPrediction !== prediction) {
        (recognizer.interpreter as StatisticsParserATNSimulator).nonSll[
          dfa.decision
        ]++;
      }
    }

    if (!TestPerformance.REPORT_CONTEXT_SENSITIVITY) {
      return;
    }

    // show the rule name and viable configs along with the base info
    const decision: number = dfa.decision;
    const rule: string = recognizer.ruleNames[dfa.atnStartState.ruleIndex];
    const input: string = recognizer.inputStream.getText(
      Interval.of(startIndex, stopIndex),
    );
    recognizer.notifyErrorListeners(
      `reportContextSensitivity d=${decision} (${rule}), input='${input}', viable={${prediction}}`,
    );
  }
}
// Create the lexer and parser
let lexer;
let parser;
for (const fileName of fs.readdirSync(testFilePath)) {
  const docBuffer = fs.readFileSync(path.join(`${testFilePath}/${fileName}`));
  const inputStream = CharStreams.fromString(docBuffer.toString());
  if (!lexer) {
    lexer = new CentroidPLCLexer(inputStream);
  }
  lexer.inputStream = inputStream;
  const tokenStream = new CommonTokenStream(lexer);

  parser = new CentroidPLCParser(tokenStream);
  // parser.errorHandler = new BailErrorStrategy();
  // parser.interpreter.setPredictionMode(PredictionMode.SLL);
  /*  parser.addErrorListener(DescriptiveErrorListener.INSTANCE);
    parser.addErrorListener(new SummarizingDiagnosticErrorListener());
    parser.interpreter = new StatisticsParserATNSimulator(parser.atn, parser);*/
  parser.inputStream = tokenStream;
  console.time(`Parsing ${fileName}`);
  try {
    parser.plcProgram();
  } catch (err) {
    console.error(`Error parsing ${fileName}: ${err}`);
  }
  // console.error(tree.toStringTree(parser));

  console.timeEnd(`Parsing ${fileName}`);
}
