import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const token = request.cookies.get('firebaseToken')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await adminAuth.verifyIdToken(token);
    const adminDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    if (!adminDoc.exists || adminDoc.data().role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { uid } = await request.json();
    if (!uid) return NextResponse.json({ error: 'Missing UID' }, { status: 400 });

    await adminAuth.deleteUser(uid);
    await adminDb.collection('users').doc(uid).delete();

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
