/* 
    "g20_Charts.js" - scripts to load the google charts, visualizing G20 military spendings,health care 
                    and educational data
*/


//Loading necessary google api packages 
google.charts.load('current',{'packages': ['corechart','geochart','controls']});
google.charts.setOnLoadCallback(drawAllSheets);

//Function to fetch data from the google sheets
function drawAllSheets(){
    drawSheetName('spendings_with_gdp','SELECT A,B,C,D,E,F,G,H,K,L,M,N,O,P,Q,T,U,V,W,X,Y,Z,AD,AE,AF,AG,AH,AI,AJ',SpendinggdpResponseHandler);
    drawSheetName('spendings_with_gdp','SELECT A,B,C,D,E,F,G,H,K,L,M,N,O,P,Q,T,U,V,W,X,Y,Z',SpendingResponseHandler);
    drawSheetName('percapita_education_with_percapitagdp','SELECT A,B,C,D,E,F,G,H,L,M,N,O,P,Q,R',edupercapitaResponseHandler);
    drawSheetName('percapita_health_care_with_percapitagdp','SELECT A,B,C,D,E,F,G,H,L,M,N,O,P,Q,R',healthpercapitaResponseHandler);
    drawSheetName('percapita_military_spending_with_percapitagdp','SELECT A,B,C,D,E,F,G,H,L,M,N,O,P,Q,R',militarypercapitaResponseHandler);
    drawSheetName('military_growth','SELECT A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U',militarygrowthResponseHandler);
    drawSheetName('healthcare_growth','SELECT A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U',healthgrowthResponseHandler);
    drawSheetName('educational_growth','SELECT A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U',edugrowthResponseHandler);
    drawSheetName('growth_percentage','SELECT A,B,C,D,E,F,G,K,L,M,N,O,P,S,T,U,V,W,X',growthResponseHandler);
    drawSheetName('spendings_with_gdp','SELECT AN,AO',totalSpentResponseHandler);
} //drawAllSheets


//function to call the google sheets
function drawSheetName(sheetName, query, responseHandler){
    var queryString = encodeURIComponent(query);
    var query = new google.visualization.Query(
        'https://docs.google.com/spreadsheets/d/140K89w_gWaHuGItp40Qc5uqhWMVTXgdFhRLAeZv2wzA/gviz/tq?sheet=' +
        sheetName + '&headers=1&tq='+queryString);
    query.send(responseHandler);  
}//drawSheetName


/** Spending Data with GDP Page */
//Spending Data with country's GDP
/** Category filter - to filter year values and view  */
function SpendinggdpResponseHandler(response){
    var data = response.getDataTable();
    data.sort({column: 25, desc:true});
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
            label:'Educational Spending'},{
                sourceColumn:columnsTable.getValue(row[1], 0),
                label:"Health Care Spending",},{
                    sourceColumn:columnsTable.getValue(row[2], 0),
                    label:"Military Spending"},{
                        sourceColumn:columnsTable.getValue(row[3], 0),
                        label:"Total GDP"} ]);
        var chart = new google.visualization.ChartWrapper({
            chartType: 'BarChart',
            containerId: 'spending_response_div',
            dataTable: data,
            options: {
                isStacked:true,
                legend: {position: 'top', maxLines: 3},
                width: 800,
                height: 600,
                colors: ['#ab0707','#a9c413','#DD4477','#0099C6'],
                hAxis: {title: 'Spendings in Billions (USD)'},
                vAxis: {title: 'country'}
            }                
        });
                chart.setView(view); 
        chart.draw();
    } //setChartView
    google.visualization.events.addListener(columnFilter, 'statechange', setChartView);
    setChartView();
    columnFilter.draw();
}//SpendingResponseHandler

/** Spending Data with GDP Page */

