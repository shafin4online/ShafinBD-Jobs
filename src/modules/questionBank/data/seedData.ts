import { collection, getDocs, writeBatch, doc, Timestamp, limit, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { CorrectAnswer, QuestionDifficulty } from '../../../types/questionBank';

export interface SeedQuestionItem {
  id: string;
  subjectId: string;
  topicId: string;
  subtopicId: string | null;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: CorrectAnswer;
  explanation: string;
  difficulty: QuestionDifficulty;
  source: string;
  examName: string;
  examYear: number;
  tags: string[];
}

export const SEED_SUBJECTS = [
  {
    id: 'subject-bangla',
    name: 'বাংলা ভাষা ও সাহিত্য',
    slug: 'bangla-language-and-literature',
    description: 'বিসিএস, ব্যাংক, প্রাথমিক শিক্ষক ও সরকারি চাকরির জন্য সম্পূর্ণ বাংলা সাহিত্য ও ব্যাকরণ।',
    icon: 'BookOpen',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'subject-bangladesh',
    name: 'বাংলাদেশ বিষয়াবলী',
    slug: 'bangladesh-affairs',
    description: 'বাংলাদেশের ইতিহাস, মুক্তিযুদ্ধ, সংবিধান, অর্থনীতি, ভূগোল ও সাম্প্রতিক ঘটনাবলী।',
    icon: 'Flag',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'subject-english',
    name: 'English Language & Literature',
    slug: 'english-language-and-literature',
    description: 'Grammar, Vocabulary, Idioms, Literature, Parts of Speech & Comprehension.',
    icon: 'Languages',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'subject-math-science',
    name: 'সাধারণ বিজ্ঞান ও গণিত',
    slug: 'general-science-and-math',
    description: 'দৈনন্দিন বিজ্ঞান, পাটিগণিত, বীজগণিত, জ্যামিতি ও মানসিক দক্ষতা।',
    icon: 'Cpu',
    sortOrder: 4,
    isActive: true,
  },
];

export const SEED_TOPICS = [
  {
    id: 'topic-charyapada',
    subjectId: 'subject-bangla',
    name: 'প্রাচীন ও মধ্যযুগীয় বাংলা সাহিত্য',
    slug: 'ancient-medieval-bangla-literature',
    description: 'চর্যাপদ, মঙ্গলকাব্য, বৈষ্ণব পদাবলী ও শ্রীকৃষ্ণকীর্তন কাব্য।',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'topic-bangla-grammar',
    subjectId: 'subject-bangla',
    name: 'বাংলা ব্যাকরণ ও নির্মিতি',
    slug: 'bangla-grammar',
    description: 'সন্ধি, সমাস, কারক ও বিভক্তি, প্রত্যয় ও বানান শুদ্ধি।',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'topic-liberation-war',
    subjectId: 'subject-bangladesh',
    name: 'মুক্তিযুদ্ধ ও স্বাধীনতার ইতিহাস',
    slug: 'liberation-war-history',
    description: '১৯৫২ থেকে ১৯৭১ এর স্বাধীনতা সংগ্রাম, সেক্টর কমান্ডার ও বীরশ্রেষ্ঠ।',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'topic-constitution',
    subjectId: 'subject-bangladesh',
    name: 'বাংলাদেশের সংবিধান ও সরকার ব্যবস্থা',
    slug: 'bangladesh-constitution',
    description: 'সংবিধানের মৌলিক অনুচ্ছেদ, সংশোধনী ও রাষ্ট্রীয় মূলনীতি।',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'topic-english-grammar',
    subjectId: 'subject-english',
    name: 'English Grammar & Usage',
    slug: 'english-grammar-usage',
    description: 'Subject-Verb Agreement, Tense, Prepositions, Voice & Narration.',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'topic-general-science',
    subjectId: 'subject-math-science',
    name: 'দৈনন্দিন বিজ্ঞান ও প্রযুক্তি',
    slug: 'daily-science-technology',
    description: 'পদার্থ, রসায়ন, জীববিজ্ঞান ও আইসিটি সম্পর্কিত প্রস্তুতি।',
    sortOrder: 1,
    isActive: true,
  },
];

export const SEED_QUESTIONS: SeedQuestionItem[] = [
  {
    id: 'q-bangla-1',
    subjectId: 'subject-bangla',
    topicId: 'topic-charyapada',
    subtopicId: null,
    question: 'বাংলা সাহিত্যের প্রাচীনতম নিদর্শন "চর্যাপদ" কে এবং কোথা থেকে আবিষ্কার করেন?',
    options: {
      A: 'ড. মুহম্মদ শহীদুল্লাহ, ঢাকা থেকে',
      B: 'হরপ্রসাদ শাস্ত্রী, নেপালের রাজদরবারের রয়েল লাইব্রেরি থেকে',
      C: 'সুনীতিকুমার চট্টোপাধ্যায়, কলকাতা বিশ্ববিদ্যালয় থেকে',
      D: 'মহামহোপাধ্যায় ঈশ্বরচন্দ্র গুপ্ত, শান্তিনিকেতন থেকে',
    },
    correctAnswer: 'B',
    explanation: '১৯০৭ সালে মহামহোপাধ্যায় হরপ্রসাদ শাস্ত্রী নেপালের রাজদরবারের রয়েল লাইব্রেরি থেকে "চর্যাচর্যবিনিশ্চয়" বা চর্যাপদের পুথি আবিষ্কার করেন। পরবর্তীতে ১৯১৬ সালে বঙ্গীয় সাহিত্য পরিষদ থেকে এটি প্রকাশিত হয়।',
    difficulty: 'easy',
    source: 'বিসিএস',
    examName: '৪৪তম বিসিএস প্রিলিমিনারি',
    examYear: 2022,
    tags: ['চর্যাপদ', 'প্রাচীন যুগ', 'বিসিএস'],
  },
  {
    id: 'q-bangla-2',
    subjectId: 'subject-bangla',
    topicId: 'topic-charyapada',
    subtopicId: null,
    question: 'চর্যাপদের সবচেয়ে বেশি পদ কে রচনা করেছেন?',
    options: {
      A: 'লুইপা',
      B: 'ভুসুকুপা',
      C: 'কাহ্নপা',
      D: 'শবরপা',
    },
    correctAnswer: 'C',
    explanation: 'কাহ্নপা সর্বাধিক ১৩টি পদ রচনা করেছেন (৭, ৯, ১০, ১১, ১২, ১৩, ১৮, ১৯, ২৪, ৩৬, ৪০, ৪২, ৪৫)। লুইপা ছিলেন প্রথম পদকর্তা এবং ভুসুকুপা ৮টি পদ রচনা করেছেন।',
    difficulty: 'easy',
    source: 'বিসিএস',
    examName: '৪১তম বিসিএস প্রিলিমিনারি',
    examYear: 2021,
    tags: ['চর্যাপদ', 'পদকর্তা'],
  },
  {
    id: 'q-bangla-3',
    subjectId: 'subject-bangla',
    topicId: 'topic-bangla-grammar',
    subtopicId: null,
    question: '"সন্ধি" ব্যাকরণের কোন অংশের আলোচ্য বিষয়?',
    options: {
      A: 'রূপতত্ত্ব (Morphemics)',
      B: 'ধ্বনিমূল বা ধ্বনিতত্ত্ব (Phonology)',
      C: 'বাক্যতত্ত্ব (Syntax)',
      D: 'অর্থতত্ত্ব (Semantics)',
    },
    correctAnswer: 'B',
    explanation: 'সন্ধি অর্থ ধ্বনির মিলন। দুটি সন্নিহিত ধ্বনির মিলনকে সন্ধি বলে। তাই সন্ধি ধ্বনিতত্ত্বের (Phonology) অন্যতম প্রধান আলোচ্য বিষয়।',
    difficulty: 'medium',
    source: 'প্রাথমিক সহকারী শিক্ষক',
    examName: 'সহকারী শিক্ষক নিয়োগ পরীক্ষা',
    examYear: 2023,
    tags: ['ব্যাকরণ', 'সন্ধি', 'ধ্বনিতত্ত্ব'],
  },
  {
    id: 'q-bangla-4',
    subjectId: 'subject-bangla',
    topicId: 'topic-bangla-grammar',
    subtopicId: null,
    question: '"সিংহাসন" কোন সমাসের দৃষ্টান্ত?',
    options: {
      A: 'দ্বন্দ্ব সমাস',
      B: 'মধ্যপদলোপী কর্মধারয় সমাস',
      C: 'বহুব্রীহি সমাস',
      D: 'তৎপুরুষ সমাস',
    },
    correctAnswer: 'B',
    explanation: 'সিংহ চিহ্নিত আসন = সিংহাসন। যে কর্মধারয় সমাসে ব্যাসবাক্যের মধ্যস্থিত পদ বিলোপ পায়, তাকে মধ্যপদলোপী কর্মধারয় সমাস বলে।',
    difficulty: 'easy',
    source: 'বিসিএস',
    examName: '৪০তম বিসিএস প্রিলিমিনারি',
    examYear: 2019,
    tags: ['সমাস', 'কর্মধারয়'],
  },
  {
    id: 'q-bangladesh-1',
    subjectId: 'subject-bangladesh',
    topicId: 'topic-liberation-war',
    subtopicId: null,
    question: '১৯৭১ সালে মুক্তিযুদ্ধের সময় সমগ্র বাংলাদেশকে কয়টি সেক্টরে বিভক্ত করা হয়েছিল?',
    options: {
      A: '৯টি সেক্টর',
      B: '১০টি সেক্টর',
      C: '১১টি সেক্টর',
      D: '৬৪টি সেক্টর',
    },
    correctAnswer: 'C',
    explanation: '১৯৭১ সালের ১০ জুলাই থেকে ১৭ জুলাই পর্যন্ত কলকাতায় অনুষ্ঠিত সেক্টর কমান্ডারদের সম্মেলনে সমগ্র বাংলাদেশকে কার্যকর যুদ্ধের জন্য ১১টি সেক্টর এবং ৬৪টি সাব-সেক্টরে বিভক্ত করা হয়। ১০ নং সেক্টর ছিল নৌ সেক্টর (নিয়মিত কোনো সেক্টর কমান্ডার ছিলেন না)।',
    difficulty: 'easy',
    source: 'বিসিএস',
    examName: '৪৫তম বিসিএস প্রিলিমিনারি',
    examYear: 2023,
    tags: ['মুক্তিযুদ্ধ', 'সেক্টর', 'ইতিহাস'],
  },
  {
    id: 'q-bangladesh-2',
    subjectId: 'subject-bangladesh',
    topicId: 'topic-liberation-war',
    subtopicId: null,
    question: 'বীরশ্রেষ্ঠদের মধ্যে সর্বকনিষ্ঠ কে ছিলেন?',
    options: {
      A: 'ল্যান্স নায়েক নূর মোহাম্মদ শেখ',
      B: 'সিপাহী মোস্তফা কামাল',
      C: 'ফ্লাইট লেফটেন্যান্ট মতিউর রহমান',
      D: 'সিপাহী মোহাম্মদ মোস্তফা কামাল ও শহিদ রুহুল আমিন',
    },
    correctAnswer: 'B',
    explanation: 'বীরশ্রেষ্ঠ মোস্তফা কামাল ১৯৪৭ সালের ১৬ ডিসেম্বর জন্মগ্রহণ করেন এবং ১৯৭১ সালের ১৮ এপ্রিল মাত্র ২৩ বছর ৪ মাস বয়সে ব্রাহ্মণবাড়িয়ার দরুইন গ্রামে সম্মুখ যুদ্ধে শহিদ হন।',
    difficulty: 'medium',
    source: 'কম্বাইন্ড ব্যাংক',
    examName: '৮ ব্যাংক অফিসার পরীক্ষা',
    examYear: 2022,
    tags: ['বীরশ্রেষ্ঠ', 'মুক্তিযুদ্ধ'],
  },
  {
    id: 'q-bangladesh-3',
    subjectId: 'subject-bangladesh',
    topicId: 'topic-constitution',
    subtopicId: null,
    question: 'গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধানের মূলনীতি কয়টি ও কী কী?',
    options: {
      A: '৩টি: গণতন্ত্র, সমাজতন্ত্র ও ধর্মনিরপেক্ষতা',
      B: '৪টি: জাতীয়তাবাদ, সমাজতন্ত্র, গণতন্ত্র ও ধর্মনিরপেক্ষতা',
      C: '৫টি: স্বাধীনতা, সার্বভৌমত্ব, সাম্য, একতা ও গণতন্ত্র',
      D: '৬টি: মৌলিক অধিকার বিষয়ক নীতিসমূহ',
    },
    correctAnswer: 'B',
    explanation: 'সংবিধানের ৮(১) অনুচ্ছেদ অনুযায়ী রাষ্ট্র পরিচালনার মূলনীতি ৪টি: জাতীয়তাবাদ, সমাজতন্ত্র, গণতন্ত্র ও ধর্মনিরপেক্ষতা। ১৯৭২ সালের ৪ নভেম্বর সংবিধান গৃহীত হয় এবং ১৬ ডিসেম্বর থেকে কার্যকর হয়।',
    difficulty: 'easy',
    source: 'বিসিএস',
    examName: '৪৩তম বিসিএস প্রিলিমিনারি',
    examYear: 2021,
    tags: ['সংবিধান', 'রাষ্ট্র পরিচালনার মূলনীতি'],
  },
  {
    id: 'q-bangladesh-4',
    subjectId: 'subject-bangladesh',
    topicId: 'topic-constitution',
    subtopicId: null,
    question: 'বাংলাদেশের সংবিধানে কতটি ভাগ এবং কতটি অনুচ্ছেদ রয়েছে?',
    options: {
      A: '১০টি ভাগ ও ১৪৩টি অনুচ্ছেদ',
      B: '১১টি ভাগ ও ১৫৩টি অনুচ্ছেদ',
      C: '১২টি ভাগ ও ১৬০টি অনুচ্ছেদ',
      D: '১৪টি ভাগ ও ১৫০টি অনুচ্ছেদ',
    },
    correctAnswer: 'B',
    explanation: 'বাংলাদেশের সংবিধানে একটি প্রস্তাবনা, ১১টি ভাগ, ১৫৩টি অনুচ্ছেদ এবং ৭টি তফসিল রয়েছে।',
    difficulty: 'easy',
    source: 'বিসিএস',
    examName: '৩৮তম বিসিএস',
    examYear: 2017,
    tags: ['সংবিধান', 'অনুচ্ছেদ'],
  },
  {
    id: 'q-english-1',
    subjectId: 'subject-english',
    topicId: 'topic-english-grammar',
    subtopicId: null,
    question: 'Choose the correct sentence:',
    options: {
      A: 'Each of the students have done their homework.',
      B: 'Each of the students has done his homework.',
      C: 'Each of the students are doing their homework.',
      D: 'Each of the student has done his homework.',
    },
    correctAnswer: 'B',
    explanation: '"Each", "every", "either", and "neither" take singular verbs and singular pronouns when referring to individuals. "Each of the students" requires the singular verb "has" and singular pronoun "his".',
    difficulty: 'medium',
    source: 'BCS',
    examName: '44th BCS Preliminary',
    examYear: 2022,
    tags: ['Subject-Verb Agreement', 'Grammar'],
  },
  {
    id: 'q-english-2',
    subjectId: 'subject-english',
    topicId: 'topic-english-grammar',
    subtopicId: null,
    question: 'What is the synonym of the word "Meticulous"?',
    options: {
      A: 'Careless',
      B: 'Painstaking and precise',
      C: 'Hasty',
      D: 'Ambiguous',
    },
    correctAnswer: 'B',
    explanation: '"Meticulous" means showing great attention to detail; very careful and precise (নিখুঁত বা অত্যন্ত সতর্ক). Synonym: Painstaking, thorough, fastidious.',
    difficulty: 'medium',
    source: 'Combined Bank',
    examName: 'Officer General Exam',
    examYear: 2023,
    tags: ['Vocabulary', 'Synonym'],
  },
  {
    id: 'q-science-1',
    subjectId: 'subject-math-science',
    topicId: 'topic-general-science',
    subtopicId: null,
    question: 'বাতাসে শব্দের গতিবেগ প্রতি সেকেন্ডে প্রায় কত মিটার?',
    options: {
      A: '৩৩২ মিটার/সেকেন্ড (0°C তাপমাত্রায়)',
      B: '৩০০,০০০ মিটার/সেকেন্ড',
      C: '১,৪৫০ মিটার/সেকেন্ড',
      D: '৫,১০০ মিটার/সেকেন্ড',
    },
    correctAnswer: 'A',
    explanation: '0° সেলসিয়াস তাপমাত্রায় শুষ্ক বাতাসে শব্দের বেগ ৩৩২ মিটার/সেকেন্ড (২০° সে-এ প্রায় ৩৪৩ মিটার/সেকেন্ড)। আলোকের বেগ বাতাসে প্রায় ৩×১০^৮ মিটার/সেকেন্ড।',
    difficulty: 'easy',
    source: 'বিসিএস',
    examName: '৪২তম বিশেষ বিসিএস',
    examYear: 2021,
    tags: ['বিজ্ঞান', 'শব্দবিজ্ঞান'],
  },
  {
    id: 'q-science-2',
    subjectId: 'subject-math-science',
    topicId: 'topic-general-science',
    subtopicId: null,
    question: 'কম্পিউটারের স্থায়ী স্মৃতিশক্তি বা Permanent Memory কোনটি?',
    options: {
      A: 'RAM (Random Access Memory)',
      B: 'ROM (Read Only Memory)',
      C: 'Cache Memory',
      D: 'Virtual Memory',
    },
    correctAnswer: 'B',
    explanation: 'ROM (Read Only Memory) হলো কম্পিউটারের নন-ভোলাটাইল (Non-volatile) বা স্থায়ী মেমোরি। বিদ্যুৎ চলে গেলেও এর সংরক্ষিত তথ্য মুছে যায় না। অপরদিকে RAM ভোলাটাইল বা অস্থায়ী মেমোরি।',
    difficulty: 'easy',
    source: 'বিসিএস',
    examName: '৪৪তম বিসিএস',
    examYear: 2022,
    tags: ['আইসিটি', 'কম্পিউটার স্মৃতি'],
  },
];

/**
 * Seeds initial question bank data into Firestore if empty
 */
export const seedInitialQuestionBankIfEmpty = async (): Promise<boolean> => {
  try {
    const subjectsSnap = await getDocs(query(collection(db, 'subjects'), limit(1)));
    if (!subjectsSnap.empty) {
      return false; // Already seeded
    }

    const batch = writeBatch(db);
    const now = Timestamp.now();

    // 1. Seed Subjects
    for (const sub of SEED_SUBJECTS) {
      const qCount = SEED_QUESTIONS.filter((q) => q.subjectId === sub.id).length;
      const tCount = SEED_TOPICS.filter((t) => t.subjectId === sub.id).length;

      const subRef = doc(db, 'subjects', sub.id);
      batch.set(subRef, {
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        icon: sub.icon,
        sortOrder: sub.sortOrder,
        questionCount: qCount,
        topicCount: tCount,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    // 2. Seed Topics
    for (const top of SEED_TOPICS) {
      const qCount = SEED_QUESTIONS.filter((q) => q.topicId === top.id).length;
      const topRef = doc(db, 'topics', top.id);
      batch.set(topRef, {
        subjectId: top.subjectId,
        name: top.name,
        slug: top.slug,
        description: top.description,
        sortOrder: top.sortOrder,
        questionCount: qCount,
        subtopicCount: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    // 3. Seed Questions
    for (const q of SEED_QUESTIONS) {
      const qRef = doc(db, 'questions', q.id);
      batch.set(qRef, {
        subjectId: q.subjectId,
        topicId: q.topicId,
        subtopicId: q.subtopicId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        source: q.source,
        examName: q.examName,
        examYear: q.examYear,
        tags: q.tags,
        randomKey: Math.random(),
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    await batch.commit();
    return true;
  } catch (error: any) {
    console.warn('Initial question bank seed notice (using in-memory fallback):', error?.message || error);
    return false;
  }
};
