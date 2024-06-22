// Get references to the HTML elements where the text and option buttons will be displayed.
const textelement = document.getElementById('text');
const optionbuttonelement = document.getElementById('option-buttons');

// State object to keep track of the game's current state.
let state = {};

// The startgame function initializes the game state and shows the first text node.
function startgame() {
    state = {};  // Reset the state to an empty object at the start of the game.
    showtextnode(1);  // Display the first text node.
}

function showtextnode(textnodeidx) {
    // This line uses the find method on the textnodes array to search for an object whose id matches the textnodeidx.
    // textnode will be the first object in the array that matches the condition textnode.id === textnodeidx.
    const textnode = textnodes.find(textnode => textnode.id === textnodeidx);
    textelement.innerText = textnode.text;  // Update the text element with the text from the current text node.

    // Remove all existing option buttons from the option buttons element.
    while (optionbuttonelement.firstChild) {
        optionbuttonelement.removeChild(optionbuttonelement.firstChild);
    }

    // Loop through each option in the current text node.
    textnode.options.forEach(option => {
        if (showoption(option)) {
            // If the option should be shown, create a new button element.
            const button = document.createElement('button');
            button.innerText = option.text;  // Set the button text to the option text.
            button.classList.add('btn');  // Add a CSS class to the button for styling.
            button.addEventListener('click', () => selecteoption(option));  // Add an event listener to handle the option selection.
            optionbuttonelement.append(button);  // Append the button to the option buttons element.
        }
    });
}

// This function handles what happens when an option is selected. It updates the state and shows the next text node based on the selected option.
function selecteoption(option) {
    const nextTextnodeID = option.nextText;  // Get the ID of the next text node to display.
    if (nextTextnodeID <= 0) return startgame();  // If the next text node ID is less than or equal to 0, restart the game.
    state = Object.assign(state, option.setState);  // Update the state with the properties from the selected option's setState object.
    // basically add everything from option.setstate to state if state f and option t then t
    showtextnode(nextTextnodeID);  // Display the next text node based on the selected option.
}

// This function determines whether an option should be shown based on the current state.
function showoption(option) {
    return option.requiredState == null || option.requiredState(state);  // Show the option if there is no required state or if the required state function returns true.
}

