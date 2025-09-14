document.addEventListener('DOMContentLoaded', () => {
    const langModal = document.getElementById('language-modal');
    const appContainer = document.getElementById('app-container');
    const langButtons = document.querySelectorAll('.lang-btn');
    const skipLangBtn = document.getElementById('skip-lang-btn');
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const contrastToggleBtn = document.getElementById('contrast-toggle-btn');

    const navButtons = document.querySelectorAll('.main-nav .nav-btn');
    const appPages = document.querySelectorAll('.app-page');

    const askQuestionBtn = document.getElementById('ask-question-btn');
    const submitQueryBtn = document.getElementById('submit-query-btn');
    const queryTextInput = document.getElementById('query-text-input');
    const voiceRecordBtn = document.getElementById('voice-record-btn');
    const voiceWaveform = document.getElementById('voice-waveform');
    const imageUploadInput = document.getElementById('image-upload-input');
    const imagePreview = document.getElementById('image-preview');
    const imagePreviewImg = imagePreview.querySelector('img');
    const removeImageBtn = imagePreview.querySelector('.remove-image-btn');
    const dragDropArea = document.getElementById('drag-drop-area');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    const responseDisplay = document.getElementById('response-display');
    const loadingIndicator = document.getElementById('loading-indicator');
    const aiResponseContent = document.getElementById('ai-response-content');
    const escalateBtn = document.getElementById('escalate-btn');
    const feedbackBtns = document.querySelectorAll('.feedback-btn');
    const feedbackComment = document.querySelector('.feedback-comment');

    const profileTabBtns = document.querySelectorAll('.profile-tab-btn');
    const profileTabContents = document.querySelectorAll('.profile-tab-content');

    let currentLang = localStorage.getItem('krishi_lang') || 'en';
    let highContrastMode = localStorage.getItem('krishi_high_contrast') === 'true';

    // --- PWA Service Worker Registration --- //
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // --- Language Handling --- //
    const translations = {
        'ml': {
            'Instant answers to your farming questions': 'നിങ്ങളുടെ കൃഷിയുടെ സംശയങ്ങൾക്ക് ഉടനടി ഉത്തരം',
            'A Digital Krishi Officer at your fingertips.': 'നിങ്ങളുടെ വിരൽത്തുമ്പിൽ ഒരു ഡിജിറ്റൽ കൃഷി ഓഫീസർ.',
            'Ask Your Question': 'നിങ്ങളുടെ ചോദ്യം ചോദിക്കുക',
            'Our Services': 'ഞങ്ങളുടെ സേവനങ്ങൾ',
            '24/7 Availability': '24/7 ലഭ്യത',
            'Get advice anytime, anywhere.': 'എപ്പോൾ വേണമെങ്കിലും എവിടെ നിന്നും ഉപദേശം നേടുക.',
            'Multilingual Support': 'ബഹുഭാഷാ പിന്തുണ',
            'Access information in your regional language.': 'നിങ്ങളുടെ പ്രാദേശിക ഭാഷയിൽ വിവരങ്ങൾ നേടുക.',
            'Expert-Backed Advice': 'വിദഗ്ദ്ധരുടെ ഉപദേശം',
            'Information validated by agricultural experts.': 'കൃഷി വിദഗ്ദ്ധർ അംഗീകരിച്ച വിവരങ്ങൾ.',
            'Key Features': 'പ്രധാന സവിശേഷതകൾ',
            'Voice/Text Query': 'വോയിസ്/ടെക്സ്റ്റ് ചോദ്യങ്ങൾ',
            'Easily ask questions.': 'എളുപ്പത്തിൽ ചോദ്യങ്ങൾ ചോദിക്കുക.',
            'Image Analysis': 'ചിത്ര വിശകലനം',
            'Upload images to identify diseases.': 'രോഗങ്ങൾ തിരിച്ചറിയാൻ ചിത്രങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക.',
            'Personalized Advice': 'വ്യക്തിഗത ഉപദേശം',
            'Tailored recommendations for your farm.': 'നിങ്ങളുടെ കൃഷിക്ക് അനുയോജ്യമായ നിർദ്ദേശങ്ങൾ.',
            'Expert Escalation': 'വിദഗ്ദ്ധരുമായി ബന്ധപ്പെടുക',
            'Connect with experts for further assistance.': 'കൂടുതൽ സഹായം ആവശ്യമെങ്കിൽ വിദഗ്ദ്ധരുമായി സംസാരിക്കുക.',
            'Trust & Partnerships': 'വിശ്വാസ്യത',
            "'This app is a great help for my farming. I get instant answers!'": "'ഈ ആപ്പ് എന്റെ കൃഷിക്ക് വലിയ സഹായമാണ്. ഉടനടി ഉത്തരങ്ങൾ ലഭിക്കുന്നു!'",
            "'It's very useful for identifying diseases and finding solutions.'": "'രോഗങ്ങൾ തിരിച്ചറിയാനും പരിഹാരങ്ങൾ കണ്ടെത്താനും ഇത് വളരെ ഉപകാരപ്രദമാണ്.'",
            'Ask Your Question': 'നിങ്ങളുടെ ചോദ്യം ചോദിക്കുക',
            'Type your farming question here or use voice...': 'നിങ്ങളുടെ കൃഷി സംബന്ധമായ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ വോയിസ് ഉപയോഗിക്കുക...', 
            'Submit Query': 'ചോദ്യം സമർപ്പിക്കുക',
            'Drag & drop images here or click to upload': 'ചിത്രങ്ങൾ ഇവിടെ വലിച്ചിടുക അല്ലെങ്കിൽ ക്ലിക്ക് ചെയ്യുക',
            'Quick Suggestions:': 'പെട്ടെന്നുള്ള ചോദ്യങ്ങൾ:',
            'Pest infestation': 'കീടബാധ',
            'Fertilization': 'വളപ്രയോഗം',
            'To increase yield': 'വിളവ് വർദ്ധിപ്പിക്കാൻ',
            'Soil testing': 'മണ്ണ് പരിശോധന',
            'Additional Context (Optional)': 'കൂടുതൽ വിവരങ്ങൾ (ഓപ്ഷണൽ)',
            'Location:': 'സ്ഥലം:',
            'Crop Type:': 'വിളയുടെ തരം:',
            'Farm Size:': 'കൃഷിഭൂമിയുടെ വലുപ്പം:',
            'Season:': 'കൃഷി സീസൺ:',
            'Answer': 'ഉത്തരം',
            'Analyzing your question...': 'നിങ്ങളുടെ ചോദ്യം വിശകലനം ചെയ്യുന്നു...', 
            'Answer to your question: Blight is a common disease in paddy. Use fungicide for this. To prevent the disease, purify seeds and plant at proper spacing.': 'നിങ്ങളുടെ ചോദ്യത്തിന് ഉത്തരം: നെല്ലിന് സാധാരണയായി കാണുന്ന ഒരു രോഗമാണ് ബ്ലൈറ്റ്. ഇതിന് ഫംഗസ് നാശിനി ഉപയോഗിക്കുക. രോഗം വരാതിരിക്കാൻ വിത്ത് ശുദ്ധീകരിക്കുകയും ശരിയായ അകലത്തിൽ നടുകയും ചെയ്യുക.',
            'Image of paddy affected by blight disease.': 'ബ്ലൈറ്റ് രോഗം ബാധിച്ച നെല്ലിന്റെ ചിത്രം.',
            'Action Steps': 'പ്രവർത്തന ഘട്ടങ്ങൾ',
            'Remove affected plants.': 'രോഗം ബാധിച്ച ചെടികൾ നീക്കം ചെയ്യുക.',
            'Apply recommended fungicide.': 'ശുപാർശ ചെയ്യുന്ന ഫംഗസ് നാശിനി ഉപയോഗിക്കുക.',
            'Monitor at regular intervals.': 'കൃത്യമായ ഇടവേളകളിൽ നിരീക്ഷിക്കുക.',
            'Related Resources': 'ബന്ധപ്പെട്ട വിവരങ്ങൾ',
            'Paddy Cultivation Methods': 'നെല്ല് കൃഷി രീതികൾ',
            'Organic Pesticides': 'ജൈവ കീടനാശിനികൾ',
            'AI Confidence:': 'AI വിശ്വാസ്യത:',
            "Need human expert's help?": 'മനുഷ്യ വിദഗ്ദ്ധന്റെ സഹായം വേണോ?',
            'Was this answer helpful?': 'ഈ ഉത്തരം സഹായകമായിരുന്നോ?',
            'My Profile': 'എന്റെ പ്രൊഫൈൽ',
            'Recent Queries': 'സമീപകാല ചോദ്യങ്ങൾ',
            'Farm Profile': 'കൃഷി വിവരങ്ങൾ',
            'Advice History': 'ഉപദേശ ചരിത്രം',
            'Personalized Feed': 'വ്യക്തിഗത ഫീഡ്',
            'What to do to prevent blight disease in paddy?': 'നെല്ലിന് ബ്ലൈറ്റ് രോഗം വരാതിരിക്കാൻ എന്തുചെയ്യണം?',
            'How to fertilize coconut trees?': 'തെങ്ങിന് വളപ്രയോഗം എങ്ങനെ?',
            'Farm Name:': 'കൃഷിഭൂമിയുടെ പേര്:',
            'Location:': 'സ്ഥലം:',
            'Main Crop:': 'പ്രധാന വിള:',
            'Farming Practice:': 'കൃഷി രീതി:',
            'Save Profile': 'വിവരങ്ങൾ സംരക്ഷിക്കുക',
            'Solution for blight disease in paddy.': 'നെല്ലിലെ ബ്ലൈറ്റ് രോഗത്തിനുള്ള പരിഹാരം.',
            'Organic fertilization for coconut.': 'തെങ്ങിന് ജൈവ വളപ്രയോഗം.',
            'View': 'കാണുക',
            'Weather Alert:': 'കാലാവസ്ഥാ മുന്നറിയിപ്പ്:',
            'Heavy rainfall expected in the next 24 hours.': 'അടുത്ത 24 മണിക്കൂറിനുള്ളിൽ കനത്ത മഴയ്ക്ക് സാധ്യത.',
            'New Government Scheme:': 'പുതിയ സർക്കാർ പദ്ധതി:',
            'Subsidized seeds for farmers.': 'കർഷകർക്ക് സബ്സിഡി നിരക്കിൽ വിത്തുകൾ.',
            'Crop Tips:': 'വിള നുറുങ്ങുകൾ:',
            'Perform soil testing before paddy cultivation.': 'നെല്ല് നടുന്നതിന് മുമ്പ് മണ്ണ് പരിശോധന നടത്തുക.',
            'Connect with Experts': 'വിദഗ്ദ്ധരുമായി ബന്ധപ്പെടുക',
            "If the AI's answer to your question is not satisfactory, you can request assistance from a human expert.": 'നിങ്ങളുടെ ചോദ്യത്തിന് AI നൽകിയ ഉത്തരം തൃപ്തികരമല്ലെങ്കിൽ, ഒരു മനുഷ്യ വിദഗ്ദ്ധന്റെ സഹായം തേടാം.',
            'Your Question:': 'നിങ്ങളുടെ ചോദ്യം:',
            'Contact Number/Email:': 'ബന്ധപ്പെടാനുള്ള നമ്പർ/ഇമെയിൽ:',
            'Request Expert Help': 'വിദഗ്ദ്ധ സഹായം അഭ്യർത്ഥിക്കുക',
            'Portal for Agri Officers': 'കൃഷി ഓഫീസർമാർക്കുള്ള പോർട്ടൽ',
            'Experts can log in to view escalated queries.': 'വിദഗ്ദ്ധർക്ക് ലോഗിൻ ചെയ്യാനും ചോദ്യങ്ങൾ കാണാനും കഴിയും.',
            'Expert Login': 'വിദഗ്ദ്ധ ലോഗിൻ',
            'All rights reserved.': 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.',
            'Query': 'ചോദ്യം',
            'Profile': 'പ്രൊഫൈൽ',
            'Expert': 'വിദഗ്ദ്ധൻ',
            'Lang': 'ഭാഷ',
            'Contrast': 'കോൺട്രാസ്റ്റ്',
            'Skip for now': 'ഇപ്പോൾ ഒഴിവാക്കുക',
            'Voice recording...': 'വോയിസ് റെക്കോർഡിംഗ്...', // New translation for voice recording state
            'Sample voice query: How to control blight in paddy?': 'സാമ്പിൾ വോയിസ് ചോദ്യം: നെല്ലിലെ ബ്ലൈറ്റ് എങ്ങനെ നിയന്ത്രിക്കാം?', // New translation for voice query
            'Please enter a query or upload an image.': 'ദയവായി ഒരു ചോദ്യം നൽകുക അല്ലെങ്കിൽ ഒരു ചിത്രം അപ്‌ലോഡ് ചെയ്യുക.', // New translation for validation
            'നിങ്ങളുടെ അഭിപ്രായം രേഖപ്പെടുത്തുക...': 'നിങ്ങളുടെ അഭിപ്രായം രേഖപ്പെടുത്തുക...', // Placeholder for textarea
            'ചരിത്രം തിരയുക...': 'ചരിത്രം തിരയുക...', // Placeholder for search input
            'ഉദാ: പാലക്കാട്': 'ഉദാ: പാലക്കാട്',
            'ഉദാ: നെല്ല്': 'ഉദാ: നെല്ല്',
            'ഉദാ: 2 ഏക്കർ': 'ഉദാ: 2 ഏക്കർ',
            'ഉദാ: മൺസൂൺ': 'ഉദാ: മൺസൂൺ',
            'നിങ്ങളുടെ ചോദ്യം ഇവിടെ വിശദീകരിക്കുക...': 'നിങ്ങളുടെ ചോദ്യം ഇവിടെ വിശദീകരിക്കുക...', // Placeholder for escalation textarea
            'ഉദാ: 9876543210': 'ഉദാ: 9876543210' // Placeholder for contact input
        },
        'en': {
            // English is default, so no need to list all here unless overriding
            'Voice recording...': 'Voice recording...',
            'Sample voice query: How to control blight in paddy?': 'Sample voice query: How to control blight in paddy?',
            'Please enter a query or upload an image.': 'Please enter a query or upload an image.',
            'നിങ്ങളുടെ അഭിപ്രായം രേഖപ്പെടുത്തുക...': 'Enter your comment...',
            'ചരിത്രം തിരയുക...': 'Search history...',
            'ഉദാ: പാലക്കാട്': 'Ex: Palakkad',
            'ഉദാ: നെല്ല്': 'Ex: Paddy',
            'ഉദാ: 2 ഏക്കർ': 'Ex: 2 Acres',
            'ഉദാ: മൺസൂൺ': 'Ex: Monsoon',
            'നിങ്ങളുടെ ചോദ്യം ഇവിടെ വിശദീകരിക്കുക...': 'Explain your question here...',
            'ഉദാ: 9876543210': 'Ex: 9876543210'
        },
        'hi': {
            'Instant answers to your farming questions': 'आपके खेती के सवालों के तुरंत जवाब',
            'A Digital Krishi Officer at your fingertips.': 'आपकी उंगलियों पर एक डिजिटल कृषि अधिकारी।',
            'Ask Your Question': 'अपना प्रश्न पूछें',
            'Our Services': 'हमारी सेवाएँ',
            '24/7 Availability': '24/7 उपलब्धता',
            'Get advice anytime, anywhere.': 'कभी भी, कहीं भी सलाह प्राप्त करें।',
            'Multilingual Support': 'बहुभाषी समर्थन',
            'Access information in your regional language.': 'अपनी क्षेत्रीय भाषा में जानकारी प्राप्त करें।',
            'Expert-Backed Advice': 'विशेषज्ञ-समर्थित सलाह',
            'Information validated by agricultural experts.': 'कृषि विशेषज्ञों द्वारा मान्य जानकारी।',
            'Key Features': 'मुख्य विशेषताएँ',
            'Voice/Text Query': 'वॉयस/टेक्स्ट क्वेरी',
            'Easily ask questions.': 'आसानी से प्रश्न पूछें।',
            'Image Analysis': 'छवि विश्लेषण',
            'Upload images to identify diseases.': 'रोगों की पहचान के लिए छवियाँ अपलोड करें।',
            'Personalized Advice': 'व्यक्तिगत सलाह',
            'Tailored recommendations for your farm.': 'आपके खेत के लिए अनुकूलित सिफारिशें।',
            'Expert Escalation': 'विशेषज्ञ से संपर्क करें',
            'Connect with experts for further assistance.': 'आगे की सहायता के लिए विशेषज्ञों से जुड़ें।',
            'Trust & Partnerships': 'विश्वास और भागीदारी',
            "'This app is a great help for my farming. I get instant answers!'": "'यह ऐप मेरी खेती के लिए बहुत मददगार है। मुझे तुरंत जवाब मिलते हैं!'",
            "'It's very useful for identifying diseases and finding solutions.'": "'यह बीमारियों की पहचान करने और समाधान खोजने के लिए बहुत उपयोगी है।'",
            'Ask Your Question': 'अपना प्रश्न पूछें',
            'Type your farming question here or use voice...': 'अपना खेती का प्रश्न यहाँ टाइप करें या आवाज़ का उपयोग करें...', 
            'Submit Query': 'प्रश्न सबमिट करें',
            'Drag & drop images here or click to upload': 'छवियों को यहाँ खींचें और छोड़ें या अपलोड करने के लिए क्लिक करें',
            'Quick Suggestions:': 'त्वरित सुझाव:',
            'Pest infestation': 'कीट संक्रमण',
            'Fertilization': 'उर्वरक',
            'To increase yield': 'उपज बढ़ाने के लिए',
            'Soil testing': 'मिट्टी परीक्षण',
            'Additional Context (Optional)': 'अतिरिक्त संदर्भ (वैकल्पिक)',
            'Location:': 'स्थान:',
            'Crop Type:': 'फसल का प्रकार:',
            'Farm Size:': 'खेत का आकार:',
            'Season:': 'मौसम:',
            'Answer': 'उत्तर',
            'Analyzing your question...': 'आपके प्रश्न का विश्लेषण किया जा रहा है...', 
            'Answer to your question: Blight is a common disease in paddy. Use fungicide for this. To prevent the disease, purify seeds and plant at proper spacing.': 'आपके प्रश्न का उत्तर: धान में ब्लाइट एक सामान्य बीमारी है। इसके लिए फफूंदनाशक का प्रयोग करें। बीमारी से बचाव के लिए बीजों को शुद्ध करें और उचित दूरी पर लगाएं।',
            'Image of paddy affected by blight disease.': 'ब्लाइट रोग से प्रभावित धान की छवि।',
            'Action Steps': 'कार्यवाही के चरण',
            'Remove affected plants.': 'प्रभावित पौधों को हटा दें।',
            'Apply recommended fungicide.': 'अनुशंसित फफूंदनाशक लगाएं।',
            'Monitor at regular intervals.': 'नियमित अंतराल पर निगरानी करें।',
            'Related Resources': 'संबंधित संसाधन',
            'Paddy Cultivation Methods': 'धान की खेती के तरीके',
            'Organic Pesticides': 'जैविक कीटनाशक',
            'AI Confidence:': 'एआई आत्मविश्वास:',
            "Need human expert's help?": 'मानव विशेषज्ञ की मदद चाहिए?',
            'Was this answer helpful?': 'क्या यह उत्तर सहायक था?',
            'My Profile': 'मेरी प्रोफाइल',
            'Recent Queries': 'हाल के प्रश्न',
            'Farm Profile': 'खेत की प्रोफाइल',
            'Advice History': 'सलाह का इतिहास',
            'Personalized Feed': 'व्यक्तिगत फ़ीड',
            'What to do to prevent blight disease in paddy?': 'धान में ब्लाइट रोग से बचाव के लिए क्या करें?',
            'How to fertilize coconut trees?': 'नारियल के पेड़ों को खाद कैसे दें?',
            'Farm Name:': 'खेत का नाम:',
            'Location:': 'स्थान:',
            'Main Crop:': 'मुख्य फसल:',
            'Farming Practice:': 'खेती का तरीका:',
            'Save Profile': 'प्रोफाइल सहेजें',
            'Solution for blight disease in paddy.': 'धान में ब्लाइट रोग का समाधान।',
            'Organic fertilization for coconut.': 'नारियल के लिए जैविक उर्वरक।',
            'View': 'देखें',
            'Weather Alert:': 'मौसम अलर्ट:',
            'Heavy rainfall expected in the next 24 hours.': 'अगले 24 घंटों में भारी बारिश की संभावना है।',
            'New Government Scheme:': 'नई सरकारी योजना:',
            'Subsidized seeds for farmers.': 'किसानों के लिए रियायती बीज।',
            'Crop Tips:': 'फसल के सुझाव:',
            'Perform soil testing before paddy cultivation.': 'धान की खेती से पहले मिट्टी परीक्षण करें।',
            'Connect with Experts': 'विशेषज्ञों से जुड़ें',
            "If the AI's answer to your question is not satisfactory, you can request assistance from a human expert.": 'यदि एआई का आपके प्रश्न का उत्तर संतोषजनक नहीं है, तो आप एक मानव विशेषज्ञ से सहायता का अनुरोध कर सकते हैं।',
            'Your Question:': 'आपका प्रश्न:',
            'Contact Number/Email:': 'संपर्क नंबर/ईमेल:',
            'Request Expert Help': 'विशेषज्ञ सहायता का अनुरोध करें',
            'Portal for Agri Officers': 'कृषि अधिकारियों के लिए पोर्टल',
            'Experts can log in to view escalated queries.': 'विशेषज्ञ एस्केलेटेड प्रश्नों को देखने के लिए लॉग इन कर सकते हैं।',
            'Expert Login': 'विशेषज्ञ लॉगिन',
            'All rights reserved.': 'सर्वाधिकार सुरक्षित।',
            'Query': 'प्रश्न',
            'Profile': 'प्रोफाइल',
            'Expert': 'विशेषज्ञ',
            'Lang': 'भाषा',
            'Contrast': 'कंट्रास्ट',
            'Skip for now': 'अभी के लिए छोड़ दें',
            'Voice recording...': 'वॉयस रिकॉर्डिंग...',
            'Sample voice query: How to control blight in paddy?': 'नमूना वॉयस क्वेरी: धान में ब्लाइट को कैसे नियंत्रित करें?',
            'Please enter a query or upload an image.': 'कृपया एक प्रश्न दर्ज करें या एक छवि अपलोड करें।',
            'निങ്ങളുടെ അഭിപ്രായം രേഖപ്പെടുത്തുക...': 'अपनी टिप्पणी दर्ज करें...', // Placeholder for textarea
            'ചരിത്രം തിരയുക...': 'इतिहास खोजें...', // Placeholder for search input
            'ഉദാ: പാലക്കാട്': 'उदा: पालक्काड़',
            'ഉദാ: നെല്ല്': 'उदा: धान',
            'ഉദാ: 2 ഏക്കർ': 'उदा: 2 एकड़',
            'ഉദാ: മൺസൂൺ': 'उदा: मानसून',
            'നിങ്ങളുടെ ചോദ്യം ഇവിടെ വിശദീകരിക്കുക...': 'अपना प्रश्न यहाँ विस्तार से बताएं...', // Placeholder for escalation textarea
            'ഉദാ: 9876543210': 'उदा: 9876543210' // Placeholder for contact input
        }
        // Add more languages as needed
    };

    function applyLanguage(lang) {
        document.body.lang = lang;
        document.querySelectorAll('[data-ml], [data-en], [data-hi], [data-ta], [data-te], [data-kn]').forEach(element => {
            const key = element.dataset.en || element.textContent.trim(); // Use data-en as key, fallback to textContent
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            } else if (element.dataset.en) {
                element.textContent = element.dataset.en; // Fallback to English if translation not found
            }
        });

        // Update placeholders
        const placeholders = {
            'query-text-input': translations[lang]['Type your farming question here or use voice...'] || 'Type your farming question here or use voice...',
            'location': translations[lang]['ഉദാ: പാലക്കാട്'] || 'Ex: Palakkad',
            'crop-type': translations[lang]['ഉദാ: നെല്ല്'] || 'Ex: Paddy',
            'farm-size': translations[lang]['ഉദാ: 2 ഏക്കർ'] || 'Ex: 2 Acres',
            'season': translations[lang]['ഉദാ: മൺസൂൺ'] || 'Ex: Monsoon',
            'escalation-query': translations[lang]['നിങ്ങളുടെ ചോദ്യം ഇവിടെ വിശദീകരിക്കുക...'] || 'Explain your question here...',
            'escalation-contact': translations[lang]['ഉദാ: 9876543210'] || 'Ex: 9876543210',
            'search-input': translations[lang]['ചരിത്രം തിരയുക...'] || 'Search history...',
            'feedback-comment': translations[lang]['നിങ്ങളുടെ അഭിപ്രായം രേഖപ്പെടുത്തുക...'] || 'Enter your comment...'
        };

        for (const id in placeholders) {
            const el = document.getElementById(id);
            if (el) {
                el.placeholder = placeholders[id];
            }
        }
    }

    function showLanguageModal() {
        langModal.classList.remove('hidden');
        appContainer.classList.add('hidden');
    }

    function hideLanguageModal() {
        langModal.classList.add('hidden');
        appContainer.classList.remove('hidden');
    }

    if (!currentLang || !localStorage.getItem('krishi_lang_chosen')) {
        showLanguageModal();
    } else {
        applyLanguage(currentLang);
        hideLanguageModal();
    }

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentLang = button.dataset.lang;
            localStorage.setItem('krishi_lang', currentLang);
            localStorage.setItem('krishi_lang_chosen', 'true');
            applyLanguage(currentLang);
            hideLanguageModal();
            console.log("--current ## --langauge clicked--->", currentLang)
        });
    });

    skipLangBtn.addEventListener('click', () => {
        localStorage.setItem('krishi_lang_chosen', 'true'); // Mark as chosen to not show again
        applyLanguage(currentLang); // Apply default or stored lang
        hideLanguageModal();
    });

    langToggleBtn.addEventListener('click', () => {
        showLanguageModal();
    });

    // --- High Contrast Mode --- //
    function applyHighContrast(enable) {
        if (enable) {
            document.body.classList.add('high-contrast');
            localStorage.setItem('krishi_high_contrast', 'true');
        } else {
            document.body.classList.remove('high-contrast');
            localStorage.setItem('krishi_high_contrast', 'false');
        }
    }

    if (highContrastMode) {
        applyHighContrast(true);
    }

    contrastToggleBtn.addEventListener('click', () => {
        highContrastMode = !highContrastMode;
        applyHighContrast(highContrastMode);
    });

    // --- Navigation --- //
    function navigateTo(pageId) {
        appPages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');

        navButtons.forEach(btn => btn.classList.remove('active'));
        const targetBtn = document.querySelector(`.main-nav .nav-btn[data-target="${pageId}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        // Hide response display when navigating away from query interface
        if (pageId !== 'query-interface') {
            responseDisplay.classList.add('hidden');
        }
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;
            if (target) {
                navigateTo(target);
            }
        });
    });

    askQuestionBtn.addEventListener('click', () => {
        navigateTo('query-interface');
        // Scroll to the query input section if on mobile
        if (window.innerWidth <= 768) {
            document.getElementById('query-text-input').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // --- Query Interface Logic --- //

    // Voice Recording Simulation
    let isRecording = false;
    voiceRecordBtn.addEventListener('click', () => {
        isRecording = !isRecording;
        if (isRecording) {
            voiceRecordBtn.classList.add('active');
            voiceRecordBtn.querySelector('i').classList.replace('fa-microphone', 'fa-stop-circle');
            voiceWaveform.classList.remove('hidden');
            queryTextInput.placeholder = translations[currentLang]['Voice recording...'] || 'Voice recording...';
            // Simulate voice transcription
            setTimeout(() => {
                queryTextInput.value = translations[currentLang]['Sample voice query: How to control blight in paddy?'] || 'Sample voice query: How to control blight in paddy?';
                voiceWaveform.classList.add('hidden');
                voiceRecordBtn.classList.remove('active');
                voiceRecordBtn.querySelector('i').classList.replace('fa-stop-circle', 'fa-microphone');
                isRecording = false;
            }, 3000);
        } else {
            voiceRecordBtn.classList.remove('active');
            voiceRecordBtn.querySelector('i').classList.replace('fa-stop-circle', 'fa-microphone');
            voiceWaveform.classList.add('hidden');
            queryTextInput.placeholder = translations[currentLang]['Type your farming question here or use voice...'] || 'Type your farming question here or use voice...';
        }
    });

    // Image Upload
    function handleImageUpload(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreviewImg.src = e.target.result;
                imagePreview.classList.remove('hidden');
                dragDropArea.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    }

    imageUploadInput.addEventListener('change', (event) => {
        handleImageUpload(event.target.files[0]);
    });

    removeImageBtn.addEventListener('click', () => {
        imagePreview.classList.add('hidden');
        imagePreviewImg.src = '';
        imageUploadInput.value = ''; // Clear file input
        dragDropArea.classList.remove('hidden');
    });

    // Drag and Drop
    dragDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropArea.style.borderColor = 'var(--color-medium-green)';
    });

    dragDropArea.addEventListener('dragleave', () => {
        dragDropArea.style.borderColor = 'var(--color-border)';
    });

    dragDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropArea.style.borderColor = 'var(--color-border)';
        handleImageUpload(e.dataTransfer.files[0]);
    });

    dragDropArea.addEventListener('click', () => {
        imageUploadInput.click();
    });

    // Quick Suggestions
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            queryTextInput.value = chip.textContent.trim();
            // Optionally submit immediately or highlight input
        });
    });

    // Simulate Query Submission
    submitQueryBtn.addEventListener('click', () => {
        const query = queryTextInput.value.trim();
        const image = imagePreviewImg.src;
        const location = document.getElementById('location').value;
        const cropType = document.getElementById('crop-type').value;

        if (!query && !image) {
            alert(translations[currentLang]['Please enter a query or upload an image.'] || 'Please enter a query or upload an image.');
            return;
        }

        // Show loading indicator
        aiResponseContent.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        responseDisplay.classList.remove('hidden');
        navigateTo('query-interface'); // Ensure we are on the query page

        // Simulate API call
        setTimeout(() => {
            loadingIndicator.classList.add('hidden');
            aiResponseContent.classList.remove('hidden');
            // In a real app, populate aiResponseContent with actual data
            // For now, it's pre-filled static content.
            // You would update confidence, advice, etc. here.
            document.querySelector('.confidence-level').style.width = '85%'; // Example update
            document.querySelector('.confidence-value').textContent = '85%';
            applyLanguage(currentLang); // Re-apply language to ensure response content is translated
        }, 3000);
    });

    // --- Response Display Logic --- //

    // Feedback System
    feedbackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            feedbackBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            feedbackComment.classList.remove('hidden');
            // In a real app, send feedback to backend
            console.log(`Feedback: ${btn.dataset.type}, Comment: ${feedbackComment.value}`);
        });
    });

    escalateBtn.addEventListener('click', () => {
        navigateTo('expert-escalation');
        // Pre-fill escalation form with current query if available
        document.getElementById('escalation-query').value = queryTextInput.value;
    });

    // --- User Profile/History Tabs --- //
    profileTabBtns.forEach(button => {
        button.addEventListener('click', () => {
            profileTabBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            profileTabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Initial navigation to landing page
    navigateTo('landing-page');
});
