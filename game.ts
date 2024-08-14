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

export class WordEvaluator
{
    private allLetters : Set<string>;
    constructor (private game: BlossomGame) {
        this.allLetters = new Set(game.petals.concat(game.centre));
    }

    verify(word: string) {
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
}