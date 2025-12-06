import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Plane, Calendar, Clock, DollarSign, MapPin, Search, Info, X } from 'lucide-react';

/* --- DATASETS --- */
const AIRPORTS = [
  // North America
  { code: 'JFK', city: 'New York', country: 'USA', lat: 40.6413, lon: -73.7781 },
  { code: 'LAX', city: 'Los Angeles', country: 'USA', lat: 33.9416, lon: -118.4085 },
  { code: 'SFO', city: 'San Francisco', country: 'USA', lat: 37.6213, lon: -122.3790 },
  { code: 'YYZ', city: 'Toronto', country: 'Canada', lat: 43.6777, lon: -79.6248 },
  { code: 'ORD', city: 'Chicago', country: 'USA', lat: 41.9742, lon: -87.9073 },
  { code: 'ATL', city: 'Atlanta', country: 'USA', lat: 33.6407, lon: -84.4277 },
  { code: 'MIA', city: 'Miami', country: 'USA', lat: 25.7959, lon: -80.2870 },
  { code: 'DFW', city: 'Dallas', country: 'USA', lat: 32.8998, lon: -97.0403 },
  { code: 'DEN', city: 'Denver', country: 'USA', lat: 39.8561, lon: -104.6737 },
  { code: 'YVR', city: 'Vancouver', country: 'Canada', lat: 49.1947, lon: -123.1762 },
  { code: 'MEX', city: 'Mexico City', country: 'Mexico', lat: 19.4361, lon: -99.0719 },
  { code: 'SEA', city: 'Seattle', country: 'USA', lat: 47.4502, lon: -122.3088 },
  { code: 'LAS', city: 'Las Vegas', country: 'USA', lat: 36.0840, lon: -115.1537 },
  { code: 'BOS', city: 'Boston', country: 'USA', lat: 42.3656, lon: -71.0096 },
  { code: 'IAH', city: 'Houston', country: 'USA', lat: 29.9902, lon: -95.3368 },
  { code: 'YUL', city: 'Montreal', country: 'Canada', lat: 45.4657, lon: -73.7455 },
  { code: 'CLT', city: 'Charlotte', country: 'USA', lat: 35.2140, lon: -80.9431 },
  { code: 'PHX', city: 'Phoenix', country: 'USA', lat: 33.4341, lon: -112.0080 },
  { code: 'MCO', city: 'Orlando', country: 'USA', lat: 28.4312, lon: -81.3081 },
  { code: 'DTW', city: 'Detroit', country: 'USA', lat: 42.2162, lon: -83.3554 },
  { code: 'MSP', city: 'Minneapolis', country: 'USA', lat: 44.8848, lon: -93.2223 },
  { code: 'PHL', city: 'Philadelphia', country: 'USA', lat: 39.8729, lon: -75.2437 },

  // South America
  { code: 'GRU', city: 'São Paulo', country: 'Brazil', lat: -23.4356, lon: -46.4731 },
  { code: 'BOG', city: 'Bogotá', country: 'Colombia', lat: 4.7016, lon: -74.1469 },
  { code: 'LIM', city: 'Lima', country: 'Peru', lat: -12.0241, lon: -77.1143 },
  { code: 'SCL', city: 'Santiago', country: 'Chile', lat: -33.3930, lon: -70.7858 },
  { code: 'EZE', city: 'Buenos Aires', country: 'Argentina', lat: -34.8150, lon: -58.5348 },
  { code: 'GIG', city: 'Rio de Janeiro', country: 'Brazil', lat: -22.8134, lon: -43.2494 },
  { code: 'PTY', city: 'Panama City', country: 'Panama', lat: 9.0714, lon: -79.3835 },

  // Europe
  { code: 'LHR', city: 'London', country: 'UK', lat: 51.4700, lon: -0.4543 },
  { code: 'CDG', city: 'Paris', country: 'France', lat: 49.0097, lon: 2.5479 },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', lat: 50.0379, lon: 8.5622 },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', lat: 52.3105, lon: 4.7683 },
  { code: 'MAD', city: 'Madrid', country: 'Spain', lat: 40.4839, lon: -3.5679 },
  { code: 'BCN', city: 'Barcelona', country: 'Spain', lat: 41.2974, lon: 2.0833 },
  { code: 'FCO', city: 'Rome', country: 'Italy', lat: 41.8003, lon: 12.2389 },
  { code: 'MUC', city: 'Munich', country: 'Germany', lat: 48.3537, lon: 11.7750 },
  { code: 'ZRH', city: 'Zurich', country: 'Switzerland', lat: 47.4582, lon: 8.5555 },
  { code: 'IST', city: 'Istanbul', country: 'Turkey', lat: 41.2753, lon: 28.7519 },
  { code: 'DUB', city: 'Dublin', country: 'Ireland', lat: 53.4264, lon: -6.2499 },
  { code: 'CPH', city: 'Copenhagen', country: 'Denmark', lat: 55.6180, lon: 12.6508 },
  { code: 'ARN', city: 'Stockholm', country: 'Sweden', lat: 59.6498, lon: 17.9238 },
  { code: 'OSL', city: 'Oslo', country: 'Norway', lat: 60.1975, lon: 11.1004 },
  { code: 'VIE', city: 'Vienna', country: 'Austria', lat: 48.1103, lon: 16.5697 },
  { code: 'WAW', city: 'Warsaw', country: 'Poland', lat: 52.1672, lon: 20.9679 },
  { code: 'LIS', city: 'Lisbon', country: 'Portugal', lat: 38.7756, lon: -9.1354 },
  { code: 'HEL', city: 'Helsinki', country: 'Finland', lat: 60.3172, lon: 24.9633 },
  { code: 'BRU', city: 'Brussels', country: 'Belgium', lat: 50.9010, lon: 4.4856 },
  { code: 'GVA', city: 'Geneva', country: 'Switzerland', lat: 46.2370, lon: 6.1092 },
  { code: 'MAN', city: 'Manchester', country: 'UK', lat: 53.3656, lon: -2.2728 },
  { code: 'MXP', city: 'Milan', country: 'Italy', lat: 45.6301, lon: 8.7255 },

  // Middle East & Africa
  { code: 'DXB', city: 'Dubai', country: 'UAE', lat: 25.2532, lon: 55.3657 },
  { code: 'DOH', city: 'Doha', country: 'Qatar', lat: 25.2731, lon: 51.5276 },
  { code: 'AUH', city: 'Abu Dhabi', country: 'UAE', lat: 24.4330, lon: 54.6511 },
  { code: 'RUH', city: 'Riyadh', country: 'Saudi Arabia', lat: 24.9576, lon: 46.6988 },
  { code: 'CAI', city: 'Cairo', country: 'Egypt', lat: 30.1219, lon: 31.4056 },
  { code: 'JNB', city: 'Johannesburg', country: 'South Africa', lat: -26.1367, lon: 28.2411 },
  { code: 'CPT', city: 'Cape Town', country: 'South Africa', lat: -33.9715, lon: 18.6021 },
  { code: 'ADD', city: 'Addis Ababa', country: 'Ethiopia', lat: 8.9779, lon: 38.7993 },
  { code: 'CMN', city: 'Casablanca', country: 'Morocco', lat: 33.3675, lon: -7.5899 },
  { code: 'LOS', city: 'Lagos', country: 'Nigeria', lat: 6.5774, lon: 3.3212 },
  { code: 'NBO', city: 'Nairobi', country: 'Kenya', lat: -1.3192, lon: 36.9275 },
  { code: 'TLV', city: 'Tel Aviv', country: 'Israel', lat: 32.0055, lon: 34.8854 },
  { code: 'AMM', city: 'Amman', country: 'Jordan', lat: 31.7226, lon: 35.9935 },

  // Asia
  { code: 'HND', city: 'Tokyo', country: 'Japan', lat: 35.5494, lon: 139.7798 },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', lat: 1.3644, lon: 103.9915 },
  { code: 'HKG', city: 'Hong Kong', country: 'China', lat: 22.3080, lon: 113.9185 },
  { code: 'ICN', city: 'Seoul', country: 'South Korea', lat: 37.4602, lon: 126.4407 },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', lat: 13.6900, lon: 100.7501 },
  { code: 'DEL', city: 'New Delhi', country: 'India', lat: 28.5562, lon: 77.1000 },
  { code: 'BOM', city: 'Mumbai', country: 'India', lat: 19.0896, lon: 72.8656 },
  { code: 'BLR', city: 'Bengaluru', country: 'India', lat: 13.1986, lon: 77.7066 },
  { code: 'MAA', city: 'Chennai', country: 'India', lat: 12.9941, lon: 80.1709 },
  { code: 'PEK', city: 'Beijing', country: 'China', lat: 40.0799, lon: 116.6031 },
  { code: 'PVG', city: 'Shanghai', country: 'China', lat: 31.1443, lon: 121.8083 },
  { code: 'CAN', city: 'Guangzhou', country: 'China', lat: 23.3925, lon: 113.2988 },
  { code: 'TPE', city: 'Taipei', country: 'Taiwan', lat: 25.0797, lon: 121.2342 },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', lat: 2.7456, lon: 101.7072 },
  { code: 'CGK', city: 'Jakarta', country: 'Indonesia', lat: -6.1275, lon: 106.6558 },
  { code: 'MNL', city: 'Manila', country: 'Philippines', lat: 14.5086, lon: 121.0194 },
  { code: 'SGN', city: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8185, lon: 106.6588 },
  { code: 'KIX', city: 'Osaka', country: 'Japan', lat: 34.4320, lon: 135.2304 },
  { code: 'CTU', city: 'Chengdu', country: 'China', lat: 30.5125, lon: 103.9550 },

  // Oceania
  { code: 'SYD', city: 'Sydney', country: 'Australia', lat: -33.9399, lon: 151.1753 },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', lat: -37.6690, lon: 144.8410 },
  { code: 'BNE', city: 'Brisbane', country: 'Australia', lat: -27.3842, lon: 153.1175 },
  { code: 'AKL', city: 'Auckland', country: 'New Zealand', lat: -37.0082, lon: 174.7850 },
  { code: 'PER', city: 'Perth', country: 'Australia', lat: -31.9385, lon: 115.9672 }
];

