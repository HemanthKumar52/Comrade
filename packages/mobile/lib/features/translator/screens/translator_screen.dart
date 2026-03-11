import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

class TranslatorScreen extends ConsumerStatefulWidget {
  const TranslatorScreen({super.key});

  @override
  ConsumerState<TranslatorScreen> createState() => _TranslatorScreenState();
}

class _TranslatorScreenState extends ConsumerState<TranslatorScreen> {
  final _inputController = TextEditingController();
  String _sourceLanguage = 'English';
  String _targetLanguage = 'Hindi';
  String _translatedText = '';
  bool _isTranslating = false;

  final _languages = [
    'English',
    'Hindi',
    'Spanish',
    'French',
    'German',
    'Japanese',
    'Korean',
    'Mandarin',
    'Arabic',
    'Portuguese',
    'Tamil',
    'Telugu',
    'Bengali',
    'Marathi',
    'Kannada',
  ];

  @override
  void dispose() {
    _inputController.dispose();
    super.dispose();
  }

  void _swapLanguages() {
    setState(() {
      final temp = _sourceLanguage;
      _sourceLanguage = _targetLanguage;
      _targetLanguage = temp;
      if (_translatedText.isNotEmpty) {
        _inputController.text = _translatedText;
        _translatedText = '';
      }
    });
  }

  Future<void> _translate() async {
    if (_inputController.text.isEmpty) return;

    setState(() => _isTranslating = true);

    // Simulated translation delay
    await Future.delayed(const Duration(seconds: 1));

    setState(() {
      _translatedText =
          '[Translation of "${_inputController.text}" from $_sourceLanguage to $_targetLanguage]';
      _isTranslating = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Translator'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () {},
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Language Selector Row
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: _LanguageButton(
                      language: _sourceLanguage,
                      languages: _languages,
                      onChanged: (lang) =>
                          setState(() => _sourceLanguage = lang),
                    ),
                  ),
                  IconButton(
                    onPressed: _swapLanguages,
                    icon: const Icon(Icons.swap_horiz_rounded),
                    color: AppColors.accent,
                  ),
                  Expanded(
                    child: _LanguageButton(
                      language: _targetLanguage,
                      languages: _languages,
                      onChanged: (lang) =>
                          setState(() => _targetLanguage = lang),
                      alignment: Alignment.centerRight,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Input Area
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _sourceLanguage,
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Expanded(
                      child: TextField(
                        controller: _inputController,
                        maxLines: null,
                        decoration: const InputDecoration(
                          hintText: 'Enter text to translate...',
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                        ),
                        style: const TextStyle(fontSize: 18),
                      ),
                    ),
                    Row(
                      children: [
                        IconButton(
                          onPressed: () {},
                          icon: const Icon(Icons.mic, size: 22),
                          color: AppColors.primary,
                        ),
                        IconButton(
                          onPressed: () {},
                          icon: const Icon(Icons.camera_alt, size: 22),
                          color: AppColors.primary,
                        ),
                        const Spacer(),
                        if (_inputController.text.isNotEmpty)
                          IconButton(
                            onPressed: () {
                              _inputController.clear();
                              setState(() => _translatedText = '');
                            },
                            icon: const Icon(Icons.close, size: 22),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Translate Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: _isTranslating ? null : _translate,
                icon: _isTranslating
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.translate),
                label: Text(_isTranslating ? 'Translating...' : 'Translate'),
              ),
            ),
            const SizedBox(height: 12),

            // Result Area
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.04),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _targetLanguage,
                      style: TextStyle(
                        color: AppColors.primary,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Expanded(
                      child: _translatedText.isEmpty
                          ? Center(
                              child: Text(
                                'Translation will appear here',
                                style:
                                    TextStyle(color: AppColors.textTertiary),
                              ),
                            )
                          : SingleChildScrollView(
                              child: Text(
                                _translatedText,
                                style: const TextStyle(fontSize: 18),
                              ),
                            ),
                    ),
                    if (_translatedText.isNotEmpty)
                      Row(
                        children: [
                          IconButton(
                            onPressed: () {},
                            icon: const Icon(Icons.volume_up, size: 22),
                            color: AppColors.primary,
                          ),
                          IconButton(
                            onPressed: () {},
                            icon: const Icon(Icons.copy, size: 22),
                            color: AppColors.primary,
                          ),
                          IconButton(
                            onPressed: () {},
                            icon: const Icon(Icons.share, size: 22),
                            color: AppColors.primary,
                          ),
                        ],
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LanguageButton extends StatelessWidget {
  final String language;
  final List<String> languages;
  final ValueChanged<String> onChanged;
  final Alignment alignment;

  const _LanguageButton({
    required this.language,
    required this.languages,
    required this.onChanged,
    this.alignment = Alignment.centerLeft,
  });

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<String>(
      onSelected: onChanged,
      itemBuilder: (context) => languages
          .map((lang) => PopupMenuItem(
                value: lang,
                child: Text(lang),
              ))
          .toList(),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              language,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
            const SizedBox(width: 4),
            const Icon(Icons.arrow_drop_down, size: 18),
          ],
        ),
      ),
    );
  }
}
