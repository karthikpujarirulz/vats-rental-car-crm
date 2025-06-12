import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "@/lib/firebase"

// Car Management
export interface Car {
  id?: string
  make: string
  model: string
  year: number
  fuelType: string
  transmission: string
  plateNumber: string
  status: "Available" | "Rented" | "Under Maintenance"
  photoUrl?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const carService = {
  async addCar(car: Omit<Car, "id" | "createdAt" | "updatedAt">) {
    const now = Timestamp.now()
    return await addDoc(collection(db, "cars"), {
      ...car,
      createdAt: now,
      updatedAt: now,
    })
  },

  async updateCar(id: string, updates: Partial<Car>) {
    const carRef = doc(db, "cars", id)
    return await updateDoc(carRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  },

  async deleteCar(id: string) {
    return await deleteDoc(doc(db, "cars", id))
  },

  async getCars() {
    const q = query(collection(db, "cars"), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Car)
  },

  async getAvailableCars() {
    const q = query(collection(db, "cars"), where("status", "==", "Available"), orderBy("make"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Car)
  },
}

// Customer Management
export interface Customer {
  id?: string
  name: string
  phone: string
  address: string
  customerId: string
  aadharUrl?: string
  dlUrl?: string
  photoUrl?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const customerService = {
  async addCustomer(customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) {
    const now = Timestamp.now()
    return await addDoc(collection(db, "customers"), {
      ...customer,
      createdAt: now,
      updatedAt: now,
    })
  },

  async updateCustomer(id: string, updates: Partial<Customer>) {
    const customerRef = doc(db, "customers", id)
    return await updateDoc(customerRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  },

  async getCustomers() {
    const q = query(collection(db, "customers"), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Customer)
  },

  async generateCustomerId() {
    const customers = await this.getCustomers()
    const count = customers.length + 1
    return `VATS-CUST-${count.toString().padStart(3, "0")}`
  },
}

// Booking Management
export interface Booking {
  id?: string
  bookingId: string
  customerId: string
  customerName: string
  carId: string
  carDetails: string
  startDate: string
  endDate: string
  duration: number
  advanceAmount: number
  totalAmount?: number
  paymentMode: string
  status: "Active" | "Returned" | "Pending" | "Cancelled"
  notes?: string
  agreementUrl?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const bookingService = {
  async addBooking(booking: Omit<Booking, "id" | "createdAt" | "updatedAt">) {
    const now = Timestamp.now()
    return await addDoc(collection(db, "bookings"), {
      ...booking,
      createdAt: now,
      updatedAt: now,
    })
  },

  async updateBooking(id: string, updates: Partial<Booking>) {
    const bookingRef = doc(db, "bookings", id)
    return await updateDoc(bookingRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  },

  async getBookings() {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Booking)
  },

  async getActiveBookings() {
    const q = query(collection(db, "bookings"), where("status", "==", "Active"), orderBy("startDate"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Booking)
  },

  async generateBookingId() {
    const today = new Date()
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "")
    const bookings = await this.getBookings()
    const todayBookings = bookings.filter((b) => b.bookingId.includes(dateStr))
    const count = todayBookings.length + 1
    return `VAT-${dateStr}-${count.toString().padStart(3, "0")}`
  },

  async checkConflict(carId: string, startDate: string, endDate: string, excludeBookingId?: string) {
    const q = query(collection(db, "bookings"), where("carId", "==", carId), where("status", "==", "Active"))
    const snapshot = await getDocs(q)
    const bookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Booking)

    return bookings.some((booking) => {
      if (excludeBookingId && booking.id === excludeBookingId) return false

      return (
        (startDate >= booking.startDate && startDate <= booking.endDate) ||
        (endDate >= booking.startDate && endDate <= booking.endDate) ||
        (startDate <= booking.startDate && endDate >= booking.endDate)
      )
    })
  },
}

// File Upload Service
export const uploadService = {
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    return await getDownloadURL(snapshot.ref)
  },

  async deleteFile(url: string) {
    const fileRef = ref(storage, url)
    return await deleteObject(fileRef)
  },
}