/* --- AIRLINE & HUB DATA --- */
// Added 'isRegional' flag to carriers that typically don't fly intercontinental long-haul
const AIRLINE_HUBS = {
  // USA/Canada
  'JFK': [{ name: 'Delta Air Lines', code: 'DL' }, { name: 'American Airlines', code: 'AA' }, { name: 'JetBlue', code: 'B6', isRegional: true }],
  'LAX': [{ name: 'United Airlines', code: 'UA' }, { name: 'Delta Air Lines', code: 'DL' }, { name: 'American Airlines', code: 'AA' }],
  'SFO': [{ name: 'United Airlines', code: 'UA' }],
  'ORD': [{ name: 'United Airlines', code: 'UA' }, { name: 'American Airlines', code: 'AA' }],
  'ATL': [{ name: 'Delta Air Lines', code: 'DL' }],
  'MIA': [{ name: 'American Airlines', code: 'AA' }],
  'DFW': [{ name: 'American Airlines', code: 'AA' }],
  'DEN': [{ name: 'United Airlines', code: 'UA' }, { name: 'Southwest Airlines', code: 'WN', isRegional: true }],
  'SEA': [{ name: 'Alaska Airlines', code: 'AS', isRegional: true }, { name: 'Delta Air Lines', code: 'DL' }],
  'BOS': [{ name: 'JetBlue', code: 'B6', isRegional: true }, { name: 'Delta Air Lines', code: 'DL' }],
  'IAH': [{ name: 'United Airlines', code: 'UA' }],
  'LAS': [{ name: 'Southwest Airlines', code: 'WN', isRegional: true }, { name: 'Spirit Airlines', code: 'NK', isRegional: true }],
  'YYZ': [{ name: 'Air Canada', code: 'AC' }],
  'YVR': [{ name: 'Air Canada', code: 'AC' }],
  'YUL': [{ name: 'Air Canada', code: 'AC' }, { name: 'Air Transat', code: 'TS' }],
  'MEX': [{ name: 'Aeroméxico', code: 'AM' }],
  'CLT': [{ name: 'American Airlines', code: 'AA' }],
  'PHX': [{ name: 'American Airlines', code: 'AA' }, { name: 'Southwest Airlines', code: 'WN', isRegional: true }],
  'MCO': [{ name: 'Southwest Airlines', code: 'WN', isRegional: true }, { name: 'JetBlue', code: 'B6', isRegional: true }],
  'DTW': [{ name: 'Delta Air Lines', code: 'DL' }],
  'MSP': [{ name: 'Delta Air Lines', code: 'DL' }],
  'PHL': [{ name: 'American Airlines', code: 'AA' }],

  // Europe
  'LHR': [{ name: 'British Airways', code: 'BA' }, { name: 'Virgin Atlantic', code: 'VS' }],
  'CDG': [{ name: 'Air France', code: 'AF' }],
  'FRA': [{ name: 'Lufthansa', code: 'LH' }],
  'MUC': [{ name: 'Lufthansa', code: 'LH' }],
  'AMS': [{ name: 'KLM Royal Dutch', code: 'KL' }],
  'ZRH': [{ name: 'SWISS', code: 'LX' }],
  'MAD': [{ name: 'Iberia', code: 'IB' }],
  'BCN': [{ name: 'Vueling', code: 'VY', isRegional: true }],
  'FCO': [{ name: 'ITA Airways', code: 'AZ' }],
  'IST': [{ name: 'Turkish Airlines', code: 'TK' }],
  'DUB': [{ name: 'Aer Lingus', code: 'EI' }, { name: 'Ryanair', code: 'FR', isRegional: true }],
  'CPH': [{ name: 'SAS', code: 'SK' }],
  'OSL': [{ name: 'Norwegian Air', code: 'DY', isRegional: true }, { name: 'SAS', code: 'SK' }],
  'ARN': [{ name: 'SAS', code: 'SK' }],
  'HEL': [{ name: 'Finnair', code: 'AY' }],
  'LIS': [{ name: 'TAP Air Portugal', code: 'TP' }],
  'VIE': [{ name: 'Austrian Airlines', code: 'OS' }],
  'WAW': [{ name: 'LOT Polish Airlines', code: 'LO' }],
  'ATH': [{ name: 'Aegean Airlines', code: 'A3', isRegional: true }],
  'BRU': [{ name: 'Brussels Airlines', code: 'SN' }],
  'GVA': [{ name: 'SWISS', code: 'LX' }, { name: 'easyJet', code: 'U2', isRegional: true }],
  'MAN': [{ name: 'Virgin Atlantic', code: 'VS' }, { name: 'easyJet', code: 'U2', isRegional: true }],
  'MXP': [{ name: 'ITA Airways', code: 'AZ' }, { name: 'easyJet', code: 'U2', isRegional: true }],

  // Middle East & Africa
  'DXB': [{ name: 'Emirates', code: 'EK' }],
  'AUH': [{ name: 'Etihad Airways', code: 'EY' }],
  'DOH': [{ name: 'Qatar Airways', code: 'QR' }],
  'RUH': [{ name: 'Saudia', code: 'SV' }],
  'CAI': [{ name: 'EgyptAir', code: 'MS' }],
  'JNB': [{ name: 'South African Airways', code: 'SA' }],
  'CPT': [{ name: 'South African Airways', code: 'SA' }],
  'ADD': [{ name: 'Ethiopian Airlines', code: 'ET' }],
  'CMN': [{ name: 'Royal Air Maroc', code: 'AT' }],
  'TLV': [{ name: 'El Al', code: 'LY' }],
  'AMM': [{ name: 'Royal Jordanian', code: 'RJ' }],
  'NBO': [{ name: 'Kenya Airways', code: 'KQ' }],
  'LOS': [{ name: 'Arik Air', code: 'W3', isRegional: true }, { name: 'Air Peace', code: 'P4' }],

  // Asia
  'HND': [{ name: 'All Nippon Airways', code: 'NH' }, { name: 'Japan Airlines', code: 'JL' }],
  'SIN': [{ name: 'Singapore Airlines', code: 'SQ' }],
  'HKG': [{ name: 'Cathay Pacific', code: 'CX' }],
  'ICN': [{ name: 'Korean Air', code: 'KE' }, { name: 'Asiana Airlines', code: 'OZ' }],
  'BKK': [{ name: 'Thai Airways', code: 'TG' }],
  'DEL': [{ name: 'Air India', code: 'AI' }, { name: 'IndiGo', code: '6E', isRegional: true }],
  'BOM': [{ name: 'Air India', code: 'AI' }],
  'BLR': [{ name: 'IndiGo', code: '6E', isRegional: true }],
  'MAA': [{ name: 'IndiGo', code: '6E', isRegional: true }],
  'PEK': [{ name: 'Air China', code: 'CA' }],
  'PVG': [{ name: 'China Eastern Airlines', code: 'MU' }],
  'CAN': [{ name: 'China Southern Airlines', code: 'CZ' }],
  'TPE': [{ name: 'EVA Air', code: 'BR' }, { name: 'China Airlines', code: 'CI' }],
  'KUL': [{ name: 'Malaysia Airlines', code: 'MH' }, { name: 'AirAsia', code: 'AK', isRegional: true }],
  'CGK': [{ name: 'Garuda Indonesia', code: 'GA' }],
  'MNL': [{ name: 'Philippine Airlines', code: 'PR' }],
  'SGN': [{ name: 'Vietnam Airlines', code: 'VN' }],
  'KIX': [{ name: 'All Nippon Airways', code: 'NH' }, { name: 'Japan Airlines', code: 'JL' }],
  'CTU': [{ name: 'Air China', code: 'CA' }, { name: 'Sichuan Airlines', code: '3U' }],

  // Latin America
  'GRU': [{ name: 'LATAM Airlines', code: 'LA' }],
  'GIG': [{ name: 'GOL Airlines', code: 'G3', isRegional: true }],
  'BOG': [{ name: 'Avianca', code: 'AV' }],
  'LIM': [{ name: 'LATAM Airlines', code: 'LA' }],
  'SCL': [{ name: 'LATAM Airlines', code: 'LA' }],
  'EZE': [{ name: 'Aerolíneas Argentinas', code: 'AR' }],
  'PTY': [{ name: 'Copa Airlines', code: 'CM' }],

  // Oceania
  'SYD': [{ name: 'Qantas', code: 'QF' }],
  'MEL': [{ name: 'Qantas', code: 'QF' }],
  'BNE': [{ name: 'Virgin Australia', code: 'VA' }],
  'PER': [{ name: 'Qantas', code: 'QF' }],
  'AKL': [{ name: 'Air New Zealand', code: 'NZ' }],

  // Fallbacks
  'default': [{ name: 'Global Air', code: 'GA' }]
};

