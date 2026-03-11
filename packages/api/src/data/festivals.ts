export interface FestivalData {
  name: string;
  country: string;
  month: number; // 1-12
  approximateDate?: string; // e.g., "March 25-26" or "varies"
  type: 'religious' | 'cultural' | 'national' | 'seasonal' | 'music' | 'food';
  description: string;
  tips?: string;
}

export const FESTIVALS: FestivalData[] = [
  // India
  { name: 'Holi', country: 'IN', month: 3, approximateDate: 'March (full moon)', type: 'religious', description: 'Festival of Colors. People throw colored powder and water at each other.', tips: 'Wear old white clothes. Protect electronics.' },
  { name: 'Diwali', country: 'IN', month: 10, approximateDate: 'October/November', type: 'religious', description: 'Festival of Lights. Fireworks, lamps, sweets, and celebrations.', tips: 'Book hotels early. Expect firecrackers.' },
  { name: 'Navratri/Durga Puja', country: 'IN', month: 10, approximateDate: 'September/October', type: 'religious', description: 'Nine nights of dance, music, and worship across India.', tips: 'Kolkata celebrations are world-famous.' },
  { name: 'Republic Day', country: 'IN', month: 1, approximateDate: 'January 26', type: 'national', description: 'Grand military parade in New Delhi celebrating the Constitution.', tips: 'Tickets needed for parade. Book months ahead.' },
  { name: 'Ganesh Chaturthi', country: 'IN', month: 9, approximateDate: 'August/September', type: 'religious', description: 'Festival honoring Lord Ganesha. Huge processions in Mumbai.', tips: 'Traffic disruptions during immersion processions.' },
  { name: 'Pushkar Camel Fair', country: 'IN', month: 11, approximateDate: 'November', type: 'cultural', description: 'One of the largest camel fairs in the world in Rajasthan.', tips: 'Book accommodation well in advance.' },

  // Japan
  { name: 'Cherry Blossom Season', country: 'JP', month: 4, approximateDate: 'Late March - Mid April', type: 'seasonal', description: 'Hanami (flower viewing) season. Parks filled with cherry blossoms.', tips: 'Peak season varies. Book months ahead.' },
  { name: 'Gion Matsuri', country: 'JP', month: 7, approximateDate: 'July', type: 'cultural', description: 'Kyoto iconic month-long festival with grand float processions.', tips: 'July 17 and 24 are the main parade days.' },
  { name: 'Tanabata', country: 'JP', month: 7, approximateDate: 'July 7', type: 'cultural', description: 'Star Festival. Colorful decorations and wishes written on paper.', tips: 'Sendai Tanabata (August 6-8) is the largest.' },
  { name: 'Obon', country: 'JP', month: 8, approximateDate: 'August 13-16', type: 'religious', description: 'Buddhist festival honoring ancestors. Bon dance festivals.', tips: 'Many Japanese travel during this period. Book early.' },

  // Thailand
  { name: 'Songkran', country: 'TH', month: 4, approximateDate: 'April 13-15', type: 'cultural', description: 'Thai New Year water festival. Massive water fights nationwide.', tips: 'Waterproof your phone. Wear quick-dry clothes.' },
  { name: 'Loy Krathong', country: 'TH', month: 11, approximateDate: 'November (full moon)', type: 'cultural', description: 'Festival of Lights. Floating lanterns and krathongs on water.', tips: 'Chiang Mai Yi Peng lantern festival is spectacular.' },
  { name: 'Phi Ta Khon', country: 'TH', month: 6, approximateDate: 'June/July', type: 'cultural', description: 'Ghost Festival in Dan Sai. Colorful masks and parades.', tips: 'Remote location but worth the trip.' },

  // Spain
  { name: 'La Tomatina', country: 'ES', month: 8, approximateDate: 'Last Wednesday of August', type: 'food', description: 'World largest tomato fight in Bunol, Valencia.', tips: 'Tickets required. Wear old clothes and goggles.' },
  { name: 'San Fermin (Running of the Bulls)', country: 'ES', month: 7, approximateDate: 'July 6-14', type: 'cultural', description: 'Famous bull-running festival in Pamplona.', tips: 'Dangerous event. Wear white with red scarf.' },
  { name: 'Las Fallas', country: 'ES', month: 3, approximateDate: 'March 15-19', type: 'cultural', description: 'Massive papier-mache figures burned in Valencia.', tips: 'Incredibly loud. Book far in advance.' },

  // Brazil
  { name: 'Carnival', country: 'BR', month: 2, approximateDate: 'February/March (before Lent)', type: 'cultural', description: 'World largest carnival in Rio de Janeiro. Samba parades and parties.', tips: 'Book 6+ months ahead. Watch for pickpockets.' },
  { name: 'Festa Junina', country: 'BR', month: 6, approximateDate: 'June', type: 'cultural', description: 'Harvest festival with bonfires, dance, and traditional food.', tips: 'Celebrated throughout the country.' },

  // USA
  { name: 'Mardi Gras', country: 'US', month: 2, approximateDate: 'February/March', type: 'cultural', description: 'New Orleans famous celebration before Lent. Parades and parties.', tips: 'French Quarter gets extremely crowded.' },
  { name: 'Fourth of July', country: 'US', month: 7, approximateDate: 'July 4', type: 'national', description: 'Independence Day celebrations. Fireworks nationwide.', tips: 'Major fireworks in NYC, DC, and most cities.' },
  { name: 'Thanksgiving', country: 'US', month: 11, approximateDate: 'Fourth Thursday of November', type: 'national', description: 'National holiday with family feasts. Black Friday follows.', tips: 'Many businesses closed. Great shopping deals on Black Friday.' },
  { name: 'Burning Man', country: 'US', month: 8, approximateDate: 'Late August - Early September', type: 'cultural', description: 'Art and self-expression festival in Black Rock Desert, Nevada.', tips: 'Bring everything you need. Extreme desert conditions.' },

  // Germany
  { name: 'Oktoberfest', country: 'DE', month: 9, approximateDate: 'Late September - Early October', type: 'cultural', description: 'World largest beer festival in Munich. Two weeks of celebration.', tips: 'Book tents and hotels months ahead. Wear Lederhosen/Dirndl.' },
  { name: 'Christmas Markets', country: 'DE', month: 12, approximateDate: 'Late November - December 23', type: 'seasonal', description: 'Traditional Christmas markets across Germany. Nuremberg and Dresden are famous.', tips: 'Bring cash. Try Gluhwein and Lebkuchen.' },

  // China
  { name: 'Chinese New Year', country: 'CN', month: 1, approximateDate: 'January/February', type: 'cultural', description: 'Spring Festival. Largest annual human migration.', tips: 'Avoid traveling during this period - extreme crowding.' },
  { name: 'Mid-Autumn Festival', country: 'CN', month: 9, approximateDate: 'September/October', type: 'cultural', description: 'Moon cakes and lanterns. Family reunion holiday.', tips: 'Try different varieties of moon cakes.' },
  { name: 'Dragon Boat Festival', country: 'CN', month: 6, approximateDate: 'June', type: 'cultural', description: 'Dragon boat races and zongzi (rice dumplings).', tips: 'Watch races along rivers in major cities.' },

  // South Korea
  { name: 'Chuseok', country: 'KR', month: 9, approximateDate: 'September/October', type: 'cultural', description: 'Korean Thanksgiving. Three-day harvest celebration.', tips: 'Many businesses closed. Book transport early.' },
  { name: 'Boryeong Mud Festival', country: 'KR', month: 7, approximateDate: 'July', type: 'cultural', description: 'Fun mud-based activities at Boryeong beach.', tips: 'Bring change of clothes. Popular with expats.' },

  // UK
  { name: 'Notting Hill Carnival', country: 'GB', month: 8, approximateDate: 'Last weekend of August', type: 'cultural', description: 'Europe largest street festival in London. Caribbean culture.', tips: 'Use public transport. Extremely crowded.' },
  { name: 'Edinburgh Fringe Festival', country: 'GB', month: 8, approximateDate: 'August', type: 'cultural', description: 'World largest arts festival with thousands of performances.', tips: 'Book accommodation early. Many free shows.' },
  { name: 'Guy Fawkes Night', country: 'GB', month: 11, approximateDate: 'November 5', type: 'cultural', description: 'Bonfire Night with fireworks across the UK.', tips: 'Wrap up warm. Free displays in many parks.' },

  // France
  { name: 'Bastille Day', country: 'FR', month: 7, approximateDate: 'July 14', type: 'national', description: 'French National Day. Military parade on Champs-Elysees and fireworks.', tips: 'Eiffel Tower fireworks are spectacular.' },
  { name: 'Cannes Film Festival', country: 'FR', month: 5, approximateDate: 'May', type: 'cultural', description: 'World most prestigious film festival.', tips: 'Public screenings at Cinema de la Plage are free.' },

  // Mexico
  { name: 'Dia de los Muertos', country: 'MX', month: 11, approximateDate: 'November 1-2', type: 'cultural', description: 'Day of the Dead. Colorful celebration honoring deceased loved ones.', tips: 'Oaxaca and Mexico City have the best celebrations.' },
  { name: 'Guelaguetza', country: 'MX', month: 7, approximateDate: 'Last two Mondays of July', type: 'cultural', description: 'Indigenous cultural festival in Oaxaca with traditional dances.', tips: 'Free viewing areas available early morning.' },

  // Turkey
  { name: 'Whirling Dervishes Festival', country: 'TR', month: 12, approximateDate: 'December 7-17', type: 'cultural', description: 'Sufi ceremony in Konya commemorating Rumi.', tips: 'Tickets sell out fast. Respectful dress required.' },

  // Egypt
  { name: 'Abu Simbel Sun Festival', country: 'EG', month: 2, approximateDate: 'February 22 & October 22', type: 'cultural', description: 'Sun illuminates the inner sanctum of Abu Simbel temple.', tips: 'Arrive before dawn for the best experience.' },

  // Nepal
  { name: 'Dashain', country: 'NP', month: 10, approximateDate: 'September/October', type: 'religious', description: 'Nepal biggest festival. 15 days of celebration and family reunions.', tips: 'Many businesses close. Beautiful kite-flying traditions.' },
  { name: 'Tihar', country: 'NP', month: 11, approximateDate: 'October/November', type: 'religious', description: 'Festival of Lights similar to Diwali. Dogs, crows, and cows honored.', tips: 'Beautiful light displays. Try sel roti (rice donuts).' },

  // UAE
  { name: 'Dubai Shopping Festival', country: 'AE', month: 1, approximateDate: 'January-February', type: 'cultural', description: 'Month-long shopping extravaganza with massive discounts.', tips: 'Raffle draws for luxury cars. Best deals mid-festival.' },
  { name: 'Abu Dhabi Grand Prix', country: 'AE', month: 11, approximateDate: 'November', type: 'cultural', description: 'Formula 1 race at Yas Marina Circuit with concerts.', tips: 'Book early for race weekend. Concert tickets included.' },

  // Australia
  { name: 'Sydney New Year', country: 'AU', month: 1, approximateDate: 'December 31 - January 1', type: 'cultural', description: 'Iconic Sydney Harbour Bridge fireworks display.', tips: 'Claim your spot early (some wait from morning).' },
  { name: 'Melbourne Cup', country: 'AU', month: 11, approximateDate: 'First Tuesday of November', type: 'cultural', description: 'The race that stops a nation. Horse racing and fashion.', tips: 'It is a public holiday in Melbourne.' },

  // Singapore
  { name: 'Singapore Grand Prix', country: 'SG', month: 9, approximateDate: 'September/October', type: 'cultural', description: 'Night race through the streets of Marina Bay.', tips: 'Great views from rooftop bars near the circuit.' },
  { name: 'Chinese New Year Celebrations', country: 'SG', month: 1, approximateDate: 'January/February', type: 'cultural', description: 'Chinatown lights up with decorations. River Hongbao festival.', tips: 'Chingay Parade is the main highlight.' },
];
