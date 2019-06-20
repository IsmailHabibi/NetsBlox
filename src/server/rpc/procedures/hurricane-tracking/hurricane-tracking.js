const lineReader = require('line-reader');
const path = require('path');

const table = [
    ['name', 'year', 'month', 'day', 'time', 'recordID', 'status', 'latitude', 'longitude', 'maxWind', 'minPressure']
];

let ALname = '';
let EPname = '';

const parseLine = function (type, line) {
    if (line.startsWith('AL')){
        ALname = line.substring(19, 28).trim();
    } else if (line.startsWith('EP')){
        EPname = line.substring(19, 28).trim();
    } else {
        let year = line.substring(0, 4);
        let month = line.substring(4,6);
        let day = line.substring(6,8);
        let time = line.substring(10,14);
        let recordID = line.substring(15,17);
        let status = line.substring(18,21).trim();
        let latitude = line.substring(23,27);
        let longitude = '-' + line.substring(30,35).trim();
        let maxWind = line.substring(39,41);
        let minPressure = line.substring(43,47).trim();
        let data = [type === 'AL'? ALname : EPname, year, month, day, time, recordID, status, latitude, longitude, maxWind, minPressure];
        table.push(data);
    }
};

lineReader.eachLine(path.join(__dirname,'hurdat2-1851-2018-051019.txt'), parseLine.bind(null, 'AL'));
lineReader.eachLine(path.join(__dirname,'hurdat2-nepac-1949-2017-050418.txt'), parseLine.bind(null, 'EP'));

const hurricaneTracker = {};

hurricaneTracker.serviceName = 'HurricaneInfo';

/**
 *
 * @param {string} name - name of the hurricane
 * @param {string} year - year that the hurricane occurred in
 * @returns {array} table - table with the information for all hurricanes matching the inputted name
 */

hurricaneTracker.getHurricane = function(name, year){
    let parsedTable = [table[0]];
    for (let i = 1; i < table.length; i++) {
        if (table[i][0] === name.toUpperCase() && table[i][1] === year.toString()){
            parsedTable.push(table[i]);
        }
    }
    if (parsedTable.length === 1) {
        return 'Invalid Hurricane Name or Year';
    }
    else {
        return parsedTable;
    }
};

/**
 *
 * @param {string} year - year to display in the table
 * @returns {array} table - table with the names of all hurricanes within the entered year
 */

hurricaneTracker.getNamesForYear = function(year){
    let parsedTable = Array();
    for (let i = 1; i < table.length; i++) {
        if (table[i][1] === year.toString()) {
            if (!parsedTable.includes(table[i][0]))
                parsedTable.push(table[i][0]);
        }
    }
    if (parsedTable.length === 1) {
        return 'Invalid Year';
    }
    else {
        return parsedTable;
    }
};
/**
 *
 * @param {string} name - name of the hurricane to find the year(s) of
 * @returns {array} table - list with all of the years that a particular name has been used for a hurricane
 */
hurricaneTracker.getYearsForName = function(name){
    let parsedTable = Array();
    for (let i = 1; i < table.length; i++) {
        if (table[i][0] === name.toUpperCase()) {
            if (!parsedTable.includes(table[i][1]))
                parsedTable.push(table[i][1]);
        }
    }
    if (parsedTable.length === 1) {
        return 'Invalid Name';
    }
    else {
        return parsedTable;
    }
};

/**
 *
 * @param {string} name - name of the hurricane to get the latitude of
 * @param {string} year - year that the hurricane occurred in
 * @returns {Array} table - list of all of the latitudes of the hurricane matching the entered parameters
 */

hurricaneTracker.getLatitude = function(name, year){
    let latitudes = [];
    for (let i = 1; i < table.length; i++) {
        if (table[i][0] === name.toUpperCase() && table[i][1] === year.toString()) {
            let row = table[i];
            latitudes.push(row[7]);
        }
    }
    if (latitudes.length === 0) {
        return 'Invalid name or year';
    }
    else {
        return latitudes;
    }
};

/**
 *
 * @param {string} name - name of the hurricane to get the longitude of
 * @param {string} year - year that the hurricane occurred in
 * @returns {Array} table - list of all of the longitudes of the hurricane matching the entered parameters
 */

hurricaneTracker.getLongitude = function(name, year){
    let longitudes = [];
    for (let i = 1; i < table.length; i++) {
        if (table[i][0] === name.toUpperCase() && table[i][1] === year.toString()) {
            let row = table[i];
            longitudes.push(row[8]);
        }
    }
    if (longitudes.length === 0) {
        return 'Invalid name or year';
    }
    else {
        return longitudes;
    }
};

module.exports = hurricaneTracker;

