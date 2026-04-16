import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const token = request.cookies.get('firebaseToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the admin token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const adminDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    if (!adminDoc.exists || adminDoc.data().role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (role !== 'Editor' && role !== 'Team Coach' && role !== 'Admin') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    // Create user profile in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      role: role,
      createdByAdmin: decodedToken.uid,
      firstLogin: true,
      createdAt: new Date()
    });

    return NextResponse.json({ message: 'User created successfully', uid: userRecord.uid });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
