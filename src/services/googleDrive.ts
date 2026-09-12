import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { CVData, DriveFileItem } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory token cache (never stored in localStorage as per security policy)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const getCachedAccessToken = () => cachedAccessToken;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

export const signInWithGoogleDrive = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive access token');
    }
    cachedAccessToken = credential.accessToken;
    isSigningIn = false;
    return { user: result.user, accessToken: credential.accessToken };
  } catch (error) {
    isSigningIn = false;
    console.error('Google Sign-In error:', error);
    throw error;
  }
};

export const signOutGoogle = async () => {
  cachedAccessToken = null;
  await firebaseSignOut(auth);
};

/**
 * Uploads a CV JSON document to Google Drive
 */
export const uploadCVToGoogleDrive = async (
  cvData: CVData,
  fileName?: string
): Promise<{ id: string; name: string; webViewLink?: string }> => {
  if (!cachedAccessToken) {
    throw new Error('You must connect your Google Drive account first.');
  }

  const safeName = fileName || `${cvData.personal.fullName.replace(/\s+/g, '_')}_CV_${new Date().toISOString().slice(0, 10)}.json`;
  const fileContent = JSON.stringify(cvData, null, 2);

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: safeName,
    mimeType: 'application/json',
    description: `Mobile CV Builder backup for ${cvData.personal.fullName}`,
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cachedAccessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Drive upload failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

/**
 * List CV backup files from the user's Google Drive created with this app
 */
export const listDriveCVFiles = async (): Promise<DriveFileItem[]> => {
  if (!cachedAccessToken) {
    return [];
  }

  const query = encodeURIComponent("mimeType = 'application/json' and trashed = false");
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=modifiedTime desc&fields=files(id,name,mimeType,modifiedTime,webViewLink)&pageSize=20`,
    {
      headers: {
        Authorization: `Bearer ${cachedAccessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to retrieve files from Google Drive');
  }

  const data = await response.json();
  return (data.files || []).filter((f: DriveFileItem) => f.name.endsWith('.json') || f.name.includes('CV'));
};

/**
 * Download and parse a CV backup from Google Drive
 */
export const downloadDriveCV = async (fileId: string): Promise<CVData> => {
  if (!cachedAccessToken) {
    throw new Error('Not connected to Google Drive');
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to download CV file from Google Drive');
  }

  const data = await response.json();
  return data as CVData;
};
