import * as blossom from "./game";
import * as strategy from "./strategy";

const game = new blossom.BlossomGame('I', ['T', 'F', 'N', 'E', 'M', 'R']);

const words = [
    'internment',
    'interfere',
    'fermiere',
    'imminent',
    'intermittent',
    'refinement',
    'remittent',
    'eminent',
    'merriment',
    'merrier',
    'interferer',
    'terrier',
    'refiner',
    'fifteen',
    'nineteen',
    'refitment',
    'fritterer',
    'feinter',
    'infeminine',
    'fifteener',
    'retirement'
];
    

const helper = new strategy.StrategyHelper();

const validator = new blossom.WordEvaluator(game);
var validations = words.map(word => validator.verify(word));
if (validations.some(v => !v.valid))
    throw `Illegal word in list`;

runForStrategy("Simple strategy", new strategy.SimpleStrategy(helper));
runForStrategy("Petal brute force strategy", new strategy.PetalBruteForceStrategy(helper));
runForStrategy("Petal brute force two at a time strategy", new strategy.PetalBruteForceStrategyTwoAtATime(helper));

function runForStrategy(name: string, strategy: strategy.IStrategy) {
    console.log(`${name}: `);
    const results = strategy.getMovesForGame(game, words);
    results.forEach(result => console.log(`\t${result.petal}: ${result.firstWord.word} (${result.firstWord.score}), ${result.secondWord.word} (${result.secondWord.score})`));
    console.log();
    const total = results.map(r => r.firstWord.score + r.secondWord.score).reduce((sum, current) => sum + current, 0);
    var longest = Math.max(...results.map(r => r.firstWord.word.length).concat(results.map(r => r.secondWord.word.length)));
    console.log(`\tTotal: ${total}, Longest word: ${longest}`);
    console.log();
}


// this leads to a suboptimal soluton, pettinesses and steepnesses should be swapped:
/*
const game = new blossom.BlossomGame('T', ['E', 'P', 'N', 'I', 'S', 'C']);

const words = [
    'penitent',
    'entices',
    'entities',
    'intenseness',
    'intensenesses',
    'intensities',
    'tenseness',
    'tensenesses',
    'snippets',
    'scientists',
    'scientist',
    'steepness',
    'steepnesses',
    'pettiness',
    'pettinesses',
    'niceties',
    'nineteens',
    'tipsiness',
    'tipsinesses',
    'pipettes',
    'testinesses',
    'testiness',
    'penitences',
    'tininess',
    'tinniness',
    'tininesses',
    'tinninesses',
];
*/