import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Music, Languages, Globe } from "lucide-react";
import { 
  userPreferencesService, 
  AVAILABLE_LANGUAGES, 
  AVAILABLE_GENRES,
  type UserPreferences 
} from "@/lib/userPreferences";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (preferences: UserPreferences) => void;
}

const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState(1);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['hi', 'en']);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleLanguageToggle = (languageCode: string) => {
    setSelectedLanguages(prev => {
      if (prev.includes(languageCode)) {
        return prev.filter(code => code !== languageCode);
      } else {
        const newLanguages = [...prev, languageCode];
        
        // Auto-suggest genres based on new language
        const recommendedGenres = userPreferencesService.getRecommendedGenresForLanguage(languageCode);
        const newGenres = [...new Set([...selectedGenres, ...recommendedGenres])];
        setSelectedGenres(newGenres);
        
        return newLanguages;
      }
    });
  };

  const handleGenreToggle = (genreId: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };

  const handleComplete = () => {
    if (selectedLanguages.length === 0) {
      toast.error("Please select at least one language");
      return;
    }

    if (selectedGenres.length === 0) {
      toast.error("Please select at least one genre");
      return;
    }

    const preferences: UserPreferences = {
      languages: selectedLanguages,
      genres: selectedGenres,
      region: 'IN',
      hasCompletedSetup: true,
    };

    userPreferencesService.savePreferences(preferences);
    onComplete(preferences);
    
    toast.success("🎵 Preferences saved!", {
      description: "We'll recommend music based on your choices"
    });
  };

  const getRecommendedArtists = () => {
    const artistsByLanguage: Record<string, string[]> = {
      'hi': ['Arijit Singh', 'Shreya Ghoshal', 'A.R. Rahman', 'Lata Mangeshkar'],
      'bn': ['Rabindranath Tagore', 'Hemanta Mukherjee', 'Kishore Kumar'],
      'te': ['S.P. Balasubrahmanyam', 'K.S. Chithra', 'M.M. Keeravani'],
      'ta': ['Ilaiyaraaja', 'A.R. Rahman', 'Harris Jayaraj', 'Anirudh'],
      'en': ['Ed Sheeran', 'Taylor Swift', 'The Weeknd', 'Billie Eilish'],
      'ko': ['BTS', 'BLACKPINK', 'IU', 'Stray Kids'],
      'ja': ['Yui', 'Utada Hikaru', 'One Ok Rock'],
    };

    const artists = selectedLanguages.flatMap(lang => artistsByLanguage[lang] || []);
    return [...new Set(artists)].slice(0, 6);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Music className="h-6 w-6 text-purple-500" />
            Welcome to Sonicly - Let's personalize your experience!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
              step >= 1 ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"
            )}>
              <Languages className="h-4 w-4" />
              Languages
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
              step >= 2 ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"
            )}>
              <Globe className="h-4 w-4" />
              Genres
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Which languages do you enjoy?</h3>
                <p className="text-gray-600">Select your preferred languages for music discovery</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AVAILABLE_LANGUAGES.map((language) => (
                  <Card
                    key={language.code}
                    className={cn(
                      "cursor-pointer transition-all hover:scale-105",
                      selectedLanguages.includes(language.code)
                        ? "ring-2 ring-purple-500 bg-purple-50"
                        : "hover:shadow-md"
                    )}
                    onClick={() => handleLanguageToggle(language.code)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{language.flag}</div>
                      <div className="font-medium">{language.name}</div>
                      <div className="text-sm text-gray-500">{language.nativeName}</div>
                      {selectedLanguages.includes(language.code) && (
                        <CheckCircle2 className="h-4 w-4 text-purple-500 mx-auto mt-2" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <div className="text-sm text-gray-500">
                  {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''} selected
                </div>
                <Button 
                  onClick={() => setStep(2)}
                  disabled={selectedLanguages.length === 0}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Next: Choose Genres →
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">What genres do you love?</h3>
                <p className="text-gray-600">We've suggested some based on your language preferences</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AVAILABLE_GENRES.map((genre) => (
                  <Card
                    key={genre.id}
                    className={cn(
                      "cursor-pointer transition-all hover:scale-105",
                      selectedGenres.includes(genre.id)
                        ? "ring-2 ring-purple-500 bg-purple-50"
                        : "hover:shadow-md"
                    )}
                    onClick={() => handleGenreToggle(genre.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="text-2xl">{genre.emoji}</div>
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {genre.name}
                          {selectedGenres.includes(genre.id) && (
                            <CheckCircle2 className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{genre.description}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Preview recommended artists */}
              {getRecommendedArtists().length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">🎤 Popular artists you might like:</h4>
                  <div className="flex flex-wrap gap-2">
                    {getRecommendedArtists().map((artist, index) => (
                      <Badge key={index} variant="secondary">{artist}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                >
                  ← Back to Languages
                </Button>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">
                    {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''} selected
                  </div>
                  <Button 
                    onClick={handleComplete}
                    disabled={selectedGenres.length === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Complete Setup ✨
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserPreferencesModal;
