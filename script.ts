import * as blossom from "./game";
import * as Strategy from "./strategy";


function handleInput(box : HTMLInputElement, letterinputs: Array<HTMLInputElement> ){
    box.value = box.value.toUpperCase();
    let next = '';
    switch (box.id) {
        case "centre":
            next = 'petal1';
            break;

        case "petal1":
            next = 'petal2';
            break;

        case "petal2":
            next = 'petal3';
            break;
            
        case "petal3":
            next = 'petal4';
            break;
            
        case "petal4":
            next = 'petal5';
            break;
                
        case "petal5":
            next = 'petal6';
            break;
            
        case "petal6":
            next = 'user-words';
            break;
    }

    var nextElement = document.getElementById(next);
    if (nextElement != null)
        nextElement.focus(); 
    
    let allLetters = Array.from(letterinputs).map(i => i.value);
}

var letterInputs: Array<HTMLInputElement>;

window.addEventListener('DOMContentLoaded', () => {
    letterInputs = Array.from(document.querySelectorAll('#letters input')).map(e => e as HTMLInputElement);
    letterInputs.forEach(
        box => {
            box.addEventListener('change', () => handleInput(box as HTMLInputElement, letterInputs));
            box.addEventListener('keyup', () => handleInput(box as HTMLInputElement, letterInputs));
        });
    const calculateButton = document.querySelector("#calculate");
    if (calculateButton != null)
        calculateButton.addEventListener('click', calculate);
});

function calculate() {
    if (letterInputs != undefined) {
        const centre = letterInputs.find(i => i.id === "centre")?.value;
        const petals = letterInputs.filter(i => i.id.includes('pet')).map(x => x.value);

        const blossomGame = new blossom.BlossomGame(centre??"", petals);
        const helper = new Strategy.StrategyHelper();
        const strategy = new Strategy.PetalBruteForceStrategy(helper);
        const userWords = (document.querySelector("#user-words") as HTMLTextAreaElement).value.split("\r\n");
        const solution = strategy.getMovesForGame(blossomGame, userWords);
        console.log(`Inside calculate, centre = ${centre}, petals = ${petals}`);
    }
}