# Book Draft

Free flight itinerary generator for visa applications. Search real flights via Google Flights, generate professional PDF itineraries, and download them instantly.

## Features

- **Real Flight Data** — Search live flights from Google Flights via Scrappa API
- **PDF Generation** — Professional flight itinerary PDFs with airline details, passenger info, and booking reference
- **Free Download** — Download watermarked PDFs for free
- **Premium Option** — Remove watermarks with a small USDT payment (2 USDT)
- **100+ Airports** — Search worldwide airports across all continents
- **Mobile Friendly** — Fully responsive design

## Tech Stack

- **Framework:** [Astro 7](https://astro.build) + React
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **PDF:** [@react-pdf/renderer](https://react-pdf.org)
- **Flight Data:** [Scrappa API](https://scrappa.co) (Google Flights scraper)
- **Payments:** USDT BEP20 + [BscScan API](https://bscscan.com) verification
- **Deployment:** [Vercel](https://vercel.com) (free tier)

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/vahidtakro/bookdraft.git
cd bookdraft
npm install
```

### 2. Set Up API Keys

Copy the example env file and fill in your keys:

```bash
cp .env.example .env
```

You need:

| Key | Where to get | Free? |
|-----|-------------|-------|
| `SCRAPPA_API_KEY` | [scrappa.co](https://scrappa.co/register) | Yes, 500 credits/month |
| `BSCSCAN_API_KEY` | [bscscan.com](https://bscscan.com/myapikey) | Yes, 100k calls/day |
| `WALLET_ADDRESS` | Your USDT BEP20 wallet | - |
| `PUBLIC_WALLET_ADDRESS` | Same as above (shown in UI) | - |

### 3. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321)

## Environment Variables

```env
# Scrappa Google Flights API
SCRAPPA_API_KEY=your_scrappa_api_key_here

# BscScan API (for payment verification)
BSCSCAN_API_KEY=your_bscscan_api_key_here

# USDT BEP20 wallet address
WALLET_ADDRESS=0xYourWalletAddressHere
PUBLIC_WALLET_ADDRESS=0xYourWalletAddressHere
```

## Project Structure

```
bookdraft/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── App.tsx          # Main app orchestrator
│   │   ├── FlightSearch.tsx # Search form with airport autocomplete
│   │   ├── FlightResults.tsx# Flight results display
│   │   ├── PassengerForm.tsx# Passenger information form
│   │   ├── PaymentGate.tsx  # USDT QR code + payment verification
│   │   ├── DownloadPage.tsx # PDF preview + download
│   │   └── ItineraryPDF.tsx # PDF document component
│   ├── pages/
│   │   ├── index.astro      # Home page
│   │   └── api/
│   │       ├── search.ts    # Flight search API (Scrappa)
│   │       └── verify.ts    # Payment verification API (BscScan)
│   ├── lib/
│   │   ├── types.ts         # TypeScript types
│   │   └── bscscan.ts       # BscScan helper
│   └── styles/
│       └── global.css       # Global styles
├── .env.example
├── astro.config.mjs
└── package.json
```

## How It Works

1. **Search** — User selects airports and date, searches for flights
2. **Select** — Browse real flight results with prices, times, and airlines
3. **Passenger** — Enter passenger details (name, passport, nationality, etc.)
4. **Download** — Preview and download PDF itinerary
   - **Free:** Download with watermark
   - **Paid:** Pay 2 USDT to remove watermark

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

```bash
npm run build
```

The build output goes to `./dist/` and is configured for Vercel's serverless functions.

## Customization

### Wallet Address

Update `WALLET_ADDRESS` and `PUBLIC_WALLET_ADDRESS` in `.env` with your USDT BEP20 wallet.

### Payment Amount

Change the payment amount in `PaymentGate.tsx` (currently 2 USDT).

### Watermark Text

Edit the watermark in `ItineraryPDF.tsx` — currently set to "SAMPLE".

## License

MIT
