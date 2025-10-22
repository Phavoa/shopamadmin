export interface Slot {
  id: string;
  sellerId: string;
  sellerName: string;
  startTime: string;
  endTime: string;
  status: "booked" | "available";
  date: string;
  duration: number; // in minutes
  product?: string;
  price?: number;
  tier?: "gold" | "silver" | "bronze";
  category?: string;
  city?: string;
}

export interface Seller {
  id: string;
  name: string;
  avatar?: string;
  status: "active" | "inactive";
}

export const mockSellers: Seller[] = [
  { id: "1", name: "John Doe", status: "active" },
  { id: "2", name: "Jane Smith", status: "active" },
  { id: "3", name: "Bob Johnson", status: "active" },
  { id: "4", name: "Alice Brown", status: "active" },
  { id: "5", name: "Charlie Wilson", status: "active" },
];

export const mockSlots: Slot[] = [
  {
    id: "1",
    sellerId: "1",
    sellerName: "John Doe",
    startTime: "09:00",
    endTime: "10:00",
    status: "booked",
    date: "2025-10-19",
    duration: 60,
    product: "Electronics Bundle",
    price: 150,
    tier: "gold",
    category: "electronics",
    city: "lagos",
  },
  {
    id: "2",
    sellerId: "2",
    sellerName: "Jane Smith",
    startTime: "10:00",
    endTime: "11:00",
    status: "available",
    date: "2025-10-21",
    duration: 60,
    tier: "silver",
    category: "clothing",
    city: "abuja",
  },
  {
    id: "3",
    sellerId: "3",
    sellerName: "Bob Johnson",
    startTime: "11:00",
    endTime: "12:00",
    status: "booked",
    date: "2025-10-22",
    duration: 60,
    product: "Fashion Collection",
    price: 200,
    tier: "gold",
    category: "clothing",
    city: "lagos",
  },
  {
    id: "4",
    sellerId: "4",
    sellerName: "Alice Brown",
    startTime: "14:00",
    endTime: "15:00",
    status: "available",
    date: "2025-10-21",
    duration: 60,
    tier: "bronze",
    category: "home",
    city: "port-harcourt",
  },
  {
    id: "5",
    sellerId: "5",
    sellerName: "Charlie Wilson",
    startTime: "15:00",
    endTime: "16:00",
    status: "booked",
    date: "2025-10-23",
    duration: 60,
    product: "Home Goods",
    price: 100,
    tier: "silver",
    category: "home",
    city: "abuja",
  },
  // Add more slots for different times
  {
    id: "6",
    sellerId: "1",
    sellerName: "John Doe",
    startTime: "16:00",
    endTime: "17:00",
    status: "available",
    date: "2025-10-21",
    duration: 60,
    tier: "gold",
    category: "electronics",
    city: "lagos",
  },
  {
    id: "7",
    sellerId: "2",
    sellerName: "Jane Smith",
    startTime: "17:00",
    endTime: "18:00",
    status: "booked",
    date: "2025-10-25",
    duration: 60,
    product: "Beauty Products",
    price: 120,
    tier: "silver",
    category: "clothing",
    city: "abuja",
  },
];

export const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];
