const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:3000",
      "http://127.0.0.1:8080",
    ],
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data storage directory
const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, "subscriptions.json");
const PAYMENTS_FILE = path.join(DATA_DIR, "payments.json");
const BILLING_FILE = path.join(DATA_DIR, "billing.json");

// Ensure data directory exists
fs.ensureDirSync(DATA_DIR);

// Initialize data files if they don't exist
const initializeDataFiles = async () => {
  try {
    if (!(await fs.pathExists(USERS_FILE))) {
      await fs.writeJson(USERS_FILE, {});
    }
    if (!(await fs.pathExists(SUBSCRIPTIONS_FILE))) {
      await fs.writeJson(SUBSCRIPTIONS_FILE, {});
    }
    if (!(await fs.pathExists(PAYMENTS_FILE))) {
      await fs.writeJson(PAYMENTS_FILE, {});
    }
    if (!(await fs.pathExists(BILLING_FILE))) {
      await fs.writeJson(BILLING_FILE, {});
    }
  } catch (error) {
    console.error("Error initializing data files:", error);
  }
};

// Helper functions
const readJsonFile = async (filePath) => {
  try {
    return await fs.readJson(filePath);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return {};
  }
};

const writeJsonFile = async (filePath, data) => {
  try {
    await fs.writeJson(filePath, data, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Sonicly Server is running!",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// User routes
app.get("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await readJsonFile(USERS_FILE);
    const user = users[userId];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;

    const users = await readJsonFile(USERS_FILE);
    users[userId] = {
      ...users[userId],
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    const success = await writeJsonFile(USERS_FILE, users);
    if (success) {
      res.json({
        message: "User data saved successfully",
        user: users[userId],
      });
    } else {
      res.status(500).json({ error: "Failed to save user data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Subscription routes
app.get("/api/subscriptions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const subscriptions = await readJsonFile(SUBSCRIPTIONS_FILE);
    const userSubscriptions = subscriptions[userId] || [];

    res.json(userSubscriptions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/subscriptions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const subscriptionData = req.body;

    const subscriptions = await readJsonFile(SUBSCRIPTIONS_FILE);
    if (!subscriptions[userId]) {
      subscriptions[userId] = [];
    }

    const newSubscription = {
      id: uuidv4(),
      ...subscriptionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    subscriptions[userId].push(newSubscription);

    const success = await writeJsonFile(SUBSCRIPTIONS_FILE, subscriptions);
    if (success) {
      res.json({
        message: "Subscription added successfully",
        subscription: newSubscription,
      });
    } else {
      res.status(500).json({ error: "Failed to save subscription" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/subscriptions/:userId/:subscriptionId", async (req, res) => {
  try {
    const { userId, subscriptionId } = req.params;
    const updateData = req.body;

    const subscriptions = await readJsonFile(SUBSCRIPTIONS_FILE);
    if (!subscriptions[userId]) {
      return res.status(404).json({ error: "User subscriptions not found" });
    }

    const subscriptionIndex = subscriptions[userId].findIndex(
      (sub) => sub.id === subscriptionId,
    );
    if (subscriptionIndex === -1) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    subscriptions[userId][subscriptionIndex] = {
      ...subscriptions[userId][subscriptionIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    const success = await writeJsonFile(SUBSCRIPTIONS_FILE, subscriptions);
    if (success) {
      res.json({
        message: "Subscription updated successfully",
        subscription: subscriptions[userId][subscriptionIndex],
      });
    } else {
      res.status(500).json({ error: "Failed to update subscription" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Payment methods routes
app.get("/api/payments/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await readJsonFile(PAYMENTS_FILE);
    const userPayments = payments[userId] || [];

    res.json(userPayments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/payments/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const paymentData = req.body;

    const payments = await readJsonFile(PAYMENTS_FILE);
    if (!payments[userId]) {
      payments[userId] = [];
    }

    const newPayment = {
      id: uuidv4(),
      ...paymentData,
      createdAt: new Date().toISOString(),
    };

    payments[userId].push(newPayment);

    const success = await writeJsonFile(PAYMENTS_FILE, payments);
    if (success) {
      res.json({
        message: "Payment method added successfully",
        payment: newPayment,
      });
    } else {
      res.status(500).json({ error: "Failed to save payment method" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/payments/:userId/:paymentId", async (req, res) => {
  try {
    const { userId, paymentId } = req.params;

    const payments = await readJsonFile(PAYMENTS_FILE);
    if (!payments[userId]) {
      return res.status(404).json({ error: "User payments not found" });
    }

    payments[userId] = payments[userId].filter(
      (payment) => payment.id !== paymentId,
    );

    const success = await writeJsonFile(PAYMENTS_FILE, payments);
    if (success) {
      res.json({ message: "Payment method removed successfully" });
    } else {
      res.status(500).json({ error: "Failed to remove payment method" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Billing history routes
app.get("/api/billing/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const billing = await readJsonFile(BILLING_FILE);
    const userBilling = billing[userId] || [];

    res.json(userBilling);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/billing/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const billingData = req.body;

    const billing = await readJsonFile(BILLING_FILE);
    if (!billing[userId]) {
      billing[userId] = [];
    }

    const newBilling = {
      id: uuidv4(),
      ...billingData,
      createdAt: new Date().toISOString(),
    };

    billing[userId].unshift(newBilling); // Add to beginning for latest first

    const success = await writeJsonFile(BILLING_FILE, billing);
    if (success) {
      res.json({
        message: "Billing record added successfully",
        billing: newBilling,
      });
    } else {
      res.status(500).json({ error: "Failed to save billing record" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
const startServer = async () => {
  await initializeDataFiles();

  app.listen(PORT, () => {
    console.log(`🚀 Sonicly Server is running on http://localhost:${PORT}`);
    console.log(`📁 Data directory: ${DATA_DIR}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💻 Frontend URL: http://localhost:8080`);
  });
};

startServer();
