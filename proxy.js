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
          Authorization: "Bearer duffel_test_p94uLT5WAI3D9qRlbPD30LQ_t0MbGF9XUP6tBqf1Ixl",
          "Duffel-Version": "v1",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    handleError(error, res);
  }
});

app.get("/api/offers/:offer_request_id", async (req, res) => {
  const { offer_request_id } = req.params;
  try {
    const response = await axios.get(
      `https://api.duffel.com/air/offers?offer_request_id=${offer_request_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer duffel_test_p94uLT5WAI3D9qRlbPD30LQ_t0MbGF9XUP6tBqf1Ixl",
          "Duffel-Version": "v1",
        },
      }
    );

    if (response.data && response.data.data && response.data.data.length > 0) {
      const offersToDisplay = response.data.data.slice(0, 3);
      res.json({ offers: offersToDisplay });
    } else {
      console.log("No offers found!");
      res.json({ message: "No offers found for your search criteria." });
    }
  } catch (error) {
    handleError(error, res);
  }
});

function handleError(error, res) {
  if (error.response) {
    console.error("Error Status:", error.response.status);
    console.error("Error Data:", JSON.stringify(error.response.data, null, 2));
    res.status(error.response.status).json(error.response.data);
  } else {
    console.error("Error Message:", error.message);
    res.status(500).json({ error: error.message });
  }
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
