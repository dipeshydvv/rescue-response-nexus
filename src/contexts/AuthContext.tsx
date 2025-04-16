
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  createUserWithEmailAndPassword,
  User as FirebaseUser 
} from "firebase/auth";
import { User } from "@/lib/types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AuthContextProps {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (email: string, password: string, name: string, role: "admin" | "volunteer" | "ndrf") => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUserProfile(user: FirebaseUser) {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as User);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserProfile(userCredential.user);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  }

  async function signOut() {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }

  async function register(email: string, password: string, name: string, role: "admin" | "volunteer" | "ndrf") {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create a user profile in Firestore
      const userProfile: User = {
        id: user.uid,
        name,
        email,
        role
      };
      
      await setDoc(doc(db, "users", user.uid), userProfile);
      setUserProfile(userProfile);
      
      return;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  const value = {
    currentUser,
    userProfile,
    signIn,
    signOut,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
