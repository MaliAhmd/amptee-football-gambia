"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { uploadImage } from "@/app/actions/uploadImage";
import { Plus, Edit2, Trash2, X, Check, Users } from "lucide-react";

const CATEGORIES = [
  "Free Football",
  "Regional Football",
  "Club Football",
  "Engagement"
];

export default function AdminCommunity() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0],
    image: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "community"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching community items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ title: "", description: "", category: CATEGORIES[0], image: "" });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      category: item.category || CATEGORIES[0],
      image: item.image || ""
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = formData.image;
      
      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", imageFile);
        finalImageUrl = await uploadImage(formDataUpload);
      }

      const currentUserEmail = auth.currentUser?.email || "Unknown Editor";

      if (editingItem) {
        const itemRef = doc(db, "community", editingItem.id);
        await updateDoc(itemRef, {
          ...formData,
          image: finalImageUrl,
          lastEditedBy: currentUserEmail,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, "community"), {
          ...formData,
          image: finalImageUrl,
          lastEditedBy: currentUserEmail,
          createdAt: serverTimestamp()
        });
      }
      closeModal();
      fetchItems();
    } catch (error) {
      console.error("Error saving community item:", error);
      alert("Failed to save item. Ensure Cloudinary settings are correct.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this community item?")) {
      try {
        await deleteDoc(doc(db, "community", id));
        fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider flex items-center gap-3">
             <Users className="h-8 w-8 text-primary" /> Community Management
          </h1>
          <p className="mt-2 text-sm text-gray-400">Manage community football programs and events</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wide text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> New Program
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-gray-400">
           No community items found. Click "New Program" to create one.
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Program Info</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Last Edited By</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-transparent">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="h-10 w-10 rounded-lg object-cover border border-white/10" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                           <Users className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">{item.title}</div>
                        <div className="text-xs text-gray-400 truncate w-40">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs font-bold text-primary bg-primary/10 rounded-full border border-primary/20">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
                       {item.lastEditedBy || "System Auto"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEditModal(item)} className="text-accent-blue hover:text-white mr-4 transition-colors">
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400 transition-colors">
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
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={closeModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative z-10 inline-block align-bottom bg-[#111] border border-white/10 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-6 border-b border-white/10 flex justify-between items-center bg-black/50">
                   <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                     {editingItem ? "Edit Community Program" : "New Community Program"}
                   </h3>
                   <button type="button" onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                     <X className="h-6 w-6" />
                   </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Title</label>
                    <input type="text" name="title" required value={formData.title} onChange={handleChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" placeholder="e.g. Regional Football Tournament" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Category</label>
                      <select name="category" value={formData.category} onChange={handleChange} className="block w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner appearance-none">
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Upload Image</label>
                      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 rounded-xl bg-white/5 border border-white/10 p-1.5" />
                      
                      {(formData.image || imageFile) && (
                        <div className="mt-3 w-full h-24 rounded-lg overflow-hidden border border-white/10 relative">
                          <img src={imageFile ? URL.createObjectURL(imageFile) : formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2">Description</label>
                    <textarea name="description" rows="4" required value={formData.description} onChange={handleChange} className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner resize-none" placeholder="Description of the program..."></textarea>
                  </div>
                </div>

                <div className="px-6 py-5 bg-black/50 border-t border-white/10 flex justify-end gap-4">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide shadow-lg shadow-primary/20 transition-all disabled:opacity-70">
                    <Check className="h-4 w-4" /> {saving ? "Saving..." : (editingItem ? "Update" : "Save")}
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
