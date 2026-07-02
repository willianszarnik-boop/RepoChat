import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs as firestoreGetDocs, 
  setDoc, 
  deleteDoc as firestoreDeleteDoc, 
  doc,
  addDoc as firestoreAddDoc
} from 'firebase/firestore';
import { UsefulSite, DriveFolder, DocArticle, TutorialVideo } from '../data/presets';

// Firebase config parameters from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyBxbhgxCjpMp-2_mm64FKLTvdmZDjL1DAY",
  authDomain: "gen-lang-client-0177844085.firebaseapp.com",
  projectId: "gen-lang-client-0177844085",
  storageBucket: "gen-lang-client-0177844085.firebasestorage.app",
  messagingSenderId: "462353996055",
  appId: "1:462353996055:web:a66dc534071a52274dff52"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-repochat-3c84cfc0-2a1d-4274-939d-5c880e3b6d46");
export const auth = getAuth();

// Interfaces
export interface AppUser {
  id: string;
  username: string;
  role: 'admin' | 'editor' | 'user';
  password?: string;
  createdAt?: string;
}

// Collections helper keys
const SITES_COL = 'useful_sites';
const FOLDERS_COL = 'drive_folders';
const DOCS_COL = 'doc_articles';
const TUTORIALS_COL = 'tutorial_videos';
const USERS_COL = 'app_users';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Seed initial presets into Firestore if collection is empty
export async function seedInitialData(
  presetSites: UsefulSite[],
  presetFolders: DriveFolder[]
) {
  try {
    // 1. Seed Sites
    let sitesSnap;
    try {
      sitesSnap = await firestoreGetDocs(collection(db, SITES_COL));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, SITES_COL);
      return;
    }

    if (sitesSnap.empty) {
      console.log('Seeding initial sites...');
      for (const site of presetSites) {
        try {
          await setDoc(doc(db, SITES_COL, site.id), site);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `${SITES_COL}/${site.id}`);
        }
      }
    }

    // 2. Seed Folders
    let foldersSnap;
    try {
      foldersSnap = await firestoreGetDocs(collection(db, FOLDERS_COL));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, FOLDERS_COL);
      return;
    }

    if (foldersSnap.empty) {
      console.log('Seeding initial folders...');
      for (const folder of presetFolders) {
        try {
          await setDoc(doc(db, FOLDERS_COL, folder.id), folder);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `${FOLDERS_COL}/${folder.id}`);
        }
      }
    }

    // 3. Seed initial admin user if no users exist
    let usersSnap;
    try {
      usersSnap = await firestoreGetDocs(collection(db, USERS_COL));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, USERS_COL);
      return;
    }

    if (usersSnap.empty) {
      console.log('Seeding initial admin user...');
      try {
        await setDoc(doc(db, USERS_COL, 'admin'), {
          id: 'admin',
          username: 'admin',
          role: 'admin',
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `${USERS_COL}/admin`);
      }
    }

    // 4. Seed initial welcome doc if no docs exist
    let docsSnap;
    try {
      docsSnap = await firestoreGetDocs(collection(db, DOCS_COL));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, DOCS_COL);
      return;
    }

    if (docsSnap.empty) {
      console.log('Seeding initial doc article...');
      const welcomeDoc: DocArticle = {
        id: 'welcome',
        category: 'UpChat',
        title: 'Bem-vindo ao RepoChat',
        summary: 'Guia introdutório para utilização do repositório.',
        content: `Bem-vindo ao RepoChat, a central oficial de inteligência e documentações para os integradores ISP da UpChat.

Aproveite ao máximo essa plataforma:
- Consulte as pastas de integração do Google Drive para carregar templates de fluxogramas em JSON.
- Acesse utilitários rápidos na aba "Sites Úteis".
- Explore e baixe manuais em PDF ou texto na aba "Documentação".
- Treine o seu time de atendimento com os tutoriais em vídeo emulados.

Se você for administrador, use a aba de Acesso Restrito no canto superior para gerenciar os dados ou configurar os usuários corporativos.`
      };
      try {
        await setDoc(doc(db, DOCS_COL, welcomeDoc.id), welcomeDoc);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `${DOCS_COL}/${welcomeDoc.id}`);
      }
    }

    // 5. Seed initial tutorial if empty
    let tutorialsSnap;
    try {
      tutorialsSnap = await firestoreGetDocs(collection(db, TUTORIALS_COL));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, TUTORIALS_COL);
      return;
    }

    if (tutorialsSnap.empty) {
      console.log('Seeding initial tutorial...');
      const firstVideo: TutorialVideo = {
        id: 'tut-import',
        title: 'Como importar fluxos padrões UpChat no SGP ERP',
        duration: 180,
        difficulty: 'Iniciante',
        instructor: 'Gustavo Santos',
        category: 'Integrações',
        description: 'Tutorial básico focado em demonstrar o carregamento do JSON de fluxos dentro do integrador do SGP ERP, apontando as variáveis globais.',
        keyTakeaways: [
          'Download do arquivo JSON da pasta SGP',
          'Acesso ao painel administrativo UpChat',
          'Mapeamento de chaves de API e variáveis de banco'
        ],
        visualSteps: [
          { time: 0, label: 'Introdução', detail: 'Baixe o JSON na aba Google Drive e prepare as chaves de API do seu provedor.' },
          { time: 45, label: 'Importando o JSON', detail: 'Entre no painel de fluxos e clique em Importar. Carregue o arquivo baixado.' },
          { time: 110, label: 'Configurando Variáveis', detail: 'Ajuste os blocos HTTP adicionando o token de portador de desenvolvimento.' },
          { time: 160, label: 'Testes e Validação', detail: 'Simule um envio de mensagem para ver se o retorno de faturas está correto.' }
        ],
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        playlist: 'Início Rápido'
      };
      try {
        await setDoc(doc(db, TUTORIALS_COL, firstVideo.id), firstVideo);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `${TUTORIALS_COL}/${firstVideo.id}`);
      }
    }
  } catch (err) {
    console.error('Error seeding initial data to Firestore:', err);
  }
}

