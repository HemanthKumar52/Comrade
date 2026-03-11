import { Injectable, NotFoundException } from '@nestjs/common';

interface Phrase {
  original: string;
  translation: string;
  transliteration: string;
  pronunciation: string;
}

type Category = 'greetings' | 'directions' | 'food' | 'emergency' | 'transport';

interface LanguageData {
  nativeName: string;
  phrases: Record<Category, Phrase[]>;
}

const COUNTRY_LANGUAGE_MAP: Record<string, string> = {
  IN: 'hindi',
  JP: 'japanese',
  FR: 'french',
  ES: 'spanish',
  DE: 'german',
  TH: 'thai',
  AE: 'arabic',
  SA: 'arabic',
  EG: 'arabic',
  KR: 'korean',
  CN: 'mandarin',
  TW: 'mandarin',
  MX: 'spanish',
  AR: 'spanish',
  CO: 'spanish',
  PE: 'spanish',
  CL: 'spanish',
  BR: 'spanish',
  AT: 'german',
  CH: 'german',
  LK: 'tamil',
};

const PHRASES: Record<string, LanguageData> = {
  hindi: {
    nativeName: 'हिन्दी',
    phrases: {
      greetings: [
        { original: 'नमस्ते', translation: 'Hello', transliteration: 'Namaste', pronunciation: 'nah-mah-STAY' },
        { original: 'धन्यवाद', translation: 'Thank you', transliteration: 'Dhanyavaad', pronunciation: 'dhun-yah-VAHD' },
        { original: 'हाँ', translation: 'Yes', transliteration: 'Haan', pronunciation: 'hahn' },
        { original: 'नहीं', translation: 'No', transliteration: 'Nahi', pronunciation: 'nah-HEE' },
        { original: 'कितना?', translation: 'How much?', transliteration: 'Kitna?', pronunciation: 'kit-NAH' },
      ],
      directions: [
        { original: 'बाएँ', translation: 'Left', transliteration: 'Baayein', pronunciation: 'BAH-yein' },
        { original: 'दाएँ', translation: 'Right', transliteration: 'Daayein', pronunciation: 'DAH-yein' },
        { original: 'सीधा', translation: 'Straight', transliteration: 'Seedha', pronunciation: 'SEE-dha' },
        { original: 'कहाँ है?', translation: 'Where is?', transliteration: 'Kahaan hai?', pronunciation: 'kah-HAHN hai' },
        { original: 'रुकिए', translation: 'Stop', transliteration: 'Rukiye', pronunciation: 'roo-KEY-yeh' },
      ],
      food: [
        { original: 'पानी', translation: 'Water', transliteration: 'Paani', pronunciation: 'PAH-nee' },
        { original: 'खाना', translation: 'Food', transliteration: 'Khaana', pronunciation: 'KHAH-nah' },
        { original: 'मसालेदार', translation: 'Spicy', transliteration: 'Masaledar', pronunciation: 'mah-SAH-leh-dar' },
        { original: 'बिल दीजिए', translation: 'Bill please', transliteration: 'Bill dijiye', pronunciation: 'bill DEE-jee-yeh' },
        { original: 'शाकाहारी', translation: 'Vegetarian', transliteration: 'Shakahari', pronunciation: 'shah-kah-HAH-ree' },
      ],
      emergency: [
        { original: 'मदद!', translation: 'Help!', transliteration: 'Madad!', pronunciation: 'mah-DAHD' },
        { original: 'पुलिस', translation: 'Police', transliteration: 'Police', pronunciation: 'poh-LEES' },
        { original: 'अस्पताल', translation: 'Hospital', transliteration: 'Aspataal', pronunciation: 'us-pah-TAHL' },
        { original: 'मुझे डॉक्टर चाहिए', translation: 'I need a doctor', transliteration: 'Mujhe doctor chahiye', pronunciation: 'MOO-jhey DOC-ter CHAH-hee-yeh' },
        { original: 'आग!', translation: 'Fire!', transliteration: 'Aag!', pronunciation: 'ahg' },
      ],
      transport: [
        { original: 'टैक्सी', translation: 'Taxi', transliteration: 'Taxi', pronunciation: 'TAXI' },
        { original: 'रेलगाड़ी स्टेशन', translation: 'Train station', transliteration: 'Railgaadi station', pronunciation: 'rail-GAH-dee STAY-shun' },
        { original: 'हवाई अड्डा', translation: 'Airport', transliteration: 'Havaai adda', pronunciation: 'hah-VAH-ee UDD-ah' },
        { original: 'मीटर चालू करो', translation: 'Start the meter', transliteration: 'Meter chaalu karo', pronunciation: 'MEE-ter CHAH-loo KAH-roh' },
        { original: 'यहाँ रुको', translation: 'Stop here', transliteration: 'Yahaan ruko', pronunciation: 'yah-HAHN ROO-koh' },
      ],
    },
  },
  tamil: {
    nativeName: 'தமிழ்',
    phrases: {
      greetings: [
        { original: 'வணக்கம்', translation: 'Hello', transliteration: 'Vanakkam', pronunciation: 'vah-NAHK-kahm' },
        { original: 'நன்றி', translation: 'Thank you', transliteration: 'Nandri', pronunciation: 'NAHN-dree' },
        { original: 'ஆம்', translation: 'Yes', transliteration: 'Aam', pronunciation: 'ahm' },
        { original: 'இல்லை', translation: 'No', transliteration: 'Illai', pronunciation: 'ILL-lai' },
        { original: 'எவ்வளவு?', translation: 'How much?', transliteration: 'Evvalavu?', pronunciation: 'ev-vah-LAH-voo' },
      ],
      directions: [
        { original: 'இடது', translation: 'Left', transliteration: 'Idathu', pronunciation: 'ee-DAH-thoo' },
        { original: 'வலது', translation: 'Right', transliteration: 'Valathu', pronunciation: 'vah-LAH-thoo' },
        { original: 'நேராக', translation: 'Straight', transliteration: 'Neraaga', pronunciation: 'neh-RAH-gah' },
        { original: 'எங்கே?', translation: 'Where?', transliteration: 'Engey?', pronunciation: 'en-GEH' },
        { original: 'நிறுத்துங்கள்', translation: 'Stop', transliteration: 'Niruthungal', pronunciation: 'nee-ROO-thun-gahl' },
      ],
      food: [
        { original: 'தண்ணீர்', translation: 'Water', transliteration: 'Thanneer', pronunciation: 'thahn-NEER' },
        { original: 'சாப்பாடு', translation: 'Food', transliteration: 'Saappaadu', pronunciation: 'SAHP-pah-doo' },
        { original: 'காரமாக', translation: 'Spicy', transliteration: 'Kaaramaaga', pronunciation: 'KAH-rah-mah-gah' },
        { original: 'பில் கொடுங்கள்', translation: 'Bill please', transliteration: 'Bill kodungal', pronunciation: 'bill koh-DOON-gahl' },
        { original: 'சைவம்', translation: 'Vegetarian', transliteration: 'Saivam', pronunciation: 'SAI-vahm' },
      ],
      emergency: [
        { original: 'உதவி!', translation: 'Help!', transliteration: 'Udhavi!', pronunciation: 'oo-DHAH-vee' },
        { original: 'போலீஸ்', translation: 'Police', transliteration: 'Police', pronunciation: 'poh-LEES' },
        { original: 'மருத்துவமனை', translation: 'Hospital', transliteration: 'Maruthuvamanai', pronunciation: 'mah-ROO-thoo-vah-mah-nai' },
        { original: 'டாக்டர் வேணும்', translation: 'I need a doctor', transliteration: 'Doctor venum', pronunciation: 'DOC-ter VEH-noom' },
        { original: 'தீ!', translation: 'Fire!', transliteration: 'Thee!', pronunciation: 'thee' },
      ],
      transport: [
        { original: 'டாக்ஸி', translation: 'Taxi', transliteration: 'Taxi', pronunciation: 'TAXI' },
        { original: 'ரயில் நிலையம்', translation: 'Train station', transliteration: 'Rayil nilaiyam', pronunciation: 'RAH-yil nee-LAI-yahm' },
        { original: 'விமான நிலையம்', translation: 'Airport', transliteration: 'Vimaana nilaiyam', pronunciation: 'vee-MAH-nah nee-LAI-yahm' },
        { original: 'மீட்டர் போடுங்கள்', translation: 'Start the meter', transliteration: 'Meter podungal', pronunciation: 'MEE-ter POH-doon-gahl' },
        { original: 'இங்கே நிறுத்துங்கள்', translation: 'Stop here', transliteration: 'Ingey niruthungal', pronunciation: 'in-GEH nee-ROO-thun-gahl' },
      ],
    },
  },
  japanese: {
    nativeName: '日本語',
    phrases: {
      greetings: [
        { original: 'こんにちは', translation: 'Hello', transliteration: 'Konnichiwa', pronunciation: 'kohn-NEE-chee-wah' },
        { original: 'ありがとうございます', translation: 'Thank you', transliteration: 'Arigatou gozaimasu', pronunciation: 'ah-ree-GAH-toh go-zai-MAHS' },
        { original: 'はい', translation: 'Yes', transliteration: 'Hai', pronunciation: 'hai' },
        { original: 'いいえ', translation: 'No', transliteration: 'Iie', pronunciation: 'ee-EH' },
        { original: 'いくらですか？', translation: 'How much?', transliteration: 'Ikura desu ka?', pronunciation: 'ee-KOO-rah DES-kah' },
      ],
      directions: [
        { original: '左', translation: 'Left', transliteration: 'Hidari', pronunciation: 'hee-DAH-ree' },
        { original: '右', translation: 'Right', transliteration: 'Migi', pronunciation: 'MEE-gee' },
        { original: 'まっすぐ', translation: 'Straight', transliteration: 'Massugu', pronunciation: 'mahs-SOO-goo' },
        { original: 'どこですか？', translation: 'Where is?', transliteration: 'Doko desu ka?', pronunciation: 'DOH-koh DES-kah' },
        { original: '止まってください', translation: 'Please stop', transliteration: 'Tomatte kudasai', pronunciation: 'toh-MAHT-teh koo-dah-SAI' },
      ],
      food: [
        { original: '水', translation: 'Water', transliteration: 'Mizu', pronunciation: 'MEE-zoo' },
        { original: 'メニュー', translation: 'Menu', transliteration: 'Menyuu', pronunciation: 'MEN-yoo' },
        { original: '辛い', translation: 'Spicy', transliteration: 'Karai', pronunciation: 'kah-RAI' },
        { original: 'お会計', translation: 'Bill please', transliteration: 'Okaikei', pronunciation: 'oh-KAI-keh' },
        { original: 'ベジタリアン', translation: 'Vegetarian', transliteration: 'Bejitarian', pronunciation: 'beh-jee-TAH-ree-ahn' },
      ],
      emergency: [
        { original: '助けて！', translation: 'Help!', transliteration: 'Tasukete!', pronunciation: 'tah-SOO-keh-teh' },
        { original: '警察', translation: 'Police', transliteration: 'Keisatsu', pronunciation: 'KAY-saht-soo' },
        { original: '病院', translation: 'Hospital', transliteration: 'Byouin', pronunciation: 'BYOH-een' },
        { original: '医者が必要です', translation: 'I need a doctor', transliteration: 'Isha ga hitsuyou desu', pronunciation: 'ee-SHAH gah hit-SOO-yoh DES' },
        { original: '火事！', translation: 'Fire!', transliteration: 'Kaji!', pronunciation: 'KAH-jee' },
      ],
      transport: [
        { original: 'タクシー', translation: 'Taxi', transliteration: 'Takushii', pronunciation: 'tah-KOO-shee' },
        { original: '駅', translation: 'Train station', transliteration: 'Eki', pronunciation: 'EH-kee' },
        { original: '空港', translation: 'Airport', transliteration: 'Kuukou', pronunciation: 'KOO-koh' },
        { original: 'ここで降ります', translation: 'I get off here', transliteration: 'Koko de orimasu', pronunciation: 'KOH-koh deh oh-ree-MAHS' },
        { original: 'ここで止めてください', translation: 'Stop here please', transliteration: 'Koko de tomete kudasai', pronunciation: 'KOH-koh deh toh-MEH-teh koo-dah-SAI' },
      ],
    },
  },
  french: {
    nativeName: 'Français',
    phrases: {
      greetings: [
        { original: 'Bonjour', translation: 'Hello', transliteration: 'Bonjour', pronunciation: 'bohn-ZHOOR' },
        { original: 'Merci', translation: 'Thank you', transliteration: 'Merci', pronunciation: 'mehr-SEE' },
        { original: 'Oui', translation: 'Yes', transliteration: 'Oui', pronunciation: 'wee' },
        { original: 'Non', translation: 'No', transliteration: 'Non', pronunciation: 'nohn' },
        { original: 'Combien ?', translation: 'How much?', transliteration: 'Combien?', pronunciation: 'kohm-BYEN' },
      ],
      directions: [
        { original: 'À gauche', translation: 'Left', transliteration: 'A gauche', pronunciation: 'ah GOHSH' },
        { original: 'À droite', translation: 'Right', transliteration: 'A droite', pronunciation: 'ah DRWAHT' },
        { original: 'Tout droit', translation: 'Straight', transliteration: 'Tout droit', pronunciation: 'too DRWAH' },
        { original: 'Où est ?', translation: 'Where is?', transliteration: 'Ou est?', pronunciation: 'oo EH' },
        { original: 'Arrêtez', translation: 'Stop', transliteration: 'Arretez', pronunciation: 'ah-REH-tay' },
      ],
      food: [
        { original: 'De l\'eau', translation: 'Water', transliteration: 'De l\'eau', pronunciation: 'deh LOH' },
        { original: 'La carte', translation: 'Menu', transliteration: 'La carte', pronunciation: 'lah KART' },
        { original: 'Épicé', translation: 'Spicy', transliteration: 'Epice', pronunciation: 'ay-pee-SAY' },
        { original: 'L\'addition', translation: 'The bill', transliteration: 'L\'addition', pronunciation: 'lah-dee-SYON' },
        { original: 'Végétarien', translation: 'Vegetarian', transliteration: 'Vegetarien', pronunciation: 'veh-zheh-tah-RYAN' },
      ],
      emergency: [
        { original: 'Au secours !', translation: 'Help!', transliteration: 'Au secours!', pronunciation: 'oh suh-KOOR' },
        { original: 'La police', translation: 'Police', transliteration: 'La police', pronunciation: 'lah poh-LEES' },
        { original: 'L\'hôpital', translation: 'Hospital', transliteration: 'L\'hopital', pronunciation: 'loh-pee-TAHL' },
        { original: 'J\'ai besoin d\'un médecin', translation: 'I need a doctor', transliteration: 'J\'ai besoin d\'un medecin', pronunciation: 'zhay beh-ZWAHN duhn mehd-SAHN' },
        { original: 'Au feu !', translation: 'Fire!', transliteration: 'Au feu!', pronunciation: 'oh FUH' },
      ],
      transport: [
        { original: 'Taxi', translation: 'Taxi', transliteration: 'Taxi', pronunciation: 'tahk-SEE' },
        { original: 'La gare', translation: 'Train station', transliteration: 'La gare', pronunciation: 'lah GAHR' },
        { original: 'L\'aéroport', translation: 'Airport', transliteration: 'L\'aeroport', pronunciation: 'lah-eh-roh-POR' },
        { original: 'Le métro', translation: 'Subway', transliteration: 'Le metro', pronunciation: 'luh MEH-troh' },
        { original: 'Arrêtez ici', translation: 'Stop here', transliteration: 'Arretez ici', pronunciation: 'ah-REH-tay ee-SEE' },
      ],
    },
  },
  spanish: {
    nativeName: 'Español',
    phrases: {
      greetings: [
        { original: 'Hola', translation: 'Hello', transliteration: 'Hola', pronunciation: 'OH-lah' },
        { original: 'Gracias', translation: 'Thank you', transliteration: 'Gracias', pronunciation: 'GRAH-see-ahs' },
        { original: 'Sí', translation: 'Yes', transliteration: 'Si', pronunciation: 'see' },
        { original: 'No', translation: 'No', transliteration: 'No', pronunciation: 'noh' },
        { original: '¿Cuánto?', translation: 'How much?', transliteration: 'Cuanto?', pronunciation: 'KWAHN-toh' },
      ],
      directions: [
        { original: 'Izquierda', translation: 'Left', transliteration: 'Izquierda', pronunciation: 'eez-KYER-dah' },
        { original: 'Derecha', translation: 'Right', transliteration: 'Derecha', pronunciation: 'deh-REH-chah' },
        { original: 'Derecho', translation: 'Straight', transliteration: 'Derecho', pronunciation: 'deh-REH-choh' },
        { original: '¿Dónde está?', translation: 'Where is?', transliteration: 'Donde esta?', pronunciation: 'DOHN-deh es-TAH' },
        { original: 'Pare', translation: 'Stop', transliteration: 'Pare', pronunciation: 'PAH-reh' },
      ],
      food: [
        { original: 'Agua', translation: 'Water', transliteration: 'Agua', pronunciation: 'AH-gwah' },
        { original: 'Menú', translation: 'Menu', transliteration: 'Menu', pronunciation: 'meh-NOO' },
        { original: 'Picante', translation: 'Spicy', transliteration: 'Picante', pronunciation: 'pee-KAHN-teh' },
        { original: 'La cuenta', translation: 'The bill', transliteration: 'La cuenta', pronunciation: 'lah KWEN-tah' },
        { original: 'Vegetariano', translation: 'Vegetarian', transliteration: 'Vegetariano', pronunciation: 'veh-heh-tah-RYAH-noh' },
      ],
      emergency: [
        { original: '¡Ayuda!', translation: 'Help!', transliteration: 'Ayuda!', pronunciation: 'ah-YOO-dah' },
        { original: 'Policía', translation: 'Police', transliteration: 'Policia', pronunciation: 'poh-lee-SEE-ah' },
        { original: 'Hospital', translation: 'Hospital', transliteration: 'Hospital', pronunciation: 'ohs-pee-TAHL' },
        { original: 'Necesito un médico', translation: 'I need a doctor', transliteration: 'Necesito un medico', pronunciation: 'neh-seh-SEE-toh oon MEH-dee-koh' },
        { original: '¡Fuego!', translation: 'Fire!', transliteration: 'Fuego!', pronunciation: 'FWEH-goh' },
      ],
      transport: [
        { original: 'Taxi', translation: 'Taxi', transliteration: 'Taxi', pronunciation: 'TAHK-see' },
        { original: 'Estación de tren', translation: 'Train station', transliteration: 'Estacion de tren', pronunciation: 'es-tah-SYON deh TREN' },
        { original: 'Aeropuerto', translation: 'Airport', transliteration: 'Aeropuerto', pronunciation: 'ah-eh-roh-PWER-toh' },
        { original: 'Autobús', translation: 'Bus', transliteration: 'Autobus', pronunciation: 'ow-toh-BOOS' },
        { original: 'Pare aquí', translation: 'Stop here', transliteration: 'Pare aqui', pronunciation: 'PAH-reh ah-KEE' },
      ],
    },
  },
  german: {
    nativeName: 'Deutsch',
    phrases: {
      greetings: [
        { original: 'Hallo', translation: 'Hello', transliteration: 'Hallo', pronunciation: 'HAH-loh' },
        { original: 'Danke', translation: 'Thank you', transliteration: 'Danke', pronunciation: 'DAHN-keh' },
        { original: 'Ja', translation: 'Yes', transliteration: 'Ja', pronunciation: 'yah' },
        { original: 'Nein', translation: 'No', transliteration: 'Nein', pronunciation: 'nine' },
        { original: 'Wie viel?', translation: 'How much?', transliteration: 'Wie viel?', pronunciation: 'vee FEEL' },
      ],
      directions: [
        { original: 'Links', translation: 'Left', transliteration: 'Links', pronunciation: 'links' },
        { original: 'Rechts', translation: 'Right', transliteration: 'Rechts', pronunciation: 'rekhts' },
        { original: 'Geradeaus', translation: 'Straight', transliteration: 'Geradeaus', pronunciation: 'geh-RAH-deh-ows' },
        { original: 'Wo ist?', translation: 'Where is?', transliteration: 'Wo ist?', pronunciation: 'voh ist' },
        { original: 'Halt', translation: 'Stop', transliteration: 'Halt', pronunciation: 'hahlt' },
      ],
      food: [
        { original: 'Wasser', translation: 'Water', transliteration: 'Wasser', pronunciation: 'VAHS-ser' },
        { original: 'Speisekarte', translation: 'Menu', transliteration: 'Speisekarte', pronunciation: 'SHPY-zeh-kar-teh' },
        { original: 'Scharf', translation: 'Spicy', transliteration: 'Scharf', pronunciation: 'shahrf' },
        { original: 'Die Rechnung', translation: 'The bill', transliteration: 'Die Rechnung', pronunciation: 'dee REKH-noong' },
        { original: 'Vegetarisch', translation: 'Vegetarian', transliteration: 'Vegetarisch', pronunciation: 'veh-geh-TAH-rish' },
      ],
      emergency: [
        { original: 'Hilfe!', translation: 'Help!', transliteration: 'Hilfe!', pronunciation: 'HILL-feh' },
        { original: 'Polizei', translation: 'Police', transliteration: 'Polizei', pronunciation: 'poh-lee-TSAI' },
        { original: 'Krankenhaus', translation: 'Hospital', transliteration: 'Krankenhaus', pronunciation: 'KRAHN-ken-hows' },
        { original: 'Ich brauche einen Arzt', translation: 'I need a doctor', transliteration: 'Ich brauche einen Arzt', pronunciation: 'ikh BROW-kheh AI-nen artst' },
        { original: 'Feuer!', translation: 'Fire!', transliteration: 'Feuer!', pronunciation: 'FOY-er' },
      ],
      transport: [
        { original: 'Taxi', translation: 'Taxi', transliteration: 'Taxi', pronunciation: 'TAHK-see' },
        { original: 'Bahnhof', translation: 'Train station', transliteration: 'Bahnhof', pronunciation: 'BAHN-hohf' },
        { original: 'Flughafen', translation: 'Airport', transliteration: 'Flughafen', pronunciation: 'FLOOG-hah-fen' },
        { original: 'U-Bahn', translation: 'Subway', transliteration: 'U-Bahn', pronunciation: 'OO-bahn' },
        { original: 'Hier halten', translation: 'Stop here', transliteration: 'Hier halten', pronunciation: 'heer HAHL-ten' },
      ],
    },
  },
  thai: {
    nativeName: 'ภาษาไทย',
    phrases: {
      greetings: [
        { original: 'สวัสดี', translation: 'Hello', transliteration: 'Sawasdee', pronunciation: 'sah-waht-DEE' },
        { original: 'ขอบคุณ', translation: 'Thank you', transliteration: 'Khop khun', pronunciation: 'kohp KOON' },
        { original: 'ใช่', translation: 'Yes', transliteration: 'Chai', pronunciation: 'chai' },
        { original: 'ไม่', translation: 'No', transliteration: 'Mai', pronunciation: 'mai' },
        { original: 'เท่าไหร่?', translation: 'How much?', transliteration: 'Thao rai?', pronunciation: 'tao-RAI' },
      ],
      directions: [
        { original: 'ซ้าย', translation: 'Left', transliteration: 'Saai', pronunciation: 'sai' },
        { original: 'ขวา', translation: 'Right', transliteration: 'Kwaa', pronunciation: 'kwah' },
        { original: 'ตรงไป', translation: 'Straight', transliteration: 'Trong pai', pronunciation: 'trong PAI' },
        { original: 'อยู่ที่ไหน?', translation: 'Where is?', transliteration: 'Yuu thi nai?', pronunciation: 'yoo tee NAI' },
        { original: 'หยุด', translation: 'Stop', transliteration: 'Yut', pronunciation: 'yoot' },
      ],
      food: [
        { original: 'น้ำ', translation: 'Water', transliteration: 'Nam', pronunciation: 'nahm' },
        { original: 'อาหาร', translation: 'Food', transliteration: 'Ahaan', pronunciation: 'ah-HAHN' },
        { original: 'เผ็ด', translation: 'Spicy', transliteration: 'Phet', pronunciation: 'pet' },
        { original: 'เช็คบิล', translation: 'Check bill', transliteration: 'Check bin', pronunciation: 'chek BIN' },
        { original: 'มังสวิรัติ', translation: 'Vegetarian', transliteration: 'Mangsawirat', pronunciation: 'mahng-sah-wee-RAHT' },
      ],
      emergency: [
        { original: 'ช่วยด้วย!', translation: 'Help!', transliteration: 'Chuay duay!', pronunciation: 'CHOO-ay DOO-ay' },
        { original: 'ตำรวจ', translation: 'Police', transliteration: 'Tamruat', pronunciation: 'tahm-ROO-aht' },
        { original: 'โรงพยาบาล', translation: 'Hospital', transliteration: 'Rong phayabaan', pronunciation: 'rohng pah-yah-BAHN' },
        { original: 'ต้องการหมอ', translation: 'I need a doctor', transliteration: 'Tong kaan moh', pronunciation: 'tohng kahn MOH' },
        { original: 'ไฟไหม้!', translation: 'Fire!', transliteration: 'Fai mai!', pronunciation: 'fai MAI' },
      ],
      transport: [
        { original: 'แท็กซี่', translation: 'Taxi', transliteration: 'Taxi', pronunciation: 'TAHK-see' },
        { original: 'สถานีรถไฟ', translation: 'Train station', transliteration: 'Sathaanii rot fai', pronunciation: 'sah-TAH-nee roht FAI' },
        { original: 'สนามบิน', translation: 'Airport', transliteration: 'Sanaam bin', pronunciation: 'sah-NAHM BIN' },
        { original: 'เปิดมิเตอร์', translation: 'Turn on meter', transliteration: 'Poet meter', pronunciation: 'poet MEE-ter' },
        { original: 'จอดตรงนี้', translation: 'Stop here', transliteration: 'Jot trong nii', pronunciation: 'joht trong NEE' },
      ],
    },
  },
  arabic: {
    nativeName: 'العربية',
    phrases: {
      greetings: [
        { original: 'مرحبا', translation: 'Hello', transliteration: 'Marhaba', pronunciation: 'MAHR-hah-bah' },
        { original: 'شكرا', translation: 'Thank you', transliteration: 'Shukran', pronunciation: 'SHOOK-rahn' },
        { original: 'نعم', translation: 'Yes', transliteration: 'Na\'am', pronunciation: 'nah-AHM' },
        { original: 'لا', translation: 'No', transliteration: 'La', pronunciation: 'lah' },
        { original: 'بكم؟', translation: 'How much?', transliteration: 'Bikam?', pronunciation: 'bee-KAHM' },
      ],
      directions: [
        { original: 'يسار', translation: 'Left', transliteration: 'Yasar', pronunciation: 'yah-SAHR' },
        { original: 'يمين', translation: 'Right', transliteration: 'Yamiin', pronunciation: 'yah-MEEN' },
        { original: 'مباشرة', translation: 'Straight', transliteration: 'Mubaashara', pronunciation: 'moo-BAH-shah-rah' },
        { original: 'أين؟', translation: 'Where?', transliteration: 'Ayna?', pronunciation: 'AY-nah' },
        { original: 'قف', translation: 'Stop', transliteration: 'Qif', pronunciation: 'kif' },
      ],
      food: [
        { original: 'ماء', translation: 'Water', transliteration: 'Maa\'', pronunciation: 'mah' },
        { original: 'طعام', translation: 'Food', transliteration: 'Ta\'aam', pronunciation: 'tah-AHM' },
        { original: 'حار', translation: 'Spicy', transliteration: 'Haar', pronunciation: 'hahr' },
        { original: 'الحساب', translation: 'The bill', transliteration: 'Al-hisaab', pronunciation: 'al-hee-SAHB' },
        { original: 'نباتي', translation: 'Vegetarian', transliteration: 'Nabaati', pronunciation: 'nah-BAH-tee' },
      ],
      emergency: [
        { original: 'ساعدوني!', translation: 'Help!', transliteration: 'Sa\'iduni!', pronunciation: 'SAH-ee-DOO-nee' },
        { original: 'الشرطة', translation: 'Police', transliteration: 'Ash-shurta', pronunciation: 'ash-SHOOR-tah' },
        { original: 'المستشفى', translation: 'Hospital', transliteration: 'Al-mustashfa', pronunciation: 'al-moos-TASH-fah' },
        { original: 'أحتاج طبيب', translation: 'I need a doctor', transliteration: 'Ahtaaj tabiib', pronunciation: 'ah-TAHJ tah-BEEB' },
        { original: 'حريق!', translation: 'Fire!', transliteration: 'Hariiq!', pronunciation: 'hah-REEK' },
      ],
      transport: [
        { original: 'تاكسي', translation: 'Taxi', transliteration: 'Taksi', pronunciation: 'TAHK-see' },
        { original: 'محطة القطار', translation: 'Train station', transliteration: 'Mahattat al-qitar', pronunciation: 'mah-HAHT-taht al-kee-TAHR' },
        { original: 'المطار', translation: 'Airport', transliteration: 'Al-mataar', pronunciation: 'al-mah-TAHR' },
        { original: 'شغل العداد', translation: 'Start the meter', transliteration: 'Shaghghil al-\'addaad', pronunciation: 'SHAH-ghil al-ah-DAHD' },
        { original: 'هنا', translation: 'Stop here', transliteration: 'Huna', pronunciation: 'HOO-nah' },
      ],
    },
  },
  korean: {
    nativeName: '한국어',
    phrases: {
      greetings: [
        { original: '안녕하세요', translation: 'Hello', transliteration: 'Annyeonghaseyo', pronunciation: 'ahn-nyeong-hah-SEH-yoh' },
        { original: '감사합니다', translation: 'Thank you', transliteration: 'Gamsahamnida', pronunciation: 'kahm-sah-HAHM-nee-dah' },
        { original: '네', translation: 'Yes', transliteration: 'Ne', pronunciation: 'neh' },
        { original: '아니요', translation: 'No', transliteration: 'Aniyo', pronunciation: 'ah-NEE-yoh' },
        { original: '얼마예요?', translation: 'How much?', transliteration: 'Eolmayeyo?', pronunciation: 'uhl-MAH-yeh-yoh' },
      ],
      directions: [
        { original: '왼쪽', translation: 'Left', transliteration: 'Oenjjok', pronunciation: 'wehn-JOHK' },
        { original: '오른쪽', translation: 'Right', transliteration: 'Oreunjjok', pronunciation: 'oh-REUN-johk' },
        { original: '직진', translation: 'Straight', transliteration: 'Jikjin', pronunciation: 'jeek-JEEN' },
        { original: '어디예요?', translation: 'Where is?', transliteration: 'Eodiyeyo?', pronunciation: 'uh-DEE-yeh-yoh' },
        { original: '세워주세요', translation: 'Please stop', transliteration: 'Sewojuseyo', pronunciation: 'seh-WUH-joo-seh-yoh' },
      ],
      food: [
        { original: '물', translation: 'Water', transliteration: 'Mul', pronunciation: 'mool' },
        { original: '메뉴', translation: 'Menu', transliteration: 'Menyu', pronunciation: 'MEN-yoo' },
        { original: '매운', translation: 'Spicy', transliteration: 'Maeun', pronunciation: 'MAE-oon' },
        { original: '계산서', translation: 'The bill', transliteration: 'Gyesanseo', pronunciation: 'gyeh-SAHN-suh' },
        { original: '채식', translation: 'Vegetarian', transliteration: 'Chaesik', pronunciation: 'CHAE-shik' },
      ],
      emergency: [
        { original: '도와주세요!', translation: 'Help!', transliteration: 'Dowajuseyo!', pronunciation: 'doh-WAH-joo-seh-yoh' },
        { original: '경찰', translation: 'Police', transliteration: 'Gyeongchal', pronunciation: 'gyeong-CHAHL' },
        { original: '병원', translation: 'Hospital', transliteration: 'Byeongwon', pronunciation: 'byeong-WOHN' },
        { original: '의사가 필요해요', translation: 'I need a doctor', transliteration: 'Uisaga piryohaeyo', pronunciation: 'wee-SAH-gah pee-RYOH-hae-yoh' },
        { original: '불이야!', translation: 'Fire!', transliteration: 'Buriya!', pronunciation: 'BOO-ree-yah' },
      ],
      transport: [
        { original: '택시', translation: 'Taxi', transliteration: 'Taeksi', pronunciation: 'TAEK-shee' },
        { original: '기차역', translation: 'Train station', transliteration: 'Gichayeok', pronunciation: 'gee-CHAH-yuhk' },
        { original: '공항', translation: 'Airport', transliteration: 'Gonghang', pronunciation: 'gohng-HAHNG' },
        { original: '지하철', translation: 'Subway', transliteration: 'Jihacheol', pronunciation: 'jee-HAH-chuhl' },
        { original: '여기서 세워주세요', translation: 'Stop here please', transliteration: 'Yeogiseo sewojuseyo', pronunciation: 'yuh-GEE-suh seh-WUH-joo-seh-yoh' },
      ],
    },
  },
  mandarin: {
    nativeName: '中文',
    phrases: {
      greetings: [
        { original: '你好', translation: 'Hello', transliteration: 'Ni hao', pronunciation: 'nee HOW' },
        { original: '谢谢', translation: 'Thank you', transliteration: 'Xie xie', pronunciation: 'syeh-SYEH' },
        { original: '是', translation: 'Yes', transliteration: 'Shi', pronunciation: 'shih' },
        { original: '不是', translation: 'No', transliteration: 'Bu shi', pronunciation: 'boo SHIH' },
        { original: '多少钱？', translation: 'How much?', transliteration: 'Duo shao qian?', pronunciation: 'dwoh shaow CHYEN' },
      ],
      directions: [
        { original: '左', translation: 'Left', transliteration: 'Zuo', pronunciation: 'zwoh' },
        { original: '右', translation: 'Right', transliteration: 'You', pronunciation: 'yoh' },
        { original: '直走', translation: 'Straight', transliteration: 'Zhi zou', pronunciation: 'jih DZOH' },
        { original: '在哪里？', translation: 'Where is?', transliteration: 'Zai na li?', pronunciation: 'dzai NAH lee' },
        { original: '停', translation: 'Stop', transliteration: 'Ting', pronunciation: 'ting' },
      ],
      food: [
        { original: '水', translation: 'Water', transliteration: 'Shui', pronunciation: 'shway' },
        { original: '菜单', translation: 'Menu', transliteration: 'Cai dan', pronunciation: 'tsai DAHN' },
        { original: '辣', translation: 'Spicy', transliteration: 'La', pronunciation: 'lah' },
        { original: '买单', translation: 'The bill', transliteration: 'Mai dan', pronunciation: 'mai DAHN' },
        { original: '素食', translation: 'Vegetarian', transliteration: 'Su shi', pronunciation: 'soo SHIH' },
      ],
      emergency: [
        { original: '救命！', translation: 'Help!', transliteration: 'Jiu ming!', pronunciation: 'jyoh MING' },
        { original: '警察', translation: 'Police', transliteration: 'Jing cha', pronunciation: 'jing CHAH' },
        { original: '医院', translation: 'Hospital', transliteration: 'Yi yuan', pronunciation: 'ee YWEN' },
        { original: '我需要医生', translation: 'I need a doctor', transliteration: 'Wo xu yao yi sheng', pronunciation: 'woh syoo yaow ee SHUHNG' },
        { original: '着火了！', translation: 'Fire!', transliteration: 'Zhao huo le!', pronunciation: 'jaow hwoh LAH' },
      ],
      transport: [
        { original: '出租车', translation: 'Taxi', transliteration: 'Chu zu che', pronunciation: 'choo dzoo CHUH' },
        { original: '火车站', translation: 'Train station', transliteration: 'Huo che zhan', pronunciation: 'hwoh chuh JAHN' },
        { original: '机场', translation: 'Airport', transliteration: 'Ji chang', pronunciation: 'jee CHAHNG' },
        { original: '地铁', translation: 'Subway', transliteration: 'Di tie', pronunciation: 'dee TYEH' },
        { original: '这里停', translation: 'Stop here', transliteration: 'Zhe li ting', pronunciation: 'juh lee TING' },
      ],
    },
  },
};