const getAirlineForRoute = (origin, dest, distanceKm, layover = null, preference = 'balanced') => {
  let options = [];
  const isLongHaul = distanceKm > 6000;

  // Filter helper to remove regional airlines on long haul routes
  const filterAirlines = (list) => {
    if (!list) return [];
    if (isLongHaul) return list.filter(a => !a.isRegional);
    return list;
  };
  
  // If there is a layover, the airline is based at the layover hub
  if (layover) {
    options = filterAirlines(AIRLINE_HUBS[layover.code]);
  } else {
    // Direct flight logic
    const originAirlines = filterAirlines(AIRLINE_HUBS[origin.code]);
    const destAirlines = filterAirlines(AIRLINE_HUBS[dest.code]);

    if (preference === 'origin' && originAirlines.length > 0) {
        options = originAirlines;
    } else if (preference === 'dest' && destAirlines.length > 0) {
        options = destAirlines;
    } else {
        // Balanced: Flip a coin to decide whether to pick from Origin List or Destination List.
        if (originAirlines.length > 0 && destAirlines.length > 0) {
            options = Math.random() > 0.5 ? originAirlines : destAirlines;
        } else {
            options = [...originAirlines, ...destAirlines];
        }
    }
  }

  if (options.length === 0) options = AIRLINE_HUBS['default'];
  
  const selected = options[Math.floor(Math.random() * options.length)];
  const number = Math.floor(Math.random() * 900) + 100;
  
  return { 
    name: selected.name, 
    flightCode: `${selected.code}${number}`
  };
};

