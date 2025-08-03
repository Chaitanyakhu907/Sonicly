// User preferences management for music discovery

export interface UserPreferences {
  languages: string[];
  genres: string[];
  region: string;
  hasCompletedSetup: boolean;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface GenreOption {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

// Indian languages and popular international languages
export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెల��గు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

// Music genres popular in India and globally
export const AVAILABLE_GENRES: GenreOption[] = [
  { id: 'bollywood', name: 'Bollywood', description: 'Popular Hindi film music', emoji: '🎬' },
  { id: 'classical', name: 'Indian Classical', description: 'Traditional Hindustani & Carnatic', emoji: '🎵' },
  { id: 'devotional', name: 'Devotional', description: 'Bhajans, Kirtan, Spiritual music', emoji: '🙏' },
  { id: 'folk', name: 'Folk', description: 'Regional folk music', emoji: '🎪' },
  { id: 'qawwali', name: 'Qawwali', description: 'Sufi devotional music', emoji: '🎤' },
  { id: 'indie', name: 'Indie', description: 'Independent Indian artists', emoji: '🎸' },
  { id: 'fusion', name: 'Fusion', description: 'Indo-Western fusion', emoji: '🌐' },
  { id: 'pop', name: 'Pop', description: 'Popular contemporary music', emoji: '🎧' },
  { id: 'rock', name: 'Rock', description: 'Rock and alternative music', emoji: '🤘' },
  { id: 'electronic', name: 'Electronic', description: 'EDM, Techno, House', emoji: '🎛️' },
  { id: 'hiphop', name: 'Hip Hop', description: 'Rap and Hip Hop music', emoji: '🎯' },
  { id: 'jazz', name: 'Jazz', description: 'Jazz and blues music', emoji: '🎺' },
  { id: 'kpop', name: 'K-Pop', description: 'Korean pop music', emoji: '🇰🇷' },
  { id: 'jpop', name: 'J-Pop', description: 'Japanese pop music', emoji: '🇯🇵' },
];

class UserPreferencesService {
  private static instance: UserPreferencesService;
  private storageKey = 'sonicly_user_preferences';

  static getInstance(): UserPreferencesService {
    if (!UserPreferencesService.instance) {
      UserPreferencesService.instance = new UserPreferencesService();
    }
    return UserPreferencesService.instance;
  }

  getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }

    // Default preferences for India
    return {
      languages: ['hi', 'en'], // Hindi and English by default
      genres: ['bollywood', 'pop'],
      region: 'IN',
      hasCompletedSetup: false,
    };
  }

  savePreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    this.savePreferences(updated);
    return updated;
  }

  getLanguageByCode(code: string): LanguageOption | undefined {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === code);
  }

  getGenreById(id: string): GenreOption | undefined {
    return AVAILABLE_GENRES.find(genre => genre.id === id);
  }

  getRecommendedGenresForLanguage(languageCode: string): string[] {
    const recommendations: Record<string, string[]> = {
      'hi': ['bollywood', 'devotional', 'classical', 'folk'],
      'bn': ['folk', 'classical', 'devotional', 'indie'],
      'te': ['folk', 'classical', 'bollywood', 'devotional'],
      'ta': ['classical', 'folk', 'devotional', 'bollywood'],
      'mr': ['folk', 'devotional', 'bollywood', 'classical'],
      'ur': ['qawwali', 'devotional', 'classical', 'bollywood'],
      'gu': ['folk', 'devotional', 'bollywood', 'classical'],
      'kn': ['classical', 'folk', 'devotional', 'bollywood'],
      'ml': ['classical', 'folk', 'devotional', 'bollywood'],
      'pa': ['folk', 'devotional', 'bollywood', 'pop'],
      'en': ['pop', 'rock', 'indie', 'electronic'],
      'ko': ['kpop', 'pop', 'electronic', 'indie'],
      'ja': ['jpop', 'pop', 'electronic', 'rock'],
    };

    return recommendations[languageCode] || ['pop', 'indie', 'rock'];
  }

  needsSetup(): boolean {
    return !this.getPreferences().hasCompletedSetup;
  }

  completeSetup(): void {
    this.updatePreferences({ hasCompletedSetup: true });
  }
}

export const userPreferencesService = UserPreferencesService.getInstance();
