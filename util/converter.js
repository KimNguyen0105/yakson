'use strict';

const CashPerScore = 10000

var scoreFromCash = function(cash) {
    return Math.round(cash / CashPerScore)
}

var cashFromScore = function(score) {
    return score * CashPerScore
}

var earnScoreFrom = function(useScore, payCash) {
    return scoreFromCash(payCash) - useScore
}

module.exports = {
    scoreFromCash: scoreFromCash,
    cashFromScore: cashFromScore,
    earnScoreFrom: earnScoreFrom
}
