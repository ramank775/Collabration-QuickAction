class Action {
    constructor() {
        this.instruction = null;
        this.key = null;
        this.value = null;
        this.operator = null;
    }
}
class QuickQuery {
    constructor() {
        this.app = null;
        this.command = null;
        this.actions = [];
    }
}
const operators = [':', '=', '>', '<', '!=', '>=', '<='].reverse();
const queryParser = (input) => {
    console.log("parsedQueryInput:", input)
    const lines = input.split('\n');
    const query = new QuickQuery();
    let parts = lines[0].split(':', 1);
    query.app = parts[0].trim();
    if (parts.length > 1) {
        query.command = lines[1].trim();
    }
    for (let index = 1; index < lines.length; index++) {
        const action = new Action();
        query.actions.push(action)
        parts = lines[index].split(' ', 1);
        action.instruction = parts[0];
        if (parts.length > 1) {
            action.operator = findOperator(parts[1])
            if (action.operator) {
                parts = parts[1].split(action.operator, 1);
                action.key = parts[0];
                action.value = parts[1];
            } else {
                action.key = parts[1]
            }
        }
    }
    return query;
}

const findOperator = (line) => {
    for (let index = 0; index < operators.length; index++) {
        const op = operators[index];
        if (line.indexOf(op) > -1) {
            return op;
        }
    }
}

module.exports = {
    queryParser
}