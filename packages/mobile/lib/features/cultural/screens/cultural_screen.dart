import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

class CulturalScreen extends ConsumerStatefulWidget {
  const CulturalScreen({super.key});

  @override
  ConsumerState<CulturalScreen> createState() => _CulturalScreenState();
}

class _CulturalScreenState extends ConsumerState<CulturalScreen> {
  String _selectedCountry = 'India';

  final _countries = ['India', 'Japan', 'Thailand', 'France', 'Italy', 'Morocco'];

  final _cultureData = {
    'India': {
      'greeting': 'Namaste (hands folded)',
      'customs': [
        {'title': 'Remove Shoes', 'desc': 'Remove shoes before entering homes and temples', 'icon': Icons.do_not_step},
        {'title': 'Right Hand', 'desc': 'Use right hand for eating and greeting', 'icon': Icons.back_hand},
        {'title': 'Head Gesture', 'desc': 'Head wobble means acknowledgment, not always yes/no', 'icon': Icons.face},
        {'title': 'Temple Etiquette', 'desc': 'Dress modestly, cover shoulders and knees', 'icon': Icons.temple_hindu},
      ],
      'dosDonts': {
        'dos': [
          'Greet with Namaste',
          'Bargain at street markets',
          'Try local street food',
          'Dress modestly at religious sites',
        ],
        'donts': [
          "Don't point feet at people or deities",
          "Don't display public affection",
          "Don't use left hand for eating",
          "Don't touch someone's head",
        ],
      },
      'phrases': [
        {'phrase': 'Namaste', 'meaning': 'Hello/Goodbye'},
        {'phrase': 'Dhanyavaad', 'meaning': 'Thank you'},
        {'phrase': 'Haan / Nahi', 'meaning': 'Yes / No'},
        {'phrase': 'Kitna?', 'meaning': 'How much?'},
        {'phrase': 'Madat kijiye', 'meaning': 'Please help'},
      ],
    },
  };

  @override
  Widget build(BuildContext context) {
    final data = _cultureData[_selectedCountry];
    final customs = (data?['customs'] as List<Map<String, dynamic>>?) ?? [];
    final dosDonts = data?['dosDonts'] as Map<String, dynamic>?;
    final phrases = (data?['phrases'] as List<Map<String, dynamic>>?) ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Cultural Guide'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Country Selector
            SizedBox(
              height: 44,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _countries.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final country = _countries[index];
                  final isSelected = _selectedCountry == country;
                  return ChoiceChip(
                    selected: isSelected,
                    onSelected: (_) =>
                        setState(() => _selectedCountry = country),
                    label: Text(country),
                    selectedColor: AppColors.primary.withValues(alpha: 0.12),
                    labelStyle: TextStyle(
                      color:
                          isSelected ? AppColors.primary : AppColors.textSecondary,
                      fontWeight:
                          isSelected ? FontWeight.w600 : FontWeight.w400,
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 20),

            // Greeting
            if (data != null) ...[
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppColors.badgeCulture, AppColors.primary],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.waving_hand, color: AppColors.white, size: 32),
                      const SizedBox(height: 8),
                      const Text(
                        'Common Greeting',
                        style: TextStyle(
                          color: AppColors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        data['greeting'] as String,
                        style: const TextStyle(
                          color: AppColors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Cultural Customs
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  'Cultural Customs',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                ),
              ),
              const SizedBox(height: 12),
              ...customs.map((custom) => Card(
                    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    child: ListTile(
                      leading: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppColors.badgeCulture.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(
                          custom['icon'] as IconData,
                          color: AppColors.badgeCulture,
                          size: 22,
                        ),
                      ),
                      title: Text(
                        custom['title'] as String,
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                      subtitle: Text(
                        custom['desc'] as String,
                        style: const TextStyle(fontSize: 12),
                      ),
                    ),
                  )),
              const SizedBox(height: 24),

              // Dos and Don'ts
              if (dosDonts != null) ...[
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    "Do's & Don'ts",
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                ),
                const SizedBox(height: 12),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Dos
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppColors.success.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: AppColors.success.withValues(alpha: 0.3),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Row(
                                children: [
                                  Icon(Icons.check_circle,
                                      color: AppColors.success, size: 18),
                                  SizedBox(width: 6),
                                  Text(
                                    'Do',
                                    style: TextStyle(
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.success,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              ...(dosDonts['dos'] as List<String>).map(
                                (item) => Padding(
                                  padding: const EdgeInsets.only(bottom: 4),
                                  child: Text(
                                    '  $item',
                                    style: const TextStyle(fontSize: 12, height: 1.4),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      // Don'ts
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppColors.error.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: AppColors.error.withValues(alpha: 0.3),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Row(
                                children: [
                                  Icon(Icons.cancel,
                                      color: AppColors.error, size: 18),
                                  SizedBox(width: 6),
                                  Text(
                                    "Don't",
                                    style: TextStyle(
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.error,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              ...(dosDonts['donts'] as List<String>).map(
                                (item) => Padding(
                                  padding: const EdgeInsets.only(bottom: 4),
                                  child: Text(
                                    '  $item',
                                    style: const TextStyle(fontSize: 12, height: 1.4),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
              ],

              // Useful Phrases
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  'Useful Phrases',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                ),
              ),
              const SizedBox(height: 12),
              ...phrases.map((phrase) => Card(
                    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    child: ListTile(
                      title: Text(
                        phrase['phrase'] as String,
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                        ),
                      ),
                      subtitle: Text(phrase['meaning'] as String),
                      trailing: IconButton(
                        icon: const Icon(Icons.volume_up, size: 20),
                        color: AppColors.accent,
                        onPressed: () {},
                      ),
                    ),
                  )),
            ] else
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(48),
                  child: Column(
                    children: [
                      Icon(Icons.public, size: 64, color: AppColors.textTertiary),
                      const SizedBox(height: 16),
                      Text(
                        'Cultural guide for $_selectedCountry coming soon!',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
