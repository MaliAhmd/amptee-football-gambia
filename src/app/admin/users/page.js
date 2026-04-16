"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Users, UserPlus, Trash2, Key, Edit, Shield, Eye, EyeOff, Ban, CheckCircle } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Editor" // or "Team Coach"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.email !== auth.currentUser?.email);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setFormData({ email: "", password: "", role: "Editor" });
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    
    try {
      // Create secondary Firebase App instance to prevent Admin from being logged out
      const { initializeApp, getApps, getApp } = await import("firebase/app");
      const { getAuth, createUserWithEmailAndPassword } = await import("firebase/auth");
      const { doc, setDoc } = await import("firebase/firestore");
      
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      };      

      // Wait, we need to import current project's firebase Config. 
      // Fortunately we can just use the config already exported in \`@/lib/firebase\` but as a secondary app
      let secondaryApp;
      const apps = getApps();
      if (!apps.some(app => app.name === 'Secondary')) {
        secondaryApp = initializeApp(db.app.options, "Secondary");
      } else {
        secondaryApp = getApp("Secondary");
      }
      
      const secondaryAuth = getAuth(secondaryApp);
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.password);
      
      const currentUserEmail = auth.currentUser?.email || "Unknown Admin";

      // Now save the user in Firestore using our PRIMARY authenticated db instance
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: formData.email,
        role: formData.role,
        firstLogin: true,
        uid: userCredential.user.uid,
        createdBy: currentUserEmail,
        isBlocked: false,
        createdAt: new Date().toISOString()
      });

      // We sign out the secondary app just to clear it
      await secondaryAuth.signOut();
      
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create user. Ensure you have network connectivity.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleBlock = async (uid, currentStatus) => {
    try {
      await updateDoc(doc(db, "users", uid), {
        isBlocked: !currentStatus
      });
      fetchUsers();
    } catch (err) {
      alert("Failed to update user status: " + err.message);
    }
  };

  const handleDelete = async (uid) => {
    if(!confirm("Are you sure you want to permanently delete this account?")) return;
    try {
      const { doc, deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, "users", uid));
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider flex items-center gap-3">
             <Shield className="h-8 w-8 text-primary" /> User Management
          </h1>
          <p className="mt-2 text-sm text-gray-400">Manage Admins, Editors, and Team Coaches</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wide text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" /> New Account
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-gray-400">
           No users found.
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Created By</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-transparent">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin' ? 'bg-red-500/20 text-red-400' : user.role === 'Editor' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${user.isBlocked ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                      {user.isBlocked ? "Blocked" : (user.firstLogin ? "Pending Password Change" : "Active")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
                       {user.createdBy || "System"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium gap-3">
                    <button onClick={() => handleToggleBlock(user.uid, user.isBlocked)} className={`${user.isBlocked ? 'text-green-500 hover:text-green-400' : 'text-accent-gold hover:text-white'} mr-3 transition-colors`} title={user.isBlocked ? "Unblock Account" : "Block Account"}>
                      {user.isBlocked ? <CheckCircle className="h-4 w-4 inline" /> : <Ban className="h-4 w-4 inline" />}
                    </button>
                    <button onClick={() => handleDelete(user.uid)} className="text-red-500 hover:text-red-400 transition-colors" title="Revoke Access">
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative z-10 inline-block align-bottom bg-[#111] border border-white/10 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-6 border-b border-white/10 flex justify-between items-center bg-black/50">
                   <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                     Create User Account
                   </h3>
                </div>
                
                <div className="p-6 space-y-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Email Address</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" placeholder="editor@amputeefootballgambia.gm" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Role</label>
                    <select name="role" required value={formData.role} onChange={handleChange} className="block w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner">
                      <option value="Editor">Editor</option>
                      <option value="Team Coach">Team Coach</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Temporary Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner pr-12" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 bg-black/50 border-t border-white/10 flex justify-end gap-4">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide shadow-lg shadow-primary/20 transition-all disabled:opacity-70">
                    {saving ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