// Array of objects representing the text nodes and their options.
const textnodes = [
    {
        id: 1,
        text: 'You find yourself on top of a cliff thinking about all of the actions YOU took. What to do next?',
        options: [
            {
                text: 'Jump from the cliff',
                setState: { jump: true },
                nextText: 2
            },
            {
                text: 'Go back',
                setState: { back: true },
                nextText: 3
            }
        ]
    },
    {
        id: 2,
        text: 'You are feeling the vertical wind hitting you (you are regretting your decision so far). YOU hit the ground too hard...',
        options: [
            {
                text: 'You are not moving',
                requiredState: (currentstate) => currentstate.jump,
                setState: { jump: true, notmoving: true },
                nextText: 7
            },
            {
                text: 'You are moving',
                requiredState: (currentstate) => currentstate.jump,
                setState: { jump: true, moving: true },
                nextText: 11 // Leads to the portal decision
            },
            {
                text: 'Your leg got stuck in the rock cracks...',
                setState: { jump: true, struck: true },
                nextText: 8
            }
        ]
    },
    {
        id: 3,
        text: 'You went back to your normal lifestyle',
        options: [
            {
                text: 'You are meeting your wife',
                requiredState: (currentstate) => currentstate.back,
                setState: { wife: true },
                nextText: 4
            },
            {
                text: 'You are playing with your kids',
                requiredState: (currentstate) => currentstate.back,
                setState: { kids: true },
                nextText: 5
            },
            {
                text: 'You do not have balanced work-life',
                requiredState: (currentstate) => currentstate.back,
                setState: { work: true },
                nextText: 6
            }
        ]
    },
    {
        id: 4,
        text: 'YOU died fighting with your wife',
        options: [
            {
                text: 'Restart',
                nextText: -1
            }
        ]
    },
    {
        id: 5,
        text: 'YOUR kids are naughty and they killed you accidentally by throwing a rock at your head',
        options: [
            {
                text: 'Restart',
                nextText: -1
            }
        ]
    },
    {
        id: 6,
        text: 'YOU died beneath the files in your office desk',
        options: [
            {
                text: 'Restart',
                nextText: -1
            }
        ]
    },
    {
        id: 7,
        text: 'YOU died with memories but majorly with blood loss...',
        options: [
            {
                text: 'Restart',
                nextText: -1
            }
        ]
    },
    {
        id: 8,
        text: 'YOU are waiting for help to arrive but you are also getting dehydrated and the pain is becoming unbearable day by day...',
        options: [
            {
                text: 'You decided to cut your leg',
                requiredState: (currentstate) => currentstate.jump,
                setState: { jump: false, struck: true, legcut: true },
                nextText: 9
            },
            {
                text: 'You wish to stay like this for some time',
                requiredState: (currentstate) => currentstate.jump,
                setState: { jump: false, notmoving: true, slowdeath: true },
                nextText: 10
            }
        ]
    },
    {
        id: 9,
        text: 'YOU got lucky and got discovered by the locals and admitted to the hospital. Get well soon...',
        options: [
            {
                text: 'Want to try again',
                nextText: -1
            }
        ]
    },
    {
        id: 10,
        text: 'YOU became unconscious and died a slow death on top of the mountain where vultures peeled you alive...',
        options: [
            {
                text: 'You unlucky kid! Want to try again?',
                nextText: -1
            }
        ]
    },
    {
        id: 11,
        text: 'A portal appears in front of you. Do you want to enter it?',
        options: [
            {
                text: 'Yes',
                setState: { jump: false, portal: true },
                nextText: 12
            },
            {
                text: 'No',
                setState: { jump: false, deadend: true },
                nextText: 13
            }
        ]
    },
    {
        id: 12,
        text: 'You are reborn as a new person and can take different steps now to change your life...',
        options: [
            {
                text: 'Focus on education',
                setState: { reborn: true, education: true },
                nextText: 14
            },
            {
                text: 'Start a business',
                setState: { reborn: true, business: true },
                nextText: 15
            },
            {
                text: 'Travel the world',
                setState: { reborn: true, travel: true },
                nextText: 16
            }
        ]
    },
    {
        id: 13,
        text: 'You decided not to enter the portal. The story ends here...',
        options: [
            {
                text: 'Restart',
                nextText: -1
            }
        ]
    },
    {
        id: 14,
        text: 'You focused on your education, excelled in your studies, and eventually became a successful professional.',
        options: [
            {
                text: 'You became a renowned scientist. Continue your journey?',
                setState: { success: true, scientist: true },
                nextText: 17
            },
            {
                text: 'You became a successful engineer. Continue your journey?',
                setState: { success: true, engineer: true },
                nextText: 18
            }
        ]
    },
    {
        id: 15,
        text: 'You started a business, faced many challenges but eventually became a successful entrepreneur.',
        options: [
            {
                text: 'Expand your business globally?',
                setState: { success: true, entrepreneur: true },
                nextText: 19
            },
            {
                text: 'Invest in new ventures?',
                setState: { success: true, investor: true },
                nextText: 20
            }
        ]
    },
    {
        id: 16,
        text: 'You traveled the world, experienced different cultures, and found various opportunities.',
        options: [
            {
                text: 'Settle in a foreign country and start a new life?',
                setState: { success: true, expat: true },
                nextText: 21
            },
            {
                text: 'Write a book about your travels and become a famous author?',
                setState: { success: true, author: true },
                nextText: 22
            }
        ]
    },
    {
        id: 17,
        text: 'As a renowned scientist, you made groundbreaking discoveries that changed the world.',
        options: [
            {
                text: 'Restart your journey?',
                nextText: -1
            }
        ]
    },
    {
        id: 18,
        text: 'As a successful engineer, you built innovations that improved lives globally.',
        options: [
            {
                text: 'Restart your journey?',
                nextText: -1
            }
        ]
    },
    {
        id: 19,
        text: 'Your business expanded globally, making you a world-renowned entrepreneur.',
        options: [
            {
                text: 'Restart your journey?',
                nextText: -1
            }
        ]
    },
    {
        id: 20,
        text: 'Your investments in new ventures made you one of the top investors in the world.',
        options: [
            {
                text: 'Restart your journey?',
                nextText: -1
            }
        ]
    },
    {
        id: 21,
        text: 'Settling in a foreign country, you started a new, prosperous life.',
        options: [
            {
                text: 'Restart your journey?',
                nextText: -1
            }
        ]
    },
    {
        id: 22,
        text: 'Your book about your travels became a bestseller, making you a famous author.',
        options: [
            {
                text: 'Restart your journey?',
                nextText: -1
            }
        ]
    }
];

// Start game function will automatically load when game starts
startgame();
