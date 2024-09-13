import * as blossom from "./game";

export class BlossomWord {
    constructor(public petal: string, public firstWord: WordWithScore, public secondWord: WordWithScore) {}
}

export interface IStrategy {
    getMovesForGame(game: blossom.BlossomGame, words: string[]) : BlossomWord[];
}

export class WordWithScore {
    constructor(public word: string, public score: number) {}
}

export interface IStrategyHelper {
    evaluateWords(game: blossom.BlossomGame, words: string[]) : Map<string, blossom.WordEvaluation>;
    getTopScoresForPetal(petal: string, words: Map<string, blossom.WordEvaluation>, size: number) : WordWithScore[];
    removeLowScorers(game: blossom.BlossomGame, words: Map<string, blossom.WordEvaluation>) : Map<string, blossom.WordEvaluation>;
}

export class StrategyHelper implements IStrategyHelper{
    public evaluateWords(game: blossom.BlossomGame, words: string[]) : Map<string, blossom.WordEvaluation> {
        let map = new Map<string, blossom.WordEvaluation>();
        let evaluator = new blossom.WordEvaluator(game);
        words.forEach(word => {
            var evaluation = evaluator.evaluate(word);
            map.set(evaluation.word, evaluation);
        });

        return map;
    }

    public getTopScoresForPetal(petal: string, words: Map<string, blossom.WordEvaluation>, size: number) : WordWithScore[] {
        let evaluations = Array.from(words).map(e => e[1]);
        let sorted = evaluations.sort((e1, e2) => {
            let score1 = e1.scores.get(petal);
            let score2 = e2.scores.get(petal);
            return (score2 ?? 0) - (score1 ?? 0);
        });

        return sorted.slice(0, size).map(e => new WordWithScore(e.word, e.scores.get(petal) ?? 0));
    }
    
    public removeLowScorers(game: blossom.BlossomGame, words: Map<string, blossom.WordEvaluation>) : Map<string, blossom.WordEvaluation>{
        let wordsToUse = new Set<string>();
        game.petals.forEach(petal => this.getTopScoresForPetal(petal, words, 12).forEach(word => wordsToUse.add(word.word)));
        let map = new Map<string, blossom.WordEvaluation>();
        wordsToUse.forEach(word => {
            var evaluation = words.get(word);
            if (evaluation != undefined)
                map.set(word, evaluation);
        });

        return map;
    }
}

export class SimpleStrategy implements IStrategy {
    constructor(private helper: IStrategyHelper) {}
    
    getMovesForGame(game: blossom.BlossomGame, words: string[]): BlossomWord[] {
        const mapped = this.helper.evaluateWords(game, words);
        const results = new Array<BlossomWord>();
        game.petals.forEach(petal => {
            const top2 = this.helper.getTopScoresForPetal(petal, mapped, 2);
            mapped.delete(top2[0].word);
            mapped.delete(top2[1].word);
            const result = new BlossomWord(petal, top2[0], top2[1]);
            results.push(result);
        });

        return results;
    }
}

export class PetalBruteForceStrategyTwoAtATime implements IStrategy {
    constructor(private helper: IStrategyHelper) {}
    
    public getMovesForGame(game: blossom.BlossomGame, words: string[]): BlossomWord[] {
        const mapped = this.helper.evaluateWords(game, words);
        let results = new Array<BlossomWord>();

        const permutations = this.getPermutations(game);
        let highestScore = 0;
        const wordSets = new Set<string>();
        permutations.forEach(permuation => {
            let copy = new Map<string, blossom.WordEvaluation>();
            mapped.forEach(w => copy.set(w.word, w));
            const possibleSolution = new Array<BlossomWord>();
            permuation.forEach(petal => {
                var top2 = this.helper.getTopScoresForPetal(petal, copy, 2)
                var blossomWord = new BlossomWord(petal, top2[0], top2[1]);
                possibleSolution.push(blossomWord);
                copy.delete(blossomWord.firstWord.word);
                copy.delete(blossomWord.secondWord.word);
            });
            const total = possibleSolution.reduce((sum, current) => sum + current.firstWord.score + current.secondWord.score, 0);
            if (total > highestScore) {
                highestScore = total;
                results = possibleSolution;
            }
        });

        return results;
    }

