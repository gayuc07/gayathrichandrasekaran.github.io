/* 
    "g20_Charts.js" - scripts to load the google charts, visualizing G20 military spendings,health care 
                    and educational data
*/


//Loading necessary google api packages 
google.charts.load('current',{'packages': ['corechart','geochart','controls']});
google.charts.setOnLoadCallback(drawAllSheets);

//Function to fetch data from the google sheets
function drawAllSheets(){
    drawSheetName('Renewable_investment','SELECT A,B,C,D,E,F,G,H,K,L,M,N,O,P',renewinvestResponseHandler);
} //drawAllSheets

//function to call the google sheets
function drawSheetName(sheetName, query, responseHandler){
    var queryString = encodeURIComponent(query);
    var query = new google.visualization.Query(
        'https://docs.google.com/spreadsheets/d/1Srf-71tmldfBeUBCdPColqdM4ENRhY27FuBOBaNm5Q0/gviz/tq?sheet=' +
        sheetName + '&headers=1&tq='+queryString);
    query.send(responseHandler);  
}//drawSheetName


/** Spending Data with GDP Page */
//Spending Data with country's GDP
/** Category filter - to filter year values and view  */
function renewinvestResponseHandler(response){
    var data = response.getDataTable();
    var initState= {selectedValues: []};
    var columnsTable = new google.visualization.DataTable();
    columnsTable.addColumn('number', 'colIndex');
    columnsTable.addColumn('string', 'colLabel');
    for (var i = 1; i < data.getNumberOfColumns(); i++) {
        columnsTable.addRow([i, data.getColumnLabel(i)]);
    }
    initState.selectedValues.push(data.getColumnLabel(data.getNumberOfColumns()-1));
    var columnFilter = new google.visualization.ControlWrapper({
        controlType: 'CategoryFilter',
        containerId: 'spend_gdp_filter_div',
        dataTable: columnsTable,
        options: {
            filterColumnLabel: 'colLabel',
            ui: {
                label: 'Year: ',
                allowTyping: false,
                allowMultiple: false,
                allowNone: false, 
            },
            width: 50,
            height: 50,
        },
        state: initState
    });
    function setChartView() {
        var state = columnFilter.getState();
        var row;
        var view = new google.visualization.DataView(data);
        row = columnsTable.getFilteredRows([{column: 1, value: state.selectedValues[0]}]);
        view.setColumns([0,{
            sourceColumn:columnsTable.getValue(row[0], 0),
            label:'percapita military spending'}]);
        var chart = new google.visualization.ChartWrapper({
            chartType: 'PieChart',
            containerId: 'spending_response_div',
            dataTable: data,
            options: {
                colors: ['#ab0707','#a9c413','#DD4477','#0099C6','#aaaa11','#2a778d','#BC8F8F'],
                width: 500,
                height: 500
                
            }                
        });
                chart.setView(view); 
        chart.draw();
    } //setChartView
    google.visualization.events.addListener(columnFilter, 'statechange', setChartView);
    setChartView();
    columnFilter.draw();
}//SpendingResponseHandler
