// proxy.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

function calculateReturnDate(startDate, daysToAdd) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0];
}

app.post("/api/offer_requests", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.duffel.com/air/offer_requests",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer duffel_test_yJD3QAOfPnZhTZxpRSJHQXlU3w49f1jyueLSkx-W9ET",
          "Duffel-Version": "v1",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error Status:", error.response.status);
      console.error(
        "Error Data:",
        JSON.stringify(error.response.data, null, 2)
      );
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error("Error Message:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
});

app.post("/api/offers", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const reqBody = {
    data: {
      slices: [
        {
          origin: "NYC",
          destination: "ATL",
          departure_date: today,
        },
        {
          origin: "ATL",
          destination: "NYC",
          departure_date: calculateReturnDate(today, 11),
        },
      ],
      passengers: [{ type: "adult" }, { type: "adult" }, { age: 1 }],
      cabin_class: "business",
    },
  };

  try {
    const response = await axios.post(
      "https://api.duffel.com/air/offers",
      reqBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer duffel_test_yJD3QAOfPnZhTZxpRSJHQXlU3w49f1jyueLSkx-W9ET",
          "Duffel-Version": "v1",
        },
      }
    );

    if (
      response.data &&
      response.data.offers &&
      response.data.offers.length > 0
    ) {
      const offersToDisplay = response.data.offers.slice(0, 3);
      res.json({ offers: offersToDisplay });
    } else {
      console.log("No offers found!");
      res.json({ message: "No offers found for your search criteria." });
    }
  } catch (error) {
    if (error.response) {
      console.error("Error Status:", error.response.status);
      console.error(
        "Error Data:",
        JSON.stringify(error.response.data, null, 2)
      );
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error("Error Message:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
