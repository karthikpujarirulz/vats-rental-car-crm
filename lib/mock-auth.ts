// Mock authentication service for development/demo purposes
export interface MockUser {
  uid: string
  email: string
  displayName?: string
}

class MockAuthService {
  private currentUser: MockUser | null = null
  private listeners: ((user: MockUser | null) => void)[] = []

  // Demo credentials
  private validCredentials = {
    email: "admin@vatsrental.com",
    password: "admin123",
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<MockUser> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === this.validCredentials.email && password === this.validCredentials.password) {
      const user: MockUser = {
        uid: "mock-admin-uid",
        email: email,
        displayName: "Admin User",
      }
      this.currentUser = user
      this.notifyListeners(user)

      // Store in localStorage for persistence
      localStorage.setItem("mockUser", JSON.stringify(user))
      return user
    } else {
      throw new Error("Invalid email or password")
    }
  }

  async signOut(): Promise<void> {
    this.currentUser = null
    this.notifyListeners(null)
    localStorage.removeItem("mockUser")
  }

  onAuthStateChanged(callback: (user: MockUser | null) => void): () => void {
    this.listeners.push(callback)

    // Check for stored user on initialization
    const storedUser = localStorage.getItem("mockUser")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        this.currentUser = user
        callback(user)
      } catch (error) {
        localStorage.removeItem("mockUser")
        callback(null)
      }
    } else {
      callback(this.currentUser)
    }

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  getCurrentUser(): MockUser | null {
    return this.currentUser
  }

  private notifyListeners(user: MockUser | null) {
    this.listeners.forEach((listener) => listener(user))
  }
}

export const mockAuth = new MockAuthService()