/* --- MATH UTILITIES --- */
const EARTH_RADIUS = 10;

function latLongToVector3(lat, lon, radius = EARTH_RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  return new THREE.Vector3(x, y, z);
}

// Haversine formula for accurate Great Circle distances in km
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// Generate flight options with LOGICAL routing
const generateFlights = (from, to) => {
  if (!from || !to || from.code === to.code) return [];
  
  const directDist = getDistance(from.lat, from.lon, to.lat, to.lon);
  const baseTimeHours = directDist / 850; // Avg speed 850km/h
  
  // Realistic Pricing Algorithm
  const getPrice = (dist, airline, stops) => {
    // 1. Distance Tier Pricing
    let ratePerKm = 0.10; // Default: $0.10 per km
    let baseTax = 50;

    if (dist < 1500) {
        ratePerKm = 0.18; // Short haul is more expensive per km
        baseTax = 40;
    } else if (dist > 10000) {
        ratePerKm = 0.08; // Ultra long haul efficiency
        baseTax = 120;
    }

    let price = (dist * ratePerKm) + baseTax;

    // 2. Airline Premium Factor
    const premiumAirlines = ['Emirates', 'Singapore Airlines', 'Qatar Airways', 'All Nippon Airways', 'Japan Airlines', 'Cathay Pacific', 'SWISS'];
    const budgetAirlines = ['JetBlue', 'Southwest Airlines', 'Ryanair', 'IndiGo', 'AirAsia', 'Vueling', 'Spirit Airlines'];
    
    if (premiumAirlines.includes(airline)) price *= 1.35;
    else if (budgetAirlines.includes(airline)) price *= 0.75;

    // 3. Stopover Discount (Direct is usually premium)
    if (stops > 0) price *= 0.85;

    // 4. Random Market Fluctuation (+/- 8%)
    price *= (0.92 + Math.random() * 0.16);

    return Math.floor(price);
  };
  
  // Format duration helper
  const formatDuration = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const flights = [];

  // 1. Direct Flight
  // Preference: 'origin' -> Ensures HKG -> JFK picks Cathay (Origin Hub), while JFK -> HKG picks Delta/AA.
  const airline1 = getAirlineForRoute(from, to, directDist, null, 'origin');
  
  flights.push({
    id: 1,
    airline: airline1.name,
    flightCode: airline1.flightCode,
    stops: 0,
    duration: formatDuration(baseTimeHours + 0.5),
    price: getPrice(directDist, airline1.name, 0),
    path: [from, to],
    color: 0x3b82f6 // Blue
  });

  // 2. Logical Layover Flight
  let bestLayover = null;
  let minDetour = Infinity;

  const potentialLayovers = AIRPORTS.filter(a => a.code !== from.code && a.code !== to.code);
  
  for (const candidate of potentialLayovers) {
    const d1 = getDistance(from.lat, from.lon, candidate.lat, candidate.lon);
    const d2 = getDistance(candidate.lat, candidate.lon, to.lat, to.lon);
    const totalDist = d1 + d2;
    const detourFactor = totalDist / directDist;

    if (detourFactor < 1.6 && detourFactor < minDetour) {
      bestLayover = candidate;
      minDetour = detourFactor;
    }
  }

  if (bestLayover) {
    const d1 = getDistance(from.lat, from.lon, bestLayover.lat, bestLayover.lon);
    const d2 = getDistance(bestLayover.lat, bestLayover.lon, to.lat, to.lon);
    const airline2 = getAirlineForRoute(from, to, d1+d2, bestLayover);
    const totalTime = (d1 + d2) / 850 + 2.5; 
    
    flights.push({
      id: 2,
      airline: airline2.name,
      flightCode: airline2.flightCode,
      stops: 1,
      layover: bestLayover,
      duration: formatDuration(totalTime),
      price: getPrice(d1 + d2, airline2.name, 1),
      path: [from, bestLayover, to],
      color: 0x10b981 // Emerald
    });
  }

  // 3. Secondary Option
  const secondaryLayovers = potentialLayovers.filter(a => a.code !== bestLayover?.code);
  let secondLayover = null;
  
  for (const candidate of secondaryLayovers) {
    const d1 = getDistance(from.lat, from.lon, candidate.lat, candidate.lon);
    const d2 = getDistance(candidate.lat, candidate.lon, to.lat, to.lon);
    if ((d1 + d2) / directDist < 1.8) {
      secondLayover = candidate;
      break; 
    }
  }

  if (secondLayover) {
     const d1 = getDistance(from.lat, from.lon, secondLayover.lat, secondLayover.lon);
     const d2 = getDistance(secondLayover.lat, secondLayover.lon, to.lat, to.lon);
     const airline3 = getAirlineForRoute(from, to, d1+d2, secondLayover);
     const totalTime = (d1 + d2) / 850 + 4;

     flights.push({
      id: 3,
      airline: airline3.name,
      flightCode: airline3.flightCode,
      stops: 1,
      layover: secondLayover,
      duration: formatDuration(totalTime),
      price: getPrice(d1 + d2, airline3.name, 1),
      path: [from, secondLayover, to],
      color: 0xf59e0b // Amber
    });
  } else {
    // Fallback: Premium Direct (Prioritize 'dest' hub carrier here for variety)
    const airline4 = getAirlineForRoute(from, to, directDist, null, 'dest');
    
    // Ensure distinct code if name is same as first flight
    if (airline4.name === airline1.name) airline4.flightCode = airline4.flightCode.replace(/\d+/, n => parseInt(n)+1);

    flights.push({
      id: 3,
      airline: airline4.name,
      flightCode: airline4.flightCode,
      stops: 0,
      duration: formatDuration(baseTimeHours + 0.5),
      price: getPrice(directDist, airline4.name, 0) * 1.5, // Force premium price for fallback
      path: [from, to],
      color: 0x8b5cf6 // Purple
    });
  }

  return flights;
};

