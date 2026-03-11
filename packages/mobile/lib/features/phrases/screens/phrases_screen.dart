import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../translator/widgets/phrase_card.dart';

class PhrasesScreen extends StatefulWidget {
  const PhrasesScreen({super.key});

  @override
  State<PhrasesScreen> createState() => _PhrasesScreenState();
}

class _PhrasesScreenState extends State<PhrasesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedLanguage = 'Thai';
  String _searchQuery = '';
  final Set<String> _favorites = {};

  final List<String> _languages = [
    'Thai',
    'Japanese',
    'Vietnamese',
    'Korean',
    'Mandarin',
    'Cantonese',
    'Hindi',
    'Arabic',
    'Spanish',
    'French',
    'Italian',
    'Portuguese',
    'German',
    'Dutch',
    'Russian',
    'Turkish',
    'Greek',
    'Indonesian',
    'Malay',
    'Tagalog',
    'Swahili',
    'Amharic',
    'Hebrew',
    'Persian',
    'Polish',
    'Czech',
    'Romanian',
    'Hungarian',
    'Swedish',
    'Norwegian',
  ];

  final List<String> _categories = [
    'Greetings',
    'Directions',
    'Food & Drink',
    'Shopping',
    'Emergency',
    'Transport',
    'Accommodation',
    'Numbers',
    'Time',
    'Weather',
    'Health',
    'Compliments',
  ];

  final Map<String, List<Map<String, String>>> _phrases = {
    'Greetings': [
      {
        'original': 'Hello',
        'translation': '\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35\u0E04\u0E23\u0E31\u0E1A',
        'transliteration': 'sa-wat-dee krap/ka',
        'pronunciation': 'sah-waht-DEE krahp/kah',
      },
      {
        'original': 'Thank you',
        'translation': '\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E04\u0E23\u0E31\u0E1A',
        'transliteration': 'khop khun krap/ka',
        'pronunciation': 'kohp-KOON krahp/kah',
      },
      {
        'original': 'Sorry / Excuse me',
        'translation': '\u0E02\u0E2D\u0E42\u0E17\u0E29\u0E04\u0E23\u0E31\u0E1A',
        'transliteration': 'khor thot krap/ka',
        'pronunciation': 'kor-TOHT krahp/kah',
      },
      {
        'original': 'How are you?',
        'translation': '\u0E2A\u0E1A\u0E32\u0E22\u0E14\u0E35\u0E44\u0E2B\u0E21',
        'transliteration': 'sa-bai dee mai',
        'pronunciation': 'sah-BYE dee MY',
      },
      {
        'original': 'Goodbye',
        'translation': '\u0E25\u0E32\u0E01\u0E48\u0E2D\u0E19\u0E04\u0E23\u0E31\u0E1A',
        'transliteration': 'la gon krap/ka',
        'pronunciation': 'lah-GORN krahp/kah',
      },
    ],
    'Directions': [
      {
        'original': 'Where is...?',
        'translation': '...\u0E2D\u0E22\u0E39\u0E48\u0E17\u0E35\u0E48\u0E44\u0E2B\u0E19',
        'transliteration': '...yoo tee nai',
        'pronunciation': 'yoo tee NYE',
      },
      {
        'original': 'Turn left',
        'translation': '\u0E40\u0E25\u0E35\u0E49\u0E22\u0E27\u0E0B\u0E49\u0E32\u0E22',
        'transliteration': 'liew sai',
        'pronunciation': 'lee-oh SYE',
      },
      {
        'original': 'Turn right',
        'translation': '\u0E40\u0E25\u0E35\u0E49\u0E22\u0E27\u0E02\u0E27\u0E32',
        'transliteration': 'liew kwaa',
        'pronunciation': 'lee-oh KWAH',
      },
      {
        'original': 'Go straight',
        'translation': '\u0E15\u0E23\u0E07\u0E44\u0E1B',
        'transliteration': 'trong pai',
        'pronunciation': 'TRONG bye',
      },
    ],
    'Food & Drink': [
      {
        'original': 'Delicious!',
        'translation': '\u0E2D\u0E23\u0E48\u0E2D\u0E22',
        'transliteration': 'a-roi',
        'pronunciation': 'ah-ROY',
      },
      {
        'original': 'Not spicy please',
        'translation': '\u0E44\u0E21\u0E48\u0E40\u0E1C\u0E47\u0E14\u0E04\u0E23\u0E31\u0E1A',
        'transliteration': 'mai phet krap/ka',
        'pronunciation': 'MY pet krahp/kah',
      },
      {
        'original': 'Water please',
        'translation': '\u0E02\u0E2D\u0E19\u0E49\u0E33\u0E04\u0E23\u0E31\u0E1A',
        'transliteration': 'khor nam krap/ka',
        'pronunciation': 'kor NAHM krahp/kah',
      },
      {
        'original': 'The bill please',
        'translation': '\u0E40\u0E01\u0E47\u0E1A\u0E40\u0E07\u0E34\u0E19\u0E04\u0E23\u0E31\u0E1A',
        'transliteration': 'gep ngen krap/ka',
        'pronunciation': 'GEP ngern krahp/kah',
      },
    ],
    'Shopping': [
      {
        'original': 'How much?',
        'translation': '\u0E23\u0E32\u0E04\u0E32\u0E40\u0E17\u0E48\u0E32\u0E44\u0E23',
        'transliteration': 'ra-ka tao rai',
        'pronunciation': 'rah-KAH tao RYE',
      },
      {
        'original': 'Too expensive',
        'translation': '\u0E41\u0E1E\u0E07\u0E44\u0E1B',
        'transliteration': 'paeng pai',
        'pronunciation': 'PAIRNG bye',
      },
      {
        'original': 'Can you lower the price?',
        'translation': '\u0E25\u0E14\u0E44\u0E14\u0E49\u0E44\u0E2B\u0E21',
        'transliteration': 'lot dai mai',
        'pronunciation': 'LOHT dye MY',
      },
    ],
    'Emergency': [
      {
        'original': 'Help!',
        'translation': '\u0E0A\u0E48\u0E27\u0E22\u0E14\u0E49\u0E27\u0E22',
        'transliteration': 'chuay duay',
        'pronunciation': 'CHOO-ay DOO-ay',
      },
      {
        'original': 'Call the police',
        'translation': '\u0E40\u0E23\u0E35\u0E22\u0E01\u0E15\u0E33\u0E23\u0E27\u0E08',
        'transliteration': 'riak tam-ruat',
        'pronunciation': 'REE-ak tahm-ROO-at',
      },
      {
        'original': 'I need a doctor',
        'translation': '\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E2B\u0E21\u0E2D',
        'transliteration': 'tong karn mor',
        'pronunciation': 'DTONG gahn MOR',
      },
    ],
  };

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _categories.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Phrasebook'),
        actions: [
          TextButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.download_rounded, size: 18),
            label: const Text('Offline'),
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(110),
          child: Column(
            children: [
              // Language Selector
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: theme.scaffoldBackgroundColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedLanguage,
                      isExpanded: true,
                      icon: const Icon(Icons.keyboard_arrow_down_rounded),
                      items: _languages
                          .map((l) =>
                              DropdownMenuItem(value: l, child: Text(l)))
                          .toList(),
                      onChanged: (v) => setState(
                          () => _selectedLanguage = v ?? _selectedLanguage),
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: theme.colorScheme.onSurface,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              // Category Tabs
              TabBar(
                controller: _tabController,
                isScrollable: true,
                labelColor: AppColors.accent,
                unselectedLabelColor: AppColors.textSecondary,
                indicatorColor: AppColors.accent,
                indicatorSize: TabBarIndicatorSize.label,
                tabAlignment: TabAlignment.start,
                labelStyle: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
                tabs: _categories
                    .map((c) => Tab(text: c))
                    .toList(),
              ),
            ],
          ),
        ),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              onChanged: (v) => setState(() => _searchQuery = v),
              decoration: InputDecoration(
                hintText: 'Search phrases...',
                prefixIcon: const Icon(Icons.search_rounded, size: 20),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear_rounded, size: 18),
                        onPressed: () => setState(() => _searchQuery = ''),
                      )
                    : null,
              ),
            ),
          ),

          // Phrase List
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: _categories.map((category) {
                final phrases = _phrases[category] ?? [];
                final filtered = _searchQuery.isEmpty
                    ? phrases
                    : phrases
                        .where((p) =>
                            p['original']!
                                .toLowerCase()
                                .contains(_searchQuery.toLowerCase()) ||
                            p['translation']!
                                .contains(_searchQuery) ||
                            p['transliteration']!
                                .toLowerCase()
                                .contains(_searchQuery.toLowerCase()))
                        .toList();

                if (filtered.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.translate_rounded,
                          size: 48,
                          color: AppColors.textTertiary,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          _searchQuery.isNotEmpty
                              ? 'No matching phrases'
                              : 'Coming soon',
                          style: TextStyle(
                            fontSize: 16,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final phrase = filtered[index];
                    final key =
                        '$category-${phrase['original']}';
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: PhraseCard(
                        originalText: phrase['original']!,
                        translation: phrase['translation']!,
                        transliteration:
                            phrase['transliteration']!,
                        pronunciation:
                            phrase['pronunciation'] ?? '',
                        isFavorite: _favorites.contains(key),
                        onFavoriteToggle: () {
                          setState(() {
                            if (_favorites.contains(key)) {
                              _favorites.remove(key);
                            } else {
                              _favorites.add(key);
                            }
                          });
                        },
                        onPlay: () {},
                        onCopy: () {
                          ScaffoldMessenger.of(context)
                              .showSnackBar(
                            SnackBar(
                              content: Text(
                                  'Copied: ${phrase['transliteration']}'),
                              duration:
                                  const Duration(seconds: 1),
                            ),
                          );
                        },
                      ),
                    );
                  },
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