function SpendingResponseHandler(response){
    var data = response.getDataTable();
    data.sort({column: 20, desc:true});
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
        containerId: 'spend_filter_div',
        dataTable: columnsTable,
        options: {
            filterColumnLabel: 'colLabel',
            ui: {
                label: 'Year: ',
                allowTyping: false,
                allowMultiple: false,
                allowNone: false,
                
            },

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
            label:'Educational Spending'},{
                sourceColumn:columnsTable.getValue(row[1], 0),
                label:"Health Care Spending",},{
                    sourceColumn:columnsTable.getValue(row[2], 0),
                    label:"Military Spending"}]);
        var chart = new google.visualization.ChartWrapper({
            chartType: 'ColumnChart',
            containerId: 'spending_comp_response_div',
            dataTable: data,
            options: {
                width: 800,
                height: 600,
                colors: ['#990099','#bea413','#e67300'],
                vAxis: {title: 'Spendings in Billions (USD)'},
                hAxis: {title: 'country'}
            }                
        });
        chart.setView(view); 
        chart.draw();
    } //setChartView
    google.visualization.events.addListener(columnFilter, 'statechange', setChartView);
    setChartView();
    columnFilter.draw();
}//SpendingResponseHandler

/** per capita splits Page */

function edupercapitaResponseHandler(response){
    var data = response.getDataTable();
    data.sort({column: 14, desc:true});
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
        containerId: 'edu_per_filter_div',
        dataTable: columnsTable,
        options: {
            filterColumnLabel: 'colLabel',
            ui: {
                label: 'Year: ',
                allowTyping: false,
                allowMultiple: false,
                allowNone: false,
                
            },

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
            label:'percapita educational spending'},{
                sourceColumn:columnsTable.getValue(row[1], 0),
                label:"percapita gdp",}]);
        var chart = new google.visualization.ChartWrapper({
            chartType: 'BarChart',
            containerId: 'edu_per_response_div',
            dataTable: data,
            options: {
                width: 800,
                height: 600,
                colors: ['#F08080','#DC143C'],
                hAxis: {title: 'per capita Spendings'},
                vAxis: {title: 'country'}
            }                
        });
 
        chart.setView(view); 
        chart.draw();

    } //setChartView
    google.visualization.events.addListener(columnFilter, 'statechange', setChartView);
    setChartView();
    columnFilter.draw();
}//edupercapitaResponseHandler

/** per capita splits Page */

function healthpercapitaResponseHandler(response){
    var data = response.getDataTable();
    data.sort({column: 14, desc:true});
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
        containerId: 'health_per_filter_div',
        dataTable: columnsTable,
        options: {
            filterColumnLabel: 'colLabel',
            ui: {
                label: 'Year: ',
                allowTyping: false,
                allowMultiple: false,
                allowNone: false,
                
            },

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
            label:'percapita health spending'},{
                sourceColumn:columnsTable.getValue(row[1], 0),
                label:"percapita gdp",}]);
        var chart = new google.visualization.ChartWrapper({
            chartType: 'BarChart',
            containerId: 'health_per_response_div',
            dataTable: data,
            options: {
                width: 800,
                height: 700,
                colors: ['#A0522D','#F4A460'],
                hAxis: {title: 'per capita Spendings'},
                vAxis: {title: 'country'}
            }                
        });
 
        chart.setView(view); 
        chart.draw();

    } //setChartView
    google.visualization.events.addListener(columnFilter, 'statechange', setChartView);
    setChartView();
    columnFilter.draw();
}//healthpercapitaResponseHandler

/** per capita splits Page */
function militarypercapitaResponseHandler(response){
    var data = response.getDataTable();
    data.sort({column: 14, desc:true});
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
        containerId: 'military_per_filter_div',
        dataTable: columnsTable,
        options: {
            filterColumnLabel: 'colLabel',
            ui: {
                label: 'Year: ',
                allowTyping: false,
                allowMultiple: false,
                allowNone: false,
                
            },

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
            label:'percapita military spending'},{
                sourceColumn:columnsTable.getValue(row[1], 0),
                label:"percapita gdp",}]);
        var chart = new google.visualization.ChartWrapper({
            chartType: 'BarChart',
            containerId: 'military_per_response_div',
            dataTable: data,
            options: {
                legend: {position: 'top', maxLines: 3},
                width: 800,
                height: 700,
                colors: ['#aaaa11','#2a778d'],
                hAxis: {title: 'per capita Spendings'},
                vAxis: {title: 'country'}
            }                
        });
        chart.setView(view); 
        chart.draw();

    } //setChartView
    google.visualization.events.addListener(columnFilter, 'statechange', setChartView);
    setChartView();
    columnFilter.draw();
}//militarypercapitaResponseHandler

