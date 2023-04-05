const example = `
  VAR_C = 2;

  A;
  FORK ROT_B;
  JOIN VAR_C, ROT_C, QUIT;

  ROT_B:
    B;
    JOIN VAR_C, ROT_C, QUIT;

  ROT_C:
    C;
    QUIT;
`;

const lex = str => {
	let lexemes = [];

	let i = 0;
	while (i < str.length) {
		if (str[i] === ";") {
			lexemes.push("SEMI");
			i++;
		} else if (str[i] === ":") {
			lexemes.push("COL");
			i++;
		} else if (str[i] === "=") {
			lexemes.push("EQ");
			i++;
		} else if (str[i] === ",") {
			lexemes.push("COM");
			i++;
		} else if (str[i].match(/[a-zA-Z_]/)) {
			let d = "";
			while(str[i].match(/[a-zA-Z0-9_]/)) {
				d += str[i];
				i++;
			}
			lexemes.push([ "SYM", d]);
		} else if (str[i].match(/\d/)) {
			let d = "";
			while(str[i].match(/\d/)) {
				d += str[i];
				i++;
			}
			lexemes.push([ "DIG", d ]);
		} else if (str[i] === " ") {
			i++;
		} else if (str[i] === "\n") {
			i++;
		} else if (str[i] === "\t") {
			i++;
		} else if (str[i] === "\r") {
			i++;
		} else {
			console.log(str[i]);
		}
	}

	return lexemes;
};

const parse = tks => {
	let sttmts = [];

	let i = 0;

	let lvar;

	const peek = () => {
		if (Array.isArray(tks[i])) {
			return tks[i][0];
		} else {
			return tks[i];
		}
	};

	const consume = tok => {
		if (Array.isArray(tks[i])) {
			if (tks[i][0] === tok) {
				return tks[i++][1];
			} else {
				console.log(`error ${tok}`);
			}
		} else {
			if (tks[i] === tok) {
				return tks[i++];
			} else {
				console.log(`error ${tok}`);
			}
		}
	};

	while (i < tks.length) {
		if (peek() === "SYM") {
			if (tks[i][1] === "JOIN") {
				consume("SYM");

				const a = consume("SYM");
				consume("COM");
				const b = consume("SYM");
				consume("COM");
				const c = consume("SYM");
				consume("SEMI");

				sttmts.push([ "JOIN", a, b, c ]);
			} else if (tks[i][1] === "FORK") {
				consume("SYM");

				const a = consume("SYM");
				consume("SEMI");

				sttmts.push(["FORK", a]);
			} else {
				lvar = consume("SYM");
			}
		} else if (peek() === "COL") {
			consume("COL");
			sttmts.push(["LABEL", lvar]);
			lvar = undefined;
		} else if (peek() === "EQ") {
			consume("EQ");
			sttmts.push(["ASSIGN", lvar, consume("DIG")]);
			consume("SEMI");
		} else if (peek() === "SEMI") {
			sttmts.push(["EXECUTE", lvar]);
			consume("SEMI");
		} else {
			console.log(`peek ${peek()} i ${i}`);
			i++;
		}
	}

	return sttmts;
};


const toks = lex(example);
console.log(toks);

const ast = parse(toks);
console.log(ast);
