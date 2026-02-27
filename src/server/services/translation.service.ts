interface TranslationResult {
  translatedText: string;
  isAutoTranslated: boolean;
}

export const translationService = {
  async translate(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = "tr"
  ): Promise<TranslationResult> {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      console.log(
        `[Translation Dev] "${text}" → ${targetLanguage} (API key not configured)`
      );
      return { translatedText: text, isAutoTranslated: false };
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: sourceLanguage,
            target: targetLanguage,
            format: "text",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText =
        data.data?.translations?.[0]?.translatedText ?? text;

      return { translatedText, isAutoTranslated: true };
    } catch (error) {
      console.error("Translation failed:", error);
      return { translatedText: text, isAutoTranslated: false };
    }
  },

  async translateBatch(
    texts: string[],
    targetLanguage: string,
    sourceLanguage: string = "tr"
  ): Promise<TranslationResult[]> {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      return texts.map((text) => ({
        translatedText: text,
        isAutoTranslated: false,
      }));
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: texts,
            source: sourceLanguage,
            target: targetLanguage,
            format: "text",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translations = data.data?.translations ?? [];

      return translations.map(
        (t: { translatedText: string }, i: number) => ({
          translatedText: t.translatedText ?? texts[i],
          isAutoTranslated: true,
        })
      );
    } catch (error) {
      console.error("Batch translation failed:", error);
      return texts.map((text) => ({
        translatedText: text,
        isAutoTranslated: false,
      }));
    }
  },
};
