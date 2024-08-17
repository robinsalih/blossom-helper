import * as blossom from "./game";
import * as strategy from "./strategy";

const game = new blossom.BlossomGame('I', ['N', 'U', 'S', 'P', 'G', 'H']);

const words = [
    'pushing',
    'punishing',
    'pinning',
    'gigging',
    'spinning',
    'shipping',
    'supping',
    'unhinging',
    'shunning',
    'hushing',
    'shushing',
    'sussing',
    'singing',
    'phishing',
    'issuing',
    'pipping',
    'shishing',
    'pipings',
    'hugging',
];

const helper = new strategy.StrategyHelper();

runForStrategy("Simple strategy", new strategy.SimpleStrategy(helper));
runForStrategy("Petal brute force strategy", new strategy.PetalBruteForceStrategy(helper));

function runForStrategy(name: string, strategy: strategy.IStrategy) {
    console.log(`${name}: `);
    const results = strategy.getMovesForGame(game, words);
    results.forEach(result => console.log(`\t${result.petal}: ${result.firstWord.word} (${result.firstWord.score}), ${result.secondWord.word} (${result.secondWord.score})`));
    console.log();
    const total = results.map(r => r.firstWord.score + r.secondWord.score).reduce((sum, current) => sum + current, 0);
    console.log(`\tTotal: ${total}`);
    console.log();
}

