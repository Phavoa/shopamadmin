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

export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  totalOrders: number;
  totalSpend: string;
  status: "active" | "review";
  createdAt: string;
}

export const mockBuyers: Buyer[] = [
  {
    id: "B-10023",
    name: "Mary K",
    email: "mk@gmail.com",
    phone: "08037832844",
    verified: true,
    totalOrders: 24,
    totalSpend: "540000",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "B-10024",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "08023456789",
    verified: false,
    totalOrders: 12,
    totalSpend: "89000",
    status: "active",
    createdAt: "2024-02-20T14:15:00Z",
  },
  {
    id: "B-10025",
    name: "Sarah Williams",
    email: "sarah.williams@email.com",
    phone: "08034567890",
    verified: true,
    totalOrders: 8,
    totalSpend: "45000",
    status: "review",
    createdAt: "2024-03-10T09:45:00Z",
  },
  {
    id: "B-10026",
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "08045678901",
    verified: true,
    totalOrders: 18,
    totalSpend: "120000",
    status: "active",
    createdAt: "2024-04-05T16:20:00Z",
  },
  {
    id: "B-10027",
    name: "Emma Davis",
    email: "emma.davis@email.com",
    phone: "08056789012",
    verified: false,
    totalOrders: 15,
    totalSpend: "67000",
    status: "active",
    createdAt: "2024-05-12T11:30:00Z",
  },
  {
    id: "B-10028",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "08067890123",
    verified: true,
    totalOrders: 22,
    totalSpend: "98000",
    status: "active",
    createdAt: "2024-06-18T13:45:00Z",
  },
  {
    id: "B-10029",
    name: "Olivia Martinez",
    email: "olivia.martinez@email.com",
    phone: "08078901234",
    verified: false,
    totalOrders: 6,
    totalSpend: "34000",
    status: "review",
    createdAt: "2024-07-22T08:15:00Z",
  },
  {
    id: "B-10030",
    name: "William Taylor",
    email: "william.taylor@email.com",
    phone: "08089012345",
    verified: true,
    totalOrders: 31,
    totalSpend: "156000",
    status: "active",
    createdAt: "2024-08-30T17:00:00Z",
  },
  {
    id: "B-10031",
    name: "Adebayo Johnson",
    email: "adebayo.johnson@nigerianmail.com",
    phone: "09012345678",
    verified: true,
    totalOrders: 45,
    totalSpend: "890000",
    status: "active",
    createdAt: "2024-09-05T12:00:00Z",
  },
  {
    id: "B-10032",
    name: "Chinwe Okoro",
    email: "chinwe.okoro@gmail.com",
    phone: "08123456789",
    verified: false,
    totalOrders: 3,
    totalSpend: "15000",
    status: "review",
    createdAt: "2024-09-12T09:30:00Z",
  },
  {
    id: "B-10033",
    name: "Ibrahim Musa",
    email: "ibrahim.musa@yahoo.com",
    phone: "08034567891",
    verified: true,
    totalOrders: 27,
    totalSpend: "345000",
    status: "active",
    createdAt: "2024-09-18T15:45:00Z",
  },
  {
    id: "B-10034",
    name: "Ngozi Eze",
    email: "ngozi.eze@outlook.com",
    phone: "07045678901",
    verified: true,
    totalOrders: 19,
    totalSpend: "234000",
    status: "active",
    createdAt: "2024-09-25T11:20:00Z",
  },
  {
    id: "B-10035",
    name: "Samuel Adeyemi",
    email: "samuel.adeyemi@gmail.com",
    phone: "09056789012",
    verified: false,
    totalOrders: 7,
    totalSpend: "56000",
    status: "review",
    createdAt: "2024-10-01T14:10:00Z",
  },
  {
    id: "B-10036",
    name: "Fatima Abubakar",
    email: "fatima.abubakar@nigerianmail.com",
    phone: "08167890123",
    verified: true,
    totalOrders: 33,
    totalSpend: "678000",
    status: "active",
    createdAt: "2024-10-08T16:30:00Z",
  },
  {
    id: "B-10037",
    name: "Emeka Nwosu",
    email: "emeka.nwosu@gmail.com",
    phone: "08078901235",
    verified: false,
    totalOrders: 11,
    totalSpend: "78000",
    status: "active",
    createdAt: "2024-10-15T10:15:00Z",
  },
  {
    id: "B-10038",
    name: "Amina Hassan",
    email: "amina.hassan@yahoo.com",
    phone: "09089012345",
    verified: true,
    totalOrders: 28,
    totalSpend: "456000",
    status: "active",
    createdAt: "2024-10-22T13:45:00Z",
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
