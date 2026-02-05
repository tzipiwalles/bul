// lib/communities.ts

export type Community = {
  id: string;
  label: string;
  category: 'sector' | 'hasidut' | 'movement' | 'other';
};

export const COMMUNITIES: Community[] = [
  // --- מגזרים כלליים ---
  { id: 'general', label: 'כללי / ללא שיוך', category: 'sector' },
  
  // --- תנועות גדולות ---
  { id: 'chabad', label: 'חב"ד', category: 'movement' },
  { id: 'breslov', label: 'ברסלב', category: 'movement' },

  // --- חסידויות גדולות (לפי סדר גודל משוער) ---
  { id: 'gur', label: 'גור', category: 'hasidut' },
  { id: 'belz', label: 'בעלז', category: 'hasidut' },
  { id: 'vizhnitz', label: 'ויז\'ניץ', category: 'hasidut' },
  { id: 'sanz', label: 'צאנז', category: 'hasidut' },
  { id: 'boyan', label: 'באיאן', category: 'hasidut' },
  { id: 'slonim', label: 'סלונים', category: 'hasidut' },
  { id: 'karlin', label: 'קרלין סטולין', category: 'hasidut' },
  { id: 'seret_vizhnitz', label: 'סערט ויז\'ניץ', category: 'hasidut' },
  { id: 'biale', label: 'ביאלא', category: 'hasidut' },
  { id: 'sadigura', label: 'סדיגורא', category: 'hasidut' },
  { id: 'modzitz', label: 'מודז\'יץ', category: 'hasidut' },
  { id: 'erlau', label: 'ערלוי', category: 'hasidut' },
  { id: 'alexander', label: 'אלכסנדר', category: 'hasidut' },
  { id: 'lelov', label: 'לעלוב', category: 'hasidut' },
  { id: 'amshinov', label: 'אמשינוב', category: 'hasidut' },
  { id: 'darag', label: 'דאראג', category: 'hasidut' },
  { id: 'nadvorna', label: 'נדבורנה', category: 'hasidut' },

  // --- קהילות קנאים / מאה שערים ---
  { id: 'satmar', label: 'סאטמר', category: 'hasidut' },
  { id: 'toldos_aharon', label: 'תולדות אהרן', category: 'hasidut' },
  { id: 'toldos_avraham', label: 'תולדות אברהם יצחק', category: 'hasidut' },
  { id: 'edah_haredit', label: 'העדה החרדית', category: 'sector' },

  // --- אחר ---
  { id: 'other', label: 'אחר', category: 'other' },
];