export default function AeroVis3D() {
  const mountRef = useRef(null);
  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport, setToAirport] = useState(null);
  
  // NEW: State for text inputs and suggestions
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  
  // Scene Refs for updating outside React render cycle
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const flightLinesRef = useRef([]);

  // --- 3D SCENE INITIALIZATION ---
  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Setup
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Space background
    scene.background = new THREE.Color(0x050510);
    
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 35;
    camera.position.y = 10;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 15;
    controls.maxDistance = 60;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // 2. Lighting (Updated: All Day Mode)
    // High intensity ambient light ensures no part of the globe is in darkness
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Directional light kept for texture depth (bump map shadows) but not for darkness
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(20, 10, 20);
    scene.add(sunLight);
    
    // Atmosphere Glow
    const vertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const fragmentShader = `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
      }
    `;
    
    const atmosphereGeo = new THREE.SphereGeometry(EARTH_RADIUS + 1.5, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphere);


    // 3. Earth Globe
    const textureLoader = new THREE.TextureLoader();
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Using high-res textures
    const earthMat = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'),
      bumpMap: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png'),
      bumpScale: 0.15,
      specularMap: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-water.png'),
      specular: new THREE.Color('grey'),
      shininess: 5
    });
    
    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earth);

    // 4. Markers for Airports
    const markerGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });
    
    AIRPORTS.forEach(airport => {
      const pos = latLongToVector3(airport.lat, airport.lon);
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      // Add a glow ring
      const ringGeo = new THREE.RingGeometry(0.2, 0.25, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0,0,0));
      
      earthGroup.add(marker);
      earthGroup.add(ring);
    });

    setIsGlobeReady(true);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) mountRef.current.innerHTML = '';
      renderer.dispose();
    };
  }, []);

  // --- FLIGHT VISUALIZATION LOGIC ---
  useEffect(() => {
    if (!isGlobeReady || !sceneRef.current) return;

    // Control auto-rotation: Stop if flights are visible, rotate if idle
    if (controlsRef.current) {
        controlsRef.current.autoRotate = flights.length === 0;
    }

    // Clear previous lines
    flightLinesRef.current.forEach(line => sceneRef.current.remove(line));
    flightLinesRef.current = [];

    if (flights.length === 0) return;

    // Reposition camera to show the route
    const from = flights[0].path[0];
    const to = flights[0].path[flights[0].path.length - 1];
    const v1 = latLongToVector3(from.lat, from.lon);
    const v2 = latLongToVector3(to.lat, to.lon);
    const mid = v1.clone().add(v2).normalize().multiplyScalar(35); // Camera height
     
    if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.copy(mid);
        cameraRef.current.lookAt(0,0,0);
        controlsRef.current.update();
    }

    const visualizeFlight = (flight) => {
       // Only visualize if selected or if none selected (show all briefly or handle differently)
       // For this demo, we visualize ALL available flights, but highlight selected
       
       const isSelected = selectedFlight?.id === flight.id;
       const opacity = selectedFlight ? (isSelected ? 1.0 : 0.1) : 0.6;
       const lineWidth = isSelected ? 3 : 1;

       const pathPoints = flight.path;
       
       // Create segments (From -> Layover -> To)
       for(let i=0; i<pathPoints.length-1; i++) {
         const start = latLongToVector3(pathPoints[i].lat, pathPoints[i].lon);
         const end = latLongToVector3(pathPoints[i+1].lat, pathPoints[i+1].lon);
         
         // Bezier Control Points
         // We lift the curve based on distance
         const dist = start.distanceTo(end);
         const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(EARTH_RADIUS + (dist * 0.5));
         const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
         
         const points = curve.getPoints(50);
         // Use TubeGeometry for prominent, thick lines instead of Line
         const geometry = new THREE.TubeGeometry(curve, 64, isSelected ? 0.15 : 0.05, 8, false);
         const material = new THREE.MeshBasicMaterial({ 
           color: flight.color, 
           transparent: true, 
           opacity: opacity,
           side: THREE.DoubleSide
         });
         
         const curveObject = new THREE.Mesh(geometry, material);
         sceneRef.current.add(curveObject);
         flightLinesRef.current.push(curveObject);

         // Animated particle on path (Simple representation: just a point for now)
         if (isSelected) {
            const particleGeo = new THREE.SphereGeometry(0.3, 8, 8); // Increased size
            const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const particle = new THREE.Mesh(particleGeo, particleMat);
            // Just placing at mid point for visual demo
            particle.position.copy(mid); 
            sceneRef.current.add(particle);
            flightLinesRef.current.push(particle);
         }
       }
    };

    flights.forEach(visualizeFlight);

  }, [flights, selectedFlight, isGlobeReady]);


  // --- UI HANDLERS ---

  const handleSearch = () => {
    if (fromAirport && toAirport) {
      const results = generateFlights(fromAirport, toAirport);
      setFlights(results);
      setSelectedFlight(null);
      // Hide suggestions if open
      setShowFromSuggestions(false);
      setShowToSuggestions(false);
    }
  };

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
  };

  const clearSelection = () => {
    setFromAirport(null);
    setToAirport(null);
    setFromSearch("");
    setToSearch("");
    setFlights([]);
    setSelectedFlight(null);
  };

  // Helper to filter airports based on input
  const getFilteredAirports = (searchText) => {
    if (!searchText) return AIRPORTS;
    const lower = searchText.toLowerCase();
    return AIRPORTS.filter(a => 
      a.city.toLowerCase().includes(lower) || 
      a.code.toLowerCase().includes(lower) || 
      a.country.toLowerCase().includes(lower)
    );
  };

  return (
    <div className="w-full h-screen relative bg-slate-900 font-sans text-white overflow-hidden">
      {/* 3D Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
        
        {/* Header (INCREASED SIZE: max-w-xl) */}
        <div className="flex justify-between items-start">
            <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700 shadow-2xl max-w-xl w-full">
                <div className="flex items-center gap-2 mb-4 text-blue-400">
                </div>

                {/* Search Form */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 relative">
                        
                        {/* FROM INPUT (INCREASED TEXT SIZE & PADDING) */}
                        <div className="group relative z-50">
                            <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider">From</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-base focus:border-blue-500 outline-none hover:bg-slate-700 transition-colors placeholder-slate-500 text-white"
                                    placeholder="City or Code"
                                    value={fromSearch}
                                    onChange={(e) => {
                                        setFromSearch(e.target.value);
                                        setShowFromSuggestions(true);
                                        setFromAirport(null); 
                                        setFlights([]); // Clear results to prevent crash
                                        setSelectedFlight(null);
                                    }}
                                    onFocus={() => setShowFromSuggestions(true)}
                                    // Delay blur to allow click on suggestion to register
                                    onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                                />
                                {fromAirport && <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500"></div>}
                            </div>
                            
                            {/* Autocomplete Dropdown */}
                            {showFromSuggestions && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded shadow-xl max-h-60 overflow-y-auto overflow-x-hidden">
                                    {getFilteredAirports(fromSearch).map(a => (
                                        <div 
                                            key={a.code}
                                            className="p-3 hover:bg-slate-700 cursor-pointer text-sm border-b border-slate-700/50 last:border-0 flex justify-between items-center"
                                            onClick={() => {
                                                setFromAirport(a);
                                                setFromSearch(`${a.city} (${a.code})`);
                                                setShowFromSuggestions(false);
                                            }}
                                        >
                                            <div>
                                                <div className="font-bold text-white">{a.city}</div>
                                                <div className="text-slate-500">{a.country}</div>
                                            </div>
                                            <span className="text-blue-400 font-mono font-bold">{a.code}</span>
                                        </div>
                                    ))}
                                    {getFilteredAirports(fromSearch).length === 0 && (
                                        <div className="p-3 text-xs text-slate-500 text-center">No airports found</div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {/* TO INPUT (INCREASED TEXT SIZE & PADDING) */}
                        <div className="group relative z-40">
                            <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider">To</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-base focus:border-blue-500 outline-none hover:bg-slate-700 transition-colors placeholder-slate-500 text-white"
                                    placeholder="City or Code"
                                    value={toSearch}
                                    onChange={(e) => {
                                        setToSearch(e.target.value);
                                        setShowToSuggestions(true);
                                        setToAirport(null);
                                        setFlights([]); // Clear results to prevent crash
                                        setSelectedFlight(null);
                                    }}
                                    onFocus={() => setShowToSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                                />
                                {toAirport && <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500"></div>}
                            </div>

                            {/* Autocomplete Dropdown */}
                            {showToSuggestions && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded shadow-xl max-h-60 overflow-y-auto overflow-x-hidden">
                                    {getFilteredAirports(toSearch).map(a => (
                                        <div 
                                            key={a.code}
                                            className="p-3 hover:bg-slate-700 cursor-pointer text-sm border-b border-slate-700/50 last:border-0 flex justify-between items-center"
                                            onClick={() => {
                                                setToAirport(a);
                                                setToSearch(`${a.city} (${a.code})`);
                                                setShowToSuggestions(false);
                                            }}
                                        >
                                            <div>
                                                <div className="font-bold text-white">{a.city}</div>
                                                <div className="text-slate-500">{a.country}</div>
                                            </div>
                                            <span className="text-blue-400 font-mono font-bold">{a.code}</span>
                                        </div>
                                    ))}
                                    {getFilteredAirports(toSearch).length === 0 && (
                                        <div className="p-3 text-xs text-slate-500 text-center">No airports found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={handleSearch}
                        disabled={!fromAirport || !toAirport}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 text-lg rounded font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/50"
                    >
                        <Search className="w-5 h-5" />
                        Find Routes
                    </button>
                    
                    {flights.length > 0 && (
                        <button onClick={clearSelection} className="w-full text-xs text-slate-400 hover:text-white underline">
                            Clear Search
                        </button>
                    )}
                </div>
            </div>
            
            {/* Status Panel */}
            <div className="pointer-events-auto bg-slate-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700 flex items-center gap-4 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    SYSTEM ONLINE
                </div>
                <div>VISUALIZATION: GL_POINTS</div>
            </div>
        </div>

        {/* Results Panel (INCREASED SIZE: w-96) */}
        {flights.length > 0 && (
             <div className="pointer-events-auto absolute top-1/2 right-10 -translate-y-1/2 w-96 perspective-1000">
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> 
                        Routes Found: {flights.length}
                    </h2>
                    {flights.map((flight) => (
                        <div 
                            key={flight.id}
                            onClick={() => handleSelectFlight(flight)}
                            className={`
                                relative overflow-hidden p-5 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:scale-105
                                ${selectedFlight?.id === flight.id 
                                    ? 'bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/20 translate-x-0' 
                                    : 'bg-slate-900/60 border-slate-700 hover:bg-slate-800 hover:border-slate-500 translate-x-4 opacity-90'}
                            `}
                        >
                            {/* Color bar indicator */}
                            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: '#' + flight.color.toString(16) }}></div>

                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <span className="font-bold text-xl block leading-tight">{flight.airline}</span>
                                </div>
                                <span className="font-mono text-blue-300 font-bold text-xl">${Math.round(flight.price)}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm text-slate-400 mb-3">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> {flight.duration}
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className={`w-2.5 h-2.5 rounded-full ${flight.stops === 0 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                    {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}
                                </div>
                            </div>

                            {/* Mini Timeline */}
                            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mt-2 pt-2 border-t border-slate-700">
                                <span>{fromAirport.code}</span>
                                <div className="flex-1 mx-3 h-[1px] bg-slate-600 relative">
                                    {flight.stops > 0 && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-800 border border-slate-500" title="Layover"></div>
                                    )}
                                </div>
                                <span>{toAirport.code}</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {/* Footer Info */}
        <div className="text-center pointer-events-none">
             {selectedFlight && (
                 <div className="inline-block pointer-events-auto bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg px-6 py-3 mb-4 animate-bounce-slight">
                    <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Selected Itinerary</div>
                    <div className="text-xl font-light">
                        {fromAirport.city} <span className="text-slate-500 mx-2">→</span> 
                        {selectedFlight.stops > 0 && <span className="text-amber-400 mx-2">{selectedFlight.layover?.city}</span>}
                        {selectedFlight.stops > 0 && <span className="text-slate-500 mx-2">→</span>}
                        {toAirport.city}
                    </div>
                 </div>
             )}
        </div>

      </div>
      
      {/* Decorative Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,24,39,0)_2px,transparent_2px),linear-gradient(90deg,rgba(16,24,39,0)_2px,transparent_2px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-20"></div>
    </div>
  );
}