/** Growth Rate Trends Page */
function militarygrowthResponseHandler(response){
    var data = response.getDataTable();
    var formatter = new google.visualization.DateFormat({pattern: 'yyyy'});
    formatter.format(data,0);
    var initState= {selectedValues: []};
    var columnsTable = new google.visualization.DataTable();
    columnsTable.addColumn('number', 'colIndex');
    columnsTable.addColumn('string', 'colLabel');
    for (var i = 1; i < data.getNumberOfColumns(); i++) {
        columnsTable.addRow([i, data.getColumnLabel(i)]);
     }
    initState.selectedValues.push(data.getColumnLabel(data.getNumberOfColumns()-2));
    var columnFilter = new google.visualization.ControlWrapper({
        controlType: 'CategoryFilter',
        containerId: 'military_growth_filter_div',
        dataTable: columnsTable,
        options: {
            filterColumnLabel: 'colLabel',
            ui: {
                label: 'Country : ',
                allowTyping: false,
                allowMultiple: false,
                allowNone: false,
                
            },

        },
        state: initState
    });
    function setChartView() {
        var state = columnFilter.getState();
        var row;
        var view = new google.visualization.DataView(data);
        row = columnsTable.getFilteredRows([{column: 1, value: state.selectedValues[0]}]);
        view.setColumns([0, columnsTable.getValue(row[0],0)]);
        var chart = new google.visualization.ChartWrapper({
            chartType: 'Line',
            containerId: 'mil_growth_response_div',
            dataTable: data,
            options: {
                width: 800,
                height: 400,
                colors: ['#BC8F8F'],
                hAxis: {format: 'YYYY'},
                vAxis: {title: 'Growth Rate'},
                hAxis: {title: 'Growth Rate'}
            }                
        });

        chart.setView(view); 
        chart.draw();


    } //setChartView
    google.visualization.events.addListener(columnFilter, 'statechange', setChartView);
    setChartView();
    columnFilter.draw();
}//militarygrowthResponseHandler
/** Growth Rate Trends Page */
function healthgrowthResponseHandler(response){
    var data = response.getDataTable();
    var formatter = new google.visualization.DateFormat({pattern: 'yyyy'});
    formatter.format(data,0);
    var initState= {selectedValues: []};
    var columnsTable = new google.visualization.DataTable();
    columnsTable.addColumn('number', 'colIndex');
    columnsTable.addColumn('string', 'colLabel');
    for (var i = 1; i < data.getNumberOfColumns(); i++) {
        columnsTable.addRow([i, data.getColumnLabel(i)]);
     }
    initState.selectedValues.push(data.getColumnLabel(data.getNumberOfColumns()-2));
    var columnFilter = new google.visualization.ControlWrapper({
        controlType: 'CategoryFilter',
        containerId: 'health_growth_filter_div',
        dataTable: columnsTable,
        options: {
            filterColumnLabel: 'colLabel',
            ui: {
                label: 'Country : ',
                allowTyping: false,
                allowMultiple: false,
                allowNone: false,
                
            },

        },
        state: initState
    });
    function setChartView() {
        var state = columnFilter.getState();
        var row;
        var view = new google.visualization.DataView(data);
        row = columnsTable.getFilteredRows([{column: 1, value: state.selectedValues[0]}]);
        view.setColumns([0, columnsTable.getValue(row[0],0)]);
        var chart = new google.visualization.ChartWrapper({
            chartType: 'Line',
            containerId: 'health_growth_response_div',
            dataTable: data,
            options: {
                width: 800,
                height: 400,
                colors: ['#2F4F4F'],
                hAxis: {format: 'YYYY'},
                vAxis: {title: 'Growth Rate'}
            }                
        });

        chart.setView(view); 
        chart.draw();


    } //setChartView
    google.visualization.events.addListener(columnFilter, 'statechange', setChartView);
    setChartView();
    columnFilter.draw();
}//healthgrowthResponseHandler

