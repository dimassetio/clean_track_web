import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot, QuerySnapshot, DocumentData, CollectionReference } from 'firebase/firestore';
import { db } from '@/lib/firebase';

class FirestoreService<T> {
  private baseCollection: CollectionReference;

  constructor(...pathSegments: string[]) {
    this.baseCollection = collection(db, ...(pathSegments as [string, ...string[]]));
  }

  // Get a single document by ID
  async getDocument(id: string): Promise<T | null> {
    const docRef = doc(this.baseCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as T;
    } else {
      console.error(`No document found with ID: ${id}`);
      return null;
    }
  }

  // Get all documents in the collection
  async getCollection(): Promise<T[]> {
    const querySnapshot = await getDocs(this.baseCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  // Stream real-time updates for the collection
  streamCollection(callback: (snapshot: QuerySnapshot<DocumentData>) => void): () => void {
    const unsubscribe = onSnapshot(this.baseCollection, callback);
    return unsubscribe;
  }

  // Add a new document to the collection
  async addDocument(data: T): Promise<string> {
    const docRef = await addDoc(this.baseCollection, data as DocumentData);
    return docRef.id;
  }

  // Update an existing document by ID
  async updateDocument(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.baseCollection, id);
    await updateDoc(docRef, data);
  }

  // Delete a document by ID
  async deleteDocument(id: string): Promise<void> {
    const docRef = doc(this.baseCollection, id);
    await deleteDoc(docRef);
  }
}

export default FirestoreService;
