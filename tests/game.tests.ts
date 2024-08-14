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
