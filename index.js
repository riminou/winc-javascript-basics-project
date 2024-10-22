'use strict';

const mockData = require('./mockData.js').data;
const prompt = require('prompt-sync')();

// Your code here
let userProfile = {
    first_name: "",
    last_name: "",
    age: 0,
    gender: "",
    gender_interest: "",
    location: "",
    min_age_interest: 0,
    max_age_interest: 0
};

const profileQuestions = {
    first_name: "What's your first name?: ",
    last_name: "What's your surname?: ",
    age: "What's your age?: ",
    gender: "What's your gender? (M/F/X): ",
    gender_interest: "Which gender are you looking for? (M/F/X): ",
    location: "What's your location? (city/rural): ",
    min_age_interest: "What's your minimum age of interest?: ",
    max_age_interest: "What's your maximum age of interest?: "
};

// Validate the anwsers.
for (let i = 0; i < Object.values(profileQuestions).length; i++) {
    let profileVariable = Object.keys(profileQuestions)[i];
    let profileQuestion = Object.values(profileQuestions)[i];
    let anwser = prompt(profileQuestion).trim();
    switch (profileVariable) {
        case "first_name":
        case "last_name":
            if (anwser !== "") {
                userProfile[profileVariable] = anwser;
            } else {
                console.log("Your anwser is an empty value, please fill in a valid name.");
                i--;
            }
            break;
        case "age":
        case "min_age_interest":
        case "max_age_interest":
            anwser = Number(anwser);
            if (!isNaN(anwser) && anwser >= 18) {
                if (profileVariable === "max_age_interest") {
                    if (anwser <= userProfile["min_age_interest"]) {
                        console.log("This is not a valid maximum age, please enter an age that is higher then the minimum age of interest.");
                        i--;
                        break;
                    }
                }
                userProfile[profileVariable] = anwser;
            } else {
                console.log("This is not a valid age, please enter an age of 18 or older.");
                i--;
            }
            break;
        case "gender":
        case "gender_interest":
            anwser = anwser.toUpperCase();
            if ((anwser !== "") && (anwser === "M" || anwser === "F" || anwser === "X")) {
                userProfile[profileVariable] = anwser;
            } else {
                console.log("This is not a valid gender, please choose from 'M', 'F' or 'X'.");
                i--;
            }
            break;
        case "location":
            anwser = anwser.toLowerCase();
            if ((anwser !== "") && (anwser === "city" || anwser === "rural")) {
                userProfile[profileVariable] = anwser;
            } else {
                console.log("This is not a valid location, please choose from 'City' or 'Rural'.");
                i--;
            }
            break;
    }
    console.log();
}

// Find matches.
let matches = [];
for (let person of mockData) {
    // Your age range and their age match
    if ((userProfile.min_age_interest <= person.age) && (person.age <= userProfile.max_age_interest)) {
        // Their age range and your age match
        if ((person.min_age_interest <= userProfile.age) && (userProfile.age <= person.max_age_interest)) {
            // - Their gender_interest and your gender match. 
            if (person.gender_interest.toUpperCase() === userProfile.gender.toUpperCase()) {
                // - Your gender_interest and their gender match.
                if (userProfile.gender_interest.toUpperCase() === person.gender.toUpperCase()) {
                    // - You both have the same location
                    if (userProfile.location.toLowerCase() === person.location.toLowerCase()) {
                        matches.push(person);
                    }
                }
            }
        }
    }
}

// Print matches.
if (matches.length === 1) {
    console.log(`Yeah ${userProfile.first_name}! We found a match:`);
} else if (matches.length > 0) {
    console.log(`Yeah ${userProfile.first_name}! We found ${matches.length} matches:`);
} else {
    console.log(`We're very sorry ${userProfile.first_name}, we couldn't find any matches.`);
}
console.log();
for (let match of matches) {
    console.log(`Name: ${match.first_name}`);
    console.log(`Age: ${match.age}`);
    console.log(`Location: ${match.location}`);
    console.log();
}

console.table(matches, ["first_name", "age", "location"])
