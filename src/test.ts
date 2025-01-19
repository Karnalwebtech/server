import * as IP2Location from 'ip2location-nodejs';

// Initialize the IP2Location database using the correct method
const ip2location = new IP2Location.IP2Location();

// Initialize the database with the path to the .BIN file
ip2location.open("path/to/IP2LOCATION-LITE-DB1.BIN");

export function test() {
  // Sample IP addresses
  const ipAddresses: string[] = [
    "8.8.8.8",       // Google DNS
    "1.1.1.1",       // Cloudflare DNS
    "128.101.101.101" // University of Minnesota
  ];

  ipAddresses.forEach((ip) => {
    // Get location data for the IP address
    const result = ip2location.getAll(ip);
    console.log("asdasdasdasd",ip2location)
    console.log(`IP Address: ${ip}`);
    // console.log(`Country: ${result.country_long}`);
    console.log(`Region: ${result.region}`);
    console.log(`City: ${result.city}`);
    console.log(`ISP: ${result.isp}`);
    console.log("----------------------------");
  });

  // No explicit close method is required, but it's good practice
  ip2location.close();
}
