"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { uploadImage } from "@/app/actions/uploadImage";
import { Plus, Edit2, Trash2, X, Check, Users, Shield } from "lucide-react";

export default function PlayersManagement() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "Male",
    contactNumber: "",
    address: "",
    amputationType: "Lower Limb", // e.g. Single Leg, Double Leg, Arm 
    club: "",
    registrationDate: new Date().toISOString().split('T')[0],
    medicalStatus: "Cleared",
    emergencyContact: "",
    imageUrl: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "players"), orderBy("registrationDate", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlayers(data);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const openAddModal = () => {
    setEditingPlayer(null);
    setFormData({
      fullName: "", dob: "", gender: "Male", contactNumber: "", address: "",
      amputationType: "Lower Limb", position: "Forward", club: "",
      registrationDate: new Date().toISOString().split('T')[0],
      medicalStatus: "Cleared", emergencyContact: "", imageUrl: ""
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (player) => {
    setEditingPlayer(player);
    setFormData({
      fullName: player.fullName || "",
      dob: player.dob || "",
      gender: player.gender || "Male",
      contactNumber: player.contactNumber || "",
      address: player.address || "",
      amputationType: player.amputationType || "Lower Limb",
      position: player.position || "Forward",
      club: player.club || "",
      registrationDate: player.registrationDate || new Date().toISOString().split('T')[0],
      medicalStatus: player.medicalStatus || "Cleared",
      emergencyContact: player.emergencyContact || "",
      imageUrl: player.imageUrl || ""
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlayer(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = formData.imageUrl;
      
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        finalImageUrl = await uploadImage(uploadData);
      }

      const currentUserEmail = auth.currentUser?.email || "Unknown Admin";

      if (editingPlayer) {
        const playerRef = doc(db, "players", editingPlayer.id);
        await updateDoc(playerRef, {
          ...formData,
          imageUrl: finalImageUrl,
          lastEditedBy: currentUserEmail,
          updatedAt: serverTimestamp()
        });
      } else {
        // Player ID auto-generated as document ID but we can also create a nice one
        const randId = "AFG-" + Math.floor(1000 + Math.random() * 9000);
        await addDoc(collection(db, "players"), {
          ...formData,
          playerId: randId,
          imageUrl: finalImageUrl,
          lastEditedBy: currentUserEmail,
          updatedAt: serverTimestamp()
        });
      }
      closeModal();
      fetchPlayers();
    } catch (error) {
      console.error("Error saving player:", error);
      alert("Failed to save player");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this player?")) {
      try {
        await deleteDoc(doc(db, "players", id));
        fetchPlayers();
      } catch (error) {
        console.error("Error deleting player:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider flex items-center gap-3">
             <Users className="h-8 w-8 text-primary" /> Player Management
          </h1>
          <p className="mt-2 text-sm text-gray-400">Manage team roster, medical status, and details</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wide text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> New Player
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : players.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-gray-400">
           No players found. Click "New Player" to add one.
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Player</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Position</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Medical Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Club</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Last Edited By</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-transparent">
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                       {player.imageUrl && <img src={player.imageUrl} className="h-10 w-10 rounded-full object-cover border border-white/10" alt="" />}
                       <div>
                         <div className="text-sm font-medium text-white">{player.fullName}</div>
                         <div className="text-xs text-gray-500">{player.playerId}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-400">{player.position}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${player.medicalStatus === 'Cleared' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}>
                      {player.medicalStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {player.club || "Unassigned"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
                       {player.lastEditedBy || "System Auto"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEditModal(player)} className="text-accent-gold hover:text-white mr-4 transition-colors">
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(player.id)} className="text-red-500 hover:text-red-400 transition-colors">
                      <Trash2 className="h-5 w-5" />
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
            <div className="relative z-10 inline-block align-bottom bg-[#111] border border-white/10 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-6 border-b border-white/10 flex justify-between items-center bg-black/50">
                   <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                     {editingPlayer ? "Edit Player" : "New Player"}
                   </h3>
                   <button type="button" onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                     <X className="h-6 w-6" />
                   </button>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-[70vh] overflow-y-auto">
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Full Name</label>
                      <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Date of Birth</label>
                        <input type="date" name="dob" max={new Date().toISOString().split('T')[0]} required value={formData.dob} onChange={handleChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Gender</label>
                         <select name="gender" value={formData.gender} onChange={handleChange} className="block w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner">
                           <option>Male</option>
                           <option>Female</option>
                           <option>Other</option>
                         </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Position</label>
                        <select name="position" value={formData.position} onChange={handleChange} className="block w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner">
                          <option>Forward</option>
                          <option>Midfielder</option>
                          <option>Defender</option>
                          <option>Goalkeeper</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Amputation</label>
                        <select name="amputationType" value={formData.amputationType} onChange={handleChange} className="block w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner">
                          <option>Lower Limb</option>
                          <option>Upper Limb</option>
                          <option>Both Lower</option>
                          <option>Both Upper</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Club / Team</label>
                         <input type="text" name="club" required value={formData.club} onChange={handleChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Registration Date</label>
                        <input type="date" name="registrationDate" max={new Date().toISOString().split('T')[0]} required value={formData.registrationDate} onChange={handleChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                         <Shield className="w-5 h-5 text-accent-gold" />
                         <span className="font-bold text-white uppercase tracking-wider text-sm">Confidential Details</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Medical Status</label>
                            <select name="medicalStatus" value={formData.medicalStatus} onChange={handleChange} className="block w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner">
                              <option>Cleared</option>
                              <option>Injured</option>
                              <option>Suspended</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Contact</label>
                            <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="block w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                         </div>
                      </div>
                      <div>
                         <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Emergency Contact</label>
                         <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="block w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Address</label>
                         <textarea name="address" rows="2" value={formData.address} onChange={handleChange} className="block w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"></textarea>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Player Photo</label>
                      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 rounded-xl bg-white/5 border border-white/10 p-1.5" />
                      {(formData.imageUrl || imageFile) && (
                        <div className="mt-3 w-20 h-20 rounded-full overflow-hidden border border-white/10 relative">
                          <img src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                <div className="px-6 py-5 bg-black/50 border-t border-white/10 flex justify-end gap-4 rounded-b-2xl">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide shadow-lg shadow-primary/20 transition-all disabled:opacity-70">
                    <Check className="h-4 w-4" /> {saving ? "Saving..." : (editingPlayer ? "Update Player" : "Register Player")}
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