@Injectable()
export class TravelPhrasesService {
  getLanguages() {
    return {
      languages: Object.entries(PHRASES).map(([key, data]) => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        nativeName: data.nativeName,
        categories: Object.keys(data.phrases),
        totalPhrases: Object.values(data.phrases).reduce(
          (sum, cat) => sum + cat.length,
          0,
        ),
      })),
    };
  }

  getAllPhrases(language: string) {
    const data = PHRASES[language];
    if (!data) {
      throw new NotFoundException(
        `Phrases not found for language: ${language}. Available: ${Object.keys(PHRASES).join(', ')}`,
      );
    }
    return {
      language,
      nativeName: data.nativeName,
      categories: data.phrases,
    };
  }

  getPhrasesByCategory(language: string, category: string) {
    const data = PHRASES[language];
    if (!data) {
      throw new NotFoundException(
        `Phrases not found for language: ${language}. Available: ${Object.keys(PHRASES).join(', ')}`,
      );
    }
    const phrases = data.phrases[category as Category];
    if (!phrases) {
      throw new NotFoundException(
        `Category "${category}" not found. Available: ${Object.keys(data.phrases).join(', ')}`,
      );
    }
    return {
      language,
      nativeName: data.nativeName,
      category,
      phrases,
    };
  }

  getEssentialPhrases(countryCode: string) {
    const language = COUNTRY_LANGUAGE_MAP[countryCode];
    if (!language) {
      throw new NotFoundException(
        `No language mapping found for country: ${countryCode}. Supported countries: ${Object.keys(COUNTRY_LANGUAGE_MAP).join(', ')}`,
      );
    }
    const data = PHRASES[language];
    if (!data) {
      throw new NotFoundException(`Phrases not available for language: ${language}`);
    }

    // Return the top 3 phrases from each category as essential
    const essential: Record<string, Phrase[]> = {};
    for (const [cat, phrases] of Object.entries(data.phrases)) {
      essential[cat] = phrases.slice(0, 3);
    }

    return {
      country: countryCode,
      language,
      nativeName: data.nativeName,
      essential,
    };
  }
}
