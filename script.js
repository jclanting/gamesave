const api_url_template = "https://www.cheapshark.com/api/1.0/deals?sortBy=Price&"
const redirect_url_template = "https://www.cheapshark.com/redirect?dealID="

async function updateDeals() {

    document.getElementById("details").replaceChildren()

    // Using the steamAppID to lookup the deals
    var steamAppID = document.getElementById("id_input").value
    var api_url = api_url_template + "steamAppID=" + steamAppID
    // Making an API call and getting the response (the deals) back
    var response = await fetch(api_url)
    // Parsing the deals to JSON format
    var data = await response.json()
    console.log(data)

    // Appending title of game to DOM
    var title = document.createTextNode(data[0].title)
    document.getElementById("details").appendChild(title)

    // Dynamically creating table consisting of
    // the deal number, price, and link
    let num_deals = Object.keys(data).length
    let table = document.createElement("table")
    for (var i = 0; i < num_deals; i++) {

        // Creating the table row
        var tr = document.createElement("tr");

        // Creating three table data elements
        var td_num = document.createElement("td")
        var td_price = document.createElement("td")
        var td_dealID = document.createElement("td")

        // Creating the text that will be in the table data elements
        // by retrieving the data from the JSON
        var text_num = document.createTextNode((i+1).toString())
        var text_price = document.createTextNode(data[i].salePrice)
        // dealID is a paragraph so that it can use a hyperlink
        var p_dealID = document.createElement("p")
        var redirect_url = redirect_url_template + data[i].dealID
        p_dealID.innerHTML = "<a href=\"" + redirect_url + "\"> Link</a>"

        // Appending the text to its corresponding table data elements
        td_num.appendChild(text_num)
        td_price.appendChild(text_price)
        td_dealID.appendChild(p_dealID)

        // Appending the table data elements to the table row
        tr.appendChild(td_num)
        tr.appendChild(td_price)
        tr.appendChild(td_dealID)

        // Appending the table row to the table
        table.appendChild(tr)

    }

    // Appending table element to the DOM
    document.getElementById("details").appendChild(table)

}