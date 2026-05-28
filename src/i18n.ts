/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from './types';

export const translations: Record<Language, Record<string, string>> = {
  id: {
    appName: "KopiSpace",
    appSub: "Workspace Kafe Produktif Eksekutif",
    workspace: "Halaman Catatan",
    pomodoro: "Pomodoro Timer",
    todoHabit: "Tugas & Kebiasaan",
    money: "Keuangan Kafe",
    kanban: "Papan Proyek",
    contacts: "Direktori Kontak",
    settings: "Pengaturan Sistem",
    musicPlayer: "Pemutar Lofi Kafe",
    
    // Page/Workspace translation
    addPage: "Tambah Halaman",
    untitledPage: "Halaman Tanpa Judul",
    notionPlaceholder: "Ketik / untuk memicu menu, atau tulis sesuatu di sini...",
    deletePage: "Hapus Halaman",
    searchPages: "Cari halaman...",
    lastEdit: "Terakhir diubah: ",
    noPages: "Belum ada halaman. Buat halaman baru untuk mencatat inspirasi Anda!",

    // Pomodoro translation
    focusTime: "Waktu Fokus!",
    breakTime: "Waktu Istirahat!",
    start: "Mulai",
    pause: "Jeda",
    reset: "Ulangi",
    adjustTime: "Atur Durasi (Menit)",
    focusLabel: "Kerja/Fokus",
    breakLabel: "Istirahat",
    pomodoroSessions: "Sesi Selesai: ",

    // Todo & Habits
    todoTitle: "Daftar Tugas",
    habitTitle: "Pelacak Kebiasaan",
    completionRate: "Persentase Selesai Hari Ini",
    addTodo: "Tambah Tugas Baru...",
    addHabit: "Tambah Kebiasaan Baru...",
    categoryWork: "Pekerjaan",
    categoryCreative: "Kreatif",
    categoryStudy: "Belajar",
    categoryPersonal: "Pribadi",
    priorityHigh: "Tinggi",
    priorityMedium: "Sedang",
    priorityLow: "Rendah",
    streakCount: "Beruntun: {streak} hari",
    habitDone: "Selesai",
    todoEmpty: "Yey! Semua tugas hari ini sudah selesai.",
    habitEmpty: "Belum ada kebiasaan yang didaftarkan.",

    // Money Management
    moneyTitle: "Manajemen Keuangan",
    totalBalance: "Total Saldo Anda",
    income: "Pemasukan",
    expense: "Pengeluaran",
    addTransaction: "Tambah Transaksi",
    txName: "Nama Transaksi",
    amount: "Jumlah (Rupiah / IDR)",
    category: "Kategori",
    selectCategory: "Pilih Kategori",
    recentTransactions: "Histori Transaksi Terakhir",
    emptyTx: "Belum ada pencatatan kas.",

    // Kanban Project
    projectTitle: "Manajemen Proyek",
    todoCol: "Antrean (To Do)",
    progressCol: "Sedang Dikerjakan",
    doneCol: "Selesai (Done)",
    addCard: "Tambah Kartu",
    cardTitle: "Judul Proyek / Tugas",
    cardDesc: "Deskripsi Singkat",
    cardTag: "Tag Fokus",
    emptyCard: "Seret atau isi list.",

    // Contacts
    contactTitle: "Direktori Kontak",
    addContact: "Tambah Kontak",
    contactName: "Nama Lengkap",
    contactRole: "Peran / Bidang",
    contactEmail: "Surel / Email",
    contactPhone: "Telepon / WhatsApp",
    contactNote: "Catatan Singkat",
    searchContacts: "Cari kontak...",
    emptyContacts: "Belum ada kontak terdaftar.",

    // Settings
    settingsTitle: "Konfigurasi Sistem",
    interfaceStyle: "Gaya Komponen UI",
    styleCupertino: "Cupertino (Gaya iOS)",
    styleMaterial: "Material (Gaya Android)",
    languageSelect: "Bahasa Tampilan",
    themeSelect: "Mode Tampilan",
    themeDark: "Suasana Malam (Sleek Dark)",
    themeLight: "Suasana Kafe Siang (Light Cozy)",
    soundEffects: "Efek Suara (SFX)",
    bgmVolume: "Volume Musik (BGM)",
    saveConfig: "Simpan Pengaturan",
    pwaStatus: "Status Aplikasi PWA",
    pwaInstallable: "Siap dipasang di Beranda!",
    pwaInstalled: "Aplikasi sudah berjalan secara lokal.",

    // General Items
    creative: "Kreatif",
    it: "IT / Teknologi",
    student: "Pelajar / Mahasiswa",
    general: "Umum",
    save: "Simpan",
    cancel: "Batal",
    delete: "Hapus",
    actions: "Aksi",
    close: "Tutup"
  },
  en: {
    appName: "KopiSpace",
    appSub: "Executive Cozy Productivity Workspace",
    workspace: "Workspace Pages",
    pomodoro: "Pomodoro Timer",
    todoHabit: "Tasks & Habits",
    money: "Cafe Finance",
    kanban: "Project Board",
    contacts: "Contact Directory",
    settings: "System Settings",
    musicPlayer: "Cafe Lofi Player",

    // Page/Workspace translation
    addPage: "Add New Page",
    untitledPage: "Untitled Page",
    notionPlaceholder: "Type / for block menu, or start writing here...",
    deletePage: "Delete Page",
    searchPages: "Search pages...",
    lastEdit: "Last modified: ",
    noPages: "No pages yet. Create a page to capture your thoughts!",

    // Pomodoro translation
    focusTime: "Session Focused!",
    breakTime: "Rest Time!",
    start: "Start Focus",
    pause: "Pause",
    reset: "Reset",
    adjustTime: "Adjust Duration (Mins)",
    focusLabel: "Work/Focus",
    breakLabel: "Interval/Break",
    pomodoroSessions: "Sessions Completed: ",

    // Todo & Habits
    todoTitle: "Task List",
    habitTitle: "Habit Tracker",
    completionRate: "Daily Completion Rate",
    addTodo: "Add new task...",
    addHabit: "Add new habit...",
    categoryWork: "Work",
    categoryCreative: "Creative",
    categoryStudy: "Study",
    categoryPersonal: "Personal",
    priorityHigh: "High",
    priorityMedium: "Medium",
    priorityLow: "Low",
    streakCount: "Streak: {streak} days",
    habitDone: "Completed",
    todoEmpty: "Hurrah! All tasks are completed today.",
    habitEmpty: "No habits registered yet.",

    // Money Management
    moneyTitle: "Money Management",
    totalBalance: "Your Net Balance",
    income: "Income",
    expense: "Expense",
    addTransaction: "Add Transaction",
    txName: "Transaction Label",
    amount: "Amount",
    category: "Category",
    selectCategory: "Select Category",
    recentTransactions: "Recent Transactions",
    emptyTx: "No transactions recorded yet.",

    // Kanban Project
    projectTitle: "Kanban Project Manager",
    todoCol: "Pending / To Do",
    progressCol: "In Progress",
    doneCol: "Completed / Done",
    addCard: "Add Target Card",
    cardTitle: "Task/Project Title",
    cardDesc: "Brief Description",
    cardTag: "Focus Tag",
    emptyCard: "Empty.",

    // Contacts
    contactTitle: "Network Directory",
    addContact: "Add Contact",
    contactName: "Full Name",
    contactRole: "Role / Specialization",
    contactEmail: "Email",
    contactPhone: "Phone / WhatsApp",
    contactNote: "Notes",
    searchContacts: "Search contacts...",
    emptyContacts: "No contacts found.",

    // Settings
    settingsTitle: "System Configuration",
    interfaceStyle: "UI Component Paradigm",
    styleCupertino: "Cupertino (iOS Elegance)",
    styleMaterial: "Material (Android Fluid)",
    languageSelect: "Language (i18n)",
    themeSelect: "Environment Theme",
    themeDark: "Midnight Lounge (Sleek Dark)",
    themeLight: "Sunlit Cafe (Cozy Light)",
    soundEffects: "Sound Feedback (SFX)",
    bgmVolume: "Background Lounge (BGM)",
    saveConfig: "Apply Settings",
    pwaStatus: "Progressive Web App Status",
    pwaInstallable: "Ready to install on home screen!",
    pwaInstalled: "Running on local app context.",

    // General Items
    creative: "Creative",
    it: "IT / Tech",
    student: "Student / Learner",
    general: "General",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    actions: "Actions",
    close: "Close"
  },
  jp: {
    appName: "コピスペース (KopiSpace)",
    appSub: "クリエイティブカフェ生産性ワークスペース",
    workspace: "ドキュメント / ページ",
    pomodoro: "ポモドーロ タイマー",
    todoHabit: "タスク ＆ 習慣",
    money: "カフェ 家計簿",
    kanban: "カンバン ボード",
    contacts: "連絡先 ディレクトリ",
    settings: "システム 設定",
    musicPlayer: "BGM ロファイ プレーヤー",

    // Page/Workspace translation
    addPage: "新規ページ作成",
    untitledPage: "無題のページ",
    notionPlaceholder: "メニューを開くには「/」を入力、またはここに入力...",
    deletePage: "ページ削除",
    searchPages: "ドキュメント内を検索...",
    lastEdit: "最終更新: ",
    noPages: "ページがありません。新しいページを作成して執筆を始めましょう！",

    // Pomodoro translation
    focusTime: "フォーカス中！",
    breakTime: "リラックス休憩！",
    start: "開始",
    pause: "一時停止",
    reset: "リセット",
    adjustTime: "時間を調整 (分)",
    focusLabel: "集中時間",
    breakLabel: "休憩時間",
    pomodoroSessions: "完了したセッション: ",

    // Todo & Habits
    todoTitle: "タスク リスト",
    habitTitle: "習慣 トラッカー",
    completionRate: "本日の達成度率",
    addTodo: "新規タスクを追加...",
    addHabit: "習慣を追加...",
    categoryWork: "一般仕事",
    categoryCreative: "創造的",
    categoryStudy: "学業",
    categoryPersonal: "プライベート",
    priorityHigh: "高優先",
    priorityMedium: "普通",
    priorityLow: "低優先",
    streakCount: "連続達成: {streak}日",
    habitDone: "達成完了",
    todoEmpty: "おめでとうございます！本日の全タスクを消化しました。",
    habitEmpty: "登録された習慣がありません。",

    // Money Management
    moneyTitle: "カフェ収支管理",
    totalBalance: "現在の純残高",
    income: "収入",
    expense: "支出",
    addTransaction: "収支の追加",
    txName: "取引項目名",
    amount: "金額",
    category: "カテゴリ",
    selectCategory: "カテゴリ選択",
    recentTransactions: "最近の収支履歴",
    emptyTx: "まだ取引履歴がありません。",

    // Kanban Project
    projectTitle: "プロジェクト計画ボード",
    todoCol: "未着手 (To Do)",
    progressCol: "進行中 (Working)",
    doneCol: "完了 (Completed)",
    addCard: "カード新規作成",
    cardTitle: "タスク / 案件名",
    cardDesc: "簡単な概要説明",
    cardTag: "フォーカス タグ",
    emptyCard: "なし。",

    // Contacts
    contactTitle: "パートナー ディレクトリ",
    addContact: "連絡先を追加",
    contactName: "氏名",
    contactRole: "役割・役職",
    contactEmail: "メールアドレス",
    contactPhone: "電話番号 / WA",
    contactNote: "メモ書き",
    searchContacts: "連絡先を検索...",
    emptyContacts: "連絡先が登録されていません。",

    // Settings
    settingsTitle: "システム環境設定",
    interfaceStyle: "UIコンポーネント設計様式",
    styleCupertino: "Cupertino (iOS風滑らかさ)",
    styleMaterial: "Material (Android風安定)",
    languageSelect: "システム言語",
    themeSelect: "配色テーマモード",
    themeDark: "深夜ラウンジ (高コントラスト・ダーク)",
    themeLight: "木漏れ日カフェ (極上ナチュラル・ライト)",
    soundEffects: "操作効果音 (SFX)",
    bgmVolume: "ラウンジ音楽 (BGM)",
    saveConfig: "設定を適用",
    pwaStatus: "PWAデスクトップ版",
    pwaInstallable: "ホーム画面にインストール可能です！",
    pwaInstalled: "ローカルネイティブ環境で作動中。",

    // General Items
    creative: "クリエイティブ",
    it: "IT / テクノロジー",
    student: "学生 / 学び",
    general: "一般共通",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    actions: "行動",
    close: "閉じる"
  }
};

/**
 * Basic translation helper function
 */
export function translate(key: string, lang: Language, params?: Record<string, string>): string {
  const dictionary = translations[lang] || translations['en'];
  let text = dictionary[key] || translations['en'][key] || key;
  if (params) {
    Object.keys(params).forEach(pKey => {
      text = text.replace(`{${pKey}}`, params[pKey]);
    });
  }
  return text;
}
