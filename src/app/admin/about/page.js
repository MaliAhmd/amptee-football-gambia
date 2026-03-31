"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/app/actions/uploadImage";
import { Settings, Save, CheckCircle2 } from "lucide-react";

export default function AdminAbout() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const docRef = doc(db, "settings", "about");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data().content || "");
          setImageUrl(docSnap.data().imageUrl || "");
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    
    try {
      let finalImageUrl = imageUrl;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        finalImageUrl = await uploadImage(formData);
        setImageUrl(finalImageUrl);
        setImageFile(null);
      }

      await setDoc(doc(db, "settings", "about"), {
        content,
        imageUrl: finalImageUrl,
        updatedAt: new Date()
      }, { merge: true });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving about data:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider flex items-center gap-3">
             <Settings className="h-8 w-8 text-primary" /> About Us Settings
          </h1>
          <p className="mt-2 text-sm text-gray-400">Update the content for the public About page</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-4xl shadow-xl">
          {success && (
            <div className="mb-6 bg-primary/20 border border-primary text-primary px-4 py-3 rounded-xl flex items-center gap-3 font-semibold uppercase tracking-wide text-sm">
              <CheckCircle2 className="h-5 w-5" /> Settings saved successfully!
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2 mt-4">Banner Image Upload</label>
              
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 rounded-xl bg-white/5 border border-white/10 p-1.5" />
              
              {(imageUrl || imageFile) && (
                <div className="mt-4 w-48 h-24 rounded-lg overflow-hidden border border-white/10 relative">
                  <img src={imageFile ? URL.createObjectURL(imageFile) : imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wide text-gray-300 mb-2 mt-4">About Page Content</label>
              <p className="text-xs text-gray-500 mb-2">Use paragraphs and line breaks to format your text.</p>
              <textarea 
                rows="12" 
                required 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner resize-y"
              ></textarea>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wide shadow-lg shadow-primary/20 transition-all disabled:opacity-70"
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-5 w-5" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
