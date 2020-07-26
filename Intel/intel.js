
const getRegisterValue = (multiplier) => [...Array(multiplier)].map(() => Math.floor(Math.random() * 2));

const registers = {};

["AL", "BL", "CL", "DL", "AH", "BH", "CH", "DH"].map(code => registers[code] = getRegisterValue(8));
["BP", "SP", "SI", "DI", "CS", "SS", "DS", "ES"].map(code => registers[code] = getRegisterValue(16));

registers.AX = registers["AH"].concat(registers["AL"]);
registers.BX = registers["BH"].concat(registers["BL"]);
registers.CX = registers["CH"].concat(registers["CL"]);
registers.DX = registers["DH"].concat(registers["DL"]);

const regs = [...document.querySelectorAll('.oct')];
const hexRegs = document.querySelectorAll('.hex');

regs.forEach(el => el.innerHTML = registers[el.dataset.reg].join(""));
hexRegs.forEach(el => el.innerHTML = registers[el.dataset.reg].join(""));



const clsNewLine = () => {
    const lastLine = document.querySelector('.clsActive');
    const cls = document.querySelector('.console');
    const lastLineInput = lastLine.querySelector('input');

    lastLine.classList.remove('clsActive');
    lastLineInput.disabled = true;
    lastLineInput.id = "";

    let line = document.createElement("div");
    line.className = "clsLine clsActive";
    line.innerHTML = `<span>></span><input type="text" id="adrBar"></input>`;
    cls.appendChild(line);
}

document.addEventListener('keypress', e => {
    if (e.keyCode == 13) {
        const inputBar = document.querySelector('#adrBar');
        const input = inputBar.value.toUpperCase();
        const commands = input.replace(',', ' ').split(' ').filter(el => el != "");

        if (commands[0].toUpperCase() == "MOV" && registers[commands[2]].length == registers[commands[1]].length) {

            registers[commands[2]] = registers[commands[1]];
            if (commands[2].includes("X") && commands[1].includes("X")) {
                registers[commands[2].replace("X", "H")] = registers[commands[2]].slice(0, 8);
                registers[commands[2].replace("X", "L")] = registers[commands[2]].slice(8, 16);
                regs.forEach(el => el.innerHTML = registers[el.dataset.reg].join(""));
                hexRegs.forEach(el => el.innerHTML = registers[el.dataset.reg].join(""));
            } else if (commands[2].includes("X")) {
                registers[commands[2].replace("X", "H")] = registers[commands[2]].slice(0, 8);
                registers[commands[2].replace("X", "L")] = registers[commands[2]].slice(8, 16);
                regs.forEach(el => el.innerHTML = registers[el.dataset.reg].join(""));
                hexRegs.forEach(el => el.innerHTML = registers[el.dataset.reg].join(""));
            } else {
                if (registers[commands[2]].length == 8) { // zamiana rejestru CX 
                    let regId = commands[2].charAt(0);
                    let regHexId = commands[2].replace("H", "X").replace("L", "X");
                    registers[regHexId] = registers[`${regId}H`].concat(registers[`${regId}L`]);
                }
                regs.forEach(el => el.innerHTML = registers[el.dataset.reg].join(""));
                hexRegs.forEach(el => el.innerHTML = registers[el.dataset.reg].join(""));
            }
            clsNewLine();
        } else {
            clsNewLine();
            inputBar.value += " <- Wrong command!"
            console.error("Error! wrong command!");
        }

    }
});