// Database helper functions for frontend consumption
export async function getSitesFromDb(): Promise<UsefulSite[]> {
  try {
    const querySnapshot = await firestoreGetDocs(collection(db, SITES_COL));
    const list: UsefulSite[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as UsefulSite);
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, SITES_COL);
    return [];
  }
}

// Helper to clean undefined values from objects before writing to Firestore
function cleanUndefined(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(item => cleanUndefined(item));
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] !== undefined) {
        cleaned[key] = cleanUndefined(obj[key]);
      }
    }
    return cleaned;
  }
  return obj;
}

export async function saveSiteToDb(site: UsefulSite) {
  try {
    await setDoc(doc(db, SITES_COL, site.id), cleanUndefined(site));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SITES_COL}/${site.id}`);
  }
}

export async function deleteSiteFromDb(id: string) {
  try {
    await firestoreDeleteDoc(doc(db, SITES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${SITES_COL}/${id}`);
  }
}

export async function getFoldersFromDb(): Promise<DriveFolder[]> {
  try {
    const querySnapshot = await firestoreGetDocs(collection(db, FOLDERS_COL));
    const list: DriveFolder[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as DriveFolder);
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, FOLDERS_COL);
    return [];
  }
}

export async function saveFolderToDb(folder: DriveFolder) {
  try {
    await setDoc(doc(db, FOLDERS_COL, folder.id), cleanUndefined(folder));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${FOLDERS_COL}/${folder.id}`);
  }
}

export async function deleteFolderFromDb(id: string) {
  try {
    await firestoreDeleteDoc(doc(db, FOLDERS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${FOLDERS_COL}/${id}`);
  }
}

export async function getDocsFromDb(): Promise<DocArticle[]> {
  try {
    const querySnapshot = await firestoreGetDocs(collection(db, DOCS_COL));
    const list: DocArticle[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as DocArticle);
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, DOCS_COL);
    return [];
  }
}

export async function saveDocToDb(docArticle: DocArticle) {
  try {
    await setDoc(doc(db, DOCS_COL, docArticle.id), cleanUndefined(docArticle));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${DOCS_COL}/${docArticle.id}`);
  }
}

export async function deleteDocFromDb(id: string) {
  try {
    await firestoreDeleteDoc(doc(db, DOCS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${DOCS_COL}/${id}`);
  }
}

export async function getTutorialsFromDb(): Promise<TutorialVideo[]> {
  try {
    const querySnapshot = await firestoreGetDocs(collection(db, TUTORIALS_COL));
    const list: TutorialVideo[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as TutorialVideo);
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, TUTORIALS_COL);
    return [];
  }
}

export async function saveTutorialToDb(video: TutorialVideo) {
  try {
    await setDoc(doc(db, TUTORIALS_COL, video.id), cleanUndefined(video));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${TUTORIALS_COL}/${video.id}`);
  }
}

export async function deleteTutorialFromDb(id: string) {
  try {
    await firestoreDeleteDoc(doc(db, TUTORIALS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${TUTORIALS_COL}/${id}`);
  }
}

// User helper functions
export async function getUsersFromDb(): Promise<AppUser[]> {
  try {
    const querySnapshot = await firestoreGetDocs(collection(db, USERS_COL));
    const list: AppUser[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as AppUser);
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, USERS_COL);
    return [];
  }
}

export async function saveUserToDb(user: AppUser) {
  try {
    await setDoc(doc(db, USERS_COL, user.id), cleanUndefined(user));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${USERS_COL}/${user.id}`);
  }
}

export async function deleteUserFromDb(id: string) {
  try {
    await firestoreDeleteDoc(doc(db, USERS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${USERS_COL}/${id}`);
  }
}
