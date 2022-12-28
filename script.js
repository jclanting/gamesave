const apiURLTemplate = "https://www.cheapshark.com/api/1.0/deals?sortBy=Price&"
const redirectURLTemplate = "https://www.cheapshark.com/redirect?dealID="
const imageURLTemplate = "https://steamcdn-a.akamaihd.net/steam/apps/"
const storesURL = "https://www.cheapshark.com/api/1.0/stores"

function clearBody() {
    document.getElementById("details").replaceChildren()
    document.getElementById("deals").replaceChildren()
}

function searchKeyPress(e) {
    if (e.keyCode == 13) {
        document.getElementById('button').click();
        return false;
    }
    return
}

async function callAPI() {
    // Using the steamAppID to lookup the deals
    const steamAppID = document.getElementById("id-input").value.split("/")[4]
    const apiURL = apiURLTemplate + "steamAppID=" + steamAppID
    // Making an API call and getting the response (the deals) back
    const response = await fetch(apiURL)
    // Parsing the deals to JSON format
    const data = await response.json()
    console.log(data)

    // Another API call but this time for the store data
    const storeResponse = await fetch(storesURL)
    const storeData = await storeResponse.json()

    // Convert both JSON objects to strings and return them as an array
    return [JSON.stringify(data), JSON.stringify(storeData)]
}

function appendDeals(data, storeData) {
    // Dynamically creating table consisting of
    // the deal number, price, and link
    const numDeals = Object.keys(data).length
    const table = document.createElement("table")
    for (var i = 0; i < numDeals; i++) {

        // Creating the table row
        const tr = document.createElement("tr");

        // Creating three table data elements
        const tdStore = document.createElement("td")
        const tdPrice = document.createElement("td")
        const tdSavings = document.createElement("td")


        // This section handles the first data element,
        // consisting of a hyperlink of the store's name to
        // that redirects to the deal itself
        const pStore = document.createElement("p")
        // Retrieving the store name using the store data API call
        const textStore = document.createTextNode(storeData[parseInt(data[i].storeID) - 1].storeName)
        // Creating the redirect deal link using the dealID
        const redirectURL = redirectURLTemplate + data[i].dealID
        // Setting the innerHTML to a hyperlink (text is the store name, link is the deal link)
        const innerHTML = "<a href=\"" + redirectURL + "\">" + textStore.textContent + "</a>"
        pStore.innerHTML = innerHTML

        // Handling the second data element, consisting of the deal's price
        const textPrice = document.createTextNode("$" + data[i].salePrice)

        // Handling the third data element, consisting of a percentage
        // of how much money is saved
        const textSavings = document.createTextNode(Math.round(parseInt(data[i].savings)).toString() + "%")

        // Appending the text to their corresponding table data elements
        tdStore.appendChild(pStore)
        tdPrice.appendChild(textPrice)
        tdSavings.appendChild(textSavings)

        // Appending the table data elements to the table row
        tr.appendChild(tdStore)
        tr.appendChild(tdPrice)
        tr.appendChild(tdSavings)

        // Appending the table row to the table
        table.appendChild(tr)

    }
    
    // Appending table element to the DOM
    document.getElementById("deals").appendChild(table)
}

function appendDetails(data) {
    // Getting game image and title
    const thumb = document.createElement("img")
    thumb.src = imageURLTemplate + data[0].steamAppID + "/header.jpg"
    thumb.width = "240"
    const title = document.createTextNode(data[0].title + " ($" + data[0].normalPrice + ")")

    // Appending details to body
    document.getElementById("details").appendChild(thumb)
    document.getElementById("details").appendChild(title)
}

async function updateDeals() {

    // Clearing the body
    clearBody()

    // Calling API to retrieve deal and store data
    const apiCalls = await callAPI()
    // Converting strings to JSON objects
    const data = JSON.parse(apiCalls[0])
    const storeData = JSON.parse(apiCalls[1])

    try {
        // Appending image and title of game
        appendDetails(data)
        // Creating and appending table of deals
        appendDeals(data, storeData)
    } catch (error) {
        // Appending invalid input text
        const textInvalid = document.createTextNode("Invalid input!")
        document.getElementById("details").appendChild(textInvalid)
    }

}

document.getElementById("button").addEventListener("click", updateDeals)
document.getElementById("id-input").addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        updateDeals()
    }
})
