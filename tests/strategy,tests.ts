import * as blossom from "../game";
import * as strategy from "../strategy";

const game = new blossom.BlossomGame('D', ['N', 'R', 'E', 'T', 'M', 'I']);
const helper = new strategy.StrategyHelper();

describe('test blossom strategies', () => {
    test('should map all the words', () => {
        const words = ['determined', 'detriment'];
        let mapped = helper.evaluateWords(game, words);
        let determinedResult = mapped.get("DETERMINED");
        expect(determinedResult?.pangram).toBeTruthy;
        expect(mapped.size).toEqual(2);
    });
});


describe('test blossom strategies', () => {
    test('should get highest scores', () => {
        const words = ['determined', 'detriment', 'deter'];
        let mapped = helper.evaluateWords(game, words);
        let top2 = helper.getTopScoresForPetal('E', mapped, 2);
        expect(top2[0].word).toEqual("DETERMINED");
        expect(top2[1].word).toEqual("DETRIMENT");
        expect(top2[0].score).toEqual(43);
        expect(top2[1].score).toEqual(35);
    });
});
