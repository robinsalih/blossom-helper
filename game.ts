export class BlossomGame {
    constructor(public centre: string, public petals: string[]) {
        if (centre.length != 1)
            throw "Centre letter must be a single letter";
        
        if (petals.length != 6)
            throw "There can only be 6 petals";

        if (petals.some(p => p.length != 1))
            throw ("all petals must be a single letter");

        centre = centre.toUpperCase();

        let allValues = petals.map(p => p.toUpperCase()).concat(centre);
        let unique = new Set(allValues);
        if (unique.size != 7)
            throw ("No dupes allowed");
    }
}

export class WordValidationResult {
    constructor(public valid: boolean, public reason?: string) {}
}

export class WordEvaluation {
    constructor(public word: string, public maxScore: number, public pangram:boolean, public length: number, public scores: Map<string, number>) {}
}

export class WordEvaluator
{
    private allLetters : Set<string>;
    constructor (private game: BlossomGame) {
        this.allLetters = new Set(game.petals.concat(game.centre));
    }

    verify(word: string) {
        if (word.length < 4)
            return new WordValidationResult(false, "Word must contain a minimum of four letters")

        word = word.toUpperCase();
        let centreFound = false; 
        for (let i = 0; i < word.length; ++i) {
            var char = word[i];
            if (!this.allLetters.has(char))
                return new WordValidationResult(false, "Word contains unavailable letter");

            if (this.game.centre == char)
                centreFound = true;
        }       
        if (!centreFound)
            return new WordValidationResult(false, "Must contain centre letter");

        return new WordValidationResult(true);
    }

    private getLengthScore(length: number) {
        switch (length) {
            case 4:
                return 2;

            case 5:
                return 4;

            case 6:
                return 6;

            default:
                return length * 3 - 9;
        }
    }
    
    evaluate(word: string) {
        word = word.toUpperCase();
        const lengthScore = this.getLengthScore(word.length);

        let letterCounts = new Map<string, number>();
        for (let i = 0; i < word.length; ++ i) {
            var letter = word[i];
            if (letter == this.game.centre)
                continue;
            
            var existingValue = letterCounts.get(letter);
            if (existingValue == undefined)
                letterCounts.set(letter, 1);
            else
                letterCounts.set(letter, existingValue + 1);
        }

        const pangram = letterCounts.size == 6;
        const pangramScore = pangram ? 7 : 0;
        let letterScores = new Map<string, number>();
        this.game.petals.forEach(petal => {
            const count = letterCounts.get(petal);
            const score = count == undefined ? 0 : lengthScore + pangramScore + count * 5;
            letterScores.set(petal, score);
        });

        const maxScore = Math.max(...letterScores.values());

        return new WordEvaluation(word, maxScore, pangram, word.length, letterScores);
    }
}