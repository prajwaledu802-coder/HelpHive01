import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext({ language: 'en', setLanguage: () => {}, t: (k) => k });

export function useLanguage() {
  return useContext(LanguageContext);
}

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
];

export { languages };

const translations = {
  en: {
    'nav.home': 'Home', 'nav.about': 'About', 'nav.features': 'Features',
    'nav.howItWorks': 'How It Works', 'nav.contact': 'Contact',
    'nav.login': 'Login', 'nav.getStarted': 'Get Started',
    'about.title': 'About', 'about.brandName': 'HelpHive',
    'about.missionTitle': 'Our Mission',
    'about.missionText': 'HelpHive is a dedicated platform designed to bridge the gap between resources, volunteers, and those in immediate need. We mobilize emergency relief teams instantly, coordinating vital supplies where they are needed most, the moment disaster strikes.',
    'about.visionTitle': 'Our Vision',
    'about.visionText': 'Empowering humanity through a united global network. By streamlining operations and reducing administrative overhead, we enable NGOs to save more lives. We are committed to building resilient communities equipped to handle crises effectively and compassionately.',
    'features.heading1': 'Powerful Tools for', 'features.heading2': 'Modern NGOs',
    'features.subtitle': 'A complete operating system for impact. Streamline your operations, manage resources, and mobilize volunteers from a single, intelligent platform.',
    'features.volunteerTitle': 'Volunteer Management',
    'features.volunteerDesc': 'Track volunteers, skills and availability. Mobilize the right people for the right tasks instantly. Our smart matching system ensures every volunteer is utilized efficiently.',
    'features.resourceTitle': 'Resource Inventory',
    'features.resourceDesc': 'Manage food, medicines and supplies. Prevent shortages with real-time tracking of crucial life-saving materials and automated low-stock alerts across crisis zones.',
    'features.eventTitle': 'Event Coordination',
    'features.eventDesc': 'Create events and assign volunteers. From local food drives to large-scale disaster response operations, orchestrate every detail and ensure seamless field execution.',
    'howItWorks.title': 'How', 'howItWorks.brandName': 'HelpHive', 'howItWorks.titleEnd': 'Works',
    'howItWorks.step1Title': 'Register Volunteers', 'howItWorks.step1Desc': 'Collect skills, contact & availability — onboard volunteers fast.',
    'howItWorks.step2Title': 'Add Resources', 'howItWorks.step2Desc': 'Track food, medicine, clothes — set low stock alerts.',
    'howItWorks.step3Title': 'Create Events & Assign', 'howItWorks.step3Desc': 'Spin up events and auto-suggest volunteers by skills.',
    'cta.heading': 'Ready to uplevel your NGO operations?',
    'cta.subtitle': 'Join hundreds of organizations saving time and maximizing their impact with HelpHive.',
    'cta.volunteerBtn': 'Join As Volunteer', 'cta.adminBtn': 'Admin Sign In',
    'contact.title': 'Get in', 'contact.titleHighlight': 'Touch',
    'contact.subtitle': 'Reach out to our leadership directly for partnerships, support, or inquiries regarding our global operations.',
    'contact.callUs': 'Call Us', 'contact.emailUs': 'Email Us',
    'footer.product': 'Product', 'footer.features': 'Features',
    'footer.howItWorks': 'How it Works', 'footer.login': 'Login',
    'footer.legal': 'Legal', 'footer.privacy': 'Privacy Policy', 'footer.terms': 'Terms of Service',
    'footer.tagline': 'Empowering NGOs globally through smart volunteer, resource, and event coordination.',
    'footer.copyright': 'All rights reserved.', 'footer.impact': 'Designed for impact.',
    'hero.learnMore': 'Learn More',
  },
  hi: {
    'nav.home': 'होम', 'nav.about': 'हमारे बारे में', 'nav.features': 'सुविधाएं',
    'nav.howItWorks': 'कैसे काम करता है', 'nav.contact': 'संपर्क',
    'nav.login': 'लॉगिन', 'nav.getStarted': 'शुरू करें',
    'about.title': 'हमारे बारे में', 'about.brandName': 'HelpHive',
    'about.missionTitle': 'हमारा मिशन',
    'about.missionText': 'HelpHive संसाधनों, स्वयंसेवकों और जरूरतमंदों के बीच की खाई को पाटने के लिए डिज़ाइन किया गया एक समर्पित प्लेटफ़ॉर्म है। हम आपदा आने पर तुरंत राहत टीमों को जुटाते हैं।',
    'about.visionTitle': 'हमारी दृष्टि',
    'about.visionText': 'एक संयुक्त वैश्विक नेटवर्क के माध्यम से मानवता को सशक्त बनाना। संचालन को सुव्यवस्थित करके, हम NGO को अधिक जीवन बचाने में सक्षम बनाते हैं।',
    'features.heading1': 'शक्तिशाली उपकरण', 'features.heading2': 'आधुनिक NGO के लिए',
    'features.subtitle': 'प्रभाव के लिए एक संपूर्ण ऑपरेटिंग सिस्टम। एक बुद्धिमान प्लेटफ़ॉर्म से अपने संचालन, संसाधन और स्वयंसेवकों का प्रबंधन करें।',
    'features.volunteerTitle': 'स्वयंसेवक प्रबंधन', 'features.volunteerDesc': 'स्वयंसेवकों, कौशल और उपलब्धता को ट्रैक करें। स्मार्ट मिलान प्रणाली हर स्वयंसेवक का कुशल उपयोग सुनिश्चित करती है।',
    'features.resourceTitle': 'संसाधन सूची', 'features.resourceDesc': 'भोजन, दवाइयाँ और आपूर्ति का प्रबंधन करें। संकट क्षेत्रों में स्वचालित कम-स्टॉक अलर्ट के साथ कमी को रोकें।',
    'features.eventTitle': 'कार्यक्रम समन्वय', 'features.eventDesc': 'कार्यक्रम बनाएं और स्वयंसेवकों को नियुक्त करें। हर विवरण का समन्वय करें और निर्बाध क्षेत्र निष्पादन सुनिश्चित करें।',
    'howItWorks.title': 'कैसे', 'howItWorks.brandName': 'HelpHive', 'howItWorks.titleEnd': 'काम करता है',
    'howItWorks.step1Title': 'स्वयंसेवक पंजीकरण', 'howItWorks.step1Desc': 'कौशल, संपर्क और उपलब्धता एकत्र करें — तेजी से ऑनबोर्ड करें।',
    'howItWorks.step2Title': 'संसाधन जोड़ें', 'howItWorks.step2Desc': 'भोजन, दवाई, कपड़े ट्रैक करें — कम स्टॉक अलर्ट सेट करें।',
    'howItWorks.step3Title': 'कार्यक्रम बनाएं और नियुक्त करें', 'howItWorks.step3Desc': 'कार्यक्रम शुरू करें और कौशल के आधार पर स्वयंसेवकों का सुझाव दें।',
    'cta.heading': 'अपने NGO संचालन को अपग्रेड करने के लिए तैयार हैं?',
    'cta.subtitle': 'HelpHive के साथ पहले से ही समय बचाने और अधिकतम प्रभाव डालने वाले सैकड़ों संगठनों से जुड़ें।',
    'cta.volunteerBtn': 'स्वयंसेवक बनें', 'cta.adminBtn': 'एडमिन साइन इन',
    'contact.title': 'संपर्क', 'contact.titleHighlight': 'करें',
    'contact.subtitle': 'साझेदारी, सहायता या वैश्विक संचालन संबंधी प्रश्नों के लिए हमसे सीधे संपर्क करें।',
    'contact.callUs': 'कॉल करें', 'contact.emailUs': 'ईमेल करें',
    'footer.product': 'उत्पाद', 'footer.features': 'सुविधाएं',
    'footer.howItWorks': 'कैसे काम करता है', 'footer.login': 'लॉगिन',
    'footer.legal': 'कानूनी', 'footer.privacy': 'गोपनीयता नीति', 'footer.terms': 'सेवा की शर्तें',
    'footer.tagline': 'स्मार्ट स्वयंसेवक, संसाधन और कार्यक्रम समन्वय के माध्यम से विश्व स्तर पर NGO को सशक्त बनाना।',
    'footer.copyright': 'सर्वाधिकार सुरक्षित।', 'footer.impact': 'प्रभाव के लिए डिज़ाइन किया गया।',
    'hero.learnMore': 'और जानें',
  },
  ta: {
    'nav.home': 'முகப்பு', 'nav.about': 'எங்களைப் பற்றி', 'nav.features': 'அம்சங்கள்',
    'nav.howItWorks': 'எப்படி வேலை செய்கிறது', 'nav.contact': 'தொடர்பு',
    'nav.login': 'உள்நுழைவு', 'nav.getStarted': 'தொடங்குங்கள்',
    'about.title': 'எங்களைப் பற்றி', 'about.brandName': 'HelpHive',
    'about.missionTitle': 'எங்கள் நோக்கம்',
    'about.missionText': 'HelpHive வளங்கள், தொண்டர்கள் மற்றும் தேவையுள்ளோருக்கு இடையிலான இடைவெளியைக் குறைக்க வடிவமைக்கப்பட்ட ஒரு அர்ப்பணிக்கப்பட்ட தளமாகும்.',
    'about.visionTitle': 'எங்கள் தொலைநோக்கு',
    'about.visionText': 'ஒருங்கிணைந்த உலகளாவிய வலைப்பின்னல் மூலம் மனித குலத்தை வலுப்படுத்துதல்.',
    'features.heading1': 'சக்திவாய்ந்த கருவிகள்', 'features.heading2': 'நவீன NGOக்களுக்கு',
    'features.subtitle': 'தாக்கத்திற்கான முழுமையான இயங்குநிலை அமைப்பு.',
    'features.volunteerTitle': 'தொண்டர் மேலாண்மை', 'features.volunteerDesc': 'தொண்டர்கள், திறன்கள் மற்றும் கிடைக்கும் தன்மையை கண்காணிக்கவும்.',
    'features.resourceTitle': 'வள சரக்கு', 'features.resourceDesc': 'உணவு, மருந்துகள் மற்றும் பொருட்களை நிர்வகிக்கவும்.',
    'features.eventTitle': 'நிகழ்வு ஒருங்கிணைப்பு', 'features.eventDesc': 'நிகழ்வுகளை உருவாக்கி தொண்டர்களை நியமிக்கவும்.',
    'howItWorks.title': 'எப்படி', 'howItWorks.brandName': 'HelpHive', 'howItWorks.titleEnd': 'வேலை செய்கிறது',
    'howItWorks.step1Title': 'தொண்டர்களை பதிவு செய்யுங்கள்', 'howItWorks.step1Desc': 'திறன்கள், தொடர்பு & கிடைக்கும் தன்மையை சேகரிக்கவும்.',
    'howItWorks.step2Title': 'வளங்களைச் சேர்க்கவும்', 'howItWorks.step2Desc': 'உணவு, மருந்து, ஆடைகளை கண்காணிக்கவும்.',
    'howItWorks.step3Title': 'நிகழ்வுகளை உருவாக்கி நியமிக்கவும்', 'howItWorks.step3Desc': 'நிகழ்வுகளை தொடங்கி திறன் அடிப்படையில் தொண்டர்களை பரிந்துரைக்கவும்.',
    'cta.heading': 'உங்கள் NGO செயல்பாடுகளை மேம்படுத்த தயாரா?',
    'cta.subtitle': 'HelpHive உடன் நேரத்தை சேமித்து அதிகபட்ச தாக்கத்தை ஏற்படுத்தும் நூற்றுக்கணக்கான அமைப்புகளில் இணையுங்கள்.',
    'cta.volunteerBtn': 'தொண்டராக இணையுங்கள்', 'cta.adminBtn': 'நிர்வாகி உள்நுழைவு',
    'contact.title': 'தொடர்பு', 'contact.titleHighlight': 'கொள்ளுங்கள்',
    'contact.subtitle': 'கூட்டாண்மை, ஆதரவு அல்லது விசாரணைகளுக்கு நேரடியாக தொடர்புகொள்ளவும்.',
    'contact.callUs': 'அழைக்கவும்', 'contact.emailUs': 'மின்னஞ்சல் அனுப்புங்கள்',
    'footer.product': 'தயாரிப்பு', 'footer.features': 'அம்சங்கள்',
    'footer.howItWorks': 'எப்படி வேலை செய்கிறது', 'footer.login': 'உள்நுழைவு',
    'footer.legal': 'சட்டமுறை', 'footer.privacy': 'தனியுரிமை கொள்கை', 'footer.terms': 'சேவை விதிமுறைகள்',
    'footer.tagline': 'ஸ்மார்ட் தொண்டர், வள மற்றும் நிகழ்வு ஒருங்கிணைப்பு மூலம் NGOக்களை வலுப்படுத்துதல்.',
    'footer.copyright': 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.', 'footer.impact': 'தாக்கத்திற்காக வடிவமைக்கப்பட்டது.',
  },
  te: {
    'nav.home': 'హోమ్', 'nav.about': 'మా గురించి', 'nav.features': 'ఫీచర్లు',
    'nav.howItWorks': 'ఎలా పనిచేస్తుంది', 'nav.contact': 'సంప్రదించండి',
    'nav.login': 'లాగిన్', 'nav.getStarted': 'ప్రారంభించండి',
    'about.title': 'మా గురించి', 'about.brandName': 'HelpHive',
    'about.missionTitle': 'మా లక్ష్యం', 'about.missionText': 'HelpHive వనరులు, వలంటీర్లు మరియు అవసరమైన వారి మధ్య అంతరాన్ని తగ్గించడానికి రూపొందించబడిన ప్లాట్‌ఫారమ్.',
    'about.visionTitle': 'మా దృష్టి', 'about.visionText': 'ఐక్య గ్లోబల్ నెట్‌వర్క్ ద్వారా మానవాళిని శక్తివంతం చేయడం.',
    'features.heading1': 'శక్తివంతమైన సాధనాలు', 'features.heading2': 'ఆధునిక NGO ల కోసం',
    'features.subtitle': 'ప్రభావం కోసం పూర్తి ఆపరేటింగ్ సిస్టమ్.',
    'features.volunteerTitle': 'వలంటీర్ నిర్వహణ', 'features.volunteerDesc': 'వలంటీర్లు, నైపుణ్యాలు మరియు అందుబాటును ట్రాక్ చేయండి.',
    'features.resourceTitle': 'వనరుల జాబితా', 'features.resourceDesc': 'ఆహారం, మందులు మరియు సామాగ్రిని నిర్వహించండి.',
    'features.eventTitle': 'ఈవెంట్ సమన్వయం', 'features.eventDesc': 'ఈవెంట్‌లను సృష్టించి వలంటీర్లను నియమించండి.',
    'howItWorks.title': 'ఎలా', 'howItWorks.brandName': 'HelpHive', 'howItWorks.titleEnd': 'పనిచేస్తుంది',
    'howItWorks.step1Title': 'వలంటీర్లను నమోదు చేయండి', 'howItWorks.step1Desc': 'నైపుణ్యాలు, సంప్రదింపు & అందుబాటును సేకరించండి.',
    'howItWorks.step2Title': 'వనరులను జోడించండి', 'howItWorks.step2Desc': 'ఆహారం, మందులు, బట్టలను ట్రాక్ చేయండి.',
    'howItWorks.step3Title': 'ఈవెంట్‌లను సృష్టించి నియమించండి', 'howItWorks.step3Desc': 'ఈవెంట్‌లను ప్రారంభించి నైపుణ్యాల ఆధారంగా వలంటీర్లను సూచించండి.',
    'cta.heading': 'మీ NGO కార్యకలాపాలను అప్‌గ్రేడ్ చేయడానికి సిద్ధంగా ఉన్నారా?',
    'cta.subtitle': 'HelpHive తో సమయాన్ని ఆదా చేస్తున్న వందలాది సంస్థలలో చేరండి.',
    'cta.volunteerBtn': 'వలంటీర్‌గా చేరండి', 'cta.adminBtn': 'అడ్మిన్ సైన్ ఇన్',
    'contact.title': 'సంప్రదించ', 'contact.titleHighlight': 'ండి',
    'contact.subtitle': 'భాగస్వామ్యం, సహాయం లేదా విచారణల కోసం నేరుగా సంప్రదించండి.',
    'contact.callUs': 'కాల్ చేయండి', 'contact.emailUs': 'ఇమెయిల్ చేయండి',
    'footer.product': 'ఉత్పత్తి', 'footer.features': 'ఫీచర్లు',
    'footer.howItWorks': 'ఎలా పనిచేస్తుంది', 'footer.login': 'లాగిన్',
    'footer.legal': 'చట్టపరమైనవి', 'footer.privacy': 'గోప్యతా విధానం', 'footer.terms': 'సేవా నిబంధనలు',
    'footer.tagline': 'స్మార్ట్ వలంటీర్, వనరుల మరియు ఈవెంట్ సమన్వయం ద్వారా NGO లను శక్తివంతం చేయడం.',
    'footer.copyright': 'అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.', 'footer.impact': 'ప్రభావం కోసం రూపొందించబడింది.',
  },
  kn: {
    'nav.home': 'ಮುಖಪುಟ', 'nav.about': 'ನಮ್ಮ ಬಗ್ಗೆ', 'nav.features': 'ವೈಶಿಷ್ಟ್ಯಗಳು',
    'nav.howItWorks': 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ', 'nav.contact': 'ಸಂಪರ್ಕಿಸಿ',
    'nav.login': 'ಲಾಗಿನ್', 'nav.getStarted': 'ಪ್ರಾರಂಭಿಸಿ',
    'about.title': 'ನಮ್ಮ ಬಗ್ಗೆ', 'about.brandName': 'HelpHive',
    'about.missionTitle': 'ನಮ್ಮ ಧ್ಯೇಯ', 'about.missionText': 'HelpHive ಸಂಪನ್ಮೂಲಗಳು, ಸ್ವಯಂಸೇವಕರು ಮತ್ತು ಅಗತ್ಯವಿರುವವರ ನಡುವಿನ ಅಂತರವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.',
    'about.visionTitle': 'ನಮ್ಮ ದೃಷ್ಟಿ', 'about.visionText': 'ಐಕ್ಯ ಜಾಗತಿಕ ಜಾಲದ ಮೂಲಕ ಮಾನವೀಯತೆಯನ್ನು ಸಬಲೀಕರಿಸುವುದು.',
    'features.heading1': 'ಶಕ್ತಿಶಾಲಿ ಉಪಕರಣಗಳು', 'features.heading2': 'ಆಧುನಿಕ NGOಗಳಿಗೆ',
    'features.subtitle': 'ಪ್ರಭಾವಕ್ಕಾಗಿ ಸಂಪೂರ್ಣ ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್.',
    'features.volunteerTitle': 'ಸ್ವಯಂಸೇವಕ ನಿರ್ವಹಣೆ', 'features.volunteerDesc': 'ಸ್ವಯಂಸೇವಕರು, ಕೌಶಲ್ಯ ಮತ್ತು ಲಭ್ಯತೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.',
    'features.resourceTitle': 'ಸಂಪನ್ಮೂಲ ಪಟ್ಟಿ', 'features.resourceDesc': 'ಆಹಾರ, ಔಷಧಿ ಮತ್ತು ಸಾಮಗ್ರಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
    'features.eventTitle': 'ಕಾರ್ಯಕ್ರಮ ಸಮನ್ವಯ', 'features.eventDesc': 'ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ರಚಿಸಿ ಸ್ವಯಂಸೇವಕರನ್ನು ನಿಯೋಜಿಸಿ.',
    'howItWorks.title': 'ಹೇಗೆ', 'howItWorks.brandName': 'HelpHive', 'howItWorks.titleEnd': 'ಕೆಲಸ ಮಾಡುತ್ತದೆ',
    'howItWorks.step1Title': 'ಸ್ವಯಂಸೇವಕರನ್ನು ನೋಂದಾಯಿಸಿ', 'howItWorks.step1Desc': 'ಕೌಶಲ್ಯ, ಸಂಪರ್ಕ & ಲಭ್ಯತೆಯನ್ನು ಸಂಗ್ರಹಿಸಿ.',
    'howItWorks.step2Title': 'ಸಂಪನ್ಮೂಲಗಳನ್ನು ಸೇರಿಸಿ', 'howItWorks.step2Desc': 'ಆಹಾರ, ಔಷಧಿ, ಬಟ್ಟೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.',
    'howItWorks.step3Title': 'ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ರಚಿಸಿ ನಿಯೋಜಿಸಿ', 'howItWorks.step3Desc': 'ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಪ್ರಾರಂಭಿಸಿ ಕೌಶಲ್ಯ ಆಧಾರಿತವಾಗಿ ಸ್ವಯಂಸೇವಕರನ್ನು ಸೂಚಿಸಿ.',
    'cta.heading': 'ನಿಮ್ಮ NGO ಕಾರ್ಯಾಚರಣೆಗಳನ್ನು ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಲು ಸಿದ್ಧರೇ?',
    'cta.subtitle': 'HelpHive ನೊಂದಿಗೆ ಸಮಯವನ್ನು ಉಳಿಸುತ್ತಿರುವ ನೂರಾರು ಸಂಸ್ಥೆಗಳಲ್ಲಿ ಸೇರಿ.',
    'cta.volunteerBtn': 'ಸ್ವಯಂಸೇವಕರಾಗಿ ಸೇರಿ', 'cta.adminBtn': 'ನಿರ್ವಾಹಕ ಸೈನ್ ಇನ್',
    'contact.title': 'ಸಂಪರ್ಕ', 'contact.titleHighlight': 'ಮಾಡಿ',
    'contact.subtitle': 'ಪಾಲುದಾರಿಕೆ, ಬೆಂಬಲ ಅಥವಾ ವಿಚಾರಣೆಗಳಿಗಾಗಿ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ.',
    'contact.callUs': 'ಕಾಲ್ ಮಾಡಿ', 'contact.emailUs': 'ಇಮೇಲ್ ಮಾಡಿ',
    'footer.product': 'ಉತ್ಪನ್ನ', 'footer.features': 'ವೈಶಿಷ್ಟ್ಯಗಳು',
    'footer.howItWorks': 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ', 'footer.login': 'ಲಾಗಿನ್',
    'footer.legal': 'ಕಾನೂನು', 'footer.privacy': 'ಗೌಪ್ಯತಾ ನೀತಿ', 'footer.terms': 'ಸೇವಾ ನಿಯಮಗಳು',
    'footer.tagline': 'ಸ್ಮಾರ್ಟ್ ಸ್ವಯಂಸೇವಕ, ಸಂಪನ್ಮೂಲ ಮತ್ತು ಕಾರ್ಯಕ್ರಮ ಸಮನ್ವಯದ ಮೂಲಕ NGOಗಳನ್ನು ಸಬಲೀಕರಿಸುವುದು.',
    'footer.copyright': 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.', 'footer.impact': 'ಪ್ರಭಾವಕ್ಕಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.',
  },
  // Remaining languages use English as fallback with key labels
  ml: { 'nav.home': 'ഹോം', 'nav.about': 'ഞങ്ങളെ കുറിച്ച്', 'nav.features': 'സവിശേഷതകൾ', 'nav.howItWorks': 'എങ്ങനെ പ്രവർത്തിക്കുന്നു', 'nav.contact': 'ബന്ധപ്പെടുക', 'nav.login': 'ലോഗിൻ', 'nav.getStarted': 'ആരംഭിക്കുക' },
  bn: { 'nav.home': 'হোম', 'nav.about': 'আমাদের সম্পর্কে', 'nav.features': 'বৈশিষ্ট্য', 'nav.howItWorks': 'কিভাবে কাজ করে', 'nav.contact': 'যোগাযোগ', 'nav.login': 'লগইন', 'nav.getStarted': 'শুরু করুন' },
  mr: { 'nav.home': 'मुख्यपृष्ठ', 'nav.about': 'आमच्याबद्दल', 'nav.features': 'वैशिष्ट्ये', 'nav.howItWorks': 'कसे कार्य करते', 'nav.contact': 'संपर्क', 'nav.login': 'लॉगिन', 'nav.getStarted': 'सुरू करा' },
  gu: { 'nav.home': 'હોમ', 'nav.about': 'અમારા વિશે', 'nav.features': 'સુવિધાઓ', 'nav.howItWorks': 'કેવી રીતે કામ કરે છે', 'nav.contact': 'સંપર્ક', 'nav.login': 'લૉગિન', 'nav.getStarted': 'શરૂ કરો' },
  pa: { 'nav.home': 'ਹੋਮ', 'nav.about': 'ਸਾਡੇ ਬਾਰੇ', 'nav.features': 'ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ', 'nav.howItWorks': 'ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ', 'nav.contact': 'ਸੰਪਰਕ', 'nav.login': 'ਲੌਗਇਨ', 'nav.getStarted': 'ਸ਼ੁਰੂ ਕਰੋ' },
  or: { 'nav.home': 'ହୋମ', 'nav.about': 'ଆମ ବିଷୟରେ', 'nav.features': 'ବୈଶିଷ୍ଟ୍ୟ', 'nav.howItWorks': 'କିପରି କାମ କରେ', 'nav.contact': 'ଯୋଗାଯୋଗ', 'nav.login': 'ଲଗଇନ', 'nav.getStarted': 'ଆରମ୍ଭ କରନ୍ତୁ' },
};

export default function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('helphive-lang') || 'en';
    }
    return 'en';
  });

  const setLanguage = (code) => {
    setLanguageState(code);
    if (typeof window !== 'undefined') localStorage.setItem('helphive-lang', code);
  };

  const t = (key) => {
    const langTranslations = translations[language];
    if (langTranslations && langTranslations[key]) return langTranslations[key];
    // Fallback to English
    if (translations.en[key]) return translations.en[key];
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}
