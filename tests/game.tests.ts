import * as blossom from "../game";

describe('test blossom game', () => {
    test('duplicate letters should throw error', () => {
        const t = () => {
            let petals = ['R', 'O', 'A' ,'C', 'M', 'e'];
            new blossom.BlossomGame('E', petals);
        }
        expect(t).toThrow('No dupes allowed');
    });
});

describe('test blossom game', () => {
    test('incorrect number of petals should throw error', () => {
        const t = () => {
            let petals = ['R', 'O', 'A' ,'C', 'M'];
            new blossom.BlossomGame('E', petals);
        }
        expect(t).toThrow('There can only be 6 petals');
    });
});

describe('test blossom game', () => {
    test('invalid word - less than four letters', () => {
        let petals = ['R', 'O', 'A' ,'C', 'M', 'E'];
        let game = new blossom.BlossomGame('T', petals);
        let evaluator = new blossom.WordEvaluator(game);
        var result = evaluator.verify("cat")
        expect(result.reason).toEqual("Word must contain a minimum of four letters");
        expect(result.valid).toEqual(false);
    });
});

describe('test blossom game', () => {
    test('invalid word - missing centre letter', () => {
        let petals = ['R', 'O', 'A' ,'C', 'M', 'E'];
        let game = new blossom.BlossomGame('T', petals);
        let evaluator = new blossom.WordEvaluator(game);
        var result = evaluator.verify("roamer")
        expect(result.reason).toEqual("Must contain centre letter");
        expect(result.valid).toEqual(false);
    });
});

describe('test blossom game', () => {
    test('invalid word - contains invalid letter', () => {
        let petals = ['R', 'O', 'A' ,'C', 'M', 'E'];
        let game = new blossom.BlossomGame('T', petals);
        let evaluator = new blossom.WordEvaluator(game);
        var result = evaluator.verify("comment")
        expect(result.reason).toEqual("Word contains unavailable letter");
        expect(result.valid).toEqual(false);
    });
});

describe('test blossom game', () => {
    test('valid word', () => {
        let petals = ['R', 'O', 'A' ,'C', 'M', 'E'];
        let game = new blossom.BlossomGame('T', petals);
        let evaluator = new blossom.WordEvaluator(game);
        var result = evaluator.verify("creator")
        expect(result.reason).toBeUndefined();
        expect(result.valid).toEqual(true);
    });
});


describe('test blossom game', () => {
    test('evaluate 4 letter word', () => {
        let petals = ['R', 'O', 'A' ,'C', 'M', 'E'];
        let game = new blossom.BlossomGame('T', petals);
        let evaluator = new blossom.WordEvaluator(game);
        var result = evaluator.evaluate("tram");
        expect(result.maxScore).toEqual(7);
        expect(result.scores.get("R")).toEqual(7);
        expect(result.scores.get("C")).toEqual(0);
        expect(result.length).toEqual(4);
        expect(result.word).toEqual("TRAM");
        expect(result.pangram).toBeFalsy();
    });
});
    
    describe('test blossom game', () => {
        test('evaluate longer word', () => {
            let petals = ['S', 'N', 'L' ,'T', 'A', 'R'];
            let game = new blossom.BlossomGame('E', petals);
            let evaluator = new blossom.WordEvaluator(game);
            var result = evaluator.evaluate("senselessnesses");
            expect(result.maxScore).toEqual(71);
            expect(result.scores.get("S")).toEqual(71);
            expect(result.scores.get("N")).toEqual(46);
            expect(result.scores.get("T")).toEqual(0);
            expect(result.length).toEqual(15);
            expect(result.word).toEqual("SENSELESSNESSES");
            expect(result.pangram).toBeFalsy();
        });
    });
    
        describe('test blossom game', () => {
            test('evaluate pangram', () => {
                let petals = ['S', 'N', 'L' ,'T', 'A', 'R'];
                let game = new blossom.BlossomGame('E', petals);
                let evaluator = new blossom.WordEvaluator(game);
                var result = evaluator.evaluate("Lanterns");
                expect(result.maxScore).toEqual(32);
                expect(result.scores.get("S")).toEqual(27);
                expect(result.scores.get("N")).toEqual(32);
                expect(result.length).toEqual(8);
                expect(result.word).toEqual("LANTERNS");
                expect(result.pangram).toBeTruthy();
            });
        });