    private getPermutations(game: blossom.BlossomGame) : string[][]{
        return this.getSubPermutations(game.petals);
    }

    private getSubPermutations(petals: string[]) : string[][]{
        if (petals.length == 1)
            return [petals];

        const results = new Array<Array<string>>();
        for (let i = 0; i < petals.length; ++i) {
            const firstPetal = petals[i];
            var remainingPetals = new Array<string>();
            for (let j = 0; j < petals.length; ++j) {
                if (i == j)
                    continue;
                remainingPetals.push(petals[j]);
            }
            var permutations = this.getSubPermutations(remainingPetals);
            permutations.forEach(permuation => {
                var newArray = permuation.slice();
                newArray.unshift(firstPetal);
                results.push(newArray)
        });
        }

        return results;
    }

} 

export class PetalBruteForceStrategy implements IStrategy {
    constructor(private helper: IStrategyHelper) {}
    
    public getMovesForGame(game: blossom.BlossomGame, words: string[]): BlossomWord[] {
        const mapped = this.helper.evaluateWords(game, words);
        const results = new Array<BlossomWord>();

        const firstRound = this.getMovesForRound(game, mapped);
        Array.from(firstRound).map(m => m[1]).forEach(w => mapped.delete(w.word));
        const secondRound = this.getMovesForRound(game, mapped);
        game.petals.forEach(petal => {
            const first = firstRound.get(petal);
            const second = secondRound.get(petal);
            if (first != undefined && second != undefined) {
                const word = new BlossomWord(petal, first, second);
                results.push(word);
            }
        });
        return results;
    }

    private getMovesForRound(game: blossom.BlossomGame, words: Map<string, blossom.WordEvaluation>) : Map<string, WordWithScore> {
        const permutations = this.getPermutations(game);
        let results = new Map<string, WordWithScore>();
        let highestScore = 0;
        const wordSets = new Set<string>();
        permutations.forEach(permuation => {
            let copy = new Map<string, blossom.WordEvaluation>();
            words.forEach(w => copy.set(w.word, w));
            const possibleSolution = new Map<string, WordWithScore>();
            permuation.forEach(petal => {
                var wordWithScore = this.helper.getTopScoresForPetal(petal, copy, 1)[0];
                possibleSolution.set(petal, wordWithScore);
                copy.delete(wordWithScore.word);
            });
            const total = Array.from(possibleSolution).map(e => e[1].score).reduce((sum, current) => sum + current, 0);
            if (total > highestScore) {
                highestScore = total;
                results = possibleSolution;
            }
            wordSets.add(game.petals.map(p => possibleSolution.get(p)).map(p => p?.word).join(";"));
        });

        console.log(`${wordSets.size} distinct solutions`);
        return results;
    }

    private getPermutations(game: blossom.BlossomGame) : string[][]{
        return this.getSubPermutations(game.petals);
    }

    private getSubPermutations(petals: string[]) : string[][]{
        if (petals.length == 1)
            return [petals];

        const results = new Array<Array<string>>();
        for (let i = 0; i < petals.length; ++i) {
            const firstPetal = petals[i];
            var remainingPetals = new Array<string>();
            for (let j = 0; j < petals.length; ++j) {
                if (i == j)
                    continue;
                remainingPetals.push(petals[j]);
            }
            var permutations = this.getSubPermutations(remainingPetals);
            permutations.forEach(permuation => {
                var newArray = permuation.slice();
                newArray.unshift(firstPetal);
                results.push(newArray)
        });
        }

        return results;
    }

} 
