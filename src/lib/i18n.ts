import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.analysis': 'Skin Analysis',
      'nav.profile': 'Profile',
      'nav.privacy': 'Privacy Settings',
      'nav.community': 'Community',
      'nav.my_skin_journey': 'My Skin Journey',
      'nav.our_vision': 'Our Vision',
      'nav.smart_routine': 'Smart Routine',
      'nav.product_library': 'Product Library',
      'nav.reminders': 'Reminders',
      'nav.influencer': 'Influencer',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.continue': 'Continue',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.finish': 'Finish',
      'common.email': 'Email',
      'common.password': 'Password',
      'common.signin': 'Sign In',
      'common.signup': 'Sign Up',
      'common.signout': 'Sign Out',
      'common.user': 'User',
      'common.guest_mode': 'Guest Mode',
      
      // Toast messages
      'toast.analysis_failed': 'Analysis failed, please try again',
      'toast.diary_feature_development': 'Skincare diary feature is under development...',
      'toast.influencer_application_submitted': 'Influencer application submitted, we will review within 3-5 business days',
      'toast.add_product_development': 'Add product feature is under development...',
      'toast.reminder_creation_development': 'Reminder creation feature is under development...',
      'toast.view_product_details': 'View product details',
      'toast.edit_reminder': 'Edit reminder',
      'toast.view_full_routine': 'View full routine',
      
      // Hero Section
      'hero.title': 'Discover Your Skin\'s True Potential',
      'hero.subtitle': 'Advanced AI-powered skin analysis with personalized European skincare recommendations',
      'hero.cta': 'Start Free Analysis',
      'hero.gdpr': 'GDPR Compliant • Your data is protected',
      
      // Upload Section
      'upload.title': 'Upload Your Photo',
      'upload.subtitle': 'Take a clear, well-lit selfie for the most accurate analysis',
      'upload.guidelines': 'Guidelines for best results:',
      'upload.guideline1': 'Natural lighting preferred',
      'upload.guideline2': 'Face clearly visible',
      'upload.guideline3': 'Remove makeup if possible',
      'upload.guideline4': 'Look directly at camera',
      'upload.drag': 'Drag and drop your photo here, or click to select',
      'upload.formats': 'Supports: JPEG, PNG, WebP (max 10MB)',
      'upload.uploading': 'Uploading...',
      'upload.success': 'Photo uploaded successfully',
      'upload.error': 'Upload failed. Please try again.',
      
      // Questionnaire
      'questionnaire.title': 'Tell Us About Your Lifestyle',
      'questionnaire.subtitle': 'Help us provide more personalized recommendations',
      'questionnaire.sleep': 'How many hours do you sleep per night?',
      'questionnaire.stress': 'Rate your stress level (1-10)',
      'questionnaire.diet': 'What\'s your diet type?',
      'questionnaire.exercise': 'How often do you exercise?',
      'questionnaire.skincare': 'Current skincare routine',
      'questionnaire.concerns': 'Main skin concerns',
      'questionnaire.smoking': 'Smoking status',
      'questionnaire.alcohol': 'Alcohol consumption',
      'questionnaire.environment': 'Environmental factors',
      'questionnaire.submit': 'Complete Analysis',
      
      // Diet options
      'diet.balanced': 'Balanced',
      'diet.vegetarian': 'Vegetarian',
      'diet.vegan': 'Vegan',
      'diet.mediterranean': 'Mediterranean',
      'diet.keto': 'Keto',
      'diet.other': 'Other',
      
      // Exercise options
      'exercise.daily': 'Daily',
      'exercise.weekly': '3-4 times/week',
      'exercise.occasional': 'Occasionally',
      'exercise.rarely': 'Rarely',
      'exercise.never': 'Never',
      
      // Smoking options
      'smoking.never': 'Never',
      'smoking.former': 'Former smoker',
      'smoking.occasional': 'Occasional',
      'smoking.regular': 'Regular',
      
      // Alcohol options
      'alcohol.none': 'None',
      'alcohol.occasional': 'Occasional',
      'alcohol.moderate': 'Moderate',
      'alcohol.frequent': 'Frequent',
      
      // Skin concerns
      'concerns.wrinkles': 'Wrinkles',
      'concerns.spots': 'Dark spots',
      'concerns.acne': 'Acne',
      'concerns.dryness': 'Dryness',
      'concerns.oiliness': 'Oily skin',
      'concerns.sensitivity': 'Sensitivity',
      'concerns.pores': 'Large pores',
      'concerns.redness': 'Redness',
      'concerns.dark_circles': 'Dark circles',
      
      // Results
      'results.title': 'Your Skin Analysis Results',
      'results.processing': 'Analyzing your skin...',
      'results.overall_score': 'Overall Skin Health Score',
      'results.skin_type': 'Skin Type',
      'results.skin_age': 'Estimated Skin Age',
      'results.recommendations': 'Personalized Recommendations',
      'results.detailed': 'Detailed Analysis',
      
      // Skin types
      'skin_type.dry': 'Dry',
      'skin_type.oily': 'Oily',
      'skin_type.combination': 'Combination',
      'skin_type.normal': 'Normal',
      'skin_type.sensitive': 'Sensitive',
      
      // Analysis categories
      'analysis.wrinkles': 'Wrinkles & Fine Lines',
      'analysis.spots': 'Dark Spots',
      'analysis.acne': 'Acne & Blemishes',
      'analysis.texture': 'Texture Unevenness',
      'analysis.hydration': 'Dryness',
      'analysis.sebum': 'Oil Production',
      'analysis.pores': 'Pore Visibility',
      'analysis.redness': 'Redness',
      'analysis.dark_circles': 'Dark Circles',
      
      // Products
      'products.title': 'Recommended Products',
      'products.subtitle': 'Curated European skincare products for your skin type',
      'products.price_from': 'From',
      'products.view_details': 'View Details',
      'products.add_favorite': 'Add to Favorites',
      'products.buy_now': 'Buy Now',
      'products.ingredients': 'Key Ingredients',
      'products.benefits': 'Benefits',
      'products.suitable_for': 'Suitable for',
      
      // Privacy
      'privacy.title': 'Privacy & Data Settings',
      'privacy.gdpr_notice': 'In compliance with GDPR, you have full control over your data',
      'privacy.consent_title': 'Data Processing Consent',
      'privacy.consent_desc': 'Allow processing of facial images for skin analysis',
      'privacy.marketing_title': 'Marketing Communications',
      'privacy.marketing_desc': 'Receive personalized skincare tips and product updates',
      'privacy.analytics_title': 'Analytics',
      'privacy.analytics_desc': 'Help us improve our service through anonymous usage data',
      'privacy.export_data': 'Export My Data',
      'privacy.delete_account': 'Delete Account',
      'privacy.data_retention': 'Data Retention',
      'privacy.retention_standard': 'Standard (2 years)',
      'privacy.retention_minimal': 'Minimal (6 months)',
      'privacy.retention_extended': 'Extended (5 years)',
      
      // Our Vision Page
      'vision.title': 'Our Vision',
      'vision.subtitle': 'Transforming Skincare Through AI Innovation',
      'vision.business_assumptions': 'Business Assumptions',
      'vision.assumption1_title': 'Weather-Based Personalization Value',
      'vision.assumption1_desc': 'Our belief that weather-responsive skincare recommendations provide significantly more value than generic routines, creating a competitive advantage in personalization',
      'vision.assumption2_title': 'Data Monetization Viability',
      'vision.assumption2_desc': 'The assumption that user skincare data, preferences, and behavioral patterns can generate sustainable revenue through multiple channels (affiliate partnerships, premium insights, targeted recommendations)',
      'vision.assumption3_title': 'AI Beauty Tech Market Timing',
      'vision.assumption3_desc': 'Our market timing assumption that consumers are ready to adopt AI-powered beauty solutions at scale, with the market reaching optimal readiness for widespread adoption',
      'vision.gdpr_compliance': 'GDPR Compliance',
      'vision.gdpr_intro': 'We are committed to protecting your privacy and ensuring compliance with the General Data Protection Regulation (GDPR).',
      'vision.data_protection': 'Data Protection Principles',
      'vision.data_protection_desc': 'We process personal data lawfully, fairly, and transparently. Data is collected for specified, explicit, and legitimate purposes only.',
      'vision.user_rights': 'Your Rights',
      'vision.user_rights_desc': 'You have the right to access, rectify, erase, restrict processing, data portability, and object to processing of your personal data.',
      'vision.consent': 'Consent Management',
      'vision.consent_desc': 'We obtain explicit consent for data processing and allow you to withdraw consent at any time through your privacy settings.',
      
      // Community features
      'community.title': 'Skincare Community',
      'community.create_diary': 'Create Skincare Diary',
      'community.share_experience': 'Share Your Experience',
      'community.connect': 'Connect with Others',
      
      // Smart Routine features
      'routine.title': 'Smart Skincare Routine',
      'routine.personalized': 'Personalized Recommendations',
      'routine.weather_adaptive': 'Weather-Adaptive Care',
      'routine.reminders': 'Smart Reminders',
      
      // Product Library
      'library.title': 'Product Library',
      'library.add_product': 'Add Product',
      'library.my_products': 'My Products',
      'library.favorites': 'Favorites',

      // Profile & Comparison
      'profile.title': 'My Profile',
      'profile.account_info': 'Account Information',
      'profile.analysis_history': 'Analysis History',
      'profile.compare': 'Compare Analyses',
      'profile.view_analysis': 'View Analysis',
      'profile.delete_analysis': 'Delete Analysis',
      'compare.title': 'Compare Analyses',
      'compare.subtitle': 'Track your skin\'s progress over time',
      'compare.before': 'Before (Older Analysis)',
      'compare.after': 'After (Newer Analysis)',
      'compare.visual': 'Visual Comparison',
      'compare.metrics': 'Detailed Metrics Comparison',
      'compare.better': 'better',
      'compare.worse': 'worse',
      'compare.no_change': 'No change',
    }
  },
  de: {
    translation: {
      // Navigation
      'nav.home': 'Startseite',
      'nav.analysis': 'Hautanalyse',
      'nav.profile': 'Profil',
      'nav.privacy': 'Datenschutz',
      'nav.community': 'Gemeinschaft',
      'nav.my_skin_journey': 'Meine Hautreise',
      'nav.our_vision': 'Unsere Vision',
      'nav.smart_routine': 'Intelligente Routine',
      'nav.product_library': 'Produktbibliothek',
      'nav.reminders': 'Erinnerungen',
      'nav.influencer': 'Influencer',
      
      // Common
      'common.loading': 'Laden...',
      'common.error': 'Fehler',
      'common.success': 'Erfolgreich',
      'common.cancel': 'Abbrechen',
      'common.save': 'Speichern',
      'common.continue': 'Fortfahren',
      'common.back': 'Zurück',
      'common.next': 'Weiter',
      'common.finish': 'Fertig',
      'common.email': 'E-Mail',
      'common.password': 'Passwort',
      'common.signin': 'Anmelden',
      'common.signup': 'Registrieren',
      'common.signout': 'Abmelden',
      'common.user': 'Benutzer',
      'common.guest_mode': 'Gastmodus',
      
      // Toast messages
      'toast.analysis_failed': 'Analyse fehlgeschlagen, bitte versuchen Sie es erneut',
      'toast.diary_feature_development': 'Hautpflege-Tagebuch-Funktion ist in Entwicklung...',
      'toast.influencer_application_submitted': 'Influencer-Bewerbung eingereicht, wir prüfen innerhalb von 3-5 Werktagen',
      'toast.add_product_development': 'Produkt hinzufügen Funktion ist in Entwicklung...',
      'toast.reminder_creation_development': 'Erinnerungserstellung ist in Entwicklung...',
      'toast.view_product_details': 'Produktdetails anzeigen',
      'toast.edit_reminder': 'Erinnerung bearbeiten',
      'toast.view_full_routine': 'Vollständige Routine anzeigen',
      
      // Hero Section
      'hero.title': 'Entdecken Sie das wahre Potenzial Ihrer Haut',
      'hero.subtitle': 'Fortgeschrittene KI-gestützte Hautanalyse mit personalisierten europäischen Hautpflegeempfehlungen',
      'hero.cta': 'Kostenlose Analyse starten',
      'hero.gdpr': 'DSGVO-konform • Ihre Daten sind geschützt',
      
      // Upload Section
      'upload.title': 'Foto hochladen',
      'upload.subtitle': 'Machen Sie ein klares, gut beleuchtetes Selfie für die genaueste Analyse',
      'upload.guidelines': 'Richtlinien für beste Ergebnisse:',
      'upload.guideline1': 'Natürliches Licht bevorzugt',
      'upload.guideline2': 'Gesicht deutlich sichtbar',
      'upload.guideline3': 'Make-up wenn möglich entfernen',
      'upload.guideline4': 'Direkt in die Kamera schauen',
      'upload.drag': 'Ziehen Sie Ihr Foto hierher oder klicken Sie zum Auswählen',
      'upload.formats': 'Unterstützt: JPEG, PNG, WebP (max 10MB)',
      'upload.uploading': 'Hochladen...',
      'upload.success': 'Foto erfolgreich hochgeladen',
      'upload.error': 'Upload fehlgeschlagen. Bitte versuchen Sie es erneut.',
      
      // Questionnaire
      'questionnaire.title': 'Erzählen Sie uns von Ihrem Lebensstil',
      'questionnaire.subtitle': 'Helfen Sie uns, personalisiertere Empfehlungen zu geben',
      'questionnaire.sleep': 'Wie viele Stunden schlafen Sie pro Nacht?',
      'questionnaire.stress': 'Bewerten Sie Ihr Stressniveau (1-10)',
      'questionnaire.diet': 'Was ist Ihr Ernährungstyp?',
      'questionnaire.exercise': 'Wie oft trainieren Sie?',
      'questionnaire.skincare': 'Aktuelle Hautpflegeroutine',
      'questionnaire.concerns': 'Hauptprobleme der Haut',
      'questionnaire.smoking': 'Raucherstatus',
      'questionnaire.alcohol': 'Alkoholkonsum',
      'questionnaire.environment': 'Umweltfaktoren',
      'questionnaire.submit': 'Analyse abschließen',
      
      // Diet options
      'diet.balanced': 'Ausgewogen',
      'diet.vegetarian': 'Vegetarisch',
      'diet.vegan': 'Vegan',
      'diet.mediterranean': 'Mediterran',
      'diet.keto': 'Keto',
      'diet.other': 'Andere',
      
      // Exercise options
      'exercise.daily': 'Täglich',
      'exercise.weekly': '3-4 mal/Woche',
      'exercise.occasional': 'Gelegentlich',
      'exercise.rarely': 'Selten',
      'exercise.never': 'Nie',
      
      // Smoking options
      'smoking.never': 'Nie',
      'smoking.former': 'Ehemaliger Raucher',
      'smoking.occasional': 'Gelegentlich',
      'smoking.regular': 'Regelmäßig',
      
      // Alcohol options
      'alcohol.none': 'Keiner',
      'alcohol.occasional': 'Gelegentlich',
      'alcohol.moderate': 'Mäßig',
      'alcohol.frequent': 'Häufig',
      
      // Skin concerns
      'concerns.wrinkles': 'Falten',
      'concerns.spots': 'Dunkle Flecken',
      'concerns.acne': 'Akne',
      'concerns.dryness': 'Trockenheit',
      'concerns.oiliness': 'Fettige Haut',
      'concerns.sensitivity': 'Empfindlichkeit',
      'concerns.pores': 'Große Poren',
      'concerns.redness': 'Rötung',
      'concerns.dark_circles': 'Augenringe',
      
      // Results
      'results.title': 'Ihre Hautanalyse-Ergebnisse',
      'results.processing': 'Ihre Haut wird analysiert...',
      'results.overall_score': 'Gesamtpunktzahl Hautgesundheit',
      'results.skin_type': 'Hauttyp',
      'results.skin_age': 'Geschätztes Hautalter',
      'results.recommendations': 'Personalisierte Empfehlungen',
      'results.detailed': 'Detaillierte Analyse',
      
      // Skin types
      'skin_type.dry': 'Trocken',
      'skin_type.oily': 'Fettig',
      'skin_type.combination': 'Mischhaut',
      'skin_type.normal': 'Normal',
      'skin_type.sensitive': 'Empfindlich',
      
      // Analysis categories
      'analysis.wrinkles': 'Falten & feine Linien',
      'analysis.spots': 'Dunkle Flecken',
      'analysis.acne': 'Akne & Unreinheiten',
      'analysis.texture': 'Hauttextur',
      'analysis.hydration': 'Hydratation',
      'analysis.sebum': 'Ölproduktion',
      'analysis.pores': 'Porensichtbarkeit',
      'analysis.redness': 'Rötung',
      'analysis.dark_circles': 'Augenringe',
      
      // Products
      'products.title': 'Empfohlene Produkte',
      'products.subtitle': 'Kuratierte europäische Hautpflegeprodukte für Ihren Hauttyp',
      'products.price_from': 'Ab',
      'products.view_details': 'Details anzeigen',
      'products.add_favorite': 'Zu Favoriten hinzufügen',
      'products.buy_now': 'Jetzt kaufen',
      'products.ingredients': 'Hauptinhaltsstoffe',
      'products.benefits': 'Vorteile',
      'products.suitable_for': 'Geeignet für',
      
      // Privacy
      'privacy.title': 'Datenschutz & Dateneinstellungen',
      'privacy.gdpr_notice': 'In Übereinstimmung mit der DSGVO haben Sie die volle Kontrolle über Ihre Daten',
      'privacy.consent_title': 'Datenverarbeitungseinwilligung',
      'privacy.consent_desc': 'Verarbeitung von Gesichtsbildern für Hautanalyse erlauben',
      'privacy.marketing_title': 'Marketing-Kommunikation',
      'privacy.marketing_desc': 'Personalisierte Hautpflegetipps und Produktupdates erhalten',
      'privacy.analytics_title': 'Analytik',
      'privacy.analytics_desc': 'Helfen Sie uns, unseren Service durch anonyme Nutzungsdaten zu verbessern',
      'privacy.export_data': 'Meine Daten exportieren',
      'privacy.delete_account': 'Konto löschen',
      'privacy.data_retention': 'Datenspeicherung',
      'privacy.retention_standard': 'Standard (2 Jahre)',
      'privacy.retention_minimal': 'Minimal (6 Monate)',
      'privacy.retention_extended': 'Erweitert (5 Jahre)',
      
      // Our Vision Page
      'vision.title': 'Unsere Vision',
      'vision.subtitle': 'Hautpflege durch KI-Innovation transformieren',
      'vision.business_assumptions': 'Geschäftsannahmen',
      'vision.assumption1_title': 'Wetterbasierter Personalisierungswert',
      'vision.assumption1_desc': 'Unser Glaube, dass wetterangepasste Hautpflegeempfehlungen deutlich mehr Wert bieten als generische Routinen und einen Wettbewerbsvorteil in der Personalisierung schaffen',
      'vision.assumption2_title': 'Datenmonetarisierungs-Machbarkeit',
      'vision.assumption2_desc': 'Die Annahme, dass Benutzerhautpflegedaten, Präferenzen und Verhaltensmuster nachhaltige Einnahmen durch verschiedene Kanäle generieren können (Affiliate-Partnerschaften, Premium-Insights, zielgerichtete Empfehlungen)',
      'vision.assumption3_title': 'KI Beauty Tech Markt-Timing',
      'vision.assumption3_desc': 'Unsere Markt-Timing-Annahme, dass Verbraucher bereit sind, KI-gestützte Beauty-Lösungen in großem Maßstab zu übernehmen, wobei der Markt optimale Bereitschaft für weitverbreitete Adoption erreicht',
      'vision.gdpr_compliance': 'DSGVO-Konformität',
      'vision.gdpr_intro': 'Wir verpflichten uns, Ihre Privatsphäre zu schützen und die Einhaltung der Datenschutz-Grundverordnung (DSGVO) sicherzustellen.',
      'vision.data_protection': 'Datenschutzprinzipien',
      'vision.data_protection_desc': 'Wir verarbeiten personenbezogene Daten rechtmäßig, fair und transparent. Daten werden nur für spezifische, explizite und legitime Zwecke gesammelt.',
      'vision.user_rights': 'Ihre Rechte',
      'vision.user_rights_desc': 'Sie haben das Recht auf Zugang, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten.',
      'vision.consent': 'Einwilligungsverwaltung',
      'vision.consent_desc': 'Wir holen explizite Einwilligung zur Datenverarbeitung ein und ermöglichen es Ihnen, die Einwilligung jederzeit über Ihre Datenschutzeinstellungen zu widerrufen.',
      
      // Community features
      'community.title': 'Hautpflege-Gemeinschaft',
      'community.create_diary': 'Hautpflege-Tagebuch erstellen',
      'community.share_experience': 'Teilen Sie Ihre Erfahrung',
      'community.connect': 'Mit anderen verbinden',
      
      // Smart Routine features
      'routine.title': 'Intelligente Hautpflegeroutine',
      'routine.personalized': 'Personalisierte Empfehlungen',
      'routine.weather_adaptive': 'Wetterangepasste Pflege',
      'routine.reminders': 'Intelligente Erinnerungen',
      
      // Product Library
      'library.title': 'Produktbibliothek',
      'library.add_product': 'Produkt hinzufügen',
      'library.my_products': 'Meine Produkte',
      'library.favorites': 'Favoriten',
    }
  },
  fr: {
    translation: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.analysis': 'Analyse de peau',
      'nav.profile': 'Profil',
      'nav.privacy': 'Confidentialité',
      'nav.community': 'Communauté',
      'nav.my_skin_journey': 'Mon Parcours Peau',
      'nav.our_vision': 'Notre Vision',
      'nav.smart_routine': 'Routine Intelligente',
      'nav.product_library': 'Bibliothèque Produits',
      'nav.reminders': 'Rappels',
      'nav.influencer': 'Influenceur',
      
      // Common
      'common.loading': 'Chargement...',
      'common.error': 'Erreur',
      'common.success': 'Succès',
      'common.cancel': 'Annuler',
      'common.save': 'Enregistrer',
      'common.continue': 'Continuer',
      'common.back': 'Retour',
      'common.next': 'Suivant',
      'common.finish': 'Terminer',
      'common.email': 'E-mail',
      'common.password': 'Mot de passe',
      'common.signin': 'Se connecter',
      'common.signup': 'S\'inscrire',
      'common.signout': 'Se déconnecter',
      'common.user': 'Utilisateur',
      'common.guest_mode': 'Mode invité',
      
      // Toast messages
      'toast.analysis_failed': 'Analyse échouée, veuillez réessayer',
      'toast.diary_feature_development': 'La fonctionnalité journal de soins est en développement...',
      'toast.influencer_application_submitted': 'Candidature influenceur soumise, nous examinerons dans 3-5 jours ouvrables',
      'toast.add_product_development': 'La fonction ajouter un produit est en développement...',
      'toast.reminder_creation_development': 'La création de rappels est en développement...',
      'toast.view_product_details': 'Voir les détails du produit',
      'toast.edit_reminder': 'Modifier le rappel',
      'toast.view_full_routine': 'Voir la routine complète',
      
      // Hero Section
      'hero.title': 'Découvrez le véritable potentiel de votre peau',
      'hero.subtitle': 'Analyse cutanée avancée alimentée par IA avec recommandations personnalisées de soins européens',
      'hero.cta': 'Commencer l\'analyse gratuite',
      'hero.gdpr': 'Conforme RGPD • Vos données sont protégées',
      
      // Upload Section
      'upload.title': 'Télécharger votre photo',
      'upload.subtitle': 'Prenez un selfie clair et bien éclairé pour l\'analyse la plus précise',
      'upload.guidelines': 'Directives pour de meilleurs résultats:',
      'upload.guideline1': 'Éclairage naturel préféré',
      'upload.guideline2': 'Visage clairement visible',
      'upload.guideline3': 'Retirer le maquillage si possible',
      'upload.guideline4': 'Regarder directement l\'appareil photo',
      'upload.drag': 'Glissez-déposez votre photo ici, ou cliquez pour sélectionner',
      'upload.formats': 'Supporte: JPEG, PNG, WebP (max 10MB)',
      'upload.uploading': 'Téléchargement...',
      'upload.success': 'Photo téléchargée avec succès',
      'upload.error': 'Échec du téléchargement. Veuillez réessayer.',
      
      // Questionnaire
      'questionnaire.title': 'Parlez-nous de votre mode de vie',
      'questionnaire.subtitle': 'Aidez-nous à fournir des recommandations plus personnalisées',
      'questionnaire.sleep': 'Combien d\'heures dormez-vous par nuit?',
      'questionnaire.stress': 'Évaluez votre niveau de stress (1-10)',
      'questionnaire.diet': 'Quel est votre type de régime?',
      'questionnaire.exercise': 'À quelle fréquence faites-vous de l\'exercice?',
      'questionnaire.skincare': 'Routine de soins actuelle',
      'questionnaire.concerns': 'Principales préoccupations cutanées',
      'questionnaire.smoking': 'Statut tabagique',
      'questionnaire.alcohol': 'Consommation d\'alcool',
      'questionnaire.environment': 'Facteurs environnementaux',
      'questionnaire.submit': 'Terminer l\'analyse',
      
      // Diet options
      'diet.balanced': 'Équilibré',
      'diet.vegetarian': 'Végétarien',
      'diet.vegan': 'Végétalien',
      'diet.mediterranean': 'Méditerranéen',
      'diet.keto': 'Kéto',
      'diet.other': 'Autre',
      
      // Exercise options
      'exercise.daily': 'Quotidien',
      'exercise.weekly': '3-4 fois/semaine',
      'exercise.occasional': 'Occasionnellement',
      'exercise.rarely': 'Rarement',
      'exercise.never': 'Jamais',
      
      // Smoking options
      'smoking.never': 'Jamais',
      'smoking.former': 'Ancien fumeur',
      'smoking.occasional': 'Occasionnel',
      'smoking.regular': 'Régulier',
      
      // Alcohol options
      'alcohol.none': 'Aucun',
      'alcohol.occasional': 'Occasionnel',
      'alcohol.moderate': 'Modéré',
      'alcohol.frequent': 'Fréquent',
      
      // Skin concerns
      'concerns.wrinkles': 'Rides',
      'concerns.spots': 'Taches brunes',
      'concerns.acne': 'Acné',
      'concerns.dryness': 'Sécheresse',
      'concerns.oiliness': 'Peau grasse',
      'concerns.sensitivity': 'Sensibilité',
      'concerns.pores': 'Pores dilatés',
      'concerns.redness': 'Rougeurs',
      'concerns.dark_circles': 'Cernes',
      
      // Results
      'results.title': 'Résultats de votre analyse cutanée',
      'results.processing': 'Analyse de votre peau...',
      'results.overall_score': 'Score global de santé cutanée',
      'results.skin_type': 'Type de peau',
      'results.skin_age': 'Âge estimé de la peau',
      'results.recommendations': 'Recommandations personnalisées',
      'results.detailed': 'Analyse détaillée',
      
      // Skin types
      'skin_type.dry': 'Sèche',
      'skin_type.oily': 'Grasse',
      'skin_type.combination': 'Mixte',
      'skin_type.normal': 'Normale',
      'skin_type.sensitive': 'Sensible',
      
      // Analysis categories
      'analysis.wrinkles': 'Rides & lignes fines',
      'analysis.spots': 'Taches brunes',
      'analysis.acne': 'Acné & imperfections',
      'analysis.texture': 'Texture de la peau',
      'analysis.hydration': 'Hydratation',
      'analysis.sebum': 'Production de sébum',
      'analysis.pores': 'Visibilité des pores',
      'analysis.redness': 'Rougeurs',
      'analysis.dark_circles': 'Cernes',
      
      // Products
      'products.title': 'Produits recommandés',
      'products.subtitle': 'Produits de soins européens sélectionnés pour votre type de peau',
      'products.price_from': 'À partir de',
      'products.view_details': 'Voir les détails',
      'products.add_favorite': 'Ajouter aux favoris',
      'products.buy_now': 'Acheter maintenant',
      'products.ingredients': 'Ingrédients clés',
      'products.benefits': 'Avantages',
      'products.suitable_for': 'Convient pour',
      
      // Privacy
      'privacy.title': 'Confidentialité & Paramètres des données',
      'privacy.gdpr_notice': 'En conformité avec le RGPD, vous avez un contrôle total sur vos données',
      'privacy.consent_title': 'Consentement au traitement des données',
      'privacy.consent_desc': 'Autoriser le traitement des images faciales pour l\'analyse cutanée',
      'privacy.marketing_title': 'Communications marketing',
      'privacy.marketing_desc': 'Recevoir des conseils de soins personnalisés et des mises à jour produits',
      'privacy.analytics_title': 'Analytiques',
      'privacy.analytics_desc': 'Aidez-nous à améliorer notre service grâce aux données d\'utilisation anonymes',
      'privacy.export_data': 'Exporter mes données',
      'privacy.delete_account': 'Supprimer le compte',
      'privacy.data_retention': 'Rétention des données',
      'privacy.retention_standard': 'Standard (2 ans)',
      'privacy.retention_minimal': 'Minimal (6 mois)',
      'privacy.retention_extended': 'Étendu (5 ans)',
      
      // Our Vision Page
      'vision.title': 'Notre Vision',
      'vision.subtitle': 'Transformer les soins de la peau grâce à l\'innovation IA',
      'vision.business_assumptions': 'Hypothèses commerciales',
      'vision.assumption1_title': 'Valeur de personnalisation basée sur la météo',
      'vision.assumption1_desc': 'Notre conviction que les recommandations de soins adaptées à la météo offrent une valeur significativement plus élevée que les routines génériques, créant un avantage concurrentiel en personnalisation',
      'vision.assumption2_title': 'Viabilité de la monétisation des données',
      'vision.assumption2_desc': 'L\'hypothèse que les données de soins utilisateurs, préférences et modèles comportementaux peuvent générer des revenus durables à travers plusieurs canaux (partenariats d\'affiliation, insights premium, recommandations ciblées)',
      'vision.assumption3_title': 'Timing du marché IA Beauty Tech',
      'vision.assumption3_desc': 'Notre hypothèse de timing du marché que les consommateurs sont prêts à adopter les solutions beauté alimentées par IA à grande échelle, le marché atteignant une préparation optimale pour une adoption généralisée',
      'vision.gdpr_compliance': 'Conformité RGPD',
      'vision.gdpr_intro': 'Nous nous engageons à protéger votre vie privée et à assurer la conformité avec le Règlement Général sur la Protection des Données (RGPD).',
      'vision.data_protection': 'Principes de protection des données',
      'vision.data_protection_desc': 'Nous traitons les données personnelles de manière légale, équitable et transparente. Les données sont collectées uniquement à des fins spécifiques, explicites et légitimes.',
      'vision.user_rights': 'Vos droits',
      'vision.user_rights_desc': 'Vous avez le droit d\'accéder, rectifier, effacer, restreindre le traitement, à la portabilité des données et de vous opposer au traitement de vos données personnelles.',
      'vision.consent': 'Gestion du consentement',
      'vision.consent_desc': 'Nous obtenons un consentement explicite pour le traitement des données et vous permettons de retirer votre consentement à tout moment via vos paramètres de confidentialité.',
      
      // Community features
      'community.title': 'Communauté de soins',
      'community.create_diary': 'Créer un journal de soins',
      'community.share_experience': 'Partagez votre expérience',
      'community.connect': 'Connectez-vous avec d\'autres',
      
      // Smart Routine features
      'routine.title': 'Routine de soins intelligente',
      'routine.personalized': 'Recommandations personnalisées',
      'routine.weather_adaptive': 'Soins adaptatifs météo',
      'routine.reminders': 'Rappels intelligents',
      
      // Product Library
      'library.title': 'Bibliothèque de produits',
      'library.add_product': 'Ajouter un produit',
      'library.my_products': 'Mes produits',
      'library.favorites': 'Favoris',
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

export default i18n