/** Growth Rate Trends Page */
function edugrowthResponseHandler(response){
    var data = response.getDataTable();
    var formatter = new google.visualization.DateFormat({pattern: 'yyyy'});
    formatter.format(data,0);
    var initState= {selectedValues: []};
    var columnsTable = new google.visualization.DataTable();
    columnsTable.addColumn('number', 'colIndex');
    columnsTable.addColumn('string', 'colLabel');
    for (var i = 1; i < data.getNumberOfColumns(); i++) {
        columnsTable.addRow([i, data.getColumnLabel(i)]);
     }
    initState.selectedValues.push(data.getColumnLabel(data.getNumberOfColumns()-2));
    var columnFilter = new google.visualization.ControlWrapper({
        controlType: 'CategoryFilter',
        containerId: 'edu_growth_filter_div',
        dataTable: columnsTable,
        options: {
            filterColumnLabel: 'colLabel',
            ui: {
                label: 'Country : ',
                allowTyping: false,
                allowMultiple: false,
                allowNone: false,
                
            },

        },
        state: initState
    });
    function setChartView() {
        var state = columnFilter.getState();
        var row;
        var view = new google.visualization.DataView(data);
        row = columnsTable.getFilteredRows([{column: 1, value: state.selectedValues[0]}]);
        view.setColumns([0, columnsTable.getValue(row[0],0)]);
        var chart = new google.visualization.ChartWrapper({
            chartType: 'Line',
            containerId: 'edu_growth_response_div',
            dataTable: data,
            options: {
                width: 800,
                height: 300,
                colors: ['#aaaa11'],
                hAxis: {format: 'YYYY'},
                vAxis: {title: 'Growth Rate'}
            }                
        });

        chart.setView(view); 
        chart.draw();


    } //setChartView
    google.visualization.events.addListener(columnFilter, 'statechange', setChartView);
    setChartView();
    columnFilter.draw();
}//edugrowthResponseHandler

/** Growth Rate Trends Page */
function growthResponseHandler(response){
    var data = response.getDataTable();
    data.sort({column: 6, desc:true});
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
        containerId: 'growth_filter_div',
        dataTable: columnsTable,
        options: {
            filterColumnLabel: 'colLabel',
            ui: {
                label: 'Year: ',
                allowTyping: false,
                allowMultiple: false,
                allowNone: false,
                
            },

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
            label:'Military Growth'},{
                sourceColumn:columnsTable.getValue(row[1], 0),
                label:"Health Care Growth",},{
                    sourceColumn:columnsTable.getValue(row[2], 0),
                    label:"Educational Growth"}]);
        var chart = new google.visualization.ChartWrapper({
            chartType: 'ColumnChart',
            containerId: 'growth_comp_response_div',
            dataTable: data,
            options: {
                legend: {position: 'top', maxLines: 3},
                width: 800,
                height: 600,
                colors: ['#BDB76B','#556B2F','#800080'],
                vAxis: {title: 'Percentage(Growth Rate)'},
                hAxis: {title: 'country'}
            }                
        });

        chart.setView(view); 
        chart.draw();

    } //setChartView
    google.visualization.events.addListener(columnFilter, 'statechange', setChartView);
    setChartView();
    columnFilter.draw();
}//growthResponseHandler
/** Growth Rate Trends Page */
function totalSpentResponseHandler(response){
    var data = response.getDataTable();
    var options = {
        colorAxis: {colors: ['teal', 'dodgerblue']},
        width: 1200,
        height: 500
        
    };
    var chart = new google.visualization.GeoChart(document.getElementById('total_spending_div'));
    chart.draw(data,options);

}//totalSpentResponseHandler



