import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

class CurrencyScreen extends ConsumerStatefulWidget {
  const CurrencyScreen({super.key});

  @override
  ConsumerState<CurrencyScreen> createState() => _CurrencyScreenState();
}

class _CurrencyScreenState extends ConsumerState<CurrencyScreen> {
  final _amountController = TextEditingController(text: '1000');
  String _fromCurrency = 'INR';
  String _toCurrency = 'USD';
  double _result = 11.96;

  final _currencies = [
    {'code': 'INR', 'name': 'Indian Rupee', 'symbol': '\u20B9', 'flag': '\u{1F1EE}\u{1F1F3}'},
    {'code': 'USD', 'name': 'US Dollar', 'symbol': '\$', 'flag': '\u{1F1FA}\u{1F1F8}'},
    {'code': 'EUR', 'name': 'Euro', 'symbol': '\u20AC', 'flag': '\u{1F1EA}\u{1F1FA}'},
    {'code': 'GBP', 'name': 'British Pound', 'symbol': '\u00A3', 'flag': '\u{1F1EC}\u{1F1E7}'},
    {'code': 'JPY', 'name': 'Japanese Yen', 'symbol': '\u00A5', 'flag': '\u{1F1EF}\u{1F1F5}'},
    {'code': 'AED', 'name': 'UAE Dirham', 'symbol': 'AED', 'flag': '\u{1F1E6}\u{1F1EA}'},
    {'code': 'THB', 'name': 'Thai Baht', 'symbol': '\u0E3F', 'flag': '\u{1F1F9}\u{1F1ED}'},
    {'code': 'SGD', 'name': 'Singapore Dollar', 'symbol': 'S\$', 'flag': '\u{1F1F8}\u{1F1EC}'},
  ];

  // Simplified exchange rates relative to INR
  final _ratesFromINR = {
    'INR': 1.0,
    'USD': 0.01196,
    'EUR': 0.01105,
    'GBP': 0.00945,
    'JPY': 1.7920,
    'AED': 0.04395,
    'THB': 0.4152,
    'SGD': 0.01612,
  };

  void _swapCurrencies() {
    setState(() {
      final temp = _fromCurrency;
      _fromCurrency = _toCurrency;
      _toCurrency = temp;
      _convert();
    });
  }

  void _convert() {
    final amount = double.tryParse(_amountController.text) ?? 0;
    final fromRate = _ratesFromINR[_fromCurrency] ?? 1.0;
    final toRate = _ratesFromINR[_toCurrency] ?? 1.0;
    // Convert to INR first, then to target
    final inINR = amount / fromRate;
    setState(() {
      _result = inINR * toRate;
    });
  }

  Map<String, dynamic> _getCurrency(String code) {
    return _currencies.firstWhere((c) => c['code'] == code);
  }

  @override
  void initState() {
    super.initState();
    _amountController.addListener(_convert);
  }

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final fromCurrency = _getCurrency(_fromCurrency);
    final toCurrency = _getCurrency(_toCurrency);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Currency Converter'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // From Currency
            _CurrencyCard(
              label: 'From',
              currency: fromCurrency,
              currencies: _currencies,
              onCurrencyChanged: (code) {
                setState(() {
                  _fromCurrency = code;
                  _convert();
                });
              },
              child: TextField(
                controller: _amountController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
                decoration: InputDecoration(
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  prefixText: '${fromCurrency['symbol']} ',
                  prefixStyle: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Swap Button
            Center(
              child: Container(
                decoration: BoxDecoration(
                  color: AppColors.accent,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.accent.withValues(alpha: 0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: IconButton(
                  onPressed: _swapCurrencies,
                  icon: const Icon(Icons.swap_vert_rounded, color: AppColors.white),
                ),
              ),
            ),
            const SizedBox(height: 8),

            // To Currency
            _CurrencyCard(
              label: 'To',
              currency: toCurrency,
              currencies: _currencies,
              onCurrencyChanged: (code) {
                setState(() {
                  _toCurrency = code;
                  _convert();
                });
              },
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: Text(
                  '${toCurrency['symbol']} ${_result.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w800,
                    color: AppColors.accent,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Exchange Rate Info
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.info.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: AppColors.info, size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Exchange Rate',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          ),
                        ),
                        Text(
                          '1 $_fromCurrency = ${((_ratesFromINR[_toCurrency] ?? 1) / (_ratesFromINR[_fromCurrency] ?? 1)).toStringAsFixed(4)} $_toCurrency',
                          style: TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Quick Amounts
            Text(
              'Quick Convert',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: ['100', '500', '1000', '5000', '10000'].map((amount) {
                return ActionChip(
                  label: Text('${fromCurrency['symbol']}$amount'),
                  onPressed: () {
                    _amountController.text = amount;
                  },
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}

class _CurrencyCard extends StatelessWidget {
  final String label;
  final Map<String, dynamic> currency;
  final List<Map<String, dynamic>> currencies;
  final ValueChanged<String> onCurrencyChanged;
  final Widget child;

  const _CurrencyCard({
    required this.label,
    required this.currency,
    required this.currencies,
    required this.onCurrencyChanged,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
              PopupMenuButton<String>(
                onSelected: onCurrencyChanged,
                itemBuilder: (context) => currencies
                    .map((c) => PopupMenuItem(
                          value: c['code'] as String,
                          child: Row(
                            children: [
                              Text(c['flag'] as String, style: const TextStyle(fontSize: 18)),
                              const SizedBox(width: 8),
                              Text('${c['code']} - ${c['name']}'),
                            ],
                          ),
                        ))
                    .toList(),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceVariant,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Text(
                        currency['flag'] as String,
                        style: const TextStyle(fontSize: 16),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        currency['code'] as String,
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(width: 4),
                      const Icon(Icons.arrow_drop_down, size: 18),
                    ],
                  ),
                ),
              ),
            ],
          ),
          child,
        ],
      ),
    );
  }
}
