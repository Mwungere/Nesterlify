"use strict";

// proxy.js
var express = require("express");

var axios = require("axios");

var cors = require("cors");

var path = require("path");

var app = express();
var port = 3000;
app.use(cors());
app.use(express.json({
  limit: "10mb"
}));
app.use(express["static"](path.join(__dirname, "public")));

function calculateReturnDate(startDate, daysToAdd) {
  var date = new Date(startDate);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0];
}

app.post("/api/offer_requests", function _callee(req, res) {
  var response;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(axios.post("https://api.duffel.com/air/offer_requests", req.body, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer duffel_test_yJD3QAOfPnZhTZxpRSJHQXlU3w49f1jyueLSkx-W9ET",
              "Duffel-Version": "v1"
            }
          }));

        case 3:
          response = _context.sent;
          res.json(response.data);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);

          if (_context.t0.response) {
            console.error("Error Status:", _context.t0.response.status);
            console.error("Error Data:", JSON.stringify(_context.t0.response.data, null, 2));
            res.status(_context.t0.response.status).json(_context.t0.response.data);
          } else {
            console.error("Error Message:", _context.t0.message);
            res.status(500).json({
              error: _context.t0.message
            });
          }

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
app.post("/api/offers", function _callee2(req, res) {
  var today, reqBody, response, offersToDisplay;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          today = new Date().toISOString().split("T")[0];
          reqBody = {
            data: {
              slices: [{
                origin: "NYC",
                destination: "ATL",
                departure_date: today
              }, {
                origin: "ATL",
                destination: "NYC",
                departure_date: calculateReturnDate(today, 11)
              }],
              passengers: [{
                type: "adult"
              }, {
                type: "adult"
              }, {
                age: 1
              }],
              cabin_class: "business"
            }
          };
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(axios.post("https://api.duffel.com/air/offers", reqBody, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer duffel_test_yJD3QAOfPnZhTZxpRSJHQXlU3w49f1jyueLSkx-W9ET",
              "Duffel-Version": "v1"
            }
          }));

        case 5:
          response = _context2.sent;

          if (response.data && response.data.offers && response.data.offers.length > 0) {
            offersToDisplay = response.data.offers.slice(0, 3);
            res.json({
              offers: offersToDisplay
            });
          } else {
            console.log("No offers found!");
            res.json({
              message: "No offers found for your search criteria."
            });
          }

          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](2);

          if (_context2.t0.response) {
            console.error("Error Status:", _context2.t0.response.status);
            console.error("Error Data:", JSON.stringify(_context2.t0.response.data, null, 2));
            res.status(_context2.t0.response.status).json(_context2.t0.response.data);
          } else {
            console.error("Error Message:", _context2.t0.message);
            res.status(500).json({
              error: _context2.t0.message
            });
          }

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 9]]);
});
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.listen(port, function () {
  console.log("Proxy server running at http://localhost:".concat(port));
});