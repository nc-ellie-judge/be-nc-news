const db = require("../db/connection.js");
const fsPromises = require("fs").promises;

exports.selectAllEndpoints = () => {
    return fsPromises.readFile("./endpoints.json", "utf-8").then((endpoints) => {
        const parsedEndpoints = JSON.parse(endpoints);
        return { endpoints: parsedEndpoints };
    });
};