// create constants for base url and amount categories and questions for game board;
const apiURL = 'http://jservice.io/api/';
const CATEGORIES = 6;
const QUESTIONS = 5;

// global array that will used to hold objects: ids, categories, questions, answers
let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
async function getCategoryIds() {
    const result = await axios.get(apiURL+'categories',{params:{count:100}});
        const arrIds = result.data.map( el => el.id)
    return shufflArray(arrIds, CATEGORIES);
}



/** Return object with data about a category:
 *
 *  Returns random obj from API{ title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
async function getCategory(catId) {
    const result = await axios.get(apiURL+'category',{params:{id:catId}});
    return {title: result.data.title, clues: shufflArray(result.data.clues, QUESTIONS)};
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */
async function fillTable() {
    const game = $("#game");
    game.empty()
        game.append('<thead><tr></tr></thead>')
        const thead = $('#game thead tr');
            game.append('<tbody></tbody');
            const tbody = $('#game tbody');
                const arrIds = await getCategoryIds();

    for(let id of arrIds){
        categories.push(await getCategory(id));
    }
    
    for(let el of categories){
        const th = $(`<th>${el.title}</th>`);
            thead.append(th);
    }

    for(let i = 0; i < QUESTIONS; i++){
        const tr = $('<tr></tr>');
        for(let k = 0; k < CATEGORIES; k++){
            const td = $(`<td id=${k}-${i}><span>?</span></td>`);
            tr.append(td);
        }
        tbody.append(tr);
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */
function handleClick(e) {
    let id = '';

    // check which element has been clicked <span> or <td> and retrieve an id for current td
    if($(e.target).attr('id')){
        id = $(e.target).attr('id');
    }else{
        id = $(e.target).parent().attr('id');
    }
    
    // split id string in two id numbers
    const [cat, clue] = id.split("-")
    const td = $(`#${cat}-${clue}`);

    // the block checks if the user is currently seeing a question or answer
    if(!categories[cat].clues[clue].check){
        td.html(categories[cat].clues[clue].question);
            categories[cat].clues[clue].check = "face"; 
    }else if(categories[cat].clues[clue].check == 'face'){
        td.html(categories[cat].clues[clue].answer);
            td.css('background-color','green');
                categories[cat].clues[clue].check = "back"; 
    }
    return;
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    $('.playground').hide();
    $('body').toggleClass("load");
    categories = [];
    $('#game').empty();
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    $('.playground').fadeIn(300);
    $('body').toggleClass("load");
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */
async function setupAndStart() {
    showLoadingView();
    await fillTable();
    if(categories.length > 0){
        hideLoadingView();
    }
}

// start game when webpage is loaded
setupAndStart();

/** On click of start / restart button, set up game. */
/** On page load, add event handler for clicking clues */
$('#game').on('click', 'td', (e) => {handleClick(e)})
$('#restart').on('click', setupAndStart);