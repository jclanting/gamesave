const api_url_template = "https://www.cheapshark.com/api/1.0/deals?sortBy=Price&"
const redirect_url_template = "https://www.cheapshark.com/redirect?dealID="
const image_url_template = "https://steamcdn-a.akamaihd.net/steam/apps/"
const stores_url = "https://www.cheapshark.com/api/1.0/stores"

async function callAPI() {
    // Using the steamAppID to lookup the deals
    var steamAppID = document.getElementById("id_input").value.split("/")[4]
    var api_url = api_url_template + "steamAppID=" + steamAppID
    // Making an API call and getting the response (the deals) back
    var response = await fetch(api_url)
    // Parsing the deals to JSON format
    var data = await response.json()
    console.log(data)

    // Another API call but this time for the store data
    var store_response = await fetch(stores_url)
    var store_data = await store_response.json()

    // Convert both JSON objects to strings and return them as an array
    return [JSON.stringify(data), JSON.stringify(store_data)]
}

function clearBody() {
    document.getElementById("title_price").replaceChildren()
    document.getElementById("deals").replaceChildren()
}

function appendDeals(data, store_data) {
        // Dynamically creating table consisting of
        // the deal number, price, and link
        let num_deals = Object.keys(data).length
        let table = document.createElement("table")
        for (var i = 0; i < num_deals; i++) {

        // Creating the table row
        var tr = document.createElement("tr");

        // Creating three table data elements
        var td_store = document.createElement("td")
        var td_price = document.createElement("td")
        var td_savings = document.createElement("td")


        // This section handles the first data element,
        // consisting of a hyperlink of the store's name to
        // that redirects to the deal itself
        var p_store = document.createElement("p")
        // Retrieving the store name using the store data API call
        var text_store = document.createTextNode(store_data[parseInt(data[i].storeID) - 1].storeName)
        // Creating the redirect deal link using the dealID
        var redirect_url = redirect_url_template + data[i].dealID
        // Setting the innerHTML to a hyperlink (text is the store name, link is the deal link)
        var innerHTML = "<a href=\"" + redirect_url + "\">" + text_store.textContent + "</a>"
        p_store.innerHTML = innerHTML

        // Handling the second data element, consisting of the deal's price
        var text_price = document.createTextNode("$" + data[i].salePrice)

        // Handling the third data element, consisting of a percentage
        // of how much money is saved
        var text_savings = document.createTextNode(Math.round(parseInt(data[i].savings)).toString() + "%")

        // Appending the text to their corresponding table data elements
        td_store.appendChild(p_store)
        td_price.appendChild(text_price)
        td_savings.appendChild(text_savings)

        // Appending the table data elements to the table row
        tr.appendChild(td_store)
        tr.appendChild(td_price)
        tr.appendChild(td_savings)

        // Appending the table row to the table
        table.appendChild(tr)

    }
    
    // Appending table element to the DOM
    document.getElementById("deals").appendChild(table)
}

function appendDetails(data) {
    // Getting game image and title
    var thumb = document.createElement("img")
    thumb.src = image_url_template + data[0].steamAppID + "/header.jpg"
    thumb.width = "240"
    var title = document.createTextNode(data[0].title + " ($" + data[0].normalPrice + ")")

    // Appending details to body
    document.getElementById("title_price").appendChild(thumb)
    document.getElementById("title_price").appendChild(title)
}

async function updateDeals() {

    // Clearing the body
    clearBody()

    // Calling API to retrieve deal and store data
    const api_calls = await callAPI()
    // Converting strings to JSON objects
    const data = JSON.parse(api_calls[0])
    const store_data = JSON.parse(api_calls[1])

    // Appending image and title of game
    appendDetails(data)

    // Creating and appending table of deals
    appendDeals(data, store_data)

}