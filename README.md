🌱 GreenLedger – Blockchain-Based Supply Chain Transparency
📌 Introduction

GreenLedger is a blockchain-powered platform designed to bring trust, transparency, and efficiency to the agricultural supply chain.
It ensures secure payments, product traceability, and stakeholder accountability using Polygon blockchain and smart contracts while supporting both smartphone and non-smartphone farmers.

⭐ Key Highlights

Immutable Records: Every crop, transaction, and delivery is securely stored on blockchain.

Smart Payments (Escrow): Automatic release of funds to farmers and transporters after verified delivery.

Trust Score System: Reputation tracking for farmers, transporters, and retailers.

QR Code Traceability: Consumers can scan and verify the origin and journey of produce.

User Dashboards: Role-based dashboards for Farmers, Transporters, Retailers, Consumers, and Admins.

Accessibility: Support for SMS/IVR to include farmers without smartphones.

Analytics Dashboard: Real-time insights for admins and policy makers.

🏗️ Tech Stack
⚙️ Core Framework & Tools

React + TypeScript → Frontend

Node.js + Express.js → Backend

Vite → Fast build & dev server

🎨 Styling & UI

Tailwind CSS, ShadCN/UI, Framer Motion → Responsive & animated UI

Lucide Icons → Modern icons

🔗 Blockchain Integration

Polygon (Mumbai Testnet) → Low-cost blockchain network

Solidity Smart Contracts → Payments, trust score updates, escrow

QR Code Integration → Crop traceability

📊 Data & State Management

React Query, Zustand → Data & client state

PostgreSQL → Relational database

Zod → Schema validation

📡 Specialized Features

Recharts → Analytics & data visualization

IVR/SMS API → Support for non-smartphone farmers

Geolocation → Odisha district-level operations

🌍 Impact

Economic: Timely and fair payments for farmers.

Social: Builds trust among all supply chain stakeholders.

Consumer: Verified authenticity of agricultural produce.

Scalable: Odisha-first, with pan-India expansion potential.

🔄 Workflow (Text-Based)

Farmer Registration

Farmer registers via app/SMS/IVR.

Uploads crop details (type, quantity, location).

A unique QR code is generated for the crop batch.

Transporter Allocation

Transporter accepts delivery request.

Transporter’s trust score and availability are verified.

Retailer Request

Retailer places an order for crops.

Payment is locked in a blockchain-based escrow smart contract.

Crop Delivery

Transporter delivers produce to retailer.

Retailer scans the QR code to verify origin and authenticity.

Smart Payment Release

Once delivery is confirmed, blockchain triggers automatic payment release:

Farmer gets crop payment.

Transporter gets delivery fee.

Trust Score Update

Ratings and trust scores for Farmer, Transporter, Retailer are updated on blockchain.

Consumer Verification

End-consumer scans QR code on the product.

Can view entire journey: Farmer → Transporter → Retailer → Consumer.

Admin & Analytics

Admin monitors supply chain data.

Analytics dashboard shows crop flow, payments, and trust metrics.

✨ GreenLedger – Empowering farmers, enabling trust, and making agriculture future-ready with blockchain. 🌱