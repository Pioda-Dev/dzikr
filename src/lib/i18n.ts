// Translation strings for the app

type TranslationKey = string;

interface Translations {
  [key: string]: {
    [key in TranslationKey]: string;
  };
}

export const translations: Translations = {
  en: {
    // General
    "app.name": "Digital Tasbih",
    "app.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",

    // Navigation
    "nav.tasbih": "Tasbih",
    "nav.prayer": "Prayer",
    "nav.saved": "Saved",
    "nav.tasks": "Tasks",
    "nav.finance": "Finance",

    // Settings
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.currency": "Currency",
    "settings.theme": "Theme",
    "settings.notifications": "Notifications",
    "settings.about": "About",

    // Tasbih Counter
    "tasbih.counter": "Counter",
    "tasbih.reset": "Reset",
    "tasbih.save": "Save",
    "tasbih.history": "History",
    "tasbih.target": "Target",
    "tasbih.completed": "Completed",
    "tasbih.vibration": "Vibration",
    "tasbih.sound": "Sound",

    // Dhikr Form
    "dhikr.name": "Dhikr Name",
    "dhikr.target": "Target Count",
    "dhikr.color": "Color",
    "dhikr.save": "Save Dhikr",
    "dhikr.cancel": "Cancel",
    "dhikr.edit": "Edit",
    "dhikr.delete": "Delete",

    // Dhikr History
    "history.title": "Dhikr History",
    "history.empty":
      "No history yet. Complete some dhikr to see your history here.",
    "history.date": "Date",
    "history.time": "Time",
    "history.clear": "Clear All",
    "history.export": "Export",
    "history.import": "Import",
    "history.barChart": "Bar Chart",
    "history.pieChart": "Pie Chart",

    // Tasks
    "tasks.title": "Tasks",
    "tasks.subtitle": "Manage your Islamic tasks",
    "tasks.addTask": "Add Task",
    "tasks.editTask": "Edit Task",
    "tasks.addNew": "Add New Task",
    "tasks.title": "Title",
    "tasks.description": "Description",
    "tasks.category": "Category",
    "tasks.titlePlaceholder": "Enter task title",
    "tasks.descriptionPlaceholder": "Enter task description",
    "tasks.titleRequired": "Task title is required",
    "tasks.all": "All",
    "tasks.active": "Active",
    "tasks.completed": "Completed",
    "tasks.empty": "No tasks found",
    "tasks.completedOn": "Completed on",
    "tasks.confirmDelete": "Are you sure you want to delete this task?",
    "tasks.categoryDhikr": "Dhikr",
    "tasks.categoryQuran": "Quran",
    "tasks.categoryPrayer": "Prayer",
    "tasks.categoryOther": "Other",

    // Prayer Times
    "prayer.title": "Prayer Times",
    "prayer.fajr": "Fajr",
    "prayer.sunrise": "Sunrise",
    "prayer.dhuhr": "Dhuhr",
    "prayer.asr": "Asr",
    "prayer.maghrib": "Maghrib",
    "prayer.isha": "Isha",
    "prayer.qibla": "Qibla Direction",
    "prayer.location": "Location",
    "prayer.settings": "Settings",
    "prayer.notifications": "Prayer Notifications",
    "prayer.notificationsNotSupported":
      "Notifications are not supported in your browser.",
    "prayer.enableNotifications":
      "Enable notifications to receive prayer time alerts.",
    "prayer.allowNotifications": "Allow Notifications",
    "prayer.enableAll": "Enable All",
    "prayer.disableAll": "Disable All",
    "prayer.enabled": "Enabled",
    "prayer.disabled": "Disabled",
    "prayer.notifyBefore": "Notify before",
    "prayer.minutes": "minutes",
    "prayer.hour": "hour",
    "prayer.notificationsInfo":
      "Notifications will be sent based on your device's time and the calculated prayer times.",

    // Finance
    "finance.title": "Financial Records",
    "finance.subtitle": "Track your income and expenses",
    "finance.addRecord": "Add Record",
    "finance.income": "Income",
    "finance.expense": "Expense",
    "finance.balance": "Balance",
    "finance.amount": "Amount",
    "finance.date": "Date",
    "finance.description": "Description",
    "finance.category": "Category",
    "finance.type": "Type",
    "finance.save": "Save",
    "finance.cancel": "Cancel",
    "finance.edit": "Edit",
    "finance.delete": "Delete",
    "finance.confirmDelete": "Are you sure you want to delete this record?",
    "finance.noRecords": "No records found for this date",
    "finance.all": "All",
    "finance.today": "Today",
    "finance.yesterday": "Yesterday",
    "finance.thisWeek": "This Week",
    "finance.thisMonth": "This Month",
    "finance.selectDate": "Select Date",
    "finance.from": "From",
    "finance.to": "To",
    "finance.filter": "Filter",
    "finance.clear": "Clear",
    "finance.report": "Report",
    "finance.summary": "Summary",
    "finance.totalIncome": "Total Income",
    "finance.totalExpense": "Total Expense",
    "finance.netBalance": "Net Balance",
    "finance.categories": "Categories",
    "finance.categorySummary": "Category Summary",
    "finance.incomeByCategory": "Income by Category",
    "finance.expenseByCategory": "Expense by Category",
    "finance.daily": "Daily",
    "finance.weekly": "Weekly",
    "finance.monthly": "Monthly",
    "finance.yearly": "Yearly",
    "finance.custom": "Custom",
    "finance.categoryFood": "Food",
    "finance.categoryTransport": "Transport",
    "finance.categoryHousing": "Housing",
    "finance.categoryUtilities": "Utilities",
    "finance.categoryHealthcare": "Healthcare",
    "finance.categoryEducation": "Education",
    "finance.categoryEntertainment": "Entertainment",
    "finance.categoryShopping": "Shopping",
    "finance.categoryCharity": "Charity",
    "finance.categorySalary": "Salary",
    "finance.categoryInvestment": "Investment",
    "finance.categoryGift": "Gift",
    "finance.categoryOther": "Other",

    // Inheritance Calculator
    "inheritance.title": "Inheritance Calculator",
    "inheritance.subtitle": "Calculate Islamic inheritance shares",
    "inheritance.estateValue": "Estate Value",
    "inheritance.heirs": "Heirs",
    "inheritance.addHeir": "Add Heir",
    "inheritance.relationship": "Relationship",
    "inheritance.gender": "Gender",
    "inheritance.count": "Count",
    "inheritance.calculate": "Calculate Shares",
    "inheritance.shares": "Inheritance Shares",
    "inheritance.heir": "Heir",
    "inheritance.share": "Share",
    "inheritance.amount": "Amount",
    "inheritance.explanations": "Explanations",
    "inheritance.note":
      "This calculator is for educational purposes only. For legal matters, please consult a qualified Islamic scholar.",

    // Quran Reader
    "quran.title": "Quran Reader",
    "quran.surah": "Surah",
    "quran.ayah": "Ayah",
    "quran.juz": "Juz",
    "quran.page": "Page",
    "quran.bookmark": "Bookmark",
    "quran.bookmarks": "Bookmarks",
    "quran.search": "Search",
    "quran.settings": "Settings",
    "quran.fontSize": "Font Size",
    "quran.translation": "Translation",
    "quran.arabic": "Arabic",
    "quran.transliteration": "Transliteration",
    "quran.next": "Next",
    "quran.previous": "Previous",
    "quran.continueReading": "Continue Reading",
    "quran.lastRead": "Last Read",
    "quran.noBookmarks": "No bookmarks yet. Add bookmarks as you read.",
    "quran.searchPlaceholder": "Search in Quran...",
    "quran.noResults": "No results found.",
    "quran.loading": "Loading...",
    "quran.failedToLoad": "Failed to load Quran data.",
    "quran.bookmarkAdded": "Bookmark added.",
    "quran.bookmarkRemoved": "Bookmark removed.",
    "quran.progressSaved": "Reading progress saved.",
    "quran.of": "of",
    "quran.ayahs": "Ayahs",
    "quran.surahInfo": "Surah Info",
    "quran.revelation": "Revelation",
    "quran.meccan": "Meccan",
    "quran.medinan": "Medinan",
    "quran.verses": "Verses",
    "quran.meaning": "Meaning",
    "quran.searchInSurah": "Search in current surah...",
    "quran.goToAyah": "Go to Ayah",
    "quran.goToSurah": "Go to Surah",
    "quran.goToJuz": "Go to Juz",
    "quran.goToPage": "Go to Page",
    "quran.share": "Share",
    "quran.copyAyah": "Copy Ayah",
    "quran.copied": "Copied to clipboard",
    "quran.fontSettings": "Font Settings",
    "quran.themeSettings": "Theme Settings",
    "quran.light": "Light",
    "quran.dark": "Dark",
    "quran.sepia": "Sepia",
    "quran.systemDefault": "System Default",
    "quran.fontFamily": "Font Family",
    "quran.preview": "Preview",
    "quran.apply": "Apply Settings",
    "quran.cancel": "Cancel",
    "quran.reset": "Reset to Default",
    "quran.yourBookmarks": "Your Bookmarks",
    "quran.clearAllBookmarks": "Clear All Bookmarks",
    "quran.confirmClearBookmarks":
      "Are you sure you want to clear all bookmarks?",
    "quran.yes": "Yes",
    "quran.no": "No",
    "quran.readingHistory": "Reading History",
    "quran.clearHistory": "Clear History",
    "quran.noHistory": "No reading history yet.",
    "quran.lastReadOn": "Last read on",
    "quran.continueFrom": "Continue from",
    "quran.downloadOffline": "Download for Offline",
    "quran.downloadingOffline": "Downloading...",
    "quran.offlineAvailable": "Available Offline",
    "quran.removeOffline": "Remove Offline Data",
    "quran.storageUsed": "Storage Used",
    "quran.offlineInfo":
      "Downloaded content can be accessed without internet connection.",
    "quran.downloadComplete": "Download Complete",
    "quran.downloadFailed": "Download Failed",
    "quran.tryAgain": "Try Again",
    "quran.close": "Close",
    "quran.save": "Save",
    "quran.delete": "Delete",
    "quran.edit": "Edit",
    "quran.addNote": "Add Note",
    "quran.editNote": "Edit Note",
    "quran.deleteNote": "Delete Note",
    "quran.noteTitle": "Note Title",
    "quran.noteContent": "Note Content",
    "quran.saveNote": "Save Note",
    "quran.cancelNote": "Cancel",
    "quran.notes": "Notes",
    "quran.noNotes": "No notes yet. Add notes as you read.",
    "quran.addedOn": "Added on",
    "quran.updatedOn": "Updated on",
    "quran.confirmDeleteNote": "Are you sure you want to delete this note?",
    "quran.noteDeleted": "Note deleted.",
    "quran.noteSaved": "Note saved.",
    "quran.noteUpdated": "Note updated.",
    "quran.error": "Error",
    "quran.success": "Success",
    "quran.warning": "Warning",
    "quran.info": "Info",
    "quran.ok": "OK",
    "quran.cancel": "Cancel",
    "quran.confirm": "Confirm",
    "quran.back": "Back",
    "quran.next": "Next",
    "quran.finish": "Finish",
    "quran.skip": "Skip",
    "quran.continue": "Continue",
    "quran.retry": "Retry",
    "quran.reload": "Reload",
    "quran.refresh": "Refresh",
    "quran.update": "Update",
    "quran.install": "Install",
    "quran.uninstall": "Uninstall",
    "quran.download": "Download",
    "quran.upload": "Upload",
    "quran.import": "Import",
    "quran.export": "Export",
    "quran.share": "Share",
    "quran.copy": "Copy",
    "quran.paste": "Paste",
    "quran.cut": "Cut",
    "quran.delete": "Delete",
    "quran.remove": "Remove",
    "quran.add": "Add",
    "quran.create": "Create",
    "quran.edit": "Edit",
    "quran.view": "View",
    "quran.preview": "Preview",
    "quran.save": "Save",
    "quran.apply": "Apply",
    "quran.reset": "Reset",
    "quran.clear": "Clear",
    "quran.search": "Search",
    "quran.filter": "Filter",
    "quran.sort": "Sort",
    "quran.settings": "Settings",
    "quran.preferences": "Preferences",
    "quran.options": "Options",
    "quran.help": "Help",
    "quran.about": "About",
    "quran.contact": "Contact",
    "quran.feedback": "Feedback",
    "quran.support": "Support",
    "quran.donate": "Donate",
    "quran.contribute": "Contribute",
    "quran.version": "Version",
    "quran.language": "Language",
    "quran.theme": "Theme",
    "quran.appearance": "Appearance",
    "quran.display": "Display",
    "quran.audio": "Audio",
    "quran.video": "Video",
    "quran.media": "Media",
    "quran.notifications": "Notifications",
    "quran.privacy": "Privacy",
    "quran.security": "Security",
    "quran.account": "Account",
    "quran.profile": "Profile",
    "quran.user": "User",
    "quran.admin": "Admin",
    "quran.moderator": "Moderator",
    "quran.guest": "Guest",
    "quran.anonymous": "Anonymous",
    "quran.signIn": "Sign In",
    "quran.signOut": "Sign Out",
    "quran.register": "Register",
    "quran.login": "Login",
    "quran.logout": "Logout",
    "quran.username": "Username",
    "quran.password": "Password",
    "quran.email": "Email",
    "quran.phone": "Phone",
    "quran.address": "Address",
    "quran.city": "City",
    "quran.state": "State",
    "quran.country": "Country",
    "quran.zipCode": "Zip Code",
    "quran.postalCode": "Postal Code",
    "quran.firstName": "First Name",
    "quran.lastName": "Last Name",
    "quran.fullName": "Full Name",
    "quran.name": "Name",
    "quran.title": "Title",
    "quran.description": "Description",
    "quran.content": "Content",
    "quran.date": "Date",
    "quran.time": "Time",
    "quran.datetime": "Date & Time",
    "quran.day": "Day",
    "quran.week": "Week",
    "quran.month": "Month",
    "quran.year": "Year",
    "quran.today": "Today",
    "quran.yesterday": "Yesterday",
    "quran.tomorrow": "Tomorrow",
    "quran.now": "Now",
    "quran.later": "Later",
    "quran.never": "Never",
    "quran.always": "Always",
    "quran.auto": "Auto",
    "quran.manual": "Manual",
    "quran.custom": "Custom",
    "quran.default": "Default",
    "quran.enabled": "Enabled",
    "quran.disabled": "Disabled",
    "quran.on": "On",
    "quran.off": "Off",
    "quran.yes": "Yes",
    "quran.no": "No",
    "quran.done": "Done",
    "quran.complete": "Complete",
    "quran.incomplete": "Incomplete",
    "quran.finished": "Finished",
    "quran.unfinished": "Unfinished",
    "quran.start": "Start",
    "quran.stop": "Stop",
    "quran.pause": "Pause",
    "quran.resume": "Resume",
    "quran.restart": "Restart",
    "quran.previous": "Previous",
    "quran.first": "First",
    "quran.last": "Last",
    "quran.top": "Top",
    "quran.bottom": "Bottom",
    "quran.left": "Left",
    "quran.right": "Right",
    "quran.center": "Center",
    "quran.middle": "Middle",
    "quran.beginning": "Beginning",
    "quran.end": "End",
    "quran.loading": "Loading...",
    "quran.processing": "Processing...",
    "quran.saving": "Saving...",
    "quran.deleting": "Deleting...",
    "quran.updating": "Updating...",
    "quran.creating": "Creating...",
    "quran.uploading": "Uploading...",
    "quran.downloading": "Downloading...",
    "quran.importing": "Importing...",
    "quran.exporting": "Exporting...",
    "quran.searching": "Searching...",
    "quran.filtering": "Filtering...",
    "quran.sorting": "Sorting...",
    "quran.calculating": "Calculating...",
    "quran.waiting": "Waiting...",
    "quran.pleaseWait": "Please wait...",
    "quran.inProgress": "In progress...",
    "quran.completed": "Completed",
    "quran.failed": "Failed",
    "quran.info": "Info",
    "quran.notification": "Notification",
    "quran.alert": "Alert",
    "quran.message": "Message",
    "quran.note": "Note",
    "quran.tip": "Tip",
    "quran.hint": "Hint",
    "quran.guide": "Guide",
    "quran.tutorial": "Tutorial",
    "quran.instructions": "Instructions",
    "quran.steps": "Steps",
    "quran.procedure": "Procedure",
    "quran.method": "Method",
    "quran.technique": "Technique",
    "quran.approach": "Approach",
    "quran.strategy": "Strategy",
    "quran.plan": "Plan",
    "quran.schedule": "Schedule",
    "quran.calendar": "Calendar",
    "quran.agenda": "Agenda",
    "quran.timetable": "Timetable",
    "quran.program": "Program",
    "quran.curriculum": "Curriculum",
    "quran.course": "Course",
    "quran.class": "Class",
    "quran.lesson": "Lesson",
    "quran.chapter": "Chapter",
    "quran.section": "Section",
    "quran.part": "Part",
    "quran.volume": "Volume",
    "quran.book": "Book",
    "quran.page": "Page",
    "quran.paragraph": "Paragraph",
    "quran.sentence": "Sentence",
    "quran.word": "Word",
    "quran.character": "Character",
    "quran.letter": "Letter",
    "quran.number": "Number",
    "quran.digit": "Digit",
    "quran.symbol": "Symbol",
    "quran.icon": "Icon",
    "quran.image": "Image",
    "quran.picture": "Picture",
    "quran.photo": "Photo",
  },
  id: {
    // General
    "app.name": "Digital Tasbih",
    "app.loading": "Memuat...",
    "common.save": "Simpan",
    "common.cancel": "Batal",
    "common.edit": "Edit",
    "common.delete": "Hapus",

    // Navigation
    "nav.tasbih": "Tasbih",
    "nav.prayer": "Sholat",
    "nav.saved": "Tersimpan",
    "nav.tasks": "Tugas",
    "nav.finance": "Keuangan",
    "nav.settings": "Pengaturan",

    // Settings
    "settings.title": "Pengaturan",
    "settings.language": "Bahasa",
    "settings.currency": "Mata Uang",
    "settings.theme": "Tema",
    "settings.notifications": "Notifikasi",
    "settings.about": "Tentang",

    // Tasbih Counter
    "tasbih.counter": "Penghitung",
    "tasbih.reset": "Reset",
    "tasbih.save": "Simpan",
    "tasbih.history": "Riwayat",
    "tasbih.target": "Target",
    "tasbih.completed": "Selesai",
    "tasbih.vibration": "Getaran",
    "tasbih.sound": "Suara",

    // Dhikr Form
    "dhikr.name": "Nama Dzikir",
    "dhikr.target": "Jumlah Target",
    "dhikr.color": "Warna",
    "dhikr.save": "Simpan Dzikir",
    "dhikr.cancel": "Batal",
    "dhikr.edit": "Edit",
    "dhikr.delete": "Hapus",

    // Dhikr History
    "history.title": "Riwayat Dzikir",
    "history.empty":
      "Belum ada riwayat. Selesaikan beberapa dzikir untuk melihat riwayat di sini.",
    "history.date": "Tanggal",
    "history.time": "Waktu",
    "history.clear": "Hapus Semua",
    "history.export": "Ekspor",
    "history.import": "Impor",
    "history.barChart": "Grafik Batang",
    "history.pieChart": "Grafik Lingkaran",

    // Finance
    "finance.title": "Catatan Keuangan",
    "finance.subtitle": "Lacak pemasukan dan pengeluaran Anda",
    "finance.addRecord": "Tambah Catatan",
    "finance.income": "Pemasukan",
    "finance.expense": "Pengeluaran",
    "finance.balance": "Saldo",
    "finance.amount": "Jumlah",
    "finance.date": "Tanggal",
    "finance.description": "Deskripsi",
    "finance.category": "Kategori",
    "finance.type": "Tipe",
    "finance.save": "Simpan",
    "finance.cancel": "Batal",
    "finance.edit": "Edit",
    "finance.delete": "Hapus",
    "finance.confirmDelete": "Apakah Anda yakin ingin menghapus catatan ini?",
    "finance.noRecords": "Tidak ada catatan untuk tanggal ini",
    "finance.all": "Semua",
    "finance.today": "Hari Ini",
    "finance.yesterday": "Kemarin",
    "finance.thisWeek": "Minggu Ini",
    "finance.thisMonth": "Bulan Ini",
    "finance.selectDate": "Pilih Tanggal",
    "finance.from": "Dari",
    "finance.to": "Sampai",
    "finance.filter": "Filter",
    "finance.clear": "Bersihkan",
    "finance.report": "Laporan",
    "finance.summary": "Ringkasan",
    "finance.totalIncome": "Total Pemasukan",
    "finance.totalExpense": "Total Pengeluaran",
    "finance.netBalance": "Saldo Bersih",
    "finance.categories": "Kategori",
    "finance.categorySummary": "Ringkasan Kategori",
    "finance.incomeByCategory": "Pemasukan per Kategori",
    "finance.expenseByCategory": "Pengeluaran per Kategori",
    "finance.daily": "Harian",
    "finance.weekly": "Mingguan",
    "finance.monthly": "Bulanan",
    "finance.yearly": "Tahunan",
    "finance.custom": "Kustom",
    "finance.categoryFood": "Makanan",
    "finance.categoryTransport": "Transportasi",
    "finance.categoryHousing": "Perumahan",
    "finance.categoryUtilities": "Utilitas",
    "finance.categoryHealthcare": "Kesehatan",
    "finance.categoryEducation": "Pendidikan",
    "finance.categoryEntertainment": "Hiburan",
    "finance.categoryShopping": "Belanja",
    "finance.categoryCharity": "Amal",
    "finance.categorySalary": "Gaji",
    "finance.categoryInvestment": "Investasi",
    "finance.categoryGift": "Hadiah",
    "finance.categoryOther": "Lainnya",

    // Inheritance Calculator
    "inheritance.title": "Kalkulator Waris",
    "inheritance.subtitle": "Hitung pembagian waris secara Islami",
    "inheritance.estateValue": "Nilai Harta",
    "inheritance.heirs": "Ahli Waris",
    "inheritance.addHeir": "Tambah Ahli Waris",
    "inheritance.relationship": "Hubungan",
    "inheritance.gender": "Jenis Kelamin",
    "inheritance.count": "Jumlah",
    "inheritance.calculate": "Hitung Bagian",
    "inheritance.shares": "Bagian Waris",
    "inheritance.heir": "Ahli Waris",
    "inheritance.share": "Bagian",
    "inheritance.amount": "Jumlah",
    "inheritance.explanations": "Penjelasan",
    "inheritance.note":
      "Kalkulator ini hanya untuk tujuan edukasi. Untuk masalah hukum, silakan konsultasikan dengan ulama yang berkualifikasi.",
  },
};

// Get current language from localStorage or default to English
export const getCurrentLanguage = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("language") || "en";
  }
  return "en";
};

// Set language
export const setLanguage = (lang: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("language", lang);
  }
};

// Translation function
export const t = (key: TranslationKey): string => {
  const currentLang = getCurrentLanguage();
  return (
    translations[currentLang]?.[key] ||
    translations.en[key] ||
    key.split(".").pop() ||
    key
  );
};
