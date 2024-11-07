/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9482758620689655, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "http://localhost:8000/client/payment.php"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/hall.php-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/hall.php-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/hall.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/hall.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/payment.php-7"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/payment.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/payment.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/payment.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/payment.php-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/payment.php-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/payment.php-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/payment.php-2"], "isController": false}, {"data": [0.5, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/hall.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/hall.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/hall.php-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/hall.php-7"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/index.php-7"], "isController": false}, {"data": [0.5, 500, 1500, "http://localhost:8000/client/index.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/index.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/scripts/sale_save.php"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/index.php-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/index.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/index.php-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/index.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/index.php-1"], "isController": false}, {"data": [0.5, 500, 1500, "http://localhost:8000/client/index.php"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8000/client/hall.php"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28, 0, 0.0, 83.53571428571429, 3, 869, 7.0, 212.3000000000008, 805.5499999999996, 869.0, 1.1728731202613831, 11.055163652452562, 1.4215850542453818], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://localhost:8000/client/payment.php", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 149.42124310661762, 42.537913602941174], "isController": false}, {"data": ["http://localhost:8000/client/hall.php-0", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 412.2721354166667, 53.955078125], "isController": false}, {"data": ["http://localhost:8000/client/hall.php-1", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 34.87723214285714, 105.88727678571428], "isController": false}, {"data": ["http://localhost:8000/client/hall.php-2", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 30.3955078125, 92.28515625], "isController": false}, {"data": ["http://localhost:8000/client/hall.php-3", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 34.737723214285715, 104.91071428571428], "isController": false}, {"data": ["http://localhost:8000/client/payment.php-7", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 81.0546875, 245.1171875], "isController": false}, {"data": ["http://localhost:8000/client/payment.php-3", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 60.791015625, 183.59375], "isController": false}, {"data": ["http://localhost:8000/client/payment.php-4", 1, 0, 0.0, 126.0, 126, 126, 126.0, 126.0, 126.0, 126.0, 7.936507936507936, 110.41356646825396, 5.673363095238095], "isController": false}, {"data": ["http://localhost:8000/client/payment.php-5", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 61.03515625, 183.837890625], "isController": false}, {"data": ["http://localhost:8000/client/payment.php-6", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 61.03515625, 183.837890625], "isController": false}, {"data": ["http://localhost:8000/client/payment.php-0", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 706.7522321428571, 92.91294642857143], "isController": false}, {"data": ["http://localhost:8000/client/payment.php-1", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 60.791015625, 185.302734375], "isController": false}, {"data": ["http://localhost:8000/client/payment.php-2", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 61.03515625, 184.5703125], "isController": false}, {"data": ["Test", 1, 0, 0.0, 1165.0, 1165, 1165, 1165.0, 1165.0, 1165.0, 1165.0, 0.8583690987124463, 113.41201716738198, 14.848779506437769], "isController": true}, {"data": ["http://localhost:8000/client/hall.php-4", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 102.29492187499999, 4.8971737132352935], "isController": false}, {"data": ["http://localhost:8000/client/hall.php-5", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 34.87723214285714, 105.05022321428571], "isController": false}, {"data": ["http://localhost:8000/client/hall.php-6", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 40.690104166666664, 122.55859375], "isController": false}, {"data": ["http://localhost:8000/client/hall.php-7", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 60.791015625, 183.837890625], "isController": false}, {"data": ["http://localhost:8000/client/index.php-7", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 5944.661458333333, 214.51822916666666], "isController": false}, {"data": ["http://localhost:8000/client/index.php-4", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 19.110040350274726, 0.9054666037087913], "isController": false}, {"data": ["http://localhost:8000/client/index.php-3", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 451.66015625, 80.4443359375], "isController": false}, {"data": ["http://localhost:8000/client/scripts/sale_save.php", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 66.015625, 132.03125], "isController": false}, {"data": ["http://localhost:8000/client/index.php-6", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 4458.49609375, 160.888671875], "isController": false}, {"data": ["http://localhost:8000/client/index.php-5", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 2972.4934895833335, 107.25911458333333], "isController": false}, {"data": ["http://localhost:8000/client/index.php-0", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 74.7726212686567, 8.818213619402984], "isController": false}, {"data": ["http://localhost:8000/client/index.php-2", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 989.2578125000001, 71.83159722222223], "isController": false}, {"data": ["http://localhost:8000/client/index.php-1", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 1035.15625, 108.23567708333333], "isController": false}, {"data": ["http://localhost:8000/client/index.php", 1, 0, 0.0, 869.0, 869, 869, 869.0, 869.0, 869.0, 869.0, 1.1507479861910241, 104.89337600690449, 5.891964542577676], "isController": false}, {"data": ["http://localhost:8000/client/hall.php", 1, 0, 0.0, 155.0, 155, 155, 155.0, 155.0, 155.0, 155.0, 6.451612903225806, 131.10509072580646, 36.98966733870968], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
