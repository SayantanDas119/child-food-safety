function doPost(e) {
  try {
    // Get the spreadsheet
    const spreadsheet = SpreadsheetApp.openById("1NAR94faFhN3OnZyjY7SMD6Ujo9gy0jlBC2uP0Vow74c");
    if (!spreadsheet) {
      throw new Error("Could not open spreadsheet");
    }
    
    // Get or create the Responses sheet
    let sheet = spreadsheet.getSheetByName("Responses");
    if (!sheet) {
      sheet = spreadsheet.insertSheet("Responses");
      if (!sheet) {
        throw new Error("Could not create sheet");
      }
    }
    
    // Log incoming data
    Logger.log("Raw request data: " + JSON.stringify(e));
    Logger.log("Parameter data: " + JSON.stringify(e.parameter));
    
    const data = e.parameter;
    
    // Define headers if they don't exist
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Age",
        "Locality",
        "Selected Foods",
        "Nutrition Status",
        "Nutrient Details"
      ]);
    }
    
    // Process the selected foods
    const selectedFoods = data.selectedFoods || "";
    Logger.log("Processing selected foods: " + selectedFoods);
    
    // Create the row data
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.name || "",
      data.age || "",
      data.locality || "",
      selectedFoods,
      data.nutritionStatus || "",
      data.nutrients || ""
    ];
    
    // Log the row data before appending
    Logger.log("Attempting to append row: " + JSON.stringify(rowData));
    
    // Append the row
    sheet.appendRow(rowData);
    
    // Verify the row was added
    const lastRow = sheet.getLastRow();
    const addedData = sheet.getRange(lastRow, 1, 1, 7).getValues()[0];
    Logger.log("Added row data: " + JSON.stringify(addedData));
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data saved successfully",
      data: rowData
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    Logger.log("Error in doPost: " + error.toString());
    Logger.log("Stack: " + error.stack);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString(),
      stack: error.stack
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("The web app is running correctly.");
}

// Add this function to handle OPTIONS requests for CORS
function doOptions(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
} 